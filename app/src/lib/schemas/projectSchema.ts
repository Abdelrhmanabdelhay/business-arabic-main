import { z } from "zod";

const projectSchema = z.object({
    name: z.string().min(1, "اسم المشروع مطلوب"),
    description: z.string().min(1, "وصف المشروع مطلوب"),
    price: z.number().min(0, "السعر يجب أن يكون أكبر من صفر"),
    image: z.any().refine((file) => file instanceof File, "الصورة مطلوبة").nullable().optional(),
    category: z.string().min(1, "الوصف مطلوب"),
pdf: z.instanceof(File).nullable()});

type ProjectFormData = z.infer<typeof projectSchema>;
export const editProjectSchema = projectSchema.extend({
  image: z.any().optional().nullable(),
  pdf: z.any().optional().nullable(),
});
export { projectSchema };
export type { ProjectFormData };