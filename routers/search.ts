import { Router } from "express";
import { getArticleByKeyword } from "../controllers/search.js"

const router = Router();

router
    .route("/api/v1/search/articles")
    .get(getArticleByKeyword)


export default router;