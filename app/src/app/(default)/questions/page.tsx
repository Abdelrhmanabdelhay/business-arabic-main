import Link from "next/link";

const faqs = [
  {
    question: "كيف أستخدم موقع بزنس عربي؟",
    answer:
      "يمكنك البدء بتصفح الأقسام المختلفة مثل أفكار المشاريع، دراسات الجدوى، وقصص النجاح. اختر ما يناسبك ثم اطلع على التفاصيل أو تواصل معنا للحصول على استشارة.",
  },
  {
    question: "كيف أضيف فكرة أو نادي أفكار؟",
    answer:
      "إذا كنت مسجلاً، انتقل إلى لوحة التحكم ثم اختر 'إضافة نادي أفكار'. املأ البيانات المطلوبة وارفع الصورة ليتم عرضها في القائمة.",
  },
  {
    question: "كيف أبحث عن دراسة جدوى جاهزة؟",
    answer:
      "استخدم خاصية البحث في صفحة دراسات الجدوى ثم اختر المشروع المناسب. يمكنك أيضاً تصفية النتائج حسب الفئة أو الموضوع.",
  },
  {
    question: "هل يمكنني التواصل مع الفريق للحصول على دعم؟",
    answer:
      "نعم. يمكنك زيارة صفحة التواصل أو استخدام صفحة الأسئلة للعثور على المعلومات الأساسية ثم التواصل معنا عبر النموذج أو الرقم الموجود في الأسفل.",
  },
  {
    question: "كيف أحصل على استشارة تطوير ونمو أعمال؟",
    answer:
      "انتقل إلى قسم تطوير ونمو أعمال، واستعرض الخدمات المتاحة. بعد ذلك يمكنك طلب الاستشارة مباشرة من خلال الرابط الموجود في الصفحة.",
  },
];

export default function QuestionsPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#f8fafc] text-right py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/30">
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
              الأسئلة المتكررة
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              إجابات سريعة على أسئلتك الأكثر شيوعاً
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              هنا تجد أهم المعلومات التي يحتاجها الزوار والمستخدمون المسجلون. إذا لم تجد إجابتك، تواصل معنا وسنساعدك فوراً.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <h2 className="text-xl font-semibold text-slate-900">{item.question}</h2>
                <p className="mt-3 text-slate-600 leading-7">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">هل تحتاج مساعدة إضافية؟</h3>
              <p className="mt-2 text-slate-600">
                إذا كنت بحاجة إلى دعم شخصي، يمكنك زيارة صفحة التواصل أو الاستفادة من خدماتنا المتخصصة.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/about" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                من نحن
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
