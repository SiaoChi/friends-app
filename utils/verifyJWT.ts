import { Request, Response } from "express"
import jwt from 'jsonwebtoken';
import { z } from "zod";
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || "";

const DecodeSchema = z.object({
    userId: z.number(),
})

export default function verifyJWT(req: Request, res: Response, token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const checkDecoded = DecodeSchema.parse(decoded);
        return checkDecoded
    } catch (err) {
        throw new Error("invalid decode value"); 
    }
}

