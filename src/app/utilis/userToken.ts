import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppHelpers";
import { IUser } from "../modules/user/user.interface";
import { genarateToken, verifiedToken } from "./jwt";
import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";

export const createUserToken = (user: Partial<IUser>) => {
    const jWtPayload = {
        email: user.email,
        userId: user._id,
        role: user.role
    }

    const accessToken = genarateToken(jWtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = genarateToken(jWtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    const verifiedRefreshToken = verifiedToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload


    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    if (!isUserExist.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is InActive`)
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = genarateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accessToken
}