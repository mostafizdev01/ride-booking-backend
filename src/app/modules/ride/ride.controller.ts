import { NextFunction, Request, Response } from "express";
import { RiderServices } from "./ride.service";

/// create ride
const CreateRide = async (req: Request, res: Response, next: NextFunction) => {
    const ride = await RiderServices.CreateRide(req.body);
    res.status(201).json({ success: true, message: "✅ Ride send successfull", data: ride })
}

/// get all ride
const AllRides = async (req: Request, res: Response, next: NextFunction) => {
    const ride = await RiderServices.AllRides();
    res.status(200).json({ success: true, message: "✅ All Ride Readride success", data: ride })
}

// patch update ride
const UpdateRide = async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const ride = await RiderServices.UpdateRide(rideId, req.body);
    res.status(201).json({ success: true, message: "✅ Ride accept", data: ride })
}

// /// All Driver geting
// const GetAllDriver = async (req: Request, res: Response, next: NextFunction) => {
//     const driver = await DriverServices.GetAllDriver();
//     res.status(200).json({ success: true, message: "✅ Driver Geting successfull", data: driver })
// }

// /// Single Driver geting
// const GetSingleDriver = async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id
//     const driver = await DriverServices.GetSigleDriver(id);
//     res.status(200).json({ success: true, message: "✅ Driver Geting successfull", data: driver })
// }

export const RideControllers = {
    CreateRide,
    UpdateRide,
    AllRides
    // GetAllDriver,
    // GetSingleDriver
}