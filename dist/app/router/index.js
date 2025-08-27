"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const ride_route_1 = require("../modules/ride/ride.route");
const stats_route_1 = require("../modules/stats/stats.route");
const sos_route_1 = require("../modules/SOS/sos.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/ride",
        route: ride_route_1.RideRoutes
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRoutes
    },
    {
        path: "/sos",
        route: sos_route_1.SOSRoutes
    }
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
