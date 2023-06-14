import { Request , Response } from "express"

export function chatRoom1(req:Request , res:Response){
    res.render('chatRoom1')
}

export function chatRoom2(req:Request , res:Response){
    res.render('chatRoom2')
}