import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { productsSectionProps } from "../ProductsGrid/definition";
import { ProductsRail } from "./ProductsRail";
import { ProductsRailSkeleton } from "../_shared/skeleton/sections";

export const productsRailDefinition = defineSection({
  id: "products.rail",
  name: "Products rail",
  description: "A swipeable row of real products, optionally with big rank numbers. Good for new arrivals, top-10 lists and picks that should not take a full grid.",
  tags: ["products", "commerce", "carousel"],
  uses: ["ui.sectionHeading", "ui.button", "product.card"],
  pages: ["home", "product", "cart", "favourites", "confirmation", "tracking", "notFound"],
  props: productsSectionProps.omit({ action: true }).extend({
    visible: z.number().int().min(2).max(5).default(4).describe("Cards visible at once on desktop"),
    numbered: field.flag("Rank numbers (top 10)", false),
  }),
  examples: [
    { name: "New arrivals", props: { title: "New arrivals", source: { tag: "new" }, visible: 3 } },
    { name: "Overlay cards", props: { eyebrow: "Editors' picks", title: "Picked for you", source: { sort: "rating", limit: 6 }, card: { variant: "overlay", imageRatio: "tall" } } },
    { name: "Top 10", props: { title: "Top 10 this week", source: { sort: "rating", limit: 10 }, numbered: true, visible: 4, card: { variant: "standard" } } },
  ],
  skeleton: ProductsRailSkeleton,
  render: function ProductsRailPreset(props) {
    return <ProductsRail {...props} />;
  },
});
