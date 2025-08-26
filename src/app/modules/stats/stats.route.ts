import express from "express";
import { StatsController } from "./stats.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();


// router.get(
//     "/payment",
//     checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//     StatsController.getPaymentStats
// );
router.get(
    "/user",
    checkAuth(...Object.values(Role)),
    StatsController.getUserStats
);

router.get(
    "/earnings",
    checkAuth(...Object.values(Role)),
    StatsController.getEarningStats
);

router.get(
  "/analytics",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getAdminAnalytics
)

export const StatsRoutes = router;