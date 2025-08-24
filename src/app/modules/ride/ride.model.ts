import { model, Schema } from "mongoose";
import { IRider, IRiderStatus } from "./ride.interface";


const rideSchema = new Schema<IRider>({
    driver: {
        type: Schema.Types.ObjectId,
        ref: "driver",
        required: true
    },
    pickup: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    destination: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    status: {
        type: String,
        enum: Object.values(IRiderStatus),
        default: IRiderStatus.Requested
    },
    timestamps: {
        requestedAt: { type: Date, default: () => new Date() },
        acceptedAt: Date,
        pickedUpAt: Date,
        completedAt: Date,
        canceledAt: Date
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Ride = model<IRider>("Ride", rideSchema)