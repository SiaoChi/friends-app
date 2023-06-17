import { Router } from "express";
import { getMessages } from "../controllers/chatRoom.js"

const router = Router();

router.get('/chat1',(req,res)=> res.render('chatRoom1'))
router.get('/chat2',(req,res)=> res.render('chatRoom2'))
router.get('/chat3',(req,res)=> res.render('chatRoom3'))

router.route("/api/v1/chatroom/:room").get(getMessages);  // 要加一個middleware，防止其他人進入



export default router;
