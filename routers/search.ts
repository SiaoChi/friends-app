import { Router } from "express";
import { getArticleByKeyword,
    getFriendsByKeyword
} from "../controllers/search.js"

const router = Router();

router
    .route("/api/v1/search/articles")
    .get(getArticleByKeyword)

router
    .route("/api/v1/search/friends")
    .get(getFriendsByKeyword)


export default router;