import { z } from 'zod';

export const createIdeaClubSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
});

export const updateIdeaClubSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
});

export const getIdeaClubQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
