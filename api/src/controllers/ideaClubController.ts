import { Request, Response, NextFunction } from "express";
import { CreateIdeaClubDto, UpdateIdeaClubDto } from "../dtos/ideaClubDto";
import IdeaClubService from "../services/ideaClubService";
import imageService from "../services/imageService";

export class IdeaClubController {
  async createIdeaClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;
      const createIdeaClubDto: CreateIdeaClubDto = req.body;
      const ideaContent = await JSON.parse(createIdeaClubDto.content);
      let image;
      if (file) {
        image = await imageService.uploadImage(file);
      }

      const result = await IdeaClubService.createIdeaClub({ ...createIdeaClubDto, content: ideaContent });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getIdeaClubs(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, category, keyword } = req.query;
      const categoryStr = typeof category === 'string' ? category : '';
      const keywordStr = typeof keyword === 'string' ? keyword : '';
      const result = await IdeaClubService.getIdeaClubs(
        Number(page) || 1,
        Number(limit) || 10,
        categoryStr,
        keywordStr
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getIdeaClubById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await IdeaClubService.getIdeaClubById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateIdeaClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateIdeaClubDto: UpdateIdeaClubDto = {
        content: JSON.parse(req.body.content),
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
      };
      console.log({ updateIdeaClubDto });
      const result = await IdeaClubService.updateIdeaClub(id, updateIdeaClubDto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteIdeaClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ideas = await IdeaClubService.deleteIdeaClub(id);
      res.status(200).send(ideas);
    } catch (error) {
      next(error);
    }
  }
}

export default new IdeaClubController();
