// controllers/stats.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { sendResponse } from "../../utilis/sendResponse";
import { StatsService } from "./stats.service";



// const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
//     const stats = await StatsService.getPaymentStats();
//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "Payment stats fetched successfully",
//         data: stats,
//     });
// });

const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const id = (req.user as any).userId;
    console.log(id);
    const stats = await StatsService.getUserStats(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});

const getEarningStats = catchAsync(async (req: Request, res: Response) => {
    const id = (req.user as any).userId;
    const stats = await StatsService.getEarningsStats(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Earnings stats fetched successfully",
        data: stats,
    });
});

export const StatsController = {
    getUserStats,
    getEarningStats
};