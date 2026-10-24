import { z } from "zod";
import { defineSection } from "../../core/define";
import { field, iconSchema } from "../../core/fields";
import { toneField } from "../_shared/shared-props";
import { OrderConfirmation } from "./OrderConfirmation";

export const orderConfirmationDefinition = defineSection({
  id: "order.confirmation",
  name: "Order confirmation",
  description: "Thank-you page after an order: order number from the page context, what happens next, store phone and WhatsApp.",
  tags: ["checkout", "order"],
  uses: ["ui.emptyState", "ui.button"],
  pages: ["confirmation"],
  props: z.object({
    icon: iconSchema.default("check"),
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 80),
    text: field.optionalText("What happens next. Leave out for the built-in text in the store's language", 200),
    showContact: field.flag("Show the store's phone and WhatsApp", true),
    tone: toneField,
  }),
  examples: [{ name: "Default", props: {} }, { name: "Own words and icon", props: { icon: "gift", title: "Your order is on its way", text: "We pack every order the same day.", showContact: false, tone: "muted" } }],
  render: function OrderConfirmationPreset(props) {
    return <OrderConfirmation {...props} />;
  },
});
