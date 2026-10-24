import { useId, useState, type FormEvent } from "react";
import { Button } from "../../components/Button/Button";
import { OrderSteps } from "../../components/OrderSteps/OrderSteps";
import { TextField } from "../../components/TextField/TextField";
import { Icon } from "../../icons";
import { useFormatDate, useFormatPrice, useStore } from "../../store";
import type { TrackedOrder } from "../../store/types";
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

type Status = "idle" | "searching" | "notFound" | "failed" | "off";

/**
 * The order tracking page: the shopper enters the order number and their
 * phone, and sees where the order is, what is in it and who is delivering.
 * Looks orders up through `store.trackOrder`. Holds the page's h1.
 */
export function OrderTracking({ title, intro, showItems = true, showCourier = true, statusLayout = "horizontal", tone }: OrderTrackingProps) {
  const headingId = useId();
  const store = useStore();
  const page = usePageContext();
  const m = useMessages();
  const format = useFormatPrice();
  const formatDate = useFormatDate();
  const [number, setNumber] = useState(page.orderNumber ?? "");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ number?: string; phone?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    const found = {
      number: number.trim() ? undefined : m.required,
      phone: !phone.trim() ? m.required : digits.length < 7 || digits.length > 15 ? m.invalidPhone : undefined,
    };
    setErrors(found);
    if (found.number || found.phone) return;
    if (!store.trackOrder) {
      setStatus("off");
      return;
    }
    setStatus("searching");
    try {
      const result = await store.trackOrder({ number: number.trim(), phone: phone.trim() });
      setOrder(result);
      setStatus(result ? "idle" : "notFound");
    } catch {
      setStatus("failed");
    }
  };

  const searching = status === "searching";
  const alert = status === "notFound" ? m.orderNotFound : status === "off" ? m.trackingOff : status === "failed" ? m.orderFailed : null;

  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <h1 id={headingId} className={styles.title}>
            {title || m.trackOrder}
          </h1>
          {!order && <p className={styles.intro}>{intro || m.trackIntro}</p>}
        </div>

        {order ? (
          <OrderCard order={order} showItems={showItems} showCourier={showCourier} statusLayout={statusLayout} format={format} formatDate={formatDate} onReset={() => {
            setOrder(null);
            setPhone("");
            setNumber("");
          }} />
        ) : (
          <form className={`${styles.card} ${styles.form}`} onSubmit={onSubmit} noValidate aria-busy={searching || undefined}>
            {alert && (
              <p className={styles.alert} role="alert">
                <Icon name="alert" size={18} />
                {alert}
              </p>
            )}
            <div className={styles.pair}>
              <TextField
                label={m.orderNumberLabel}
                name="order"
                inputMode="numeric"
                autoComplete="off"
                required
                hint={m.orderNumberHint}
                value={number}
                onChange={(value) => {
                  setNumber(value);
                  if (errors.number) setErrors((current) => ({ ...current, number: undefined }));
                }}
                error={errors.number}
                maxLength={40}
              />
              <TextField
                label={m.phone}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                hint={m.orderPhoneHint}
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
                }}
                error={errors.phone}
                maxLength={20}
              />
            </div>
            <Button type="submit" size="lg" icon={searching ? undefined : "search"} disabled={searching}>
              {searching ? m.findingOrder : m.findOrder}
            </Button>
          </form>
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
  onReset: () => void;
}

function OrderCard({ order, showItems, showCourier, statusLayout, format, formatDate, onReset }: OrderCardProps) {
  const m = useMessages();
  const items = showItems ? (order.lines ?? []) : [];
  const courier = showCourier && order.status !== "cancelled" && order.status !== "delivered" ? order.courier : undefined;
  const open = order.status !== "cancelled" && order.status !== "delivered";
  return (
    <>
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
      <Button variant="secondary" icon="refresh" className={styles.again} onClick={onReset}>
        {m.trackAnother}
      </Button>
    </>
  );
}
