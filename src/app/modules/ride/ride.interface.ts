// ride.interface.ts
import { Types } from "mongoose";

export enum RideStatus {
  REQUESTED = "requested",
  ACCEPTED = "accepted",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export interface ILocation {
  address: string;
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  fare: number;
  status: RideStatus;
  cancellationReason?: string;
  rating?: {
    score: number;
    feedback?: string;
  };
  timestamps: {
    requestedAt?: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    completedAt?: Date;
    canceledAt?: Date;
  };
}
