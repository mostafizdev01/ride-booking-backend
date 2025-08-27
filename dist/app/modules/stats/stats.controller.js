"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const catchAsync_1 = require("../../utilis/catchAsync");
const sendResponse_1 = require("../../utilis/sendResponse");
const stats_service_1 = require("./stats.service");
// const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
//     const stats = await StatsService.getPaymentStats();
//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "Payment stats fetched successfully",
//         data: stats,
//     });
// });
const getUserStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.userId;
    const stats = yield stats_service_1.StatsService.getUserStats(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
}));
const getEarningStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.userId;
    const stats = yield stats_service_1.StatsService.getEarningsStats(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Earnings stats fetched successfully",
        data: stats,
    });
}));
const getAdminAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { range = "7d" } = req.query;
        const analytics = yield stats_service_1.StatsService.getAnalytics(range);
        res.json(analytics);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching analytics" });
    }
});
exports.StatsController = {
    getUserStats,
    getEarningStats,
    getAdminAnalytics
};
