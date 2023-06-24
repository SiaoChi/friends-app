import { Router } from "express";
import * as adminFunctions from "../controllers/admin.js"

const router = Router();

router
    .route("/admin")
    .get((req,res)=>{ res.render('admin')})

router
    .route("/admin/tags")
    .get((req,res)=>{ res.render('createTags')})
    .post(adminFunctions.createSickTag)


export default router;
