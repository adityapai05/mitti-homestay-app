export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { uploadImage, validateFile } from "@/lib/cloudinary";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

const formDataSchema = z.object({
  folder: z
    .union([z.string().min(1), z.literal(""), z.null()])
    .optional()
    .transform((val) => (val === "" || val === null ? "mitti-homestays" : val)),
});

// Rate limiting configuration (TODO: Use Redis or Vercel for production)
const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60 * 1000,
};
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          code: "UNAUTHORIZED",
          details: "User not authenticated",
        },
        { status: 401 }
      );
    }
    const clientId = user.id;
    const now = Date.now();
    const rateLimitInfo = requestCounts.get(clientId) || {
      count: 0,
      resetTime: now + RATE_LIMIT.windowMs,
    };

    if (now > rateLimitInfo.resetTime) {
      requestCounts.set(clientId, {
        count: 1,
        resetTime: now + RATE_LIMIT.windowMs,
      });
    } else if (rateLimitInfo.count >= RATE_LIMIT.maxRequests) {
      return NextResponse.json(
        {
          error: "Too many requests",
          code: "RATE_LIMIT_EXCEEDED",
          details: "Try again later",
        },
        { status: 429 }
      );
    } else {
      rateLimitInfo.count++;
      requestCounts.set(clientId, rateLimitInfo);
    }

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const folderInput = formData.get("folder");

    const { folder } = formDataSchema.parse({
      folder: typeof folderInput === "string" ? folderInput : null,
    });

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded", code: "NO_FILES_UPLOADED" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        validateFile(file);
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadImage(buffer, { folder });
        uploadedUrls.push(url);
      } catch (err) {
        errors.push(
          `${file.name}: ${(err as Error).message || "Upload failed"}`
        );
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        {
          error: "No images were uploaded",
          details: errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        urls: uploadedUrls,
        errors, // <-- important
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/upload-image]", error);
    const err = error as Error;
    return NextResponse.json(
      {
        error: err.message || "Upload failed",
      },
      { status: err.name === "ZodError" ? 400 : 500 }
    );
  }
}
