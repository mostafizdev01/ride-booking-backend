"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
const stringWithCustomTypeError = (msg) => zod_1.default.string().superRefine((val, ctx) => {
    if (typeof val !== "string") {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: msg,
        });
    }
});
exports.createUserZodSchema = zod_1.default.object({
    name: stringWithCustomTypeError("Name must be string")
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: stringWithCustomTypeError("Email must be string")
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: stringWithCustomTypeError("Password must be string")
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }).optional(),
    phone: stringWithCustomTypeError("Phone Number must be string")
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: stringWithCustomTypeError("Address must be string")
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.boolean().optional(),
    isDeleted: zod_1.default
        .boolean()
        .superRefine((val, ctx) => {
        if (typeof val !== "boolean") {
            ctx.addIssue({
                code: zod_1.default.ZodIssueCode.custom,
                message: "isDeleted must be true or false",
            });
        }
    })
        .optional(),
    isApproved: zod_1.default
        .boolean().optional(),
    currentLocation: zod_1.default.object({
        type: zod_1.default.literal("Point"),
        coordinates: zod_1.default
            .array(zod_1.default.number())
            .length(2, { message: "Coordinates must be an array of [lng, lat]" }),
    }),
    isBlocked: zod_1.default
        .boolean()
        .optional()
});
exports.updateUserZodSchema = zod_1.default.object({
    name: stringWithCustomTypeError("Name must be string")
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    password: stringWithCustomTypeError("Password must be string")
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    })
        .optional(),
    phone: stringWithCustomTypeError("Phone Number must be string")
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.boolean().optional(),
    isDeleted: zod_1.default
        .boolean()
        .superRefine((val, ctx) => {
        if (typeof val !== "boolean") {
            ctx.addIssue({
                code: zod_1.default.ZodIssueCode.custom,
                message: "isDeleted must be true or false",
            });
        }
    })
        .optional(),
    isApproved: zod_1.default
        .boolean().optional(),
    address: stringWithCustomTypeError("Address must be string")
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    currentLocation: zod_1.default.object({
        type: zod_1.default.literal("Point"),
        coordinates: zod_1.default
            .array(zod_1.default.number())
            .length(2, { message: "Coordinates must be an array of [lng, lat]" }),
    }),
    isBlocked: zod_1.default
        .boolean()
        .optional()
});
