import pool from "../models/databasePool.js";
import {z} from "zod";

const SearchArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  created_at: z.string(),
  user_id: z.number(),
  name: z.string(),
  picture: z.string(),
});

export async function getFriendsByKeyword(keyword: string) {
  const [data] = await pool.query(
    `
        SELECT * FROM users WHERE name LIKE '%${keyword}%' 
        `,
    [keyword]
  );
  return data;
}

export async function getArticleByKeyword(keyword: string, currPage: number) {
  // 加上 `%` 用於模糊查詢
  const searchKeyword = `%${keyword}%`;

  // 第一個查詢：取得文章資料
  const [data] = await pool.query(
    `
        SELECT articles.*, users.picture, users.name 
        FROM articles
        INNER JOIN users ON users.id = articles.user_id 
        WHERE title LIKE ? OR content LIKE ? 
        ORDER BY created_at 
        LIMIT 10 OFFSET ?
        `,
    [searchKeyword, searchKeyword, currPage * 20]
  );

  // 第二個查詢：檢查是否有下一頁
  const [next] = await pool.query(
    `
        SELECT id FROM articles 
        WHERE title LIKE ? OR content LIKE ? 
        ORDER BY created_at 
        LIMIT 1 OFFSET ?
        `,
    [searchKeyword, searchKeyword, (currPage + 1) * 20]
  );

  // 判斷是否有下一頁
  let nextPaging: number | null =
    Array.isArray(next) && next.length > 0 ? currPage + 1 : null;

  // 如果有資料，則解析並回傳
  if (data && Array.isArray(data)) {
    const userArticles = z.array(SearchArticleSchema).parse(data);
    return {userArticles, nextPaging};
  }

  // 若沒有資料，回傳 null
  return {userArticles: null, nextPaging: null};
}
