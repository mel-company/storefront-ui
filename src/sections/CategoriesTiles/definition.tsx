import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { columnsField, headingFields, toneField } from "../_shared/shared-props";
import { CategoriesTiles } from "./CategoriesTiles";

export const categoriesTilesDefinition = defineSection({
  id: "categories.tiles",
  name: "Category tiles",
  description: "Tiles linking to the store's real categories. Image, circle or label style.",
  tags: ["category", "navigation"],
  uses: ["ui.sectionHeading", "category.tile"],
  pages: ["home", "catalogue"],
  props: z.object({
    ...headingFields,
    categoryIds: z.array(z.string()).max(12).default([]).describe("Categories to show, in order. Empty = all"),
    variant: field.choice("Tile style", ["image", "circle", "label"], "image"),
    columns: columnsField(4),
    tone: toneField,
  }),
  examples: [
    { name: "Image tiles", props: { title: "Shop by category" } },
    { name: "Circles", props: { title: "Browse", variant: "circle", columns: 4, tone: "muted" } },
    { name: "Labels", props: { title: "Jump to", variant: "label", categoryIds: ["skin", "home"], columns: 2 } },
  ],
  render: function CategoriesTilesPreset(props) {
    return <CategoriesTiles {...props} />;
  },
});
