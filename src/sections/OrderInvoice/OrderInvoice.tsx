import { useId, useState } from "react";
import { Button } from "../../components/Button/Button";
import { useMessages } from "../../i18n";
import { useStore } from "../../store";
import type { Invoice } from "../../store/types";
import { InvoiceView } from "../_shared/invoice/InvoiceView";
import { OrderLookup } from "../_shared/OrderLookup";
import { usePageContext } from "../_shared/PageContext";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./OrderInvoice.module.css";

export interface OrderInvoiceProps {
  title?: string;
  intro?: string;
  showPrint?: boolean;
  showDownload?: boolean;
  showSeller?: boolean;
  showStatus?: boolean;
  tone?: SectionTone;
}

/**
 * The invoice page: the shopper enters the order number and their phone,
 * then sees the invoice with Print and Download PDF. Looks it up through
 * `store.getInvoice`. Holds the page's h1.
 */
export function OrderInvoice({ title, intro, showPrint, showDownload, showSeller, showStatus, tone }: OrderInvoiceProps) {
  const headingId = useId();
  const store = useStore();
  const page = usePageContext();
  const m = useMessages();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { getInvoice } = store;

  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <h1 id={headingId} className={styles.title}>
            {title || m.getInvoice}
          </h1>
          {!invoice && <p className={styles.intro}>{intro || m.invoiceIntro}</p>}
        </div>
        {invoice ? (
          <InvoiceView
            invoice={invoice}
            showPrint={showPrint}
            showDownload={showDownload}
            showSeller={showSeller}
            showStatus={showStatus}
            extraActions={
              <Button variant="ghost" icon="refresh" onClick={() => setInvoice(null)}>
                {m.findAnotherInvoice}
              </Button>
            }
          />
        ) : (
          <OrderLookup
            initialNumber={page.orderNumber}
            submitLabel={m.showInvoice}
            busyLabel={m.findingOrder}
            submitIcon="receipt"
            offText={m.invoiceOff}
            onFind={
              getInvoice &&
              (async (query) => {
                const found = await getInvoice(query);
                setInvoice(found);
                return Boolean(found);
              })
            }
          />
        )}
      </div>
    </Section>
  );
}
