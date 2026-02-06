"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import qs from "query-string";

export interface ExploreQueryParams {
  destination?: string;
  lat?: number;
  lng?: number;
  checkIn?: string;
  checkOut?: string;

  guests?: number;
  page?: number;
  sort?: string;

  category?: string[];
  type?: "ROOM" | "HOME";

  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  minBedrooms?: number;
  minBathrooms?: number;

  amenities?: string[];
  rating?: number;

  guideAvailable?: boolean;
  freeCancellation?: boolean;
}

export interface ExploreQuery extends ExploreQueryParams {
  guests: number;
  page: number;
  sort: string;
}

const ARRAY_KEYS = new Set(["category", "amenities"]);

function normalizeArray(value: unknown): string[] | undefined {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  const items = raw
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);

  if (items.length === 0) return undefined;

  return Array.from(new Set(items));
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function normalizeBoolean(value: unknown): boolean | undefined {
  if (value === true || value === false) return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export function normalizeExploreQueryParams(
  input: Partial<Record<keyof ExploreQueryParams, unknown>>,
): ExploreQueryParams {
  return {
    destination: normalizeString(input.destination),
    lat: normalizeNumber(input.lat),
    lng: normalizeNumber(input.lng),
    checkIn: normalizeString(input.checkIn),
    checkOut: normalizeString(input.checkOut),

    guests: normalizeNumber(input.guests),
    page: normalizeNumber(input.page),
    sort: normalizeString(input.sort),

    category: normalizeArray(input.category),
    type:
      input.type === "ROOM" || input.type === "HOME" ? input.type : undefined,

    minPrice: normalizeNumber(input.minPrice),
    maxPrice: normalizeNumber(input.maxPrice),
    minGuests: normalizeNumber(input.minGuests),
    minBedrooms: normalizeNumber(input.minBedrooms),
    minBathrooms: normalizeNumber(input.minBathrooms),

    amenities: normalizeArray(input.amenities),
    rating: normalizeNumber(input.rating),

    guideAvailable: normalizeBoolean(input.guideAvailable),
    freeCancellation: normalizeBoolean(input.freeCancellation),
  };
}

export function serializeExploreQuery(
  input: Partial<Record<keyof ExploreQueryParams, unknown>>,
): string {
  const normalized = normalizeExploreQueryParams(input);

  const cleaned: Record<string, unknown> = {};
  Object.entries(normalized).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (ARRAY_KEYS.has(key) && Array.isArray(value) && value.length === 0) {
      return;
    }
    cleaned[key] = value;
  });

  return qs.stringify(cleaned, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
  });
}

export function useExploreQuery(): ExploreQuery {
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();

  return useMemo(() => {
    const params = new URLSearchParams(paramsKey);

    const parseNumber = (value: string | null) => {
      if (!value) return undefined;
      const num = Number(value);
      return Number.isFinite(num) ? num : undefined;
    };

    const getArrayParam = (key: string) => {
      const raw = params.get(key);
      if (!raw) return undefined;

      const items = raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      return items.length > 0 ? items : undefined;
    };

    return {
      destination: params.get("destination") ?? undefined,

      lat: parseNumber(params.get("lat")),
      lng: parseNumber(params.get("lng")),

      checkIn: params.get("checkIn") ?? undefined,
      checkOut: params.get("checkOut") ?? undefined,

      guests: parseNumber(params.get("guests")) || 1,
      page: parseNumber(params.get("page")) || 1,
      sort: params.get("sort") || "createdAt-desc",

      category: getArrayParam("category"),

      type:
        params.get("type") === "ROOM" || params.get("type") === "HOME"
          ? (params.get("type") as "ROOM" | "HOME")
          : undefined,

      minPrice: parseNumber(params.get("minPrice")),
      maxPrice: parseNumber(params.get("maxPrice")),

      minGuests: parseNumber(params.get("minGuests")),
      minBedrooms: parseNumber(params.get("minBedrooms")),
      minBathrooms: parseNumber(params.get("minBathrooms")),

      amenities: getArrayParam("amenities"),

      rating: parseNumber(params.get("rating")),

      guideAvailable:
        params.get("guideAvailable") === "true"
          ? true
          : params.get("guideAvailable") === "false"
            ? false
            : undefined,

      freeCancellation:
        params.get("freeCancellation") === "true"
          ? true
          : params.get("freeCancellation") === "false"
            ? false
            : undefined,
    };
  }, [paramsKey]);
}
