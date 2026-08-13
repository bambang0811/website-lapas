import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadToCloudinary(
  buffer,
  folder = "lapas_berita",
  resourceType = "image",
  options = {},
) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      ...options,
    };

    if (resourceType === "image") {
      uploadOptions.width = uploadOptions.width ?? 1080;
      uploadOptions.height = uploadOptions.height ?? 1350;
      uploadOptions.crop = uploadOptions.crop ?? "fill";
      uploadOptions.gravity = uploadOptions.gravity ?? "auto";
    }

    if (resourceType === "video") {
      uploadOptions.width = uploadOptions.width ?? 1080;
      uploadOptions.height = uploadOptions.height ?? 1920;
      uploadOptions.crop = uploadOptions.crop ?? "limit";
      uploadOptions.quality = uploadOptions.quality ?? "auto";
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
}
