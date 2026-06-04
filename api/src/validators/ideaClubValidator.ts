import { z } from 'zod';

const contentSchema = z.union([
  z.string().min(1, 'Content is required'),
  z.array(z.string().min(1, 'Content items cannot be empty')).min(1),
]);

export const createIdeaClubSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    content: contentSchema,
  }),
});

export const updateIdeaClubSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    content: contentSchema.optional(),
  }),
});

export const getIdeaClubQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});
