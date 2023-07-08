import { Request, Response } from "express";
import * as searchModels from "../models/search.js";
import * as articleModels from "../models/articles.js";
import { searchByElastic } from "../elasticSearch/search.js"


export async function getArticleByElasticSearch(req: Request, res: Response) {
    try {
        const { keyword } = req.query as { keyword: string }
        const searchKeyword = keyword.split(' '); // 使用者會把搜尋不同單字用空白區隔
        const articleIdArray = await searchByElastic(searchKeyword);

        if(Array.isArray(articleIdArray) && articleIdArray.length === 0){
           return  res.status(200).render('articles', { userArticles: [] , searchResult: 0})
        }

        let elasticSearchArticlesData = await articleModels.getArticleByID(articleIdArray);
        let searchResult
        if(Array.isArray(elasticSearchArticlesData) && elasticSearchArticlesData.length > 1) { 
            searchResult = elasticSearchArticlesData.length
         }
        
        res.status(200).render('articles', { userArticles: elasticSearchArticlesData , searchResult})

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "getArticleByElasticSearch" })
    }
}

export async function getArticleByKeyword(req: Request, res: Response) {
    try {
        const { keyword } = req.query as { keyword: string }
        const  currPage  = Number(req.query.paging) || 0
        const data = await searchModels.getArticleByKeyword(keyword, currPage);
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

