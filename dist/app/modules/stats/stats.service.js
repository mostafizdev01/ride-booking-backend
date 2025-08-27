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
exports.StatsService = void 0;
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const user_model_1 = require("../user/user.model");
const getUserStats = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findById(id).lean().populate('rides');
    if (!user) {
        throw new Error("user not found");
    }
    const rides = (_a = user.rides) !== null && _a !== void 0 ? _a : [];
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const todayRides = rides.filter((r) => new Date(r.createdAt) >= todayStart && r.status === ride_interface_1.RideStatus.COMPLETED);
    const yesterdayRides = rides.filter((r) => new Date(r.createdAt) >= yesterdayStart &&
        new Date(r.createdAt) < todayStart &&
        r.status === ride_interface_1.RideStatus.COMPLETED);
    const todayEarnings = todayRides.reduce((sum, r) => sum + (r.fare || 0), 0);
    const yesterdayEarnings = yesterdayRides.reduce((sum, r) => sum + (r.fare || 0), 0);
    let earningsGrowth = 0;
    if (yesterdayEarnings === 0 && todayEarnings > 0)
        earningsGrowth = 100;
    else if (yesterdayEarnings > 0)
        earningsGrowth = ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100;
    const ratings = rides.filter((r) => { var _a; return (_a = r.rating) === null || _a === void 0 ? void 0 : _a.score; }).map((r) => r.rating.score);
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 ? ratings.reduce((a, b) => a + b, 0) / totalRatings : 0;
    const totalRequested = rides.length;
    const accepted = rides.filter((r) => { var _a; return (_a = r.timestamps) === null || _a === void 0 ? void 0 : _a.acceptedAt; }).length;
    const completed = rides.filter((r) => r.status === ride_interface_1.RideStatus.COMPLETED).length;
    const cancelled = rides.filter((r) => r.status === ride_interface_1.RideStatus.CANCELED).length;
    const acceptanceRate = totalRequested > 0 ? (accepted / totalRequested) * 100 : 0;
    const cancellationRate = totalRequested > 0 ? (cancelled / totalRequested) * 100 : 0;
    return {
        name: user.name,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        _id: user._id,
        role: user.role,
        totalEarnings: user.totalEarnings,
        todayEarnings,
        earningsGrowth: `${earningsGrowth.toFixed(1)}%`,
        ridesCompletedToday: todayRides.length,
        ridesCompletedYesterday: yesterdayRides.length,
        ridesChange: todayRides.length - yesterdayRides.length,
        averageRating: averageRating.toFixed(1),
        totalRatings,
        acceptanceRate: `${acceptanceRate.toFixed(0)}%`,
        cancellationRate: `${cancellationRate.toFixed(0)}%`,
        totalRides: completed,
    };
});
const getEarningsStats = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findById(id)
        .populate("rides")
        .lean();
    if (!user)
        throw new Error("User not found");
    const rides = (_a = user.rides) !== null && _a !== void 0 ? _a : [];
    // === Helper function to group array ===
    const groupBy = (arr, keyFn) => arr.reduce((acc, curr) => {
        const key = keyFn(curr);
        if (!acc[key])
            acc[key] = [];
        acc[key].push(curr);
        return acc;
    }, {});
    // === Today Earnings ===
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRides = rides.filter(r => r.status === ride_interface_1.RideStatus.COMPLETED && r.timestamps.completedAt >= todayStart);
    const todayEarnings = todayRides.reduce((sum, r) => sum + r.fare, 0);
    // === Weekly Earnings (last 7 days) ===
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);
    const weeklyRides = rides.filter(r => r.status === ride_interface_1.RideStatus.COMPLETED && r.timestamps.completedAt >= weekStart);
    const weeklyGrouped = groupBy(weeklyRides, r => r.timestamps.completedAt.toLocaleDateString("en-US", { weekday: "short" }));
    const weeklyData = Object.entries(weeklyGrouped).map(([day, rides]) => ({
        name: day,
        earnings: rides.reduce((sum, r) => sum + r.fare, 0),
        rides: rides.length,
        hours: rides.length * 1, // প্রতি ride ~1 hour
    }));
    // === Monthly Earnings (week-wise) ===
    const monthStart = new Date(todayStart);
    monthStart.setDate(1);
    const monthlyRides = rides.filter(r => r.status === ride_interface_1.RideStatus.COMPLETED && r.timestamps.completedAt >= monthStart);
    const monthlyGrouped = groupBy(monthlyRides, r => {
        const date = r.timestamps.completedAt.getDate();
        return `Week ${Math.ceil(date / 7)}`;
    });
    const monthlyData = Object.entries(monthlyGrouped).map(([week, rides]) => ({
        name: week,
        earnings: rides.reduce((sum, r) => sum + r.fare, 0),
        rides: rides.length,
        hours: rides.length * 1,
    }));
    // === Yearly Earnings (month-wise) ===
    const yearStart = new Date(todayStart.getFullYear(), 0, 1);
    const yearlyRides = rides.filter(r => r.status === ride_interface_1.RideStatus.COMPLETED && r.timestamps.completedAt >= yearStart);
    const yearlyGrouped = groupBy(yearlyRides, r => r.timestamps.completedAt.toLocaleDateString("en-US", { month: "short" }));
    const yearlyData = Object.entries(yearlyGrouped).map(([month, rides]) => ({
        name: month,
        earnings: rides.reduce((sum, r) => sum + r.fare, 0),
        rides: rides.length,
        hours: rides.length * 1,
    }));
    return {
        todayEarnings,
        weeklyData,
        monthlyData,
        yearlyData,
        totalEarnings: rides.reduce((sum, r) => sum + r.fare, 0),
        totalRides: rides.length,
    };
});
const getAnalytics = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (range = "7d") {
    var _a, _b;
    const days = range === "24h" ? 1 : parseInt(range.replace("d", ""), 10);
    const since = new Date();
    since.setDate(since.getDate() - days);
    // আগের same range
    const prevSince = new Date();
    prevSince.setDate(prevSince.getDate() - days * 2);
    // === Counts ===
    const totalUsers = yield user_model_1.User.countDocuments();
    const totalDrivers = yield user_model_1.User.countDocuments({ role: "DRIVER" });
    const totalRiders = yield user_model_1.User.countDocuments({ role: "RIDER" });
    const offlineDrivers = yield user_model_1.User.countDocuments({ role: "DRIVER", isActive: false });
    const onlineDrivers = yield user_model_1.User.countDocuments({ role: "DRIVER", isActive: true });
    const onlineRiders = yield user_model_1.User.countDocuments({ role: "RIDER", isActive: true });
    const offlineRiders = yield user_model_1.User.countDocuments({ role: "RIDER", isActive: false });
    // 🔹 Active Users (এই সময়ের)
    const activeUsersNow = yield user_model_1.User.countDocuments({ isActive: true, updatedAt: { $gte: since } });
    // 🔹 Active Users (আগের সময়ের)
    const activeUsersPrev = yield user_model_1.User.countDocuments({ isActive: true, updatedAt: { $gte: prevSince, $lt: since } });
    // % change হিসাব
    const activeUsersChange = activeUsersPrev > 0
        ? ((activeUsersNow - activeUsersPrev) / activeUsersPrev) * 100
        : 100;
    const activeUsersTrend = activeUsersChange > 0 ? "up" : activeUsersChange < 0 ? "down" : "neutral";
    // === Rides ===
    const activeRides = yield ride_model_1.Ride.countDocuments({
        status: { $in: [ride_interface_1.RideStatus.IN_TRANSIT, ride_interface_1.RideStatus.PICKED_UP] },
    });
    const completedRides = yield ride_model_1.Ride.countDocuments({ status: ride_interface_1.RideStatus.COMPLETED });
    const totalRides = yield ride_model_1.Ride.countDocuments();
    // === Revenue ===
    const revenueAgg = yield ride_model_1.Ride.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: null, total: { $sum: "$fare" } } },
    ]);
    const revenue = ((_a = revenueAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    // === Ratings ===
    const ratingsAgg = yield ride_model_1.Ride.aggregate([
        { $match: { createdAt: { $gte: since }, "rating.score": { $exists: true } } },
        { $group: { _id: null, avg: { $avg: "$rating.score" } } },
    ]);
    const avgRating = ((_b = ratingsAgg[0]) === null || _b === void 0 ? void 0 : _b.avg) || 0;
    // === Charts ===
    const ridesPerDay = yield ride_model_1.Ride.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const revenuePerDay = yield ride_model_1.Ride.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: "$fare" },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const userGrowth = yield user_model_1.User.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    return {
        totalUsers,
        totalDrivers,
        totalRiders,
        onlineDrivers,
        offlineDrivers,
        onlineRiders,
        offlineRiders,
        activeUsers: {
            value: activeUsersNow,
            change: Number(activeUsersChange.toFixed(1)),
            trend: activeUsersTrend,
        },
        activeRides,
        completedRides,
        totalRides: {
            value: totalRides,
            change: 5.2,
            trend: "up"
        },
        revenue: { value: revenue, change: 8.7, trend: "up" },
        avgRating: avgRating.toFixed(1),
        responseTime: "2.3 min",
        charts: {
            ridesPerDay,
            revenuePerDay,
            userGrowth,
        },
    };
});
exports.StatsService = {
    getUserStats,
    getEarningsStats,
    getAnalytics
};
