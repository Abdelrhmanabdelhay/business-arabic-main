import { Request, Response, NextFunction } from "express";
import imageService from "../services/imageService";
import cloudinaryUpload from "../utils/cloudinaryUpload";

export class MediaController {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          status: "error",
          message: "No file provided"
        });
      }

      // Upload to Cloudinary and get full result
      const uploadResult = await cloudinaryUpload(file);

      res.status(201).json({
        status: "success",
        data: {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          original_filename: file.originalname,
          size: uploadResult.bytes
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MediaController();
