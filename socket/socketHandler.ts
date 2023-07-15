import { string } from "zod";
import { Server } from "socket.io";
import * as chatRoomModel from "../models/chatRoom.js"
import verifyJWT from "../utils/verifyJWT.js";

interface data {
  name: string;
  message: string;
  senderId: number;
  receiverId: number;
  room: string;
  senderPicture: string;
  token: string
}


const options : any = {
  timeZone: 'Asia/Taipei',
  hour: 'numeric',
  minute:'numeric'
};

export function socketHandler(io: Server) {
  io.on('connection' ,(socket) => {
    console.log('socket connected...');

    // enter room via userID
    socket.on('joinMyRoom' ,(userId: string) => {
      const time: string = new Date().toLocaleString('zh-TW',options);
      console.log(`userId:${userId} 於${time}進入聊天室`);
      socket.join(userId);
    })

    // send message to friend 
    socket.on('send', async (data: data) => {
      const { name, message, senderId, receiverId, room, senderPicture, token } = data;
      const { userId } = await verifyJWT(token);
      console.log('確認ID正確性', userId , senderId);
      if (Number(senderId) !== Number(userId)) throw new Error ('userId is wrong with token.')
      const time: string = new Date().toLocaleString('zh-TW',options);
      console.log('收到訊息-->' , name , '發出訊息：' , message, '傳送人ID:', senderId,'收訊人ID:', receiverId,"聊天房間", room, time);
      await chatRoomModel.checkRoom(senderId, receiverId, room);
      socket.to(receiverId.toString()).emit("message", { name, message, senderId, receiverId, room ,time ,senderPicture });
      await chatRoomModel.saveMessage(message, senderId, receiverId, room);
    })

    // 離開聊天室
    socket.on('disconnect', (e: any) => {
      const time: string = new Date().toLocaleString('zh-TW',options);
      const userId = socket.handshake.auth.userId;
      console.log(`userId:${userId} 於${time}離開聊天室`);
    })

  })
}





