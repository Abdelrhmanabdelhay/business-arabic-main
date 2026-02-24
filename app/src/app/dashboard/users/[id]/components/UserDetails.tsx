"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";

import { useParams, useRouter } from "next/navigation";
import { FiSave } from "react-icons/fi";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { z } from "zod";
import { GetUser, UpdateUserMutation } from "@/lib/actions/users.actions";
import { ApiError } from "@/types";

// Validation schema
const userSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  fullName: z.string().min(2, "الاسم يجب أن يكون على الأقل حرفين"),
  role: z.enum(["user", "admin", "super admin"]),
});

function UserDetails() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // Fetch user data
  const { data: user, isPending: isLoading } = GetUser({ id: userId });

  // Update mutation
  const { updateUser, isPending: isUpdating } = UpdateUserMutation({
    id: userId,
    page: 1,
  });

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "",
  });

  // Form errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      });
    }
  }, [user]);

  const validateForm = () => {
    try {
      userSchema.parse(formData);
      setErrors({});

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};

        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }

      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");

      return;
    }

    try {
      // @ts-ignore
      await updateUser(formData);
      toast.success("تم تحديث بيانات المستخدم بنجاح");
      router.push("/dashboard/users");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || "حدث خطأ أثناء تحديث بيانات المستخدم";

      console.log({ error });
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-semibold text-danger">خطأ في تحميل بيانات المستخدم</h3>
        <Button color="primary" variant="flat" as={Link} href="/dashboard/users" className="font-medium">
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
            <Link href="/dashboard/users" className="text-primary">
              المستخدمين
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>تعديل المستخدم</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex">
          <Button
            color="primary"
            variant="faded"
            startContent={<FiSave />}
            onClick={handleSubmit}
            isLoading={isUpdating}>
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="bg-white/50 backdrop-blur-lg">
          <CardHeader className="border-b border-divider">
            <h3 className="text-lg font-semibold">تعديل بيانات المستخدم</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6 p-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}`}
                  className="w-20 h-20 text-large"
                />
                <div>
                  <h4 className="text-default-500 text-small">الصورة الشخصية</h4>
                  <p className="text-tiny text-default-400">يمكنك تغيير الصورة الشخصية من خلال خدمة Gravatar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Input
                    label="الاسم الكامل"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    errorMessage={errors.fullName}
                    isInvalid={!!errors.fullName}
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    label="البريد الإلكتروني"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    errorMessage={errors.email}
                    isInvalid={!!errors.email}
                  />
                </div>

                <div className="space-y-2">
                  <Select
                    label="الصلاحية"
                    selectedKeys={[formData.role]}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    errorMessage={errors.role}
                    isInvalid={!!errors.role}>
                    <SelectItem key="user" value="user">
                      مستخدم
                    </SelectItem>
                    <SelectItem key="admin" value="admin">
                      مدير
                    </SelectItem>
                  </Select>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

export default UserDetails;
