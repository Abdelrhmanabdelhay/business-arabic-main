"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Block } from "@blocknote/core";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalBody } from "@nextui-org/modal";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { Chip } from "@nextui-org/chip";
import { FiSave, FiArrowRight, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import TextEditorSkeleton from "@/components/PagesComponents/TextEditor/TextEditorSkeleton";
import { AddIdeaMutation } from "@/lib/actions/ideas.actions";
import { useRouter } from "next/navigation";
import { IdeaFormData, ideaSchema } from "@/lib/schemas/ideaSchema";

const TextEditor = dynamic(() => import("@/components/PagesComponents/TextEditor/TextEditor"), {
  loading: () => <TextEditorSkeleton />,
  ssr: false,
});




const initialInputs = {
  name: "",
  description: "",
  content: [],
};

export default function NewIdea() {
  const router = useRouter();
  // State
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Integration
  const { addIdea, isPending, error, isError } = AddIdeaMutation();

  // Form handling
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
    defaultValues: initialInputs,
  });

  // Memoize editor change handler
  const handleEditorChange = useCallback(
    (newBlocks: Block[]) => {
      setBlocks(newBlocks);
      setValue("content", newBlocks);
    },
    [setValue]
  );

  // Memoize the editor component
  const MemoizedEditor = useMemo(
    // @ts-ignore
    () => <TextEditor blocks={blocks} setBlocks={handleEditorChange} editable={true} />,
    [blocks, handleEditorChange]
  );

  const handleSubmitData = async (data: IdeaFormData) => {
    try {
      // Create form data
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("content", JSON.stringify(blocks));

      // Submit using mutation
      await addIdea(formData);

      // Show success message
      toast.success("تم إنشاء الفكرة بنجاح");

      // Reset form and redirect
      reset(initialInputs);
      setBlocks([]);
      router.push("/dashboard/ideas");
    } catch (error) {
      // Error handling is done through the mutation's error state
      console.error("Submission error:", error);
    }
  };

  const watchedContent = watch(["name", "description", "category"]);

  // Handle API errors
  useEffect(() => {
    if (isError && error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الفكرة");
    }
  }, [isError, error]);

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
                <Link href="/dashboard/ideas" className="text-primary hover:opacity-70 transition-opacity">
                  نادي الأفكار
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>إضافة فكرة جديدة</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-900 bg-clip-text text-transparent">
                  إضافة فكرة جديدة
                </h1>
                <p className="text-default-500 mt-1">قم بإضافة فكرة جديدة إلى نادي الأفكار</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="flat"
                  startContent={<FiEye className="rtl:ml-2 ltr:mr-2" />}
                  onClick={() => setIsPreviewOpen(true)}
                  isDisabled={!watchedContent[0] || blocks.length === 0}
                  className="bg-default-100 hover:bg-default-200">
                  معاينة
                </Button>
                <Link href="/dashboard/ideas">
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
                  onClick={handleSubmit(handleSubmitData)}
                  isLoading={loading}>
                  حفظ الفكرة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 space-y-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Editor Column */}
          <motion.div
            className="col-span-12 lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Card className="border border-default-200/50 bg-background/60 backdrop-blur-xl shadow-xl">
              <CardHeader className="border-b border-default-200/50 pb-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="اسم الفكرة"
                      placeholder="أدخل اسم الفكرة"
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
              </CardHeader>
              <CardBody className="p-0">
                <div className="min-h-[600px] overflow-hidden rounded-lg">{MemoizedEditor}</div>
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
                <h3 className="text-lg font-semibold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  تفاصيل الفكرة
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="وصف الفكرة"
                      placeholder="أدخل وصف الفكرة"
                      variant="bordered"
                      labelPlacement="outside"
                      className="w-full"
                      classNames={{
                        label: "font-semibold",
                        inputWrapper: "shadow-sm hover:shadow transition-shadow duration-200",
                      }}
                      errorMessage={errors.category?.message}
                      isInvalid={!!errors.category}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="وصف مختصر"
                      placeholder="اكتب وصفاً مختصراً للفكرة"
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
                <div className="flex gap-2 flex-wrap">
                  <Chip
                    size="sm"
                    variant="flat"
                    classNames={{
                      base: "bg-gradient-to-r from-warning-100 to-warning-200",
                      content: "text-warning-700 font-medium",
                    }}>
                    معلومات إضافية
                  </Chip>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        size="full"
        scrollBehavior="inside"
        classNames={{
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-white dark:bg-[#19172c] border-2",
          header: "border-b-[1px] border-[#292f46]",
          body: "py-6",
        }}>
        <ModalContent>
          <ModalBody className="p-0">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  {watchedContent[0]}
                </h1>
                <p className="text-default-600 mb-8 text-lg">{watchedContent[1]}</p>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <TextEditor blocks={blocks} setBlocks={() => { }} editable={false} />
                </div>
              </motion.div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
