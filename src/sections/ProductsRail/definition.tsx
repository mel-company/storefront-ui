import { z } from "zod";
import { defineSection } from "../../core/define";
import { productsSectionProps } from "../ProductsGrid/definition";
import { ProductsRail } from "./ProductsRail";

export const productsRailDefinition = defineSection({
  id: "products.rail",
  name: "Products rail",
  description: "A swipeable row of real products. Good for new arrivals and picks that should not take a full grid.",
  tags: ["products", "commerce", "carousel"],
  uses: ["ui.sectionHeading", "ui.button", "product.card"],
  pages: ["home", "product", "cart", "favourites", "confirmation", "tracking", "notFound"],
  props: productsSectionProps.omit({ action: true }).extend({
    visible: z.number().int().min(2).max(5).default(4).describe("Cards visible at once on desktop"),
  }),
  examples: [
    { name: "New arrivals", props: { title: "New arrivals", source: { tag: "new" }, visible: 3 } },
    { name: "Overlay cards", props: { eyebrow: "Editors' picks", title: "Picked for you", source: { sort: "rating", limit: 6 }, card: { variant: "overlay", imageRatio: "tall" } } },
  ],
  render: function ProductsRailPreset(props) {
    return <ProductsRail {...props} />;
  },
});
