"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const stats_controller_1 = require("./stats.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
// router.get(
//     "/payment",
//     checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//     StatsController.getPaymentStats
// );
router.get("/user", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), stats_controller_1.StatsController.getUserStats);
router.get("/earnings", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), stats_controller_1.StatsController.getEarningStats);
router.get("/analytics", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getAdminAnalytics);
exports.StatsRoutes = router;
