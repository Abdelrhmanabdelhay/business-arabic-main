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

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        background: "#f0f4ff",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .fade-up {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.08s; }
        .d2 { transition-delay: 0.18s; }
        .d3 { transition-delay: 0.28s; }
        .d4 { transition-delay: 0.38s; }

        .idea-card {
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(30,60,180,0.07);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .idea-card:hover {
          transform: translateY(-9px);
          box-shadow: 0 18px 48px rgba(30,60,180,0.17);
        }

        .growth-card {
          background: #fff;
          border-radius: 18px;
          padding: 28px 24px;
          box-shadow: 0 2px 16px rgba(30,60,180,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1.5px solid #e8eeff;
        }
        .growth-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 36px rgba(30,60,180,0.14);
          border-color: #2c4fd4;
        }

        .story-dot {
          width: 10px; height: 10px;
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

        .section-wave { width: 100%; overflow: hidden; line-height: 0; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 50px;
          padding: 7px 18px;
          font-size: 13px;
          font-weight: 700;
        }

        .category-chip {
          display: inline-block;
          padding: 4px 13px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          background: linear-gradient(135deg, #eef2ff, #dde4ff);
          color: #2c4fd4;
        }

        .img-placeholder {
          width: 100%; height: 180px;
          display: flex; align-items: center; justify-content: center;
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
        style={{
          background: "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 55%, #1e3fbc 100%)",
          padding: "0 0 90px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, right: "8%", width: 380, height: 380, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "35%", left: "42%", width: 200, height: 200, background: "radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "88px 24px 0", position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="badge" style={{ background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.38)", color: "#fbbf24", marginBottom: 20 }}>
            <span>✦</span> منصة بِزنس برو للأعمال <span>✦</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 70px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 20, textShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
            حوّل فكرتك إلى
            <span style={{ display: "block", background: "linear-gradient(90deg, #fbbf24, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              مشروع ناجح
            </span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 17, maxWidth: 540, margin: "0 auto 38px", lineHeight: 1.85 }}>
            أفكار مدروسة، وقصص نجاح حقيقية، وخدمات متكاملة لتطوير أعمالك في السوق السعودي
          </p>

          <button className="cta-btn" onClick={() => router.push("/idea-club")}>
            استكشف أفكار المشاريع ←
          </button>
        </div>
      </div>

      {/* Wave */}
      <div className="section-wave" style={{ marginTop: -2 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", height: 80 }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f4ff" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 1 — أفكار المشاريع
      ══════════════════════════════════════════ */}
      <section
        id="ideas-section"
        ref={setRef("ideas-section")}
        style={{ padding: "72px 24px", maxWidth: 1200, margin: "0 auto" }}
      >
        <div className={`fade-up ${isVisible("ideas-section") ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="badge" style={{ background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", color: "#2c4fd4", marginBottom: 14 }}>
            <span>💡</span> أفكار مميزة ومدروسة
          </div>
          <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, color: "#1a2060", marginBottom: 10 }}>
            أفكار المشاريع
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
            اكتشف أفضل الفرص الاستثمارية في السوق السعودي قبل أن تصبح مزدحمة
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
          {ideas.length === 0
            ? [0, 1, 2].map((i) => (
                <div key={i} style={{ borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 4px 20px rgba(30,60,180,0.07)" }}>
                  <div className="skeleton" style={{ height: 180, borderRadius: 0 }} />
                  <div style={{ padding: "20px 24px 28px" }}>
                    <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 20, width: "75%", marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 14, width: "60%" }} />
                  </div>
                </div>
              ))
            : ideas.map((idea, i) => {
                const colors = [
                  { top: "#7C3AED", accent: "#a78bfa" },
                  { top: "#F97316", accent: "#fdba74" },
                  { top: "#2c4fd4", accent: "#93c5fd" },
                ];
                const c = colors[i % 3];
                return (
                  <div
                    key={idea.id}
                    className={`idea-card fade-up d${i + 1} ${isVisible("ideas-section") ? "visible" : ""}`}
                    onClick={() => router.push(`/idea-club/${idea.id}`)}
                  >
                    <div style={{ height: 7, background: `linear-gradient(90deg, ${c.top}, ${c.accent})` }} />

                    {(() => {
                      const imgSrc = resolveImageUrl(idea.imageUrl);
                      return imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={idea.name}
                          style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="img-placeholder" style={{ background: `linear-gradient(135deg, ${c.top}18, ${c.accent}35)` }}>
                          <div style={{ width: 62, height: 62, borderRadius: 16, background: `linear-gradient(135deg, ${c.top}, ${c.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                            💼
                          </div>
                        </div>
                      );
                    })()}

                    <div style={{ padding: "18px 22px 24px" }}>
                      <span className="category-chip" style={{ marginBottom: 10, display: "inline-block" }}>
                        {idea.category}
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1a2060", marginBottom: 8, lineHeight: 1.4 }}>
                        {idea.name}
                      </h3>
                      <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.75, marginBottom: 18 }}>
                        {idea.description}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", color: c.top, fontWeight: 700, fontSize: 14, gap: 4 }}>
                        عرض التفاصيل <span>←</span>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        <div style={{ textAlign: "center", marginTop: 44 }}>
          <button className="cta-btn" onClick={() => router.push("/idea-club")}>
            عرض جميع الأفكار
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — قصص النجاح
      ══════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 60%, #1a3aa8 100%)",
          padding: "100px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: "18%", width: 340, height: 340, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div
          id="stories-section"
          ref={setRef("stories-section")}
          style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}
        >
          <div className={`fade-up ${isVisible("stories-section") ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="badge" style={{ background: "rgba(249,115,22,0.18)", border: "1px solid rgba(249,115,22,0.38)", color: "#fbbf24", marginBottom: 14 }}>
              <span>🏆</span> من أرض الواقع
            </div>
            <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, color: "#fff", marginBottom: 10 }}>
              قصص النجاح
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 16 }}>
              رواد أعمال حولوا أفكارهم إلى مشاريع مربحة
            </p>
          </div>

          {/* Story card */}
          {stories.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 28, padding: "48px 40px", textAlign: "center" }}>
              <div className="skeleton" style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px" }} />
              <div className="skeleton" style={{ height: 14, width: "30%", margin: "0 auto 16px" }} />
              <div className="skeleton" style={{ height: 20, width: "80%", margin: "0 auto 10px" }} />
              <div className="skeleton" style={{ height: 20, width: "65%", margin: "0 auto" }} />
            </div>
          ) : (
            <div
              className={`fade-up ${isVisible("stories-section") ? "visible" : ""}`}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 28,
                padding: "clamp(32px, 5vw, 52px) clamp(24px, 5vw, 44px)",
                textAlign: "center",
                transition: "all 0.5s ease",
              }}
            >
              <div
                style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${storyColor(activeStory)}, ${storyColor(activeStory)}99)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, fontWeight: 900, color: "#fff",
                  margin: "0 auto 18px",
                  border: "3px solid rgba(255,255,255,0.28)",
                  transition: "all 0.45s",
                }}
              >
                {storyAvatar(stories[activeStory])}
              </div>

              {stories[activeStory].revenue && (
                <div style={{ display: "inline-block", background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.32)", borderRadius: 50, padding: "4px 16px", color: "#fbbf24", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                  عوائد: {stories[activeStory].revenue}
                </div>
              )}

              <blockquote style={{ fontSize: "clamp(15px, 2.5vw, 21px)", fontWeight: 600, color: "#fff", lineHeight: 1.75, maxWidth: 600, margin: "0 auto 22px" }}>
                "{stories[activeStory].quote}"
              </blockquote>

              <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>
                {stories[activeStory].name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.58)", fontSize: 14, marginTop: 4 }}>
                {stories[activeStory].company}
              </div>
            </div>
          )}

          {stories.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 26 }}>
              {stories.map((_, i) => (
                <div key={i} role="button" tabIndex={0} className={`story-dot ${i === activeStory ? "active" : ""}`} onClick={() => setActiveStory(i)} onKeyDown={(e) => e.key === "Enter" && setActiveStory(i)} />
              ))}
            </div>
          )}

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 52 }}>
            {[
              { num: "+٥٠٠", label: "رائد أعمال نجح" },
              { num: "+٢٠٠", label: "فكرة مشروع" },
              { num: "٩٥٪", label: "نسبة الرضا" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`fade-up d${i + 1} ${isVisible("stories-section") ? "visible" : ""}`}
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)", borderRadius: 16, padding: "22px 14px", textAlign: "center" }}
              >
                <div style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, color: "#fbbf24", marginBottom: 4 }}>
                  {stat.num}
                </div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <div className="section-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", height: 80 }}>
          <path d="M0,20 C360,80 1080,0 1440,50 L1440,0 L0,0 Z" fill="#f0f4ff" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 3 — تطوير ونمو الأعمال
      ══════════════════════════════════════════ */}
      <section
        id="growth-section"
        ref={setRef("growth-section")}
        style={{ padding: "72px 24px 100px", maxWidth: 1200, margin: "0 auto" }}
      >
        <div className={`fade-up ${isVisible("growth-section") ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="badge" style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", color: "#ea580c", marginBottom: 14 }}>
            <span>🚀</span> خدمات متكاملة
          </div>
          <h2 style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, color: "#1a2060", marginBottom: 10 }}>
            تطوير ونمو الأعمال
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            نرافقك في كل خطوة من رحلتك الريادية بأدوات واستراتيجيات مثبتة
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 22, marginBottom: 56 }}>
          {growthServices.length === 0
            ? [0, 1, 2, 3].map((i) => (
                <div key={i} className="growth-card">
                  <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 14, marginBottom: 16 }} />
                  <div className="skeleton" style={{ height: 18, width: "60%", marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 13, width: "90%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 13, width: "70%" }} />
                </div>
              ))
            : growthServices.map((svc, i) => (
                <div key={svc.id ?? i} className={`growth-card fade-up d${(i % 4) + 1} ${isVisible("growth-section") ? "visible" : ""}`}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#eef2ff,#dde4ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>
                    {svc.icon ?? "🔧"}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1a2060", marginBottom: 8 }}>
                    {svc.title}
                  </h3>
                  <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.72 }}>
                    {svc.description}
                  </p>
                </div>
              ))}
        </div>

        {/* CTA Banner */}
        <div
          className={`fade-up ${isVisible("growth-section") ? "visible" : ""}`}
          style={{ background: "linear-gradient(135deg, #1a2f9e 0%, #2c4fd4 55%, #f97316 160%)", borderRadius: 28, padding: "clamp(36px,5vw,56px) clamp(24px,5vw,44px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", top: -60, left: -60, width: 240, height: 240, background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, right: "28%", width: 200, height: 200, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontSize: "clamp(18px,3vw,28px)", fontWeight: 900, color: "#fff", marginBottom: 8 }}>
              هل أنت مستعد لبدء مشروعك؟
            </h3>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 15 }}>
              تواصل معنا اليوم واحصل على استشارة مجانية من خبرائنا
            </p>
          </div>

          <button
            className="cta-btn"
            style={{ background: "#fff", color: "#2c4fd4", boxShadow: "0 4px 16px rgba(0,0,0,0.14)", position: "relative", zIndex: 1 }}
            onClick={() => router.push("/contact")}
          >
            تواصل معنا
          </button>
        </div>
      </section>
    </div>
  );
}