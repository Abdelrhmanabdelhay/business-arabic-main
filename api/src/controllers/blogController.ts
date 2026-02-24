import { Request, Response, NextFunction } from "express";
import { CreateBlogDto, UpdateBlogDto } from "../dtos/blogDto";
import BlogService from "../services/blogService";

export class BlogController {
  async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const createBlogDto: CreateBlogDto = req.body;
      const result = await BlogService.createBlog(createBlogDto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, keyword } = req.query;
      const keywordStr = typeof keyword === 'string' ? keyword : '';
      const result = await BlogService.getBlogs(Number(page) || 1, Number(limit) || 10, keywordStr);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BlogService.getBlogById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateBlogDto: UpdateBlogDto = req.body;
      const result = await BlogService.updateBlog(id, updateBlogDto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await BlogService.deleteBlog(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new BlogController();
