import { model, Schema, Types } from "mongoose";
import { IApprovalStatus, IDriver, IStatus } from "./driver.interface";


const driverSchema = new Schema<IDriver>({
    userId: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    vehicleInfo: {type: String, required: true},
    approvalStatus: {type: String, enum: Object.values(IApprovalStatus), default: IApprovalStatus.PENDING},
    earnings: {type: Number, required: true},
    isOnline: {type: Boolean, },
    status: {type: String, enum: Object.values(IStatus)},
})

export const Driver = model<IDriver>("Driver", driverSchema)