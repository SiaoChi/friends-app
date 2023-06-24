import { Router } from "express";
import * as friendsFunctions from "../controllers/friends.js"
import authenticate from "../middleware/authenticate.js";


const router = Router();

router
    .route("/friends/recommend")
    .get(authenticate, friendsFunctions.renderRecommendFriends)

router
    .route("/friends")
    .get(authenticate, friendsFunctions.fetchFriends)

router
    .route("/api/v1/friends/add")
    .post(authenticate, friendsFunctions.addFriend)


router
    .route("/api/v1/friends/ignore")
    .post(authenticate, friendsFunctions.unFriend)


router
    .route("/api/v1/friends/recommend")
    .get(authenticate, friendsFunctions.fetchRecommendFriends)

export default router;
