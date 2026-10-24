import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { ProductCard } from "./ProductCard";

export const productCardOptions = z.object({
  variant: field.choice("Card style", ["standard", "boxed", "overlay", "minimal", "horizontal"], "standard"),
  imageRatio: field.choice("Image shape", ["square", "portrait", "landscape", "tall"], "portrait"),
  showRating: field.flag("Show rating", true),
  showFavourite: field.flag("Show favourite button", true),
  showQuickAdd: field.flag("Show quick add", true),
});

export const productCardDefinition = defineComponent({
  id: "product.card",
  name: "Product card",
  description: "One real product: image, badges, name, rating, price, favourite and quick add. Five styles.",
  tags: ["commerce", "product", "card"],
  props: productCardOptions.extend({ productId: z.string().min(1).describe("Product id") }),
  examples: [
    { name: "Standard, on sale", props: { productId: "p1" } },
    { name: "Boxed, low stock", props: { productId: "p2", variant: "boxed", imageRatio: "square" } },
    { name: "Overlay", props: { productId: "p4", variant: "overlay", imageRatio: "tall" } },
    { name: "Minimal, sold out", props: { productId: "p7", variant: "minimal" } },
    { name: "Horizontal", props: { productId: "p6", variant: "horizontal" } },
  ],
  render: function ProductCardPreset(props) {
    return (
      <div style={{ maxInlineSize: props.variant === "horizontal" ? 420 : 280 }}>
        <ProductCard {...props} />
      </div>
    );
  },
});
