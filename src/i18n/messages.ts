/**
 * Built-in text: button labels, badges, screen-reader labels. The language
 * follows the store's `info.locale` (`ar-IQ` gives Arabic), and a store can
 * override any message with `info.messages`.
 *
 * Text a section shows as its own content (titles, FAQs, hero copy) comes from
 * its props, never from here.
 */
export interface Messages {
  addToCart: string;
  added: string;
  soldOut: string;
  chooseOptions: (names: string[]) => string;
  sale: string;
  new: string;
  onlyLeft: (count: number) => string;
  inStock: string;
  salePrice: string;
  was: string;
  rated: (value: string) => string;
  quantity: string;
  quantityOf: (name: string) => string;
  decrease: string;
  increase: string;
  remove: string;
  saveFavourite: (name: string) => string;
  removeFavourite: (name: string) => string;
  searchProducts: string;
  freeDeliveryRemaining: string;
  freeDeliveryDone: string;
  freeDeliveryProgress: string;
  countdown: { days: string; hours: string; minutes: string; seconds: string };
  endsIn: (days: number, hours: number, minutes: number) => string;
  yourCart: string;
  checkout: string;
  cartEmptyTitle: string;
  cartEmptyText: string;
  startShopping: string;
  orderSummary: string;
  subtotal: string;
  delivery: string;
  free: string;
  total: string;
  allProducts: string;
  all: string;
  categories: string;
  productCount: (count: number) => string;
  sortBy: string;
  sort: { featured: string; newest: string; "price-asc": string; "price-desc": string; rating: string };
  noMatch: string;
  clearFilters: string;
  showMore: string;
  yourSet: string;
  addSet: string;
  setAdded: string;
  setReady: string;
  pickMore: (count: number) => string;
  rightsReserved: string;
  shop: string;
  help: string;
  cart: string;
  favourites: string;
  contact: string;
  shopAll: string;
  openMenu: string;
  closeMenu: string;
  mainMenu: string;
  mobileMenu: string;
  search: string;
  favouritesCount: (count: number) => string;
  cartCount: (count: number) => string;
  itemCount: (count: number) => string;
  showImage: (index: number) => string;
  previousProducts: string;
  nextProducts: string;
  whyShopWithUs: string;
  relatedTitle: string;
  breadcrumbs: string;
  home: string;
  optional: string;
  required: string;
  fixErrors: (count: number) => string;
  invalidPhone: string;
  invalidEmail: string;
  contactDetails: string;
  fullName: string;
  phone: string;
  email: string;
  deliveryDetails: string;
  city: string;
  chooseCity: string;
  address: string;
  addressHint: string;
  notes: string;
  notesHint: string;
  payment: string;
  cashOnDelivery: string;
  cashOnDeliveryText: string;
  placeOrder: string;
  placingOrder: string;
  orderFailed: string;
  orderingOff: string;
  orderPlacedTitle: string;
  orderNumber: (number: string) => string;
  orderPlacedText: string;
  continueShopping: string;
  favouritesEmptyTitle: string;
  favouritesEmptyText: string;
  notFoundTitle: string;
  notFoundText: string;
  goHome: string;
  trackOrder: string;
  trackIntro: string;
  orderNumberLabel: string;
  orderNumberHint: string;
  orderPhoneHint: string;
  findOrder: string;
  findingOrder: string;
  orderNotFound: string;
  trackingOff: string;
  trackAnother: string;
  orderStatus: { placed: string; confirmed: string; shipped: string; outForDelivery: string; delivered: string; cancelled: string };
  orderStatusText: { placed: string; confirmed: string; shipped: string; outForDelivery: string; delivered: string; cancelled: string };
  orderProgress: string;
  placedOn: (date: string) => string;
  arrivesBy: (date: string) => string;
  deliveredTo: (city: string) => string;
  courier: string;
  trackWithCourier: (name: string) => string;
  callCourier: string;
  items: string;
  invoice: string;
  getInvoice: string;
  invoiceIntro: string;
  showInvoice: string;
  invoiceOff: string;
  viewInvoice: string;
  backToOrder: string;
  findAnotherInvoice: string;
  invoiceNumber: string;
  invoiceDate: string;
  orderRef: string;
  billTo: string;
  taxId: string;
  invoiceStatus: { paid: string; due: string; refunded: string };
  item: string;
  unitPrice: string;
  qty: string;
  amount: string;
  discount: string;
  invoiceThanks: string;
  print: string;
  downloadPdf: string;
  preparingPdf: string;
  pdfFailed: string;
}

export type Language = "en" | "ar";

const en: Messages = {
  addToCart: "Add to cart",
  added: "Added",
  soldOut: "Sold out",
  chooseOptions: (names) => `Choose ${names.map((name) => name.toLowerCase()).join(" and ")}`,
  sale: "Sale",
  new: "New",
  onlyLeft: (count) => `Only ${count} left`,
  inStock: "In stock",
  salePrice: "Sale price",
  was: "Was",
  rated: (value) => `Rated ${value} out of 5`,
  quantity: "Quantity",
  quantityOf: (name) => `Quantity of ${name}`,
  decrease: "Decrease",
  increase: "Increase",
  remove: "Remove",
  saveFavourite: (name) => `Save ${name} to favourites`,
  removeFavourite: (name) => `Remove ${name} from favourites`,
  searchProducts: "Search products",
  freeDeliveryRemaining: "Add {amount} more for free delivery",
  freeDeliveryDone: "You get free delivery",
  freeDeliveryProgress: "Progress to free delivery",
  countdown: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
  endsIn: (days, hours, minutes) => `Ends in ${days} days ${hours} hours ${minutes} minutes`,
  yourCart: "Your cart",
  checkout: "Checkout",
  cartEmptyTitle: "Your cart is empty",
  cartEmptyText: "Find something you love and it will wait for you here.",
  startShopping: "Start shopping",
  orderSummary: "Order summary",
  subtotal: "Subtotal",
  delivery: "Delivery",
  free: "Free",
  total: "Total",
  allProducts: "All products",
  all: "All",
  categories: "Categories",
  productCount: (count) => `${count} ${count === 1 ? "product" : "products"}`,
  sortBy: "Sort by",
  sort: { featured: "Featured", newest: "Newest", "price-asc": "Price, low to high", "price-desc": "Price, high to low", rating: "Top rated" },
  noMatch: "No products match. Try another search.",
  clearFilters: "Clear filters",
  showMore: "Show more",
  yourSet: "Your set",
  addSet: "Add set to cart",
  setAdded: "Your set is in the cart.",
  setReady: "Your set is ready.",
  pickMore: (count) => `Pick ${count} more.`,
  rightsReserved: "All rights reserved.",
  shop: "Shop",
  help: "Help",
  cart: "Cart",
  favourites: "Favourites",
  contact: "Contact",
  shopAll: "Shop all",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  mainMenu: "Main",
  mobileMenu: "Mobile",
  search: "Search",
  favouritesCount: (count) => `Favourites, ${count} saved`,
  cartCount: (count) => `Cart, ${count} items`,
  itemCount: (count) => `${count} ${count === 1 ? "item" : "items"}`,
  showImage: (index) => `Show image ${index}`,
  previousProducts: "Previous products",
  nextProducts: "Next products",
  whyShopWithUs: "Why shop with us",
  relatedTitle: "You may also like",
  breadcrumbs: "Breadcrumb",
  home: "Home",
  optional: "optional",
  required: "This field is required",
  fixErrors: (count) => (count === 1 ? "Check the field marked below." : `Check the ${count} fields marked below.`),
  invalidPhone: "Enter a phone number we can call",
  invalidEmail: "Enter an email like name@example.com",
  contactDetails: "Your details",
  fullName: "Full name",
  phone: "Phone number",
  email: "Email",
  deliveryDetails: "Delivery",
  city: "City",
  chooseCity: "Choose a city",
  address: "Address",
  addressHint: "Area, street and a nearby landmark",
  notes: "Notes for the order",
  notesHint: "A delivery time, a gift message, anything else",
  payment: "Payment",
  cashOnDelivery: "Cash on delivery",
  cashOnDeliveryText: "Pay when your order arrives.",
  placeOrder: "Place order",
  placingOrder: "Placing your order…",
  orderFailed: "We could not place your order. Check your connection and try again.",
  orderingOff: "Ordering is not set up for this store yet.",
  orderPlacedTitle: "Thank you, your order is in",
  orderNumber: (number) => `Order number ${number}`,
  orderPlacedText: "We will contact you soon to confirm delivery.",
  continueShopping: "Continue shopping",
  favouritesEmptyTitle: "No favourites yet",
  favouritesEmptyText: "Tap the heart on any product to keep it here.",
  notFoundTitle: "We could not find that page",
  notFoundText: "The link may be old or the page may have moved.",
  goHome: "Go to the home page",
  trackOrder: "Track your order",
  trackIntro: "Enter the order number from your confirmation and the phone number you ordered with.",
  orderNumberLabel: "Order number",
  orderNumberHint: "For example 1042",
  orderPhoneHint: "The number you gave at checkout",
  findOrder: "Find my order",
  findingOrder: "Looking up your order…",
  orderNotFound: "We could not find an order with that number and phone. Check both and try again.",
  trackingOff: "Order tracking is not set up for this store yet.",
  trackAnother: "Track another order",
  orderStatus: { placed: "Placed", confirmed: "Confirmed", shipped: "Shipped", outForDelivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled" },
  orderStatusText: {
    placed: "We have your order and will confirm it soon.",
    confirmed: "Your order is confirmed and being packed.",
    shipped: "Your order is on its way.",
    outForDelivery: "The courier is bringing your order today.",
    delivered: "Your order was delivered. Enjoy!",
    cancelled: "This order was cancelled. Contact us if that is a surprise.",
  },
  orderProgress: "Order progress",
  placedOn: (date) => `Placed ${date}`,
  arrivesBy: (date) => `Arrives by ${date}`,
  deliveredTo: (city) => `Delivering to ${city}`,
  courier: "Courier",
  trackWithCourier: (name) => `Track with ${name}`,
  callCourier: "Call the courier",
  items: "Items",
  invoice: "Invoice",
  getInvoice: "Get your invoice",
  invoiceIntro: "Enter your order number and the phone you ordered with to see, print or download the invoice.",
  showInvoice: "Show invoice",
  invoiceOff: "Invoices are not set up for this store yet.",
  viewInvoice: "View invoice",
  backToOrder: "Back to the order",
  findAnotherInvoice: "Another invoice",
  invoiceNumber: "Invoice no.",
  invoiceDate: "Date",
  orderRef: "Order",
  billTo: "Bill to",
  taxId: "Tax no.",
  invoiceStatus: { paid: "Paid", due: "Payment due", refunded: "Refunded" },
  item: "Item",
  unitPrice: "Price",
  qty: "Qty",
  amount: "Amount",
  discount: "Discount",
  invoiceThanks: "Thank you for shopping with us.",
  print: "Print",
  downloadPdf: "Download PDF",
  preparingPdf: "Preparing PDF…",
  pdfFailed: "We could not make the PDF here. Use Print and choose Save as PDF instead.",
};

/** Arabic plural forms for "N items": 1, 2, 3–10, 11+. */
const arCount = (count: number, one: string, two: string, few: string, many: string) =>
  count === 1 ? one : count === 2 ? two : count >= 3 && count <= 10 ? `${count} ${few}` : `${count} ${many}`;

const ar: Messages = {
  addToCart: "أضف إلى السلة",
  added: "تمت الإضافة",
  soldOut: "نفدت الكمية",
  chooseOptions: (names) => `اختر ${names.join(" و")}`,
  sale: "تخفيض",
  new: "جديد",
  onlyLeft: (count) => `بقي ${count} فقط`,
  inStock: "متوفر",
  salePrice: "السعر بعد التخفيض",
  was: "كان",
  rated: (value) => `التقييم ${value} من 5`,
  quantity: "الكمية",
  quantityOf: (name) => `كمية ${name}`,
  decrease: "إنقاص",
  increase: "زيادة",
  remove: "حذف",
  saveFavourite: (name) => `أضف ${name} إلى المفضلة`,
  removeFavourite: (name) => `احذف ${name} من المفضلة`,
  searchProducts: "ابحث عن منتج",
  freeDeliveryRemaining: "أضف {amount} للحصول على توصيل مجاني",
  freeDeliveryDone: "حصلت على توصيل مجاني",
  freeDeliveryProgress: "التقدم نحو التوصيل المجاني",
  countdown: { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" },
  endsIn: (days, hours, minutes) => `ينتهي خلال ${days} يوم و${hours} ساعة و${minutes} دقيقة`,
  yourCart: "سلتك",
  checkout: "إتمام الطلب",
  cartEmptyTitle: "سلتك فارغة",
  cartEmptyText: "اختر ما يعجبك وسينتظرك هنا.",
  startShopping: "ابدأ التسوق",
  orderSummary: "ملخص الطلب",
  subtotal: "المجموع الفرعي",
  delivery: "التوصيل",
  free: "مجاني",
  total: "المجموع",
  allProducts: "كل المنتجات",
  all: "الكل",
  categories: "الأقسام",
  productCount: (count) => (count === 0 ? "لا توجد منتجات" : arCount(count, "منتج واحد", "منتجان", "منتجات", "منتجاً")),
  sortBy: "الترتيب",
  sort: { featured: "المميزة", newest: "الأحدث", "price-asc": "السعر: من الأقل", "price-desc": "السعر: من الأعلى", rating: "الأعلى تقييماً" },
  noMatch: "لا توجد منتجات مطابقة. جرّب بحثاً آخر.",
  clearFilters: "مسح الفلاتر",
  showMore: "عرض المزيد",
  yourSet: "مجموعتك",
  addSet: "أضف المجموعة إلى السلة",
  setAdded: "مجموعتك في السلة.",
  setReady: "مجموعتك جاهزة.",
  pickMore: (count) => (count === 1 ? "اختر منتجاً واحداً بعد." : `اختر ${count} منتجات بعد.`),
  rightsReserved: "جميع الحقوق محفوظة.",
  shop: "المتجر",
  help: "المساعدة",
  cart: "السلة",
  favourites: "المفضلة",
  contact: "تواصل معنا",
  shopAll: "تسوق الكل",
  openMenu: "فتح القائمة",
  closeMenu: "إغلاق القائمة",
  mainMenu: "القائمة الرئيسية",
  mobileMenu: "قائمة الجوال",
  search: "بحث",
  favouritesCount: (count) => `المفضلة، ${count} محفوظ`,
  cartCount: (count) => `السلة، ${count} قطعة`,
  itemCount: (count) => (count === 0 ? "لا توجد قطع" : arCount(count, "قطعة واحدة", "قطعتان", "قطع", "قطعة")),
  showImage: (index) => `عرض الصورة ${index}`,
  previousProducts: "المنتجات السابقة",
  nextProducts: "المنتجات التالية",
  whyShopWithUs: "لماذا تتسوق معنا",
  relatedTitle: "قد يعجبك أيضاً",
  breadcrumbs: "مسار التنقل",
  home: "الرئيسية",
  optional: "اختياري",
  required: "هذا الحقل مطلوب",
  fixErrors: (count) => (count === 1 ? "راجع الحقل المحدد أدناه." : count === 2 ? "راجع الحقلين المحددين أدناه." : `راجع الحقول المحددة أدناه (${count}).`),
  invalidPhone: "أدخل رقم هاتف يمكننا الاتصال به",
  invalidEmail: "أدخل بريداً مثل name@example.com",
  contactDetails: "معلوماتك",
  fullName: "الاسم الكامل",
  phone: "رقم الهاتف",
  email: "البريد الإلكتروني",
  deliveryDetails: "التوصيل",
  city: "المحافظة",
  chooseCity: "اختر المحافظة",
  address: "العنوان",
  addressHint: "المنطقة والشارع وأقرب نقطة دالة",
  notes: "ملاحظات الطلب",
  notesHint: "وقت التوصيل، رسالة هدية، أو أي شيء آخر",
  payment: "الدفع",
  cashOnDelivery: "الدفع عند الاستلام",
  cashOnDeliveryText: "ادفع عند وصول طلبك.",
  placeOrder: "تأكيد الطلب",
  placingOrder: "جارٍ إرسال طلبك…",
  orderFailed: "تعذّر إرسال طلبك. تحقق من الاتصال وحاول مجدداً.",
  orderingOff: "الطلب غير مفعّل في هذا المتجر بعد.",
  orderPlacedTitle: "شكراً لك، وصلنا طلبك",
  orderNumber: (number) => `رقم الطلب ${number}`,
  orderPlacedText: "سنتواصل معك قريباً لتأكيد التوصيل.",
  continueShopping: "تابع التسوق",
  favouritesEmptyTitle: "لا توجد منتجات مفضلة بعد",
  favouritesEmptyText: "اضغط على القلب في أي منتج ليبقى هنا.",
  notFoundTitle: "لم نجد هذه الصفحة",
  notFoundText: "قد يكون الرابط قديماً أو أن الصفحة نُقلت.",
  goHome: "اذهب إلى الرئيسية",
  trackOrder: "تتبّع طلبك",
  trackIntro: "أدخل رقم الطلب من رسالة التأكيد ورقم الهاتف الذي طلبت به.",
  orderNumberLabel: "رقم الطلب",
  orderNumberHint: "مثلاً 1042",
  orderPhoneHint: "الرقم الذي أدخلته عند الطلب",
  findOrder: "ابحث عن طلبي",
  findingOrder: "جارٍ البحث عن طلبك…",
  orderNotFound: "لم نجد طلباً بهذا الرقم وهذا الهاتف. تحقق منهما وحاول مجدداً.",
  trackingOff: "تتبّع الطلبات غير مفعّل في هذا المتجر بعد.",
  trackAnother: "تتبّع طلباً آخر",
  orderStatus: { placed: "تم الطلب", confirmed: "تم التأكيد", shipped: "تم الشحن", outForDelivery: "مع المندوب", delivered: "تم التسليم", cancelled: "ملغي" },
  orderStatusText: {
    placed: "وصلنا طلبك وسنؤكده قريباً.",
    confirmed: "تم تأكيد طلبك ويجري تجهيزه.",
    shipped: "طلبك في الطريق إليك.",
    outForDelivery: "المندوب في طريقه إليك اليوم.",
    delivered: "تم تسليم طلبك. نتمنى أن يعجبك!",
    cancelled: "أُلغي هذا الطلب. تواصل معنا إن لم تكن تتوقع ذلك.",
  },
  orderProgress: "مراحل الطلب",
  placedOn: (date) => `تاريخ الطلب ${date}`,
  arrivesBy: (date) => `يصل قبل ${date}`,
  deliveredTo: (city) => `التوصيل إلى ${city}`,
  courier: "شركة التوصيل",
  trackWithCourier: (name) => `تتبّع مع ${name}`,
  callCourier: "اتصل بالمندوب",
  items: "المنتجات",
  invoice: "فاتورة",
  getInvoice: "احصل على فاتورتك",
  invoiceIntro: "أدخل رقم الطلب ورقم الهاتف الذي طلبت به لعرض الفاتورة أو طباعتها أو تنزيلها.",
  showInvoice: "اعرض الفاتورة",
  invoiceOff: "الفواتير غير مفعّلة في هذا المتجر بعد.",
  viewInvoice: "عرض الفاتورة",
  backToOrder: "العودة إلى الطلب",
  findAnotherInvoice: "فاتورة أخرى",
  invoiceNumber: "رقم الفاتورة",
  invoiceDate: "التاريخ",
  orderRef: "الطلب",
  billTo: "إلى",
  taxId: "الرقم الضريبي",
  invoiceStatus: { paid: "مدفوعة", due: "بانتظار الدفع", refunded: "مستردّة" },
  item: "المنتج",
  unitPrice: "السعر",
  qty: "الكمية",
  amount: "المبلغ",
  discount: "الخصم",
  invoiceThanks: "شكراً لتسوقك معنا.",
  print: "طباعة",
  downloadPdf: "تنزيل PDF",
  preparingPdf: "جارٍ تجهيز الملف…",
  pdfFailed: "تعذّر إنشاء ملف PDF هنا. استخدم الطباعة واختر الحفظ كـ PDF.",
};

export const messages: Record<Language, Messages> = { en, ar };

/** `ar`, `ar-IQ` and friends give Arabic; everything else English. */
export function languageOf(locale: string | undefined): Language {
  return locale?.toLowerCase().startsWith("ar") ? "ar" : "en";
}
