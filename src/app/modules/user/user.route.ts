import { Router } from "express";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "./user.validation";


const router = Router()

router.post("/register",
    validateRequest(createUserZodSchema),
    UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getSingleUser)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)
router.patch("/drivers/:id/approve", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.approveDriver);
router.patch("/users/:id/block", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.blockUser);
export const UserRoutes = router