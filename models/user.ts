import {ResultSetHeader, RowDataPacket} from "mysql2";
import pool from "./databasePool.js";
import {z} from "zod";

function instanceOfSetHeader(object: any): object is ResultSetHeader {
  return "insertId" in object;
}

const userProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  picture: z.string().nullable(),
  birth: z.string().nullable(),
  location: z.string().nullable(),
  sick_year: z.number().nullable(),
  level: z.string().nullable(),
  carer: z.string().nullable(),
  current_problem: z.string().nullable(),
  created_at: z.date().nullable(),
  tags: z.array(z.string()).optional(),
});

export async function checkUser(email: string) {
  const findEmail = await pool.query<RowDataPacket[]>(
    `
         SELECT id FROM users
         WHERE email = ?
        `,
    [email]
  );

  if (Array.isArray(findEmail) && findEmail[0].length > 0) {
    return true;
  }
  return false;
}

export async function createUser(name: string, email: string) {
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
  throw new Error("create user failed");
}

export async function findUserByEmail(email: string) {
  const results = await pool.query(
    `
        SELECT * FROM users
        WHERE email = ?
        `,
    [email]
  );
  const user = z.array(userProfileSchema).parse(results[0]);
  return user[0];
}

export async function getUserProfileData(id: number | number[]) {
  const [rows] = await pool.query(
    `
        SELECT * FROM users WHERE id IN (?)
    `,
    [Array.isArray(id) ? id : [id]]
  );

  const userData = z.array(userProfileSchema).parse(rows);
  if (!userData) return [];
  return userData;
}

const UserTagsSchema = z.object({
  user_id: z.number(),
  tags: z.string(),
});

export async function getUserProfileTagsData(id: number | number[]) {
  const [userRows] = await pool.query(`SELECT * FROM users WHERE id IN (?)`, [
    Array.isArray(id) ? id : [id],
  ]);
  const userData = z.array(userProfileSchema).parse(userRows);
  const userId = userData.map((item) => item.id);

  const [tagRows] = await pool.query(
    `
        SELECT user_id , GROUP_CONCAT(tags.name) AS tags
        FROM users_tags 
        INNER JOIN tags ON tags.id = users_tags.tag_id
        WHERE user_id = ?
        GROUP BY user_id
        `,
    [userId]
  );

  const userTagsData = z.array(UserTagsSchema).parse(tagRows);

  // 把user_id當key, tag_name當value的數據整理
  const userTags = userTagsData.reduce(
    (obj: {[userId: number]: string[]}, ele) => {
      if (!obj[ele.user_id]) obj[ele.user_id] = [];
      obj[ele.user_id].push(ele.tags);
      return obj;
    },
    {}
  );
  // 把userData加入有相同user_id的tag
  const userResData = userData.map((user) => ({
    ...user,
    tags:
      userTags[user.id] && userTags[user.id][0]
        ? userTags[user.id][0].split(",")
        : [], // 若沒有tags，給空陣列
  }));
  return userResData;
}

export async function updateUserProfile(
  name: string,
  picture: string,
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
    [
      name,
      picture,
      birth,
      email,
      carer,
      level,
      location,
      sickYear,
      currentProblems,
    ]
  );

  if (tags) {
    const result = await pool.query(
      `DELETE FROM users_tags WHERE user_id = ?`,
      [userId]
    );
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    const arrangeData = tags.map((item) => [userId, parseInt(item)]);
    await pool.query(
      `INSERT users_tags (user_id , tag_id)
         VALUES ?
        `,
      [arrangeData]
    );
  }
}

const TagsSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export async function getTags() {
  const [result] = await pool.query(`SELECT * FROM tags`);
  return result;
}
