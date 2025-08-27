"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
// ride.model.ts
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const locationSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
}, { _id: false, versionKey: false });
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", index: true },
    pickupLocation: { type: locationSchema, required: true },
    destinationLocation: { type: locationSchema, required: true },
    fare: { type: Number, required: true },
    status: { type: String, enum: Object.values(ride_interface_1.RideStatus), default: ride_interface_1.RideStatus.REQUESTED, index: true },
    rideTypes: {
        type: String,
        enum: Object.values(ride_interface_1.RideTypes),
    },
    paymentMethod: { type: String, enum: ["card", "cash"], required: true },
    cancellationReason: { type: String },
    timestamps: {
        requestedAt: { type: Date, default: Date.now },
        acceptedAt: { type: Date },
        pickedUpAt: { type: Date },
        completedAt: { type: Date },
        canceledAt: { type: Date },
    },
    rating: {
        score: Number,
        feedback: String
    }
}, { timestamps: true, versionKey: false });
rideSchema.index({ pickupLocation: "2dsphere" });
rideSchema.index({ destinationLocation: "2dsphere" });
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
