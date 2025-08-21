import { Request, Response } from "express";
import { RideService } from "./ride.service";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utilis/catchAsync";
import { sendResponse } from "../../utilis/sendResponse";

// Rider: Request ride
export const requestRide = catchAsync(async (req: Request, res: Response) => {
  const ride = await RideService.requestRide(req.body, (req.user as any).userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Ride requested successfully",
    data: ride,
  });
});

// Driver: Get nearby rides
export const getNearbyRides = catchAsync(async (req: Request, res: Response) => {

  const { coordinates } = req.body;
  console.log(req.body);
  const rides = await RideService.getNearbyRides(coordinates);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Nearby rides fetched successfully",
    data: rides,
  });
});

// Driver: Accept ride
export const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const driverId = (req.user as any).userId

  const ride = await RideService.acceptRide(rideId, driverId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Ride accepted successfully",
    data: ride,
  });
});

// Driver: Update ride status
export const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const ride = await RideService.updateRideStatus(req.params.rideId, (req.user as any).userId, status);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Ride status updated successfully",
    data: ride,
  });
});

// Rider: Cancel ride
export const cancelRide = catchAsync(async (req: Request, res: Response) => {
  const { reason } = req.body;
  const ride = await RideService.cancelRide(req.params.rideId, (req.user as any).userId, reason);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Ride canceled successfully",
    data: ride,
  });
});

// Rider: My ride history
export const getMyRides = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getMyRides((req.user as any).userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Ride history fetched successfully",
    data: rides,
  });
});

// Get All Ride
export const getAllRides = async (req: Request, res: Response) => {
  try {
    const result = await RideService.getAllRides(req.query as Record<string, string>);
    console.log(result);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "All rides fetched successfully",
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch rides",
      error: error
    });
  }
};

export const getDriverEarnings = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req.user as any).userId
  const result = await RideService.getDriverEarnings(driverId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Driver earnings fetched successfully",
    data: result,
  });
});


// Rider: Rate Driver after ride completion
export const rateDriver = catchAsync(async (req: Request, res: Response) => {
  const { score, feedback } = req.body;
  const rideId = req.params.id;
  const riderId = (req.user as any).userId;

  const ride = await RideService.rateDriver(rideId, riderId, score, feedback);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Driver rated successfully",
    data: ride,
  });
});
