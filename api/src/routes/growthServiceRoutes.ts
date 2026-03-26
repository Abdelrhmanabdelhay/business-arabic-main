import { Router } from "express";
import { CreateGrowthServiceDto, UpdateGrowthServiceDto } from "../dtos/growthServiceDto";
import growthServiceController from "../controllers/growthServiceController";

const router = Router();

router.post("/", growthServiceController.create.bind(growthServiceController));
router.get("/", growthServiceController.getAll.bind(growthServiceController));
router.get("/:id", growthServiceController.getById.bind(growthServiceController));
router.put("/:id", growthServiceController.update.bind(growthServiceController));
router.delete("/:id", growthServiceController.delete.bind(growthServiceController));

export default router;