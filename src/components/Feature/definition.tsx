import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field, iconSchema } from "../../core/fields";
import { Feature } from "./Feature";

export const featureSchema = z.object({
  icon: iconSchema,
  title: field.text("Title", 40),
  text: field.optionalText("Short text", 120),
});

export const featureDefinition = defineComponent({
  id: "ui.feature",
  name: "Feature",
  description: "An icon with a short promise: free delivery, easy returns, secure payment.",
  tags: ["trust", "text"],
  props: featureSchema.extend({ layout: field.choice("Layout", ["inline", "stacked"], "inline") }),
  examples: [
    { name: "Inline", props: { icon: "truck", title: "Free delivery", text: "On orders over $80" } },
    { name: "Stacked", props: { icon: "refresh", title: "30-day returns", layout: "stacked" } },
  ],
  render: function FeaturePreset(props) {
    return <Feature {...props} />;
  },
});
