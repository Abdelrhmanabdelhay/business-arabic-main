import cloudinary from '../config/cloudinaryConfig';
import { config } from '../config/environment';

interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

const uploadFile = async (file: Express.Multer.File, folder?: string): Promise<UploadResult> => {
  try {
    // Convert buffer to base64
    const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    // Upload options
    const uploadOptions = {
      folder: folder || config.cloudinary.FOLDER,
      resource_type: 'auto' as const,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, uploadOptions);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};

const deleteFile = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

const getPublicIdFromUrl = (url: string): string => {
  // Extract public_id from Cloudinary URL
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(part => part === 'upload');
  if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
    const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
    // Remove file extension
    const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
    return lastDotIndex !== -1 ? publicIdWithExtension.substring(0, lastDotIndex) : publicIdWithExtension;
  }
  return '';
};

export { uploadFile as default, deleteFile, getPublicIdFromUrl };
