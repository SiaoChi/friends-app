import { Router } from "express";
import * as chatRoomFunctions from "../controllers/chatRoom.js"
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.get('/chat1', (req, res) => res.render('chatRoomTest1'))
router.get('/chat2', (req, res) => res.render('chatRoomTest2'))

router.get('/chatroom/', [authenticate, chatRoomFunctions.renderChatroomByRoomNameBata])
router.get('/chatroom/:room', [authenticate, chatRoomFunctions.renderChatroomByRoomNameBata])


router // 要加一個middleware，防止其他人進入
    .route("/api/v1/chatroom/read")
    .put(authenticate, chatRoomFunctions.setUnreadToZero)

router // 要加一個middleware，防止其他人進入
    .route("/api/v1/chatroom/:room")
    .get(authenticate, chatRoomFunctions.fetchMessagesPagination)
    .put(authenticate, chatRoomFunctions.fetchMessagesRead)

router  // fetchChatList 是否sender有不是自己的，如果有header右上角會跳出綠點點
    .route("/api/v1/chatlist/:id")
    .get(authenticate, chatRoomFunctions.fetchChatList);  // 要加一個middleware，防止其他人進入


export default router;
