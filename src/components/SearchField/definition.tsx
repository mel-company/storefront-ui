import { useState } from "react";
import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { SearchField } from "./SearchField";

export const searchFieldDefinition = defineComponent({
  id: "catalogue.search",
  name: "Search field",
  description: "Text search input. Inside a catalogue section it filters the product grid.",
  tags: ["catalogue", "input", "search"],
  props: z.object({ placeholder: field.optionalText("Placeholder. Leave out for the built-in text in the store's language", 48) }),
  examples: [{ name: "Default", props: {} }],
  render: function SearchFieldPreset({ placeholder }) {
    const [value, setValue] = useState("");
    return <SearchField value={value} onChange={setValue} placeholder={placeholder} />;
  },
});
