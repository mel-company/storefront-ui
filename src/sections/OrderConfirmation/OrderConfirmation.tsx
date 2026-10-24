import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Icon, type IconName } from "../../icons";
import { useStore } from "../../store";
import { usePageContext } from "../_shared/PageContext";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./OrderConfirmation.module.css";
import { useMessages } from "../../i18n";

export interface OrderPlacedProps {
  orderNumber?: string;
  icon?: IconName;
  title?: string;
  text?: string;
  showContact?: boolean;
  /** A button to the tracking page with this order filled in. */
  showTracking?: boolean;
  /** A button to the invoice page with this order filled in. */
  showInvoice?: boolean;
  headingId?: string;
}

/** The thank-you block: order number, what happens next, how to reach the store. Holds an h1. */
export function OrderPlaced({ orderNumber, icon = "check", title, text, showContact = true, showTracking = true, showInvoice = true, headingId }: OrderPlacedProps) {
  const { info, trackOrder, getInvoice } = useStore();
  const m = useMessages();
  const { phone, whatsapp } = info.contact ?? {};
  return (
    <EmptyState
      icon={icon}
      tone="success"
      headingLevel={1}
      headingId={headingId}
      title={title || m.orderPlacedTitle}
      detail={orderNumber ? m.orderNumber(orderNumber) : undefined}
      text={text || m.orderPlacedText}
      actions={
        <>
          <ButtonLink route={{ to: "catalogue" }}>{m.continueShopping}</ButtonLink>
          {showTracking && trackOrder && (
            <ButtonLink route={{ to: "tracking", number: orderNumber }} variant="secondary" icon="truck">
              {m.trackOrder}
            </ButtonLink>
          )}
          {showInvoice && getInvoice && (
            <ButtonLink route={{ to: "invoice", number: orderNumber }} variant="ghost" icon="receipt">
              {m.viewInvoice}
            </ButtonLink>
          )}
          {showContact && (phone || whatsapp) && (
            <div className={styles.contact}>
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr">
                  <Icon name="phone" size={16} />
                  {phone}
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}>
                  <Icon name="chat" size={16} />
                  WhatsApp
                </a>
              )}
            </div>
          )}
        </>
      }
    />
  );
}

export interface OrderConfirmationProps {
  icon?: IconName;
  title?: string;
  text?: string;
  showContact?: boolean;
  showTracking?: boolean;
  showInvoice?: boolean;
  tone?: SectionTone;
}

/** The page a shopper lands on after paying elsewhere. The order number comes from the page context. */
export function OrderConfirmation({ tone, ...props }: OrderConfirmationProps) {
  const headingId = useId();
  const { orderNumber } = usePageContext();
  return (
    <Section labelledBy={headingId} tone={tone}>
      <OrderPlaced {...props} orderNumber={orderNumber} headingId={headingId} />
    </Section>
  );
}
