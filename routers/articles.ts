import { Router } from "express";
import * as articlesFunction from "../controllers/articles.js"
import authenticate from "../middleware/authenticate.js";

const router = Router();

router
    .route("/articles")
    .get(articlesFunction.renderArticles)

router
    .route("/articles/edit/:id")
    .get(authenticate, articlesFunction.renderUpdateArticleByID)

router
    .route("/articles/:id")
    .get(articlesFunction.renderArticleByID)

router
    .route("/api/v1/articles/:id")
    .delete(authenticate, articlesFunction.deleteArticleById)
    .put(authenticate, articlesFunction.updateArticleById)

router
    .route("/api/v1/articles/emoji")
    .get(authenticate,articlesFunction.getArticleEmoji)
    .post(authenticate,articlesFunction.saveArticleEmoji)


export default router;