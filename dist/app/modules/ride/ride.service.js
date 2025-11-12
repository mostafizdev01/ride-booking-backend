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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
// ride.service.ts
const ride_model_1 = require("./ride.model");
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
const mongoose_1 = require("mongoose");
const AppHelpers_1 = __importDefault(require("../../errorHelpers/AppHelpers"));
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = require("../../utilis/QueryBuilder");
const ride_constant_1 = require("./ride.constant");
const requestRide = (payload, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const activeRide = yield ride_model_1.Ride.findOne({
        rider: new mongoose_1.Types.ObjectId(riderId),
        status: { $in: [ride_interface_1.RideStatus.REQUESTED, ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT] },
    });
    if (activeRide)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You already have an active ride");
    return yield ride_model_1.Ride.create(Object.assign(Object.assign({}, payload), { rider: new mongoose_1.Types.ObjectId(riderId), status: ride_interface_1.RideStatus.REQUESTED, timestamps: { requestedAt: ((_a = payload.timestamps) === null || _a === void 0 ? void 0 : _a.requestedAt) || new Date() } }));
});
const getNearbyRides = (coordinates) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find({
        status: ride_interface_1.RideStatus.REQUESTED,
        "pickupLocation.coordinates": {
            $near: {
                $geometry: { type: "Point", coordinates },
                $maxDistance: 50000,
            },
        },
    }).populate("rider", "name email phone");
});
const acceptRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    if (ride.driver)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Ride already accepted");
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Ride cannot be accepted");
    const driver = yield user_model_1.User.findById(driverId);
    if (!(driver === null || driver === void 0 ? void 0 : driver.isActive) || !(driver === null || driver === void 0 ? void 0 : driver.isApproved))
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not allowed to accept rides");
    ride.status = ride_interface_1.RideStatus.ACCEPTED;
    ride.timestamps.acceptedAt = new Date();
    ride.driver = new mongoose_1.Types.ObjectId(driverId);
    yield ride.save();
    yield user_model_1.User.findByIdAndUpdate(driverId, {
        $addToSet: { rides: ride._id }
    });
    yield user_model_1.User.findByIdAndUpdate(ride.rider, {
        $addToSet: { rides: ride._id }
    });
    return ride;
});
const getSingleRide = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!driverId)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Driver ID is required");
    const ride = yield ride_model_1.Ride.findOne({ driver: new mongoose_1.Types.ObjectId(driverId) })
        .populate("rider", "name email phone")
        .populate("driver", "name email vehicleInfo")
        .sort({ createdAt: -1 });
    if (!ride)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    if (((_b = (_a = ride.driver) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) !== driverId)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not assigned to this ride");
    return ride;
});
const getSingleRider = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!riderId)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Rider ID is required");
    const ride = yield ride_model_1.Ride.findOne({ rider: new mongoose_1.Types.ObjectId(riderId) })
        .populate("rider", "name email phone")
        .populate("driver", "name email vehicleInfo")
        .sort({ createdAt: -1 });
    if (!ride)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    if (((_b = (_a = ride.rider) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) !== riderId)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not assigned to this ride");
    return ride;
});
const updateRideStatus = (rideId, driverId, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    if (((_a = ride.driver) === null || _a === void 0 ? void 0 : _a.toString()) !== driverId)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not assigned to this ride");
    const validStatuses = [ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT, ride_interface_1.RideStatus.COMPLETED];
    if (!validStatuses.includes(status))
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid status update");
    ride.status = status;
    ride.timestamps[`${status}At`] = new Date();
    if (status === ride_interface_1.RideStatus.COMPLETED) {
        yield user_model_1.User.findByIdAndUpdate(driverId, { $inc: { totalEarnings: ride.fare } });
    }
    yield ride.save();
    return ride;
});
const cancelRide = (rideId, riderId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    // console.log(ride);
    if (!ride)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    if (ride.rider.toString() !== riderId)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You can't cancel this ride");
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Ride cannot be canceled now");
    ride.status = ride_interface_1.RideStatus.CANCELED;
    ride.timestamps.canceledAt = new Date();
    ride.cancellationReason = reason || "User canceled";
    yield ride.save();
    return ride;
});
const getMyRides = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find({ rider: new mongoose_1.Types.ObjectId(riderId) }).populate("driver").populate("rider")
        .sort({ createdAt: -1 });
});
const getDriverRides = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find({ driver: new mongoose_1.Types.ObjectId(driverId) }).populate("rider")
        .sort({ createdAt: -1 });
});
const getAllRides = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.Ride.find().populate("rider").populate("driver"), query);
    const ridesData = queryBuilder.filter()
        .search(ride_constant_1.rideSearchableFields).sort().fields().paginate();
    const [data, meta] = yield Promise.all([ridesData.build(), queryBuilder.getMeta()]);
    return { data, meta };
});
const getDriverEarnings = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({
        driver: new mongoose_1.Types.ObjectId(driverId),
        status: ride_interface_1.RideStatus.COMPLETED,
    }).sort({ "timestamps.completedAt": -1 });
    const totalEarnings = rides.reduce((sum, ride) => sum + ride.fare, 0);
    return { totalEarnings, totalRides: rides.length, rides };
});
const rateDriver = (rideId, riderId, score, feedback) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.Ride.findById(rideId).populate("driver");
    if (!ride)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    if (ride.rider.toString() !== riderId)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You cannot rate this ride");
    if (ride.status !== ride_interface_1.RideStatus.COMPLETED)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can only rate completed rides");
    if ((_a = ride.rating) === null || _a === void 0 ? void 0 : _a.score)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You already rated this ride");
    ride.rating = { score, feedback };
    yield ride.save();
    const driver = yield user_model_1.User.findById(ride.driver);
    if (!driver)
        throw new AppHelpers_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
    const totalRatings = (driver.totalRatings || 0) + 1;
    const totalScore = (driver.averageRating || 0) * (driver.totalRatings || 0) + score;
    const averageRating = totalScore / totalRatings;
    driver.totalRatings = totalRatings;
    driver.averageRating = averageRating;
    yield driver.save();
    return ride;
});
exports.RideService = {
    requestRide,
    getNearbyRides,
    acceptRide,
    getSingleRide,
    getSingleRider,
    updateRideStatus,
    cancelRide,
    getMyRides,
    getAllRides,
    getDriverEarnings,
    rateDriver,
    getDriverRides
};
