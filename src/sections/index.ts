import type { SectionDefinition } from "../core/define";
import { bundleBuilderDefinition } from "./BundleBuilder";
import { cartSummaryDefinition } from "./CartSummary";
import { catalogueBrowseDefinition } from "./CatalogueBrowse";
import { categoriesTilesDefinition } from "./CategoriesTiles";
import { faqListDefinition } from "./FaqList";
import { footerColumnsDefinition } from "./FooterColumns";
import { headerBarDefinition } from "./HeaderBar";
import { heroBannerDefinition } from "./HeroBanner";
import { heroSplitDefinition } from "./HeroSplit";
import { offerFreeDeliveryDefinition } from "./OfferFreeDelivery";
import { productDetailDefinition } from "./ProductDetail";
import { productsGridDefinition } from "./ProductsGrid";
import { productsRailDefinition } from "./ProductsRail";
import { productsRelatedDefinition } from "./ProductsRelated";
import { storyEditorialDefinition } from "./StoryEditorial";
import { trustStripDefinition } from "./TrustStrip";

export * from "./BundleBuilder";
export * from "./CartSummary";
export * from "./CatalogueBrowse";
export * from "./CategoriesTiles";
export * from "./FaqList";
export * from "./FooterColumns";
export * from "./HeaderBar";
export * from "./HeroBanner";
export * from "./HeroSplit";
export * from "./OfferFreeDelivery";
export * from "./ProductDetail";
export * from "./ProductsGrid";
export * from "./ProductsRail";
export * from "./ProductsRelated";
export * from "./StoryEditorial";
export * from "./TrustStrip";
export { Section, type SectionProps, type SectionTone } from "./_shared/Section";
export { PageContextProvider, usePageContext, type PageContextValue } from "./_shared/PageContext";

export const sectionDefinitions: SectionDefinition[] = [
  headerBarDefinition,
  heroSplitDefinition,
  heroBannerDefinition,
  categoriesTilesDefinition,
  productsGridDefinition,
  productsRailDefinition,
  trustStripDefinition,
  offerFreeDeliveryDefinition,
  bundleBuilderDefinition,
  storyEditorialDefinition,
  faqListDefinition,
  productDetailDefinition,
  productsRelatedDefinition,
  catalogueBrowseDefinition,
  cartSummaryDefinition,
  footerColumnsDefinition,
] as SectionDefinition[];
