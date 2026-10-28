import { z } from "zod";
import { demoOrderKey } from "../../demo/data";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { toneField } from "../_shared/shared-props";
import { OrderTracking } from "./OrderTracking";
import { OrderLookupSkeleton } from "../_shared/skeleton/OrderLookupSkeleton";

export const orderTrackingDefinition = defineSection({
  id: "order.tracking",
  name: "Order tracking",
  description: "Order tracking page: the shopper enters order number and phone, then sees the status steps, items, totals and courier, and can open the invoice to print or download.",
  tags: ["order", "tracking", "logic"],
  uses: ["form.textField", "ui.button", "order.steps"],
  pages: ["tracking"],
  props: z.object({
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 40),
    intro: field.optionalText("Line under the title. Leave out for the built-in text in the store's language", 200),
    showItems: field.flag("Show what is in the order", true),
    showCourier: field.flag("Show the courier and its tracking link", true),
    statusLayout: field.choice("Status steps on wider screens", ["horizontal", "vertical"] as const, "horizontal"),
    tone: toneField,
  }),
  examples: [
    { name: "From a link", props: {}, context: { orderNumber: "1042", orderKey: demoOrderKey } },
    { name: "Asks for number and phone", props: {} },
    { name: "Muted, vertical steps", props: { title: "Where is my order?", intro: "Try order 1042 with phone 555 0123.", statusLayout: "vertical", tone: "muted" }, context: { orderNumber: "1042", orderKey: demoOrderKey } },
  ],
  skeleton: OrderLookupSkeleton,
  render: function OrderTrackingPreset(props) {
    return <OrderTracking {...props} />;
  },
});
