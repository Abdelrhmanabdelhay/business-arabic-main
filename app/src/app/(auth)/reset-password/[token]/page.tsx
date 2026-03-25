"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/lib/schemas/authSchema";

import { ResetPasswordMutation } from "@/lib/actions/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
const params = useParams();
const token = params?.token as string;

  const { resetPassword, isPending } = ResetPasswordMutation(token);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPassword({
        password: data.password,
      });

      router.push("/signIn");
    } catch (error: any) {
      setError("root", {
        message: error.response?.data?.message || "Something went wrong",
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
            <h1 className="text-3xl font-bold">إعادة تعيين كلمة المرور</h1>
            <p className="text-default-500 mt-2">
              أدخل كلمة المرور الجديدة
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    label="كلمة المرور"
                    placeholder="••••••••"
                    startContent={<FiLock />}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    label="تأكيد كلمة المرور"
                    placeholder="••••••••"
                    startContent={<FiLock />}
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message}
                  />
                )}
              />

              {/* Error */}
              {errors.root && (
                <p className="text-danger text-sm text-center">
                  {errors.root.message}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                isLoading={isPending}
              >
                إعادة تعيين كلمة المرور
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