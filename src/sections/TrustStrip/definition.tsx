import { z } from "zod";
import { featureSchema } from "../../components/Feature/definition";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { toneField } from "../_shared/shared-props";
import { TrustStrip } from "./TrustStrip";
import { TrustStripSkeleton } from "../_shared/skeleton/sections";

export const trustStripDefinition = defineSection({
  id: "trust.strip",
  name: "Trust strip",
  description: "Two to four short promises with icons: delivery, returns, payment, support.",
  tags: ["trust", "conversion"],
  uses: ["ui.feature"],
  pages: ["any"],
  props: z.object({
    items: z.array(featureSchema).min(2).max(4),
    layout: field.choice("Layout", ["inline", "stacked"], "inline"),
    look: field.choice("Look", ["plain", "cards", "divided", "ticker"], "plain"),
    tone: toneField.default("muted"),
  }),
  examples: [
    {
      name: "Three promises",
      props: {
        items: [
          { icon: "truck", title: "Free delivery", text: "On orders over $80" },
          { icon: "refresh", title: "30-day returns", text: "No questions asked" },
          { icon: "shield", title: "Secure payment", text: "Cards and cash on delivery" },
        ],
      },
    },
    {
      name: "Stacked, four",
      props: {
        layout: "stacked",
        tone: "default",
        items: [
          { icon: "leaf", title: "Vegan" },
          { icon: "sparkle", title: "Clean formulas" },
          { icon: "gift", title: "Gift wrapping" },
          { icon: "chat", title: "Real support" },
        ],
      },
    },
    {
      name: "Cards",
      props: {
        look: "cards",
        tone: "default",
        items: [
          { icon: "truck", title: "Free delivery", text: "On orders over $80" },
          { icon: "refresh", title: "30-day returns", text: "No questions asked" },
          { icon: "shield", title: "Secure payment", text: "Cards and cash on delivery" },
        ],
      },
    },
    {
      name: "Divided",
      props: {
        look: "divided",
        items: [
          { icon: "truck", title: "Free delivery", text: "On orders over $80" },
          { icon: "refresh", title: "30-day returns", text: "No questions asked" },
          { icon: "shield", title: "Secure payment", text: "Cards and cash on delivery" },
        ],
      },
    },
    {
      name: "Ticker",
      props: {
        look: "ticker",
        items: [
          { icon: "truck", title: "Free delivery over $80" },
          { icon: "refresh", title: "30-day returns" },
          { icon: "leaf", title: "Vegan formulas" },
          { icon: "gift", title: "Gift wrapping" },
        ],
      },
    },
  ],
  skeleton: TrustStripSkeleton,
  render: function TrustStripPreset(props) {
    return <TrustStrip {...props} />;
  },
});
