import pool from "./databasePool.js"

export async function createSickTag(tag:string){
    await pool.query(
        `
        INSERT tags (name)
        VALUE (?)
        `,
        [tag]
    )
}