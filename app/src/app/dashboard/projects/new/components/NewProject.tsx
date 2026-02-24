"use client";
import { useState, useCallback, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { FiSave, FiArrowRight, FiUpload, FiDollarSign, FiImage } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AddProjectMutation } from "@/lib/actions/projects.actions";
import { ProjectFormData, projectSchema } from "@/lib/schemas/projectSchema";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function NewProject() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Add project mutation
  const {  mutateAsync: addLaunchedProject,
 isPending: isSubmitting, error: submitError, isError } = AddProjectMutation();

  // Form handling
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("حجم الملف يجب أن يكون أقل من 5 ميجابايت");
        return;
      }

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("يجب أن يكون الملف صورة بصيغة JPG أو PNG أو WebP");
        return;
      }

      // Set file and create preview
      setValue("image", file);
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  // Submit handler
  const onSubmit = async (data: ProjectFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("price", data.price.toString());
      formData.append("image", data.image);

      await addLaunchedProject(formData);
      toast.success("تم إضافة دراسة الجدوي بنجاح");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  // Handle API errors
  useEffect(() => {
    if (isError && submitError) {
      toast.error(submitError instanceof Error ? submitError.message : "حدث خطأ أثناء إضافة دراسة الجدوي");
    }
  }, [isError, submitError]);

  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-6">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-50/50 via-white to-primary-50/30 -z-10" />

      {/* Header Section */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-default-200/50 mb-6">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <div className="flex flex-col gap-4">
            <Breadcrumbs
              size="lg"
              classNames={{
                list: "gap-2",
              }}>
              <BreadcrumbItem>
                <Link href="/dashboard/projects" className="text-primary hover:opacity-70 transition-opacity">
                  دراسات الجدوي الجاهزة
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>إضافة دراسة جدوي جديد</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-900 bg-clip-text text-transparent">
                  إضافة دراسة جدوي جديد
                </h1>
                <p className="text-default-500 mt-1">قم بإضافة دراسة جدوي جديد للبيع</p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard/projects">
                  <Button
                    variant="light"
                    startContent={<FiArrowRight className="rtl:ml-2 ltr:mr-2" />}
                    className="font-medium">
                    عودة
                  </Button>
                </Link>
                <Button
                  color="primary"
                  startContent={<FiSave className="rtl:ml-2 ltr:mr-2" />}
                  className="bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                  size="lg"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isSubmitting}>
                  حفظ دراسة الجدوي
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Form Column */}
          <motion.div
            className="col-span-12 lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Card className="border border-default-200/50 bg-background/60 backdrop-blur-xl shadow-xl">
              <CardHeader className="border-b border-default-200/50">
                <h3 className="text-lg font-semibold">معلومات دراسة الجدوي</h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="اسم دراسة الجدوي"
                      placeholder="أدخل اسم دراسة الجدوي"
                      variant="bordered"
                      labelPlacement="outside"
                      className="w-full"
                      classNames={{
                        label: "font-semibold",
                        inputWrapper: "shadow-sm hover:shadow transition-shadow duration-200",
                      }}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="وصف دراسة الجدوي"
                      placeholder="اكتب وصفاً تفصيلياً للمشروع"
                      variant="bordered"
                      labelPlacement="outside"
                      minRows={4}
                      classNames={{
                        label: "font-semibold",
                        inputWrapper: "shadow-sm hover:shadow transition-shadow duration-200",
                      }}
                      errorMessage={errors.description?.message}
                      isInvalid={!!errors.description}
                    />
                  )}
                />

                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      label="سعر دراسة الجدوي"
                      placeholder="أدخل سعر دراسة الجدوي"
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={<FiDollarSign className="text-default-400" />}
                      className="w-full"
                      classNames={{
                        label: "font-semibold",
                        inputWrapper: "shadow-sm hover:shadow transition-shadow duration-200 my-2",
                      }}
                      errorMessage={errors.price?.message}
                      isInvalid={!!errors.price}
                      value={field.value?.toString() ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      label="تصنيف الفكره"
                      placeholder="أدخل تصنيف دراسة الجدوي"
                      variant="bordered"
                      labelPlacement="outside"
                      className="w-full"
                      classNames={{
                        label: "font-semibold",
                        inputWrapper: "shadow-sm hover:shadow transition-shadow duration-200 my-2",
                      }}
                      errorMessage={errors.category?.message}
                      isInvalid={!!errors.category}
                      value={field.value?.toString() ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </CardBody>
            </Card>
          </motion.div>

          {/* Sidebar Column */}
          <motion.div
            className="col-span-12 lg:col-span-4 lg:sticky lg:top-[8.5rem] lg:h-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="border border-default-200/50 bg-background/60 backdrop-blur-xl shadow-xl">
              <CardHeader className="border-b border-default-200/50">
                <h3 className="text-lg font-semibold">صورة دراسة الجدوي</h3>
              </CardHeader>
              <CardBody>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 ${isDragging
                    ? "border-primary-500 bg-primary-50"
                    : "border-default-200 hover:border-primary-500 hover:bg-default-50"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}>
                  {imagePreview ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          color="danger"
                          variant="flat"
                          size="sm"
                          onClick={() => {
                            setImagePreview(null);
                            setValue("image", null);
                          }}>
                          حذف الصورة
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] as File)}
                      />
                      <FiImage className="mx-auto h-12 w-12 text-default-300" />
                      <div className="mt-4">
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center rounded-md bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-100 cursor-pointer">
                          <FiUpload className="mr-2" />
                          اختر صورة
                        </label>
                      </div>
                      <p className="mt-2 text-xs text-default-400">أو قم بسحب وإفلات الصورة هنا</p>
                      {errors.image && <p className="mt-2 text-xs text-danger">{errors.image.message as string}</p>}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-default-400">
                  يجب أن تكون الصورة بصيغة JPG أو PNG أو WebP وحجم أقصى 5 ميجابايت
                </p>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
