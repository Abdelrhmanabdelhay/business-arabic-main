import express from "express";
import AuthController from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { signUpSchema, signInSchema } from "../validators/authValidator";

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Create a new user account with your information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 example: "Mahmoud Ali"
 *                 description: "User's full name"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "Mahmoud.Ali.Spider@gmail.com"
 *                 description: "User's email address"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "mahmoud123456"
 *                 description: "Password (minimum 8 characters)"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *                 example: "admin"
 *                 description: "User role (optional, defaults to 'user')"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkzNWExNWNhNjc0ZGY1YTM3OGM1MjkiLCJpYXQiOjE3NTQ0ODc0MjgsImV4cCI6MTc1NDU3MzgyOH0.AneHXv58ogWyX1MbRGRpHNnpHBhqHxm6KvuWUw4tEF0"
 *                   description: "JWT authentication token - COPY THIS TOKEN"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "68935a15ca674df5a378c529"
 *                     email:
 *                       type: string
 *                       example: "Mahmoud.Ali.Spider@gmail.com"
 *                     fullName:
 *                       type: string
 *                       example: "Mahmoud Ali"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "User with this email already exists"
 */
router.post("/signup", validate(signUpSchema), AuthController.signUp);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: Authenticate user and return JWT token for API access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "Mahmoud.Ali.Spider@gmail.com"
 *                 description: "Your email address"
 *               password:
 *                 type: string
 *                 example: "mahmoud123456"
 *                 description: "Your password"
 *     responses:
 *       200:
 *         description: Login successful - Copy the token to authorize other requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkzNWExNWNhNjc0ZGY1YTM3OGM1MjkiLCJpYXQiOjE3NTQ0ODc0MjgsImV4cCI6MTc1NDU3MzgyOH0.AneHXv58ogWyX1MbRGRpHNnpHBhqHxm6KvuWUw4tEF0"
 *                   description: "🔑 COPY THIS TOKEN - Click 'Authorize' button above and paste: Bearer [token]"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "68935a15ca674df5a378c529"
 *                     email:
 *                       type: string
 *                       example: "Mahmoud.Ali.Spider@gmail.com"
 *                     fullName:
 *                       type: string
 *                       example: "Mahmoud Ali"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/signin", validate(signInSchema), AuthController.signIn);

export default router;
