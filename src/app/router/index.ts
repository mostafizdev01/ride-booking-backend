import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { RideRoutes } from "../modules/ride/ride.route";
import { StatsRoutes } from "../modules/stats/stats.route";

const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path : "/auth",
        route: AuthRoutes
    },
    {
        path: "/ride",
        route: RideRoutes
    },
    {
        path : "/stats",
        route: StatsRoutes
    }
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
export default router;
