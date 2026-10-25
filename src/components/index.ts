import type { ComponentDefinition } from "../core/define";
import { accordionDefinition } from "./Accordion";
import { addToCartDefinition } from "./AddToCart";
import { badgeDefinition } from "./Badge";
import { breadcrumbsDefinition } from "./Breadcrumbs";
import { buttonDefinition } from "./Button";
import { cartLineDefinition } from "./CartLine";
import { categoryTileDefinition } from "./CategoryTile";
import { countdownDefinition } from "./Countdown";
import { drawerDefinition } from "./Drawer";
import { emptyStateDefinition } from "./EmptyState";
import { favouriteDefinition } from "./Favourite";
import { featureDefinition } from "./Feature";
import { filterChipsDefinition } from "./FilterChips";
import { freeDeliveryProgressDefinition } from "./FreeDeliveryProgress";
import { mediaDefinition } from "./Media";
import { optionPickerDefinition } from "./OptionPicker";
import { orderStepsDefinition } from "./OrderSteps";
import { priceDefinition } from "./Price";
import { productCardDefinition } from "./ProductCard";
import { quantityStepperDefinition } from "./QuantityStepper";
import { radioCardsDefinition } from "./RadioCards";
import { ratingDefinition } from "./Rating";
import { searchFieldDefinition } from "./SearchField";
import { sectionHeadingDefinition } from "./SectionHeading";
import { selectFieldDefinition } from "./SelectField";
import { skeletonDefinition } from "./Skeleton";
import { textFieldDefinition } from "./TextField";

export * from "./Accordion";
export * from "./AddToCart";
export * from "./Badge";
export * from "./Breadcrumbs";
export * from "./Button";
export * from "./CartLine";
export * from "./CategoryTile";
export * from "./Countdown";
export * from "./Drawer";
export * from "./EmptyState";
export * from "./Favourite";
export * from "./Feature";
export * from "./FilterChips";
export * from "./FreeDeliveryProgress";
export * from "./Media";
export * from "./OptionPicker";
export * from "./OrderSteps";
export * from "./Price";
export * from "./ProductCard";
export * from "./QuantityStepper";
export * from "./RadioCards";
export * from "./Rating";
export * from "./SearchField";
export * from "./SectionHeading";
export * from "./SelectField";
export * from "./Skeleton";
export * from "./TextField";

export const componentDefinitions: ComponentDefinition[] = [
  buttonDefinition,
  badgeDefinition,
  sectionHeadingDefinition,
  mediaDefinition,
  featureDefinition,
  accordionDefinition,
  drawerDefinition,
  countdownDefinition,
  priceDefinition,
  ratingDefinition,
  quantityStepperDefinition,
  addToCartDefinition,
  favouriteDefinition,
  productCardDefinition,
  categoryTileDefinition,
  optionPickerDefinition,
  searchFieldDefinition,
  filterChipsDefinition,
  cartLineDefinition,
  freeDeliveryProgressDefinition,
  breadcrumbsDefinition,
  emptyStateDefinition,
  textFieldDefinition,
  selectFieldDefinition,
  radioCardsDefinition,
  orderStepsDefinition,
  skeletonDefinition,
] as ComponentDefinition[];
