import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { Button } from "../Button";
import { Drawer } from "./Drawer";

export const drawerDefinition = defineComponent({
  id: "ui.drawer",
  name: "Drawer",
  description: "A panel that slides in from the side with a backdrop. Use for menus, filters or a quick cart. Keeps focus inside and closes on Escape.",
  tags: ["overlay", "menu", "interactive"],
  props: z.object({
    triggerLabel: field.text("Button label", 32),
    title: field.text("Title", 60),
    description: field.optionalText("Line under the title", 160),
    body: field.longText("Text inside", 600),
    side: field.choice("Side", ["start", "end"], "start"),
  }),
  examples: [
    {
      name: "Filters",
      props: {
        triggerLabel: "Filters",
        title: "Filter products",
        description: "Narrow the list by price and size.",
        body: "Put any content here: fields, chips or a list of links.",
        side: "start",
      },
    },
    {
      name: "From the end",
      props: { triggerLabel: "Delivery details", title: "Delivery", body: "Two to four working days in the city, up to a week elsewhere.", side: "end" },
    },
  ],
  render: function DrawerPreset({ triggerLabel, title, description, body, side }) {
    return (
      <Drawer
        title={title}
        description={description}
        side={side}
        trigger={
          <Button variant="secondary" icon={side === "start" ? "menu" : undefined}>
            {triggerLabel}
          </Button>
        }
      >
        <p>{body}</p>
      </Drawer>
    );
  },
});
