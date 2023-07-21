import { Request, Response } from "express"
import * as chatRoomModel from "../models/chatRoom.js"

export async function renderChatroomByRoomName(req: Request, res: Response) {

    const { userId } = res.locals;
    const userRoom = await chatRoomModel.getUserRoom(userId)
    try {
        // user has no chatList
        if (userRoom.length === 0) {
            return res.render('chatRoomMain', { chatList: [], latestRoom: null, receiverId: null })
        }
        const chatList = await chatRoomModel.getChatListById(userId);
        const chatListReceiverInfo = await chatRoomModel.getChatListInfo(chatList);
        const latestRoom = chatList[0].room_name;
        const receiverId = chatList[0].receiverId;
        return res.render('chatRoomMain', { chatList: chatListReceiverInfo, latestRoom, receiverId })

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "renderChatroomByRoomName failed" })
    }
}


export async function fetchMessagesPagination(req: Request, res: Response) {
    try {
        const { room } = req.params;
        const currPage = Number(req.query.paging) || 0;
        const senderMessages = await chatRoomModel.getMessageByRoomPagination(room, currPage);
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