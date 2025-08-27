"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOSControllers = void 0;
const twilio_1 = __importDefault(require("twilio"));
const sos_model_1 = require("./sos.model");
const sendEmail_1 = require("../../utilis/sendEmail");
const env_1 = require("../../config/env");
const twilioClient = (0, twilio_1.default)(env_1.envVars.TWILIO.ACCOUNT_SID, env_1.envVars.TWILIO.AUTH_TOKEN);
const createSOSRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { latitude, longitude, address, emergencyContacts } = req.body;
        // Create SOS request in DB
        const sosRequest = yield sos_model_1.SOSRequest.create({
            userId,
            latitude,
            longitude,
            address,
            emergencyContacts,
        });
        const message = `🚨 SOS Alert! User ${userId} needs help at ${address}.`;
        // Send SMS via Twilio
        for (const contact of emergencyContacts) {
            try {
                yield twilioClient.messages.create({
                    body: message,
                    from: env_1.envVars.TWILIO.PHONE_NUMBER,
                    to: contact.phone,
                });
                console.log(`SMS sent to ${contact.name} at ${contact.phone}`);
            }
            catch (err) {
                console.error(`Failed to send SMS to ${contact.name}:`, err);
            }
            // Optional: also send email
            if (contact.email) {
                yield (0, sendEmail_1.sendEmail)({
                    to: contact.email,
                    subject: "🚨 Emergency SOS Alert!",
                    templateName: "sosAlert",
                    templateData: { userId, location: address },
                });
                console.log(`Email sent to ${contact.name} at ${contact.email}`);
            }
        }
        res.status(201).json({ success: true, sosRequest });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create SOS request" });
    }
});
const getActiveSOSRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield sos_model_1.SOSRequest.find({ status: "active" });
        res.json({ success: true, requests });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch SOS requests" });
    }
});
const resolveSOSRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const request = yield sos_model_1.SOSRequest.findByIdAndUpdate(id, { status: "resolved" }, { new: true });
        res.json({ success: true, request });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to resolve SOS request" });
    }
});
exports.SOSControllers = {
    createSOSRequest,
    getActiveSOSRequests,
    resolveSOSRequest
};
