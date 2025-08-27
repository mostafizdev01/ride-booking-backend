import { Router } from "express";
import { SOSControllers } from "./sos.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/",checkAuth(...Object.values(Role)), SOSControllers.createSOSRequest); // Activate SOS
router.get("/active", checkAuth(...Object.values(Role)), SOSControllers.getActiveSOSRequests); // List active SOS
router.patch("/resolve/:id", checkAuth(...Object.values(Role)), SOSControllers.resolveSOSRequest); // Resolve SOS

export const SOSRoutes = router