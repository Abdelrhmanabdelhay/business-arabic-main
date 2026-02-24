import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const userUpdateSchema = userSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

export type UserValidationSchema = z.infer<typeof userSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
