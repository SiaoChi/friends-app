import { Router , Response , Request } from "express";
// import { body } from "express-validator";
import { getLogInPage , signUp ,signIn , createUserProfile ,getUserProfileById } from "../controllers/user.js"
import { get } from "http";


const router = Router();

router
    .route("/api/v1/user/profile/:id")
    .get(getUserProfileById)

router
    .route("/user/signup")  // Native
    .get(getLogInPage)
    .post([signUp]);

router
    .route("/user/signin")  // signIn facebook or Google or Native
    .get(getLogInPage)
    .post([signIn])

router
    .route("/user/profile")
    .get((req,res)=>{ res.render('userProfile') })
    .post(createUserProfile)

export default router;
