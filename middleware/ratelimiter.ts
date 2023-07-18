import { redisClient } from "../models/redisClient.js";
import { Request, Response, NextFunction } from "express";

// 防止request攻擊
export async function redisRequestLimitCheck(req:Request, res:Response, next:NextFunction) {

    const { ip } = req;
    const QUOTA = 1000;  // 以毫秒計算，如果要設定1分鐘就是60s*1000
    const IP_STAMP = `${ip}:${Math.floor(Date.now() / QUOTA)}`; 
    const limitTime = 10

    const newData = await redisClient 
        .multi()
        .incr(IP_STAMP)
        .expire(IP_STAMP, 1)
        .exec()

    if (newData[0] as number > limitTime ) {
        return res.status(429).json({ message: `超過網站每秒請求次數${limitTime}次` });
    }
    next()
}