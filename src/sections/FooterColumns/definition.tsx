import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { FooterColumns } from "./FooterColumns";

export const footerColumnsDefinition = defineSection({
  id: "footer.columns",
  name: "Footer",
  description: "Store name, about text, categories, help links, contact and social, all from store settings. Once per page, last.",
  tags: ["navigation", "footer"],
  uses: [],
  pages: ["any"],
  placement: "footer",
  props: z.object({
    about: field.optionalText("About the store", 200),
    legal: field.optionalText("Line after the copyright. Leave out for the built-in text in the store's language", 80),
  }),
  examples: [{ name: "Default", props: { about: "Small-batch skincare, scent and home goods." } }],
  render: function FooterColumnsPreset(props) {
    return <FooterColumns {...props} />;
  },
});
