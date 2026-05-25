"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { useParams, useRouter } from "next/navigation";
import { FiSave, FiUpload, FiX } from "react-icons/fi";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { z } from "zod";
import { GetBlog, UpdateBlogMutation, CreateBlogMutation } from "@/lib/actions/blogs.actions";
import { ApiError } from "@/types";
import Image from "next/image";

// Validation schema
const blogSchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون على الأقل 3 أحرف"),
  summary: z.string().min(10, "الملخص يجب أن يكون على الأقل 10 أحرف"),
  content: z.string().min(10, "المحتوى يجب أن يكون على الأقل 10 أحرف"),
  image: z.string().optional(),
});

function BlogDetails() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;
  const isNew = blogId === "new";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch blog data (skip for new)
  const { data: blog, isPending: isLoading } = GetBlog({ id: isNew ? "" : blogId });

  // Mutations
  const { updateBlog, isPending: isUpdating } = UpdateBlogMutation({ id: blogId, page: 1 });
  const { createBlog, isPending: isCreating } = CreateBlogMutation();

  const isSaving = isUpdating || isCreating;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imagePreview, setImagePreview] = useState<string>("");

  // Populate form when blog data is loaded
  useEffect(() => {
    if (blog && !isNew) {
      setFormData({
        title: blog.title,
        summary: blog.summary,
        // content is Map<object, any>[] — stringify for editing
content: (() => {
  if (typeof blog.content === "string") return blog.content;
  if (Array.isArray(blog.content) && blog.content.length === 1) {
    const block = blog.content[0] as Record<string, any>;
    if (block["type"] === "paragraph") return block["text"] as string;
  }
  // Multiple blocks — extract all text joined by double newline
  if (Array.isArray(blog.content)) {
    const allText = (blog.content as Record<string, any>[])
      .map((block) => block["text"] ?? "")
      .filter(Boolean)
      .join("\n\n");
    if (allText) return allText;
  }
  return JSON.stringify(blog.content, null, 2);
})(),     
  image: blog.image || "",
      });
      if (blog.image) setImagePreview(blog.image);
    }
  }, [blog, isNew]);

  const validateForm = () => {
    try {
      blogSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  if (file.size > MAX_SIZE_BYTES) {
    toast.error(`حجم الصورة كبير جداً — الحد الأقصى ${MAX_SIZE_MB}MB`);
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result as string;
    setImagePreview(result);
    setFormData((prev) => ({ ...prev, image: result }));
  };
  reader.readAsDataURL(file);
};

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    // Parse content back to the expected format
    let parsedContent: object[];
    try {
      parsedContent = JSON.parse(formData.content);
      if (!Array.isArray(parsedContent)) throw new Error();
} catch {
  // Split by double newline to preserve paragraph structure
  parsedContent = formData.content
    .split(/\n\n+/)
    .filter(Boolean)
    .map((paragraph) => ({ type: "paragraph", text: paragraph.trim() }));
}

    const payload = {
      title: formData.title,
      summary: formData.summary,
      content: parsedContent,
      ...(formData.image ? { image: formData.image } : {}),
    };

    try {
      if (isNew) {
        // @ts-ignore
        await createBlog(payload);
        toast.success("تم إنشاء المقال بنجاح");
      } else {
        // @ts-ignore
        await updateBlog(payload);
        toast.success("تم تحديث المقال بنجاح");
      }
      router.push("/dashboard/blogs");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || "حدث خطأ أثناء حفظ المقال";
      toast.error(errorMessage);
    }
  };

  if (!isNew && isLoading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!isNew && !blog) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-semibold text-danger">خطأ في تحميل بيانات المقال</h3>
        <Button color="primary" variant="flat" as={Link} href="/dashboard/blogs" className="font-medium">
          العودة للقائمة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem>
            <Link href="/dashboard/blogs" className="text-primary">
              المقالات
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{isNew ? "إضافة مقال" : "تعديل المقال"}</BreadcrumbItem>
        </Breadcrumbs>
        <Button
          color="primary"
          variant="faded"
          startContent={<FiSave />}
          onClick={() => handleSubmit()}
          isLoading={isSaving}
        >
          {isNew ? "نشر المقال" : "حفظ التغييرات"}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Main Info Card */}
        <Card className="bg-white/50 backdrop-blur-lg">
          <CardHeader className="border-b border-divider">
            <h3 className="text-lg font-semibold">بيانات المقال</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6 p-4">
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <Input
                  label="عنوان المقال"
                  placeholder="أدخل عنوان المقال"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  errorMessage={errors.title}
                  isInvalid={!!errors.title}
                />

                {/* Summary */}
                <Textarea
                  label="ملخص المقال"
                  placeholder="أدخل ملخصاً مختصراً للمقال"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  errorMessage={errors.summary}
                  isInvalid={!!errors.summary}
                  minRows={3}
                />

                {/* Content */}
                <Textarea
                  label="محتوى المقال"
                  placeholder="أدخل محتوى المقال (نص عادي أو JSON)"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  errorMessage={errors.content}
                  isInvalid={!!errors.content}
                  minRows={10}
                  classNames={{
                    input: "font-mono text-sm",
                  }}
                  description="يمكنك إدخال نص عادي أو JSON منسق لمحرر النصوص الغني"
                />
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Image Card */}
        <Card className="bg-white/50 backdrop-blur-lg">
          <CardHeader className="border-b border-divider">
            <h3 className="text-lg font-semibold">صورة المقال</h3>
          </CardHeader>
          <CardBody className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {imagePreview ? (
              <div className="relative w-full max-w-md">
                <Image
                  src={imagePreview}
                  alt="صورة المقال"
                  width={600}
                  height={300}
                  className="rounded-xl object-cover w-full max-h-64"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="solid"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <FiX size={16} />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-divider rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload size={32} className="text-default-400" />
                <p className="text-default-500 text-sm">اضغط لرفع صورة المقال</p>
                <p className="text-tiny text-default-400">PNG, JPG, WEBP — الحد الأقصى 5MB</p>
              </div>
            )}

            {imagePreview && (
              <Button
                variant="flat"
                size="sm"
                startContent={<FiUpload size={14} />}
                className="mt-3"
                onClick={() => fileInputRef.current?.click()}
              >
                تغيير الصورة
              </Button>
            )}

            {/* Or enter URL manually */}
            <div className="mt-4">
              <Input
                label="أو أدخل رابط الصورة"
                placeholder="https://example.com/image.jpg"
                value={formData.image.startsWith("data:") ? "" : formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                size="sm"
              />
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

export default BlogDetails;