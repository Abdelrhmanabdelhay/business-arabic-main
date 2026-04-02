type PlanType = "monthly" | "quarterly" | "yearly";

interface PlanConfig {
  limit: number;
  durationDays: number;
  price: number; // السعر الحقيقي
  name: string;  // الاسم المعروض
}

const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
  monthly: { limit: 1, durationDays: 30, price: 100, name: "الباقة الشهرية" },
  quarterly: { limit: 6, durationDays: 90, price: 250, name: "باقة 3 شهور" },
  yearly: { limit: -1, durationDays: 365, price: 800, name: "الباقة السنوية" },
};

export default PLAN_CONFIG;