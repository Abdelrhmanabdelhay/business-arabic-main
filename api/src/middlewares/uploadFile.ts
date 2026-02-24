import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig';
import { config } from '../config/environment';

// Multer configuration for memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!') as any, false);
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
const uploadFile = async (file: Express.Multer.File, folder?: string) => {
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

export default uploadFile;