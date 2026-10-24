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
};

export const messages: Record<Language, Messages> = { en, ar };

/** `ar`, `ar-IQ` and friends give Arabic; everything else English. */
export function languageOf(locale: string | undefined): Language {
  return locale?.toLowerCase().startsWith("ar") ? "ar" : "en";
}
