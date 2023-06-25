import { Router, Response, Request } from "express";
// import { body } from "express-validator";
import {
    getLogInPage,
    signUp,
    signIn,
    createUserProfile,
    fetchUserProfileById,
    renderUserProfileForm,
    renderUserProfileById,
    renderUserProfile,
    renderUserCreateArticle,
    fetchUserCreateArticle
} from "../controllers/user.js"
import authenticate from "../middleware/authenticate.js";


const router = Router();

router
    .route("/user/signup")  // Native
    .get(getLogInPage)
    .post(signUp);

router
    .route("/user/signin")  // signIn facebook or Google or Native
    .get(getLogInPage)
    .post(signIn)


router
    .route("/user/profile/form")
    .get(authenticate, renderUserProfileForm)
    .post(authenticate, createUserProfile)

router
    .route("/user/profile")
    .get(authenticate, renderUserProfile)

router
    .route("/user/profile/:id")
    .get(authenticate, renderUserProfileById)

router
    .route("/user/create-article")
    .get(renderUserCreateArticle)
    .post(authenticate, fetchUserCreateArticle)

router
    .route("/api/v1/user/profile/:id")
    .get(fetchUserProfileById)


export default router;
