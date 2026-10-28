import { useEffect, useId, useState } from "react";
import { Button } from "../../components/Button/Button";
import { useMessages } from "../../i18n";
import { useStore } from "../../store";
import type { Invoice, InvoiceTemplate } from "../../store/types";
import { InvoiceView } from "../_shared/invoice/InvoiceView";
import { OrderChecking, OrderLookup, useOrderFromPage } from "../_shared/OrderLookup";
import { usePageContext } from "../../pages/PageContext";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./OrderInvoice.module.css";

export interface OrderInvoiceProps {
  title?: string;
  intro?: string;
  /** Default: the store's `info.invoice.template`, then `classic`. */
  template?: InvoiceTemplate;
  showPrint?: boolean;
  showDownload?: boolean;
  showSeller?: boolean;
  showStatus?: boolean;
  tone?: SectionTone;
}

/**
 * The invoice page, with Print and Download PDF. Opens straight away from a
 * link with the order's key (or for a signed-in shopper); otherwise asks for
 * the order number and phone. Looks it up through
 * `store.getInvoice`. Holds the page's h1.
 */
export function OrderInvoice({ title, intro, template, showPrint, showDownload, showSeller, showStatus, tone }: OrderInvoiceProps) {
  const headingId = useId();
  const store = useStore();
  const page = usePageContext();
  const m = useMessages();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { getInvoice } = store;
  const fromPage = useOrderFromPage(getInvoice);
  useEffect(() => {
    if (fromPage.found) setInvoice(fromPage.found.value);
  }, [fromPage.found]);

  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <h1 id={headingId} className={styles.title}>
            {title || (invoice ? m.yourInvoice : m.getInvoice)}
          </h1>
          {!invoice && !fromPage.checking && <p className={styles.intro}>{intro || m.invoiceIntro}</p>}
        </div>
        {fromPage.checking ? (
          <OrderChecking />
        ) : invoice ? (
          <InvoiceView
            invoice={invoice}
            template={template}
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
