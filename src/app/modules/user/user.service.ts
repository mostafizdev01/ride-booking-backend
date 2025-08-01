import bcryptjs from "bcryptjs";
import httpStatus, { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { userSearchableFields } from "./user.constant";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errorHelpers/AppHelpers";
import { QueryBuilder } from "../../utilis/QueryBuilder";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }


    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user

}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const ifUserExist = await User.findById(userId);
    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    // Role update restrictions
    if (payload.role) {
        if ([Role.RIDER, Role.DRIVER].includes(decodedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to change roles");
        }
        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to assign SUPER_ADMIN");
        }
    }

    // Boolean field updates (proper check)
    if (["isActive", "isBlocked", "isVerified"].some(key => Object.keys(payload).includes(key))) {
        if ([Role.RIDER, Role.DRIVER].includes(decodedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to change these fields");
        }
    }

    // Validate Geo location if updating
    if (payload.currentLocation) {
        if (!payload.currentLocation.coordinates || payload.currentLocation.coordinates.length !== 2) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid location coordinates");
        }
    }

    // Hash password if updating
    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND));
    }

    const newUpdatedUser = await User.findByIdAndUpdate(
        userId,
        payload,
        { new: true, runValidators: true }
    );

    if (!newUpdatedUser) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update user");
    }

    return newUpdatedUser;
};

const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};

const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password").populate("rides");
    return {
        data: user
    }
};


const approveDriver = async (driverId: string, isApproved: boolean) => {
    const driver = await User.findById(driverId);
    if (!driver) {
        throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
    }

    if (driver.role !== Role.DRIVER) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This user is not a driver");
    }

    driver.isApproved = isApproved;
    await driver.save();

    return driver;
};

const blockUser = async (userId: string, isBlocked: boolean) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    user.isBlocked = isBlocked;
    await user.save();

    return user;
};

export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
    blockUser,
    approveDriver
}