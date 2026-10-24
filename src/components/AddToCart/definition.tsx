import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { AddToCart } from "./AddToCart";

export const addToCartDefinition = defineComponent({
  id: "commerce.addToCart",
  name: "Add to cart",
  description: "Adds a real product to the cart. Shows Sold out on its own when stock is 0.",
  tags: ["commerce", "cart", "action"],
  props: z.object({
    productId: z.string().min(1).describe("Product id"),
    label: field.optionalText("Button label. Leave out for the built-in text in the store's language", 28),
    variant: field.choice("Style", ["primary", "secondary", "ghost"], "primary"),
    fullWidth: field.flag("Full width", false),
    compact: field.flag("Icon only", false),
  }),
  examples: [
    { name: "Default", props: { productId: "p2" } },
    { name: "Sold out", props: { productId: "p7" } },
    { name: "Icon only", props: { productId: "p6", compact: true, variant: "secondary" } },
  ],
  render: function AddToCartPreset(props) {
    return <AddToCart {...props} />;
  },
});
