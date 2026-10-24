import type { Language } from "../i18n/messages";
import { createMemoryStore } from "../store/memory-store";
import { demoCategories, demoCategoriesAr, demoInfo, demoInfoAr, demoProducts, demoProductsAr } from "./data";

export { demoBanners, demoCategories, demoCategoriesAr, demoInfo, demoInfoAr, demoProducts, demoProductsAr } from "./data";
export { bannerArt, productArt } from "./art";

/** A fresh demo store, in English (USD) or Arabic (IQD). Each call is independent, so previews do not share carts. */
export const createDemoStore = ({ language = "en" }: { language?: Language } = {}) =>
  language === "ar"
    ? createMemoryStore({ info: demoInfoAr, products: demoProductsAr, categories: demoCategoriesAr })
    : createMemoryStore({ info: demoInfo, products: demoProducts, categories: demoCategories });
