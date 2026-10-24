import { z } from "zod";
import { accordionItemsSchema } from "../../components/Accordion/definition";
import { defineSection } from "../../core/define";
import { headingFields, toneField } from "../_shared/shared-props";
import { FaqList } from "./FaqList";
import { FaqListSkeleton } from "../_shared/skeleton/sections";

export const faqListDefinition = defineSection({
  id: "faq.list",
  name: "FAQ",
  description: "Heading beside a list of questions that open to their answers.",
  tags: ["faq", "text", "support"],
  uses: ["ui.sectionHeading", "ui.accordion"],
  pages: ["home", "product", "cart", "tracking"],
  props: z.object({ ...headingFields, items: accordionItemsSchema, tone: toneField }),
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
  ],
  skeleton: FaqListSkeleton,
  render: function FaqListPreset(props) {
    return <FaqList {...props} />;
  },
});
