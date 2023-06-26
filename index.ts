import express , { Router , Request, Response } from "express";
import cookieParser from "cookie-parser";
import chatRoomRouter  from "./routers/chatRoom.js"
import userRouter from "./routers/user.js"
import admin from "./routers/admin.js"
import friends from "./routers/friends.js"
import index from "./routers/index.js"
import articles from "./routers/articles.js"
import bodyParser from "body-parser";
import { socketHandler } from "./socket/socketHandler.js";
import { errorHandler } from "./utils/errorHandler.js";
import cors from "cors";


const app = express();

import { createServer } from 'http';
import { Server } from 'socket.io';
const server = createServer(app);
const io = new Server(server);

socketHandler(io);

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.enable("trust proxy");
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/',express.static('./public'));
app.use("/uploads",express.static("./uploads"))

// app.use("/api/v1", [
//   chatRoomRouter,
// ])

app.use("/", [
  index,
  chatRoomRouter,
  userRouter,
  admin,
  friends,
  articles
])

app.all('*', (req, res) => {
  res.status(404).render('404',{ message:"找不到此頁面"})
})

app.use(errorHandler);

server.listen(3000, () => {
  console.log('Server listening on *:3000');
});