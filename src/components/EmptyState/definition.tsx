import { z } from "zod";
import { defineComponent } from "../../core/define";
import { actionSchema, field, iconSchema } from "../../core/fields";
import { ButtonLink } from "../Button/Button";
import { EmptyState } from "./EmptyState";

export const emptyStateDefinition = defineComponent({
  id: "ui.emptyState",
  name: "Empty state",
  description: "Icon, heading, a line of text and a way forward, for an empty list, a placed order or a missing page.",
  tags: ["feedback", "empty"],
  props: z.object({
    icon: iconSchema.default("bag"),
    title: field.text("Heading", 80),
    text: field.optionalText("Text", 200),
    detail: field.optionalText("Highlighted line, e.g. an order number", 40),
    tone: field.choice("Tone", ["neutral", "success"] as const, "neutral"),
    action: actionSchema.optional(),
  }),
  examples: [
    { name: "No favourites", props: { icon: "heart", title: "No favourites yet", text: "Tap the heart on any product to keep it here.", action: { label: "Start shopping", route: { to: "catalogue" } } } },
    { name: "Order placed", props: { icon: "check", tone: "success", title: "Thank you, your order is in", detail: "Order number 1042", text: "We will contact you soon to confirm delivery." } },
  ],
  render: function EmptyStatePreset({ action, ...props }) {
    return <EmptyState {...props} actions={action && <ButtonLink route={action.route}>{action.label}</ButtonLink>} />;
  },
});
