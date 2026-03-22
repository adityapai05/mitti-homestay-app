import { z } from "zod";
import { sanitizedString, uuidSchema } from "./commonSchemas";

const payoutMethodSchema = z.enum(["UPI", "BANK"]);

export const createSchema = z
  .object({
    method: payoutMethodSchema,
    accountHolderName: sanitizedString(2, 100, "Account holder name"),
    upiId: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/, "Invalid UPI ID")
      .optional()
      .nullable(),
    bankName: sanitizedString(2, 120, "Bank name").optional().nullable(),
    accountNo: z
      .string()
      .trim()
      .regex(/^\d{8,18}$/, "Invalid account number")
      .optional()
      .nullable(),
    ifsc: z
      .string()
      .trim()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC")
      .optional()
      .nullable(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.method === "UPI" && !value.upiId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["upiId"],
        message: "UPI ID is required when method is UPI.",
      });
    }

    if (value.method === "BANK") {
      if (!value.bankName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bankName"],
          message: "Bank name is required when method is BANK.",
        });
      }
      if (!value.accountNo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["accountNo"],
          message: "Account number is required when method is BANK.",
        });
      }
      if (!value.ifsc) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ifsc"],
          message: "IFSC is required when method is BANK.",
        });
      }
    }
  });

export const updateSchema = createSchema;

export const querySchema = z
  .object({
    status: z.enum(["PENDING", "PROCESSED", "FAILED"]).optional(),
  })
  .strict();

export const routeParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();