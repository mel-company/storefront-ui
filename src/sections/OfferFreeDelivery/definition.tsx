import { z } from "zod";
import { defineSection } from "../../core/define";
import { actionSchema, field } from "../../core/fields";
import { toneField } from "../_shared/shared-props";
import { OfferFreeDelivery } from "./OfferFreeDelivery";
import { OfferFreeDeliverySkeleton } from "./skeleton";

export const offerFreeDeliveryDefinition = defineSection({
  id: "offer.freeDelivery",
  name: "Free delivery offer",
  description: "Promotes free delivery with a live bar of how much more the shopper must spend. Uses the store's threshold.",
  tags: ["offer", "cart", "logic", "conversion"],
  uses: ["cart.freeDeliveryProgress", "ui.button"],
  pages: ["home", "cart", "product"],
  props: z.object({
    title: field.text("Title", 60),
    text: field.optionalText("Text", 160),
    action: actionSchema.optional(),
    look: field.choice("Look", ["panel", "inverted", "minimal"], "panel"),
    tone: toneField,
  }),
  examples: [
    { name: "Empty cart", props: { title: "Free delivery is close", text: "Every order over the threshold ships free.", action: { label: "Keep shopping", route: { to: "catalogue" } } } },
    { name: "Half way", props: { title: "Almost there" }, cart: [{ productId: "p4", quantity: 1 }] },
    { name: "Inverted band", props: { title: "Free delivery is close", text: "Every order over the threshold ships free.", look: "inverted", action: { label: "Keep shopping", route: { to: "catalogue" } } }, cart: [{ productId: "p4", quantity: 1 }] },
    { name: "Minimal", props: { title: "Free delivery is close", look: "minimal", tone: "muted" }, cart: [{ productId: "p4", quantity: 1 }] },
  ],
  skeleton: OfferFreeDeliverySkeleton,
  render: function OfferFreeDeliveryPreset(props) {
    return <OfferFreeDelivery {...props} />;
  },
});
