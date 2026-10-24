import { useState } from "react";
import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { OptionPicker } from "./OptionPicker";

export const optionPickerDefinition = defineComponent({
  id: "product.optionPicker",
  name: "Option picker",
  description: "Chips for choosing a product option such as size or colour.",
  tags: ["product", "input", "variants"],
  props: z.object({
    name: field.text("Option name", 24),
    values: z.array(field.text("Value", 24)).min(1).max(12),
  }),
  examples: [{ name: "Sizes", props: { name: "Size", values: ["S", "M", "L", "XL"] } }],
  render: function OptionPickerPreset({ name, values }) {
    const [value, setValue] = useState<string>();
    return <OptionPicker option={{ id: "option", name, values }} value={value} onChange={setValue} />;
  },
});
