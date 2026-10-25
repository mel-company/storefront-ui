import { z } from "zod";
import { demoOrderKey } from "../../demo/data";
import { defineSection } from "../../core/define";
import { field } from "../../core/fields";
import { INVOICE_TEMPLATES } from "../_shared/invoice/paper";
import { toneField } from "../_shared/shared-props";
import { OrderInvoice } from "./OrderInvoice";
import { OrderLookupSkeleton } from "../_shared/skeleton/sections";

/** Order 1042 opened from its confirmation link, which carries the access key. */
const fromLink = { orderNumber: "1042", orderKey: demoOrderKey };

export const orderInvoiceDefinition = defineSection({
  id: "order.invoice",
  name: "Invoice",
  description: "Invoice page: the shopper enters order number and phone, then sees the invoice with Print and Download PDF buttons. Five designs: three A4 and two thermal receipt rolls (80 mm, 58 mm).",
  tags: ["order", "invoice", "print", "logic"],
  uses: ["form.textField", "ui.button"],
  pages: ["invoice"],
  props: z.object({
    title: field.optionalText("Title. Leave out for the built-in text in the store's language", 40),
    intro: field.optionalText("Line under the title. Leave out for the built-in text in the store's language", 200),
    template: z
      .enum(INVOICE_TEMPLATES)
      .optional()
      .describe("Design: classic, modern or compact on A4, or receipt80 / receipt58 for thermal receipt printers. Leave out for the store's own choice"),
    showPrint: field.flag("Show the Print button", true),
    showDownload: field.flag("Show the Download PDF button", true),
    showSeller: field.flag("Show the seller's address, phone and tax number", true),
    showStatus: field.flag("Show paid, due or refunded", true),
    tone: toneField,
  }),
  examples: [
    { name: "Classic, from a link", props: {}, context: fromLink },
    { name: "Modern", props: { template: "modern" }, context: fromLink },
    { name: "Compact", props: { template: "compact" }, context: fromLink },
    { name: "Receipt printer, 80 mm", props: { template: "receipt80", title: "Your receipt", tone: "muted" }, context: fromLink },
    { name: "Receipt printer, 58 mm, print only", props: { template: "receipt58", title: "Your receipt", showDownload: false }, context: fromLink },
    { name: "Asks for number and phone", props: { intro: "Try order 1042 with phone 555 0123." } },
  ],
  skeleton: OrderLookupSkeleton,
  render: function OrderInvoicePreset(props) {
    return <OrderInvoice {...props} />;
  },
});
