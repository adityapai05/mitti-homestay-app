import { z } from "zod";
import { e164PhoneSchema, sanitizedString, uuidSchema } from "./commonSchemas";

export const createSchema = z
  .object({
    name: sanitizedString(2, 100, "Name"),
    about: sanitizedString(1, 500, "About").optional(),
    languages: z.array(sanitizedString(1, 40, "Language")).max(20).optional(),
    contactPhone: e164PhoneSchema.optional(),
  })
  .strict();

export const updateSchema = z
  .object({
    name: sanitizedString(2, 100, "Name").optional(),
    about: sanitizedString(1, 500, "About").optional(),
    languages: z.array(sanitizedString(1, 40, "Language")).max(20).optional(),
    contactPhone: e164PhoneSchema.optional(),
  })
  .strict();

export const querySchema = z
  .object({
    include: z.enum(["basic"]).optional(),
  })
  .strict();

export const routeParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();
