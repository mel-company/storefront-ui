import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { OrderSteps } from "./OrderSteps";

const statuses = ["placed", "confirmed", "shipped", "outForDelivery", "delivered", "cancelled"] as const;

export const orderStepsDefinition = defineComponent({
  id: "order.steps",
  name: "Order steps",
  description: "Steps from placed to delivered with the date each was reached. Runs across on wide screens, stacks on phones.",
  tags: ["order", "tracking"],
  props: z.object({
    status: field.choice("Where the order is", statuses, "shipped"),
    history: z.record(z.enum(statuses), z.string()).optional().describe("When each status was reached, ISO date-time"),
    layout: field.choice("Layout on wider screens", ["horizontal", "vertical"] as const, "horizontal"),
    showDates: field.flag("Show dates", true),
  }),
  examples: [
    {
      name: "Shipped",
      props: { status: "shipped", history: { placed: "2026-10-22T10:15:00+03:00", confirmed: "2026-10-22T11:02:00+03:00", shipped: "2026-10-23T09:40:00+03:00" } },
    },
    { name: "Delivered, vertical", props: { status: "delivered", layout: "vertical", showDates: false } },
    { name: "Cancelled", props: { status: "cancelled", history: { placed: "2026-10-22T10:15:00+03:00", cancelled: "2026-10-22T13:30:00+03:00" } } },
  ],
  render: function OrderStepsPreset(props) {
    return <OrderSteps {...props} />;
  },
});
