"use client";

import { useEffect, useState, useCallback, useRef,useMemo } from "react";
import axios from "axios";
import { useUserStats } from "../../feasibility-studies/[id]/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeasibilityStudy {
  _id: string;
  name: string;
  description: string;
  image: string;
  pdf: string;
  price: number;
  category: string;
}

interface ApiResponse {
  status: string;
  results: number;
  page: number;
  limit: number;
  total: number;
  data: FeasibilityStudy[];
}

interface UserData {
  plan: string | null;
  downloadsUsed: number;
  downloadsLimit: number;
}

type DownloadState = "idle" | "loading" | "done" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
const LIMIT = 9;

const DEFAULT_USER: UserData = {
  plan: null,
  downloadsUsed: 0,
  downloadsLimit: -1,
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = {
  Cart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.66 16h9.72a2 2 0 0 0 1.97-1.67L23 6H6" />
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Minus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  File: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg whitespace-nowrap animate-[fadeUp_0.25s_ease] ${
        type === "success" ? "bg-[#1c1c1a] text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? <Icon.Check /> : <Icon.AlertCircle />}
      <span>{msg}</span>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-black/[0.09] rounded-xl overflow-hidden">
      <div className="h-[180px] bg-gray-200 animate-pulse" />
      <div className="p-4 pt-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-[70%]" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-full mt-2" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-[85%] mt-1" />
        <div className="flex justify-between items-center mt-5">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-[30%]" />
          <div className="h-9 bg-gray-200 rounded-lg animate-pulse w-[35%]" />
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({
  cart,
  user,
  dlState,
  onRemove,
  onDownloadOne,
  onDownloadAll,
  onClose,
}: {
  cart: FeasibilityStudy[];
  user: UserData;
  dlState: Record<string, DownloadState>;
  onRemove: (id: string) => void;
  onDownloadOne: (study: FeasibilityStudy) => void;
  onDownloadAll: () => void;
  onClose: () => void;
}) {
  const used = user.downloadsUsed;
  const limit = user.downloadsLimit;
  const isUnlimited = limit === -1;
  const remaining = isUnlimited ? Infinity : Math.max(0, limit - used);
  const pct = isUnlimited ? 100 : limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 100;

  const barColor = pct >= 90 ? "#E24B4A" : pct >= 65 ? "#BA7517" : "#1D9E75";
  const canDownloadMore = isUnlimited || remaining > 0;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/35 flex justify-end animate-[fadeUp_0.18s_ease]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside className="w-[380px] max-w-[95vw] h-full bg-white flex flex-col animate-[slideIn_0.25s_cubic-bezier(0.22,1,0.36,1)]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/[0.09] flex items-center justify-between">
          <div>
            <p className="text-[17px] font-bold">سلة التحميل</p>
            <p className="text-[13px] text-gray-400 mt-0.5">{cart.length} دراسة</p>
          </div>
          <button
            className="w-[34px] h-[34px] rounded-lg border-none bg-gray-100 text-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={onClose}
            aria-label="إغلاق"
          >
            <Icon.Close />
          </button>
        </div>

        {/* Quota */}
        <div className="px-6 py-4 border-b border-black/[0.09] bg-[#fafaf8]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] text-gray-500">تحميلاتك المتبقية</span>
            <span className="text-[14px] font-bold" style={{ color: barColor }}>
              {isUnlimited ? "غير محدود" : `${remaining} / ${limit}`}
            </span>
          </div>
          {!isUnlimited && (
            <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: barColor }}
              />
            </div>
          )}
          {!canDownloadMore && (
            <p className="flex items-center gap-1.5 mt-2.5 text-xs text-red-500">
              <Icon.AlertCircle />
              وصلت للحد الأقصى — يرجى ترقية اشتراكك.
            </p>
          )}
        </div>

        {/* List */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-1.5 text-gray-300 p-8 text-center">
            <Icon.File />
            <p className="text-[15px] font-semibold text-gray-400">السلة فارغة</p>
            <p className="text-[13px] text-gray-300">أضف دراسات من القائمة للتحميل</p>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto py-2 list-none">
            {cart.map((study) => {
              const state = dlState[study._id] ?? "idle";
              return (
                <li
                  key={study._id}
                  className="flex items-center gap-2.5 px-6 py-2.5 border-b border-black/[0.09] hover:bg-[#fafaf8] transition-colors"
                >
                  <img
                    src={study.image}
                    alt={study.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-black/[0.09]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate">{study.name}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{study.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      className={`w-8 h-8 rounded-lg border-none flex items-center justify-center cursor-pointer transition-all disabled:opacity-45 disabled:cursor-not-allowed ${
                        state === "done"
                          ? "bg-green-100 text-green-600 cursor-default"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-200"
                      }`}
                      disabled={!canDownloadMore || state === "loading" || state === "done"}
                      onClick={() => onDownloadOne(study)}
                      title={state === "done" ? "تم التحميل" : "تحميل"}
                    >
                      {state === "loading" ? <Spinner /> : state === "done" ? <Icon.Check /> : <Icon.Download />}
                    </button>
                    <button
                      className="w-[34px] h-[34px] rounded-lg border-none bg-gray-100 text-gray-500 flex items-center justify-center cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
                      onClick={() => onRemove(study._id)}
                      title="إزالة"
                    >
                      <Icon.Trash />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Download All */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-black/[0.09] bg-white">
            <button
              className="w-full py-3 bg-[#185FA5] text-white rounded-xl text-[15px] font-bold flex items-center justify-center gap-1.5 border-none cursor-pointer hover:bg-[#0C447C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canDownloadMore || Object.values(dlState).some((s) => s === "loading")}
              onClick={onDownloadAll}
            >
              {Object.values(dlState).some((s) => s === "loading") ? (
                <><Spinner /> جاري التحميل...</>
              ) : (
                <><Icon.Download /> تحميل الكل ({cart.length})</>
              )}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

// ─── Study Card ───────────────────────────────────────────────────────────────

function StudyCard({
  study,
  inCart,
  onToggleCart,
    canDownloadMore,
}: {
  study: FeasibilityStudy;
  inCart: boolean;
    canDownloadMore: boolean;
  onToggleCart: (study: FeasibilityStudy) => void;

  
}) {
  
  return (
    <article className="bg-white border border-black/[0.09] rounded-xl overflow-hidden flex flex-col transition-all duration-[220ms] hover:-translate-y-[3px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] hover:border-black/[0.14] animate-[fadeUp_0.35s_ease_both]">
      <div className="relative h-[180px] overflow-hidden bg-gray-200">
        <img
          src={study.image}
          alt={study.name}
          className="w-full h-full object-cover block transition-transform duration-[400ms] group-hover:scale-[1.04]"
        />
        <span className="absolute top-2.5 right-2.5 bg-[rgba(24,95,165,0.88)] text-white text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm">
          {study.category}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-[15px] font-bold text-[#1c1c1a] mb-1.5 line-clamp-2">{study.name}</h3>
        <p className="text-[13px] text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-3">{study.description}</p>
        <div className="flex items-center justify-between gap-2">
<button
  disabled={!canDownloadMore}
  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium border transition-all
    ${!canDownloadMore
      ? "opacity-40 cursor-not-allowed border-gray-300 text-gray-400"
      : inCart
      ? "bg-red-50 border-red-500 text-red-500 hover:bg-red-100"
      : "bg-transparent border-[#185FA5] text-[#185FA5] hover:bg-blue-50"
    }`}
  onClick={() => onToggleCart(study)}
>
            {inCart ? <><Icon.Minus /> إزالة</> : <><Icon.Plus /> أضف للسلة</>}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeasibilityStudiesPage() {

  // ✅ ALL hooks must be called inside the component — never at module level
  const queryClient = useQueryClient();
  const { data: userStats } = useUserStats();

  // ✅ Derive user directly from query data — no useState/useEffect needed
  const user: UserData = {
    plan: (userStats as any)?.plan ?? DEFAULT_USER.plan,
    downloadsUsed: (userStats as any)?.downloadsUsed ?? DEFAULT_USER.downloadsUsed,
    downloadsLimit: (userStats as any)?.downloadsLimit ?? DEFAULT_USER.downloadsLimit,
  };

  /* ── State ── */
  const [studies, setStudies] = useState<FeasibilityStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKw, setDebouncedKw] = useState("");
  const [cart, setCart] = useState<FeasibilityStudy[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [dlState, setDlState] = useState<Record<string, DownloadState>>({});
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();


  const categories = useMemo(() => {
  const cats = studies.map((s) => s.category || "عام");
  return ["الكل", ...Array.from(new Set(cats))];
}, [studies]);

const [selectedCategory, setSelectedCategory] = useState("الكل");


const filteredStudies = useMemo(() => {
  if (selectedCategory === "الكل") return studies;

  return studies.filter(
    (s) => (s.category || "عام") === selectedCategory
  );
}, [studies, selectedCategory]);
  /* ── Debounce keyword ── */
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedKw(keyword); setPage(1); }, 450);
    return () => clearTimeout(t);
  }, [keyword]);

  /* ── Fetch studies ── */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = debouncedKw
          ? `${API}/feasibility-studies/search`
          : `${API}/feasibility-studies`;

        const params = debouncedKw
          ? { q: debouncedKw }
          : { limit: LIMIT, page };

        const { data } = await axios.get<ApiResponse>(endpoint, {
          params,
          withCredentials: true,
        });
        if (!cancelled) {
          setStudies(data.data);
          setTotal(data.total ?? data.results ?? data.data.length);
        }
      } catch {
        if (!cancelled) setError("تعذّر تحميل الدراسات. تحقق من الاتصال وأعد المحاولة.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [page, debouncedKw]);

  /* ── Toast ── */
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  /* ── Cart ── */
  const isUnlimited = user.downloadsLimit === -1;
const remainingDownloads = isUnlimited
  ? Infinity
  : Math.max(0, user.downloadsLimit - user.downloadsUsed);

const canDownloadMore = isUnlimited || remainingDownloads > 0;
const toggleCart = useCallback((study: FeasibilityStudy) => {
  setCart((prev) => {
    const exists = prev.some((s) => s._id === study._id);

    // ✅ Always allow removing
    if (exists) {
      showToast(`تمت إزالة "${study.name}" من السلة`);
      return prev.filter((s) => s._id !== study._id);
    }

    // ✅ Check against cart length vs remaining downloads — both fresh inside setter
    const isUnlimited = user.downloadsLimit === -1;
    const remaining = isUnlimited
      ? Infinity
      : Math.max(0, user.downloadsLimit - user.downloadsUsed);

    // ✅ Also cap cart size by remaining quota
    if (!isUnlimited && prev.length >= remaining) {
      showToast("وصلت للحد الأقصى للتحميلات — لا يمكنك الإضافة", "error");
      return prev;
    }

    showToast(`تمت إضافة "${study.name}" إلى السلة`);
    return [...prev, study];
  });
}, [showToast, user]); 


const downloadStudy = useCallback(async (study: FeasibilityStudy) => {
  if (!canDownloadMore) {
    showToast("وصلت للحد الأقصى للتحميلات", "error");
    return;
  }

  if (!study.pdf) {
    showToast("هذا الملف غير متاح", "error");
    return;
  }

  setDlState((p) => ({ ...p, [study._id]: "loading" }));

  try {
    const response = await axiosInstance.get(
      `/projectsdownload/download/${study._id}`,
      { responseType: "blob" } 
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${study.name}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    queryClient.invalidateQueries({ queryKey: ["/users/me/stats"] });
    setDlState((p) => ({ ...p, [study._id]: "done" }));
    showToast(`تم تحميل "${study.name}" بنجاح`);

  } catch (err: any) {
    const msg = err?.response?.data?.message ?? "حدث خطأ أثناء التحميل";
    setDlState((p) => ({ ...p, [study._id]: "error" }));
    showToast(msg, "error");
  }
}, [showToast, queryClient, canDownloadMore]);
  const downloadAll = useCallback(async () => {
    for (const study of cart) {
      if (dlState[study._id] === "done") continue;
      await downloadStudy(study);
      await new Promise((r) => setTimeout(r, 500));
    }
  }, [cart, dlState, downloadStudy]);

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((s) => s._id !== id));
  }

  const totalPages = Math.ceil(total / LIMIT);

  /* ── Render ── */
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>

      <div className="font-[Tajawal,sans-serif] min-h-screen bg-[#f4f3ef] text-[#1c1c1a]" dir="rtl">
        {/* Topbar */}
        <header className="sticky top-0 z-[90] bg-white border-b border-black/[0.09] px-8 h-16 flex items-center justify-between">
          <div className="text-[18px] font-bold text-[#1c1c1a] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#185FA5] inline-block" />
            دراسات الجدوى
          </div>
          <button
            className="relative flex items-center gap-2 px-4 py-2 bg-[#185FA5] text-white border-none rounded-full font-[Tajawal,sans-serif] text-sm font-medium cursor-pointer transition-all hover:bg-[#0C447C] active:scale-[0.97]"
            onClick={() => setCartOpen(true)}
          >
            <Icon.Cart />
            السلة
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -left-1.5 min-w-[20px] h-5 bg-red-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center px-1 border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </header>

 <div className="px-8 py-5 bg-white border-b border-black/[0.09] flex items-center gap-12">

  {/* 🔍 Search */}
  <div className="flex-1 max-w-[480px] relative">
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <Icon.Search />
    </span>
    <input
      className="w-full py-2.5 pr-10 pl-3.5 border border-black/[0.09] rounded-full text-sm bg-[#f9f9f7] outline-none transition-all
      focus:border-[#185FA5] focus:shadow-[0_0_0_3px_rgba(24,95,165,0.12)] focus:bg-white"
      placeholder="ابحث عن دراسة..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  </div>

  {/* 🧠 Dropdown */}
  <div className="flex-shrink-0">
    <Dropdown>
      <DropdownTrigger>
        <Button
          radius="full"
          className="
            px-6 py-2
            bg-gradient-to-r from-primary to-purple-500
            text-white font-semibold
            shadow-lg shadow-primary/40
            hover:scale-105 hover:shadow-xl
            transition-all duration-300
          "
        >
          <span className="flex items-center gap-2 text-black">
            {selectedCategory}
            <span className="text-sm opacity-80">▼</span>
          </span>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Categories"
        onAction={(key) => {
          setSelectedCategory(String(key));
          setPage(1);
        }}
      >
        {categories.map((cat) => (
          <DropdownItem key={cat}>{cat}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  </div>

</div>
        {/* Grid */}
        <main className="px-8 py-8 max-w-[1280px] mx-auto">
          {error ? (
            <div className="text-center py-16 px-8 text-gray-400">
              <p className="mb-4">{error}</p>
              <button
                className="px-5 py-2 rounded-lg bg-[#185FA5] text-white border-none font-[Tajawal,sans-serif] text-sm cursor-pointer"
                onClick={() => setPage((p) => p)}
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-gray-400">
                  {loading ? "جاري التحميل..." : `${total.toLocaleString("ar-EG")} دراسة`}
                </p>
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-5">
                {loading
                  ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
                  : filteredStudies.map((study, i) => (
                    <div key={study._id} style={{ animationDelay: `${i * 40}ms` }}>
                      <StudyCard
                        study={study}
                        inCart={cart.some((s) => s._id === study._id)}
                        onToggleCart={toggleCart}
                          canDownloadMore={canDownloadMore} 

                      />
                    </div>
                  ))}
              </div>

              {/* Pagination */}
              {!debouncedKw && totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-10">
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-black/[0.09] bg-white font-[Tajawal,sans-serif] text-sm cursor-pointer transition-all text-gray-600 hover:bg-blue-50 hover:border-[#185FA5] hover:text-[#185FA5] disabled:opacity-35 disabled:cursor-not-allowed"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ‹
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
                        <span key={i} className="text-gray-300 px-1">…</span>
                      ) : (
                        <button
                          key={p}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg border font-[Tajawal,sans-serif] text-sm cursor-pointer transition-all ${
                            p === page
                              ? "bg-[#185FA5] text-white border-[#185FA5] font-bold"
                              : "bg-white border-black/[0.09] text-gray-600 hover:bg-blue-50 hover:border-[#185FA5] hover:text-[#185FA5]"
                          }`}
                          onClick={() => setPage(p as number)}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-black/[0.09] bg-white font-[Tajawal,sans-serif] text-sm cursor-pointer transition-all text-gray-600 hover:bg-blue-50 hover:border-[#185FA5] hover:text-[#185FA5] disabled:opacity-35 disabled:cursor-not-allowed"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Cart Drawer */}
        {cartOpen && (
          <CartDrawer
            cart={cart}
            user={user}
            dlState={dlState}
            onRemove={removeFromCart}
            onDownloadOne={downloadStudy}
            onDownloadAll={downloadAll}
            onClose={() => setCartOpen(false)}
          />
        )}

        {/* Toast */}
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </div>
    </>
  );
}