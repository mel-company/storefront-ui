import { z } from "zod";
import { defineSection } from "../../core/define";
import { field, routeSchema } from "../../core/fields";
import { HeaderBar } from "./HeaderBar";

export const headerBarDefinition = defineSection({
  id: "header.bar",
  name: "Header bar",
  description: "Sticky top bar: store name, menu, search, favourites, live cart count, mobile menu. Once per page, first.",
  tags: ["navigation", "header"],
  uses: [],
  pages: ["any"],
  placement: "header",
  props: z.object({
    layout: field.choice("Layout", ["classic", "centered"], "classic"),
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
  ],
  render: function HeaderBarPreset(props) {
    return <HeaderBar {...props} />;
  },
});
