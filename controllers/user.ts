import { Request, Response, NextFunction } from "express";
import * as userLoginModel from "../models/userLogin.js"
import * as userModel from "../models/user.js"
import * as articleModel from "../models/articles.js"
import { generateToken, EXPIRE_TIME } from "../utils/generateToken.js"
import { RowDataPacket } from 'mysql2';


export function getLogInPage(req: Request, res: Response) {
    const userId = res.locals;
    if(userId) return res.redirect('/user/profile')
    res.render('login')
}

// signUp = Native
export async function signUp(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;
        const userId = await userModel.createUser(name, email);
        await userLoginModel.createNativeProvider(userId, password);
        const token = generateToken(userId);
        const url = "/user/profile/form"; //填寫表單頁面
        res
            .cookie("jwtToken", token)
            .status(200)
            .json({
                data: {
                    access_token: token,
                    access_expired: EXPIRE_TIME,
                    user: {
                        id: userId,
                        provider: "native",
                        name,
                        email
                    },
                    redirectUrl: url
                }
            })
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
        res.status(500).json({ errors: "sign up failed" })
    }
}

export async function signIn(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            throw new Error("user not exist");
        }
        const isValidPassword = await userLoginModel.checkNativeProviderToken(user.id, password);
        if (!isValidPassword) {
            throw new Error("invalid password");
        }
        const token = generateToken(user.id);
        const url = "/user/profile";
        // console.log('user',user);
        res
            .cookie("jwtToken", token)
            .status(200)
            .json({
                data: {
                    access_token: token,
                    access_expired: EXPIRE_TIME,
                    user: {
                        ...user,
                        provider: "Native"
                    }
                },
                redirectUrl: url
            })
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message })
            return;
        }
        res.status(500).json({ errors: "sign in failed" })
    }
}

export async function createUserProfile(req: Request, res: Response) {
    const { name, picture, birth, email, location, sickYear, carer, level, currentProblems, tags, } = req.body
    let userPhotoPath = picture;
    // console.log('userPhotoPath-->',userPhotoPath);
    const uploadImages = res.locals.imagePath;
    // console.log('Profile->imagePath-->',uploadImages);
    const userId = res.locals.userId;

    if(uploadImages){
        console.log('uploads-->',uploadImages);
            userPhotoPath = uploadImages;     
    }

    await userModel.updateUserProfile(
        name,
        userPhotoPath,
        birth,
        email,
        location,
        sickYear,
        carer,
        level,
        currentProblems,
        tags,
        userId
    )

    const url = '/user/profile'

    res.redirect(url);
}


export async function fetchUserProfileById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userProfile = await userModel.getUserProfileTagsData(parseInt(id));
        if (Array.isArray(userProfile) && userProfile.length > 0) return res.status(200).json(userProfile);
        throw new Error("id is not existed")
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message })
            return;
        }
        res.status(500).json({ errors: "getUserProfileById failed" })

    }
}

export async function renderUserProfileForm(req: Request, res: Response) {
    try {
        const { userId } = res.locals;
        const tags = await userModel.getTags();
        const userData = await userModel.getUserProfileTagsData(userId)
        console.log('userDataAndTags->',userData);
        // 如果希望在edict時加入user已知資料
        res.render('userProfileForm', { tags, userData })
    } catch (err) {
        res.status(500).json({ errors: "renderUserProfileForm failed" })
    }
}

export async function renderUserProfile(req: Request, res: Response) {
    const userId = res.locals.userId;
    const userProfile = await userModel.getUserProfileTagsData(userId) as RowDataPacket[];
    const userArticles = await articleModel.getUserArticlesData(userId) as RowDataPacket[];
    res.render('userProfile', { userProfile , userArticles})
}

export async function renderUserProfileById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userProfile = await userModel.getUserProfileTagsData(parseInt(id)) as RowDataPacket[];
        const userArticles = await articleModel.getUserArticlesData(parseInt(id)) as RowDataPacket[];
        if (Array.isArray(userProfile) && userProfile.length > 0) {
            return res.render('userProfileById', { userProfile , userArticles })
        }
        throw new Error("id is not existed")
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message })
            return;
        }
        res.status(500).json({ errors: "getUserProfileById failed" })
    }
}