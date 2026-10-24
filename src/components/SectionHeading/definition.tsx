import { z } from "zod";
import { defineComponent } from "../../core/define";
import { actionSchema, field } from "../../core/fields";
import { ButtonLink } from "../Button/Button";
import { SectionHeading } from "./SectionHeading";

export const sectionHeadingDefinition = defineComponent({
  id: "ui.sectionHeading",
  name: "Section heading",
  description: "Title block at the top of a section: optional eyebrow, title, subtitle and one link.",
  tags: ["text", "heading"],
  props: z.object({
    eyebrow: field.optionalText("Small text above the title", 40),
    title: field.text("Title", 80),
    subtitle: field.optionalText("Subtitle", 200),
    align: field.choice("Alignment", ["start", "center"], "start"),
    action: actionSchema.optional(),
  }),
  examples: [
    { name: "With link", props: { eyebrow: "This week", title: "Bestsellers", action: { label: "See all", route: { to: "catalogue" } } } },
    { name: "Centered", props: { title: "Made in small batches", subtitle: "Every product is mixed and poured by hand.", align: "center" } },
  ],
  render: function SectionHeadingPreset({ action, ...rest }) {
    return (
      <SectionHeading
        {...rest}
        action={
          action && (
            <ButtonLink route={action.route} variant="ghost" size="sm" iconEnd="chevronEnd">
              {action.label}
            </ButtonLink>
          )
        }
      />
    );
  },
});
