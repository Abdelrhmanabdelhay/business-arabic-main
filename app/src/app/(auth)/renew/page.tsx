"use client";
import { Suspense, useEffect } from "react";

import { useState } from "react";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "@/lib/axios";

const planLabels: Record<string, string> = {
  monthly: "الباقة الشهرية",
  quarterly: "باقة 3 شهور",
  yearly: "الباقة السنوية",
};

export default function RenewPage() {
const [selectedPlan, setSelectedPlan] = useState("quarterly");

useEffect(() => {
  const plan =
    new URLSearchParams(window.location.search).get("plan");

  if (plan) setSelectedPlan(plan);
}, []);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRenew = async () => {
    setIsPending(true);
    setError(null);
    try {
      const res = await axiosInstance.post(
        "/stripe/renew-checkout-session",
        { plan: selectedPlan },
        { withCredentials: true }
      );
      if (!res.data.url) throw new Error("No checkout URL");
      window.location.href = res.data.url;
    } catch (err: any) {
      setIsPending(false);
      setError(err?.response?.data?.message || err?.response?.data?.error || "فشل بدء عملية الدفع");
    }
  };

  return (
    <Suspense fallback="جاري التحميل...">
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-4"
      style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-primary-50" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary-200/50 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-primary-300/50 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%", maxWidth: 420,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "32px 32px 24px", textAlign: "center", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent"
            style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px" }}
          >
            تجديد الاشتراك
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 13.5, color: "#71717a", margin: 0 }}
          >
            اختر الخطة وجدّد اشتراكك للاستمرار
          </motion.p>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Plan selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(planLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedPlan(key)}
                style={{
                  width: "100%", padding: "14px 18px",
                  borderRadius: 12, fontSize: 14, fontWeight: 600,
                  border: `2px solid ${selectedPlan === key ? "#185FA5" : "#e4e4e7"}`,
                  color: selectedPlan === key ? "#185FA5" : "#71717a",
                  background: selectedPlan === key ? "#eff6ff" : "white",
                  cursor: "pointer", transition: "all 0.2s",
                  textAlign: "right",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-danger-50 border border-danger-200 text-danger"
                style={{ borderRadius: 10, padding: "10px 14px", fontSize: 13, textAlign: "center" }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <Button
            onPress={handleRenew}
            className="w-full bg-gradient-to-tr from-primary-500 to-primary-600 text-white font-semibold shadow-lg"
            size="lg" radius="md" isLoading={isPending}
            style={{ height: 48, fontSize: 15, borderRadius: 12 }}
          >
            {isPending ? "جاري تحويلك للدفع..." : `تجديد بـ ${planLabels[selectedPlan]}`}
          </Button>
        </div>
      </motion.div>
    </div>
    </Suspense>
  );
}