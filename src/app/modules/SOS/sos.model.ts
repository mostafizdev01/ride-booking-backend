
import { model, Schema } from "mongoose";
import { ISOSRequest } from "./sos.interface";

const SOSRequestSchema = new Schema<ISOSRequest>(
  {
    userId: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    emergencyContacts: [{ name: String, phone: String }],
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);


export const SOSRequest = model<ISOSRequest>("SOSRequest", SOSRequestSchema);