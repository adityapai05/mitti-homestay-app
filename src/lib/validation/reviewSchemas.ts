import { z } from "zod";
import { sanitizedString, uuidSchema } from "./commonSchemas";

export const createSchema = z
  .object({
    bookingId: uuidSchema,
    rating: z.number().int().min(1).max(5),
    comment: sanitizedString(10, 1000, "Comment").optional(),
  })
  .strict();

export const updateSchema = createSchema;

export const querySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).max(1000).optional(),
    rating: z.enum(["all", "1", "2", "3", "4", "5"]).optional(),
    sortBy: z.enum(["newest", "oldest", "highest", "lowest"]).optional(),
  })
  .strict();

export const routeParamSchema = z
  .object({
    homestayId: uuidSchema,
  })
  .strict();