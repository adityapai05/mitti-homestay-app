import { z } from "zod";
import { isoDateSchema, positiveIntSchema, uuidSchema } from "./commonSchemas";

const todayDateString = () => new Date().toISOString().slice(0, 10);

export const createSchema = z
  .object({
    homestayId: uuidSchema,
    checkIn: isoDateSchema,
    checkOut: isoDateSchema,
    guests: positiveIntSchema(1, 50, "Guests"),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.checkIn < todayDateString()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkIn"],
        message: "Check-in must be today or a future date.",
      });
    }

    if (value.checkOut <= value.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out must be after check-in.",
      });
    }
  });

export const updateSchema = z
  .object({
    action: z.enum(["approve", "reject"]),
  })
  .strict();

export const querySchema = z
  .object({
    upcoming: z.enum(["true", "false"]).optional(),
    past: z.enum(["true", "false"]).optional(),
    page: z.coerce.number().int().min(1).max(1000).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  })
  .strict();

export const routeParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();

export const paymentOrderCreateSchema = z
  .object({
    bookingId: uuidSchema,
  })
  .strict();

export const paymentVerifySchema = z
  .object({
    razorpay_order_id: z.string().trim().min(5).max(200),
    razorpay_payment_id: z.string().trim().min(5).max(200),
    razorpay_signature: z.string().trim().min(10).max(512),
    bookingId: uuidSchema,
  })
  .strict();
