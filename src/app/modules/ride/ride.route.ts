import { Router } from "express";
import { RideControllers } from "./ride.controller";


const router = Router()

router.post("/create-ride", RideControllers.CreateRide)
router.patch("/update-ride/:id", RideControllers.UpdateRide)
router.get("/all-ride", RideControllers.AllRides)
// router.get("/get-driver", DriverControllers.GetAllDriver)
// router.get("/:id", DriverControllers.GetSingleDriver)

export const RiderRoutes = router