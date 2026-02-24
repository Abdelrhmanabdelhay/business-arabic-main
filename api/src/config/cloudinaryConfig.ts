import { v2 as cloudinary } from 'cloudinary';
import { config } from './environment';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.CLOUD_NAME,
  api_key: config.cloudinary.API_KEY,
  api_secret: config.cloudinary.API_SECRET,
});

// Validate configuration
if (!config.cloudinary.CLOUD_NAME) {
  console.warn("CLOUDINARY_CLOUD_NAME environment variable is not set");
}
if (!config.cloudinary.API_KEY) {
  console.warn("CLOUDINARY_API_KEY environment variable is not set");
}
if (!config.cloudinary.API_SECRET) {
  console.warn("CLOUDINARY_API_SECRET environment variable is not set");
}

export default cloudinary;
