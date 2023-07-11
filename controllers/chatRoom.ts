import { Request, Response } from "express"
import * as chatRoomModel from "../models/chatRoom.js"
import { RowDataPacket } from 'mysql2';


export async function renderChatroomByRoomNameBata(req: Request, res: Response) {

    const { room } = req.params;
    const { id } = req.query as { id: string };
    const { userId } = res.locals;

    try {
        // 網址沒有房間號碼
        if (!room) {
            // 查詢是不是曾經有聊過天
            const userRoom = await chatRoomModel.getUserRoom(userId);
            // 有跟人聊天過，回傳最新的聊天好友資訊
            if (Array.isArray(userRoom) && userRoom.length > 0) {
                const chatList = await chatRoomModel.getChatListById(userId);
                if (Array.isArray(chatList) && chatList.length > 0) {
                    const latestRoom = (chatList[0] as RowDataPacket).room_name;
                    const receiverId = (chatList[0] as RowDataPacket).receiverId;
                    return res.redirect(`/chatroom/${latestRoom}?id=${receiverId}`);
                }
            }
            // 如果使用者沒有跟任何人聊天過，沒有聊天室的人，回傳空白聊天室
            const chatList:any = [];
            // const chatList = await chatRoomModel.getChatListById(userId);
            return res.render('chatRoomMain',{ chatList })
        }
        await chatRoomModel.checkRoom(userId, Number(id), room)
        // 有房間號碼，針對id=?傳送訊息
        // const messages = await chatRoomModel.getMessagesByRoom(room);
        const chatList = await chatRoomModel.getChatListById(userId);
        // console.log('messages---->',messages);
        // console.log('chatList---->', chatList);
        res.status(200).render('chatRoomMain', { chatList })

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "renderChatroomByRoomName failed" })
    }
}


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

export async function fetchMessagesPagination(req:Request, res:Response){
    try {
        const { room } = req.params;
        const currPage = Number(req.query.paging) 
        const senderMessages = await chatRoomModel.getMessageByRoomPagination(room,currPage);
        if (senderMessages) {
            res.status(200).json(senderMessages);
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


export async function fetchMessagesRead(req: Request, res: Response) {
    try {
        const { room } = req.body;
        const senderMessages = await chatRoomModel.readMessage(room);
        if (senderMessages) {
            res.status(400).json({ message: "success" });
            return;
        }
        throw new Error('fetchMessagesRead failed.')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "getMessages failed" })
    }
}

// 等待刪除
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

// 等待刪除
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
                    const latestRoom = (chatList[0] as RowDataPacket).room_name;
                    const receiverId = (chatList[0] as RowDataPacket).receiverId;
                    // const latestRoom = (chatList[chatList.length - 1] as RowDataPacket).room_name;
                    // const receiverId = (chatList[chatList.length - 1] as RowDataPacket).receiverId;
                    return res.redirect(`/chatroom/${latestRoom}?id=${receiverId}`);
                }
            }
            // 沒有聊天室的人，回傳空白聊天室
            return res.render('chatRoomMain')
        }

        // 有房間號碼，針對id=?傳送訊息
        const messages = await chatRoomModel.getMessagesByRoom(room)
        // console.log(messages);
        res.status(200).render('chatRoomMain', { messages })

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "renderChatroomByRoomName failed" })
    }
}


export async function setUnreadToZero(req: Request, res: Response) {
    try {
        const { senderId, receiverId, roomName } = req.body;
        const result = await chatRoomModel.setUnreadToZero(senderId, receiverId, roomName);
        if (result === 1) {
            return res.status(200).json({ message: "success" })
        }
        throw new Error('reset unread failed')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "setUnreadToZero failed" })
    }
}