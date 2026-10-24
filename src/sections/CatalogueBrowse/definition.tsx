import { z } from "zod";
import { productCardOptions } from "../../components/ProductCard/definition";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { columnsField } from "../_shared/shared-props";
import { CatalogueBrowse } from "./CatalogueBrowse";

export const catalogueBrowseDefinition = defineSection({
  id: "catalogue.browse",
  name: "Catalogue",
  description: "The products page: search, category chips, sort, product grid and Show more. Opens on the page's category.",
  tags: ["catalogue", "search", "filter", "logic"],
  uses: ["catalogue.search", "catalogue.categoryChips", "product.card", "ui.button"],
  pages: ["catalogue"],
  props: z.object({
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 60),
    showSearch: field.flag("Show search", true),
    showCategories: field.flag("Show category chips", true),
    showSort: field.flag("Show sort", true),
    pageSize: field.count("Products per page", 4, 48, 12),
    columns: columnsField(4),
    card: productCardOptions.partial().default({}),
  }),
  examples: [
    { name: "Full", props: {} },
    { name: "Simple, three columns", props: { title: "Shop", showSort: false, columns: 3, pageSize: 6, card: { variant: "boxed", imageRatio: "square" } } },
  ],
  render: function CatalogueBrowsePreset(props) {
    return <CatalogueBrowse {...props} />;
  },
});
