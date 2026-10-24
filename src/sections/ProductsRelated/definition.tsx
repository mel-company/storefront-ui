import { z } from "zod";
import { productCardOptions } from "../../components/ProductCard/definition";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { ProductsRelated } from "./ProductsRelated";
import { ProductsRelatedSkeleton } from "../_shared/skeleton/sections";

export const productsRelatedDefinition = defineSection({
  id: "products.related",
  name: "Related products",
  description: "Other products from the same category as the current product. For product pages.",
  tags: ["products", "upsell", "logic"],
  uses: ["product.card", "ui.sectionHeading", "ui.button"],
  pages: ["product", "cart"],
  props: z.object({
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 60),
    productId: z.string().optional().describe("Leave empty to use the product of the current page"),
    limit: field.count("How many", 2, 12, 8),
    card: productCardOptions.partial().default({}),
  }),
  examples: [{ name: "Skincare", props: { productId: "p1", title: "Complete your routine" } }],
  skeleton: ProductsRelatedSkeleton,
  render: function ProductsRelatedPreset(props) {
    return <ProductsRelated {...props} />;
  },
});
