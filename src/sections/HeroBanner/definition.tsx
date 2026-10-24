import { z } from "zod";
import { PREVIEW_NOW } from "../../components/Countdown/definition";
import { defineSection } from "../../core/define";
import { actionSchema, field } from "../../core/fields";
import { demoBanners } from "../../demo";
import { HeroBanner } from "./HeroBanner";

export const heroBannerDefinition = defineSection({
  id: "hero.banner",
  name: "Hero, banner",
  description: "Page opener over a full-width image, copy on a solid panel, optional offer countdown. Holds the page's h1.",
  tags: ["hero", "opener", "campaign"],
  uses: ["ui.button", "ui.countdown"],
  pages: ["home"],
  props: z.object({
    title: field.text("Headline", 90),
    subtitle: field.optionalText("Supporting line", 200),
    action: actionSchema.optional(),
    image: field.image("Background image"),
    imageAlt: z.string().max(140).describe("What the image shows. Empty if decorative"),
    align: field.choice("Panel position", ["start", "center"], "start"),
    endsAt: field.dateTime("Offer ends at (shows a countdown)").optional(),
  }),
  examples: [
    {
      name: "Campaign with countdown",
      props: {
        title: "Autumn sale, up to 30% off",
        subtitle: "Ends Sunday at midnight.",
        action: { label: "Shop the sale", route: { to: "catalogue" } },
        image: demoBanners.cool,
        imageAlt: "",
        endsAt: "2026-10-26T23:59:00+03:00",
      },
    },
    {
      name: "Centered",
      props: { title: "Scents for slow evenings", image: demoBanners.warm, imageAlt: "", align: "center", action: { label: "Discover", route: { to: "category", slug: "fragrance" } } },
    },
  ],
  render: function HeroBannerPreset(props) {
    return <HeroBanner {...props} now={PREVIEW_NOW} />;
  },
});
