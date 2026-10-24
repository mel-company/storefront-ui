import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { FreeDeliveryProgress } from "../../components/FreeDeliveryProgress/FreeDeliveryProgress";
import { useStore } from "../../store";
import type { Route } from "../../store/types";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./OfferFreeDelivery.module.css";

export interface OfferFreeDeliveryProps {
  title: string;
  text?: string;
  action?: { label: string; route: Route };
  tone?: SectionTone;
}

/** Promotes the store's free-delivery threshold with a live progress bar. Hidden if there is none. */
export function OfferFreeDelivery({ title, text, action, tone }: OfferFreeDeliveryProps) {
  const headingId = useId();
  const { info } = useStore();
  if (!info.freeDeliveryThreshold) return null;
  return (
    <Section labelledBy={headingId} tone={tone} spacing="tight">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          {text && <p className={styles.text}>{text}</p>}
        </div>
        <FreeDeliveryProgress />
        {action && (
          <ButtonLink route={action.route} variant="secondary">
            {action.label}
          </ButtonLink>
        )}
      </div>
    </Section>
  );
}
