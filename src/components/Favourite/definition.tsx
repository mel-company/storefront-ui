import { z } from "zod";
import { defineComponent } from "../../core/define";
import { Favourite } from "./Favourite";

export const favouriteDefinition = defineComponent({
  id: "commerce.favourite",
  name: "Favourite toggle",
  description: "Heart button that saves a product to the shopper's favourites.",
  tags: ["commerce", "favourites", "action"],
  props: z.object({ productId: z.string().min(1).describe("Product id") }),
  examples: [{ name: "Default", props: { productId: "p1" } }],
  render: function FavouritePreset(props) {
    return <Favourite {...props} />;
  },
});
