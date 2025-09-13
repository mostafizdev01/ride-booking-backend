import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { DriverRoutes } from "../modules/driver/driver.route"
import { RiderRoutes } from "../modules/ride/ride.route"


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
        route: RiderRoutes
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