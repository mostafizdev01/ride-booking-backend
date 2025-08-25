import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppHelpers";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { verifiedToken } from "../utilis/jwt";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken

        if (!accessToken) {
            throw new AppError(httpStatus.BAD_REQUEST, "No Token Recieved")
        }
        const verifyToken = verifiedToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({ email: verifyToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        }
        // if (isUserExist.isActive === false) {
        //     throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        // }
        if (!authRoles.includes(verifyToken.role)) {
            console.log(authRoles.includes(verifyToken.role));
            throw new AppError(httpStatus.BAD_REQUEST, "You are not promoted in this user")
        }

        req.user = verifyToken

        next()
    } catch (error) {
        next(error)
    }
}
