import { Request, Response } from "express"
import * as chatRoomModel from "../models/chatRoom.js"
import { RowDataPacket } from 'mysql2';
import * as friendsModels from '../models/friends.js'
import * as userModels from '../models/user.js'


export async function fetchMessages(req: Request, res: Response) {
    try {
        const { room } = req.params;
        const senderMessages = await chatRoomModel.getMessagesByRoom(room);
        if (senderMessages) {
            res.status(400).json(senderMessages);
            return;
        }
        throw new Error('the chatroom is empty.')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "getMessages failed" })
    }

}

export async function fetchChatList(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const chatList = await chatRoomModel.getChatListById(Number(id));
        if (chatList) {
            res.status(400).json(chatList);
            return;
        }
        throw new Error('the chatList is empty.')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "getMessages failed" })
    }
}

export async function renderChatroomByRoomName(req: Request, res: Response) {

    const { room } = req.params;

    try {
        // 網址沒有房間號碼
        if (!room) {
            // 查詢是不是曾經有聊過天
            const { userId } = res.locals;
            const userRoom = await chatRoomModel.getUserRoom(userId);

            if (Array.isArray(userRoom) && userRoom.length > 0) {
                const chatList = await chatRoomModel.getChatListById(userId);
                if (Array.isArray(chatList) && chatList.length > 0) {
                    const latestRoom = (chatList[chatList.length - 1] as RowDataPacket).room_name;
                    const receiverId = (chatList[chatList.length - 1] as RowDataPacket).receiverId;
                    return res.redirect(`/chatroom/${latestRoom}?id=${receiverId}`);
                }
            }
            // 沒有聊天室的人，回傳空白聊天室
            return res.render('chatroom')
        }

        // 有房間號碼，針對id=?傳送訊息
        const messages = await chatRoomModel.getMessagesByRoom(room)
        console.log(messages);
        res.status(200).render('chatRoom', { messages })

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "renderChatroomByRoomName failed" })
    }
}


// export async function renderChatroom(req:Request,res:Response){
//     try{
//         res.render('chatroom')
//     }catch(err){
//         res.status(500).json({errors:err})
//     }
// }