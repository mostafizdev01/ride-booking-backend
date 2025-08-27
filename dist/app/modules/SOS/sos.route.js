"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOSRoutes = void 0;
const express_1 = require("express");
const sos_controller_1 = require("./sos.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), sos_controller_1.SOSControllers.createSOSRequest); // Activate SOS
router.get("/active", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), sos_controller_1.SOSControllers.getActiveSOSRequests); // List active SOS
router.patch("/resolve/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), sos_controller_1.SOSControllers.resolveSOSRequest); // Resolve SOS
exports.SOSRoutes = router;
