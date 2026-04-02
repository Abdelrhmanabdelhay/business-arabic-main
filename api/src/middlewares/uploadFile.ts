import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig';
import { config } from '../config/environment';
import streamifier from "streamifier";
  import path from "path";

interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type: string;
  bytes: number;
}
// Multer configuration for memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if    ( file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed!') as any, false);
  }
};

// Multer middleware configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.maxImageSize, // 5MB limit
  },
});

// Upload file to Cloudinary function

const uploadFile = async (
  file: Express.Multer.File,
  folder?: string
): Promise<UploadResult> => {
    try {
    const isPdf = file.mimetype === "application/pdf";

return new Promise<UploadResult>((resolve, reject) => {

const safeFileName = Buffer.from(file.originalname, "latin1").toString("utf8");

const parsed = path.parse(safeFileName);

const publicId = `${Date.now()}`; // 🔥 بدون اسم + بدون pdf

const stream = cloudinary.uploader.upload_stream(
  {
    folder: folder || config.cloudinary.FOLDER,
    resource_type: isPdf ? "raw" : "image",
    type: isPdf ? "authenticated" : "upload", // 🔥 دي مهمة جدًا
    public_id: publicId,

    ...(isPdf
      ? {}
      : {
          transformation: [
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        }),
  },
        (error, result) => {
          if (error || !result) return reject(error);
  console.log("TYPE:", result.resource_type);
  console.log("URL:", result.secure_url);
  console.log("FORMAT:", result.format);

resolve({
  public_id: result.public_id,
  secure_url: result.secure_url,
  url: result.url,
  width: result.width,
  height: result.height,
  format: result.format,
  resource_type: result.resource_type,
  bytes: result.bytes,
});
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
export default uploadFile;