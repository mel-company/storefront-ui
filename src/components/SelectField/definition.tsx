import { useState } from "react";
import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { SelectField } from "./SelectField";

export const selectFieldDefinition = defineComponent({
  id: "form.select",
  name: "Select field",
  description: "Labelled dropdown that uses the phone's own picker. The checkout uses it for the city list.",
  tags: ["form", "input", "checkout"],
  props: z.object({
    label: field.text("Label", 40),
    options: z.array(field.text("Option", 60)).min(1).max(60).describe("Choices"),
    placeholder: field.optionalText("Empty first choice", 40),
    required: field.flag("Required", true),
    error: field.optionalText("Error message", 120),
  }),
  examples: [
    { name: "City", props: { label: "City", placeholder: "Choose a city", options: ["Northbridge", "Riverside", "Old Town", "Harbour"] } },
    { name: "Error", props: { label: "City", placeholder: "Choose a city", options: ["Northbridge", "Riverside"], error: "This field is required" } },
  ],
  render: function SelectFieldPreset(props) {
    const [value, setValue] = useState("");
    return <SelectField {...props} value={value} onChange={setValue} />;
  },
});
