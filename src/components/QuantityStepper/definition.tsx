import { useState } from "react";
import { z } from "zod";
import { defineComponent } from "../../core/define";
import { QuantityStepper } from "./QuantityStepper";

export const quantityStepperDefinition = defineComponent({
  id: "commerce.quantityStepper",
  name: "Quantity stepper",
  description: "Minus / count / plus control for choosing a quantity.",
  tags: ["commerce", "input"],
  props: z.object({
    initial: z.number().int().min(0).default(1).describe("Starting quantity"),
    min: z.number().int().min(0).default(1),
    max: z.number().int().min(1).default(10),
  }),
  examples: [{ name: "Default", props: {} }, { name: "At the limit", props: { initial: 3, max: 3 } }],
  render: function QuantityStepperPreset({ initial, min, max }) {
    const [value, setValue] = useState(initial);
    return <QuantityStepper value={value} onChange={setValue} min={min} max={max} />;
  },
});
