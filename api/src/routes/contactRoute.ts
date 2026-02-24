import { contactController } from "../controllers/ConatctController";
import express from "express";
const router = express.Router();

router.post("/", contactController);

export default router;