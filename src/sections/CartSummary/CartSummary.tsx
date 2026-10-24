import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { CartLine } from "../../components/CartLine/CartLine";
import { FreeDeliveryProgress } from "../../components/FreeDeliveryProgress/FreeDeliveryProgress";
import { Icon } from "../../icons";
import { useCart, useFormatPrice } from "../../store";
import { Section } from "../_shared/Section";
import styles from "./CartSummary.module.css";

export interface CartSummaryProps {
  title?: string;
  checkoutLabel?: string;
  emptyTitle?: string;
  emptyText?: string;
  showFreeDelivery?: boolean;
}

/** The cart page: lines with quantities, free-delivery progress, totals and checkout. Holds the page's h1. */
export function CartSummary({
  title = "Your cart",
  checkoutLabel = "Checkout",
  emptyTitle = "Your cart is empty",
  emptyText = "Find something you love and it will wait for you here.",
  showFreeDelivery = true,
}: CartSummaryProps) {
  const headingId = useId();
  const cart = useCart();
  const format = useFormatPrice();

  if (cart.lines.length === 0) {
    return (
      <Section labelledBy={headingId}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Icon name="bag" size={32} />
          </span>
          <h1 id={headingId} className={styles.title}>
            {emptyTitle}
          </h1>
          <p>{emptyText}</p>
          <ButtonLink route={{ to: "catalogue" }}>Start shopping</ButtonLink>
        </div>
      </Section>
    );
  }

  return (
    <Section labelledBy={headingId}>
      <h1 id={headingId} className={styles.title}>
        {title} ({cart.count})
      </h1>
      <div className={styles.layout}>
        <div className={styles.lines}>
          {cart.lines.map((line) => (
            <CartLine key={line.key} lineKey={line.key} />
          ))}
        </div>
        <aside className={styles.summary} aria-label="Order summary">
          {showFreeDelivery && <FreeDeliveryProgress />}
          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt>Subtotal</dt>
              <dd>{format(cart.subtotal)}</dd>
            </div>
            <div className={styles.row}>
              <dt>Delivery</dt>
              <dd>{cart.delivery === 0 ? "Free" : format(cart.delivery)}</dd>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <dt>Total</dt>
              <dd>{format(cart.total)}</dd>
            </div>
          </dl>
          <ButtonLink route={{ to: "checkout" }} size="lg" fullWidth iconEnd="chevronEnd">
            {checkoutLabel}
          </ButtonLink>
        </aside>
      </div>
    </Section>
  );
}
