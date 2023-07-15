import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config()

const JWT_KEY = process.env.JWT_KEY || "";

export const EXPIRE_TIME = 60 * 60 * 2000;

export function generateToken(userId : number) {
    const token = jwt.sign({ userId }, JWT_KEY, { expiresIn:  EXPIRE_TIME  });
    console.log('token',token);
    return token;
  }