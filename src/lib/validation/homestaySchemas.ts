import { z } from "zod";
import {
  boundedNumberSchema,
  isoDateSchema,
  positiveIntSchema,
  sanitizedString,
  uuidSchema,
} from "./commonSchemas";

const cancellationPolicySchema = z.enum(["FLEXIBLE", "MODERATE", "STRICT"]);
const categorySchema = z.enum([
  "FARM_STAY",
  "ECO_LODGE",
  "TRADITIONAL_HOME",
  "MOUNTAIN_RETREAT",
  "LAKESIDE",
  "OTHER",
]);
const typeSchema = z.enum(["ROOM", "HOME"]);

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format.");

export const createSchema = z
  .object({
    name: sanitizedString(3, 120, "Name"),
    description: sanitizedString(10, 3000, "Description"),
    flatno: sanitizedString(1, 40, "Flat number").optional(),
    street: sanitizedString(1, 120, "Street").optional(),
    landmark: sanitizedString(1, 120, "Landmark").optional(),
    village: sanitizedString(1, 120, "Village"),
    district: sanitizedString(1, 120, "District").optional(),
    state: sanitizedString(1, 120, "State"),
    pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits").optional(),
    latitude: boundedNumberSchema(-90, 90, "Latitude"),
    longitude: boundedNumberSchema(-180, 180, "Longitude"),
    pricePerNight: boundedNumberSchema(1, 100000, "Price per night"),
    maxGuests: positiveIntSchema(1, 50, "Max guests"),
    beds: positiveIntSchema(1, 50, "Beds"),
    bedrooms: z.number().int().min(0).max(50),
    bathrooms: z.number().int().min(0).max(50),
    imageUrl: z.array(z.string().url()).min(5).max(25),
    amenities: z.array(sanitizedString(1, 80, "Amenity")).max(40).default([]),
    guideAvailable: z.boolean().default(false),
    guideFee: boundedNumberSchema(1, 100000, "Guide fee").optional().nullable(),
    cancellationPolicy: cancellationPolicySchema,
    category: categorySchema,
    type: typeSchema,
    checkInTime: timeSchema.default("14:00"),
    checkOutTime: timeSchema.default("11:00"),
  })
  .strict();

export const updateSchema = createSchema.partial().strict();

export const querySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(1000).optional(),
    destination: sanitizedString(1, 120, "Destination").optional(),
    category: z.string().optional(),
    type: typeSchema.optional(),
    sort: z
      .enum(["createdAt-desc", "price-asc", "price-desc", "rating-desc"])
      .optional(),
    minPrice: z.coerce.number().min(0).max(100000).optional(),
    maxPrice: z.coerce.number().min(0).max(100000).optional(),
    minGuests: z.coerce.number().int().min(1).max(50).optional(),
    minBedrooms: z.coerce.number().int().min(1).max(50).optional(),
    minBathrooms: z.coerce.number().int().min(1).max(50).optional(),
    amenities: z.string().optional(),
    guideAvailable: z.enum(["true", "false"]).optional(),
    freeCancellation: z.enum(["true", "false"]).optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    checkIn: isoDateSchema.optional(),
    checkOut: isoDateSchema.optional(),
  })
  .strict();

export const routeParamSchema = z
  .object({
    id: uuidSchema,
  })
  .strict();
