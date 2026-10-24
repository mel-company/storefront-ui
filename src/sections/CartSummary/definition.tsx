import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { CartSummary } from "./CartSummary";
import { CartSummarySkeleton } from "../_shared/skeleton/sections";

export const cartSummaryDefinition = defineSection({
  id: "cart.summary",
  name: "Cart",
  description: "The cart page: product lines with quantities, free-delivery progress, subtotal, delivery, total, checkout. Empty state included.",
  tags: ["cart", "commerce", "logic"],
  uses: ["cart.line", "cart.freeDeliveryProgress", "ui.button"],
  pages: ["cart"],
  props: z.object({
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 40),
    checkoutLabel: field.optionalText("Checkout button. Leave out for the built-in text in the store's language", 28),
    emptyTitle: field.optionalText("Title when empty. Leave out for the built-in text in the store's language", 60),
    emptyText: field.optionalText("Text when empty. Leave out for the built-in text in the store's language", 160),
    showFreeDelivery: field.flag("Show free-delivery progress", true),
  }),
  examples: [
    { name: "With items", props: {}, cart: [{ productId: "p1", quantity: 1, options: { size: "50 ml" } }, { productId: "p6", quantity: 2 }] },
    { name: "Empty", props: {} },
  ],
  skeleton: CartSummarySkeleton,
  render: function CartSummaryPreset(props) {
    return <CartSummary {...props} />;
  },
});
