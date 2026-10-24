import { z } from "zod";
import { defineComponent } from "../../core/define";
import { useCart } from "../../store";
import { CartLine } from "./CartLine";

export const cartLineDefinition = defineComponent({
  id: "cart.line",
  name: "Cart line",
  description: "One product in the cart with a quantity stepper and remove. Used inside cart sections.",
  tags: ["cart", "commerce"],
  props: z.object({ productId: z.string().min(1).describe("Product id of a product already in the cart") }),
  examples: [{ name: "Two candles", props: { productId: "p6" }, cart: [{ productId: "p6", quantity: 2 }] }],
  render: function CartLinePreset({ productId }) {
    const line = useCart().lines.find((item) => item.productId === productId);
    return line ? <CartLine lineKey={line.key} /> : null;
  },
});
