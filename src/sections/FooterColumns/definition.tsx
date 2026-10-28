import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { FooterColumns } from "./FooterColumns";
import { FooterColumnsSkeleton } from "./skeleton";

export const footerColumnsDefinition = defineSection({
  id: "footer.columns",
  name: "Footer",
  description: "Store name, about text, categories, help links, contact and social, all from store settings. Columns, centered or one slim row. Once per page, last.",
  tags: ["navigation", "footer"],
  uses: [],
  pages: ["any"],
  placement: "footer",
  props: z.object({
    about: field.optionalText("About the store", 200),
    legal: field.optionalText("Line after the copyright. Leave out for the built-in text in the store's language", 80),
    layout: field.choice("Layout", ["columns", "centered", "minimal"], "columns"),
    tone: field.choice("Background", ["muted", "plain", "inverted"], "muted"),
    bigName: field.flag("Store name very large at the bottom", false),
  }),
  examples: [
    { name: "Default", props: { about: "Small-batch skincare, scent and home goods." } },
    { name: "Inverted, big name", props: { about: "Small-batch skincare, scent and home goods.", tone: "inverted", bigName: true } },
    { name: "Centered", props: { layout: "centered", about: "Small-batch skincare, scent and home goods.", tone: "plain" } },
    { name: "Minimal", props: { layout: "minimal", tone: "plain" } },
  ],
  skeleton: FooterColumnsSkeleton,
  render: function FooterColumnsPreset(props) {
    return <FooterColumns {...props} />;
  },
});
