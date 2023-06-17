import { z } from "zod";
import pool from "./databasePool.js"



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
        SET last_message = ?
        WHERE room_name = ${room}
        `,
        [message]
    )
}


export async function checkRoom(senderId: number, receiverId: number, room: string) {
    const [result] = await pool.query(
        `
        SELECT room_name FROM rooms WHERE room_name=${room}
        `
    )

    const roomMembers = [[senderId, room], [receiverId, room]]

    if (!result || (Array.isArray(result) && result.length === 0)) {
        // room isn't existed , create one
        await pool.query(
            `INSERT INTO rooms (room_name)
             VALUE (?) `, [room]
        )
        // create relations users_rooms 
        await pool.query(
            `
            INSERT INTO users_rooms (user_id, room_name) 
            VALUES ? `, [roomMembers]
        )
    }
}

const MessageSchema = z.object({
    sender_id:z.number(),
    message:z.string()
})

export async function getMessagesByRoom(room: string) {
    const [rows] = await pool.query(
    `
    SELECT sender_id , message FROM messages
    WHERE room_name = ${room}
    ORDER BY created_at DESC
    `
    )

    const data = z.array(MessageSchema).parse(rows)
    /*const reduceData = data.reduce((acc:any ,item:any)=>{
        if(!acc[item.sender_id]) acc[item.sender_id] = [];
        acc[item.sender_id].push(item.message)
        return acc
    },{})*/
    return data
}
