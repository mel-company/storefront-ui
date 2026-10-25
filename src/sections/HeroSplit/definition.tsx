import { z } from "zod";
import { defineSection } from "../../core/define";
import { actionSchema, field, iconSchema } from "../../core/fields";
import { demoBanners } from "../../demo";
import { toneField } from "../_shared/shared-props";
import { HeroSplit } from "./HeroSplit";
import { HeroSplitSkeleton } from "../_shared/skeleton/sections";

export const heroSplitDefinition = defineSection({
  id: "hero.split",
  name: "Hero, split",
  description: "Page opener: big headline and actions on one side, an image on the other. Holds the page's h1.",
  tags: ["hero", "opener"],
  uses: ["ui.button", "ui.media"],
  pages: ["home"],
  props: z.object({
    eyebrow: field.optionalText("Small text above the title", 40),
    title: field.text("Headline", 90),
    subtitle: field.optionalText("Supporting line", 220),
    primaryAction: actionSchema.optional(),
    secondaryAction: actionSchema.optional(),
    image: field.image("Image"),
    imageAlt: z.string().max(140).describe("What the image shows. Empty if decorative"),
    imageSide: field.choice("Image side", ["start", "end"], "end"),
    imageRatio: field.choice("Image shape", ["square", "portrait", "landscape"], "portrait"),
    imageStyle: field.choice("Image style", ["plain", "framed", "collage"], "plain"),
    moreImages: z.array(field.image("Extra image")).max(2).default([]).describe("Two smaller images for the collage"),
    points: z.array(z.object({ icon: iconSchema, text: field.text("Point", 40) })).max(3).default([]),
    tone: toneField,
  }),
  examples: [
    {
      name: "Default",
      props: {
        eyebrow: "New season",
        title: "Skincare that feels like nothing at all",
        subtitle: "Light formulas, made in small batches with ingredients you can read.",
        primaryAction: { label: "Shop now", route: { to: "catalogue" } },
        secondaryAction: { label: "Bestsellers", route: { to: "catalogue", query: { tag: "bestseller" } } },
        image: demoBanners.warm,
        imageAlt: "Jars of cream on a warm background",
        points: [
          { icon: "truck", text: "Free delivery over $80" },
          { icon: "leaf", text: "Vegan formulas" },
        ],
      },
    },
    {
      name: "Image first, muted",
      props: {
        title: "The home edit",
        image: demoBanners.green,
        imageAlt: "",
        imageSide: "start",
        imageRatio: "square",
        tone: "muted",
        primaryAction: { label: "Shop home", route: { to: "category", slug: "home" } },
      },
    },
    {
      name: "Framed",
      props: {
        eyebrow: "Gift guide",
        title: "Gifts they will actually use",
        subtitle: "Picked by our team, wrapped for free.",
        primaryAction: { label: "Shop gifts", route: { to: "catalogue" } },
        image: demoBanners.cool,
        imageAlt: "",
        imageStyle: "framed",
        imageRatio: "square",
      },
    },
    {
      name: "Collage",
      props: {
        title: "Fresh picks for the week",
        subtitle: "New arrivals in skincare, scents and home.",
        primaryAction: { label: "Shop new", route: { to: "catalogue", query: { tag: "new" } } },
        image: demoBanners.warm,
        imageAlt: "",
        imageStyle: "collage",
        moreImages: [demoBanners.green, demoBanners.cool],
      },
    },
  ],
  skeleton: HeroSplitSkeleton,
  render: function HeroSplitPreset(props) {
    return <HeroSplit {...props} />;
  },
});
