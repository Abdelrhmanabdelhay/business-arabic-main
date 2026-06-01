type PlanType = "monthly" | "quarterly" | "yearly" | "basic" | "pro" | "premium";

interface PlanConfig {
  limit: number;
  durationDays: number;
  price: number; // السعر الحقيقي
  name: string;  // الاسم المعروض
}

const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
  monthly: { limit: 1, durationDays: 30, price: 200, name: "الباقة الشهرية" },
  quarterly: { limit: 6, durationDays: 90, price: 400, name: "باقة 3 شهور" },
  yearly: { limit: -1, durationDays: 365, price: 800, name: "الباقة السنوية" },
  basic: { limit: 1, durationDays: 30, price: 200, name: "الباقة الأساسية" },
  pro: { limit: 6, durationDays: 90, price: 400, name: "دعم أولوية" },
  premium: { limit: -1, durationDays: 365, price: 800, name: "دعم الدعم" }
};

export default PLAN_CONFIG;