import { useState } from "react";
import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field, iconSchema } from "../../core/fields";
import { RadioCards } from "./RadioCards";

export const radioCardsDefinition = defineComponent({
  id: "form.radioCards",
  name: "Radio cards",
  description: "Pick one of a few choices shown as cards with a line of detail, like payment or delivery methods.",
  tags: ["form", "input", "checkout"],
  props: z.object({
    legend: field.text("Question", 40),
    options: z
      .array(
        z.object({
          value: field.text("Value sent with the form", 40),
          label: field.text("Label", 40),
          description: field.optionalText("Detail", 100),
          icon: iconSchema.optional(),
        }),
      )
      .min(2)
      .max(6)
      .describe("Choices"),
    layout: field.choice("Layout", ["list", "grid"] as const, "list"),
  }),
  examples: [
    {
      name: "Payment",
      props: {
        legend: "Payment",
        options: [
          { value: "cash", label: "Cash on delivery", description: "Pay when your order arrives.", icon: "cash" },
          { value: "card", label: "Card", description: "Visa or Mastercard, paid online.", icon: "card" },
        ],
      },
    },
    {
      name: "Side by side",
      props: {
        legend: "Delivery",
        layout: "grid",
        options: [
          { value: "standard", label: "Standard", description: "Two to four working days.", icon: "truck" },
          { value: "express", label: "Express", description: "Next working day.", icon: "clock" },
        ],
      },
    },
  ],
  render: function RadioCardsPreset({ legend, options, layout }) {
    const [value, setValue] = useState(options[0]?.value ?? "");
    return <RadioCards legend={legend} options={options} layout={layout} value={value} onChange={setValue} />;
  },
});
