import express, {Router, Request, Response} from "express";
import cookieParser from "cookie-parser";
import chatRoomRouter from "./routers/chatRoom.js";
import userRouter from "./routers/user.js";
import admin from "./routers/admin.js";
import friends from "./routers/friends.js";
import index from "./routers/index.js";
import articles from "./routers/articles.js";
import search from "./routers/search.js";
import bodyParser from "body-parser";
import {socketHandler} from "./socket/socketHandler.js";
import {errorHandler} from "./utils/errorHandler.js";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

import {createServer} from "http";
import {Server} from "socket.io";
import {readFileSync} from "fs";
import {redisClient} from "./models/redisClient.js";
import {redisRequestLimitCheck} from "./middleware/ratelimiter.js";

// const SSH_KEY = process.env.SSH_KEY || null;
// const SSH_CERT = process.env.SSH_CERT || null;

// if (!SSH_KEY || !SSH_CERT) {
//   console.error("SSH_KEY or SSH_CERT environment variables are not set.");
//   process.exit(1);
// }

const httpServer = createServer(app);

const io = new Server(httpServer);

socketHandler(io);

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.enable("trust proxy");
app.use(bodyParser.urlencoded({extended: false}));
app.use("/", express.static("./public"));
app.use("/uploads", express.static("./public/uploads"));
app.use(redisRequestLimitCheck);
app.use("/", [
  index,
  chatRoomRouter,
  userRouter,
  admin,
  friends,
  articles,
  search,
]);

app.all("*", (req, res) => {
  res.status(404).render("404", {message: "找不到此頁面"});
});

app.use(errorHandler);

redisClient.connect();

export const server = httpServer.listen(3000, () => {
  console.log("Server listening on *:3000");
});

export default app;
