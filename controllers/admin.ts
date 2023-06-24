import { Request, Response } from "express"
import * as adminModel from "../models/admin.js"

export async function createSickTag(req: Request, res: Response) {
    try {
        const { tag } = req.body;
        await adminModel.createSickTag(tag);
        res.status(200).json({
            message: "createSickTag success"
        })
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ errors: err.message });
            return;
        }
    }
    res.status(500).json({ errors: "createSickTag failed" })
}