"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = __importDefault(require("express"));
const driver_controller_1 = require("./driver.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
// 🔐 All routes are protected and require "driver" role
router.get("/profile", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.getProfile);
router.get("/rides", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.getRides);
router.get("/earnings", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.getEarnings);
router.patch("/availability", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.toggleAvailability);
exports.DriverRoutes = router;
