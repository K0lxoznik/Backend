import { Response } from "express";

export const send500Error = (res: Response): void => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};