import { Request, Response } from "express"
import * as articleModels from "../models/articles.js"

export async function renderUserCreateArticle(req: Request, res: Response) {
    res.render('createArticle')
}

export async function fetchUserCreateArticle(req: Request, res: Response) {
    try {
        const { title, content, date } = req.body;
        const { userId } = res.locals;
        // console.log(title, content, date, userId);
        const result = await articleModels.createUserArticle(title, content, date, userId);
        if (result) {
            return res.status(200).json({ message: 'success' })
        }
        throw new Error('create article failed..')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message })
            return;
        }
        res.status(500).json({ errors: "fetchUserCreateArticle failed" })
    }
}

export async function renderArticles(req: Request, res: Response) {
    try {
        const { userId } = res.locals;
        const userArticles = await articleModels.getAllUserArticlesData()
        res.status(200).render('articles', { userArticles, searchResult: null })
    } catch (err) {
        res.status(500).json({ errors: err })
    }
}

export async function renderArticleByID(req: Request, res: Response) {
    try {
        const { id: articleId } = req.params;
        const { userId } = res.locals;
        console.log('renderArticleByID---->',articleId,userId);
        const singleArticleData = await articleModels.getArticleByID(parseInt(articleId));
        const userArticleEmojiId = await articleModels.getArticleEmojiId(parseInt(articleId), userId);

        console.log('userArticleEmojiId-->',userArticleEmojiId);
        if (Array.isArray(singleArticleData) && singleArticleData.length > 0 && userArticleEmojiId.length > 0 ) {
            console.log('emojo有資料');
            return res.status(200).render('singleArticle', { singleArticleData , userArticleEmojiId });
        }else if (Array.isArray(singleArticleData) && singleArticleData.length > 0 && userArticleEmojiId.length === 0 ){
            console.log('emojo沒有資料');
            return res.status(200).render('singleArticle', { singleArticleData , userArticleEmojiId:null });
        }
        return res.status(404).render('404');
    } catch (err) {
        res.status(500).json({ errors: err })
    }
}

export async function renderUpdateArticleByID(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const singleArticleData = await articleModels.getArticleByID(parseInt(id));
        if (Array.isArray(singleArticleData) && singleArticleData.length > 0) {
            return res.status(200).render('editArticle', { singleArticleData });
        }
        throw new Error('article ID is not existed')
    } catch (err) {
        res.status(500).json({ errors: err })
    }
}

export async function deleteArticleById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await articleModels.deleteArticleByID(parseInt(id));
        if (Array.isArray(result) && result.length > 0) {
            return res.status(200).json({ message: `成功刪除文章:${id}` })
        }
        throw new Error('article ID is not existed')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message })
            return;
        }
        res.status(500).json({ errors: "deleteArticleById failed" })
    }
}


export async function updateArticleById(req: Request, res: Response) {
    try {
        const { id, title, content, date } = req.body
        const singleArticleData = await articleModels.updateArticleByID(id, title, content, date);
        // console.log(singleArticleData);
        if (Array.isArray(singleArticleData) && singleArticleData.length > 0) {
            return res.status(200).json({ message: 'success' })
        }
    } catch (err) {
        res.status(500).json({ errors: err })
    }
}

export async function saveArticleEmoji(req: Request, res: Response) {
    try {
        const { userId } = res.locals;
        const { articleId, emojiId } = req.body;
        const affectRows = await articleModels.saveArticleEmoji(userId, parseInt(articleId), parseInt(emojiId));
        if (affectRows === 1) {
            return res.status(200).json({ message: 'success' })
        }
        throw new Error('article emoji return affectRows is 0')
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message })
            return;
        }
        res.status(500).json({ errors: err })
    }
}

// export async function getArticleEmoji(req: Request, res: Response) {
//     try {
//         const { articleId } = req.body;
//         const { userId } = res.locals;
//         const userArticleEmojiId = await articleModels.getArticleEmojiId(parseInt(articleId), userId);
//         if (userArticleEmojiId) {
//             return res.status(200).json({ userArticleEmojiId });
//         }
//         const isNull: any = [];
//         return res.status(200).json({ userArticleEmojiId: isNull });
//     } catch (err) {
//         res.status(500).json({ errors: err })
//     }
// }