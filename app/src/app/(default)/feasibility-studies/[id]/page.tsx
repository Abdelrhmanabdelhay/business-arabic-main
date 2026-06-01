"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { FaTag, FaInfoCircle } from "react-icons/fa";
import Image from "next/image";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { useFeasibilityDetails } from "./api/queries";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface PackagePlan {
  id: "basic" | "pro" | "premium";
  name: string;
  duration: string;
  price: number;
  accentColor: string;
  featured: boolean;
  serviceType: string;
  features: string[];
}

// ─────────────────────────────────────────────
// Loading Skeleton
// ─────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-[420px]" />
    <div className="p-8 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Study components section — replace content
// when real API data is available
// ─────────────────────────────────────────────
const STUDY_COMPONENTS = [
  { icon: "📊", titleAr: "التحليل السوقي",    descAr: "دراسة شاملة للسوق المستهدف والمنافسين وفرص النمو." },
  { icon: "💰", titleAr: "التحليل المالي",    descAr: "توقعات الإيرادات والتكاليف ومؤشرات العائد على الاستثمار." },
  { icon: "⚙️", titleAr: "الجدوى التشغيلية", descAr: "تقييم الاحتياجات التشغيلية والموارد البشرية والبنية التحتية." },
  { icon: "📋", titleAr: "الإطار القانوني",   descAr: "المتطلبات التنظيمية والتراخيص والامتثال القانوني." },
  { icon: "🎯", titleAr: "الخطة التسويقية",  descAr: "استراتيجيات التسويق وخطط الوصول إلى الجمهور المستهدف." },
  { icon: "📈", titleAr: "تحليل المخاطر",    descAr: "تحديد المخاطر المحتملة وخطط التخفيف والإدارة." },
];

// ─────────────────────────────────────────────
// Hardcoded package plans (prices fixed)
// ─────────────────────────────────────────────
const PACKAGES: PackagePlan[] = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    duration: "Basic",
    price: 200,
    accentColor: "#2d4ef5",
    featured: false,
    serviceType: "FeasibilityStudy_Basic",
    features: [
      "دراسة جدوى جاهزة",
      "عدد 1 تعديل على دراسة الجدوى",
      "اشتراك لمدة شهر في نادي افكار المشاريع",
    ],
  },
  {
    id: "pro",
    name: "دعم أولوية",
    duration: "Pro",
    price: 400,
    accentColor: "#f97316",
    featured: true,
    serviceType: "FeasibilityStudy_Pro",
    features: [
      "دراسة جدوى جاهزة",
      "عدد 3 تعديلات على دراسة الجدوى",
      "اشتراك لمدة 3 أشهر في نادي افكار المشاريع",
      "دعم أولوية عبر الواتساب",
    ],
  },
  {
    id: "premium",
    name: "دعم الدعم",
    duration: "Premium",
    price: 700,
    accentColor: "#7c3aed",
    featured: false,
    serviceType: "FeasibilityStudy_Premium",
    features: [
      "دراسة جدوى جاهزة",
      "تعديلات غير محدودة",
      "اشتراك لمدة 6 أشهر في نادي افكار المشاريع",
      "دعم VIP مباشر",
      "جلسة استشارية مع خبير",
    ],
  },
];

// ─────────────────────────────────────────────
// Pricing Card — matches the PricingCard design
// ─────────────────────────────────────────────
function PricingCard({
  plan,
  index,
}: {
  plan: PackagePlan;
  index: number;
}) {
  const router = useRouter();
  const isFeatured = plan.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{
        position: "relative",
        marginTop: isFeatured ? "-20px" : "0",
      }}
    >
      {/* Popular badge */}
      {isFeatured && (
        <div style={{
          position: "absolute", top: "-14px", left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #f97316, #ea580c)",
          color: "#fff",
          fontFamily: "'Cairo', sans-serif",
          fontSize: "0.72rem", fontWeight: 800,
          padding: "5px 20px", borderRadius: "20px",
          boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
          whiteSpace: "nowrap", zIndex: 10,
          letterSpacing: "0.05em",
        }}>
          ⭐ الأكثر شيوعاً
        </div>
      )}

      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: isFeatured
          ? "0 20px 60px rgba(249,115,22,0.15), 0 8px 24px rgba(0,0,0,0.1)"
          : "0 4px 24px rgba(0,0,0,0.07)",
        border: isFeatured ? `2px solid ${plan.accentColor}` : "2px solid transparent",
        transition: "box-shadow 0.3s",
      }}>
        {/* Colored header */}
        <div style={{
          background: plan.accentColor,
          padding: "28px 28px 24px",
          textAlign: "right",
        }}>
          <div style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "0.8rem", fontWeight: 700,
            color: "rgba(255,255,255,0.8)",
            marginBottom: "6px",
            letterSpacing: "0.05em",
          }}>
            {plan.duration}
          </div>
          <h3 style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "1.25rem", fontWeight: 900,
            color: "#fff", margin: "0 0 16px",
          }}>
            {plan.name}
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
            <span style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "3.2rem", fontWeight: 900,
              color: "#fff", lineHeight: 1,
            }}>
              {plan.price.toLocaleString("ar-SA")}
            </span>
            <span style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "0.9rem", color: "rgba(255,255,255,0.8)",
              marginBottom: "8px",
            }}>
              ريال
            </span>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "24px 28px 28px", textAlign: "right" }}>
          {/* Features */}
          <ul style={{
            listStyle: "none", margin: "0 0 28px", padding: 0,
            display: "flex", flexDirection: "column", gap: "12px",
          }}>
            {plan.features.map((f, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "center", gap: "10px",
                fontFamily: "'Cairo', sans-serif",
                fontSize: "0.9rem", color: "#374151",
              }}>
                <span style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: plan.accentColor + "18",
                  color: plan.accentColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 800, flexShrink: 0,
                }}>
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={() => router.push(`/signup?plan=${plan.id}`)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "40px",
              border: "none",
              background: isFeatured
                ? `linear-gradient(135deg, ${plan.accentColor}, #ea580c)`
                : `linear-gradient(135deg, #0f1b6e, #2d4ef5)`,
              color: "#fff",
              fontFamily: "'Cairo', sans-serif",
              fontSize: "1rem", fontWeight: 700,
              cursor: "pointer",
              boxShadow: isFeatured
                ? "0 6px 24px rgba(249,115,22,0.35)"
                : "0 6px 24px rgba(45,78,245,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            اشترك الآن
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
function FeasibilityDetail() {
  const { id } = useParams();
  const { data: project, isPending, isError } = useFeasibilityDetails(id as string);
  const { createCheckoutSession, loading } = useStripeCheckout();
  const [error, setError] = useState<string | null>(null);



  if (isPending) return <LoadingSkeleton />;

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">
            عذراً، حدث خطأ في تحميل تفاصيل دراسة الجدوي
          </h1>
          <p className="mt-2 text-gray-600">يرجى المحاولة مرة أخرى في وقت لاحق</p>
        </div>
      </div>
    );
  }

  const descriptionLines = (project.description || "")
    .split("\r\n")
    .filter((l: string) => l.trim());



  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* ─── Hero Banner ───────────────────────────── */}
      <motion.div
        className="relative w-full h-[480px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={100}
          unoptimized={project.image.startsWith("http")}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

        {/* Centered text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight drop-shadow-2xl max-w-3xl">
              {project.name}
            </h1>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Main Content ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ─── Study Details ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <FaInfoCircle className="text-primary-600" />
                تفاصيل دراسة الجدوى
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-right" dir="rtl">
                {descriptionLines.map((line: string, index: number) => (
                  <p key={index}>
                    {line.startsWith("-") ? (
                      <span className="flex items-start gap-2 flex-row-reverse justify-end">
                        <span>{line.substring(1).trim()}</span>
                        <span className="text-primary-600 mt-1 shrink-0">•</span>
                      </span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* ─── Study Components ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            مكونات دراسة الجدوى
          </h2>
          <p className="text-gray-500 mb-8">
            تشمل الدراسة المحاور الرئيسية التالية لتقييم شامل ودقيق للمشروع
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDY_COMPONENTS.map((comp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{comp.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{comp.titleAr}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{comp.descAr}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── Pricing Packages ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            اختر الباقة المناسبة
          </h2>
          <p className="text-gray-500 mb-14">
            نقدّم لك ثلاث باقات مرنة لتلبية احتياجات مشروعك بأفضل الأسعار
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pb-6">
            {PACKAGES.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                index={index}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-6">{error}</p>
          )}
        </motion.div>

      </div>
    </div>
  );
}

export default FeasibilityDetail;