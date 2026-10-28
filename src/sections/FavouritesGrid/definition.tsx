import { z } from "zod";
import { productCardOptions } from "../../components/ProductCard/definition";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { columnsField, toneField } from "../_shared/shared-props";
import { FavouritesGrid } from "./FavouritesGrid";
import { FavouritesGridSkeleton } from "./skeleton";

export const favouritesGridDefinition = defineSection({
  id: "favourites.grid",
  name: "Favourites",
  description: "The favourites page: every product the shopper saved with the heart, newest first. Empty state included.",
  tags: ["favourites", "products", "logic"],
  uses: ["product.card", "ui.emptyState", "ui.button"],
  pages: ["favourites"],
  props: z.object({
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 40),
    emptyTitle: field.optionalText("Title when empty. Leave out for the built-in text in the store's language", 60),
    emptyText: field.optionalText("Text when empty. Leave out for the built-in text in the store's language", 160),
    columns: columnsField(4),
    card: productCardOptions.partial().default({}).describe("How each product card looks"),
    tone: toneField,
  }),
  examples: [
    { name: "With favourites", props: {}, favourites: ["p1", "p4", "p6"] },
    { name: "Boxed cards, 3 columns", props: { title: "Saved for later", columns: 3, card: { variant: "boxed" }, tone: "muted" }, favourites: ["p2", "p3", "p5"] },
    { name: "Empty", props: {} },
  ],
  skeleton: FavouritesGridSkeleton,
  render: function FavouritesGridPreset(props) {
    return <FavouritesGrid {...props} />;
  },
});
