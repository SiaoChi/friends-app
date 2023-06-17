import { ResultSetHeader } from "mysql2";
import pool from "./databasePool.js";
import { z } from "zod";

function instanceOfSetHeader(object: any): object is ResultSetHeader {
    return "insertId" in object;
}

export async function createUser(
    name: string,
    email: string) {
    const results = await pool.query(
        `
            INSERT INTO users (name ,email)
            VALUES (?, ?)
            `,
        [name, email]
    );
    if (Array.isArray(results) && instanceOfSetHeader(results[0])) {
        return results[0].insertId;
    }
    throw new Error("create user failed")
}

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
})

export async function findUserByEmail(email: string) {
    const results = await pool.query(
        `
        SELECT * FROM users
        WHERE email = ?
        `,
        [email]
    );
    const user = z.array(UserSchema).parse(results[0]);
    return user[0];
}

export async function getUserProfileData(id: number) {
    const [row] = await pool.query(
        `
        SELECT * FROM users WHERE id = (?)
        LEFT JOIN articles
        ON users.id = articles.user_id
        `,
        [id]
    )
    // 補充如果沒有資料的情況，否則會報錯
    console.log(row);
    return row
}