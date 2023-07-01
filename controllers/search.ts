import { Request, Response } from "express";
import * as searchModels from "../models/search.js";

export async function getArticleByKeyword(req: Request, res: Response) {
    try {
        const { keyword } = req.query as { keyword: string }
        const  currPage  = Number(req.query.paging) || 0
        const data = await searchModels.getArticleByKeyword(keyword, currPage);
        // console.log('result',data);
        res.render('articles', { userArticles: data.userArticles , nextPaging: data.nextPaging })

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "getArticleByKeyword failed" })
    }
}


export async function getFriendsByKeyword(req: Request, res: Response) {
    try {
        const { keyword } = req.query as { keyword: string }
        const friendsData = await searchModels.getFriendsByKeyword(keyword);
        res.render ('searchFriends',{ friendsData })

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "getArticleByKeyword failed" })
    }
}

