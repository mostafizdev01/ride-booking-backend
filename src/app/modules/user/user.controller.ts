import { Request, Response } from "express";
import httpStatus, { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { UserServices } from "./user.service";

import { sendResponse } from "../../utilis/sendResponse";
import { catchAsync } from "../../utilis/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })
})

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await UserServices.getAllUsers(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

const approveDriver = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isApproved } = req.body;

    const driver = await UserServices.approveDriver(id, isApproved);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Driver approval status updated successfully",
        data: driver,
    });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await UserServices.blockUser(id, isBlocked);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User block status updated successfully",
        data: user,
    });
});
export const UserControllers = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
    blockUser,
    approveDriver
}
