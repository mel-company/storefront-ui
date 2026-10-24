import { useCallback } from "react";
import { useSettings } from "./settings";

export type Lang = "en" | "ar";

/**
 * Arabic for the text inside previews: showcase cards, examples and page
 * compositions. Keyed by the English text, so a missing entry just stays
 * English. The site's own copy is not translated.
 */
const AR: Record<string, string> = {
  // Showcase cards and the theme lab sample
  Primary: "أساسي",
  Secondary: "ثانوي",
  "Your cart": "سلتك",
  item: "قطعة",
  items: "قطع",
  "Empty. Add something from the other cards.": "فارغة. أضف شيئاً من البطاقات الأخرى.",
  Total: "المجموع",
  Category: "القسم",
  All: "الكل",
  "No products match.": "لا توجد منتجات مطابقة.",
  "Autumn sale": "تخفيضات الخريف",
  "Up to 30% off candles": "خصم حتى 30% على الشموع",
  "Free delivery": "توصيل مجاني",
  "On orders over $80": "للطلبات فوق 80,000 د.ع",
  "30-day returns": "إرجاع خلال 30 يوماً",
  "No questions asked": "بلا أسئلة",
  "Secure payment": "دفع آمن",
  "Cards and cash on delivery": "بالبطاقة أو نقداً عند الاستلام",
  "How long does delivery take?": "كم يستغرق التوصيل؟",
  "Two to four working days in the city, five to seven elsewhere.": "من يومين إلى أربعة أيام عمل داخل المدينة، ومن خمسة إلى سبعة في باقي المحافظات.",
  "Can I return an opened product?": "هل يمكنني إرجاع منتج مفتوح؟",
  "Yes, within 30 days, no questions asked.": "نعم، خلال 30 يوماً وبلا أسئلة.",
  "Are the formulas vegan?": "هل التركيبات نباتية؟",
  "Every formula is vegan and made without fragrance oils.": "كل تركيباتنا نباتية وخالية من الزيوت العطرية.",

  // Text inside examples and page compositions
  "Shop the collection": "تسوّق المجموعة",
  "View cart": "عرض السلة",
  Explore: "استكشف",
  "New in": "وصل حديثاً",
  Bestseller: "الأكثر مبيعاً",
  Sale: "تخفيض",
  "This week": "هذا الأسبوع",
  Bestsellers: "الأكثر مبيعاً",
  "See all": "عرض الكل",
  "Made in small batches": "مصنوع بكميات صغيرة",
  "Every product is mixed and poured by hand.": "كل منتج يُمزج ويُعبّأ يدوياً.",
  "A jar of cream": "علبة كريم",
  "Two to four working days in the city, up to a week elsewhere.": "من يومين إلى أربعة أيام عمل داخل المدينة، وحتى أسبوع في باقي المحافظات.",
  "Can I return an item?": "هل يمكنني إرجاع منتج؟",
  "Yes, within 30 days if it is unopened.": "نعم، خلال 30 يوماً إذا لم يُفتح.",
  Size: "الحجم",
  "Free delivery on orders over $80": "توصيل مجاني للطلبات فوق 80,000 د.ع",
  "New season": "موسم جديد",
  "Skincare that feels like nothing at all": "عناية بالبشرة خفيفة كأنها غير موجودة",
  "Light formulas, made in small batches with ingredients you can read.": "تركيبات خفيفة، مصنوعة بكميات صغيرة بمكوّنات تستطيع قراءتها.",
  "Shop now": "تسوّق الآن",
  "Jars of cream on a warm background": "علب كريم على خلفية دافئة",
  "Free delivery over $80": "توصيل مجاني فوق 80,000 د.ع",
  "Vegan formulas": "تركيبات نباتية",
  "The home edit": "مختارات المنزل",
  "Shop home": "تسوّق المنزل",
  "Autumn sale, up to 30% off": "تخفيضات الخريف، خصم حتى 30%",
  "Ends Sunday at midnight.": "ينتهي الأحد عند منتصف الليل.",
  "Shop the sale": "تسوّق التخفيضات",
  "Scents for slow evenings": "روائح لأمسيات هادئة",
  Discover: "اكتشف",
  "Shop by category": "تسوّق حسب القسم",
  Browse: "تصفّح",
  "Jump to": "انتقل إلى",
  "Loved by many": "يحبه الكثيرون",
  "Shop all": "تسوّق الكل",
  Skincare: "العناية بالبشرة",
  "New arrivals": "وصل حديثاً",
  "Editors' picks": "اختياراتنا",
  "Picked for you": "اخترناها لك",
  Vegan: "نباتي",
  "Clean formulas": "تركيبات نظيفة",
  "Gift wrapping": "تغليف هدايا",
  "Real support": "دعم حقيقي",
  "Free delivery is close": "التوصيل المجاني قريب",
  "Every order over the threshold ships free.": "كل طلب فوق الحد يُشحن مجاناً.",
  "Keep shopping": "تابع التسوق",
  "Almost there": "اقتربت",
  "Make it yours": "اجعلها لك",
  "Build your ritual": "كوّن روتينك",
  "Pick any three.": "اختر أي ثلاثة.",
  "Two of our best": "اثنان من أفضل منتجاتنا",
  "Our story": "قصتنا",
  "Started in a kitchen, still made by hand": "بدأنا في مطبخ، وما زلنا نصنع يدوياً",
  "We mix every batch ourselves, in small runs, so nothing sits on a shelf for months.": "نمزج كل دفعة بأنفسنا وبكميات صغيرة، فلا يبقى شيء على الرف لأشهر.",
  "Every ingredient is on the label. If you cannot read it, we do not use it.": "كل مكوّن مكتوب على الملصق. إن لم تستطع قراءته فلن نستخدمه.",
  "Candles and jars on a table": "شموع وعلب على طاولة",
  "Read more": "اقرأ المزيد",
  "What we believe": "ما نؤمن به",
  "Fewer, better things, made slowly and meant to be used up.": "أشياء أقل وأفضل، تُصنع بتأنٍّ لتُستخدم حتى آخرها.",
  Help: "المساعدة",
  "Questions, answered": "إجابات أسئلتك",
  "Do you deliver everywhere?": "هل توصلون لكل المحافظات؟",
  "Yes, to every city in the country.": "نعم، لكل مدن البلد.",
  "Can I pay on delivery?": "هل يمكنني الدفع عند الاستلام؟",
  "Yes, cash or card when your order arrives.": "نعم، نقداً أو بالبطاقة عند وصول طلبك.",
  Ingredients: "المكوّنات",
  "Oat extract, squalane, shea butter, glycerin.": "خلاصة الشوفان، سكوالان، زبدة الشيا، جليسرين.",
  "Delivery and returns": "التوصيل والإرجاع",
  "Ships in 1–2 days. Returns within 30 days.": "يُشحن خلال يوم إلى يومين. الإرجاع خلال 30 يوماً.",
  "Complete your routine": "أكمل روتينك",
  Shop: "المتجر",
  "Small-batch skincare, scent and home goods.": "عناية بالبشرة وعطور ومستلزمات منزلية بكميات صغيرة.",
  "Two to four working days.": "من يومين إلى أربعة أيام عمل.",
  "Autumn sale ends Sunday": "تخفيضات الخريف تنتهي الأحد",
  "On sale now": "مخفّض الآن",
  "You may also like": "قد يعجبك أيضاً",
  "Add something small": "أضف شيئاً صغيراً",

  // Checkout, favourites and form examples
  "Full name": "الاسم الكامل",
  "Phone number": "رقم الهاتف",
  "We call to confirm delivery": "نتصل بك لتأكيد التوصيل",
  Email: "البريد الإلكتروني",
  "Enter an email like name@example.com": "أدخل بريداً مثل name@example.com",
  "Notes for the order": "ملاحظات الطلب",
  City: "المحافظة",
  "Choose a city": "اختر المحافظة",
  Northbridge: "بغداد",
  Riverside: "البصرة",
  "Old Town": "أربيل",
  Harbour: "النجف",
  "This field is required": "هذا الحقل مطلوب",
  Payment: "الدفع",
  "Cash on delivery": "الدفع عند الاستلام",
  "Pay when your order arrives.": "ادفع عند وصول طلبك.",
  Card: "بطاقة",
  "Visa or Mastercard, paid online.": "فيزا أو ماستركارد، الدفع عبر الإنترنت.",
  Cart: "السلة",
  Checkout: "إتمام الطلب",
  "No favourites yet": "لا توجد منتجات مفضلة بعد",
  "Tap the heart on any product to keep it here.": "اضغط على القلب في أي منتج ليبقى هنا.",
  "Start shopping": "ابدأ التسوق",
  "Thank you, your order is in": "شكراً لك، وصلنا طلبك",
  "Order number 1042": "رقم الطلب 1042",
  "We will contact you soon to confirm delivery.": "سنتواصل معك قريباً لتأكيد التوصيل.",
  "Your order is on its way": "طلبك في الطريق",
  "We pack every order the same day.": "نجهّز كل طلب في اليوم نفسه.",
  "Confirm order": "أكّد الطلب",
  "Where is my order?": "أين طلبي؟",
  "Try order 1042 with phone 555 0123.": "جرّب الطلب 1042 مع الهاتف 0770 123 4567.",
  "Saved for later": "محفوظ لوقت لاحق",
  "This page has moved on": "هذه الصفحة لم تعد هنا",
  "Try the shop instead.": "جرّب المتجر بدلاً منها.",
  Delivery: "التوصيل",
  Standard: "عادي",
  Express: "سريع",
  "Next working day.": "في يوم العمل التالي.",
};

export function tr(lang: Lang, text: string): string {
  return lang === "ar" ? (AR[text] ?? text) : text;
}

/** Example props or a page composition with every known English string swapped for Arabic. Ids and routes are never in the table, so they stay. */
export function translateDeep<T>(lang: Lang, value: T): T {
  if (lang === "en") return value;
  const walk = (item: unknown): unknown => {
    if (typeof item === "string") return AR[item] ?? item;
    if (Array.isArray(item)) return item.map(walk);
    if (item && typeof item === "object") return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, walk(child)]));
    return item;
  };
  return walk(value) as T;
}

/** `t("English text")` for preview content, in the language the direction switch picked. */
export function useT() {
  const { lang } = useSettings();
  return useCallback((text: string) => tr(lang, text), [lang]);
}
