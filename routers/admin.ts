import { Router } from "express";

const router = Router();

router.route("/admin").get((req,res)=>{ res.render('admin')})

export default router;
