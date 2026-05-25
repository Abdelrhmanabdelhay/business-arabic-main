"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface SuccessStory {
  id: string;
  name: string;
  company: string;
  revenue: string;
  quote: string;
  avatar?: string;
  color?: string;
  sector?: string;
  year?: string;
}

const ACCENT_COLORS = ["#7C3AED", "#F97316", "#2c4fd4", "#0EA5E9", "#10B981"];

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [selected, setSelected] = useState<SuccessStory | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const router = useRouter();
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
  useEffect(() => {
    fetch(`${API_BASE}/success-stories?limit=20`)
      .then((r) => r.json())
      .then((d) => setStories(d.stories ?? d ?? []))
      .catch(() => setStories([]));
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
  }, [stories]);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };
  const isVisible = (id: string) => visibleSections.has(id);

  const storyColor = (i: number, story?: SuccessStory) =>
    story?.color ?? ACCENT_COLORS[i % ACCENT_COLORS.length];

const filters = [
  "الكل",
  ...Array.from(
    new Set(
      stories
        .map((s) => s.sector)
        .filter((s): s is string => Boolean(s))
    )
  ),
];  const filtered =
    activeFilter === "الكل" ? stories : stories.filter((s) => s.sector === activeFilter);

  // Skeleton cards
  const skeletons = [0, 1, 2, 3, 4, 5];

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

        .story-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .story-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(30,60,180,0.16);
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

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(10,18,80,0.7);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn .25s ease;
        }
        .modal-box {
          background: #fff;
          border-radius: 28px;
          max-width: 540px;
          width: 100%;
          overflow: hidden;
          animation: slideUp .3s cubic-bezier(.22,1,.36,1);
        }
        @keyframes fadeIn  { from { opacity:0 }   to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(30px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      `}</style>

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden pb-[80px]"
        style={{ background: "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 55%, #1e3fbc 100%)" }}
      >
        <div className="absolute pointer-events-none rounded-full" style={{ top: -80, right: -80, width: 340, height: 340, background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none rounded-full" style={{ bottom: 0, left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 pt-[80px] text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            <span className="text-white font-semibold">قصص النجاح</span>
          </div>

          <div className="inline-flex items-center gap-[6px] rounded-full px-[18px] py-[7px] text-[13px] font-bold mb-5" style={{ background: "rgba(249,115,22,0.16)", border: "1px solid rgba(249,115,22,0.36)", color: "#fbbf24" }}>
            <span>🏆</span> من أرض الواقع
          </div>

          <h1 className="font-black text-white leading-[1.2] mb-4" style={{ fontSize: "clamp(34px, 5vw, 64px)", textShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
            قصص النجاح
          </h1>

          <p className="mx-auto mb-8 leading-[1.85]" style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, maxWidth: 500 }}>
            رواد أعمال حولوا أفكارهم إلى مشاريع مربحة — إلهامك القادم يبدأ من هنا
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { num: "+٥٠٠", label: "رائد أعمال" },
              { num: "+٢٠٠", label: "قصة نجاح" },
              { num: "٩٥٪", label: "نسبة الرضا" },
            ].map((s, i) => (
              <div key={i} className="text-center rounded-2xl px-7 py-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="font-black text-[#fbbf24] text-2xl">{s.num}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="w-full overflow-hidden leading-[0] -mt-[2px]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-20">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f4ff" />
        </svg>
      </div>

      {/* ── FILTERS ── */}
      {filters.length > 1 && (
        <div className="max-w-[1200px] mx-auto px-6 -mt-4 mb-10 flex flex-wrap justify-center gap-3">
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

      {/* ── CARDS GRID ── */}
      <section
        id="stories-grid"
        ref={setRef("stories-grid") as any}
        className="max-w-[1200px] mx-auto px-6 pb-[100px]"
      >
        <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {(filtered.length === 0 ? skeletons : filtered).map((item, i) => {
            const isSkeleton = typeof item === "number";
            if (isSkeleton) {
              return (
                <div key={i} className="bg-white rounded-[22px] overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(30,60,180,0.07)" }}>
                  <div className="skeleton h-3 rounded-none" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="skeleton w-14 h-14 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="skeleton h-4 w-[55%] mb-2" />
                        <div className="skeleton h-3 w-[70%]" />
                      </div>
                    </div>
                    <div className="skeleton h-3 w-full mb-2" />
                    <div className="skeleton h-3 w-[80%] mb-2" />
                    <div className="skeleton h-3 w-[60%]" />
                  </div>
                </div>
              );
            }

            const story = item as SuccessStory;
            const color = storyColor(i, story);

            return (
              <div
                key={story.id}
                className={`story-card fade-up d${(i % 6) + 1} ${isVisible("stories-grid") ? "visible" : ""} bg-white rounded-[22px] overflow-hidden`}
                style={{ boxShadow: "0 4px 20px rgba(30,60,180,0.07)" }}
                onClick={() => setSelected(story)}
              >
                {/* Color bar */}
                <div className="h-[6px]" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

                <div className="p-6">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)`, border: `2px solid ${color}33` }}
                    >
                      {story.avatar ? (
                        <img src={story.avatar} alt={story.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <span className="text-xl font-black" style={{ color }}>{story.name?.charAt(0) ?? "؟"}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-[#1a2060] text-[15px] leading-tight">{story.name}</div>
                      <div className="text-xs text-slate-500 mt-[2px]">{story.company}</div>
                    </div>
                  </div>

                  {/* Revenue badge */}
                  {story.revenue && (
                    <div className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-bold mb-4" style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", color: "#ea580c" }}>
                      💰 {story.revenue}
                    </div>
                  )}

                  {/* Quote */}
                  <blockquote className="text-sm text-slate-500 leading-[1.8] mb-5 line-clamp-3">
                    "{story.quote}"
                  </blockquote>

                  <div className="flex items-center gap-1 text-sm font-bold" style={{ color }}>
                    اقرأ القصة كاملة <span>←</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-[1200px] mx-auto px-6 pb-[80px]">
        <div
          className="relative overflow-hidden rounded-[28px] flex items-center justify-between flex-wrap gap-6"
          style={{
            background: "linear-gradient(135deg, #1a2f9e 0%, #2c4fd4 55%, #f97316 160%)",
            padding: "clamp(36px,5vw,52px) clamp(24px,5vw,44px)",
          }}
        >
          <div className="absolute pointer-events-none rounded-full" style={{ top: -60, left: -60, width: 240, height: 240, background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)" }} />
          <div className="relative z-[1]">
            <h3 className="font-black text-white mb-1" style={{ fontSize: "clamp(18px,3vw,26px)" }}>
              هل قصتك ستكون التالية؟
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.68)" }}>
              انضم إلى مئات رواد الأعمال الناجحين الذين بدأوا معنا
            </p>
          </div>
          <button className="cta-btn relative z-[1]" style={{ background: "#fff", color: "#2c4fd4", boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }} onClick={() => router.push("/idea-club")}>
            استكشف الأفكار ←
          </button>
        </div>
      </section>

      {/* ── MODAL ── */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="relative h-[120px] flex items-end px-7 pb-5" style={{ background: `linear-gradient(135deg, ${storyColor(stories.indexOf(selected), selected)}, ${storyColor(stories.indexOf(selected), selected)}88)` }}>
              <button
                className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center text-white text-lg font-bold"
                style={{ background: "rgba(0,0,0,0.2)" }}
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center" style={{ background: "rgba(255,255,255,0.25)", border: "3px solid rgba(255,255,255,0.4)" }}>
                  {selected.avatar ? (
                    <img src={selected.avatar} alt={selected.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-white">{selected.name?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-black text-white text-lg">{selected.name}</div>
                  <div className="text-sm text-white/70">{selected.company}</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-7">
              {selected.revenue && (
                <div className="inline-flex items-center gap-1 rounded-full px-4 py-1 text-[13px] font-bold mb-5" style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", color: "#ea580c" }}>
                  💰 العوائد: {selected.revenue}
                </div>
              )}
              <blockquote className="text-[15px] text-slate-600 leading-[1.9] mb-6 border-r-4 pr-4" style={{ borderColor: storyColor(stories.indexOf(selected), selected) }}>
                "{selected.quote}"
              </blockquote>
              {selected.sector && (
                <div className="inline-block rounded-full px-4 py-1 text-xs font-bold" style={{ background: "linear-gradient(135deg,#eef2ff,#dde4ff)", color: "#2c4fd4" }}>
                  {selected.sector}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}