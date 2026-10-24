import { z } from "zod";
import { accordionItemsSchema } from "../../components/Accordion/definition";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { ProductDetail } from "./ProductDetail";

export const productDetailDefinition = defineSection({
  id: "product.detail",
  name: "Product detail",
  description: "The product page's main block: gallery, price, stock, options, quantity, add to cart, favourites, details, sticky buy bar on phones.",
  tags: ["product", "commerce", "logic"],
  uses: [
    "ui.media",
    "ui.badge",
    "commerce.rating",
    "commerce.price",
    "product.optionPicker",
    "commerce.quantityStepper",
    "commerce.addToCart",
    "commerce.favourite",
    "ui.accordion",
  ],
  pages: ["product"],
  props: z.object({
    productId: z.string().optional().describe("Leave empty to use the product of the current page"),
    details: accordionItemsSchema.optional().describe("Extra details shown under the buy button"),
    stickyBuyBar: field.flag("Sticky buy bar on phones", true),
    lowStockAt: field.count("Show 'only N left' at or below", 1, 20, 5),
  }),
  examples: [
    {
      name: "With options",
      props: {
        productId: "p1",
        details: [
          { question: "Ingredients", answer: "Oat extract, squalane, shea butter, glycerin." },
          { question: "Delivery and returns", answer: "Ships in 1–2 days. Returns within 30 days." },
        ],
      },
    },
    { name: "Low stock", props: { productId: "p2", stickyBuyBar: false } },
  ],
  render: function ProductDetailPreset(props) {
    return <ProductDetail {...props} />;
  },
});
