import { Router } from "express";
import { UserControllers } from "./user.controller";


const router = Router()

router.post("/register", UserControllers.createUser)
router.get("/all-users", UserControllers.allUsers)
router.get("/single-user", UserControllers.getSingleUser)
router.patch("/:id", UserControllers.UpdateUser)
router.delete("/:id", UserControllers.DeleteUser)

export const UserRoutes = router