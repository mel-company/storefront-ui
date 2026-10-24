import type { ReactNode } from "react";
import { Icon, type IconName } from "../../icons";
import { cx } from "../../utils";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  icon: IconName;
  title: string;
  text?: string;
  /** A short highlighted line, like an order number. */
  detail?: string;
  /** Buttons or links under the text. */
  actions?: ReactNode;
  /** `success` tints the icon, for a placed order. */
  tone?: "neutral" | "success";
  /** `h1` when this is all the page shows. */
  headingLevel?: 1 | 2;
  headingId?: string;
}

/** An icon, a heading and a way forward: empty cart, no favourites, order placed, page not found. */
export function EmptyState({ icon, title, text, detail, actions, tone = "neutral", headingLevel = 2, headingId }: EmptyStateProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className={cx(styles.empty, tone === "success" && styles.success)}>
      <span className={styles.icon}>
        <Icon name={icon} size={32} />
      </span>
      <Heading id={headingId} className={styles.title}>
        {title}
      </Heading>
      {detail && <p className={styles.detail}>{detail}</p>}
      {text && <p className={styles.text}>{text}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
