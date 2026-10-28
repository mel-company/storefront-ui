import { z } from "zod";
import { productCardOptions } from "../../components/ProductCard/definition";
import { defineSection } from "../../core/define";
import { actionSchema, field, productSourceSchema } from "../../core/fields";
import { columnsField, headingFields, toneField } from "../_shared/shared-props";
import { ProductsGrid } from "./ProductsGrid";
import { ProductsGridSkeleton } from "./skeleton";

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
  description: "A heading and a grid of real products chosen by category, tag, sale or ids. Even grid or one featured product. Hides when empty.",
  tags: ["products", "commerce", "grid"],
  uses: ["ui.sectionHeading", "product.card"],
  pages: ["home", "product", "cart", "favourites", "confirmation", "tracking", "notFound"],
  props: productsSectionProps.extend({
    columns: columnsField(4),
    layout: field.choice("Layout", ["grid", "featured"], "grid").describe("featured: the first product big, four beside it"),
  }),
  examples: [
    {
      name: "Bestsellers",
      props: { eyebrow: "Loved by many", title: "Bestsellers", source: { tag: "bestseller", limit: 4 }, action: { label: "Shop all", route: { to: "catalogue" } } },
    },
    {
      name: "Boxed cards, 3 columns",
      props: { title: "Skincare", source: { categoryId: "skin" }, columns: 3, card: { variant: "boxed", imageRatio: "square" }, tone: "muted" },
    },
    {
      name: "Featured",
      props: { eyebrow: "This week", title: "Our favourites", layout: "featured", source: { sort: "rating", limit: 5 }, card: { imageRatio: "square" } },
    },
  ],
  skeleton: ProductsGridSkeleton,
  render: function ProductsGridPreset(props) {
    return <ProductsGrid {...props} />;
  },
});
