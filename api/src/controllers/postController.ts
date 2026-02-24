// src/controllers/postController.ts

import { Request, Response, NextFunction } from "express";
import { CreatePostDto, UpdatePostDto } from "../dtos/postDto";
import PostService from "../services/postService";
import { AuthenticatedRequest } from "../middlewares/auth";
import imageService from "../services/imageService";

export class PostController {
  async createPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      let createPostDto: CreatePostDto = req.body;
      const file = req.file;

      let imageUrl: string | undefined;
      if (file) {
        imageUrl = await imageService.uploadImage(file);
      }
      createPostDto.content = JSON.parse(req.body.content);
      const result = await PostService.createPost({ ...createPostDto, image: imageUrl });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatePostDto: UpdatePostDto = req.body;
      const authorId = req.user!.id;
      const file = req.file;

      let imageUrl: string | undefined;
      if (file) {
        imageUrl = await imageService.uploadImage(file);
        // If there's an existing image, delete it
        const existingPost = await PostService.getPostById(id);
        if (existingPost.image) {
          const oldImageKey = imageService.getKeyFromUrl(existingPost.image);
          await imageService.deleteImage(oldImageKey);
        }
      }

      const result = await PostService.updatePost(id, { ...updatePostDto, image: imageUrl }, authorId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const authorId = req.user!.id;
      const post = await PostService.getPostById(id);

      if (post.image) {
        const imageKey = imageService.getKeyFromUrl(post.image);
        await imageService.deleteImage(imageKey);
      }

      await PostService.deletePost(id, authorId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const result = await PostService.getPosts(Number(page) || 1, Number(limit) || 10);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await PostService.getPostById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
