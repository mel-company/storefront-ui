import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { CartLine } from "../../components/CartLine/CartLine";
import { FreeDeliveryProgress } from "../../components/FreeDeliveryProgress/FreeDeliveryProgress";
import { Icon } from "../../icons";
import { useCart, useFormatPrice } from "../../store";
import { Section } from "../_shared/Section";
import styles from "./CartSummary.module.css";
import { useMessages } from "../../i18n";

export interface CartSummaryProps {
  title?: string;
  checkoutLabel?: string;
  emptyTitle?: string;
  emptyText?: string;
  showFreeDelivery?: boolean;
}

/** The cart page: lines with quantities, free-delivery progress, totals and checkout. Holds the page's h1. */
export function CartSummary({
  title,
  checkoutLabel,
  emptyTitle,
  emptyText,
  showFreeDelivery = true,
}: CartSummaryProps) {
  const headingId = useId();
  const cart = useCart();
  const format = useFormatPrice();
  const m = useMessages();

  if (cart.lines.length === 0) {
    return (
      <Section labelledBy={headingId}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Icon name="bag" size={32} />
          </span>
          <h1 id={headingId} className={styles.title}>
            {emptyTitle || m.cartEmptyTitle}
          </h1>
          <p>{emptyText || m.cartEmptyText}</p>
          <ButtonLink route={{ to: "catalogue" }}>{m.startShopping}</ButtonLink>
        </div>
      </Section>
    );
  }

  return (
    <Section labelledBy={headingId}>
      <h1 id={headingId} className={styles.title}>
        {title || m.yourCart} ({cart.count})
      </h1>
      <div className={styles.layout}>
        <div className={styles.lines}>
          {cart.lines.map((line) => (
            <CartLine key={line.key} lineKey={line.key} />
          ))}
        </div>
        <aside className={styles.summary} aria-label={m.orderSummary}>
          {showFreeDelivery && <FreeDeliveryProgress />}
          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt>{m.subtotal}</dt>
              <dd>{format(cart.subtotal)}</dd>
            </div>
            <div className={styles.row}>
              <dt>{m.delivery}</dt>
              <dd>{cart.delivery === 0 ? m.free : format(cart.delivery)}</dd>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <dt>{m.total}</dt>
              <dd>{format(cart.total)}</dd>
            </div>
          </dl>
          <ButtonLink route={{ to: "checkout" }} size="lg" fullWidth iconEnd="chevronEnd">
            {checkoutLabel || m.checkout}
          </ButtonLink>
        </aside>
      </div>
    </Section>
  );
}
