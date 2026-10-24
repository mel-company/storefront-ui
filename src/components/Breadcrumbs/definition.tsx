import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field, routeSchema } from "../../core/fields";
import { Breadcrumbs } from "./Breadcrumbs";

export const breadcrumbsDefinition = defineComponent({
  id: "ui.breadcrumbs",
  name: "Breadcrumbs",
  description: "Links back up from the current page, e.g. Home › Cart › Checkout. The last item is the page you are on.",
  tags: ["navigation"],
  props: z.object({
    items: z
      .array(z.object({ label: field.text("Label", 40), route: routeSchema.optional() }))
      .min(1)
      .max(5)
      .describe("Trail after Home, ending with the current page"),
    showHome: field.flag("Start with Home", true),
  }),
  examples: [
    { name: "Checkout", props: { items: [{ label: "Cart", route: { to: "cart" } }, { label: "Checkout" }] } },
    { name: "Category", props: { items: [{ label: "Shop all", route: { to: "catalogue" } }, { label: "Skincare" }] } },
  ],
  render: function BreadcrumbsPreset(props) {
    return <Breadcrumbs {...props} />;
  },
});
