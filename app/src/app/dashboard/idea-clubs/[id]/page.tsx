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
import {
  GetIdeaClub,
  UpdateIdeaClubMutation,
  CreateIdeaClubMutation,
} from "@/lib/actions/idea-clubs.actions";
import Image from "next/image";

// ✅ Validation
const ideaClubSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون على الأقل 3 أحرف"),
  description: z.string().min(10, "الوصف يجب أن يكون على الأقل 10 أحرف"),
  category: z.string().min(1, "يرجى اختيار الفئة"),
  content: z.string().min(10, "المحتوى يجب أن يكون على الأقل 10 أحرف"),
  imageUrl: z.string().optional(),
});

function IdeaClubDetails() {
  const params = useParams();
  const router = useRouter();
  const ideaClubId = params.id as string;
  const isNew = ideaClubId === "new";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: ideaClub, isPending: isLoading } = GetIdeaClub({
    id: isNew ? "" : ideaClubId,
  });

  const { updateIdeaClub, isPending: isUpdating } =
    UpdateIdeaClubMutation({ id: ideaClubId, page: 1 });

  const { createIdeaClub, isPending: isCreating } =
    CreateIdeaClubMutation();

  const isSaving = isUpdating || isCreating;

  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    content: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imagePreview, setImagePreview] = useState("");

  // ✅ Load data
  useEffect(() => {
    if (ideaClub && !isNew) {
      setFormData({
        name: ideaClub.name || "",
        description: ideaClub.description || "",
        category: ideaClub.category || "",
        content: Array.isArray(ideaClub.content)
          ? ideaClub.content.join("\n")
          : ideaClub.content || "",
        imageUrl: ideaClub.imageUrl || "",
      });
    }
  }, [ideaClub, isNew]);

  // ✅ Validation
  const validateForm = () => {
    try {
      ideaClubSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: any = {};
        error.errors.forEach((err) => {
          if (err.path) newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // ✅ Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("handleImageChange - selected file", file.name, file.type, file.size);

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة كبير جداً — الحد الأقصى 5MB");
      return;
    }

    // store file immediately so it's available for submit even if FileReader is still working
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      console.log("handleImageChange - preview result length", result.length);
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  // ✅ Submit
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    console.log("handleSubmit - payload", {
      ...formData,
      imageFile: selectedFile,
      imagePreview: imagePreview ? imagePreview.slice(0, 100) : null,
    });

    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء");
      return;
    }

    try {
      console.log('Submitting ideaClub with selectedFile:', !!selectedFile, selectedFile?.name, 'imagePreview:', !!imagePreview);
      if (isNew) {
        await createIdeaClub({ ...formData, imageFile: selectedFile ?? undefined });
        toast.success("تم الإنشاء");
      } else {
        await updateIdeaClub({ ...formData, imageFile: selectedFile ?? undefined });
        toast.success("تم التحديث");
      }

      router.push("/dashboard/idea-clubs");
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || "حدث خطأ أثناء الحفظ";
      console.log("handleSubmit - error", error);
      toast.error(msg);
    }
  };

  // ✅ Loading
  if (!isNew && isLoading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Breadcrumbs>
          <BreadcrumbItem>
            <Link href="/dashboard/idea-clubs">نوادي الأفكار</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            {isNew ? "إضافة" : "تعديل"}
          </BreadcrumbItem>
        </Breadcrumbs>

        <Button onClick={handleSubmit} isLoading={isSaving}>
          <FiSave /> حفظ
        </Button>
      </div>

      {/* Form */}
      <motion.div className="space-y-6">
        {/* Info */}
        <Card>
          <CardBody className="space-y-4">
            <Input
              label="الاسم"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />

            <Textarea
              label="الوصف"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />

            <Input
              label="الفئة"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
            />
          </CardBody>
        </Card>

        {/* ✅ Content بدل Editor */}
        <Card>
          <CardHeader>المحتوى</CardHeader>
          <CardBody>
            <Textarea
              minRows={6}
              placeholder="اكتب محتوى الفكرة هنا..."
              value={formData.content}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: e.target.value,
                })
              }
              isInvalid={!!errors.content}
              errorMessage={errors.content}
            />
          </CardBody>
        </Card>

        {/* Image */}
        <Card>
          <CardBody>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            {(imagePreview || formData.imageUrl) ? (
              <div className="relative inline-block">
                <Image
                  src={imagePreview || formData.imageUrl}
                  alt={formData.name || "preview"}
                  width={500}
                  height={300}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
                <div className="absolute top-2 left-2">
                  <Button size="sm" color="danger" onClick={handleRemoveImage}>
                    <FiX />
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => fileInputRef.current?.click()}>
                <FiUpload /> رفع صورة
              </Button>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

export default IdeaClubDetails;