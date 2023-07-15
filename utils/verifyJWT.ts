import jwt from "jsonwebtoken";
import { z } from "zod";
import * as dotenv from "dotenv"
dotenv.config()

const JWT_KEY = process.env.JWT_KEY || "";
console.log('解開JWT_KEY步驟',JWT_KEY);

const DecodedSchema = z.object({
    userId: z.number(),
});

type Decoded = z.infer<typeof DecodedSchema>;

export default function verifyJWT(token: string): Promise<Decoded> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_KEY, (err, decoded) => {
            try {
                console.log('jwt generate...');
                if (err) reject(err);
                const result = DecodedSchema.parse(decoded);
                console.log('JWT', result);
                resolve(result);
            } catch (err) {
                console.log(err);
                reject(new Error("invalid decoded value"));
            }
        });
    });
}