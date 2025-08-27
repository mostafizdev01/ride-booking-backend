import { Request, Response } from "express";
import twilio from "twilio";
import { SOSRequest } from "./sos.model";
import { sendEmail } from "../../utilis/sendEmail";
import { envVars } from "../../config/env";

const twilioClient = twilio(
    envVars.TWILIO.ACCOUNT_SID,
    envVars.TWILIO.AUTH_TOKEN
);

console.log("Twilio Client Initialized:", twilioClient);

const createSOSRequest = async (req: Request, res: Response) => {
    try {

        const userId = (req.user as any).userId
        const { latitude, longitude, address, emergencyContacts } = req.body;

        // Create SOS request in DB
        const sosRequest = await SOSRequest.create({
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
                await twilioClient.messages.create({
                    body: message,
                    from: envVars.TWILIO.PHONE_NUMBER,
                    to: contact.phone,
                });
                console.log(`SMS sent to ${contact.name} at ${contact.phone}`);
            } catch (err) {
                console.error(`Failed to send SMS to ${contact.name}:`, err);
            }

            // Optional: also send email
            if (contact.email) {
                await sendEmail({
                    to: contact.email,
                    subject: "🚨 Emergency SOS Alert!",
                    templateName: "sosAlert",
                    templateData: { userId, location: address },
                });
                console.log(`Email sent to ${contact.name} at ${contact.email}`);
            }
        }

        res.status(201).json({ success: true, sosRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create SOS request" });
    }
};

const getActiveSOSRequests = async (req: Request, res: Response) => {
    try {
        const requests = await SOSRequest.find({ status: "active" });
        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch SOS requests" });
    }
};

const resolveSOSRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = await SOSRequest.findByIdAndUpdate(id, { status: "resolved" }, { new: true });
        res.json({ success: true, request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to resolve SOS request" });
    }
};




export const SOSControllers = {
    createSOSRequest,
    getActiveSOSRequests,
    resolveSOSRequest
}
