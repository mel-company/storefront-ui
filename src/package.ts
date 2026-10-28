/**
 * @mel-company/storefront-ui, the package: the small core every copied
 * component and section is built on.
 *
 * Theme, store contract, text, icons, the define/registry helpers and the
 * renderers. The components, sections and pages themselves are not in here:
 * `npx storefront-ui add <id>` copies the ones a project uses into it as
 * source, so a store ships, and an agent reads, only what it uses.
 */
export * from "./theme";
export * from "./store";
export * from "./i18n";
export * from "./core";
export * from "./icons";
export { cx, slugify } from "./utils";
export * from "./pages/composition";
export { PageContextProvider, usePageContext, type PageContextValue } from "./pages/PageContext";
export {
  PageRenderer,
  SectionRenderer,
  RegistryProvider,
  useRegistry,
  compositionOf,
  type PageRendererProps,
  type SectionRendererProps,
} from "./pages/PageRenderer";
export { Storefront, type StorefrontProps } from "./Storefront";
export { buildCatalogue, catalogueSummary, COMPOSITION_RULES, type Catalogue, type CatalogueEntry } from "./catalogue";
