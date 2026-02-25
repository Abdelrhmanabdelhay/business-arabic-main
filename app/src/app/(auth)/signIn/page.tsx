"use client";
import { useState } from "react";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/lib/schemas/authSchema";

import { FiMail, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInMutation } from "@/lib/actions/auth";
import { useUserStore } from "@/lib/stores/useUserStore";
import { setCookie } from "nookies";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isPending } = SignInMutation();
  const { setUser, setToken } = useUserStore()
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await signIn(data);

      setUser(response.user);
      setToken(response.token);
      console.log(response.token);
      setCookie(null, "token", response.token, {
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days (optional but recommended)
});

      router.push(response.user.role === "user" ? "/" : "/dashboard");
    } catch (error: any) {
      console.log({error})
      setError("root", {
        message: error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب",
      });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-primary-50" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary-200/50 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-primary-300/50 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent">
              مرحباً بك
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-default-500 mt-2">
              سجل الآن للوصول إلى جميع الميزات
            </motion.p>
          </div>

          {/* Sign Up Form */}
          <Card className="backdrop-blur-xl bg-white/80 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="البريد الإلكتروني"
                      placeholder="name@example.com"
                      labelPlacement="outside"
                      startContent={<FiMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                      errorMessage={errors.email?.message}
                      isInvalid={!!errors.email}
                      variant="bordered"
                      classNames={{
                        label: "font-semibold text-default-700",
                        input: "text-right",
                        inputWrapper: [
                          "shadow-sm",
                          "backdrop-blur-xl",
                          "hover:shadow",
                          "transition-all",
                          "duration-200",
                          "group-data-[focused=true]:shadow-lg",
                        ],
                      }}
                    />
                  )}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      label="كلمة المرور"
                      placeholder="••••••••"
                      labelPlacement="outside"
                      startContent={<FiLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                      errorMessage={errors.password?.message}
                      isInvalid={!!errors.password}
                      variant="bordered"
                      classNames={{
                        label: "font-semibold text-default-700",
                        input: "text-right",
                        inputWrapper: [
                          "shadow-sm",
                          "backdrop-blur-xl",
                          "hover:shadow",
                          "transition-all",
                          "duration-200",
                          "group-data-[focused=true]:shadow-lg",
                        ],
                      }}
                    />
                  )}
                />
              </motion.div>

              {errors.root && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-danger text-sm text-center">
                  {errors.root.message}
                </motion.p>
              )}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-tr from-primary-500 to-primary-600 text-white font-medium shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                  size="lg"
                  isLoading={isPending}>
                  {isPending ? "جاري تسجيل الدخول" : "تسجيل الدخول"}
                </Button>
              </motion.div>

              <Divider className="my-4" />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm text-default-500">
                ليس لديك حساب؟{" "}
                <Link href="/signup" className="text-primary-600 font-semibold hover:underline">
                  يمكنك انشاء حساب الآن
                </Link>
              </motion.p>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
