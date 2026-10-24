import { createMemoryStore } from "../store/memory-store";
import { demoCategories, demoInfo, demoProducts } from "./data";

export { demoBanners, demoCategories, demoInfo, demoProducts } from "./data";
export { bannerArt, productArt } from "./art";

/** A fresh demo store. Each call is independent, so previews do not share carts. */
export const createDemoStore = () =>
  createMemoryStore({ info: demoInfo, products: demoProducts, categories: demoCategories });
