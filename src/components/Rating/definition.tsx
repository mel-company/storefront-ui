import { z } from "zod";
import { defineComponent } from "../../core/define";
import { Rating } from "./Rating";

export const ratingDefinition = defineComponent({
  id: "commerce.rating",
  name: "Rating",
  description: "Five stars with an optional review count.",
  tags: ["commerce", "reviews"],
  props: z.object({
    value: z.number().min(0).max(5).describe("Average rating"),
    count: z.number().int().nonnegative().optional().describe("Number of reviews"),
  }),
  examples: [
    { name: "With count", props: { value: 4.6, count: 214 } },
    { name: "Stars only", props: { value: 3 } },
  ],
  render: function RatingPreset(props) {
    return <Rating {...props} />;
  },
});
