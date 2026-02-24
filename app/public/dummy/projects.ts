const randID = (Math.floor(Math.random() * 100000000) + 1).toString();

function getRandomDate() {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Generate a random year between the current year and 20 years ago
  const randomYear = Math.floor(Math.random() * 20) + (currentYear - 19);

  // Generate a random month (0-11)
  const randomMonth = Math.floor(Math.random() * 12);

  // Generate a random day based on the number of days in the random month
  const daysInMonth = new Date(randomYear, randomMonth + 1, 0).getDate();
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1;

  // Create a new Date object with the random year, month, and day
  return new Date(randomYear, randomMonth, randomDay);
}

const projects = [
  {
    id: randID,
    name: "الواحة الرقمية",
    description: "منصة تجارة إلكترونية متكاملة للمنتجات العربية الأصيلة",
    price: 15000,
    rating: 4.8,
    sales: 127,
    category: "تجارة إلكترونية",
    features: [
      "نظام إدارة المخزون المتطور",
      "بوابة دفع آمنة ومتعددة العملات",
      "تصميم متجاوب مع جميع الأجهزة",
      "نظام تقييم وتعليقات للمنتجات",
      "لوحة تحكم شاملة للبائعين والمشترين",
    ],
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1965&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
  {
    id: randID,
    name: "أكاديمية التعلم الذكي",
    description: "منصة تعليمية متكاملة للدورات الإلكترونية مع نظام إدارة التعلم",
    price: 12000,
    rating: 4.6,
    sales: 89,
    category: "تعليم إلكتروني",
    features: [
      "نظام إدارة المحتوى التعليمي",
      "غرف دراسية افتراضية",
      "نظام اختبارات متكامل",
      "شهادات إتمام رقمية",
      "تتبع تقدم الطلاب",
    ],
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
  {
    id: randID,
    name: "طلبات الطعام السريع",
    description: "تطبيق موبايل لتوصيل الطعام مع نظام إدارة المطاعم",
    price: 18000,
    rating: 4.9,
    sales: 156,
    category: "تطبيقات موبايل",
    features: [
      "تتبع الطلبات في الوقت الحقيقي",
      "نظام ولاء ومكافآت",
      "دعم الدفع الإلكتروني",
      "إدارة المطاعم والفروع",
      "تقارير وإحصائيات متقدمة",
    ],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
  {
    id: randID,
    name: "خدمات حجز المواعيد",
    description: "نظام حجز المواعيد للعيادات والمراكز الطبية",
    price: 8000,
    rating: 4.7,
    sales: 203,
    category: "خدمات",
    features: [
      "جدولة المواعيد أونلاين",
      "إرسال تذكيرات تلقائية",
      "ملفات المرضى الإلكترونية",
      "نظام الفواتير المتكامل",
      "تقارير أداء العيادة",
    ],
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
  {
    id: randID,
    name: "المتجر الذكي",
    description: "نظام نقاط البيع السحابي مع إدارة المخزون",
    price: 6500,
    rating: 4.5,
    sales: 178,
    category: "تجارة إلكترونية",
    features: [
      "نظام نقاط البيع السحابي",
      "إدارة المخزون المتقدمة",
      "تقارير المبيعات والأرباح",
      "نظام ولاء العملاء",
      "دعم الضريبة والفواتير",
    ],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
  {
    id: randID,
    name: "منصة التدريب المهني",
    description: "منصة تدريب إلكتروني للشركات والمؤسسات",
    price: 22000,
    rating: 4.9,
    sales: 67,
    category: "تعليم إلكتروني",
    features: [
      "إدارة المحتوى التدريبي",
      "تقييم أداء المتدربين",
      "شهادات معتمدة",
      "تقارير التقدم والإنجاز",
      "دعم التدريب المباشر",
    ],
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
  {
    id: randID,
    name: "عقارات بلس",
    description: "منصة عقارية متكاملة للبيع والإيجار",
    price: 16000,
    rating: 4.7,
    sales: 92,
    category: "خدمات",
    features: [
      "بحث متقدم عن العقارات",
      "حاسبة التمويل العقاري",
      "جولات افتراضية للعقارات",
      "نظام إدارة العقارات",
      "ربط مع المكاتب العقارية",
    ],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
  {
    id: randID,
    name: "سوق المستعمل",
    description: "منصة لبيع وشراء السلع المستعملة",
    price: 9500,
    rating: 4.4,
    sales: 145,
    category: "تجارة إلكترونية",
    features: [
      "نظام مزادات متكامل",
      "دردشة بين البائع والمشتري",
      "نظام تقييم المستخدمين",
      "خدمة الوسيط الضامن",
      "نظام الإعلانات المميزة",
    ],
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
  {
    id: randID,
    name: "الموظف الذكي",
    description: "نظام إدارة الموارد البشرية السحابي",
    price: 25000,
    rating: 4.8,
    sales: 84,
    category: "خدمات",
    features: [
      "إدارة الحضور والانصراف",
      "نظام الإجازات والمغادرات",
      "إدارة الرواتب والمكافآت",
      "تقييم أداء الموظفين",
      "التوظيف الإلكتروني",
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
  {
    id: randID,
    name: "دليل السياحة العربي",
    description: "تطبيق سياحي شامل للمناطق السياحية في الوطن العربي",
    price: 13500,
    rating: 4.6,
    sales: 112,
    category: "تطبيقات موبايل",
    features: [
      "خرائط تفاعلية للمعالم",
      "حجز الفنادق والرحلات",
      "دليل المطاعم والمقاهي",
      "جولات سياحية مخصصة",
      "نظام توصيات ذكي",
    ],
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop",
    createdAt: getRandomDate(),
  },
];

export default projects;
