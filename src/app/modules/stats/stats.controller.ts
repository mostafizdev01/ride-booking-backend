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

const getAdminAnalytics = async (req: Request, res: Response) => {
  try {
    const { range = "7d" } = req.query
    const analytics = await StatsService.getAnalytics(range as string)
    res.json(analytics)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching analytics" })
  }
}

export const StatsController = {
    getUserStats,
    getEarningStats,
    getAdminAnalytics
};