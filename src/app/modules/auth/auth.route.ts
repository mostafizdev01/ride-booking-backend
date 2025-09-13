import { Router } from "express";
import { AuthControllers } from "./auth.controller";


const router = Router()

router.post("/login", AuthControllers.credetialsLoginWithPassportJs)
// router.patch("/update-ride/:id", RideControllers.UpdateRide)
// router.get("/all-ride", RideControllers.AllRides)
// router.get("/get-driver", DriverControllers.GetAllDriver)
// router.get("/:id", DriverControllers.GetSingleDriver)

export const AuthRoutes = router