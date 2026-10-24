import { z } from "zod";
import { defineSection } from "../../core/define";
import { field, iconSchema } from "../../core/fields";
import { toneField } from "../_shared/shared-props";
import { NotFound } from "./NotFound";

export const notFoundDefinition = defineSection({
  id: "error.notFound",
  name: "Page not found",
  description: "For a broken or old link: a plain message with buttons to the home page and to every product.",
  tags: ["error", "navigation"],
  uses: ["ui.emptyState", "ui.button"],
  pages: ["notFound"],
  props: z.object({
    icon: iconSchema.default("search"),
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 80),
    text: field.optionalText("Text. Leave out for the built-in text in the store's language", 200),
    showShopAll: field.flag("Also link to every product", true),
    tone: toneField,
  }),
  examples: [
    { name: "Default", props: {} },
    { name: "Own words", props: { icon: "leaf", title: "This page has moved on", text: "Try the shop instead.", showShopAll: false, tone: "muted" } },
  ],
  render: function NotFoundPreset(props) {
    return <NotFound {...props} />;
  },
});
