import { Request, Response, NextFunction } from "express";
import { CreateSuccessStoryDto, UpdateSuccessStoryDto } from "../dtos/successStoryDto";
import SuccessStoryService from "../services/successStoryService";

export class SuccessStoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createSuccessStoryDto: CreateSuccessStoryDto = req.body;
      const result = await SuccessStoryService.createSuccessStory(createSuccessStoryDto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { keyword } = req.query;
      const result = await SuccessStoryService.getSuccessStories(page, limit, keyword);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SuccessStoryService.getSuccessStoryById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updateSuccessStoryDto: UpdateSuccessStoryDto = req.body;
      const result = await SuccessStoryService.updateSuccessStory(req.params.id, updateSuccessStoryDto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await SuccessStoryService.deleteSuccessStory(req.params.id);
      res.status(200).json({ message: "Success story deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new SuccessStoryController();