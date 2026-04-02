"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Idea {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string | { url?: string; secure_url?: string; path?: string } | any;
}

// Safely extract a string URL regardless of how the backend returns imageUrl
const resolveImageUrl = (imageUrl: Idea["imageUrl"]): string | null => {
  if (!imageUrl) return null;
  if (typeof imageUrl === "string" && imageUrl.trim() !== "") return imageUrl;
  if (typeof imageUrl === "object") {
    const url =
      imageUrl.secure_url ||
      imageUrl.url ||
      imageUrl.path ||
      Object.values(imageUrl).find((v: any) => typeof v === "string" && v.startsWith("http"));
    return url ? String(url) : null;
  }
  return null;
};

interface SuccessStory {
  id: string;
  name: string;
  company: string;
  revenue: string;
  quote: string;
  avatar?: string;
  color?: string;
}

interface GrowthService {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const ACCENT_COLORS = ["#7C3AED", "#F97316", "#2c4fd4", "#0EA5E9", "#10B981"];

export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [growthServices, setGrowthServices] = useState<GrowthService[]>([]);
  const [activeStory, setActiveStory] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const router = useRouter();
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // ── Fetch ideas
  useEffect(() => {
    fetch("http://localhost:8080/api/ideas?page=1&limit=3")
      .then((res) => res.json())
      .then((data) => setIdeas(data.ideas ?? []))
      .catch(() => setIdeas([]));
  }, []);

  // ── Fetch success stories
  useEffect(() => {
    fetch("http://localhost:8080/api/success-stories?limit=5")
      .then((res) => res.json())
      .then((data) => setStories(data.stories ?? data ?? []))
      .catch(() => setStories([]));
  }, []);

  // ── Fetch growth services
  useEffect(() => {
    fetch("http://localhost:8080/api/growth-services")
      .then((res) => res.json())
      .then((data) => setGrowthServices(data.services ?? data ?? []))
      .catch(() => setGrowthServices([]));
  }, []);

  // ── Auto-rotate stories
  useEffect(() => {
    if (stories.length < 2) return;
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [stories.length]);

  // ── Intersection observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) =>
              new Set(Array.from(prev).concat(entry.target.id))
            );
          }
        });
      },
      { threshold: 0.12 }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const isVisible = (id: string) => visibleSections.has(id);

  const storyColor = (i: number) =>
    stories[i]?.color ?? ACCENT_COLORS[i % ACCENT_COLORS.length];

  const storyAvatar = (s: SuccessStory) =>
    s.avatar ?? (s.name ? s.name.charAt(0) : "؟");

  const active = stories[activeStory];

  // Card color configs
  const cardColors = [
    { top: "#7C3AED", accent: "#a78bfa" },
    { top: "#F97316", accent: "#fdba74" },
    { top: "#2c4fd4", accent: "#93c5fd" },
  ];

  return (
    <div
      dir="rtl"
      className="font-[Cairo,Tajawal,sans-serif] bg-[#f0f4ff] min-h-screen overflow-x-hidden"
    >
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&display=swap');

        .fade-up {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .d1 { transition-delay: 0.08s; }
        .d2 { transition-delay: 0.18s; }
        .d3 { transition-delay: 0.28s; }
        .d4 { transition-delay: 0.38s; }

        .idea-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .idea-card:hover {
          transform: translateY(-9px);
          box-shadow: 0 18px 48px rgba(30,60,180,0.17);
        }

        .growth-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .growth-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 36px rgba(30,60,180,0.14);
          border-color: #2c4fd4;
        }

        .story-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          cursor: pointer;
          transition: all 0.35s;
        }
        .story-dot.active {
          background: #fff;
          width: 30px;
          border-radius: 5px;
        }

        .cta-btn {
          background: linear-gradient(135deg, #2c4fd4, #1a3aa8);
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 14px 36px;
          font-size: 16px;
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
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden pb-[90px]"
        style={{ background: "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 55%, #1e3fbc 100%)" }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: -80, left: -80, width: 300, height: 300,
            background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            bottom: 0, right: "8%", width: 380, height: 380,
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: "35%", left: "42%", width: 200, height: 200,
            background: "radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 pt-[88px] text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-[6px] rounded-full px-[18px] py-[7px] text-[13px] font-bold mb-5"
            style={{
              background: "rgba(249,115,22,0.14)",
              border: "1px solid rgba(249,115,22,0.38)",
              color: "#fbbf24",
            }}
          >
            <span>✦</span> منصة بِزنس برو للأعمال <span>✦</span>
          </div>

          <h1
            className="font-black text-white leading-[1.2] mb-5"
            style={{
              fontSize: "clamp(36px, 5.5vw, 70px)",
              textShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }}
          >
            حوّل فكرتك إلى
            <span
              className="block"
              style={{
                background: "linear-gradient(90deg, #fbbf24, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              مشروع ناجح
            </span>
          </h1>

          <p
            className="mx-auto mb-[38px] leading-[1.85]"
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: 17,
              maxWidth: 540,
            }}
          >
            أفكار مدروسة، وقصص نجاح حقيقية، وخدمات متكاملة لتطوير أعمالك في السوق السعودي
          </p>

          <button className="cta-btn" onClick={() => router.push("/idea-club")}>
            استكشف أفكار المشاريع ←
          </button>
        </div>
      </div>

      {/* Wave */}
      <div className="w-full overflow-hidden leading-[0] -mt-[2px]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-20">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f4ff" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 1 — أفكار المشاريع
      ══════════════════════════════════════════ */}
      <section
        id="ideas-section"
        ref={setRef("ideas-section") as any}
        className="py-[72px] px-6 max-w-[1200px] mx-auto"
      >
        <div
          className={`fade-up ${isVisible("ideas-section") ? "visible" : ""} text-center mb-[52px]`}
        >
          <div
            className="inline-flex items-center gap-[6px] rounded-full px-[18px] py-[7px] text-[13px] font-bold mb-[14px]"
            style={{ background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", color: "#2c4fd4" }}
          >
            <span>💡</span> أفكار مميزة ومدروسة
          </div>
          <h2
            className="font-black text-[#1a2060] mb-[10px]"
            style={{ fontSize: "clamp(26px,4vw,44px)" }}
          >
            أفكار المشاريع
          </h2>
          <p className="text-slate-500 text-base max-w-[480px] mx-auto">
            اكتشف أفضل الفرص الاستثمارية في السوق السعودي قبل أن تصبح مزدحمة
          </p>
        </div>

        <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {ideas.length === 0
            ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-[22px] overflow-hidden bg-white"
                  style={{ boxShadow: "0 4px 20px rgba(30,60,180,0.07)" }}
                >
                  <div className="skeleton h-[180px] rounded-none" />
                  <div className="px-6 pt-5 pb-7">
                    <div className="skeleton h-[14px] w-[40%] mb-3" />
                    <div className="skeleton h-5 w-[75%] mb-[10px]" />
                    <div className="skeleton h-[14px] w-[90%] mb-[6px]" />
                    <div className="skeleton h-[14px] w-[60%]" />
                  </div>
                </div>
              ))
            : ideas.map((idea, i) => {
                const c = cardColors[i % 3];
                return (
                  <div
                    key={idea.id}
                    className={`idea-card fade-up d${i + 1} ${isVisible("ideas-section") ? "visible" : ""} bg-white rounded-[22px] overflow-hidden`}
                    style={{ boxShadow: "0 4px 24px rgba(30,60,180,0.07)" }}
                    onClick={() => router.push(`/idea-club/${idea.id}`)}
                  >
                    {/* Top color bar */}
                    <div
                      className="h-[7px]"
                      style={{ background: `linear-gradient(90deg, ${c.top}, ${c.accent})` }}
                    />

                    {(() => {
                      const imgSrc = resolveImageUrl(idea.imageUrl);
                      return imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={idea.name}
                          className="w-full h-[180px] object-cover block"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-[180px] flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${c.top}18, ${c.accent}35)`,
                          }}
                        >
                          <div
                            className="w-[62px] h-[62px] rounded-2xl flex items-center justify-center text-[26px]"
                            style={{
                              background: `linear-gradient(135deg, ${c.top}, ${c.accent})`,
                            }}
                          >
                            💼
                          </div>
                        </div>
                      );
                    })()}

                    <div className="px-[22px] pt-[18px] pb-6">
                      <span
                        className="inline-block px-[13px] py-1 rounded-full text-xs font-bold mb-[10px]"
                        style={{
                          background: "linear-gradient(135deg, #eef2ff, #dde4ff)",
                          color: "#2c4fd4",
                        }}
                      >
                        {idea.category}
                      </span>
                      <h3 className="text-[18px] font-extrabold text-[#1a2060] mb-2 leading-[1.4]">
                        {idea.name}
                      </h3>
                      <p className="text-slate-500 text-sm leading-[1.75] mb-[18px]">
                        {idea.description}
                      </p>
                      <div
                        className="flex items-center gap-1 font-bold text-sm"
                        style={{ color: c.top }}
                      >
                        عرض التفاصيل <span>←</span>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        <div className="text-center mt-11">
          <button className="cta-btn" onClick={() => router.push("/idea-club")}>
            عرض جميع الأفكار
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — قصص النجاح
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-[100px] px-6"
        style={{
          background: "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 60%, #1a3aa8 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: -100, right: -100, width: 400, height: 400,
            background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            bottom: -80, left: "18%", width: 340, height: 340,
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div
          id="stories-section"
          ref={setRef("stories-section") as any}
          className="relative z-[2] max-w-[860px] mx-auto"
        >
          <div
            className={`fade-up ${isVisible("stories-section") ? "visible" : ""} text-center mb-[52px]`}
          >
            <div
              className="inline-flex items-center gap-[6px] rounded-full px-[18px] py-[7px] text-[13px] font-bold mb-[14px]"
              style={{
                background: "rgba(249,115,22,0.18)",
                border: "1px solid rgba(249,115,22,0.38)",
                color: "#fbbf24",
              }}
            >
              <span>🏆</span> من أرض الواقع
            </div>
            <h2
              className="font-black text-white mb-[10px]"
              style={{ fontSize: "clamp(26px,4vw,44px)" }}
            >
              قصص النجاح
            </h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.62)" }}>
              رواد أعمال حولوا أفكارهم إلى مشاريع مربحة
            </p>
          </div>

          {/* Story card */}
          {stories.length === 0 ? (
            <div
              className="rounded-[28px] px-10 py-12 text-center"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <div className="skeleton w-20 h-20 rounded-full mx-auto mb-5" />
              <div className="skeleton h-[14px] w-[30%] mx-auto mb-4" />
              <div className="skeleton h-5 w-[80%] mx-auto mb-[10px]" />
              <div className="skeleton h-5 w-[65%] mx-auto" />
            </div>
          ) : (
            <div
              className={`fade-up ${isVisible("stories-section") ? "visible" : ""} text-center transition-all duration-500`}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 28,
                padding: "clamp(32px, 5vw, 52px) clamp(24px, 5vw, 44px)",
              }}
            >
              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-[18px] flex items-center justify-center"
                style={{
                  border: "3px solid rgba(255,255,255,0.28)",
                  background: `linear-gradient(135deg, ${storyColor(activeStory)}, ${storyColor(activeStory)}99)`,
                }}
              >
                {active.avatar ? (
                  <img
                    src={active.avatar}
                    alt={active.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-[30px] font-black text-white">
                    {storyAvatar(active)}
                  </span>
                )}
              </div>

              {stories[activeStory].revenue && (
                <div
                  className="inline-block rounded-full px-4 py-1 text-[13px] font-bold mb-4"
                  style={{
                    background: "rgba(249,115,22,0.2)",
                    border: "1px solid rgba(249,115,22,0.32)",
                    color: "#fbbf24",
                  }}
                >
                  عوائد: {stories[activeStory].revenue}
                </div>
              )}

              <blockquote
                className="font-semibold text-white leading-[1.75] max-w-[600px] mx-auto mb-[22px]"
                style={{ fontSize: "clamp(15px, 2.5vw, 21px)" }}
              >
                "{stories[activeStory].quote}"
              </blockquote>

              <div className="text-white font-extrabold text-[17px]">
                {stories[activeStory].name}
              </div>
              <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.58)" }}>
                {stories[activeStory].company}
              </div>
            </div>
          )}

          {/* Dots */}
          {stories.length > 1 && (
            <div className="flex justify-center gap-2 mt-[26px]">
              {stories.map((_, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  className={`story-dot ${i === activeStory ? "active" : ""}`}
                  onClick={() => setActiveStory(i)}
                  onKeyDown={(e) => e.key === "Enter" && setActiveStory(i)}
                />
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-[18px] mt-[52px]">
            {[
              { num: "+٥٠٠", label: "رائد أعمال نجح" },
              { num: "+٢٠٠", label: "فكرة مشروع" },
              { num: "٩٥٪", label: "نسبة الرضا" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`fade-up d${i + 1} ${isVisible("stories-section") ? "visible" : ""} text-center rounded-2xl py-[22px] px-[14px]`}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.11)",
                }}
              >
                <div
                  className="font-black text-[#fbbf24] mb-1"
                  style={{ fontSize: "clamp(22px, 4vw, 34px)" }}
                >
                  {stat.num}
                </div>
                <div className="text-[13px]" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-20">
          <path d="M0,20 C360,80 1080,0 1440,50 L1440,0 L0,0 Z" fill="#f0f4ff" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 3 — تطوير ونمو الأعمال
      ══════════════════════════════════════════ */}
      <section
        id="growth-section"
        ref={setRef("growth-section") as any}
        className="py-[72px] pb-[100px] px-6 max-w-[1200px] mx-auto"
      >
        <div
          className={`fade-up ${isVisible("growth-section") ? "visible" : ""} text-center mb-[52px]`}
        >
          <div
            className="inline-flex items-center gap-[6px] rounded-full px-[18px] py-[7px] text-[13px] font-bold mb-[14px]"
            style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", color: "#ea580c" }}
          >
            <span>🚀</span> خدمات متكاملة
          </div>
          <h2
            className="font-black text-[#1a2060] mb-[10px]"
            style={{ fontSize: "clamp(26px,4vw,44px)" }}
          >
            تطوير ونمو الأعمال
          </h2>
          <p className="text-slate-500 text-base max-w-[500px] mx-auto">
            نرافقك في كل خطوة من رحلتك الريادية بأدوات واستراتيجيات مثبتة
          </p>
        </div>

        <div
          className="grid gap-[22px] mb-14"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
        >
          {growthServices.length === 0
            ? [0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="growth-card bg-white rounded-[18px] p-7 border border-[#e8eeff]"
                  style={{ boxShadow: "0 2px 16px rgba(30,60,180,0.06)" }}
                >
                  <div className="skeleton w-[52px] h-[52px] rounded-[14px] mb-4" />
                  <div className="skeleton h-[18px] w-[60%] mb-[10px]" />
                  <div className="skeleton h-[13px] w-[90%] mb-[6px]" />
                  <div className="skeleton h-[13px] w-[70%]" />
                </div>
              ))
            : growthServices.map((svc, i) => (
                <div
                  key={svc.id ?? i}
                  className={`growth-card fade-up d${(i % 4) + 1} ${isVisible("growth-section") ? "visible" : ""} bg-white rounded-[18px] p-7 border border-[#e8eeff]`}
                  style={{ boxShadow: "0 2px 16px rgba(30,60,180,0.06)" }}
                >
                  <div
                    className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl mb-4"
                    style={{ background: "linear-gradient(135deg,#eef2ff,#dde4ff)" }}
                  >
                    {svc.icon ?? "🔧"}
                  </div>
                  <h3 className="text-base font-extrabold text-[#1a2060] mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-[1.72]">
                    {svc.description}
                  </p>
                </div>
              ))}
        </div>

        {/* CTA Banner */}
        <div
          className={`fade-up ${isVisible("growth-section") ? "visible" : ""} relative overflow-hidden rounded-[28px] flex items-center justify-between flex-wrap gap-6`}
          style={{
            background: "linear-gradient(135deg, #1a2f9e 0%, #2c4fd4 55%, #f97316 160%)",
            padding: "clamp(36px,5vw,56px) clamp(24px,5vw,44px)",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              top: -60, left: -60, width: 240, height: 240,
              background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              bottom: -40, right: "28%", width: 200, height: 200,
              background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-[1]">
            <h3
              className="font-black text-white mb-2"
              style={{ fontSize: "clamp(18px,3vw,28px)" }}
            >
              هل أنت مستعد لبدء مشروعك؟
            </h3>
            <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.72)" }}>
              تواصل معنا اليوم واحصل على استشارة مجانية من خبرائنا
            </p>
          </div>

          <button
            className="cta-btn relative z-[1]"
            style={{
              background: "#fff",
              color: "#2c4fd4",
              boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
            }}
            onClick={() => router.push("/contact")}
          >
            تواصل معنا
          </button>
        </div>
      </section>
    </div>
  );
}