import { Router } from "express";
import planController from "../controllers/planController"; 
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { CreatePlanSchema } from "../validators/blogValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Plans management API
 */

/**
 * @swagger
 * /api/plans:
 *   post:
 *     summary: Create a new plan (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - ideas
 *             properties:
 *               title:
 *                 type: string
 *                 description: Plan title
 *               price:
 *                 type: number
 *                 description: Plan price
 *               ideas:
 *                 type: array
 *                 description: List of included ideas
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 description: Optional image URL
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get all plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: Plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 */
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validate(CreatePlanSchema),
  planController.createPlan
);

router.get("/", planController.getPlans);

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Get a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update a plan (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               ideas:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 description: Optional image URL
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a plan (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       204:
 *         description: Plan deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", planController.getPlanById);

router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validate(CreatePlanSchema),
  planController.updatePlan
);

router.delete("/:id", authenticate, authorize(["admin"]), planController.deletePlan);

export default router;
