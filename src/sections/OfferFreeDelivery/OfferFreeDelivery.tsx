import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { FreeDeliveryProgress } from "../../components/FreeDeliveryProgress/FreeDeliveryProgress";
import { useStore } from "../../store";
import type { Route } from "../../store/types";
import { cx } from "../../utils";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./OfferFreeDelivery.module.css";

export interface OfferFreeDeliveryProps {
  title: string;
  text?: string;
  action?: { label: string; route: Route };
  /** panel: a card. inverted: a dark band in the text colour. minimal: no box, centred. */
  look?: "panel" | "inverted" | "minimal";
  tone?: SectionTone;
}

/** Promotes the store's free-delivery threshold with a live progress bar. Hidden if there is none. */
export function OfferFreeDelivery({ title, text, action, look = "panel", tone }: OfferFreeDeliveryProps) {
  const headingId = useId();
  const { info } = useStore();
  if (!info.freeDeliveryThreshold) return null;
  return (
    <Section labelledBy={headingId} tone={tone} spacing="tight">
      <div className={cx(styles.panel, look !== "panel" && styles[look])}>
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
