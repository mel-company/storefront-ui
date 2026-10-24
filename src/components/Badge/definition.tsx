import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { Badge } from "./Badge";

export const badgeDefinition = defineComponent({
  id: "ui.badge",
  name: "Badge",
  description: "A short label: New, Sale, Low stock. One or two words.",
  tags: ["label", "status"],
  props: z.object({
    text: field.text("Badge text", 24),
    tone: field.choice("Tone", ["neutral", "accent", "success", "warning", "danger"], "neutral"),
  }),
  examples: [
    { name: "Neutral", props: { text: "New in" } },
    { name: "Accent", props: { text: "Bestseller", tone: "accent" } },
    { name: "Danger", props: { text: "Sale", tone: "danger" } },
  ],
  render: function BadgePreset({ text, tone }) {
    return <Badge tone={tone}>{text}</Badge>;
  },
});
