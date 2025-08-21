// ride.model.ts
import { Schema, model } from "mongoose";
import { IRide, ILocation, RideStatus, RideTypes } from "./ride.interface";

const locationSchema = new Schema<ILocation>(
  {
    address: { type: String, required: true },
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, 
  },
  { _id: false, versionKey: false }
);

const rideSchema = new Schema<IRide>(
  {
    rider: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    driver: { type: Schema.Types.ObjectId, ref: "User", index: true },
    pickupLocation: { type: locationSchema, required: true },
    destinationLocation: { type: locationSchema, required: true },
    fare: { type: Number, required: true },
    status: { type: String, enum: Object.values(RideStatus), default: RideStatus.REQUESTED, index: true },
    rideTypes: {
      type: String,
      enum: Object.values(RideTypes),
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
  },
  { timestamps: true, versionKey: false }
);

rideSchema.index({ pickupLocation: "2dsphere" });
rideSchema.index({ destinationLocation: "2dsphere" });

export const Ride = model<IRide>("Ride", rideSchema);
