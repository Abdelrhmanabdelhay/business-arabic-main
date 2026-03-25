"use client";

import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

import { ForgotPasswordInput, forgotPasswordSchema } from "@/lib/schemas/authSchema";
import { ForgotPasswordMutation } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const { forgotPassword, isPending } = ForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPassword(data);
      reset();
    } catch (error: any) {
      setError("root", {
        message: error.response?.data?.message || "حدث خطأ",
      });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-primary-50" />
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">استعادة كلمة المرور</h1>
            <p className="text-default-500 mt-2">
              أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="البريد الإلكتروني"
                    placeholder="name@example.com"
                    startContent={<FiMail />}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                  />
                )}
              />

              {errors.root && (
                <p className="text-danger text-sm text-center">
                  {errors.root.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                isLoading={isPending}
              >
                إرسال الرابط
              </Button>

              <Divider />

              <p className="text-center text-sm">
                رجوع إلى{" "}
                <Link href="/signIn" className="text-primary">
                  تسجيل الدخول
                </Link>
              </p>

            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}