import pool from "../models/databasePool.js"
import { z } from "zod";

const SearchArticleSchema = z.object({
    id:z.number(),
    title:z.string(),
    content:z.string(),
    created_at:z.string(),
    user_id:z.number(),
    name:z.string(),
    picture:z.string()
})  


export async function getFriendsByKeyword(keyword:string){
    const [data] = await pool.query(
        `
        SELECT * FROM users WHERE name LIKE '%${keyword}%' 
        `,[keyword]
    )   
    return data
}

export async function getArticleByKeyword(keyword: string, currPage: number) {
    const [data] = await pool.query(
        `
        SELECT articles.* , users.picture , users.name FROM articles
        INNER JOIN users ON users.id = articles.user_id 
        WHERE title  LIKE '%${keyword}%' OR content  LIKE '%${keyword}%' 
        ORDER BY created_at limit 10 offset ?
        `,[currPage * 20]
    )

    // console.log('data->',data);

    const [next] = await pool.query(
        `
        SELECT id FROM articles WHERE title  LIKE '%${keyword}%' OR content  LIKE '%${keyword}%' 
        ORDER BY created_at limit 1 offset ?
        `,[((currPage + 1) * 20)]
    )

    if (data) {
        let nextPaging: number | null
        if (Array.isArray(next) && next.length > 0) nextPaging = Number(currPage) + 1;
        nextPaging = null;
        const userArticles = z.array(SearchArticleSchema).parse(data);
        return { userArticles , nextPaging }
    } else {
        console.log('沒有這個關鍵字');
        const nextPaging = null;
        const userArticles = null;
        return { userArticles , nextPaging }
    }
}

