import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary cloud name is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "Cloudinary API key is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "Cloudinary API secret is required"),
});

const env = cloudinaryEnvSchema.parse({
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

// Upload options interface
interface UploadOptions {
  folder?: string;
  transformation?: { width?: number; height?: number; crop?: string };
  public_id?: string;
}

// Upload image function
export const uploadImage = async (
  fileBuffer: Buffer,
  options: UploadOptions = {}
): Promise<string> => {
  const optionsSchema = z.object({
    folder: z.string().optional().default("mitti-homestays"),
    transformation: z
      .object({
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
        crop: z.string().optional(),
      })
      .optional(),
    public_id: z.string().optional(),
  });

  const validatedOptions = optionsSchema.parse(options);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        ...validatedOptions,
        // Add default transformations for optimization
        transformation: [
          ...(validatedOptions.transformation
            ? [validatedOptions.transformation]
            : []),
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`)
          );
        }
        if (!result) {
          return reject(
            new Error("Cloudinary upload failed: No result returned")
          );
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const validateFile = (file: File): void => {
  if (!ALLOWED_FORMATS.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_FORMATS.join(
        ", "
      )}`
    );
  }
  if (file.size < 50 * 1024) {
    throw new Error("Image size must be at least 50 KB");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`Image size cannot exceed 5 MB`);
  }
};
