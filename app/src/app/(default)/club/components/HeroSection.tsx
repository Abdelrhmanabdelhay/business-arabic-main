"use client";

import SignUpPage from "@/app/(auth)/signup/page";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PricingSection from "./PricingSection";

export default function HeroSection() {
  const router = useRouter();
const [showSignup, setShowSignup] = useState(false);
  return (
    <section
      dir="rtl"
      style={{
        background: "linear-gradient(135deg, #1a2ecc 0%, #2d4ef5 40%, #6366f1 75%, #7c3aed 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 80px",
        textAlign: "center",
      }}
    >
      {/* Subtle circle decorations like your homepage */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "rgba(255,255,255,0.04)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-100px", left: "-100px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "rgba(255,255,255,0.04)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "20%", left: "10%",
        width: "250px", height: "250px", borderRadius: "50%",
        background: "rgba(255,255,255,0.03)", pointerEvents: "none",
      }} />

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
          fontWeight: 900,
          color: "#ffffff",
          marginBottom: "20px",
          lineHeight: 1.2,
        }}
      >
        نادي أفكار المشاريع
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: "1.15rem",
          color: "rgba(255,255,255,0.85)",
          maxWidth: "580px",
          margin: "0 auto 40px",
          lineHeight: 2,
          fontWeight: 400,
        }}
      >
        اكتشف فرص جديدة، طور مهاراتك، وحقق النجاح في عالم الأعمال العربي
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <a href="#pricing">        <button
          style={{
            background: "linear-gradient(135deg, #0f1b6e, #1a2ecc)",
            color: "#fff",
            fontFamily: "'Cairo', sans-serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            padding: "16px 48px",
            borderRadius: "40px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(15,27,110,0.45)",
            transition: "transform 0.2s, box-shadow 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 40px rgba(15,27,110,0.6)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(15,27,110,0.45)";
          }}
        >
          اشترك الآن
        </button></a>

      </motion.div>

      {/* Stats cards — matching your homepage feature cards style */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          maxWidth: "900px",
          margin: "64px auto 0",
        }}
      >
        {[
          { icon: "📊", color: "#7c3aed", title: "دراسات جدوى احترافية", desc: "أكثر من 500 دراسة جدوى جاهزة ومتكاملة" },
          { icon: "📈", color: "#f97316", title: "ملفات Excel متخصصة", desc: "نماذج مالية وجداول تحليلية احترافية" },
          { icon: "🏆", color: "#2d4ef5", title: "أفضل أفكار المشاريع", desc: "أفكار مختارة بعناية للسوق العربي" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "0",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              textAlign: "right",
            }}
          >
            {/* Colored top bar like your homepage cards */}
            <div style={{
              background: item.color,
              padding: "20px 24px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem", flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "0.95rem", fontWeight: 800,
                color: "#fff", margin: 0,
              }}>
                {item.title}
              </h3>
            </div>
            <div style={{ padding: "16px 24px 20px" }}>
              <p style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "0.85rem", color: "#6b7280",
                lineHeight: 1.8, margin: 0,
              }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
{showSignup && <PricingSection />}
      <style>
        {`"@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');"
;`}</style>
    </section>
  );
}