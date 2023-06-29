import { string } from "zod";
import { Server } from "socket.io";
import * as chatRoomModel from "../models/chatRoom.js"


interface data {
  nickname: string;
  message: string;
  senderId: number;
  receiverId: number;
  room: string;
}


const options : any = {
  timeZone: 'Asia/Taipei',
  hour: 'numeric',
  minute:'numeric'
};

export function socketHandler(io: Server) {
  io.on('connection', (socket) => {
    console.log('socket connected...');

    // enter room via userID
    socket.on('joinMyRoom', (room: string) => {
      const time: string = new Date().toLocaleString('zh-TW',options);
      console.log(`userId:${room} 於${time}進入聊天室`);
      socket.join(room);
    })

    // send message to friend 
    socket.on('send', async (data: data) => {
      const { nickname, message, senderId, receiverId, room } = data;
      const time: string = new Date().toLocaleString('zh-TW',options);
      console.log('收到訊息-->', nickname, message, senderId, receiverId, room, time);
      await chatRoomModel.checkRoom(senderId, receiverId, room);
      socket.to(receiverId.toString()).emit("message", { nickname, message, senderId, receiverId, room ,time });
      await chatRoomModel.saveMessage(message, senderId, receiverId, room);
    })

    // 離開聊天室(待修改邏輯)
    socket.on('disconnect', (e: any) => {
      const time: string = new Date().toLocaleString('zh-TW',options);
      console.log(time);
      const userId = socket.handshake.auth.userId;
      // io.emit('leave', { nickname: 'user', message: '離開聊天室', room: userId, time });
      console.log(`userId:${userId} 於${time}離開聊天室`);
    })

  })
}





