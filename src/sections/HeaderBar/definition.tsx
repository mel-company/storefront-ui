import { z } from "zod";
import { defineSection } from "../../core/define";
import { field, routeSchema } from "../../core/fields";
import { HeaderBar } from "./HeaderBar";
import { HeaderBarSkeleton } from "../_shared/skeleton/sections";

export const headerBarDefinition = defineSection({
  id: "header.bar",
  name: "Header bar",
  description: "Sticky top bar: store name, menu, search, favourites, live cart count, mobile menu. Four layouts and three bar colours. Once per page, first.",
  tags: ["navigation", "header"],
  uses: [],
  pages: ["any"],
  placement: "header",
  props: z.object({
    layout: field.choice("Layout", ["classic", "centered", "stacked", "minimal"], "classic"),
    barStyle: field.choice("Bar colour", ["plain", "accent", "inverted"], "plain"),
    links: z
      .array(z.object({ label: field.text("Link text", 24), route: routeSchema }))
      .max(6)
      .default([])
      .describe("Menu links. Empty lists the store's categories"),
    announcement: field.optionalText("Announcement strip above the bar", 90),
    showSearch: field.flag("Show search", true),
    showFavourites: field.flag("Show favourites", true),
  }),
  examples: [
    { name: "Classic", props: {}, cart: [{ productId: "p6", quantity: 2 }] },
    { name: "Centered with announcement", props: { layout: "centered", announcement: "Free delivery on orders over $80" } },
    { name: "Stacked, inverted", props: { layout: "stacked", barStyle: "inverted" }, cart: [{ productId: "p2", quantity: 1 }] },
    { name: "Minimal, accent bar", props: { layout: "minimal", barStyle: "accent", showFavourites: false, announcement: "New season, new arrivals" } },
  ],
  skeleton: HeaderBarSkeleton,
  render: function HeaderBarPreset(props) {
    return <HeaderBar {...props} />;
  },
});
