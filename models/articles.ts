import pool from "./databasePool.js";
import { z } from "zod";

export async function createUserArticle(title: string, content: string, date: string, userId: number) {
    console.log(title, content, date, userId);
    const [rows] = await pool.query(
        `
        INSERT INTO articles (title,content,created_at,user_id)
        VALUES (?,?,?,?)
        `, [title, content, date, userId])

    console.log(rows);

    return rows
}

export async function getUserArticlesData(id: number) {
    const [results] = await pool.query(
        `SELECT * FROM articles
         WHERE user_id = ?
         ORDER BY created_at DESC
        `, [id]
    )

    console.log('articles', results);

    return results
}


export async function getAllUserArticlesData() {
    const [results] = await pool.query(
        `SELECT * FROM articles
         ORDER BY created_at DESC
        `
    )
    console.log('all articles', results);
    return results
}

export async function getArticleByID(id: number) {

    const [results] = await pool.query(
        `SELECT * FROM articles
        WHERE id = ?
        `, [id]
    )
    console.log(results);
    return results
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