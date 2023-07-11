import pool from "../models/databasePool.js"
import { z } from "zod";

const UsersTagsSchema = z.object({ tag_id: z.number() });
const TagOfUsersSchema = z.object({ user_id: z.number() });
const TopFiveUsersSchema = z.number();
const FriendsIdSchema = z.object({
    friend_id: z.number()
});

export async function getFriendsId(userId: number) {

    const [result] = await pool.query(`
    SELECT friend_id FROM user_friends
    WHERE user_id =?
    `,[userId]
    )
    const checkResult = z.array(FriendsIdSchema).parse(result)
    // checkResult =  [ { friend_id: 3 }, { friend_id: 5 }, { friend_id: 18 } ]
    const friendsId = checkResult.map(item => item.friend_id)
    // console.log('friendsId',friendsId);
    return friendsId
}

export async function addFriend(userId: number, friendId: number) {
    try{
        const [result] = await pool.query(
            `
            INSERT INTO user_friends (user_id , friend_id)
            VALUES (?,?)
            `, [userId, friendId]
        )
        // console.log(result);
        return result
    }catch(err){
        if(err instanceof Error){
            console.log(err.message);
        }
        throw new Error('add friends failed in model')
    }
    
}

export async function unFriend(userId: number, friendId: number) {
    const [result] = await pool.query(
        `
        INSERT INTO user_unfriends (user_id , unfriend_id)
        VALUES (?,?)
        `, [userId, friendId]
    )
    return result
}

export async function getRecommendFriendsById(userId: number) {

    // 先找出自己的id tags
    const [userTagsObj] = await pool.query(` SELECT tag_id FROM users_tags WHERE user_id = (?)`, [userId])

    if (!Array.isArray(userTagsObj) || userTagsObj.length === 0) { throw new Error('user has no tags') }
    const userTags = z.array(UsersTagsSchema).parse(userTagsObj);

    const userTagsId = userTags.map(item => item.tag_id);

    // 再找出相對的tags有什麼user_id
    const [tagOfUsersObj] = await pool.query(
        `
        SELECT user_id FROM users_tags WHERE tag_id IN (?) AND user_id != ? `, [userTagsId, userId]
    )
    const tagOfUsers = z.array(TagOfUsersSchema).parse(tagOfUsersObj);

    // hashmap每個friends  
    //[ { user_id: 4 }, { user_id: 4 }, { user_id: 6 }, { user_id: 15 } ]  ==>  { '4': 2, '6': 1, '15': 1 }
    const mapFriends = tagOfUsers.reduce((acc: { [key: number]: number }, item) => {
        if (!acc[item.user_id]) acc[item.user_id] = 0;
        acc[item.user_id] += 1
        return acc
    }, {})

    // console.log('mapFriends',mapFriends);

    // friends unfriends list Id, 排除有一樣Id的  mapFriends
    const [filterFriends] = await pool.query(
        `
        SELECT Friends_id AS id FROM (
            SELECT a.friend_id AS Friends_id
            FROM user_friends a
            WHERE a.user_id = ?
            UNION
            SELECT i.unfriend_id AS Friends_id
            FROM user_unfriends i
            WHERE i.user_id = ?
          ) AS combined;
        `,
        [userId, userId]
    );

    // filterFriends [ { id: 16 }, { id: 17 }, { id: 1 } ]
    // mapFriends { '4': 2, '6': 1, '15': 1 }

    (filterFriends as Array<any>).forEach(friend => {
        const id = friend.id;
        if (mapFriends.hasOwnProperty(id)) {
            delete mapFriends[id];
        }
    });

    // console.log('相同tagsUser積分(id:相同分數)', mapFriends);

    // 找出hashmap top5 最大的user
    const sortedFriends = Object.entries(mapFriends)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    let topFiveUsers;
    if (sortedFriends.length === 0) {
        topFiveUsers = null;  // 補如果沒有可以推薦好友可以 random friends
    } else {
        topFiveUsers = sortedFriends.map(([key]) => key);
    }
    const parseIntTopFiveUsers = topFiveUsers?.map(item => parseInt(item));
    const result = z.array(TopFiveUsersSchema).parse(parseIntTopFiveUsers);
    console.log('推薦好友清單ID', result);
    return result   // [ 1, 6 ]
}

