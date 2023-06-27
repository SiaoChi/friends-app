import { Router } from "express";
import * as chatRoomFunctions from "../controllers/chatRoom.js"
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.get('/chat1', (req, res) => res.render('chatRoom1'))
router.get('/chat2', (req, res) => res.render('chatRoom2'))
router.get('/chat3', (req, res) => res.render('chatRoom3'))
router.get('/chatroom/', [authenticate, chatRoomFunctions.renderChatroomByRoomName])
router.get('/chatroom/:room', [authenticate, chatRoomFunctions.renderChatroomByRoomName])


router // 要加一個middleware，防止其他人進入
    .route("/api/v1/chatroom/:room")
    .get([authenticate, chatRoomFunctions.fetchMessages])
    .put([authenticate, chatRoomFunctions.fetchMessagesRead]) 

router
    .route("/api/v1/chatlist/:id")
    .get([authenticate, chatRoomFunctions.fetchChatList]);  // 要加一個middleware，防止其他人進入



export default router;
