import { z } from "zod";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { toneField } from "../_shared/shared-props";
import { OrderInvoice } from "./OrderInvoice";

export const orderInvoiceDefinition = defineSection({
  id: "order.invoice",
  name: "Invoice",
  description: "Invoice page: the shopper enters order number and phone, then sees the invoice with Print and Download PDF buttons.",
  tags: ["order", "invoice", "print", "logic"],
  uses: ["form.textField", "ui.button"],
  pages: ["invoice"],
  props: z.object({
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 40),
    intro: field.optionalText("Line under the title. Leave out for the built-in text in the store's language", 200),
    showPrint: field.flag("Show the Print button", true),
    showDownload: field.flag("Show the Download PDF button", true),
    showSeller: field.flag("Show the seller's address, phone and tax number", true),
    showStatus: field.flag("Show paid, due or refunded", true),
    tone: toneField,
  }),
  examples: [
    { name: "Default", props: {} },
    { name: "Muted, print only", props: { title: "Your receipt", intro: "Try order 1042 with phone 555 0123.", showDownload: false, tone: "muted" } },
  ],
  render: function OrderInvoicePreset(props) {
    return <OrderInvoice {...props} />;
  },
});
