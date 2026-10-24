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
    remainingText: field.optionalText("Text while below the threshold. {amount} = what is left. Leave out for the built-in text in the store's language", 80),
    doneText: field.optionalText("Text once free delivery is reached. Leave out for the built-in text in the store's language", 60),
  }),
  examples: [{ name: "Empty cart", props: {} }],
  render: function FreeDeliveryProgressPreset(props) {
    return <FreeDeliveryProgress {...props} />;
  },
});
