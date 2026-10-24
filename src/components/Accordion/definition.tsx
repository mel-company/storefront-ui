import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { Accordion } from "./Accordion";

export const accordionItemsSchema = z
  .array(z.object({ question: field.text("Question", 120), answer: field.longText("Answer", 600) }))
  .min(1)
  .max(12);

export const accordionDefinition = defineComponent({
  id: "ui.accordion",
  name: "Accordion",
  description: "Questions that open to show their answer. Use for FAQs, delivery and care details.",
  tags: ["text", "faq", "interactive"],
  props: z.object({
    items: accordionItemsSchema,
    single: field.flag("Only one open at a time", true),
    openFirst: field.flag("First item open", false),
  }),
  examples: [
    {
      name: "FAQ",
      props: {
        openFirst: true,
        items: [
          { question: "How long does delivery take?", answer: "Two to four working days in the city, up to a week elsewhere." },
          { question: "Can I return an item?", answer: "Yes, within 30 days if it is unopened." },
        ],
      },
    },
  ],
  render: function AccordionPreset(props) {
    return <Accordion {...props} />;
  },
});
