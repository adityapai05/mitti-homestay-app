import { z } from "zod";

const HTML_TAG_PATTERN = /<[^>]+>/;
const SCRIPT_TAG_PATTERN = /<\/?\s*script\b/i;

export const sanitizeString = (value: string): string => value.trim();

export const sanitizedString = (
  min: number,
  max: number,
  field: string,
) =>
  z
    .string()
    .trim()
    .min(min, `${field} must be at least ${min} characters.`)
    .max(max, `${field} must be at most ${max} characters.`)
    .refine((value) => !SCRIPT_TAG_PATTERN.test(value), {
      message: `${field} contains disallowed content.`,
    })
    .refine((value) => !HTML_TAG_PATTERN.test(value), {
      message: `${field} cannot include HTML tags.`,
    });

export const optionalSanitizedString = (
  min: number,
  max: number,
  field: string,
) =>
  z
    .string()
    .trim()
    .min(min, `${field} must be at least ${min} characters.`)
    .max(max, `${field} must be at most ${max} characters.`)
    .refine((value) => !SCRIPT_TAG_PATTERN.test(value), {
      message: `${field} contains disallowed content.`,
    })
    .refine((value) => !HTML_TAG_PATTERN.test(value), {
      message: `${field} cannot include HTML tags.`,
    })
    .optional();

export const uuidSchema = z.uuid("Invalid UUID format.");

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), {
    message: "Invalid ISO date.",
  });

export const nonNegativeIntSchema = (max: number, field: string) =>
  z
    .number()
    .int(`${field} must be an integer.`)
    .min(0, `${field} cannot be negative.`)
    .max(max, `${field} is too large.`);

export const positiveIntSchema = (min: number, max: number, field: string) =>
  z
    .number()
    .int(`${field} must be an integer.`)
    .min(min, `${field} must be at least ${min}.`)
    .max(max, `${field} must be at most ${max}.`);

export const boundedNumberSchema = (min: number, max: number, field: string) =>
  z
    .number()
    .min(min, `${field} must be at least ${min}.`)
    .max(max, `${field} must be at most ${max}.`);

export const e164PhoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{1,14}$/, "Phone must be in E.164 format.");

export const paginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(1000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type ValidationErrorPayload = {
  error: "VALIDATION_ERROR";
  details: ReturnType<z.ZodError["flatten"]>;
};

export function validationErrorResponse(error: z.ZodError, status = 400) {
  return Response.json(
    {
      error: "VALIDATION_ERROR",
      details: error.flatten(),
    } satisfies ValidationErrorPayload,
    { status },
  );
}

export async function parseJsonBody<T>(
  req: Request,
  schema: z.ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; response: Response }> {
  let rawBody: unknown;

  try {
    rawBody = await req.json();
  } catch {
    return {
      success: false,
      response: Response.json(
        { error: "INVALID_JSON", message: "Malformed JSON body." },
        { status: 400 },
      ),
    };
  }

  if (rawBody === null || rawBody === undefined) {
    return {
      success: false,
      response: Response.json(
        { error: "EMPTY_BODY", message: "Request body is required." },
        { status: 400 },
      ),
    };
  }

  const parsed = schema.safeParse(rawBody);

  if (!parsed.success) {
    return {
      success: false,
      response: validationErrorResponse(parsed.error),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

export function parseParams<T>(
  params: unknown,
  schema: z.ZodSchema<T>,
): { success: true; data: T } | { success: false; response: Response } {
  const parsed = schema.safeParse(params);

  if (!parsed.success) {
    return {
      success: false,
      response: validationErrorResponse(parsed.error),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

export function parseQueryParams<T>(
  req: Request,
  schema: z.ZodSchema<T>,
): { success: true; data: T } | { success: false; response: Response } {
  const query = Object.fromEntries(new URL(req.url).searchParams.entries());
  const parsed = schema.safeParse(query);

  if (!parsed.success) {
    return {
      success: false,
      response: validationErrorResponse(parsed.error),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}
