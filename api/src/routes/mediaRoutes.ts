import express from "express";
import { authenticate } from "../middlewares/auth";
import { upload } from "../middlewares/uploadFile";
import mediaController from "../controllers/mediaController";

const router = express.Router();

/**
 * @swagger
 * /api/media:
 *   post:
 *     tags: [Media]
 *     summary: Upload a file (🔒 Authentication Required)
 *     description: |
 *       Upload an image file to Cloudinary storage.
 *       
 *       **IMPORTANT**: This endpoint requires authentication.
 *       
 *       **How to authenticate:**
 *       1. First, login using `/api/auth/signin` with your credentials
 *       2. Copy the JWT token from the response
 *       3. Click the "🔒 Authorize" button at the top of this page
 *       4. Paste the token in format: `Bearer YOUR_TOKEN_HERE`
 *       5. Click "Authorize" and close the dialog
 *       6. Now try this upload endpoint again
 *       
 *       **Test file suggestions:**
 *       - Any JPG, PNG, GIF, or WebP image
 *       - Maximum file size: 5MB
 *       - Recommended: Profile pictures, blog images, project screenshots
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "Image file to upload (JPG, PNG, GIF, WebP) - Max 5MB"
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://res.cloudinary.com/dwwuju96g/image/upload/v1754487500/business-arabic/mahmoud_profile.jpg"
 *                       description: "Direct URL to the uploaded image"
 *                     public_id:
 *                       type: string
 *                       example: "business-arabic/mahmoud_profile"
 *                       description: "Cloudinary public ID for image management"
 *                     original_filename:
 *                       type: string
 *                       example: "profile_picture.jpg"
 *                       description: "Original filename that was uploaded"
 *                     size:
 *                       type: number
 *                       example: 245678
 *                       description: "File size in bytes"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Authentication required - Please login first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Please authenticate."
 *                 message:
 *                   type: string
 *                   example: "You must be logged in to upload files. Use /api/auth/signin to get a token."
 *       413:
 *         description: File too large (max 5MB)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "File too large"
 *                 message:
 *                   type: string
 *                   example: "File size exceeds the 5MB limit"
 *       415:
 *         description: Unsupported file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid file type"
 *                 message:
 *                   type: string
 *                   example: "Only JPG, PNG, GIF, and WebP files are allowed"
 */
router.post("/", authenticate, upload.single("file"), mediaController.uploadFile);

export default router;
