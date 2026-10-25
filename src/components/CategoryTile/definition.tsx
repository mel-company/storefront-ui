import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { CategoryTile } from "./CategoryTile";

export const categoryTileDefinition = defineComponent({
  id: "category.tile",
  name: "Category tile",
  description: "Links to one real category. Image, circle, text label, wide banner or small pill style.",
  tags: ["commerce", "category", "navigation"],
  props: z.object({
    categoryId: z.string().min(1).describe("Category id or slug"),
    variant: field.choice("Style", ["image", "circle", "label", "banner", "pill"], "image"),
    ratio: field.choice("Image shape", ["square", "portrait", "landscape"], "portrait"),
  }),
  examples: [
    { name: "Image", props: { categoryId: "skin" } },
    { name: "Circle", props: { categoryId: "scent", variant: "circle" } },
    { name: "Label", props: { categoryId: "home", variant: "label" } },
    { name: "Banner", props: { categoryId: "carry", variant: "banner" } },
    { name: "Pill", props: { categoryId: "skin", variant: "pill" } },
  ],
  render: function CategoryTilePreset(props) {
    return (
      <div style={{ maxInlineSize: 240 }}>
        <CategoryTile {...props} />
      </div>
    );
  },
});
