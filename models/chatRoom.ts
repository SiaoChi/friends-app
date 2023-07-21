import { number, string, z } from "zod";
import pool from "./databasePool.js"
import * as userModels from "./user.js"
import { ResultSetHeader } from "mysql2";
import { type } from "os";


function instanceOfSetHeader(object: any): object is ResultSetHeader {
    return "insertId" in object;
}

export async function setUnreadToZero(senderId: number, receiverId: number, room: string) {

    const result = await pool.query(
        `
        UPDATE rooms 
        SET ${senderId < receiverId ? "xs_id_unread" : "lg_id_unread"}  = 0
        WHERE room_name = ?
        `, [room]
    )
    if (Array.isArray(result) && instanceOfSetHeader(result[0])) {
        return result[0].changedRows;
    }
    throw new Error("setUnreadToZero failed in model");
}

export async function saveMessage(message: string, senderId: number, receiverId: number, room: string) {
    console.log('save');
    await pool.query(
        `
        INSERT INTO messages ( room_name , message , sender_id )
        VALUES (? ,? ,?)
        `,
        [room, message, senderId]
    )

    await pool.query(
        `
        UPDATE rooms
        SET last_message = ? , sender_id = ?
        WHERE room_name = ${room}
        `,
        [message, senderId]
    )

    const result = await pool.query(
        `
        UPDATE rooms
        SET ${Number(senderId) < Number(receiverId)
            ? "lg_id_unread = IFNULL(lg_id_unread, 0)"
            : "xs_id_unread = IFNULL(xs_id_unread, 0)"} + 1
            WHERE room_name = ?
        `, [room]
    )

}

const UserRoomSchema = z.object({
    user_id: z.number(),
    room_name: z.string(),
})

export async function getUserRoom(id: number) {
    const [result] = await pool.query(
        `
        SELECT * FROM users_rooms WHERE user_id = (?)
        `, [id]
    )
    const userRooms = z.array(UserRoomSchema).parse(result)
    return userRooms
}



export async function checkRoom(senderId: number, receiverId: number, room: string) {
    const [result] = await pool.query(
        `
        SELECT room_name FROM rooms WHERE room_name=${room}
        `
    )
    const roomMembers = [[senderId, room], [receiverId, room]];
    const attendants = `${senderId},${receiverId}`;

    if (!result || (Array.isArray(result) && result.length === 0)) {
        try {
            // create room
            const createRoomQuery = 'INSERT INTO rooms (room_name, attendants) VALUES (?,?)';
            await pool.query(createRoomQuery, [room, attendants]);

            //  users_rooms 
            const createUsersRoomsQuery = 'INSERT INTO users_rooms (user_id, room_name) VALUES ?';
            await pool.query(createUsersRoomsQuery, [roomMembers]);
        } catch (error) {
            console.error('Error occurred while inserting data:', error);
        }
    }

}

const MessageSchema = z.object({
    sender_id: z.number(),
    message: z.string(),
    time: z.string()
})


export async function getMessageByRoomPagination(room: string, currPage: number) {

    const historyMsgNumber = 15

    const [data] = await pool.query(
        `
        SELECT sender_id , message , 
        CONCAT(IF(TIME_FORMAT(created_at, '%p') = 'AM', '上午', '下午'), TIME_FORMAT(created_at, '%h:%i'))  AS time 
        FROM messages
        WHERE room_name = ?
        ORDER BY id DESC
        limit ${historyMsgNumber} 
        offset ? 
        `, [room, currPage * historyMsgNumber]
    )

    const [next] = await pool.query(
        `
        SELECT sender_id 
        FROM messages
        WHERE room_name = ?
        ORDER BY id DESC
        limit 1 
        offset ?
        `, [room, ((currPage + 1) * 15)]
    )

    const messageData = z.array(MessageSchema).parse(data)

    if (Array.isArray(next) && next.length === 0) {
        const nextPaging = null;
        return { data: messageData, nextPaging }
    } else {
        const nextPaging = currPage + 1;
        return { data: messageData, nextPaging }
    }

}

const ChatListSchema = z.object({
    senderId: z.number(),
    receiverId: z.number(),
    room_name: z.string(),
    sender_id: z.number().nullable(),
    last_message: z.string().nullable(),
    updated_at: z.date().nullable(),
    xs_id_unread: z.number().nullable(),
    lg_id_unread: z.number().nullable(),
    receiverName: z.string().optional(),
    receiverPicture: z.string().optional(),
})

type ChatListSchema = z.infer<typeof ChatListSchema>

const ReceiverDataSchema = z.object({
    id: number(),
    name: string(),
    picture: string(),
})

export async function getChatListById(id: number) {

    const [rows] = await pool.query(
        `
        SELECT subQuery.*, urs.user_id as receiverId 
        FROM (
                SELECT urs.user_id as senderId , rs.*
                FROM users_rooms AS urs 
                INNER JOIN rooms AS rs 
                ON urs.room_name = rs.room_name
                WHERE user_id = (?)
            ) AS subQuery
        INNER JOIN users_rooms AS urs ON subQuery.room_name = urs.room_name AND subQuery.senderId <> urs.user_id
        ORDER BY subQuery.updated_at DESC
        `, [id]
    )
    const chatListData = z.array(ChatListSchema).parse(rows)
    return chatListData
}

export async function getChatListInfo(chatListData: ChatListSchema[]) {

    const receiverIds = chatListData.map(item => item.receiverId)
    const receiverProfileData = await userModels.getUserProfileData(receiverIds);
    const checkReceiverData = z.array(ReceiverDataSchema).parse(receiverProfileData)

    chatListData.forEach(item => {
        const receiverData = checkReceiverData.filter(profileItem => profileItem.id === item.receiverId)
        item['receiverName'] = receiverData[0].name;
        item['receiverPicture'] = receiverData[0].picture;
        return item
    })
    return chatListData
}
