import { z } from "zod";
import { sanitizedString, uuidSchema } from "./commonSchemas";

export const createSchema = z
  .object({
    action: sanitizedString(2, 80, "Action"),
  })
  .strict();

export const updateSchema = z
  .object({
    role: z.enum(["USER", "HOST", "ADMIN"]).optional(),
    isRead: z.boolean().optional(),
  })
  .strict();

export const querySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(1000).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  })
  .strict();

export const routeParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();

export const contactMessageCreateSchema = z
  .object({
    name: sanitizedString(2, 100, "Name"),
    email: z.string().trim().email("Invalid email address."),
    subject: sanitizedString(3, 150, "Subject"),
    message: sanitizedString(10, 3000, "Message"),
  })
  .strict();
