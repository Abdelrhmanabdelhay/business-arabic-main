import { Router } from "express";
import successStoryController from "../controllers/successStoryController";

const router = Router();

router.post("/", successStoryController.create.bind(successStoryController));
router.get("/", successStoryController.getAll.bind(successStoryController));
router.get("/:id", successStoryController.getById.bind(successStoryController));
router.put("/:id", successStoryController.update.bind(successStoryController));
router.delete("/:id", successStoryController.delete.bind(successStoryController));

export default router;