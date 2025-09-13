import { Types } from "mongoose"


export enum IRiderStatus {
    Requested = "Requested",
    Accepted = "Accepted",
    Picked_up = "Picked_up",
    In_transit = "In_transit",
    Completed = "Completed",
    Canceled = "Canceled"
}

export interface IRider {
    user: Types.ObjectId,
    driver?: Types.ObjectId,
    pickup: { lat: Number, lng: Number },
    destination: { lat: Number, lng: Number },
    status: IRiderStatus, // requested, accepted, picked_up, in_transit, completed, canceled
    timestamps: {
        requestedAt: Date,
        acceptedAt: Date,
        pickedUpAt: Date,
        completedAt: Date,
        canceledAt: Date
    }
}