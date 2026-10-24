import type { Category, Product, StoreInfo } from "../store/types";
import { bannerArt, productArt } from "./art";

export const demoInfo: StoreInfo = {
  name: "Atelier",
  currency: "USD",
  locale: "en-US",
  freeDeliveryThreshold: 80,
  deliveryFee: 6,
  contact: { phone: "+1 555 0100", whatsapp: "+15550100", email: "hello@atelier.example", address: "12 Market Street" },
  social: { instagram: "https://instagram.com/atelier", tiktok: "https://tiktok.com/@atelier" },
};

export const demoCategories: Category[] = [
  { id: "skin", slug: "skincare", name: "Skincare", image: productArt("#f6d5c4", "#e9a98f", "jar") },
  { id: "scent", slug: "fragrance", name: "Fragrance", image: productArt("#d9d4f5", "#9b8fe0", "bottle") },
  { id: "home", slug: "home", name: "Home", image: productArt("#d6ead2", "#8fc28a", "candle") },
  { id: "carry", slug: "accessories", name: "Accessories", image: productArt("#f3e3b8", "#d9b35d", "bag") },
];

const p = (product: Product): Product => product;

export const demoProducts: Product[] = [
  p({
    id: "p1", slug: "cloud-cream", name: "Cloud Cream", categoryId: "skin",
    description: "A light daily moisturiser with oat and squalane. Absorbs in seconds.",
    price: 32, compareAtPrice: 40, rating: 4.8, reviewCount: 214, stock: 24, tags: ["bestseller", "new"],
    images: [productArt("#f6d5c4", "#e9a98f", "jar"), productArt("#fbe7dc", "#f0bfa8", "jar")],
    options: [{ id: "size", name: "Size", values: ["30 ml", "50 ml"] }],
  }),
  p({
    id: "p2", slug: "dew-serum", name: "Dew Serum", categoryId: "skin",
    description: "Hyaluronic serum for an all-day glow.",
    price: 38, rating: 4.6, reviewCount: 98, stock: 3, tags: ["bestseller"],
    images: [productArt("#cfe6f2", "#7fb3d5", "bottle")],
  }),
  p({
    id: "p3", slug: "night-balm", name: "Night Balm", categoryId: "skin",
    description: "Rich overnight balm with ceramides.",
    price: 44, rating: 4.9, reviewCount: 61, stock: 12, tags: ["new"],
    images: [productArt("#e5d9f2", "#a88ad1", "jar")],
  }),
  p({
    id: "p4", slug: "fig-eau", name: "Fig Eau de Parfum", categoryId: "scent",
    description: "Green fig, cedar and a little salt.",
    price: 72, rating: 4.7, reviewCount: 143, stock: 9, tags: ["bestseller"],
    images: [productArt("#d9d4f5", "#9b8fe0", "bottle")],
    options: [{ id: "size", name: "Size", values: ["50 ml", "100 ml"] }],
  }),
  p({
    id: "p5", slug: "amber-mist", name: "Amber Mist", categoryId: "scent",
    description: "Warm amber room and linen mist.",
    price: 24, compareAtPrice: 30, rating: 4.4, reviewCount: 37, stock: 30, tags: ["sale"],
    images: [productArt("#f6e0c2", "#e0a35f", "tube")],
  }),
  p({
    id: "p6", slug: "linen-candle", name: "Linen Candle", categoryId: "home",
    description: "Soy wax candle, 45 hours. Clean cotton and white tea.",
    price: 28, rating: 4.8, reviewCount: 302, stock: 40, tags: ["bestseller"],
    images: [productArt("#d6ead2", "#8fc28a", "candle")],
  }),
  p({
    id: "p7", slug: "stone-vase", name: "Stone Vase", categoryId: "home",
    description: "Hand-glazed ceramic vase.",
    price: 56, rating: 4.5, reviewCount: 22, stock: 0, tags: [],
    images: [productArt("#e7e4de", "#b9b2a5", "vase")],
  }),
  p({
    id: "p8", slug: "market-tote", name: "Market Tote", categoryId: "carry",
    description: "Heavy canvas tote with an inner pocket.",
    price: 22, rating: 4.6, reviewCount: 75, stock: 18, tags: ["new"],
    images: [productArt("#f3e3b8", "#d9b35d", "bag")],
    options: [{ id: "color", name: "Colour", values: ["Sand", "Ink"] }],
  }),
];

export const demoBanners = {
  warm: bannerArt("#fbe3d3", "#f2b39a", "#ffd7b5"),
  cool: bannerArt("#dfe6fb", "#9fb0f0", "#c9d4ff"),
  green: bannerArt("#e3f1df", "#9ccc95", "#d4f0cc"),
};

/** The same store in Arabic: Iraqi dinars, Arabic names, same ids and slugs so links and compositions still work. */
export const demoInfoAr: StoreInfo = {
  name: "أتيليه",
  currency: "IQD",
  // Western digits, as most Iraqi stores show prices.
  locale: "ar-IQ-u-nu-latn",
  freeDeliveryThreshold: 80000,
  deliveryFee: 5000,
  contact: { phone: "+964 770 000 0100", whatsapp: "+9647700000100", email: "hello@atelier.example", address: "شارع السوق 12، بغداد" },
  social: demoInfo.social,
};

const AR_CATEGORIES: Record<string, string> = { skin: "العناية بالبشرة", scent: "العطور", home: "المنزل", carry: "الإكسسوارات" };

const AR_PRODUCTS: Record<string, Pick<Product, "name" | "description"> & { options?: Product["options"] }> = {
  p1: {
    name: "كريم الغيمة",
    description: "مرطب يومي خفيف بالشوفان والسكوالان. يمتصه الجلد في ثوانٍ.",
    options: [{ id: "size", name: "الحجم", values: ["30 مل", "50 مل"] }],
  },
  p2: { name: "سيروم الندى", description: "سيروم بحمض الهيالورونيك لإشراقة تدوم طوال اليوم." },
  p3: { name: "بلسم الليل", description: "بلسم ليلي غني بالسيراميد." },
  p4: {
    name: "عطر التين",
    description: "تين أخضر وخشب الأرز ولمسة من الملح.",
    options: [{ id: "size", name: "الحجم", values: ["50 مل", "100 مل"] }],
  },
  p5: { name: "رذاذ العنبر", description: "رذاذ دافئ بالعنبر للغرف والمفارش." },
  p6: { name: "شمعة الكتان", description: "شمعة من شمع الصويا تدوم 45 ساعة. قطن نظيف وشاي أبيض." },
  p7: { name: "مزهرية حجرية", description: "مزهرية خزفية مزججة يدوياً." },
  p8: {
    name: "حقيبة السوق",
    description: "حقيبة قماشية متينة بجيب داخلي.",
    options: [{ id: "color", name: "اللون", values: ["رملي", "كحلي"] }],
  },
};

export const demoCategoriesAr: Category[] = demoCategories.map((category) => ({ ...category, name: AR_CATEGORIES[category.id] ?? category.name }));

export const demoProductsAr: Product[] = demoProducts.map((product) => ({
  ...product,
  ...AR_PRODUCTS[product.id],
  price: product.price * 1000,
  compareAtPrice: product.compareAtPrice === undefined ? undefined : product.compareAtPrice * 1000,
}));
