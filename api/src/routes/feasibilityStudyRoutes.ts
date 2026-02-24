/**
 * @swagger
 * /api/feasibility-studies:
 *   post:
 *     tags: [Feasibility Studies]
 *     summary: Create new feasibility study
 *     description: Create a new feasibility study (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeasibilityStudy'
 *     responses:
 *       201:
 *         description: Feasibility study created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Feasibility study created successfully
 *                 data:
 *                   $ref: '#/components/schemas/FeasibilityStudy'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /api/feasibility-studies/{id}:
 *   put:
 *     tags: [Feasibility Studies]
 *     summary: Update feasibility study
 *     description: Update an existing feasibility study (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d5ecb74b24c72d88e4f1a5
 *         description: Feasibility study ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeasibilityStudy'
 *     responses:
 *       200:
 *         description: Feasibility study updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Feasibility study updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/FeasibilityStudy'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /api/feasibility-studies/{id}/buyers:
 *   get:
 *     summary: Get all buyers for a feasibility study
 *     tags: [Feasibility Studies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feasibility Study ID
 *     responses:
 *       200:
 *         description: Buyers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
import express from "express";
import feasibilityStudyController from "../controllers/feasibilityStudyController";
import { validate } from "../middlewares/validate";
import { authenticate, AuthenticatedRequest } from "../middlewares/auth";
import { 
  createFeasibilityStudySchema, 
  updateFeasibilityStudySchema, 
  feasibilityStudyIdSchema,

  searchFeasibilityStudySchema
} from "../validators/feasibilityStudyValidator";
import { upload } from "../middlewares/uploadFile";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FeasibilityStudy:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - image
 *         - price
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier
 *         name:
 *           type: string
 *           description: Name of the feasibility study
 *           example: "E-commerce Platform Study"
 *         description:
 *           type: string
 *           description: Detailed description of the study
 *         image:
 *           type: string
 *           description: Image URL for the study
 *           example: "https://res.cloudinary.com/dwwuju96g/image/upload/v1754487500/business-arabic/ecommerce_study.jpg"
 *         price:
 *           type: string
 *           description: Price of the feasibility study
 *           example: "500"
 *         category:
 *           type: string
 *           description: Category of the study
 *           example: "Technology"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     CreateFeasibilityStudy:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - image
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: "E-commerce Platform Study"
 *         description:
 *           type: string
 *           example: "Comprehensive feasibility study for launching an e-commerce platform targeting SMEs"
 *         image:
 *           type: string
 *         price:
 *           type: string
 *           example: "500"
 *         category:
 *           type: string
 *           example: "Technology"
 */

/**
 * @swagger
 * /api/feasibility-studies:
 *   get:
 *     tags: [Feasibility Studies]
 *     summary: Get all feasibility studies
 *     description: Retrieve all feasibility studies sorted by creation date (newest first)
 *     responses:
 *       200:
 *         description: Feasibility studies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *         image:
 *           type: string
 *           description: Image URL for the study
 *           example: "https://res.cloudinary.com/dwwuju96g/image/upload/v1754487500/business-arabic/ecommerce_study.jpg"
 *         price:
 *           type: string
 *           description: Price of the feasibility study
 *           example: "500"
 *         category:
 *           type: string
 *           description: Category of the study
 *           example: "Technology"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     CreateFeasibilityStudy:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - image
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: "E-commerce Platform Study"
 *         description:
 *           type: string
 *           example: "Comprehensive feasibility study for launching an e-commerce platform targeting SMEs"
 *         image:
 *           type: string
 *         price:
 *           type: string
 *           example: "500"
 *         category:
 *           type: string
 *           example: "Technology"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/search", feasibilityStudyController.searchFeasibilityStudies);

router.get("/", feasibilityStudyController.getAllFeasibilityStudies);
/**
 * @swagger
 * /api/feasibility-studies/category/{category}:
 *   get:
 *     tags: [Feasibility Studies]
 *     summary: Get feasibility studies by category
 *     description: Retrieve all feasibility studies in a specific category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           example: "Technology"
 *         description: Category name
 *     responses:
 *       200:
 *         description: Feasibility studies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 results:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 */
router.get("/category/:category", feasibilityStudyController.getFeasibilityStudiesByCategory);

/**
 * @swagger
 * /api/feasibility-studies/{id}:
 *   get:
 *     tags: [Feasibility Studies]
 *     summary: Get feasibility study by ID
 *     description: Retrieve a specific feasibility study by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5ecb74b24c72d88e4f1a5"
 *         description: Feasibility study ID
 *     responses:
 *       200:
 *         description: Feasibility study retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/FeasibilityStudy'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id",  feasibilityStudyController.getFeasibilityStudyById);

/**
 * @swagger
 * /api/feasibility-studies:
 *   post:
 *     tags: [Feasibility Studies]
 *     summary: Create new feasibility study
 *     description: Create a new feasibility study (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeasibilityStudy'
 *     responses:
 *       201:
 *         description: Feasibility study created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
router.put("/:id", authenticate, upload.single("image"), validate(feasibilityStudyIdSchema), validate(updateFeasibilityStudySchema), (req: AuthenticatedRequest, res, next) => feasibilityStudyController.updateFeasibilityStudy(req, res, next));
 *                   example: "Feasibility study created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FeasibilityStudy'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", authenticate, upload.single("image"),
  validate(createFeasibilityStudySchema), feasibilityStudyController.createFeasibilityStudy);

/**
 * @swagger
 * /api/feasibility-studies/{id}:
 *   put:
 *     tags: [Feasibility Studies]
 *     summary: Update feasibility study
 *     description: Update an existing feasibility study (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5ecb74b24c72d88e4f1a5"
 *         description: Feasibility study ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
router.delete("/:id", authenticate, validate(feasibilityStudyIdSchema), (req: AuthenticatedRequest, res, next) => feasibilityStudyController.deleteFeasibilityStudy(req, res, next));
 *               description:
 *                 type: string
 *                 example: "Updated comprehensive feasibility study"
 *               image:
 *                 type: string
 *                 example: "https://res.cloudinary.com/dwwuju96g/image/upload/v1754487500/business-arabic/updated_study.jpg"
 *               price:
 *                 type: string
 *                 example: "600"
 *               category:
 *                 type: string
 *                 example: "Technology"
 *     responses:
 *       200:
 *         description: Feasibility study updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Feasibility study updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FeasibilityStudy'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id", authenticate, upload.single("image"), validate(updateFeasibilityStudySchema), feasibilityStudyController.updateFeasibilityStudy);

/**
 * @swagger
 * /api/feasibility-studies/{id}:
 *   delete:
 *     tags: [Feasibility Studies]
 *     summary: Delete feasibility study
 *     description: Delete a feasibility study (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5ecb74b24c72d88e4f1a5"
 *         description: Feasibility study ID
 *     responses:
 *       200:
 *         description: Feasibility study deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Feasibility study deleted successfully"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", authenticate, validate(feasibilityStudyIdSchema), feasibilityStudyController.deleteFeasibilityStudy);
router.get("/:id/buyers", authenticate, validate(feasibilityStudyIdSchema), feasibilityStudyController.getFeasibilityStudiesByBuyers);

export default router;
