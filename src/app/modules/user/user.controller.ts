import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)
    res.status(201).json({
        status: "Success",
        message: "✅ Registration successfull",
        data: user
    })
}

/// get allUsers
const allUsers = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.allUser()
    res.status(201).json({
        status: "Success",
        message: "✅ All User Geting successfull",
        data: user
    })
}

/// get single User
const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserServices.getSingleUser(req.body)

    res.status(201).json({
        status: "Success",
        message: "✅ Single User geting successfull",
        data: user
    })
}

/// Update User
const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;
    const payload = req.body;

    const user = await UserServices.UpdateUser(userId, payload)

    res.status(201).json({
        status: "Success",
        message: "✅ Update successfull",
        data: user
    })
}

export const UserControllers = {
    createUser,
    allUsers,
    getSingleUser,
    UpdateUser
}