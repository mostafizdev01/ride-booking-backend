import { Router } from "express";
import { DriverControllers } from "./driver.controller";


const router = Router()

router.post("/create-driver", DriverControllers.createDriver)
router.get("/get-driver", DriverControllers.GetAllDriver)
router.get("/:id", DriverControllers.GetSingleDriver)

export const DriverRoutes = router