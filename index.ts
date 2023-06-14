import express , { Router , Request, Response } from "express";
import cookieParser from "cookie-parser";
import chatRoomRouter from "./routers/chatRoom.js"

const app = express();

// server , socket.io設定
import { createServer } from 'http';
import { Server } from 'socket.io';
const server = createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(express.json());

app.set('view engine', 'ejs');

app.use("/", [
  chatRoomRouter
])

// app.use("/api/v1", [
  
// ])

const router = Router();      

app.use("/uploads",express.static("./uploads"))

server.listen(3000, () => {
  console.log('Server listening on *:3000');
});