import type { Language } from "../i18n/messages";
import { createMemoryStore } from "../store/memory-store";
import { demoCategories, demoCategoriesAr, demoInfo, demoInfoAr, demoInvoice1042, demoInvoice1042Ar, demoOrder1042, demoOrder1042Ar, demoOrderKey, demoOrderPhone, demoOrderPhoneAr, demoProducts, demoProductsAr } from "./data";

export { demoBanners, demoCategories, demoCategoriesAr, demoInfo, demoInfoAr, demoOrderKey, demoOrderPhone, demoOrderPhoneAr, demoProducts, demoProductsAr } from "./data";
export { bannerArt, productArt } from "./art";

/** A fresh demo store, in English (USD) or Arabic (IQD), with order 1042 to track and its invoice (`demoOrderPhone`). Each call is independent, so previews do not share carts. */
export const createDemoStore = ({ language = "en" }: { language?: Language } = {}) =>
  language === "ar"
    ? createMemoryStore({ info: demoInfoAr, products: demoProductsAr, categories: demoCategoriesAr, orders: [{ phone: demoOrderPhoneAr, key: demoOrderKey, order: demoOrder1042Ar, invoice: demoInvoice1042Ar }] })
    : createMemoryStore({ info: demoInfo, products: demoProducts, categories: demoCategories, orders: [{ phone: demoOrderPhone, key: demoOrderKey, order: demoOrder1042, invoice: demoInvoice1042 }] });
