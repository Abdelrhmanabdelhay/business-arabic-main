
import { Request, Response, NextFunction } from "express";
import { CreateGrowthServiceDto, UpdateGrowthServiceDto } from "../dtos/growthServiceDto";
import GrowthServiceService from "../services/growthService";

export class GrowthServiceController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createGrowthServiceDto: CreateGrowthServiceDto = req.body;
      const result = await GrowthServiceService.createGrowthService(createGrowthServiceDto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GrowthServiceService.getGrowthServices();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GrowthServiceService.getGrowthServiceById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updateGrowthServiceDto: UpdateGrowthServiceDto = req.body;
      const result = await GrowthServiceService.updateGrowthService(req.params.id, updateGrowthServiceDto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await GrowthServiceService.deleteGrowthService(req.params.id);
      res.status(200).json({ message: "Growth service deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new GrowthServiceController();