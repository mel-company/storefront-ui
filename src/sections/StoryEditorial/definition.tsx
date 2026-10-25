import { z } from "zod";
import { defineSection } from "../../core/define";
import { actionSchema, field } from "../../core/fields";
import { demoBanners } from "../../demo";
import { toneField } from "../_shared/shared-props";
import { StoryEditorial } from "./StoryEditorial";
import { StoryEditorialSkeleton } from "../_shared/skeleton/sections";

export const storyEditorialDefinition = defineSection({
  id: "story.editorial",
  name: "Brand story",
  description: "Tells the brand's story: image beside text, or one large quote. Gives a store its own voice.",
  tags: ["editorial", "brand", "text"],
  uses: ["ui.media", "ui.button"],
  pages: ["home"],
  props: z.object({
    layout: field.choice("Layout", ["imageStart", "imageEnd", "overlap", "centered", "quote"], "imageStart"),
    eyebrow: field.optionalText("Small text above the title", 40),
    title: field.text("Title", 80),
    body: z.array(field.longText("Paragraph", 500)).min(1).max(3),
    image: field.image("Image").optional(),
    imageAlt: z.string().max(140).default("").describe("What the image shows"),
    action: actionSchema.optional(),
    tone: toneField,
  }),
  examples: [
    {
      name: "Image and text",
      props: {
        eyebrow: "Our story",
        title: "Started in a kitchen, still made by hand",
        body: ["We mix every batch ourselves, in small runs, so nothing sits on a shelf for months.", "Every ingredient is on the label. If you cannot read it, we do not use it."],
        image: demoBanners.green,
        imageAlt: "Candles and jars on a table",
        action: { label: "Read more", route: { to: "url", href: "https://example.com/about" } },
      },
    },
    {
      name: "Overlap",
      props: {
        layout: "overlap",
        eyebrow: "Our story",
        title: "Started in a kitchen, still made by hand",
        body: ["We mix every batch ourselves, in small runs, so nothing sits on a shelf for months."],
        image: demoBanners.warm,
        imageAlt: "",
        action: { label: "Read more", route: { to: "url", href: "https://example.com/about" } },
        tone: "muted",
      },
    },
    {
      name: "Centered",
      props: {
        layout: "centered",
        eyebrow: "Our story",
        title: "Started in a kitchen, still made by hand",
        body: ["We mix every batch ourselves, in small runs, so nothing sits on a shelf for months."],
        image: demoBanners.cool,
        imageAlt: "",
      },
    },
    { name: "Quote", props: { layout: "quote", title: "What we believe", body: ["Fewer, better things, made slowly and meant to be used up."], tone: "muted" } },
  ],
  skeleton: StoryEditorialSkeleton,
  render: function StoryEditorialPreset(props) {
    return <StoryEditorial {...props} />;
  },
});
