import z from "zod";
import { Role } from "./user.interface";

const stringWithCustomTypeError = (msg: string) =>
  z.string().superRefine((val, ctx) => {
    if (typeof val !== "string") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg,
      });
    }
  });

export const createUserZodSchema = z.object({
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
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  address: stringWithCustomTypeError("Address must be string")
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.boolean().optional(),
  isDeleted: z
    .boolean()
    .superRefine((val, ctx) => {
      if (typeof val !== "boolean") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "isDeleted must be true or false",
        });
      }
    })
    .optional(),
  isApproved: z
    .boolean().optional(),
  currentLocation: z.object({
    type: z.literal("Point"),
    coordinates: z
      .array(z.number())
      .length(2, { message: "Coordinates must be an array of [lng, lat]" }),
  }),
  isBlocked: z
    .boolean()
    .optional()
});

export const updateUserZodSchema = z.object({
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
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.boolean().optional(),
  isDeleted: z
    .boolean()
    .superRefine((val, ctx) => {
      if (typeof val !== "boolean") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "isDeleted must be true or false",
        });
      }
    })
    .optional(),
  isApproved: z
    .boolean().optional(),
  address: stringWithCustomTypeError("Address must be string")
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
  currentLocation: z.object({
    type: z.literal("Point"),
    coordinates: z
      .array(z.number())
      .length(2, { message: "Coordinates must be an array of [lng, lat]" }),
  }),
  isBlocked: z
    .boolean()
    .optional()
});
