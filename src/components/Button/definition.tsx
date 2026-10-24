import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field, iconSchema, routeSchema } from "../../core/fields";
import { ButtonLink } from "./Button";

const props = z.object({
  label: field.text("Button label", 32),
  route: routeSchema,
  variant: field.choice("Style", ["primary", "secondary", "ghost"], "primary"),
  size: field.choice("Size", ["sm", "md", "lg"], "md"),
  icon: iconSchema.optional().describe("Icon before the label"),
  iconEnd: iconSchema.optional().describe("Icon after the label"),
  fullWidth: field.flag("Full width", false),
});

export const buttonDefinition = defineComponent({
  id: "ui.button",
  name: "Button",
  description: "A call to action that links somewhere in the store. Use primary for the one main action per section.",
  tags: ["action", "link"],
  props,
  examples: [
    { name: "Primary", props: { label: "Shop the collection", route: { to: "catalogue" } } },
    { name: "Secondary with icon", props: { label: "View cart", route: { to: "cart" }, variant: "secondary", icon: "cart" } },
    { name: "Large with arrow", props: { label: "Explore", route: { to: "catalogue" }, size: "lg", iconEnd: "chevronEnd" } },
  ],
  render: function ButtonPreset({ label, ...rest }) {
    return <ButtonLink {...rest}>{label}</ButtonLink>;
  },
});
