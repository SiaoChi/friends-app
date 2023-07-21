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
    `, [userId]
    )
    const checkResult = z.array(FriendsIdSchema).parse(result)
    const friendsId = checkResult.map(item => item.friend_id)
    return friendsId
}

export async function addFriend(userId: number, friendId: number) {
        const [result] = await pool.query(
            `
            INSERT INTO user_friends (user_id , friend_id)
            VALUES (?,?)
            `, [userId, friendId]
        )
        return result
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


export async function getUserTagsIdByUserId(userId: number) {
    const [results] = await pool.query(` SELECT tag_id FROM users_tags WHERE user_id = (?)`, [userId])
    if (!Array.isArray(results) || results.length === 0) { throw new Error('user has no tags') }
    const userTags = z.array(UsersTagsSchema).parse(results);

    const userTagsId = userTags.map(item => item.tag_id);
    return userTagsId
}


export async function getUsersIdByTagId(userId: number, userTagsId: number[]) {

    const [results] = await pool.query(
        `
        SELECT user_id FROM users_tags WHERE tag_id IN (?) AND user_id != ? `, [userTagsId, userId]
    )
    const tagOfUsers = z.array(TagOfUsersSchema).parse(results);
    /*
    [ { user_id: 4 }, { user_id: 4 }, { user_id: 6 }, { user_id: 15 } ] 
    =>  { '4': 2, '6': 1, '15': 1 }
     */
    const mapFriends = tagOfUsers.reduce((acc: { [userId: number]: number }, item) => {
        if (!acc[item.user_id]) acc[item.user_id] = 0;
        acc[item.user_id] += 1
        return acc
    }, {})
    return mapFriends
}



export async function filterIgnoreFriends(userId: number, mapFriends: { [key: number]: number; }) {

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
    return mapFriends
}


export function sortedTopRecommendFriends(mapFriends: object) {

    const FRIENDS_NUMBER = 6;
    const sortedFriends = Object.entries(mapFriends)
        .sort((a, b) => b[1] - a[1])
        .slice(0, FRIENDS_NUMBER);

    let topUsers;
    if (sortedFriends.length === 0) {
        topUsers = null; 
    } else {
        topUsers = sortedFriends.map(([key]) => key);
    }
    const parseIntTopFiveUsers = topUsers?.map(item => parseInt(item));
    const result = z.array(TopFiveUsersSchema).parse(parseIntTopFiveUsers);
    return result
}

export async function getRecommendFriendsById(userId: number) {

    const userTagsId = await getUserTagsIdByUserId(userId);
    const mapFriendsId = await getUsersIdByTagId(userId, userTagsId);
    const filterMapFriendsId = await filterIgnoreFriends(userId, mapFriendsId);
    const recommendFriends = sortedTopRecommendFriends(filterMapFriendsId)
    return recommendFriends

}

