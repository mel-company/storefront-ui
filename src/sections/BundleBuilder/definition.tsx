import { z } from "zod";
import { defineSection } from "../../core/define";
import { field, productSourceSchema } from "../../core/fields";
import { headingFields, toneField } from "../_shared/shared-props";
import { BundleBuilder } from "./BundleBuilder";

export const bundleBuilderDefinition = defineSection({
  id: "bundle.builder",
  name: "Build your set",
  description: "Shopper picks a set number of in-stock products and adds them all to the cart at once. Raises order value.",
  tags: ["bundle", "logic", "conversion", "cart"],
  uses: ["ui.sectionHeading", "ui.media", "commerce.price"],
  pages: ["home", "product"],
  props: z.object({
    ...headingFields,
    source: productSourceSchema,
    pickCount: field.count("Products in a set", 2, 6, 3),
    addLabel: field.text("Button label", 32).default("Add set to cart"),
    tone: toneField,
  }),
  examples: [
    { name: "Pick three", props: { eyebrow: "Make it yours", title: "Build your ritual", subtitle: "Pick any three.", source: { limit: 8 } } },
    { name: "Pick two bestsellers", props: { title: "Two of our best", source: { tag: "bestseller" }, pickCount: 2, tone: "muted" } },
  ],
  render: function BundleBuilderPreset(props) {
    return <BundleBuilder {...props} />;
  },
});
