import pool from "./databasePool.js";
import { ResultSetHeader } from "mysql2";
import { z } from "zod";
import { redisClient } from "./redisClient.js";


function instanceOfSetHeader(object: any): object is ResultSetHeader {
    return "insertId" in object;
}

export async function createUserArticle(title: string, content: string, date: string, userId: number) {
    // console.log(title, content, date, userId);
    const [results] = await pool.query(
        `
        INSERT INTO articles (title,content,created_at,user_id)
        VALUES (?,?,?,?)
        `, [title, content, date, userId])


    return results
}

export async function getUserArticlesData(id: number) {
    const [results] = await pool.query(
        `SELECT articles.* ,users.picture , users.name FROM articles
         INNER JOIN users ON users.id = articles.user_id
         WHERE user_id = ?
         ORDER BY created_at DESC
        `, [id]
    )

    // console.log('articles', results);

    return results
}


export async function getAllUserArticlesData() {
    const [results] = await pool.query(
        `SELECT articles.* ,users.picture , users.name FROM articles
         INNER JOIN users ON users.id = articles.user_id
         ORDER BY created_at DESC
        `
    )
    // console.log('all articles', results);
    return results
}

export async function getArticlesAndSaveToCatch() {
    const [results] = await pool.query(
        `SELECT articles.* ,users.picture , users.name FROM articles
         INNER JOIN users ON users.id = articles.user_id
         ORDER BY created_at DESC
        `
    )
    console.log('-- getArticlesAndSaveToCatch --')
    await redisClient.set('articles', JSON.stringify(results));
    return results
}


export async function getArticleByID(id: number | number[]) {
    let query = `
      SELECT articles.*, users.picture, users.name
      FROM articles
      INNER JOIN users ON users.id = articles.user_id
      WHERE articles.id `;

    if (Array.isArray(id)) {
        query += `IN (?)`;
    } else {
        query += `= ?`;
    }

    query += ` ORDER BY created_at DESC`;

    const [results] = await pool.query(query, [id]);
    return results;
}


export async function updateArticleByID(id: number, title: string, content: string, date: string) {
    const result = await pool.query(
        `
        UPDATE articles
        SET title = ?, content = ? ,created_at=?
        WHERE id = ?
        `,
        [title, content, date, id]
    );
    return result;
}


export async function deleteArticleByID(id: number) {
    const result = await pool.query(`DELETE FROM articles WHERE id = ?`, [id])
    return result
}


export async function saveArticleEmoji(userId: number, articleId: number, emojiId: number) {
    const results = await pool.query(
        `
        INSERT INTO user_article_emoji (user_id,article_id,emoji_id)
        VALUES (?,?,?)
        `, [userId, articleId, emojiId]
    )

    if (Array.isArray(results) && instanceOfSetHeader(results[0])) {
        return results[0].affectedRows;
    }
}

const EmojiIdSchema = z.object({
    emoji_id: z.number()
})

export async function getArticleEmojiId(articleId: number, userId: number) {
    const [results] = await pool.query(
        `
        SELECT emoji_id FROM user_article_emoji
        WHERE  article_id = ? and user_id = ?
        `, [articleId, userId]
    )

    const checkData = z.array(EmojiIdSchema).parse(results)

    console.log('getArticleEmojiId', checkData);
    console.log('getArticleEmojiId type', typeof checkData);
    return checkData
}