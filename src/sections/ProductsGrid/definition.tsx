import { z } from "zod";
import { productCardOptions } from "../../components/ProductCard/definition";
import { defineSection } from "../../core/define";
import { actionSchema, productSourceSchema } from "../../core/fields";
import { columnsField, headingFields, toneField } from "../_shared/shared-props";
import { ProductsGrid } from "./ProductsGrid";
import { ProductsGridSkeleton } from "../_shared/skeleton/sections";

export const productsSectionProps = z.object({
  ...headingFields,
  source: productSourceSchema,
  card: productCardOptions.partial().default({}).describe("How each product card looks"),
  action: actionSchema.optional(),
  tone: toneField,
});

export const productsGridDefinition = defineSection({
  id: "products.grid",
  name: "Products grid",
  description: "A heading and a grid of real products chosen by category, tag, sale or ids. Hides when empty.",
  tags: ["products", "commerce", "grid"],
  uses: ["ui.sectionHeading", "product.card"],
  pages: ["home", "product", "cart", "favourites", "confirmation", "tracking", "notFound"],
  props: productsSectionProps.extend({ columns: columnsField(4) }),
  examples: [
    {
      name: "Bestsellers",
      props: { eyebrow: "Loved by many", title: "Bestsellers", source: { tag: "bestseller", limit: 4 }, action: { label: "Shop all", route: { to: "catalogue" } } },
    },
    {
      name: "Boxed cards, 3 columns",
      props: { title: "Skincare", source: { categoryId: "skin" }, columns: 3, card: { variant: "boxed", imageRatio: "square" }, tone: "muted" },
    },
  ],
  skeleton: ProductsGridSkeleton,
  render: function ProductsGridPreset(props) {
    return <ProductsGrid {...props} />;
  },
});
