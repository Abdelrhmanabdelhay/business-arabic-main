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
      style={{
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        background: "#f0f4ff",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .idea-card {
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(30,60,180,0.07);
          transition: transform 0.32s cubic-bezier(.22,1,.36,1), box-shadow 0.32s ease;
          cursor: pointer;
          position: relative;
        }
        .idea-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 52px rgba(30,60,180,0.16);
        }

        .cat-btn {
          border: 1.5px solid #dde4ff;
          background: #fff;
          color: #475569;
          border-radius: 50px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .cat-btn:hover { border-color: #2c4fd4; color: #2c4fd4; }
        .cat-btn.active {
          background: linear-gradient(135deg, #2c4fd4, #1a3aa8);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(44,79,212,0.3);
        }

        .page-btn {
          width: 40px; height: 40px;
          border-radius: 10px;
          border: 1.5px solid #dde4ff;
          background: #fff;
          color: #475569;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .page-btn:hover { border-color: #2c4fd4; color: #2c4fd4; }
        .page-btn.active {
          background: linear-gradient(135deg, #2c4fd4, #1a3aa8);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(44,79,212,0.3);
        }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .search-input {
          border: 1.5px solid #dde4ff;
          border-radius: 50px;
          padding: 12px 22px;
          font-size: 14px;
          font-family: 'Cairo', sans-serif;
          outline: none;
          width: 100%;
          background: #fff;
          color: #1a2060;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
          border-color: #2c4fd4;
          box-shadow: 0 0 0 3px rgba(44,79,212,0.1);
        }
        .search-input::placeholder { color: #94a3b8; }

        .search-btn {
          background: linear-gradient(135deg, #2c4fd4, #1a3aa8);
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          white-space: nowrap;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(44,79,212,0.3);
        }
        .search-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(44,79,212,0.4); }

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

        .fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .category-chip {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 700;
        }

        .empty-state {
          text-align: center;
          padding: 80px 24px;
          color: #94a3b8;
        }
      `}</style>

      <div
        style={{
          background: "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 55%, #1e3fbc 100%)",
          padding: "64px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -60, left: -60, width: 260, height: 260, background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, right: "10%", width: 320, height: 320, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 20, color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
            <span style={{ color: "#fbbf24", fontWeight: 700 }}>نادي أفكار المشاريع</span>
          </div>

          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(249,115,22,0.14)",
              border: "1px solid rgba(249,115,22,0.35)",
              borderRadius: 50, padding: "6px 18px",
              color: "#fbbf24", fontSize: 13, fontWeight: 700,
              marginBottom: 18,
            }}
          >
            <span>💡</span> أفكار مميزة ومدروسة
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 56px)",
              fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 14,
              textShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }}
          >
            نادي أفكار المشاريع
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.8 }}>
            اكتشف أفضل أفكار المشاريع في السوق السعودي وكن من أوائل الداخلين قبل أن تصبح الفرصة مزدحمة
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
            {[
              { num: total || "٢٠٠+", label: "فكرة متاحة" },
              { num: categories.length || "٦", label: "تصنيف" },
              { num: "١٠٠٪", label: "محتوى عربي" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fbbf24" }}>{s.num}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, marginTop: -2 }}>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" style={{ display: "block", height: 70 }}>
          <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="#f0f4ff" />
        </svg>
      </div>

      <div
        ref={gridRef}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 0" }}
      >
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex", gap: 10, marginBottom: 28,
            background: "#fff", borderRadius: 60, padding: "6px 6px 6px 22px",
            boxShadow: "0 4px 20px rgba(30,60,180,0.08)",
            border: "1.5px solid #e8eeff",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", color: "#94a3b8", fontSize: 18 }}>🔍</span>
          <input
            className="search-input"
            style={{ border: "none", boxShadow: "none", padding: "8px 12px", borderRadius: 0 }}
            placeholder="ابحث عن فكرة مشروع..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); setKeyword(""); setPage(1); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18, padding: "0 4px" }}
            >
              ✕
            </button>
          )}
          <button type="submit" className="search-btn">بحث</button>
        </form>

        <div
          style={{
            display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8,
            marginBottom: 32, scrollbarWidth: "none",
          }}
        >
          <button
            className={`cat-btn ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => handleCategoryChange("all")}
          >
            الكل {activeCategory === "all" && `(${total})`}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {!loading && (
          <div style={{ marginBottom: 20, color: "#64748b", fontSize: 14 }}>
            {keyword
              ? `نتائج البحث عن "${keyword}" — ${total} فكرة`
              : `إجمالي ${total} فكرة`}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 26,
            marginBottom: 52,
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 4px 20px rgba(30,60,180,0.06)" }}>
                  <div className="skeleton" style={{ height: 180, borderRadius: 0 }} />
                  <div style={{ padding: "20px 22px 26px" }}>
                    <div className="skeleton" style={{ height: 12, width: "35%", marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 20, width: "80%", marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 13, width: "95%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 13, width: "70%", marginBottom: 20 }} />
                    <div className="skeleton" style={{ height: 36, width: "45%", borderRadius: 50 }} />
                  </div>
                </div>
              ))
            : ideas.length === 0
            ? (
                <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a2060", marginBottom: 8 }}>
                    لا توجد نتائج
                  </h3>
                  <p style={{ fontSize: 14 }}>
                    جرّب البحث بكلمة مختلفة أو اختر تصنيفاً آخر
                  </p>
                </div>
              )
            : ideas.map((idea, i) => {
                const c = CARD_COLORS[i % CARD_COLORS.length];
                const imgSrc = resolveImageUrl(idea.imageUrl);
                return (
                  <div
                    key={idea.id}
                    className="idea-card fade-in"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => router.push(`/idea-club/${idea.id}`)}
                  >
                    <div style={{ height: 6, background: `linear-gradient(90deg, ${c.top}, ${c.accent})` }} />

                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={idea.name}
                        style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 160,
                          background: `linear-gradient(135deg, ${c.top}14, ${c.accent}30)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 64, height: 64, borderRadius: 18,
                            background: `linear-gradient(135deg, ${c.top}, ${c.accent})`,
                            display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: 28,
                          }}
                        >
                          💡
                        </div>
                      </div>
                    )}

                    <div style={{ padding: "18px 20px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span
                          className="category-chip"
                          style={{
                            background: c.light,
                            color: c.top,
                            border: `1px solid ${c.top}30`,
                          }}
                        >
                          {idea.category}
                        </span>
                        {idea.createdAt && (
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>
                            {new Date(idea.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontSize: 17, fontWeight: 800, color: "#1a2060",
                          marginBottom: 8, lineHeight: 1.45,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {idea.name}
                      </h3>

                      <p
                        style={{
                          color: "#64748b", fontSize: 13, lineHeight: 1.7,
                          marginBottom: 18,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {idea.description}
                      </p>

                      {/* CTA */}
                      <div
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          background: c.light,
                          border: `1.5px solid ${c.top}25`,
                          borderRadius: 50, padding: "7px 16px",
                          color: c.top, fontWeight: 700, fontSize: 13,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = c.top;
                          (e.currentTarget as HTMLDivElement).style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = c.light;
                          (e.currentTarget as HTMLDivElement).style.color = c.top;
                        }}
                      >
                        عرض الفكرة <span>←</span>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {totalPages > 1 && (
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 6, paddingBottom: 64, flexWrap: "wrap",
            }}
          >
            <button
              className="page-btn"
              style={{ width: "auto", padding: "0 14px", gap: 4, display: "flex", alignItems: "center" }}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
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
                  <span key={`dot-${i}`} style={{ color: "#94a3b8", fontSize: 14, padding: "0 4px" }}>
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${page === p ? "active" : ""}`}
                    onClick={() => handlePageChange(p as number)}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              className="page-btn"
              style={{ width: "auto", padding: "0 14px", gap: 4, display: "flex", alignItems: "center" }}
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              التالي ←
            </button>
          </div>
        )}
      </div>
    </div>
  );
}