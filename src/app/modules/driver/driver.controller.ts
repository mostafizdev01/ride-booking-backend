import { NextFunction, Request, Response } from "express";
import { DriverServices } from "./driver.service";


const createDriver = async (req: Request, res: Response, next: NextFunction) => {
    const driver = await DriverServices.createDriver(req.body);
    res.status(201).json({ success: true, message: "✅ Driver create successfull", data: driver })
}

/// All Driver geting
const GetAllDriver = async (req: Request, res: Response, next: NextFunction) => {
    const driver = await DriverServices.GetAllDriver();
    res.status(200).json({ success: true, message: "✅ Driver Geting successfull", data: driver })
}

/// Single Driver geting
const GetSingleDriver = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const driver = await DriverServices.GetSigleDriver(id);
    res.status(200).json({ success: true, message: "✅ Driver Geting successfull", data: driver })
}

export const DriverControllers = {
    createDriver,
    GetAllDriver,
    GetSingleDriver
}