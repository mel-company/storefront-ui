/**
 * @mel-company/storefront-ui
 *
 * Components (small parts), sections (components put together) and pages
 * (sections put together), each with a schema, examples and a checker.
 */
export * from "./theme";
export * from "./store";
export * from "./core";
export * from "./icons";
export * from "./components";
export * from "./sections";
export * from "./pages";
export * from "./checker";
export { builtInRegistry } from "./registry";
export { Storefront, type StorefrontProps } from "./Storefront";
export { createDemoStore, demoProducts, demoCategories, demoInfo, demoBanners, productArt, bannerArt } from "./demo";
export { buildCatalogue, catalogueSummary, COMPOSITION_RULES, type Catalogue, type CatalogueEntry } from "./catalogue";
