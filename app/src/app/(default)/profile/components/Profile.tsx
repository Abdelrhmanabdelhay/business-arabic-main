"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { FiSave } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { z } from "zod";
import { GetProfile, UpdateUserMutation } from "@/lib/actions/users.actions";
import { ApiError } from "@/types";

// Validation schema
const profileSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  fullName: z.string().min(2, "الاسم يجب أن يكون على الأقل حرفين"),
});

function ProfileComponent() {
  // Fetch profile data
  const { data: profile, isPending: isLoading } = GetProfile();

  // Update mutation
  const { updateUser, isPending: isUpdating } = UpdateUserMutation({
    id: profile?.id || "",
    page: 1,
  });

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
  });

  // Form errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Populate form when profile data is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email,
        fullName: profile.fullName,
      });
    }
  }, [profile]);

  const validateForm = () => {
    try {
      profileSchema.parse(formData);
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
      await updateUser(formData);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || "حدث خطأ أثناء تحديث الملف الشخصي";
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

  if (!profile) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-semibold text-danger">خطأ في تحميل الملف الشخصي</h3>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="bg-white/50 backdrop-blur-lg">
          <CardHeader className="border-b border-divider flex justify-between items-center">
            <h3 className="text-lg font-semibold">الملف الشخصي</h3>
            <Button 
              color="primary" 
              variant="flat" 
              startContent={<FiSave />} 
              onClick={handleSubmit} 
              isLoading={isUpdating}
            >
              حفظ التغييرات
            </Button>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6 p-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar
                  src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.fullName}`}
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
              </div>

              <div className="space-y-2">
                <div className="text-small text-default-500">
                  تاريخ الانضمام: {new Date(profile.createdAt).toLocaleDateString('ar-SA')}
                </div>
                <div className="text-small text-default-500">
                  الصلاحية: {profile.role === 'user' ? 'مستخدم' : profile.role === 'admin' ? 'مدير' : 'مدير عام'}
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

export default ProfileComponent;
