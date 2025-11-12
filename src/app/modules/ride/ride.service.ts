// ride.service.ts
import { Ride } from "./ride.model";
import { User } from "../user/user.model";
import { IRide, RideStatus } from "./ride.interface";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppHelpers";
import { StatusCodes } from "http-status-codes";
import { QueryBuilder } from "../../utilis/QueryBuilder";
import { rideSearchableFields } from "./ride.constant";

const requestRide = async (payload: Partial<IRide>, riderId: string) => {
  const activeRide = await Ride.findOne({
    rider: new Types.ObjectId(riderId),
    status: { $in: [RideStatus.REQUESTED, RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT] },
  });
  if (activeRide) throw new AppError(StatusCodes.BAD_REQUEST, "You already have an active ride");

  return await Ride.create({
    ...payload,
    rider: new Types.ObjectId(riderId),
    status: RideStatus.REQUESTED,
    timestamps: { requestedAt: payload.timestamps?.requestedAt || new Date() },
  });
};

const getNearbyRides = async (coordinates: [number, number]) => {
  return await Ride.find({
    status: RideStatus.REQUESTED,
    "pickupLocation.coordinates": {
      $near: {
        $geometry: { type: "Point", coordinates },
        $maxDistance: 50000,
      },
    },
  }).populate("rider", "name email phone");
};

const acceptRide = async (rideId: string, driverId: string) => {

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  if (ride.driver) throw new AppError(StatusCodes.BAD_REQUEST, "Ride already accepted");
  if (ride.status !== RideStatus.REQUESTED) throw new AppError(StatusCodes.BAD_REQUEST, "Ride cannot be accepted");

  const driver = await User.findById(driverId);
  if (!driver?.isActive || !driver?.isApproved)
    throw new AppError(StatusCodes.FORBIDDEN, "You are not allowed to accept rides");

  ride.status = RideStatus.ACCEPTED;
  ride.timestamps.acceptedAt = new Date();
  ride.driver = new Types.ObjectId(driverId);
  await ride.save();

  await User.findByIdAndUpdate(driverId, {
    $addToSet: { rides: ride._id }
  });

  await User.findByIdAndUpdate(ride.rider, {
    $addToSet: { rides: ride._id }
  });
  return ride;
};

const getSingleRide = async (driverId: string) => {
  
  console.log("driverId", driverId); 

  if (!driverId) throw new AppError(StatusCodes.BAD_REQUEST, "Driver ID is required");

  const ride = await Ride.find()
    .populate("rider", "name email phone")
    .populate("driver", "name email vehicleInfo")
    .sort({ createdAt: -1 });
  if (!ride) throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  return ride;
};

/// Accept rides

// const getSingleRide = async (driverId: string) => {
  
//   console.log("driverId", driverId); 

//   if (!driverId) throw new AppError(StatusCodes.BAD_REQUEST, "Driver ID is required");

//   const ride = await Ride.findOne({ driver: new Types.ObjectId(driverId) })
//     .populate("rider", "name email phone")
//     .populate("driver", "name email vehicleInfo")
//     .sort({ createdAt: -1 });
//   if (!ride) throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
//   if (ride.driver?._id?.toString() !== driverId)
//     throw new AppError(StatusCodes.FORBIDDEN, "You are not assigned to this ride");
//   return ride;
// };

const getSingleRider = async (riderId: string) => {

  if (!riderId) throw new AppError(StatusCodes.BAD_REQUEST, "Rider ID is required");

  const ride = await Ride.findOne({ rider: new Types.ObjectId(riderId) })
    .populate("rider", "name email phone")
    .populate("driver", "name email vehicleInfo")
    .sort({ createdAt: -1 });
  if (!ride) throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  if (ride.rider?._id?.toString() !== riderId)
    throw new AppError(StatusCodes.FORBIDDEN, "You are not assigned to this ride");
  return ride;
};

const updateRideStatus = async (rideId: string, driverId: string, status: RideStatus) => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  if (ride.driver?.toString() !== driverId)
    throw new AppError(StatusCodes.FORBIDDEN, "You are not assigned to this ride");

  const validStatuses = [RideStatus.PICKED_UP, RideStatus.IN_TRANSIT, RideStatus.COMPLETED];
  if (!validStatuses.includes(status))
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status update");

  ride.status = status;
  ride.timestamps[`${status}At` as keyof typeof ride.timestamps] = new Date();

  if (status === RideStatus.COMPLETED) {
    await User.findByIdAndUpdate(driverId, { $inc: { totalEarnings: ride.fare } });
  }

  await ride.save();
  return ride;
};

const cancelRide = async (rideId: string, riderId: string, reason?: string) => {
  const ride = await Ride.findById(rideId);
  // console.log(ride);
  if (!ride) throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  if (ride.rider.toString() !== riderId)
    throw new AppError(StatusCodes.FORBIDDEN, "You can't cancel this ride");
  if (ride.status !== RideStatus.REQUESTED)
    throw new AppError(StatusCodes.BAD_REQUEST, "Ride cannot be canceled now");

  ride.status = RideStatus.CANCELED;
  ride.timestamps.canceledAt = new Date();
  ride.cancellationReason = reason || "User canceled";
  await ride.save();

  return ride;
};

const getMyRides = async (riderId: string) => {
  return await Ride.find({ rider: new Types.ObjectId(riderId) }).populate("driver").populate("rider")
  .sort({ createdAt: -1 });
};

const getDriverRides = async (driverId: string) => {
  return await Ride.find({ driver: new Types.ObjectId(driverId) }).populate("rider")
  .sort({ createdAt: -1 });
};

const getAllRides = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Ride.find().populate("rider").populate("driver"),
    query
  );

  const ridesData = queryBuilder.filter()
  .search(rideSearchableFields).sort().fields().paginate();
  const [data, meta] = await Promise.all([ridesData.build(), queryBuilder.getMeta()]);
  return { data, meta };
};

const getDriverEarnings = async (driverId: string) => {
  const rides = await Ride.find({
    driver: new Types.ObjectId(driverId),
    status: RideStatus.COMPLETED,
  }).sort({ "timestamps.completedAt": -1 });

  const totalEarnings = rides.reduce((sum, ride) => sum + ride.fare, 0);

  return { totalEarnings, totalRides: rides.length, rides };
};

const rateDriver = async (
  rideId: string,
  riderId: string,
  score: number,
  feedback?: string
) => {
  const ride = await Ride.findById(rideId).populate("driver");
  if (!ride) throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");

  if (ride.rider.toString() !== riderId)
    throw new AppError(StatusCodes.FORBIDDEN, "You cannot rate this ride");

  if (ride.status !== RideStatus.COMPLETED)
    throw new AppError(StatusCodes.BAD_REQUEST, "You can only rate completed rides");

  if (ride.rating?.score)
    throw new AppError(StatusCodes.BAD_REQUEST, "You already rated this ride");

  ride.rating = { score, feedback };
  await ride.save();

  const driver = await User.findById(ride.driver);
  if (!driver) throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");

  const totalRatings = (driver.totalRatings || 0) + 1;
  const totalScore = (driver.averageRating || 0) * (driver.totalRatings || 0) + score;
  const averageRating = totalScore / totalRatings;

  driver.totalRatings = totalRatings;
  driver.averageRating = averageRating;
  await driver.save();

  return ride;
};


export const RideService = {
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
