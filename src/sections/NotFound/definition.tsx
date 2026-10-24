import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { NotFound } from "./NotFound";

export const notFoundDefinition = defineSection({
  id: "error.notFound",
  name: "Page not found",
  description: "For a broken or old link: a plain message with buttons to the home page and to every product.",
  tags: ["error", "navigation"],
  uses: ["ui.emptyState", "ui.button"],
  pages: ["notFound"],
  props: z.object({
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 80),
    text: field.optionalText("Text. Leave out for the built-in text in the store's language", 200),
  }),
  examples: [{ name: "Default", props: {} }],
  render: function NotFoundPreset(props) {
    return <NotFound {...props} />;
  },
});
