"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const CARD_COLORS = [
  { top: "#7C3AED", accent: "#a78bfa", light: "#f5f3ff" },
  { top: "#F97316", accent: "#fdba74", light: "#fff7ed" },
  { top: "#2c4fd4", accent: "#93c5fd", light: "#eff6ff" },
  { top: "#0EA5E9", accent: "#7dd3fc", light: "#f0f9ff" },
  { top: "#10B981", accent: "#6ee7b7", light: "#f0fdf4" },
  { top: "#EC4899", accent: "#f9a8d4", light: "#fdf2f8" },
];

const resolveImageUrl = (imageUrl: any): string | null => {
  if (!imageUrl) return null;
  if (typeof imageUrl === "string" && imageUrl.trim() !== "") return imageUrl;
  if (typeof imageUrl === "object") {
    const url =
      imageUrl.secure_url ||
      imageUrl.url ||
      imageUrl.path ||
      Object.values(imageUrl).find(
        (v: any) => typeof v === "string" && v.startsWith("http")
      );
    return url ? String(url) : null;
  }
  return null;
};

function hashColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return CARD_COLORS[Math.abs(hash) % CARD_COLORS.length];
}

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/ideas/${id}`)
      .then((res) => res.json())
      .then((data) => setIdea(data))
      .catch(() => setIdea(null))
      .finally(() => setLoading(false));
  }, [id]);

  const c = idea
    ? hashColor(idea.id ?? idea.name ?? "default")
    : CARD_COLORS[2];
  const imgSrc = idea ? resolveImageUrl(idea.imageUrl) : null;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f0f4ff]"
      style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
    >
      {/* Google Fonts + custom styles that can't be expressed in Tailwind */}
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&display=swap');

        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .skeleton {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 10px;
        }
        .skeleton-hero {
          background: linear-gradient(90deg, rgba(255,255,255,0.12) 25%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0.12) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 50px;
        }
        .fade-in { animation: fadeIn 0.5s ease forwards; }

        /* Rich-text content styles */
        .idea-content h1,
        .idea-content h2,
        .idea-content h3,
        .idea-content h4 {
          font-family: 'Cairo', sans-serif;
          font-weight: 800;
          color: #1a2060;
          margin-top: 28px;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .idea-content h1 { font-size: 26px; }
        .idea-content h2 { font-size: 22px; color: #2c4fd4; }
        .idea-content h3 { font-size: 18px; }
        .idea-content p  { color: #374151; font-size: 15px; line-height: 1.95; margin-bottom: 16px; }
        .idea-content ul,
        .idea-content ol { padding-right: 22px; margin-bottom: 18px; }
        .idea-content li { color: #374151; font-size: 15px; line-height: 1.85; margin-bottom: 6px; }
        .idea-content strong { color: #1a2060; font-weight: 800; }
        .idea-content table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
        .idea-content th {
          background: linear-gradient(135deg, #2c4fd4, #1a3aa8);
          color: #fff; padding: 12px 16px;
          text-align: right; font-weight: 700;
        }
        .idea-content td { padding: 11px 16px; border-bottom: 1px solid #e8eeff; color: #374151; }
        .idea-content tr:nth-child(even) td { background: #f5f7ff; }
        .idea-content blockquote {
          border-right: 4px solid #2c4fd4;
          background: #eff3ff;
          padding: 16px 20px;
          border-radius: 0 12px 12px 0;
          margin: 20px 0;
          color: #2c4fd4;
          font-weight: 700;
          font-size: 15px;
        }
        .idea-content a   { color: #2c4fd4; text-decoration: underline; }
        .idea-content img { max-width: 100%; border-radius: 12px; margin: 16px 0; }
        .idea-content hr  { border: none; border-top: 1.5px solid #e8eeff; margin: 28px 0; }
      `}</style>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden px-6 pb-16 pt-10"
        style={{
          background: loading
            ? "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 55%, #1e3fbc 100%)"
            : `linear-gradient(145deg, ${c.top}cc 0%, ${c.top} 55%, ${c.top}dd 100%)`,
          transition: "background 0.4s",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            top: -60, left: -60, width: 280, height: 280,
            background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            bottom: -40, right: "10%", width: 320, height: 320,
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[900px]">
          {/* Back button */}
          <button
            onClick={() => router.push("/idea-club")}
            className="mb-7 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[13px] font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:translate-x-1"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            → العودة للأفكار
          </button>

          {loading ? (
            /* Hero skeleton */
            <div>
              <div className="skeleton-hero mb-4" style={{ height: 14, width: "20%" }} />
              <div className="skeleton-hero mb-3.5" style={{ height: 38, width: "65%" }} />
              <div className="skeleton-hero mb-2" style={{ height: 16, width: "85%" }} />
              <div className="skeleton-hero" style={{ height: 16, width: "55%" }} />
            </div>
          ) : idea ? (
            <div className="fade-in">
              {/* Category + date row */}
              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-bold text-white"
                >
                  🏷️ {idea.category}
                </span>
                {idea.createdAt && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white/80"
                  >
                    📅{" "}
                    {new Date(idea.createdAt).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              <h1
                className="mb-4 font-black leading-snug text-white"
                style={{
                  fontSize: "clamp(24px, 4.5vw, 42px)",
                  textShadow: "0 3px 20px rgba(0,0,0,0.2)",
                }}
              >
                {idea.name}
              </h1>

              <p className="max-w-[640px] text-base leading-relaxed text-white/80">
                {idea.description}
              </p>
            </div>
          ) : (
            <p className="text-base text-white/70">لم يتم العثور على الفكرة.</p>
          )}
        </div>
      </div>

      {/* Wave divider */}
      <div className="overflow-hidden leading-[0]" style={{ marginTop: -2 }}>
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          className="block h-[70px] w-full"
        >
          <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="#f0f4ff" />
        </svg>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-[900px] px-6 pb-20">

        {loading ? (
          /* Body skeleton */
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_32px_rgba(30,60,180,0.09)]">
            <div className="px-11 py-10">
              {[100, 80, 90, 60, 95, 70, 85, 50].map((w, i) => (
                <div
                  key={i}
                  className="skeleton mb-3.5"
                  style={{ height: 14, width: `${w}%` }}
                />
              ))}
            </div>
          </div>
        ) : idea ? (
          <div className="fade-in">
            {/* Hero image */}
            {imgSrc && !imgError && (
              <div
                className="mb-7 overflow-hidden rounded-[20px] shadow-[0_8px_40px_rgba(30,60,180,0.12)]"
                style={{ border: `3px solid ${c.top}20` }}
              >
                <img
                  src={imgSrc}
                  alt={idea.name}
                  className="block max-h-[440px] w-full object-cover"
                  onError={() => setImgError(true)}
                />
              </div>
            )}

            {/* Content card */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_32px_rgba(30,60,180,0.09)]">
              {/* Top accent bar */}
              <div
                className="h-[5px]"
                style={{ background: `linear-gradient(90deg, ${c.top}, ${c.accent})` }}
              />

              <div className="px-10 pb-11 pt-9">
                {/* Section header */}
                <div className="mb-7 flex items-center gap-2.5 border-b border-[#e8eeff] pb-5">
                  <div
                    className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{
                      background: `linear-gradient(135deg, ${c.top}, ${c.accent})`,
                    }}
                  >
                    💡
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">تفاصيل الفكرة</div>
                    <div className="text-lg font-extrabold text-[#1a2060]">{idea.name}</div>
                  </div>
                </div>

                {/* Rendered HTML content */}
                {idea.content ? (
                  <div
                    className="idea-content"
                    dangerouslySetInnerHTML={{ __html: idea.content }}
                  />
                ) : (
                  <p className="text-[15px] leading-[1.9] text-slate-500">
                    {idea.description}
                  </p>
                )}
              </div>
            </div>

            {/* Back button (bottom) */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => router.push("/idea-club")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none px-9 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${c.top}, ${c.accent})`,
                  boxShadow: `0 6px 24px ${c.top}40`,
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                → استعرض المزيد من الأفكار
              </button>
            </div>
          </div>
        ) : (
          /* Not found state */
          <div className="px-6 py-20 text-center text-slate-400">
            <div className="mb-4 text-[52px]">🔍</div>
            <h3 className="mb-2 text-[22px] font-bold text-[#1a2060]">
              لم يتم العثور على الفكرة
            </h3>
            <p className="mb-6 text-sm">
              ربما تم حذف هذه الفكرة أو الرابط غير صحيح
            </p>
            <button
              onClick={() => router.push("/idea-club")}
              className="cursor-pointer rounded-full border-none px-7 py-3 text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #2c4fd4, #1a3aa8)",
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              العودة للأفكار
            </button>
          </div>
        )}
      </div>
    </div>
  );
}