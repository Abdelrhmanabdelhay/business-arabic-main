"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Idea {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string | any;
  createdAt?: string;
}

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

export default function IdeaClubPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const limit = 6;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(activeCategory !== "all" && { category: activeCategory }),
      ...(keyword && { keyword }),
    });

    fetch(`http://localhost:8080/api/ideas?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setIdeas(data.ideas ?? []);
        setTotal(data.total ?? 0);
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => setIdeas([]))
      .finally(() => setLoading(false));
  }, [page, activeCategory, keyword]);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setKeyword(searchInput);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    scrollToGrid();
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f0f4ff]"
      style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
    >
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&display=swap');

        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .skeleton {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 10px;
        }

        .fade-in { animation: fadeIn 0.4s ease forwards; }

        .idea-card {
          transition: transform 0.32s cubic-bezier(.22,1,.36,1), box-shadow 0.32s ease;
        }
        .idea-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 52px rgba(30,60,180,0.16);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Hide scrollbar for category row */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden px-6 pb-20 pt-16"
        style={{
          background: "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 55%, #1e3fbc 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            top: -60, left: -60, width: 260, height: 260,
            background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            bottom: -40, right: "10%", width: 320, height: 320,
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[860px] text-center">
          {/* Label */}
          <div className="mb-5 flex items-center justify-center gap-1.5 text-[13px] text-white/55">
            <span className="font-bold text-amber-400">نادي أفكار المشاريع</span>
          </div>

          {/* Badge */}
          <div
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-[18px] py-1.5 text-[13px] font-bold text-amber-400"
            style={{
              background: "rgba(249,115,22,0.14)",
              borderColor: "rgba(249,115,22,0.35)",
            }}
          >
            <span>💡</span> أفكار مميزة ومدروسة
          </div>

          <h1
            className="mb-3.5 font-black leading-tight text-white"
            style={{
              fontSize: "clamp(30px, 5vw, 56px)",
              textShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }}
          >
            نادي أفكار المشاريع
          </h1>

          <p className="mx-auto mb-8 max-w-[520px] text-base leading-relaxed text-white/70">
            اكتشف أفضل أفكار المشاريع في السوق السعودي وكن من أوائل الداخلين قبل أن تصبح الفرصة مزدحمة
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { num: total || "٢٠٠+", label: "فكرة متاحة" },
              { num: categories.length || "٦", label: "تصنيف" },
              { num: "١٠٠٪", label: "محتوى عربي" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-[28px] font-black text-amber-400">{s.num}</div>
                <div className="mt-0.5 text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="overflow-hidden leading-[0]" style={{ marginTop: -2 }}>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-[70px] w-full">
          <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="#f0f4ff" />
        </svg>
      </div>

      {/* ── Main Content ── */}
      <div ref={gridRef} className="mx-auto max-w-[1200px] px-6 pt-10">

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mb-7 flex items-center gap-2.5 rounded-full border border-[#e8eeff] bg-white py-1.5 pl-1.5 pr-[22px] shadow-[0_4px_20px_rgba(30,60,180,0.08)]"
        >
          <span className="flex items-center text-lg text-slate-400">🔍</span>
          <input
            className="flex-1 border-none bg-transparent py-2 px-3 text-sm text-[#1a2060] outline-none placeholder:text-slate-400"
            style={{ fontFamily: "'Cairo', sans-serif" }}
            placeholder="ابحث عن فكرة مشروع..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); setKeyword(""); setPage(1); }}
              className="cursor-pointer border-none bg-transparent p-1 text-lg text-slate-400"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="cursor-pointer whitespace-nowrap rounded-full border-none px-7 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(44,79,212,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(44,79,212,0.4)]"
            style={{
              background: "linear-gradient(135deg, #2c4fd4, #1a3aa8)",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            بحث
          </button>
        </form>

        {/* Category filters */}
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`cursor-pointer whitespace-nowrap rounded-full px-[18px] py-2 text-[13px] font-bold transition-all duration-200 ${
              activeCategory === "all"
                ? "border-transparent text-white shadow-[0_4px_14px_rgba(44,79,212,0.3)]"
                : "border border-[#dde4ff] bg-white text-slate-500 hover:border-[#2c4fd4] hover:text-[#2c4fd4]"
            }`}
            style={{
              fontFamily: "'Cairo', sans-serif",
              ...(activeCategory === "all" && {
                background: "linear-gradient(135deg, #2c4fd4, #1a3aa8)",
              }),
            }}
          >
            الكل {activeCategory === "all" && `(${total})`}
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-[18px] py-2 text-[13px] font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? "border-transparent text-white shadow-[0_4px_14px_rgba(44,79,212,0.3)]"
                  : "border border-[#dde4ff] bg-white text-slate-500 hover:border-[#2c4fd4] hover:text-[#2c4fd4]"
              }`}
              style={{
                fontFamily: "'Cairo', sans-serif",
                ...(activeCategory === cat && {
                  background: "linear-gradient(135deg, #2c4fd4, #1a3aa8)",
                }),
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Result count */}
        {!loading && (
          <div className="mb-5 text-sm text-slate-500">
            {keyword
              ? `نتائج البحث عن "${keyword}" — ${total} فكرة`
              : `إجمالي ${total} فكرة`}
          </div>
        )}

        {/* ── Cards Grid ── */}
        <div
          className="mb-12 grid gap-[26px]"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
        >
          {loading ? (
            /* Skeleton cards */
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[22px] bg-white shadow-[0_4px_20px_rgba(30,60,180,0.06)]"
              >
                <div className="skeleton h-[180px] rounded-none" />
                <div className="px-[22px] pb-[26px] pt-5">
                  <div className="skeleton mb-3 h-3" style={{ width: "35%" }} />
                  <div className="skeleton mb-2.5 h-5" style={{ width: "80%" }} />
                  <div className="skeleton mb-1.5 h-[13px]" style={{ width: "95%" }} />
                  <div className="skeleton mb-5 h-[13px]" style={{ width: "70%" }} />
                  <div className="skeleton h-9 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
            ))
          ) : ideas.length === 0 ? (
            /* Empty state */
            <div className="col-span-full py-20 text-center text-slate-400">
              <div className="mb-4 text-[52px]">🔍</div>
              <h3 className="mb-2 text-xl font-bold text-[#1a2060]">لا توجد نتائج</h3>
              <p className="text-sm">جرّب البحث بكلمة مختلفة أو اختر تصنيفاً آخر</p>
            </div>
          ) : (
            /* Idea cards */
            ideas.map((idea, i) => {
              const c = CARD_COLORS[i % CARD_COLORS.length];
              const imgSrc = resolveImageUrl(idea.imageUrl);

              return (
                <div
                  key={idea.id}
                  className="idea-card fade-in relative cursor-pointer overflow-hidden rounded-[22px] bg-white shadow-[0_4px_20px_rgba(30,60,180,0.07)]"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => router.push(`/idea-club/${idea.id}`)}
                >
                  {/* Top accent bar */}
                  <div
                    className="h-1.5"
                    style={{ background: `linear-gradient(90deg, ${c.top}, ${c.accent})` }}
                  />

                  {/* Image or placeholder */}
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={idea.name}
                      className="block h-[180px] w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="flex h-40 items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${c.top}14, ${c.accent}30)`,
                      }}
                    >
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-[18px] text-[28px]"
                        style={{
                          background: `linear-gradient(135deg, ${c.top}, ${c.accent})`,
                        }}
                      >
                        💡
                      </div>
                    </div>
                  )}

                  {/* Card body */}
                  <div className="px-5 pb-[22px] pt-[18px]">
                    {/* Category + date */}
                    <div className="mb-2.5 flex items-center justify-between">
                      <span
                        className="inline-block rounded-full px-3 py-0.5 text-[11px] font-bold"
                        style={{
                          background: c.light,
                          color: c.top,
                          border: `1px solid ${c.top}30`,
                        }}
                      >
                        {idea.category}
                      </span>
                      {idea.createdAt && (
                        <span className="text-[11px] text-slate-400">
                          {new Date(idea.createdAt).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="line-clamp-2 mb-2 text-[17px] font-extrabold leading-[1.45] text-[#1a2060]"
                    >
                      {idea.name}
                    </h3>

                    {/* Description */}
                    <p className="line-clamp-2 mb-[18px] text-[13px] leading-[1.7] text-slate-500">
                      {idea.description}
                    </p>

                    {/* CTA chip */}
                    <IdeaCardCTA c={c} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pb-16">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex cursor-pointer items-center gap-1 rounded-[10px] border border-[#dde4ff] bg-white px-3.5 py-0 text-sm font-bold text-slate-500 transition-all duration-200 hover:border-[#2c4fd4] hover:text-[#2c4fd4] disabled:cursor-not-allowed disabled:opacity-35"
              style={{ height: 40, fontFamily: "'Cairo', sans-serif" }}
            >
              → السابق
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dot-${i}`} className="px-1 text-sm text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p as number)}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border text-sm font-bold transition-all duration-200 ${
                      page === p
                        ? "border-transparent text-white shadow-[0_4px_12px_rgba(44,79,212,0.3)]"
                        : "border-[#dde4ff] bg-white text-slate-500 hover:border-[#2c4fd4] hover:text-[#2c4fd4]"
                    }`}
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      ...(page === p && {
                        background: "linear-gradient(135deg, #2c4fd4, #1a3aa8)",
                      }),
                    }}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="flex cursor-pointer items-center gap-1 rounded-[10px] border border-[#dde4ff] bg-white px-3.5 py-0 text-sm font-bold text-slate-500 transition-all duration-200 hover:border-[#2c4fd4] hover:text-[#2c4fd4] disabled:cursor-not-allowed disabled:opacity-35"
              style={{ height: 40, fontFamily: "'Cairo', sans-serif" }}
            >
              التالي ←
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Inline hover-state CTA chip (needs local state) ── */
function IdeaCardCTA({ c }: { c: (typeof CARD_COLORS)[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-[7px] text-[13px] font-bold transition-all duration-200"
      style={{
        background: hovered ? c.top : c.light,
        color: hovered ? "#fff" : c.top,
        border: `1.5px solid ${c.top}25`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      عرض الفكرة <span>←</span>
    </div>
  );
}