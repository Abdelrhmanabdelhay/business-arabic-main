"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface GrowthService {
  id: string;
  icon: string;
  title: string;
  description: string;
  features?: string[];
  category?: string;
  badge?: string;
}

export default function GrowthServicesPage() {
  const [services, setServices] = useState<GrowthService[]>([]);
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
  useEffect(() => {
    fetch(`${API_BASE}/growth-services`)
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? d ?? []))
      .catch(() => setServices([]));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            setVisibleSections((p) => new Set([...p, e.target.id]));
        }),
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, [services]);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };
  const isVisible = (id: string) => visibleSections.has(id);

const filters = [
  "الكل",
  ...Array.from(
    new Set(
      services
        .map((s) => s.category)
        .filter((s): s is string => Boolean(s))
    )
  ),
];  const filtered =
    activeFilter === "الكل" ? services : services.filter((s) => s.category === activeFilter);

  // Card accent configs cycling
  const cardAccents = [
    { grad: "linear-gradient(135deg, #2c4fd4, #1a3aa8)", light: "#eef2ff", text: "#2c4fd4" },
    { grad: "linear-gradient(135deg, #f97316, #ea580c)",  light: "#fff7ed", text: "#ea580c" },
    { grad: "linear-gradient(135deg, #7C3AED, #6d28d9)",  light: "#f5f3ff", text: "#7C3AED" },
    { grad: "linear-gradient(135deg, #0EA5E9, #0284c7)",  light: "#e0f2fe", text: "#0284c7" },
    { grad: "linear-gradient(135deg, #10B981, #059669)",  light: "#ecfdf5", text: "#059669" },
  ];

  // Process steps (static)
  const steps = [
    { icon: "🔍", title: "تحليل وضعك", desc: "ندرس وضعك الحالي ونحدد الفجوات والفرص المتاحة أمامك" },
    { icon: "🎯", title: "نضع الخطة", desc: "نبني استراتيجية مخصصة تناسب نوع عملك وميزانيتك" },
    { icon: "🚀", title: "التنفيذ والنمو", desc: "نرافقك في التنفيذ وقياس النتائج حتى تحقق أهدافك" },
  ];

  return (
    <div dir="rtl" className="font-[Cairo,Tajawal,sans-serif] bg-[#f0f4ff] min-h-screen overflow-x-hidden">
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&display=swap');

        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1);
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.06s; }
        .d2 { transition-delay: 0.14s; }
        .d3 { transition-delay: 0.22s; }
        .d4 { transition-delay: 0.30s; }
        .d5 { transition-delay: 0.38s; }
        .d6 { transition-delay: 0.46s; }

        .service-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
        }
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(30,60,180,0.16);
        }

        .step-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 36px rgba(30,60,180,0.13);
        }

        .filter-btn {
          transition: all 0.25s ease;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
        }
        .filter-btn.active {
          background: linear-gradient(135deg, #2c4fd4, #1a3aa8);
          color: #fff;
          box-shadow: 0 4px 14px rgba(44,79,212,0.35);
        }

        .cta-btn {
          background: linear-gradient(135deg, #2c4fd4, #1a3aa8);
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 13px 34px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Cairo', sans-serif;
          box-shadow: 0 4px 16px rgba(44,79,212,0.3);
        }
        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(44,79,212,0.45);
        }

        .skeleton {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 10px;
        }
        @keyframes shimmer {
          0%  { background-position:  200% center; }
          100%{ background-position: -200% center; }
        }

        .badge-pop {
          animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes popIn {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pb-[80px]"
        style={{ background: "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 55%, #1e3fbc 100%)" }}
      >
        <div className="absolute pointer-events-none rounded-full" style={{ top: -80, left: -80, width: 300, height: 300, background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none rounded-full" style={{ bottom: 0, right: "8%", width: 380, height: 380, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 pt-[80px] text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            <span className="text-white font-semibold">تطوير الأعمال</span>
          </div>

          <div className="inline-flex items-center gap-[6px] rounded-full px-[18px] py-[7px] text-[13px] font-bold mb-5" style={{ background: "rgba(249,115,22,0.16)", border: "1px solid rgba(249,115,22,0.36)", color: "#fbbf24" }}>
            <span>🚀</span> خدمات متكاملة لنموك
          </div>

          <h1 className="font-black text-white leading-[1.2] mb-4" style={{ fontSize: "clamp(34px, 5vw, 64px)", textShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
            تطوير ونمو
            <span className="block" style={{ background: "linear-gradient(90deg, #fbbf24, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              الأعمال
            </span>
          </h1>

          <p className="mx-auto mb-8 leading-[1.85]" style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, maxWidth: 500 }}>
            نرافقك في كل خطوة من رحلتك الريادية بأدوات واستراتيجيات مثبتة النتائج
          </p>

          <button className="cta-btn" onClick={() => router.push("/contact")}>
            احصل على استشارة مجانية ←
          </button>
        </div>
      </div>

      {/* Wave */}
      <div className="w-full overflow-hidden leading-[0] -mt-[2px]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-20">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f4ff" />
        </svg>
      </div>

      {/* ── HOW WE WORK ── */}
      <section
        id="steps-section"
        ref={setRef("steps-section") as any}
        className="max-w-[1200px] mx-auto px-6 py-[60px]"
      >
        <div className={`fade-up ${isVisible("steps-section") ? "visible" : ""} text-center mb-[44px]`}>
          <div className="inline-flex items-center gap-[6px] rounded-full px-[18px] py-[7px] text-[13px] font-bold mb-[14px]" style={{ background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", color: "#2c4fd4" }}>
            <span>⚙️</span> كيف نعمل معك
          </div>
          <h2 className="font-black text-[#1a2060]" style={{ fontSize: "clamp(24px,4vw,40px)" }}>
            منهجيتنا في العمل
          </h2>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`step-card fade-up d${i + 1} ${isVisible("steps-section") ? "visible" : ""} bg-white rounded-[20px] p-7 text-center border border-[#e8eeff]`}
              style={{ boxShadow: "0 2px 16px rgba(30,60,180,0.06)" }}
            >
              {/* Number */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white mx-auto mb-4" style={{ background: "linear-gradient(135deg, #2c4fd4, #1a3aa8)" }}>
                {i + 1}
              </div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="font-extrabold text-[#1a2060] text-[15px] mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-[1.75]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTERS ── */}
      {filters.length > 1 && (
        <div className="max-w-[1200px] mx-auto px-6 mb-8 flex flex-wrap justify-center gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`filter-btn px-5 py-2 rounded-full text-sm font-bold border ${activeFilter === f ? "active border-transparent" : "border-[#dde4ff] bg-white text-[#2c4fd4]"}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* ── SERVICES GRID ── */}
      <section
        id="services-grid"
        ref={setRef("services-grid") as any}
        className="max-w-[1200px] mx-auto px-6 pb-[80px]"
      >
        <div className={`fade-up ${isVisible("services-grid") ? "visible" : ""} text-center mb-[44px]`}>
          <div className="inline-flex items-center gap-[6px] rounded-full px-[18px] py-[7px] text-[13px] font-bold mb-[14px]" style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", color: "#ea580c" }}>
            <span>✦</span> خدماتنا
          </div>
          <h2 className="font-black text-[#1a2060]" style={{ fontSize: "clamp(24px,4vw,40px)" }}>
            كل ما تحتاجه لتنمو
          </h2>
          <p className="text-slate-500 text-base max-w-[460px] mx-auto mt-2">
            حلول شاملة مصممة خصيصاً لأصحاب المشاريع في السوق السعودي
          </p>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {(filtered.length === 0 ? [0, 1, 2, 3, 4, 5] : filtered).map((item, i) => {
            const isSkeleton = typeof item === "number";
            const accent = cardAccents[i % cardAccents.length];

            if (isSkeleton) {
              return (
                <div key={i} className="bg-white rounded-[20px] p-7 border border-[#e8eeff]" style={{ boxShadow: "0 2px 16px rgba(30,60,180,0.06)" }}>
                  <div className="skeleton w-14 h-14 rounded-[14px] mb-4" />
                  <div className="skeleton h-[17px] w-[60%] mb-3" />
                  <div className="skeleton h-[13px] w-[90%] mb-2" />
                  <div className="skeleton h-[13px] w-[70%]" />
                </div>
              );
            }

            const svc = item as GrowthService;

            return (
              <div
                key={svc.id ?? i}
                className={`service-card fade-up d${(i % 6) + 1} ${isVisible("services-grid") ? "visible" : ""} bg-white rounded-[20px] p-7 border border-[#e8eeff] relative`}
                style={{ boxShadow: "0 2px 16px rgba(30,60,180,0.06)" }}
              >
                {/* Badge */}
                {svc.badge && (
                  <div className="badge-pop absolute top-4 left-4 rounded-full px-3 py-[3px] text-[11px] font-black" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff" }}>
                    {svc.badge}
                  </div>
                )}

                {/* Icon */}
                <div
                  className="w-[54px] h-[54px] rounded-[14px] flex items-center justify-center text-[24px] mb-5"
                  style={{ background: accent.light }}
                >
                  {svc.icon ?? "🔧"}
                </div>

                <h3 className="text-[16px] font-extrabold text-[#1a2060] mb-2">{svc.title}</h3>
                <p className="text-slate-500 text-sm leading-[1.75] mb-4">{svc.description}</p>

                {/* Features list */}
                {svc.features && svc.features.length > 0 && (
                  <ul className="space-y-[6px] mb-4">
                    {svc.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0" style={{ background: accent.grad }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Bottom accent bar */}
                <div className="absolute bottom-0 right-0 left-0 h-[3px] rounded-b-[20px] opacity-0 transition-opacity duration-300" style={{ background: accent.grad }} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-[1200px] mx-auto px-6 pb-[100px]">
        <div
          className="relative overflow-hidden rounded-[28px] flex items-center justify-between flex-wrap gap-6"
          style={{
            background: "linear-gradient(135deg, #1a2f9e 0%, #2c4fd4 55%, #f97316 160%)",
            padding: "clamp(36px,5vw,52px) clamp(24px,5vw,44px)",
          }}
        >
          <div className="absolute pointer-events-none rounded-full" style={{ top: -60, left: -60, width: 240, height: 240, background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)" }} />
          <div className="absolute pointer-events-none rounded-full" style={{ bottom: -40, right: "28%", width: 200, height: 200, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }} />

          <div className="relative z-[1]">
            <h3 className="font-black text-white mb-1" style={{ fontSize: "clamp(18px,3vw,26px)" }}>
              هل أنت مستعد لبدء مشروعك؟
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.68)" }}>
              تواصل معنا اليوم واحصل على استشارة مجانية من خبرائنا
            </p>
          </div>

          <button
            className="cta-btn relative z-[1]"
            style={{ background: "#fff", color: "#2c4fd4", boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}
            onClick={() => router.push("/contact")}
          >
            تواصل معنا
          </button>
        </div>
      </section>
    </div>
  );
}