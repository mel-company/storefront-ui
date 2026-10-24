import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { toneField } from "../_shared/shared-props";
import { CheckoutForm } from "./CheckoutForm";

export const checkoutFormDefinition = defineSection({
  id: "checkout.form",
  name: "Checkout",
  description: "Checkout page: contact, delivery and payment fields with checks, order summary, then a thank-you with the order number. Field labels follow info.messages.",
  tags: ["checkout", "commerce", "form", "logic"],
  uses: ["ui.breadcrumbs", "form.textField", "form.select", "form.radioCards", "ui.media", "ui.button", "ui.emptyState"],
  pages: ["checkout"],
  props: z.object({
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 40),
    placeOrderLabel: field.optionalText("Order button. Leave out for the built-in text in the store's language", 28),
    showBreadcrumbs: field.flag("Show the trail back to the cart", true),
    showNotes: field.flag("Ask for order notes", true),
    showSteps: field.flag("Number each group", true),
    paymentLayout: field.choice("Payment methods", ["list", "grid"] as const, "list"),
    summaryFirst: field.flag("On phones, show the order summary first", false),
    tone: toneField,
    successTitle: field.optionalText("Thank-you title. Leave out for the built-in text in the store's language", 80),
    successText: field.optionalText("Thank-you text. Leave out for the built-in text in the store's language", 200),
  }),
  examples: [
    { name: "With items", props: {}, cart: [{ productId: "p1", quantity: 1, options: { size: "50 ml" } }, { productId: "p6", quantity: 2 }] },
    {
      name: "Muted, no steps, summary first",
      props: { tone: "muted", showSteps: false, paymentLayout: "grid", summaryFirst: true, showNotes: false, placeOrderLabel: "Confirm order" },
      cart: [{ productId: "p6", quantity: 1 }],
    },
    { name: "Empty cart", props: {} },
  ],
  render: function CheckoutFormPreset(props) {
    return <CheckoutForm {...props} />;
  },
});
