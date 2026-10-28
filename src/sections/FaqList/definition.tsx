import { z } from "zod";
import { accordionItemsSchema } from "../../components/Accordion/definition";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { headingFields, toneField } from "../_shared/shared-props";
import { FaqList } from "./FaqList";
import { FaqListSkeleton } from "./skeleton";

export const faqListDefinition = defineSection({
  id: "faq.list",
  name: "FAQ",
  description: "Heading beside a list of questions that open to their answers.",
  tags: ["faq", "text", "support"],
  uses: ["ui.sectionHeading", "ui.accordion"],
  pages: ["home", "product", "cart", "tracking"],
  props: z.object({
    ...headingFields,
    items: accordionItemsSchema,
    layout: field.choice("Layout", ["split", "stacked", "columns"], "split"),
    tone: toneField,
  }),
  examples: [
    {
      name: "Delivery and returns",
      props: {
        eyebrow: "Help",
        title: "Questions, answered",
        items: [
          { question: "How long does delivery take?", answer: "Two to four working days in the city, up to a week elsewhere." },
          { question: "Do you deliver everywhere?", answer: "Yes, to every city in the country." },
          { question: "Can I pay on delivery?", answer: "Yes, cash or card when your order arrives." },
        ],
      },
    },
    {
      name: "Stacked",
      props: {
        title: "Questions, answered",
        layout: "stacked",
        tone: "muted",
        items: [
          { question: "How long does delivery take?", answer: "Two to four working days in the city, up to a week elsewhere." },
          { question: "Do you deliver everywhere?", answer: "Yes, to every city in the country." },
          { question: "Can I pay on delivery?", answer: "Yes, cash or card when your order arrives." },
        ],
      },
    },
    {
      name: "Two columns",
      props: {
        eyebrow: "Help",
        title: "Questions, answered",
        layout: "columns",
        items: [
          { question: "How long does delivery take?", answer: "Two to four working days in the city, up to a week elsewhere." },
          { question: "Do you deliver everywhere?", answer: "Yes, to every city in the country." },
          { question: "Can I pay on delivery?", answer: "Yes, cash or card when your order arrives." },
          { question: "Can I return an item?", answer: "Yes, within 30 days, unused and in its box." },
        ],
      },
    },
  ],
  skeleton: FaqListSkeleton,
  render: function FaqListPreset(props) {
    return <FaqList {...props} />;
  },
});
