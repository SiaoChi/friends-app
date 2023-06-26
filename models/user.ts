
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

// GROUP_CONCAT函數用於將at.content值連接成單個字符串

export async function getUserProfileData(id: number | number[]) {
    let query;
    let values;

    if (Array.isArray(id)) {
        console.log('1');
        query = `
            SELECT us.*, GROUP_CONCAT(at.content) AS articles
            FROM users us
            LEFT JOIN articles at ON us.id = at.user_id
            WHERE us.id IN (?)
            GROUP BY us.id
        `;
        values = [id];
    } else {
        console.log('2');
        query = `
            SELECT us.*,  AS articles
            FROM users us
            LEFT JOIN articles at ON us.id = at.user_id
            WHERE us.id = ?
            GROUP BY us.id
        `;
        values = id;
    }

    const [rows] = await pool.query(query, values);

    return rows;
}



export async function getUserProfileTagsData(id: number) {
    let query;
    let values;

    if (Array.isArray(id)) {
        query = `
            SELECT us.*, GROUP_CONCAT(at.content) AS articles
            FROM users us
            LEFT JOIN articles at ON us.id = at.user_id
            WHERE us.id IN (?)
            GROUP BY us.id
        `;
        values = [id];
    } else {
        query = `
            SELECT us.*, GROUP_CONCAT(at.content) AS articles
            FROM users us
            LEFT JOIN articles at ON us.id = at.user_id
            WHERE us.id = ?
            GROUP BY us.id
        `;
        values = id;
    }

    const [rows] = await pool.query(query, values);

    const userId = (rows as Array<any>).map(item => item.id);

    const [userTags] = await pool.query(
        `
        SELECT user_id , GROUP_CONCAT(tags.name) AS tags
        FROM users_tags 
        INNER JOIN tags ON tags.id = users_tags.tag_id
        WHERE user_id = ?
        GROUP BY user_id
        `, [userId]
    )

    console.log(userTags);  // [ { user_id: 1, tags: '生活起居可自理,容易迷路,產生幻想,生活需要他人協助' } ]

    (rows as Array<any>).forEach(userData => {
        const userTag = (userTags as Array<any>).filter(userTag => userTag.user_id === userData.id);
        let userTagArray;
        console.log('userTag', userTag);
        if (Array.isArray(userTag) && userTag.length > 0) {
            userTagArray = userTag[0].tags.split(',');
            userData['tags'] = userTagArray;
        }
        if (userData.articles) userData.articles = userData.articles.split(',');

    })

    console.log(rows);

    return rows;
}


export async function updateUserProfile(
    name: string,
    picture: string, // 之後要改成上傳檔案(?)
    birth: string,
    email: string,
    location: string,
    sickYear: number,
    carer: string,
    level: string,
    currentProblems: string,
    tags: string[],
    userId: number
) {
    await pool.query(
        `
        UPDATE users
        SET name=?, picture=?, birth=?, email=?, carer=? ,level=?, location=?, sick_year=?, current_problem=?
        WHERE id=${userId}
        `,
        [name, picture, birth, email, carer,  level, location, sickYear, currentProblems]
    )


    if (Array.isArray(tags) && tags.length > 0) {
        await pool.query(`DELETE FROM users_tags WHERE user_id = ${userId}`)
        const arrangeData = tags.map(item => [userId, parseInt(item)]);
        await pool.query(
            `INSERT users_tags (user_id , tag_id)
         VALUES ?
        `,
            [arrangeData]
        )
    }
}

const TagsSchema = z.object({
    id: z.number(),
    name: z.string()
})

export async function getTags() {
    const [result] = await pool.query(`SELECT * FROM tags`)
    return result
}
