"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PricingCard({
  plan,
  index,
}: {
  plan: any;
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
        border: isFeatured ? "2px solid #f97316" : "2px solid transparent",
        transition: "box-shadow 0.3s",
      }}>
        {/* Colored header bar — exactly like your homepage cards */}
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
          {/* Price inside colored header */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
            <span style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "3.2rem", fontWeight: 900,
              color: "#fff", lineHeight: 1,
            }}>
              {plan.price}
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
          {/* Features list */}
          <ul style={{ listStyle: "none", margin: "0 0 28px", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {plan.features.map((f: string, i: number) => (
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

          {/* CTA Button */}
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