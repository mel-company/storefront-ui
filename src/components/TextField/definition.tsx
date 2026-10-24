import { useState } from "react";
import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { TextField } from "./TextField";

export const textFieldDefinition = defineComponent({
  id: "form.textField",
  name: "Text field",
  description: "Labelled text, phone or email input with a hint and an error message. Used by the checkout form.",
  tags: ["form", "input", "checkout"],
  props: z.object({
    label: field.text("Label", 40),
    type: field.choice("Kind of value", ["text", "tel", "email"] as const, "text"),
    multiline: field.flag("Several lines", false),
    required: field.flag("Required", true),
    hint: field.optionalText("Hint under the label", 120),
    error: field.optionalText("Error message", 120),
  }),
  examples: [
    { name: "Default", props: { label: "Full name" } },
    { name: "Phone with hint", props: { label: "Phone number", type: "tel", hint: "We call to confirm delivery" } },
    { name: "Error", props: { label: "Email", type: "email", error: "Enter an email like name@example.com" } },
    { name: "Notes", props: { label: "Notes for the order", multiline: true, required: false } },
  ],
  render: function TextFieldPreset(props) {
    const [value, setValue] = useState("");
    return <TextField {...props} value={value} onChange={setValue} />;
  },
});
