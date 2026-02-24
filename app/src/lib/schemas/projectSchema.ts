import { z } from "zod";

const projectSchema = z.object({
    name: z.string().min(1, "اسم المشروع مطلوب"),
    description: z.string().min(1, "وصف المشروع مطلوب"),
    price: z.number().min(0, "السعر يجب أن يكون أكبر من صفر"),
    image: z.any().refine((file) => file instanceof File, "الصورة مطلوبة").nullable().optional(),
    category: z.string().min(1, "الوصف مطلوب"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export { projectSchema };
export type { ProjectFormData };