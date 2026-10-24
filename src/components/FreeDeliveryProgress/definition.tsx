import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { FreeDeliveryProgress } from "./FreeDeliveryProgress";

export const freeDeliveryProgressDefinition = defineComponent({
  id: "cart.freeDeliveryProgress",
  name: "Free delivery progress",
  description: "Bar showing how much more the shopper must spend for free delivery. Updates with the cart.",
  tags: ["cart", "offer", "logic"],
  props: z.object({
    remainingText: field.text("Text while below the threshold. {amount} = what is left", 80).default("Add {amount} more for free delivery"),
    doneText: field.text("Text once free delivery is reached", 60).default("You get free delivery"),
  }),
  examples: [{ name: "Empty cart", props: {} }],
  render: function FreeDeliveryProgressPreset(props) {
    return <FreeDeliveryProgress {...props} />;
  },
});
