"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideTypes = exports.RideStatus = void 0;
var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "requested";
    RideStatus["ACCEPTED"] = "accepted";
    RideStatus["PICKED_UP"] = "picked_up";
    RideStatus["IN_TRANSIT"] = "in_transit";
    RideStatus["COMPLETED"] = "completed";
    RideStatus["CANCELED"] = "canceled";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
var RideTypes;
(function (RideTypes) {
    RideTypes["ECONOMY"] = "economy";
    RideTypes["COMFORT"] = "comfort";
    RideTypes["PREMIUM"] = "premium";
})(RideTypes || (exports.RideTypes = RideTypes = {}));
