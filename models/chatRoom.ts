import { z } from "zod";
import pool from "./databasePool.js"
import * as userModels from "./user.js"
import { ResultSetHeader } from "mysql2";


function instanceOfSetHeader(object: any): object is ResultSetHeader {
    return "insertId" in object;
}

export async function setUnreadToZero(senderId: number, receiverId: number, room: string) {
    // console.log('setUnreadToZero', senderId, receiverId, room);
    let result
    if (senderId < receiverId) {
        result = await pool.query(
            `UPDATE rooms 
           SET xs_id_unread = 0
           WHERE room_name = ?`,
            [room]
        );
        // console.log('xs_id_unread 0-->', result);
    } else {
        result = await pool.query(
            `UPDATE rooms 
           SET lg_id_unread = 0
           WHERE room_name = ?`,
            [room]
        );
        // console.log('lg_id_unread 0-->', result);
        if (Array.isArray(result) && instanceOfSetHeader(result[0])) {
            return result[0].changedRows;
        }
        throw new Error("setUnreadToZero failed in model");
    }
}




export async function saveMessage(message: string, senderId: number, receiverId: number, room: string) {
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
    // console.log('senderId', senderId, 'receiverId', receiverId);

    if (Number(senderId) < Number(receiverId)) {
        const result = await pool.query(
            `UPDATE rooms 
           SET lg_id_unread = IFNULL(lg_id_unread, 0) + 1 
           WHERE room_name = ?`,
            [room]
        );
        // console.log('lg_id_unread +1');
    } else {
        const [result] = await pool.query(
            `UPDATE rooms 
           SET xs_id_unread = IFNULL(xs_id_unread, 0) + 1 
           WHERE room_name = ?`,
            [room]
        );
        // console.log('xs_id_unread +1');
    }
}


export async function readMessage(room: string) {
    const result = await pool.query(
        `
        UPDATE rooms
        SET sender_id = ? , updated_at = updated_at
        WHERE room_name = ? 
        `, [0, room]
    )
    return result
}


export async function getUserRoom(id: number) {
    const [result] = await pool.query(
        `
        SELECT * FROM users_rooms WHERE user_id = (?)
        `, [id]
    )
    // console.log('getUserRoom->', result);
    return result
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
    time:z.string()
})





export async function getMessagesByRoom(room: string) {
    const [rows] = await pool.query(
    `
    SELECT sender_id , message , 
    CONCAT(IF(TIME_FORMAT(created_at, '%p') = 'AM', '上午', '下午'), TIME_FORMAT(created_at, '%h:%i'))  AS time 
    FROM messages
    WHERE room_name = ${room}
    ORDER BY id
    `
    )

    const data = z.array(MessageSchema).parse(rows)
    return data
}

const ChatListSchema = z.object({
    sender_id: z.number(),
    room_name: z.string(),
    updated_at: z.string(),
    receiverId: z.number(),
    receiverName: z.string().optional(),
    receiverPicture: z.string().optional()
})



export async function getMessageByRoomPagination(room:string,currPage:number){
    const [data] = await pool.query(
        `
        SELECT sender_id , message , 
        CONCAT(IF(TIME_FORMAT(created_at, '%p') = 'AM', '上午', '下午'), TIME_FORMAT(created_at, '%h:%i'))  AS time 
        FROM messages
        WHERE room_name = ?
        ORDER BY id DESC
        limit 15 
        offset ? 
        `,[room, currPage * 15]
    )

    const [next] = await pool.query(
        `
        SELECT sender_id 
        FROM messages
        WHERE room_name = ?
        ORDER BY id DESC
        limit 1 
        offset ?
        `,[room, ((currPage + 1) * 15)]
    )

    const receiverIds = (data as Array<any>).map(item => item.receiverId)

    const receiverProfileData = await userModels.getUserProfileData(receiverIds);

    const newData = (data as Array<any>).forEach(item => {
        const receiverData = (receiverProfileData as Array<any>).filter(profileItem => profileItem.id === item.receiverId)
        if (receiverData.length > 0) {
            item['receiverName'] = receiverData[0].name;
            item['receiverPicture'] = receiverData[0].picture;
        }
        return item
    })
    

    if(Array.isArray(next) && next.length === 0){
        const nextPaging = null;
        console.log({ data , nextPaging });
        return { data , nextPaging }
    }else{
        const nextPaging = currPage + 1;
        console.log({ data , nextPaging });
        return { data , nextPaging }
    }

}

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


    const receiverIds = (rows as Array<any>).map(item => item.receiverId)

    const receiverProfileData = await userModels.getUserProfileData(receiverIds);

    const newData = (rows as Array<any>).forEach(item => {
        const receiverData = (receiverProfileData as Array<any>).filter(profileItem => profileItem.id === item.receiverId)
        item['receiverName'] = receiverData[0].name;
        item['receiverPicture'] = receiverData[0].picture;
        return item
    })

    return rows
}

