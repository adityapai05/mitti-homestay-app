import { z } from "zod";
import { sanitizedString, uuidSchema } from "./commonSchemas";

export const createSchema = z
  .object({
    idToken: sanitizedString(20, 5000, "ID token"),
  })
  .strict();

export const updateSchema = z
  .object({
    name: sanitizedString(2, 100, "Name").optional(),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^\+[1-9]\d{1,14}$/, "Phone must be in E.164 format.")
      .optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required.",
  });

export const querySchema = z
  .object({
    mode: z.enum(["current"]).optional(),
  })
  .strict();

export const routeParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();