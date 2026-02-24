// src/validators/postValidator.ts

import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string()
      .min(1, 'Title is required')
      .max(200, 'Title must be 200 characters or less'),

    content: z.string()
      .min(1, 'Content is required'),

    image: z.string()
      .url('Invalid image URL')
      .optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string()
      .min(1, 'Title is required')
      .max(200, 'Title must be 200 characters or less')
      .optional(),

    content: z.string()
      .min(1, 'Content is required')
      .optional(),

    image: z.string()
      .url('Invalid image URL')
      .optional(),
  }),
});

export const getPostsQuerySchema = z.object({
  query: z.object({
    page: z.string()
      .regex(/^\d+$/)
      .transform(Number)
      .optional(),

    limit: z.string()
      .regex(/^\d+$/)
      .transform(Number)
      .optional(),
  }),
});