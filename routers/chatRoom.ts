import { Router } from "express";
import { chatRoom1 , chatRoom2 } from "../controllers/chatRoom.js"

const router = Router();

router.route("/chat1").get(chatRoom1);
router.route("/chat2").get(chatRoom2);


export default router;
