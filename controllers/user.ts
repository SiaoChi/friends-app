import { Request, Response, NextFunction } from "express";
import * as userLoginModel from "../models/userLogin.js"
import * as userModel from "../models/user.js"
import { generateToken, EXPIRE_TIME } from "../utils/generateToken.js"

export function getLogInPage(req: Request, res: Response) {
    res.render('login')
}

// signUp = Native
export async function signUp(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;
        const userId = await userModel.createUser(name, email);
        await userLoginModel.createNativeProvider(userId, password);
        const token = generateToken(userId);
        const url = "/user/profile" //填寫表單頁面
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
                    next: url,
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
        const token = generateToken(user.id)
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
                }
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
    // const { } = req.body
    return;
}


export async function getUserProfileById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userProfile = await userModel.getUserProfileData(parseInt(id));
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