import { Request, Response, NextFunction } from "express";
import { CreateIdeaClubDto, UpdateIdeaClubDto } from "../dtos/ideaClubDto";
import IdeaClubService from "../services/ideaClubService";
import imageService from "../services/imageService";

export class IdeaClubController {
  async createIdeaClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;
      const createIdeaClubDto: CreateIdeaClubDto = req.body;

      console.log('createIdeaClub - content-type:', req.headers['content-type']);
      console.log('createIdeaClub - body keys:', Object.keys(req.body));
      console.log('createIdeaClub - typeof content:', typeof req.body.content);
      console.log('createIdeaClub - body imageUrl:', createIdeaClubDto.imageUrl ? '[present]' : '[missing]');
      console.log('createIdeaClub - req.file:', !!file, file ? { originalname: file.originalname, mimetype: file.mimetype, size: file.size } : null);

      const parseContent = (content: any): string[] => {
        if (Array.isArray(content)) return content;
        if (typeof content === 'string') {
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) return parsed;
          } catch {
            // not JSON, fall through
          }
          return [content];
        }
        return [];
      };

      const ideaContent = parseContent(createIdeaClubDto.content);
      let imageUrl = createIdeaClubDto.imageUrl;
      console.log('createIdeaClub - req.file present?:', !!file);
      if (file) {
        console.log('createIdeaClub - uploading file:', file.originalname, file.mimetype, file.size);
        imageUrl = await imageService.uploadImage(file);
        console.log('createIdeaClub - uploaded imageUrl:', imageUrl);
      }

      const result = await IdeaClubService.createIdeaClub({
        ...createIdeaClubDto,
        content: ideaContent,
        imageUrl,
      });
      console.log('createIdeaClub - created result id:', result.id, 'imageUrl:', result.imageUrl);
      console.log('createIdeaClub - created result object:', result);
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
      const { file } = req;

      console.log('updateIdeaClub - content-type:', req.headers['content-type']);
      console.log('updateIdeaClub - body keys:', Object.keys(req.body));
      console.log('updateIdeaClub - body imageUrl:', req.body.imageUrl ? '[present]' : '[missing]');
      console.log('updateIdeaClub - typeof content:', typeof req.body.content);
      console.log('updateIdeaClub - req.file:', !!file, file ? { originalname: file.originalname, mimetype: file.mimetype, size: file.size } : null);

      const parseContent = (content: any): string[] | undefined => {
        if (content === undefined) return undefined;
        if (Array.isArray(content)) return content;
        if (typeof content === 'string') {
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) return parsed;
          } catch {
            // not JSON, fall through
          }
          return [content];
        }
        return undefined;
      };

      let imageUrl = req.body.imageUrl;
      console.log('updateIdeaClub - req.file present?:', !!file);
      if (file) {
        console.log('updateIdeaClub - uploading file:', file.originalname, file.mimetype, file.size);
        imageUrl = await imageService.uploadImage(file);
        console.log('updateIdeaClub - uploaded imageUrl:', imageUrl);
      }

      const updateIdeaClubDto: UpdateIdeaClubDto = {
        content: parseContent(req.body.content),
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        imageUrl,
      };
      console.log({ updateIdeaClubDto });
      const result = await IdeaClubService.updateIdeaClub(id, updateIdeaClubDto);
      console.log('updateIdeaClub - returned result imageUrl:', result.imageUrl);
      console.log('updateIdeaClub - returned result object:', result);
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
