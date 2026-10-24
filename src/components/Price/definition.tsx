import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { Price } from "./Price";

export const priceDefinition = defineComponent({
  id: "commerce.price",
  name: "Price",
  description: "A price in the store's currency, with the old price struck through when on sale.",
  tags: ["commerce", "price"],
  props: z.object({
    amount: z.number().nonnegative().describe("Price"),
    compareAt: z.number().nonnegative().optional().describe("Price before discount"),
    size: field.choice("Size", ["sm", "md", "lg"], "md"),
  }),
  examples: [
    { name: "Regular", props: { amount: 38 } },
    { name: "On sale", props: { amount: 32, compareAt: 40, size: "lg" } },
  ],
  render: function PricePreset(props) {
    return <Price {...props} />;
  },
});
