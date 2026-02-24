import cloudinaryUpload, { deleteFile, getPublicIdFromUrl } from "../utils/cloudinaryUpload";
import AppError from "../utils/appError";

export class ImageService {
  async uploadImage(file: Express.Multer.File, folder?: string): Promise<string> {
    try {
      const result = await cloudinaryUpload(file, folder);
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new AppError("Failed to upload image", 500);
    }
  }

  async deleteImage(publicIdOrUrl: string): Promise<void> {
    try {
      // If it's a URL, extract the public_id
      const publicId = publicIdOrUrl.includes('cloudinary.com') 
        ? getPublicIdFromUrl(publicIdOrUrl) 
        : publicIdOrUrl;
      
      await deleteFile(publicId);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw new AppError("Failed to delete image", 500);
    }
  }

  getImageUrl(publicId: string): string {
    // For Cloudinary, we don't need to construct URLs manually
    // The upload function already returns the full URL
    return publicId;
  }

  getKeyFromUrl(url: string): string {
    // Extract public_id from Cloudinary URL
    return getPublicIdFromUrl(url);
  }
}

export default new ImageService();
