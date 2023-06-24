import { string } from "zod";
import { Server } from "socket.io";
import * as chatRoomModel from "../models/chatRoom.js"


interface data  {
  nickname : string; 
  message : string;
  senderId : number; 
  receiverId : number; 
  room : string;
}


export function socketHandler( io: Server ){
    io.on('connection',(socket)=>{
      console.log('socket connected...');
       
      // enter room via userID
       socket.on('joinMyRoom', (room : string)=>{
        console.log(`ID${room} enter chatroom...`);
        socket.join(room);
      })
  
       // send message to friend 
      socket.on('send', async (data: data) => {
        const { nickname , message , senderId, receiverId, room} = data;
        console.log('收到訊息-->',nickname , message , senderId, receiverId, room);
        await chatRoomModel.checkRoom(senderId, receiverId, room)  
        socket.to(receiverId.toString()).emit("message", { nickname , message , senderId, receiverId, room} )
        await chatRoomModel.saveMessage( message , senderId ,room)
    })

    }) 
}


        // 離開聊天室(待修改邏輯)
        /*socket.on('disconnect',(e : any)=>{
          const time : string = new Date().toLocaleString();
          const userId = socket.handshake.auth.userId;
          io.emit('leave',  { nickname: 'user', message:'離開聊天室' , room: userId , time});
        })*/


