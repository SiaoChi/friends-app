import { Request, Response } from "express"
import * as friendsModels from "../models/friends.js"
import * as userModels from "../models/user.js"


export async function fetchRecommendFriends(req: Request, res: Response) {
    try {
        const { userId } = res.locals;
        const friendsId = await friendsModels.getRecommendFriendsById(userId);
        const friendsData = await userModels.getUserProfileData(friendsId);
        res.status(200).json({ friendsData })
    } catch (err) {
        res.status(500).json({ errors: err })
    }
}


export async function renderRecommendFriends(req: Request, res: Response) {
    try {
        const { userId } = res.locals;
        const friendsId = await friendsModels.getRecommendFriendsById(userId);
        const friendsData = await userModels.getUserProfileData(friendsId);
        // const friendsData:any = [];
        res.render('recommendFriends', { friendsData })
    } catch (err) {
        res.status(500).json({ errors: err })
    }
}

export async function addFriend(req: Request, res: Response) {
    try {
        const { userId, friendId } = req.body;
        // console.log('test',userId,friendId);
        const result = await friendsModels.addFriend(userId, friendId);
        // console.log('test2',result)
        if (result) { return res.status(200).json({ message: "success" }) };
        throw new Error('add friend failed')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "addFriend failed" })
    }
}

export async function unFriend(req: Request, res: Response) {
    try {
        const { userId, friendId } = req.body;
        const result = await friendsModels.unFriend(userId, friendId);
        if (result) { return res.status(200).json({ message: "ignore" }) };
        throw new Error('unfriend failed')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "unFriend failed" })
    }
}

export async function fetchFriends(req: Request, res: Response) {
    try {
        const { userId } = res.locals;
        const friendsId = await friendsModels.getFriendsId(userId);
        
        if(Array.isArray(friendsId) && friendsId.length === 0){
            const friendsData = null;
            return res.render('friends',{ friendsData })
        }

        const friendsData = await userModels.getUserProfileData(friendsId);
        console.log('friendsData',friendsData);
        if (friendsId && friendsData) { return res.render('friends',{ friendsData }) };
        throw new Error('no friends, please add friend')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "fetchFriends failed" })
    }

}


