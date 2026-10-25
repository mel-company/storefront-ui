import { z } from "zod";
import { defineSection } from "../../core/define";
import { actionSchema, field } from "../../core/fields";
import { toneField } from "../_shared/shared-props";
import { HeroStatement } from "./HeroStatement";
import { HeroStatementSkeleton } from "../_shared/skeleton/sections";

export const heroStatementDefinition = defineSection({
  id: "hero.statement",
  name: "Hero, statement",
  description: "Page opener without an image: a very large headline, a line and actions. Holds the page's h1.",
  tags: ["hero", "opener", "typography"],
  uses: ["ui.button"],
  pages: ["home"],
  props: z.object({
    eyebrow: field.optionalText("Small text above the title", 40),
    title: field.text("Headline", 70),
    subtitle: field.optionalText("Supporting line", 220),
    primaryAction: actionSchema.optional(),
    secondaryAction: actionSchema.optional(),
    align: field.choice("Alignment", ["start", "center"], "start"),
    size: field.choice("Headline size", ["large", "huge"], "large"),
    rule: field.flag("Accent line under the title", false),
    tone: toneField,
  }),
  examples: [
    {
      name: "Large",
      props: {
        eyebrow: "Since 2019",
        title: "Everyday things, made to last a lifetime",
        subtitle: "Simple goods from small workshops. Delivered in two days.",
        primaryAction: { label: "Shop now", route: { to: "catalogue" } },
        secondaryAction: { label: "Bestsellers", route: { to: "catalogue", query: { tag: "bestseller" } } },
        rule: true,
      },
    },
    {
      name: "Huge, centered, muted",
      props: {
        title: "Less, but better",
        align: "center",
        size: "huge",
        tone: "muted",
        primaryAction: { label: "Discover", route: { to: "catalogue" } },
      },
    },
  ],
  skeleton: HeroStatementSkeleton,
  render: function HeroStatementPreset(props) {
    return <HeroStatement {...props} />;
  },
});
