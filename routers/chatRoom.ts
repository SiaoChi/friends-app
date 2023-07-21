import { Router } from "express";
import * as chatRoomFunctions from "../controllers/chatRoom.js"
import authenticate from "../middleware/authenticate.js";

const router = Router();

router
    .get('/chatroom/', [authenticate, chatRoomFunctions.renderChatroomByRoomName])
router
    .get('/chatroom/:room', [authenticate, chatRoomFunctions.renderChatroomByRoomName])

router
    .route("/api/v1/chatroom/read")
    .put(authenticate, chatRoomFunctions.setUnreadToZero)

router
    .route("/api/v1/chatroom/:room")
    .get(authenticate, chatRoomFunctions.fetchMessagesPagination)


export default router;
