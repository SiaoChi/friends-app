import { Request, Response } from "express"
import * as chatRoomModel from "../models/chatRoom.js"


export async function getMessages(req: Request, res: Response) {
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