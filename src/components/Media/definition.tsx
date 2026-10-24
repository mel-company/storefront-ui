import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { demoBanners, productArt } from "../../demo";
import { Media } from "./Media";

export const mediaDefinition = defineComponent({
  id: "ui.media",
  name: "Media",
  description: "An image at a fixed shape, so layouts never jump while it loads.",
  tags: ["image"],
  props: z.object({
    src: field.image("Image"),
    alt: z.string().max(140).describe("What the image shows, for screen readers. Empty if decorative."),
    ratio: field.choice("Shape", ["square", "portrait", "landscape", "wide", "tall"], "square"),
    fit: field.choice("Fit", ["cover", "contain"], "cover"),
  }),
  examples: [
    { name: "Square", props: { src: productArt("#f6d5c4", "#e9a98f", "jar"), alt: "A jar of cream" } },
    { name: "Wide banner", props: { src: demoBanners.cool, alt: "", ratio: "wide" } },
  ],
  render: function MediaPreset(props) {
    return <Media {...props} />;
  },
});
