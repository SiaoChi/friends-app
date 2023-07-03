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
} from "../controllers/user.js"
import {
    renderUserCreateArticle,
    fetchUserCreateArticle
} from "../controllers/articles.js"
import authenticate from "../middleware/authenticate.js";
import * as imageHandler from "../middleware/imageHandler.js"
import * as s3handler from "../models/s3.js"

// import multer from "multer";

// const upload = multer({ dest: './public/uploads/' })

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
    .post(authenticate, 
        imageHandler.uploadToBuffer.single('upload'),  //req.file 是 `upload` 文件
        imageHandler.checkFileType , // 檢查檔案是否符合規格
        imageHandler.saveUserPhotoToS3, // 如果檔案存在，檔案會被存在S3
        createUserProfile)

router
    .route("/user/profile")
    .get(authenticate, renderUserProfile)

router
    .route("/user/profile/:id")
    .get(authenticate, renderUserProfileById)

router
    .route("/user/create-article")
    .get(authenticate, renderUserCreateArticle)
    .post(authenticate, fetchUserCreateArticle)

router
    .route("/api/v1/user/profile/:id")
    .get(authenticate, fetchUserProfileById)


export default router;
