import { Router } from "express";
import * as homePageFunction from "../controllers/home.js"


const router = Router();

router
    .route("/")
    .get((req, res) => { res.render('index') })

router
    .route("/about")
    .get((req, res) => { res.render('about') })

router
    .route("/articles")
    .get(homePageFunction.renderArticles)

    router
    .route("/articles/:id")
    .get(homePageFunction.renderArticleByID)


export default router;