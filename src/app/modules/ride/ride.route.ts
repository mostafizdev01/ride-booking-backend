import { Router } from "express";
import { requestRide, getNearbyRides, acceptRide, updateRideStatus, cancelRide, getMyRides, getAllRides, getDriverEarnings, rateDriver, getSingleRide, getDriverRides, getSingleRideForRider } from "./ride.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post("/request", checkAuth(Role.RIDER), requestRide);
router.post("/nearby", checkAuth(Role.DRIVER), getNearbyRides);
router.get("/driver/active-ride", checkAuth(Role.DRIVER), getSingleRide);
router.get("/rider/active-ride", checkAuth(Role.RIDER), getSingleRideForRider);
router.get("/earnings", checkAuth(Role.DRIVER), getDriverEarnings);
router.get("/me/history", checkAuth(Role.RIDER), getMyRides);
router.get("/driver/history", checkAuth(Role.DRIVER), getDriverRides);
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getAllRides);
router.patch("/:rideId/accept", checkAuth(Role.DRIVER), acceptRide);
router.patch("/:rideId/status", checkAuth(Role.DRIVER), updateRideStatus);
router.patch("/:rideId/cancel", checkAuth(Role.RIDER), cancelRide);
router.patch("/:id/rate", checkAuth(Role.RIDER), rateDriver);

export const RideRoutes = router;
