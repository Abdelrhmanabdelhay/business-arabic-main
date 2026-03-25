"use client";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInput, registerSchema } from "@/lib/schemas/authSchema";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignUpMutation } from "@/lib/actions/auth";
import { useSearchParams } from "next/navigation";
import { API_URL } from "../../../constants/constants";
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
const selectedPlan = searchParams.get("plan");
const selectedPrice = searchParams.get("price");
const selectedName = searchParams.get("name");
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", fullName: "" },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsPending(true);
    try {
      
      const res = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
      plan: selectedPlan,
        price: Number(selectedPrice),                    
        name: decodeURIComponent(selectedName ?? ""),   
        image: "",                  
          userData: data }),
      });
      const result = await res.json();
      if (!result.url) throw new Error("No checkout URL returned");
      window.location.href = result.url;
    } catch (error: any) {
      setIsPending(false);
      setError("root", { message: error.message || "فشل بدء عملية الدفع" });
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{ fontFamily: "'Tajawal', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;600;700&display=swap');`}</style>

      {/* ── Original background ── */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-primary-50" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary-200/50 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-primary-300/50 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "32px 32px 24px",
            textAlign: "center",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent"
            style={{
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 6px",
              letterSpacing: "-0.01em",
            }}
          >
            مرحباً بك
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 13.5, color: "#71717a", margin: 0, fontWeight: 400 }}
          >
            سجل الآن للوصول إلى جميع الميزات
          </motion.p>

          {/* Plan badge */}
          <AnimatePresence>
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                style={{ marginTop: 14 }}
              >
                <span
                  className="bg-primary-50 text-primary-700 border border-primary-200"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 14px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                  }}
                >
                  <span
                    className="bg-primary-500"
                    style={{ width: 6, height: 6, borderRadius: "50%", display: "inline-block" }}
                  />
                  الخطة المختارة: {selectedPlan}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "28px 32px 32px" }}>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {/* Full Name */}
            <motion.div variants={fadeUp}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="الاسم الكامل"
                    placeholder="أدخل اسمك الكامل"
                    labelPlacement="outside"
                    startContent={
                      <FiUser className="text-default-400 flex-shrink-0" style={{ fontSize: 16 }} />
                    }
                    errorMessage={errors.fullName?.message}
                    isInvalid={!!errors.fullName}
                    variant="bordered"
                    classNames={{
                      label: "font-semibold text-default-600 text-sm",
                      input: "text-right text-sm",
                      inputWrapper: [
                        "bg-white/60",
                        "backdrop-blur-sm",
                        "border-default-200",
                        "hover:border-primary-300",
                        "transition-all duration-200",
                        "group-data-[focused=true]:border-primary-500",
                        "group-data-[focused=true]:shadow-[0_0_0_3px_theme(colors.primary.100)]",
                        "rounded-xl",
                      ],
                    }}
                  />
                )}
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    label="البريد الإلكتروني"
                    placeholder="name@example.com"
                    labelPlacement="outside"
                    startContent={
                      <FiMail className="text-default-400 flex-shrink-0" style={{ fontSize: 16 }} />
                    }
                    errorMessage={errors.email?.message}
                    isInvalid={!!errors.email}
                    variant="bordered"
                    classNames={{
                      label: "font-semibold text-default-600 text-sm",
                      input: "text-right text-sm",
                      inputWrapper: [
                        "bg-white/60",
                        "backdrop-blur-sm",
                        "border-default-200",
                        "hover:border-primary-300",
                        "transition-all duration-200",
                        "group-data-[focused=true]:border-primary-500",
                        "group-data-[focused=true]:shadow-[0_0_0_3px_theme(colors.primary.100)]",
                        "rounded-xl",
                      ],
                    }}
                  />
                )}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp}>
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
                    startContent={
                      <FiLock className="text-default-400 flex-shrink-0" style={{ fontSize: 16 }} />
                    }
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-default-400 hover:text-default-600 transition-colors"
                        tabIndex={-1}
                        aria-label="إظهار/إخفاء كلمة المرور"
                      >
                        {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    }
                    errorMessage={errors.password?.message}
                    isInvalid={!!errors.password}
                    variant="bordered"
                    classNames={{
                      label: "font-semibold text-default-600 text-sm",
                      input: "text-right text-sm",
                      inputWrapper: [
                        "bg-white/60",
                        "backdrop-blur-sm",
                        "border-default-200",
                        "hover:border-primary-300",
                        "transition-all duration-200",
                        "group-data-[focused=true]:border-primary-500",
                        "group-data-[focused=true]:shadow-[0_0_0_3px_theme(colors.primary.100)]",
                        "rounded-xl",
                      ],
                    }}
                  />
                )}
              />
            </motion.div>

            {/* Root error */}
            <AnimatePresence>
              {errors.root && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="bg-danger-50 border border-danger-200 text-danger"
                  style={{
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  {errors.root.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div variants={fadeUp} style={{ marginTop: 2 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-tr from-primary-500 to-primary-600 text-white font-semibold shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                size="lg"
                radius="md"
                isLoading={isPending}
                style={{ height: 48, fontSize: 15, borderRadius: 12 }}
              >
                {isPending ? "جاري تحويلك للدفع..." : "إكمال الاشتراك"}
              </Button>
            </motion.div>

            {/* Divider + Sign in link */}
            <motion.div variants={fadeUp}>
              <Divider className="my-1" />
              <p style={{ textAlign: "center", fontSize: 13.5, color: "#71717a", marginTop: 14, margin: "14px 0 0" }}>
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/signIn"
                  className="text-primary-600 font-semibold hover:text-primary-800 transition-colors"
                  style={{ textDecoration: "none" }}
                >
                  تسجيل الدخول
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}