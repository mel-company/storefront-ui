import { useEffect, useId, useState } from "react";
import { Button } from "../../components/Button/Button";
import { OrderSteps } from "../../components/OrderSteps/OrderSteps";
import { Icon } from "../../icons";
import { useFormatDate, useFormatPrice, useStore } from "../../store";
import type { Invoice, TrackedOrder } from "../../store/types";
import { InvoiceView } from "../_shared/invoice/InvoiceView";
import { OrderChecking, OrderLookup, useOrderFromPage, type OrderQuery } from "../_shared/OrderLookup";
import { usePageContext } from "../_shared/PageContext";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./OrderTracking.module.css";
import { useMessages } from "../../i18n";

export interface OrderTrackingProps {
  title?: string;
  intro?: string;
  showItems?: boolean;
  showCourier?: boolean;
  /** How the status steps run on wider screens. */
  statusLayout?: "horizontal" | "vertical";
  tone?: SectionTone;
}

/**
 * The order tracking page: where the order is, what is in it and who is
 * delivering. Opens straight away from a link with the order's key (or for
 * a signed-in shopper); otherwise asks for the order number and phone.
 * Looks orders up through `store.trackOrder`; when the store also has
 * `getInvoice`, the order opens its invoice in place. Holds the page's h1.
 */
export function OrderTracking({ title, intro, showItems = true, showCourier = true, statusLayout = "horizontal", tone }: OrderTrackingProps) {
  const headingId = useId();
  const store = useStore();
  const page = usePageContext();
  const m = useMessages();
  const format = useFormatPrice();
  const formatDate = useFormatDate();
  const [found, setFound] = useState<{ order: TrackedOrder; query: OrderQuery } | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoiceState, setInvoiceState] = useState<"idle" | "busy" | "failed">("idle");
  const { trackOrder, getInvoice } = store;
  const fromPage = useOrderFromPage(trackOrder);
  useEffect(() => {
    if (fromPage.found) setFound({ order: fromPage.found.value, query: fromPage.found.query });
  }, [fromPage.found]);

  const openInvoice = async () => {
    if (!found || !getInvoice) return;
    setInvoiceState("busy");
    try {
      const result = await getInvoice(found.query);
      setInvoice(result);
      setInvoiceState(result ? "idle" : "failed");
    } catch {
      setInvoiceState("failed");
    }
  };

  const reset = () => {
    setFound(null);
    setInvoice(null);
    setInvoiceState("idle");
  };

  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <h1 id={headingId} className={styles.title}>
            {title || m.trackOrder}
          </h1>
          {!found && !fromPage.checking && <p className={styles.intro}>{intro || m.trackIntro}</p>}
        </div>

        {fromPage.checking ? (
          <OrderChecking />
        ) : found && invoice ? (
          <InvoiceView
            invoice={invoice}
            extraActions={
              <Button variant="ghost" icon="chevronStart" onClick={() => setInvoice(null)}>
                {m.backToOrder}
              </Button>
            }
          />
        ) : found ? (
          <>
            <OrderCard order={found.order} showItems={showItems} showCourier={showCourier} statusLayout={statusLayout} format={format} formatDate={formatDate} />
            {invoiceState === "failed" && (
              <p className={styles.alert} role="alert">
                <Icon name="alert" size={18} />
                {m.orderFailed}
              </p>
            )}
            <div className={styles.actions}>
              {getInvoice && (
                <Button icon="receipt" onClick={openInvoice} disabled={invoiceState === "busy"}>
                  {invoiceState === "busy" ? m.findingOrder : m.viewInvoice}
                </Button>
              )}
              <Button variant="secondary" icon="refresh" onClick={reset}>
                {m.trackAnother}
              </Button>
            </div>
          </>
        ) : (
          <OrderLookup
            initialNumber={page.orderNumber}
            submitLabel={m.findOrder}
            busyLabel={m.findingOrder}
            offText={m.trackingOff}
            onFind={
              trackOrder &&
              (async (query) => {
                const order = await trackOrder(query);
                if (order) setFound({ order, query });
                return Boolean(order);
              })
            }
          />
        )}
      </div>
    </Section>
  );
}

interface OrderCardProps {
  order: TrackedOrder;
  showItems: boolean;
  showCourier: boolean;
  statusLayout: "horizontal" | "vertical";
  format: (amount: number) => string;
  formatDate: (iso: string, withTime?: boolean) => string;
}

function OrderCard({ order, showItems, showCourier, statusLayout, format, formatDate }: OrderCardProps) {
  const m = useMessages();
  const items = showItems ? (order.lines ?? []) : [];
  const courier = showCourier && order.status !== "cancelled" && order.status !== "delivered" ? order.courier : undefined;
  const open = order.status !== "cancelled" && order.status !== "delivered";
  return (
    <div className={styles.card}>
        <div className={styles.summary}>
          <div>
            <h2 className={styles.number}>{m.orderNumber(order.number)}</h2>
            <p className={styles.statusText} role="status">
              {m.orderStatusText[order.status]}
            </p>
          </div>
          <div className={styles.chips}>
            {order.placedAt && (
              <span className={styles.chip}>
                <Icon name="bag" size={14} />
                {m.placedOn(formatDate(order.placedAt))}
              </span>
            )}
            {open && order.estimatedDelivery && (
              <span className={styles.chip}>
                <Icon name="clock" size={14} />
                {m.arrivesBy(formatDate(order.estimatedDelivery))}
              </span>
            )}
            {open && order.city && (
              <span className={styles.chip}>
                <Icon name="pin" size={14} />
                {m.deliveredTo(order.city)}
              </span>
            )}
          </div>
        </div>
        <OrderSteps status={order.status} history={order.history} layout={statusLayout} />

        {(items.length > 0 || courier) && (
          <div className={styles.details}>
            {items.length > 0 && (
              <div>
                <h3 className={styles.blockTitle}>{m.items}</h3>
                <ul className={styles.items}>
                  {items.map((line, index) => {
                    const options = Object.values(line.options ?? {}).filter(Boolean);
                    return (
                      <li key={`${line.name}-${index}`} className={styles.item}>
                        {line.image ? <img src={line.image} alt="" /> : <span />}
                        <span className={styles.itemName}>
                          {line.name}
                          <span className={styles.itemMeta}>
                            {[...options, `× ${line.quantity}`].join(" · ")}
                          </span>
                        </span>
                        <span>{format(line.total)}</span>
                      </li>
                    );
                  })}
                </ul>
                {order.total !== undefined && (
                  <dl className={styles.rows}>
                    {order.subtotal !== undefined && (
                      <div className={styles.row}>
                        <dt>{m.subtotal}</dt>
                        <dd>{format(order.subtotal)}</dd>
                      </div>
                    )}
                    {order.delivery !== undefined && (
                      <div className={styles.row}>
                        <dt>{m.delivery}</dt>
                        <dd>{order.delivery === 0 ? m.free : format(order.delivery)}</dd>
                      </div>
                    )}
                    <div className={`${styles.row} ${styles.total}`}>
                      <dt>{m.total}</dt>
                      <dd>{format(order.total)}</dd>
                    </div>
                  </dl>
                )}
              </div>
            )}
            {courier && (
              <div className={styles.courier}>
                <h3 className={styles.blockTitle}>{m.courier}</h3>
                <p className={styles.courierName}>
                  <Icon name="truck" size={18} />
                  {courier.name}
                </p>
                {courier.trackingUrl && (
                  <a className={styles.link} href={courier.trackingUrl} target="_blank" rel="noreferrer">
                    {m.trackWithCourier(courier.name)}
                  </a>
                )}
                {courier.phone && (
                  <a className={styles.link} href={`tel:${courier.phone.replace(/\s/g, "")}`}>
                    {m.callCourier}: <span dir="ltr">{courier.phone}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
