export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "بزنس عربي",
  description: "بزنس ستور برو منصة عربية تقدم أفكار مشاريع، دراسات جدوى احترافية، مدونة تجارية، وخدمات نمو الأعمال عبر الإنترنت.",
  url: "https://businessstorepro.com",
  navItems: [
    {
      label: "الرئيسية",
      href: "/",
    },
    {
      label: "دراسات جدوى",
      href: "/feasibility-studies",
    },
    {
      label: "نادي أفكار مشاريع",
      href: "/club",
    },
    {
      label: "المدونة",
      href: "/blog",
    },
    {
      label:  "الأسئلة الشائعة",
      href: "/questions",
    },
    {
      label: "عن بزنس برو",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "الملف الشخصي",
      href: "/profile",
    },
    {
      label: "لوحة التحكم",
      href: "/dashboard",
    },
    {
      label: "أفكار مشاريع عبر الإنترنت",
      href: "/online-project-ideas",
    },
    {
      label: "أفكار مشاريع تجارية",
      href: "/business-project-ideas",
    },
    {
      label: "قصص نجاح ودراسة حالة",
      href: "/success-stories",
    },
    {
      label: "أفكار تسويقية وتنمية الأعمال",
      href: "/marketing-business-development",
    },
    {
      label: "الإعدادات",
      href: "/settings",
    },
    {
      label: "المساعدة والدعم",
      href: "/help-support",
    },
    {
      label: "تسجيل الخروج",
      href: "/logout",
    },
  ],
  links: {
    // You may want to update these with your actual social media and contact links
    twitter: "https://twitter.com/businessarabic",
    facebook: "https://facebook.com/businessarabic",
    instagram: "https://instagram.com/businessarabic",
    contact: "/contact",
  },
};
