"use client";

import { motion } from "framer-motion";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  const plans = [
    {
      name: "الباقة الشهرية",
      price: "100",
      duration: "شهر واحد",
      features: ["دراسة جدوى واحدة"],
      plan: "باقة الشهر الواحد",
      featured: false,
      accentColor: "#7c3aed",
    },
    {
      name: "باقة 3 شهور",
      price: "250",
      duration: "ثلاثة أشهر",
      features: ["6 دراسات جدوى", "6 ملفات Excel"],
      plan: "باقة ثلاث شهور",
      featured: true,
      accentColor: "#f97316",
    },
    {
      name: "الباقة السنوية",
      price: "800",
      duration: "سنة كاملة",
      features: ["كل دراسات الجدوى", "كل الملفات", "أولوية الدعم"],
      plan: "الباقة السنوية",
      featured: false,
      accentColor: "#2d4ef5",
    },
  ];

  return (
    <section
    id="pricing"
      dir="rtl"
      style={{
        background: "#f8f9ff",
        padding: "80px 24px 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot pattern background like your site */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, #d1d5f0 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        opacity: 0.4,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <h2 style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 900,
            color: "#0f1b6e",
            marginBottom: "12px",
          }}>
            اختر الباقة المناسبة لك
          </h2>
          <p style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "1rem",
            color: "#6b7280",
            maxWidth: "420px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}>
            باقات مرنة تناسب احتياجاتك سواء كنت مبتدئاً أو محترفاً
          </p>
        </motion.div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "28px",
          maxWidth: "1050px",
          margin: "0 auto",
          alignItems: "center",
        }}>
          {plans.map((plan, index) => (
            <PricingCard key={plan.plan} plan={plan} index={index} />
          ))}
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');`}</style>
    </section>
  );
}