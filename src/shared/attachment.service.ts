import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

if (env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export class AttachmentService {
  async upload(file: Express.Multer.File, folder: string = "uploads") {
    if (!env.CLOUDINARY_CLOUD_NAME) {
      return { url: "", publicId: "", message: "Cloudinary not configured" };
    }

    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" },
        (error, result) => {
          if (error) {
            logger.error({ event: "upload_failed", error });
            reject(error);
          } else {
            resolve({ url: result!.secure_url, publicId: result!.public_id });
          }
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  async delete(publicId: string) {
    if (!env.CLOUDINARY_CLOUD_NAME) return;
    await cloudinary.uploader.destroy(publicId);
  }
}

export async function uploadFile(file: Express.Multer.File, folder?: string) {
  const service = new AttachmentService();
  return service.upload(file, folder);
}
