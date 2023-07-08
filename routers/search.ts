import { Router } from "express";
import * as searchFunction from "../controllers/search.js"

const router = Router();

router
    .route("/api/v1/search/articles")
    .get(searchFunction.getArticleByElasticSearch)

router
    .route("/api/v1/search/friends")
    .get(searchFunction.getFriendsByKeyword)


export default router;