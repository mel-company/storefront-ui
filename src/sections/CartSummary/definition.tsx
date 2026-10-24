import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { CartSummary } from "./CartSummary";

export const cartSummaryDefinition = defineSection({
  id: "cart.summary",
  name: "Cart",
  description: "The cart page: product lines with quantities, free-delivery progress, subtotal, delivery, total, checkout. Empty state included.",
  tags: ["cart", "commerce", "logic"],
  uses: ["cart.line", "cart.freeDeliveryProgress", "ui.button"],
  pages: ["cart"],
  props: z.object({
    title: field.text("Title", 40).default("Your cart"),
    checkoutLabel: field.text("Checkout button", 28).default("Checkout"),
    emptyTitle: field.text("Title when empty", 60).default("Your cart is empty"),
    emptyText: field.text("Text when empty", 160).default("Find something you love and it will wait for you here."),
    showFreeDelivery: field.flag("Show free-delivery progress", true),
  }),
  examples: [
    { name: "With items", props: {}, cart: [{ productId: "p1", quantity: 1, options: { size: "50 ml" } }, { productId: "p6", quantity: 2 }] },
    { name: "Empty", props: {} },
  ],
  render: function CartSummaryPreset(props) {
    return <CartSummary {...props} />;
  },
});
