import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import chatRoomRouter from "./routers/chatRoom.js"
import userRouter from "./routers/user.js"
import admin from "./routers/admin.js"
import friends from "./routers/friends.js"
import index from "./routers/index.js"
import articles from "./routers/articles.js"
import search from "./routers/search.js"
import bodyParser from "body-parser";
import { socketHandler } from "./socket/socketHandler.js";
import { errorHandler } from "./utils/errorHandler.js";
import cors from "cors";
import * as dotenv from "dotenv"

dotenv.config();

const app = express();

import { createServer } from 'https';
import { Server } from 'socket.io';
import { readFileSync } from "fs";

const SSH_KEY = process.env.SSH_KEY;
const SSH_CERT = process.env.SSH_CERT;

console.log(SSH_KEY, SSH_CERT);

if (!SSH_KEY || !SSH_CERT) {
  console.error('SSH_KEY or SSH_CERT environment variables are not set.');
  process.exit(1);
}


const httpsServer = createServer({
  key: readFileSync(SSH_KEY,'utf-8'),
  cert: readFileSync(SSH_CERT,'utf-8'),
}, app);


const io = new Server(httpsServer);

io.on("connection", (socket) => {
  console.log('socket connect');
})

// socketHandler(io);

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.enable("trust proxy");
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static('./public'));
app.use("/uploads", express.static("./uploads"))


app.use("/", [
  index,
  chatRoomRouter,
  userRouter,
  admin,
  friends,
  articles,
  search
])

app.all('*', (req, res) => {
  res.status(404).render('404', { message: "找不到此頁面" })
})

app.use(errorHandler);

httpsServer.listen(3000, () => {
  console.log('Server listening on *:3000');
});
