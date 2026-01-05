import { Prisma } from "@prisma/client";
import type { JsonValue } from "@/types";

export function prismaJsonToJsonValue(
  value: Prisma.JsonValue | null
): JsonValue | null {
  return value === null ? null : (value as JsonValue);
}
