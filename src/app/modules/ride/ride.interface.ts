// ride.interface.ts
import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

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
  coordinates: [number, number]; 
}

export enum RideTypes {
  ECONOMY = "economy",
  COMFORT = "comfort",
  PREMIUM = "premium",
}


export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  fare: number;
  status: RideStatus;
  rideTypes: RideTypes;
  paymentMethod: "card" | "cash";
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
