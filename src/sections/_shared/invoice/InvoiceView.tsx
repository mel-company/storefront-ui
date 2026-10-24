import { useId, useRef, useState, type ReactNode } from "react";
import { Button, buttonClassName } from "../../../components/Button/Button";
import { useMessages, type Messages } from "../../../i18n";
import { Icon } from "../../../icons";
import { useFormatDate, useFormatPrice, useStore } from "../../../store";
import type { Invoice, InvoiceTemplate, StoreInfo } from "../../../store/types";
import { ThemeProvider, useTheme } from "../../../theme/ThemeProvider";
import { cx } from "../../../utils";
import { downloadPaperPdf, printPaper } from "./export";
import { isReceipt, paperFor } from "./paper";
import styles from "./InvoiceView.module.css";

export interface InvoiceViewProps {
  invoice: Invoice;
  /**
   * `classic`, `modern` or `compact` for A4; `receipt80` or `receipt58` for
   * thermal receipt printers. Default: the store's `info.invoice.template`,
   * then `classic`.
   */
  template?: InvoiceTemplate;
  showPrint?: boolean;
  showDownload?: boolean;
  /** Seller name, address and tax number at the top. */
  showSeller?: boolean;
  /** Paid, due or refunded, next to the invoice number. */
  showStatus?: boolean;
  /** More buttons next to Print and Download, e.g. "Back to the order". */
  extraActions?: ReactNode;
}

interface PaperProps {
  invoice: Invoice;
  info: StoreInfo;
  m: Messages;
  headingId: string;
  showSeller: boolean;
  showStatus: boolean;
  format: (amount: number) => string;
  formatDate: (iso: string) => string;
}

/**
 * An invoice on paper: always light, so it looks the same on screen, printed
 * and in the PDF, and follows the page direction. Print prints only the paper,
 * on A4 or on a receipt roll as long as the receipt; Download PDF opens
 * `invoice.pdfUrl` when the store has one, otherwise draws the PDF in the
 * browser at the paper's size.
 */
export function InvoiceView({ invoice, template, showPrint = true, showDownload = true, showSeller = true, showStatus = true, extraActions }: InvoiceViewProps) {
  const headingId = useId();
  const m = useMessages();
  const { info } = useStore();
  const { theme, dir } = useTheme();
  const format = useFormatPrice();
  const formatDate = useFormatDate();
  const paper = useRef<HTMLElement>(null);
  const [pdf, setPdf] = useState<"idle" | "busy" | "failed">("idle");
  const design = template ?? info.invoice?.template ?? "classic";
  const sheetSize = paperFor(design);
  const receipt = isReceipt(design);

  // The light theme's wrapper, so copies keep the theme variables.
  const sheet = () => paper.current?.closest<HTMLElement>(".msu-root") ?? null;

  const download = async () => {
    const node = sheet();
    if (!node) return;
    setPdf("busy");
    try {
      await downloadPaperPdf(node, `${invoice.number}.pdf`, sheetSize);
      setPdf("idle");
    } catch {
      setPdf("failed");
    }
  };

  const props: PaperProps = { invoice, info, m, headingId, showSeller, showStatus, format, formatDate };

  return (
    <div className={cx(styles.view, receipt && styles.receiptView)}>
      {(showPrint || showDownload || extraActions) && (
        <div className={styles.actions}>
          {showPrint && (
            <Button
              icon="printer"
              onClick={() => {
                const node = sheet();
                if (node) void printPaper(node, sheetSize);
              }}
            >
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

      <ThemeProvider theme={theme} mode="light" dir={dir} className={cx(styles.sheet, styles[design])}>
        <article ref={paper} className={receipt ? styles.receipt : styles.paper} aria-labelledby={headingId} data-template={design}>
          {receipt ? <ReceiptPaper {...props} /> : <SheetPaper {...props} />}
        </article>
      </ThemeProvider>
    </div>
  );
}

const sellerOf = (info: StoreInfo) => ({ ...info.invoice, address: info.invoice?.address ?? info.contact?.address });

function SellerLines({ info, m }: Pick<PaperProps, "info" | "m">) {
  const seller = sellerOf(info);
  return (
    <div className={styles.small}>
      {seller.legalName && <p>{seller.legalName}</p>}
      {seller.address && <p>{seller.address}</p>}
      {info.contact?.phone && (
        <p dir="ltr" className={styles.ltr}>
          {info.contact.phone}
        </p>
      )}
      {info.contact?.email && <p>{info.contact.email}</p>}
      {seller.taxId && (
        <p>
          {m.taxId}: <span dir="ltr">{seller.taxId}</span>
        </p>
      )}
    </div>
  );
}

function Brand({ info, className }: { info: StoreInfo; className?: string }) {
  const logo = info.invoice?.logo;
  return logo ? <img className={cx(styles.logo, className)} src={logo} alt={info.name} /> : <p className={cx(styles.storeName, className)}>{info.name}</p>;
}

function Totals({ invoice, m, format }: Pick<PaperProps, "invoice" | "m" | "format">) {
  return (
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
  );
}

const optionsOf = (line: Invoice["lines"][number]) => [...Object.values(line.options ?? {}).filter(Boolean), line.sku].filter(Boolean).join(" · ");

/** A4 designs. `classic`, `modern` and `compact` share this markup; the stylesheet does the rest. */
function SheetPaper({ invoice, info, m, headingId, showSeller, showStatus, format, formatDate }: PaperProps) {
  const { customer } = invoice;
  return (
    <>
      <header className={styles.top} data-msu-break>
        <div className={styles.seller}>
          <Brand info={info} />
          {showSeller && <SellerLines info={info} m={m} />}
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
          <p dir="ltr" className={styles.ltr}>
            {customer.phone}
          </p>
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
            <th scope="col" className={styles.num}>
              {m.unitPrice}
            </th>
            <th scope="col" className={styles.num}>
              {m.qty}
            </th>
            <th scope="col" className={styles.num}>
              {m.amount}
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((line, index) => {
            const options = optionsOf(line);
            return (
              <tr key={`${line.name}-${index}`}>
                <td>
                  <span className={styles.strong}>{line.name}</span>
                  {options && <span className={styles.lineMeta}>{options}</span>}
                </td>
                <td className={styles.num}>{format(line.unitPrice)}</td>
                <td className={styles.num}>{line.quantity}</td>
                <td className={styles.num}>{format(line.total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Totals invoice={invoice} m={m} format={format} />

      <p className={styles.note} data-msu-break>
        {info.invoice?.note || m.invoiceThanks}
      </p>
    </>
  );
}

/**
 * Receipt rolls (80 mm and 58 mm thermal printers): one narrow column, black
 * on white, no fills, dashed rules, everything a cashier hands over.
 */
function ReceiptPaper({ invoice, info, m, headingId, showSeller, showStatus, format, formatDate }: PaperProps) {
  const { customer } = invoice;
  return (
    <>
      <header className={styles.rHead} data-msu-break>
        <Brand info={info} className={styles.rBrand} />
        {showSeller && <SellerLines info={info} m={m} />}
      </header>
      <div className={styles.rBlock} data-msu-break>
        <h2 id={headingId} className={styles.rTitle}>
          {m.invoice} <span dir="ltr">{invoice.number}</span>
        </h2>
        <dl className={styles.rRows}>
          <div>
            <dt>{m.invoiceDate}</dt>
            <dd>{formatDate(invoice.issuedAt)}</dd>
          </div>
          <div>
            <dt>{m.orderRef}</dt>
            <dd dir="ltr">{invoice.orderNumber}</dd>
          </div>
          <div>
            <dt>{m.billTo}</dt>
            <dd>{customer.name}</dd>
          </div>
          <div>
            <dt>{m.phone}</dt>
            <dd dir="ltr">{customer.phone}</dd>
          </div>
        </dl>
      </div>
      <ul className={styles.rLines} aria-label={m.items}>
        {invoice.lines.map((line, index) => {
          const options = optionsOf(line);
          return (
            <li key={`${line.name}-${index}`}>
              <span className={styles.rName}>
                {line.name}
                {options && <span className={styles.lineMeta}>{options}</span>}
              </span>
              <span className={styles.rCalc}>
                <span>
                  {line.quantity} × {format(line.unitPrice)}
                </span>
                <span className={styles.strong}>{format(line.total)}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className={styles.rBlock} data-msu-break>
        <Totals invoice={invoice} m={m} format={format} />
      </div>
      {(invoice.payment || (showStatus && invoice.status)) && (
        <dl className={cx(styles.rRows, styles.rBlock)} data-msu-break>
          <div>
            <dt>{m.payment}</dt>
            <dd>{[invoice.payment, showStatus && invoice.status ? m.invoiceStatus[invoice.status] : null].filter(Boolean).join(" · ")}</dd>
          </div>
        </dl>
      )}
      <p className={styles.rNote} data-msu-break>
        {info.invoice?.note || m.invoiceThanks}
      </p>
    </>
  );
}
