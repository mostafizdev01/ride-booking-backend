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
exports.rateDriver = exports.getDriverEarnings = exports.getAllRides = exports.getDriverRides = exports.getMyRides = exports.cancelRide = exports.updateRideStatus = exports.getSingleRideForRider = exports.getSingleRide = exports.acceptRide = exports.getNearbyRides = exports.requestRide = void 0;
const ride_service_1 = require("./ride.service");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../../utilis/catchAsync");
const sendResponse_1 = require("../../utilis/sendResponse");
// Rider: Request ride
exports.requestRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_service_1.RideService.requestRide(req.body, req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Ride requested successfully",
        data: ride,
    });
}));
// Driver: Get nearby rides
exports.getNearbyRides = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coordinates } = req.body;
    const rides = yield ride_service_1.RideService.getNearbyRides(coordinates);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Nearby rides fetched successfully",
        data: rides,
    });
}));
// Driver: Accept ride
exports.acceptRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideId } = req.params;
    const driverId = req.user.userId;
    const ride = yield ride_service_1.RideService.acceptRide(rideId, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride accepted successfully",
        data: ride,
    });
}));
// Get single ride for Driver
exports.getSingleRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const ride = yield ride_service_1.RideService.getSingleRide(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride fetched successfully",
        data: ride,
    });
}));
// Get single ride for Rider
exports.getSingleRideForRider = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.user.userId;
    const ride = yield ride_service_1.RideService.getSingleRider(riderId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride fetched successfully",
        data: ride,
    });
}));
// Driver: Update ride status
exports.updateRideStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const ride = yield ride_service_1.RideService.updateRideStatus(req.params.rideId, req.user.userId, status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride status updated successfully",
        data: ride,
    });
}));
// Rider: Cancel ride
exports.cancelRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body, req.params);
    const { reason } = req.body;
    const ride = yield ride_service_1.RideService.cancelRide(req.params.rideId, req.user.userId, reason);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride canceled successfully",
        data: ride,
    });
}));
// Rider: My ride history
exports.getMyRides = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_service_1.RideService.getMyRides(req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride history fetched successfully",
        data: rides,
    });
}));
exports.getDriverRides = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_service_1.RideService.getDriverRides(req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride history fetched successfully",
        data: rides,
    });
}));
// Get All Ride
const getAllRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ride_service_1.RideService.getAllRides(req.query);
        // console.log(result);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "All rides fetched successfully",
            data: result.data,
            meta: result.meta
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch rides",
            error: error
        });
    }
});
exports.getAllRides = getAllRides;
exports.getDriverEarnings = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const result = yield ride_service_1.RideService.getDriverEarnings(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Driver earnings fetched successfully",
        data: result,
    });
}));
// Rider: Rate Driver after ride completion
exports.rateDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { score, feedback } = req.body;
    const rideId = req.params.id;
    const riderId = req.user.userId;
    const ride = yield ride_service_1.RideService.rateDriver(rideId, riderId, score, feedback);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Driver rated successfully",
        data: ride,
    });
}));
