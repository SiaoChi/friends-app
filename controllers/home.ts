import { Request, Response } from "express"
import * as userModel from "../models/user.js"

export async function renderArticles(req: Request, res: Response) {
    try {
        const { userId } = res.locals;
        const userArticles = await userModel.getAllUserArticlesData()
        res.status(200).render('articles', { userArticles })
    } catch (err) {
        res.status(500).json({ errors: err })
    }
}

export async function renderArticleByID(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const singleArticleData = await userModel.getArticleByID(parseInt(id));
        console.log(singleArticleData);
        if(Array.isArray(singleArticleData) && singleArticleData.length > 0) {
            return res.status(200).render('singleArticle', { singleArticleData });
        }
        throw new Error ('article ID is not existed')
    } catch (err) {
        res.status(500).json({ errors: err })
    }
}