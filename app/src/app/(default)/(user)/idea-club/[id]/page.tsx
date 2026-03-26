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
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
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

  const c = idea ? hashColor(idea.id ?? idea.name ?? "default") : CARD_COLORS[2];
  const imgSrc = idea ? resolveImageUrl(idea.imageUrl) : null;

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

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.22);
          border-radius: 50px;
          color: #fff;
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          font-weight: 700;
          padding: 9px 20px;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(6px);
          text-decoration: none;
        }
        .back-btn:hover {
          background: rgba(255,255,255,0.22);
          transform: translateX(4px);
        }

        .content-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 4px 32px rgba(30,60,180,0.09);
          overflow: hidden;
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

        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

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

        .idea-content p {
          color: #374151;
          font-size: 15px;
          line-height: 1.95;
          margin-bottom: 16px;
        }

        .idea-content ul,
        .idea-content ol {
          padding-right: 22px;
          margin-bottom: 18px;
        }
        .idea-content li {
          color: #374151;
          font-size: 15px;
          line-height: 1.85;
          margin-bottom: 6px;
        }

        .idea-content strong {
          color: #1a2060;
          font-weight: 800;
        }

        .idea-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 14px;
        }
        .idea-content th {
          background: linear-gradient(135deg, #2c4fd4, #1a3aa8);
          color: #fff;
          padding: 12px 16px;
          text-align: right;
          font-weight: 700;
        }
        .idea-content td {
          padding: 11px 16px;
          border-bottom: 1px solid #e8eeff;
          color: #374151;
        }
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

        .idea-content a {
          color: #2c4fd4;
          text-decoration: underline;
        }

        .idea-content img {
          max-width: 100%;
          border-radius: 12px;
          margin: 16px 0;
        }

        .idea-content hr {
          border: none;
          border-top: 1.5px solid #e8eeff;
          margin: 28px 0;
        }

        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 50px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>

      {/* ── Hero ── */}
      <div
        style={{
          background: loading
            ? "linear-gradient(145deg, #1a2f9e 0%, #2c4fd4 55%, #1e3fbc 100%)"
            : `linear-gradient(145deg, ${c.top}cc 0%, ${c.top} 55%, ${c.top}dd 100%)`,
          padding: "40px 24px 60px",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.4s",
        }}
      >
        {/* decorative blobs */}
        <div style={{ position: "absolute", top: -60, left: -60, width: 280, height: 280, background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, right: "10%", width: 320, height: 320, background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Back button */}
          <button className="back-btn" onClick={() => router.push("/idea-club")} style={{ marginBottom: 28 }}>
            → العودة للأفكار
          </button>

          {loading ? (
            <div>
              <div className="skeleton" style={{ height: 14, width: "20%", marginBottom: 16, borderRadius: 50, background: "rgba(255,255,255,0.15)" }} />
              <div className="skeleton" style={{ height: 38, width: "65%", marginBottom: 14, background: "rgba(255,255,255,0.15)" }} />
              <div className="skeleton" style={{ height: 16, width: "85%", marginBottom: 8, background: "rgba(255,255,255,0.12)" }} />
              <div className="skeleton" style={{ height: 16, width: "55%", background: "rgba(255,255,255,0.12)" }} />
            </div>
          ) : idea ? (
            <div className="fade-in">
              {/* Category + date row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                <span
                  className="meta-badge"
                  style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}
                >
                  🏷️ {idea.category}
                </span>
                {idea.createdAt && (
                  <span
                    className="meta-badge"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}
                  >
                    📅 {new Date(idea.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontSize: "clamp(24px, 4.5vw, 42px)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.3,
                  marginBottom: 16,
                  textShadow: "0 3px 20px rgba(0,0,0,0.2)",
                }}
              >
                {idea.name}
              </h1>

              <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 16, lineHeight: 1.8, maxWidth: 640 }}>
                {idea.description}
              </p>
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>لم يتم العثور على الفكرة.</p>
          )}
        </div>
      </div>

      {/* Wave divider */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, marginTop: -2 }}>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" style={{ display: "block", height: 70 }}>
          <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="#f0f4ff" />
        </svg>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>

        {loading ? (
          <div className="content-card" style={{ padding: "40px 44px" }}>
            {[100, 80, 90, 60, 95, 70, 85, 50].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 14 }} />
            ))}
          </div>
        ) : idea ? (
          <div className="fade-in">
            {/* Hero image (if any) */}
            {imgSrc && !imgError && (
              <div
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  marginBottom: 28,
                  boxShadow: "0 8px 40px rgba(30,60,180,0.12)",
                  border: `3px solid ${c.top}20`,
                }}
              >
                <img
                  src={imgSrc}
                  alt={idea.name}
                  style={{ width: "100%", maxHeight: 440, objectFit: "cover", display: "block" }}
                  onError={() => setImgError(true)}
                />
              </div>
            )}

            {/* Content card */}
            <div className="content-card">
              {/* Top accent bar */}
              <div style={{ height: 5, background: `linear-gradient(90deg, ${c.top}, ${c.accent})` }} />

              <div style={{ padding: "36px 40px 44px" }}>
                {/* Section header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 28,
                    paddingBottom: 20,
                    borderBottom: "1.5px solid #e8eeff",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${c.top}, ${c.accent})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    💡
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>تفاصيل الفكرة</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#1a2060" }}>{idea.name}</div>
                  </div>
                </div>

                {/* Rendered HTML content */}
                {idea.content ? (
                  <div
                    className="idea-content"
                    dangerouslySetInnerHTML={{ __html: idea.content }}
                  />
                ) : (
                  <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.9 }}>
                    {idea.description}
                  </p>
                )}
              </div>
            </div>

            {/* Back button at bottom */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
              <button
                onClick={() => router.push("/idea-club")}
                style={{
                  background: `linear-gradient(135deg, ${c.top}, ${c.accent})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 50,
                  padding: "14px 36px",
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "'Cairo', sans-serif",
                  cursor: "pointer",
                  boxShadow: `0 6px 24px ${c.top}40`,
                  transition: "all 0.2s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                → استعرض المزيد من الأفكار
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "#94a3b8",
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1a2060", marginBottom: 8 }}>
              لم يتم العثور على الفكرة
            </h3>
            <p style={{ fontSize: 14, marginBottom: 24 }}>
              ربما تم حذف هذه الفكرة أو الرابط غير صحيح
            </p>
            <button
              onClick={() => router.push("/idea-club")}
              style={{
                background: "linear-gradient(135deg, #2c4fd4, #1a3aa8)",
                color: "#fff",
                border: "none",
                borderRadius: 50,
                padding: "12px 30px",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Cairo', sans-serif",
                cursor: "pointer",
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