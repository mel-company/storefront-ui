import { z } from "zod";
import { PREVIEW_NOW } from "../../components/Countdown/definition";
import { defineSection } from "../../core/define";
import { actionSchema, field } from "../../core/fields";
import { demoBanners } from "../../demo";
import { HeroBanner } from "./HeroBanner";
import { HeroBannerSkeleton } from "../_shared/skeleton/sections";

export const heroBannerDefinition = defineSection({
  id: "hero.banner",
  name: "Hero, banner",
  description: "Page opener over a full-width image, copy on a solid panel or a shade, optional offer countdown. Holds the page's h1.",
  tags: ["hero", "opener", "campaign"],
  uses: ["ui.button", "ui.countdown"],
  pages: ["home"],
  props: z.object({
    title: field.text("Headline", 90),
    subtitle: field.optionalText("Supporting line", 200),
    action: actionSchema.optional(),
    image: field.image("Background image"),
    imageAlt: z.string().max(140).describe("What the image shows. Empty if decorative"),
    align: field.choice("Copy position", ["start", "center", "end"], "start"),
    height: field.choice("Height", ["compact", "tall", "full"], "tall"),
    copyStyle: field.choice("Copy style", ["panel", "shade"], "panel"),
    phoneLayout: field.choice("On phones", ["over", "below"], "over"),
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
    {
      name: "Full screen, shade",
      props: {
        title: "Made slowly, by hand",
        subtitle: "Small-batch candles and oils, poured every Thursday.",
        image: demoBanners.green,
        imageAlt: "",
        height: "full",
        copyStyle: "shade",
        action: { label: "Shop the collection", route: { to: "catalogue" } },
      },
    },
    {
      name: "Compact, end, copy below on phones",
      props: {
        title: "New in: the travel edit",
        image: demoBanners.cool,
        imageAlt: "",
        height: "compact",
        align: "end",
        phoneLayout: "below",
        action: { label: "See what's new", route: { to: "catalogue", query: { tag: "new" } } },
      },
    },
  ],
  skeleton: HeroBannerSkeleton,
  render: function HeroBannerPreset(props) {
    return <HeroBanner {...props} now={PREVIEW_NOW} />;
  },
});
