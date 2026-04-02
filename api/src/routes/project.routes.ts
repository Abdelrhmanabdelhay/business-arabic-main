import express from "express";
import { downloadProject } from "../controllers/project.controller";
import { checkSubscription } from "../middlewares/checkSubscription";
import { authenticate } from "../middlewares/auth";
const router = express.Router();

router.get(
  "/download/:projectId",
  authenticate,
  checkSubscription, 
  downloadProject
);

export default router;