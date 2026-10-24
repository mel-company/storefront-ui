import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { Skeleton } from "./Skeleton";

export const skeletonDefinition = defineComponent({
  id: "ui.skeleton",
  name: "Skeleton",
  description: "A placeholder shape while content loads: text lines, a heading, an image block, a circle or a button pill.",
  tags: ["loading", "placeholder"],
  props: z.object({
    shape: field.choice("Shape", ["text", "heading", "block", "circle", "pill"], "text"),
    lines: field.count("Lines of text", 1, 8, 1),
    ratio: field.choice("Block shape", ["square", "portrait", "landscape", "wide", "tall"], "landscape"),
  }),
  examples: [
    { name: "Paragraph", props: { shape: "text", lines: 3 } },
    { name: "Image", props: { shape: "block", ratio: "portrait" } },
    { name: "Avatar", props: { shape: "circle" } },
    { name: "Button", props: { shape: "pill" } },
  ],
  render: function SkeletonPreset({ shape, lines, ratio }) {
    return <Skeleton shape={shape} lines={lines} ratio={shape === "block" ? ratio : undefined} />;
  },
});
