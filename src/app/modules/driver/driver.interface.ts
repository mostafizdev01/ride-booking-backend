import { Types } from "mongoose"


export enum IApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    SUSPENDED = "SUSPENDED"
}

export enum IStatus {
    Accept = "Accept",
    Reject  = "Reject ",
}


export interface IDriver {
    userId: Types.ObjectId,
    vehicleInfo: String,
    status?: IStatus
    isOnline?: Boolean,
    approvalStatus: IApprovalStatus, // 'pending', 'approved', 'suspended'
    earnings: Number
}