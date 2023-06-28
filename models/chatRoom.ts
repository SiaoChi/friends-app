import { string, z } from "zod";
import pool from "./databasePool.js"
import * as userModels from "./user.js"



export async function saveMessage(message: string, senderId: number, room: string) {
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
        [message,senderId]
    )
}


export async function readMessage(room:string){
    const result = await pool.query(
        `
        UPDATE rooms
        SET sender_id = ? , updated_at = updated_at
        WHERE room_name = ? 
        `, [0,room]
    )
    console.log(result);
    return result
}


export async function getUserRoom(id:number){
    const [result] = await pool.query(
        `
        SELECT * FROM users_rooms WHERE user_id = (?)
        `,[id]
    )
    console.log('getUserRoom->',result);
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
    message: z.string()
})



export async function getMessagesByRoom(room: string) {
    const [rows] = await pool.query(
        `
    SELECT sender_id , message FROM messages
    WHERE room_name = ${room}
    ORDER BY created_at
    ` 
    )
    const data = z.array(MessageSchema).parse(rows)
    return data
}

const ChatListSchema = z.object({
    sender_id: z.number(),
    room_name: z.string(),
    updated_at: z.string(),
    receiverId:z.number(),
    receiverName:z.string().optional(),
    receiverPicture:z.string().optional()
})


export async function getChatListById(id: number) {

    /*
     [
   {
    senderId: 1,
     room_name: '117',
     last_message: '111',
     updated_at: 2023-06-27T05:24:35.000Z,
     attendants: '1,17',
     sender_id: 0,
     receiverId: 17,
     receiverName: 'kelly12',
     receiverPicture: '/img/users/5.png'
   },
     */

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

 
    const receiverIds =(rows as Array<any>).map(item => item.receiverId)

    const receiverProfileData = await userModels.getUserProfileData(receiverIds);

    // console.log('receiverProfileData->',receiverProfileData);

    const newData = (rows as Array<any>).forEach(item =>{
        const receiverData = (receiverProfileData as Array<any>).filter(profileItem => profileItem.id === item.receiverId)
        item['receiverName'] = receiverData[0].name;
        item['receiverPicture'] = receiverData[0].picture;
        return item
    })

    return rows 
}

