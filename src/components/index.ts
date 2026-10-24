import type { ComponentDefinition } from "../core/define";
import { accordionDefinition } from "./Accordion";
import { addToCartDefinition } from "./AddToCart";
import { badgeDefinition } from "./Badge";
import { buttonDefinition } from "./Button";
import { cartLineDefinition } from "./CartLine";
import { categoryTileDefinition } from "./CategoryTile";
import { countdownDefinition } from "./Countdown";
import { favouriteDefinition } from "./Favourite";
import { featureDefinition } from "./Feature";
import { filterChipsDefinition } from "./FilterChips";
import { freeDeliveryProgressDefinition } from "./FreeDeliveryProgress";
import { mediaDefinition } from "./Media";
import { optionPickerDefinition } from "./OptionPicker";
import { priceDefinition } from "./Price";
import { productCardDefinition } from "./ProductCard";
import { quantityStepperDefinition } from "./QuantityStepper";
import { ratingDefinition } from "./Rating";
import { searchFieldDefinition } from "./SearchField";
import { sectionHeadingDefinition } from "./SectionHeading";

export * from "./Accordion";
export * from "./AddToCart";
export * from "./Badge";
export * from "./Button";
export * from "./CartLine";
export * from "./CategoryTile";
export * from "./Countdown";
export * from "./Favourite";
export * from "./Feature";
export * from "./FilterChips";
export * from "./FreeDeliveryProgress";
export * from "./Media";
export * from "./OptionPicker";
export * from "./Price";
export * from "./ProductCard";
export * from "./QuantityStepper";
export * from "./Rating";
export * from "./SearchField";
export * from "./SectionHeading";

export const componentDefinitions: ComponentDefinition[] = [
  buttonDefinition,
  badgeDefinition,
  sectionHeadingDefinition,
  mediaDefinition,
  featureDefinition,
  accordionDefinition,
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
] as ComponentDefinition[];
