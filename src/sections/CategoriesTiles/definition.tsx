import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { columnsField, headingFields, toneField } from "../_shared/shared-props";
import { CategoriesTiles } from "./CategoriesTiles";
import { CategoriesTilesSkeleton } from "./skeleton";

export const categoriesTilesDefinition = defineSection({
  id: "categories.tiles",
  name: "Category tiles",
  description: "Tiles linking to the store's real categories. Image, circle, label, banner or pill style, in a grid, a mosaic or a swipe row.",
  tags: ["category", "navigation"],
  uses: ["ui.sectionHeading", "category.tile"],
  pages: ["home", "catalogue"],
  props: z.object({
    ...headingFields,
    categoryIds: z.array(z.string()).max(12).default([]).describe("Categories to show, in order. Empty = all"),
    variant: field.choice("Tile style", ["image", "circle", "label", "banner", "pill"], "image"),
    layout: field.choice("Layout", ["grid", "mosaic", "scroll"], "grid"),
    columns: columnsField(4),
    tone: toneField,
  }),
  examples: [
    { name: "Image tiles", props: { title: "Shop by category" } },
    { name: "Circles", props: { title: "Browse", variant: "circle", columns: 4, tone: "muted" } },
    { name: "Labels", props: { title: "Jump to", variant: "label", categoryIds: ["skin", "home"], columns: 2 } },
    { name: "Mosaic", props: { title: "Shop by category", layout: "mosaic" } },
    { name: "Wide banners", props: { title: "Collections", variant: "banner", columns: 2 } },
    { name: "Pills", props: { title: "Popular right now", variant: "pill" } },
    { name: "Circles, swipe row", props: { title: "Browse", variant: "circle", layout: "scroll", columns: 5 } },
  ],
  skeleton: CategoriesTilesSkeleton,
  render: function CategoriesTilesPreset(props) {
    return <CategoriesTiles {...props} />;
  },
});
