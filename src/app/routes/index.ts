import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { DriverRoutes } from "../modules/driver/driver.route"


export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: UserRoutes
    },
    {
        path: "/rider",
        route: UserRoutes
    },
    {
        path: "/driver",
        route: DriverRoutes
    },
    {
        path: "/admin",
        route: UserRoutes
    },
]

    moduleRoutes.forEach((route)=> {
        router.use(route.path, route.route)
    })