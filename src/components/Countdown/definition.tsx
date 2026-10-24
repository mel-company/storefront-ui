import { z } from "zod";
import { defineComponent } from "../../core/define";
import { field } from "../../core/fields";
import { Countdown } from "./Countdown";

/** Previews pin "now", so the checker sees the same output every run. */
export const PREVIEW_NOW = Date.parse("2026-10-24T12:00:00Z");

export const countdownDefinition = defineComponent({
  id: "ui.countdown",
  name: "Countdown",
  description: "Days, hours, minutes and seconds to a date. Hides itself after the date.",
  tags: ["promo", "time"],
  props: z.object({ endsAt: field.dateTime("Offer ends at") }),
  examples: [{ name: "Two days left", props: { endsAt: "2026-10-26T15:30:00+03:00" } }],
  render: function CountdownPreset(props) {
    return <Countdown {...props} now={PREVIEW_NOW} />;
  },
});
