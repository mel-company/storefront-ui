import { useState } from "react";
import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { useCategories } from "../../store";
import { FilterChips } from "./FilterChips";

export const filterChipsDefinition = defineComponent({
  id: "catalogue.categoryChips",
  name: "Category chips",
  description: "Chips for the store's real categories, with an All chip first.",
  tags: ["catalogue", "filter", "category"],
  props: z.object({ allLabel: field.text("Label of the All chip", 20).default("All") }),
  examples: [{ name: "Default", props: {} }],
  render: function FilterChipsPreset({ allLabel }) {
    const categories = useCategories();
    const [value, setValue] = useState("");
    const options = [{ value: "", label: allLabel }, ...categories.map((c) => ({ value: c.id, label: c.name }))];
    return <FilterChips options={options} value={value} onChange={setValue} label="Categories" />;
  },
});
