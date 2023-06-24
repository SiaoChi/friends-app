import { Router } from "express";


const router = Router();

router
    .route("/")
    .get((req, res) => { res.render('index') })

router
    .route("/about")
    .get((req, res) => { res.render('about') })


export default router;