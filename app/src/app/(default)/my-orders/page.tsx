"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import { User } from "@/types/user.type";
import { parseCookies } from "nookies";

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
interface Order {
  _id: string;
  payNumber: string;
  serviceId: string;
  serviceType: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "cancelled" | "refund_pending";
  stripeSessionId: string;
  createdAt: string;
  updatedAt: string;
  refundedAt?: string;
  refundId?: string;
}

type ToastType = "refunded" | "paid" | "failed" | "update";

interface ToastData {
  id: string;
  type: ToastType;
  payNumber: string;
  amount: number;
  progress: number;
}

/* ═══════════════════════════════════════════════════════════
   STATUS MAPS
═══════════════════════════════════════════════════════════ */
const statusColorMap: Record<
  Order["status"],
  "success" | "warning" | "danger" | "default" | "secondary"
> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  cancelled: "default",
  refund_pending: "secondary",
};

const statusLabelMap: Record<Order["status"], string> = {
  paid: "مدفوع",
  pending: "قيد الانتظار",
  failed: "فشل",
  cancelled: "تم الاسترجاع",
  refund_pending: "جاري الاسترجاع",
};

/* ═══════════════════════════════════════════════════════════
   TOAST CONFIG
═══════════════════════════════════════════════════════════ */
const TOAST_DURATION = 8000;
const TOAST_TICK = 80;

const toastConfig: Record<
  ToastType,
  { icon: string; title: string; message: string; gradient: string; ringColor: string; barColor: string }
> = {
  refunded: {
    icon: "✅",
    title: "تم الاسترجاع بنجاح!",
    message: "تمت إعادة المبلغ إلى حسابك. يرجى تحديث الصفحة لرؤية التغييرات.",
    gradient: "linear-gradient(135deg, #10b981, #0d9488)",
    ringColor: "rgba(16,185,129,0.35)",
    barColor: "#10b981",
  },
  paid: {
    icon: "💳",
    title: "تم الدفع بنجاح!",
    message: "تم تأكيد عملية الدفع. يرجى تحديث الصفحة لرؤية التغييرات.",
    gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    ringColor: "rgba(59,130,246,0.35)",
    barColor: "#3b82f6",
  },
  failed: {
    icon: "❌",
    title: "فشلت العملية",
    message: "تعذّرت العملية. يرجى المحاولة مجدداً أو التواصل مع الدعم.",
    gradient: "linear-gradient(135deg, #ef4444, #f43f5e)",
    ringColor: "rgba(239,68,68,0.35)",
    barColor: "#ef4444",
  },
  update: {
    icon: "🔄",
    title: "تحديث على طلبك",
    message: "تغيّرت حالة أحد طلباتك. يرجى تحديث الصفحة.",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    ringColor: "rgba(245,158,11,0.35)",
    barColor: "#f59e0b",
  },
};

/* ═══════════════════════════════════════════════════════════
   SINGLE TOAST
═══════════════════════════════════════════════════════════ */
function Toast({
  toast,
  onDismiss,
  onReload,
}: {
  toast: ToastData;
  onDismiss: (id: string) => void;
  onReload: () => void;
}) {
  const cfg = toastConfig[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 90, scale: 0.86 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 90, scale: 0.86, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 440, damping: 32 }}
      dir="rtl"
      style={{
        width: 320,
        borderRadius: 18,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
        border: `1.5px solid ${cfg.ringColor}`,
        position: "relative",
      }}
    >
      {/* Left accent bar (RTL = right side visually) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 4,
          bottom: 0,
          background: cfg.gradient,
          borderRadius: "0 18px 18px 0",
        }}
      />

      {/* Header gradient band */}
      <div
        style={{
          background: cfg.gradient,
          padding: "12px 16px 10px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{cfg.icon}</span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{cfg.title}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{
              background: "rgba(255,255,255,0.25)",
              border: "none",
              borderRadius: "50%",
              width: 22,
              height: 22,
              cursor: "pointer",
              color: "#fff",
              fontSize: 15,
              lineHeight: "22px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-label="إغلاق"
          >
            ×
          </button>
        </div>

        {/* Order pill */}
        <div
          style={{
            marginTop: 6,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.22)",
            borderRadius: 20,
            padding: "2px 10px",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11 }}>
            طلب <strong style={{ color: "#fff" }}>#{toast.payNumber}</strong>
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>·</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>{toast.amount} ريال</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 16px 14px" }}>
        <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 12px", lineHeight: 1.6 }}>
          {cfg.message}
        </p>

        {/* Reload button */}
        <button
          onClick={() => { onReload(); onDismiss(toast.id); }}
          style={{
            width: "100%",
            padding: "9px 0",
            borderRadius: 12,
            border: "none",
            background: cfg.gradient,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.3,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          ↻ &nbsp;تحديث الصفحة الآن
        </button>
      </div>

      {/* Countdown progress bar */}
      <div style={{ height: 3, background: "#f3f4f6" }}>
        <motion.div
          style={{ height: "100%", background: cfg.barColor, transformOrigin: "right" }}
          initial={{ width: "100%" }}
          animate={{ width: `${toast.progress}%` }}
          transition={{ ease: "linear", duration: TOAST_TICK / 1000 }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOAST STACK CONTAINER (top-right)
═══════════════════════════════════════════════════════════ */
function ToastContainer({
  toasts,
  onDismiss,
  onReload,
}: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  onReload: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: 16,  // left = right in RTL layouts displayed LTR
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <Toast toast={t} onDismiss={onDismiss} onReload={onReload} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REFUND MODAL
═══════════════════════════════════════════════════════════ */
const REFUND_REASONS = [
  "الخدمة لم تكن كما هو متوقع",
  "تم الشراء بالخطأ",
  "تأخر في التسليم",
  "مشكلة تقنية أثناء الاستخدام",
  "أخرى",
];

function RefundModal({
  order,
  onClose,
  onConfirm,
  isLoading,
}: {
  order: Order | null;
  onClose: () => void;
  onConfirm: (orderId: string, reason: string) => void;
  isLoading: boolean;
}) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const finalReason = selectedReason === "أخرى" ? customReason : selectedReason;
  const canProceed = step === 1 ? !!selectedReason : finalReason.trim().length > 0;

  const handleNext = () => {
    if (step === 1 && selectedReason !== "أخرى") onConfirm(order!._id, finalReason);
    else if (step === 1) setStep(2);
    else onConfirm(order!._id, finalReason);
  };

  const handleClose = () => {
    setSelectedReason(""); setCustomReason(""); setStep(1); onClose();
  };

  if (!order) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
        <motion.div
          className="relative w-full max-w-md"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          dir="rtl"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-l from-red-500 to-rose-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl">↩</div>
                <div>
                  <h2 className="text-white font-bold text-lg">طلب استرجاع</h2>
                  <p className="text-rose-100 text-sm">طلب رقم {order.payNumber} · {order.amount} ريال</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? "bg-white w-8" : "bg-white/30 w-4"}`} />
                {selectedReason === "أخرى" && (
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? "bg-white w-8" : "bg-white/30 w-4"}`} />
                )}
              </div>
            </div>

            <div className="px-6 py-5">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <p className="text-gray-600 text-sm mb-4 font-medium">ما سبب طلب الاسترجاع؟</p>
                    <div className="space-y-2">
                      {REFUND_REASONS.map((r) => (
                        <button key={r} onClick={() => setSelectedReason(r)}
                          className={`w-full text-right px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${selectedReason === r ? "border-rose-500 bg-rose-50 text-rose-700" : "border-gray-200 bg-gray-50 text-gray-700 hover:border-rose-300 hover:bg-rose-50/50"}`}>
                          <span className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${selectedReason === r ? "border-rose-500 bg-rose-500" : "border-gray-300"}`} />
                            {r}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <p className="text-gray-600 text-sm mb-3 font-medium">يرجى توضيح سبب الاسترجاع</p>
                    <textarea value={customReason} onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="اكتب سبب الاسترجاع بالتفصيل..." rows={4} maxLength={500}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-rose-400 transition-colors placeholder-gray-400 bg-gray-50"
                      autoFocus />
                    <p className="text-xs text-gray-400 mt-1 text-left">{customReason.length}/500</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-6 pb-5 flex gap-3">
              <button onClick={handleClose} disabled={isLoading} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50">إلغاء</button>
              <button onClick={handleNext} disabled={!canProceed || isLoading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-l from-red-500 to-rose-600 text-white font-semibold text-sm hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isLoading ? (<><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />جاري الإرسال...</>) : selectedReason === "أخرى" && step === 1 ? "التالي ←" : "تأكيد الاسترجاع"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════
   DIFF HELPER
═══════════════════════════════════════════════════════════ */
function getToastType(prev: Order["status"], next: Order["status"]): ToastType | null {
  if (next === "cancelled") return "refunded";
  if (next === "paid" && prev !== "paid") return "paid";
  if (next === "failed" && prev !== "failed") return "failed";
  if (prev !== next) return "update";
  return null;
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [refundOrder, setRefundOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const prevOrdersRef = useRef<Map<string, Order["status"]>>(new Map());
  const toastTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  /* ── Toast helpers ── */
  const dismissToast = useCallback((id: string) => {
    const t = toastTimers.current.get(id);
    if (t) { clearInterval(t); toastTimers.current.delete(id); }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const spawnToast = useCallback((type: ToastType, payNumber: string, amount: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [{ id, type, payNumber, amount, progress: 100 }, ...prev].slice(0, 4));

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += TOAST_TICK;
      const progress = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, progress } : t)));
      if (elapsed >= TOAST_DURATION) dismissToast(id);
    }, TOAST_TICK);

    toastTimers.current.set(id, interval);
  }, [dismissToast]);

  /* ── Fetch + diff ── */
  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/stripe/my-orders");
      const fresh: Order[] = response.data.data || [];

      // diff
      fresh.forEach((order) => {
        const prev = prevOrdersRef.current.get(order._id);
        if (prev !== undefined && prev !== order.status) {
          const toastType = getToastType(prev, order.status);
          if (toastType) spawnToast(toastType, order.payNumber, order.amount);
        }
      });

      prevOrdersRef.current = new Map(fresh.map((o) => [o._id, o.status]));
      setOrders(fresh);
    } catch (err: any) {
      setError(err.response?.data?.message || "فشل تحميل الطلبات. يرجى المحاولة مرة أخرى");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [spawnToast]);

  useEffect(() => {
    const cookies = parseCookies();
    const userCred = cookies.CRED;
    if (userCred) { try { setUser(JSON.parse(userCred)); } catch {} }

    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 20000);
    return () => {
      clearInterval(interval);
      toastTimers.current.forEach(clearInterval);
    };
  }, [fetchOrders]);

  /* ── Refund ── */
  const handleRefundConfirm = async (orderId: string, message: string) => {
    try {
      setActionLoading(orderId);
      const response = await axiosInstance.post(`/stripe/refund/${orderId}`, {
        name: user?.fullName,
        email: user?.email || "user@email.com",
        message,
      });
      if (response.data.success) {
        setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: "refund_pending" } : o));
        prevOrdersRef.current.set(orderId, "refund_pending");
        setRefundOrder(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "فشل استرجاع المبلغ.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSync = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      await axiosInstance.post(`/stripe/sync/${orderId}`);
      await fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || "فشل تحديث الحالة.");
    } finally {
      setActionLoading(null);
    }
  };

  /* ── Render ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} onReload={() => fetchOrders()} />
      <RefundModal order={refundOrder} onClose={() => setRefundOrder(null)} onConfirm={handleRefundConfirm} isLoading={!!actionLoading} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-7xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8" dir="rtl">
            <h1 className="text-4xl font-bold mb-2">طلباتي</h1>
            <p className="text-gray-600">عرض جميع طلباتك وحالة الدفع</p>
          </div>

          {error && (
            <Card className="bg-red-50 border border-red-200 mb-6">
              <CardBody className="text-red-600">{error}</CardBody>
            </Card>
          )}

          {orders.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-gray-500 text-lg">لا توجد طلبات حالياً</p>
                <Link href="/feasibility-studies">
                  <Button color="primary" className="mt-4">استعرض دراسات الجدوى</Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b" dir="rtl">
                <h2 className="text-xl font-semibold">سجل الطلبات</h2>
                <Button size="sm" color="primary" variant="flat" onClick={() => fetchOrders()} isLoading={loading}>تحديث</Button>
              </CardHeader>

              <CardBody className="px-0">
                <Table aria-label="Orders table">
                  <TableHeader>
                    <TableColumn>رقم الطلب</TableColumn>
                    <TableColumn>المبلغ</TableColumn>
                    <TableColumn>الحالة</TableColumn>
                    <TableColumn>تاريخ الطلب</TableColumn>
                    <TableColumn>الإجراءات</TableColumn>
                  </TableHeader>
                  <TableBody items={orders}>
                    {(order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order.payNumber}</TableCell>
                        <TableCell>{order.amount} ريال</TableCell>
                        <TableCell>
                          <Chip size="sm" color={statusColorMap[order.status]} variant="flat">
                            {statusLabelMap[order.status]}
                          </Chip>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString("ar-SA")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 items-center">
                            {order.status === "pending" && (
                              <Button size="sm" variant="flat" color="warning" onClick={() => handleSync(order._id)} isLoading={actionLoading === order._id}>تحديث</Button>
                            )}
                            {order.status === "paid" && (
                              <Button size="sm" variant="flat" color="danger" onClick={() => setRefundOrder(order)} isLoading={actionLoading === order._id}>طلب استرجاع</Button>
                            )}
                            {order.status === "refund_pending" && (
                              <span className="text-sm text-yellow-600">⏳ جاري معالجة الاسترجاع</span>
                            )}
                            {order.status === "cancelled" && (
                              <span className="text-sm text-green-600">
                                تم الاسترجاع {order.refundedAt ? new Date(order.refundedAt).toLocaleDateString("ar-SA") : ""}
                              </span>
                            )}
                            {order.status === "failed" && (
                              <span className="text-sm text-red-600">فشل الدفع</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          )}
        </motion.div>
      </div>
    </>
  );
}