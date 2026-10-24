import { useId, useRef, useState, type ReactNode } from "react";
import { Button, buttonClassName } from "../../../components/Button/Button";
import { useMessages } from "../../../i18n";
import { Icon } from "../../../icons";
import { useFormatDate, useFormatPrice, useStore } from "../../../store";
import type { Invoice } from "../../../store/types";
import { ThemeProvider, useTheme } from "../../../theme/ThemeProvider";
import { cx } from "../../../utils";
import { downloadPaperPdf, printPaper } from "./export";
import styles from "./InvoiceView.module.css";

export interface InvoiceViewProps {
  invoice: Invoice;
  showPrint?: boolean;
  showDownload?: boolean;
  /** Seller name, address and tax number at the top. */
  showSeller?: boolean;
  /** Paid, due or refunded, next to the invoice number. */
  showStatus?: boolean;
  /** More buttons next to Print and Download, e.g. "Back to the order". */
  extraActions?: ReactNode;
}

/**
 * An invoice on paper: always light, so it looks the same on screen, printed
 * and in the PDF, and follows the page direction. Print prints only the paper;
 * Download PDF opens `invoice.pdfUrl` when the store has one, otherwise draws
 * the PDF in the browser.
 */
export function InvoiceView({ invoice, showPrint = true, showDownload = true, showSeller = true, showStatus = true, extraActions }: InvoiceViewProps) {
  const headingId = useId();
  const m = useMessages();
  const { info } = useStore();
  const { theme, dir } = useTheme();
  const format = useFormatPrice();
  const formatDate = useFormatDate();
  const paper = useRef<HTMLElement>(null);
  const [pdf, setPdf] = useState<"idle" | "busy" | "failed">("idle");
  const seller = info.invoice ?? {};
  const address = seller.address ?? info.contact?.address;
  const { customer } = invoice;

  // The light theme's wrapper, so copies keep the theme variables.
  const sheet = () => paper.current?.closest<HTMLElement>(".msu-root") ?? null;

  const download = async () => {
    const node = sheet();
    if (!node) return;
    setPdf("busy");
    try {
      await downloadPaperPdf(node, `${invoice.number}.pdf`);
      setPdf("idle");
    } catch {
      setPdf("failed");
    }
  };

  return (
    <div className={styles.view}>
      {(showPrint || showDownload || extraActions) && (
        <div className={styles.actions}>
          {showPrint && (
            <Button icon="printer" onClick={() => {
                const node = sheet();
                if (node) printPaper(node);
              }}>
              {m.print}
            </Button>
          )}
          {showDownload &&
            (invoice.pdfUrl ? (
              <a className={buttonClassName({ variant: "secondary" })} href={invoice.pdfUrl} target="_blank" rel="noreferrer" download>
                <Icon name="download" />
                {m.downloadPdf}
              </a>
            ) : (
              <Button variant="secondary" icon="download" onClick={download} disabled={pdf === "busy"} aria-busy={pdf === "busy" || undefined}>
                {pdf === "busy" ? m.preparingPdf : m.downloadPdf}
              </Button>
            ))}
          {extraActions}
        </div>
      )}
      {pdf === "failed" && (
        <p className={styles.alert} role="alert">
          <Icon name="alert" size={18} />
          {m.pdfFailed}
        </p>
      )}

      <ThemeProvider theme={theme} mode="light" dir={dir} className={styles.sheet}>
        <article ref={paper} className={styles.paper} aria-labelledby={headingId}>
            <header className={styles.top} data-msu-break>
              <div className={styles.seller}>
                {seller.logo ? <img className={styles.logo} src={seller.logo} alt={info.name} /> : <p className={styles.storeName}>{info.name}</p>}
                {showSeller && (
                  <div className={styles.small}>
                    {seller.legalName && <p>{seller.legalName}</p>}
                    {address && <p>{address}</p>}
                    {info.contact?.phone && <p dir="ltr" className={styles.ltr}>{info.contact.phone}</p>}
                    {info.contact?.email && <p>{info.contact.email}</p>}
                    {seller.taxId && (
                      <p>
                        {m.taxId}: <span dir="ltr">{seller.taxId}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.meta}>
                <div className={styles.titleRow}>
                  <h2 id={headingId} className={styles.title}>
                    {m.invoice}
                  </h2>
                  {showStatus && invoice.status && <span className={cx(styles.status, styles[invoice.status])}>{m.invoiceStatus[invoice.status]}</span>}
                </div>
                <dl className={styles.metaList}>
                  <div>
                    <dt>{m.invoiceNumber}</dt>
                    <dd dir="ltr">{invoice.number}</dd>
                  </div>
                  <div>
                    <dt>{m.invoiceDate}</dt>
                    <dd>{formatDate(invoice.issuedAt)}</dd>
                  </div>
                  <div>
                    <dt>{m.orderRef}</dt>
                    <dd dir="ltr">{invoice.orderNumber}</dd>
                  </div>
                </dl>
              </div>
            </header>

            <div className={styles.parties} data-msu-break>
              <div>
                <h3 className={styles.label}>{m.billTo}</h3>
                <p className={styles.strong}>{customer.name}</p>
                {customer.address && <p>{customer.address}</p>}
                {customer.city && <p>{customer.city}</p>}
                <p dir="ltr" className={styles.ltr}>{customer.phone}</p>
                {customer.email && <p>{customer.email}</p>}
              </div>
              {invoice.payment && (
                <div>
                  <h3 className={styles.label}>{m.payment}</h3>
                  <p className={styles.strong}>{invoice.payment}</p>
                </div>
              )}
            </div>

            <table className={styles.table}>
              <caption className="msu-visually-hidden">{m.items}</caption>
              <thead>
                <tr>
                  <th scope="col">{m.item}</th>
                  <th scope="col" className={styles.num}>{m.unitPrice}</th>
                  <th scope="col" className={styles.num}>{m.qty}</th>
                  <th scope="col" className={styles.num}>{m.amount}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((line, index) => {
                  const options = Object.values(line.options ?? {}).filter(Boolean);
                  return (
                    <tr key={`${line.name}-${index}`}>
                      <td>
                        <span className={styles.strong}>{line.name}</span>
                        {(options.length > 0 || line.sku) && (
                          <span className={styles.lineMeta}>{[...options, line.sku].filter(Boolean).join(" · ")}</span>
                        )}
                      </td>
                      <td className={styles.num}>{format(line.unitPrice)}</td>
                      <td className={styles.num}>{line.quantity}</td>
                      <td className={styles.num}>{format(line.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <dl className={styles.totals} data-msu-break>
              <div>
                <dt>{m.subtotal}</dt>
                <dd>{format(invoice.subtotal)}</dd>
              </div>
              {invoice.discount ? (
                <div>
                  <dt>{m.discount}</dt>
                  <dd>−{format(invoice.discount)}</dd>
                </div>
              ) : null}
              {invoice.delivery !== undefined && (
                <div>
                  <dt>{m.delivery}</dt>
                  <dd>{invoice.delivery === 0 ? m.free : format(invoice.delivery)}</dd>
                </div>
              )}
              {invoice.tax && (
                <div>
                  <dt>{invoice.tax.label}</dt>
                  <dd>{format(invoice.tax.amount)}</dd>
                </div>
              )}
              <div className={styles.grand}>
                <dt>{m.total}</dt>
                <dd>{format(invoice.total)}</dd>
              </div>
            </dl>

            <p className={styles.note} data-msu-break>{seller.note || m.invoiceThanks}</p>
        </article>
      </ThemeProvider>
    </div>
  );
}
