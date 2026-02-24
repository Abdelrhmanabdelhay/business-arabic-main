/**
 * @swagger
 * components:
 *   schemas:
 *     IdeaClubResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           $ref: '#/components/schemas/IdeaClub'
 *     IdeaClubListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IdeaClub'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Error message
 */
import express from "express";
import IdeaClubController from "../controllers/ideaClubController";
import { validate } from "../middlewares/validate";
import { createIdeaClubSchema, getIdeaClubQuerySchema, updateIdeaClubSchema } from "../validators/ideaClubValidator";
import { authenticate, authorize } from "../middlewares/auth";
import { upload } from "../middlewares/uploadFile";

const router = express.Router();

/**
/**
 * @swagger
 * /api/ideas:
 *   post:
 *     summary: Create a new idea club entry (Admin only)
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *                 description: Idea name
 *               description:
 *                 type: string
 *                 description: Idea description
 *               category:
 *                 type: string
 *                 description: Idea category
 *               content:
 *                 type: string
 *                 description: Idea content (JSON string)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional idea image
 *     responses:
 *       201:
 *         description: Idea created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IdeaClubResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get all ideas
 *     tags: [Ideas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of ideas per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Ideas retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IdeaClubListResponse'
 */
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  upload.single("image"),
  validate(createIdeaClubSchema),
  IdeaClubController.createIdeaClub
);
router.get("/", validate(getIdeaClubQuerySchema), IdeaClubController.getIdeaClubs);

/**
 * @swagger
 * /api/ideas/{id}:
 *   get:
 *     summary: Get an idea by ID
 *     tags: [Ideas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Idea ID
 *     responses:
 *       200:
 *         description: Idea retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/IdeaClub'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update an idea (Admin only)
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Idea ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Idea name
 *               description:
 *                 type: string
 *                 description: Idea description
 *               category:
 *                 type: string
 *                 description: Idea category
 *               content:
 *                 type: string
 *                 description: Idea content (JSON string)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional idea image
 *     responses:
 *       200:
 *         description: Idea updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/IdeaClub'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete an idea (Admin only)
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Idea ID
 *     responses:
 *       204:
 *         description: Idea deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", IdeaClubController.getIdeaClubById);
router.patch(
  "/:id",
  authenticate,
  authorize(["admin"]),
  upload.single("image"),
  validate(updateIdeaClubSchema),
  IdeaClubController.updateIdeaClub
);
router.delete("/:id", authenticate, authorize(["admin"]), IdeaClubController.deleteIdeaClub);

export default router;
