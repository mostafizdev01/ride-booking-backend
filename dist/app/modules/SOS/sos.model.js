"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOSRequest = void 0;
const mongoose_1 = require("mongoose");
const SOSRequestSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    emergencyContacts: [{ name: String, phone: String }],
    status: { type: String, default: "active" },
}, { timestamps: true });
exports.SOSRequest = (0, mongoose_1.model)("SOSRequest", SOSRequestSchema);
