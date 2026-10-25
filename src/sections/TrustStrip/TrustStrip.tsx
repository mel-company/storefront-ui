import type { CSSProperties } from "react";
import { Feature, type FeatureProps } from "../../components/Feature/Feature";
import { Icon } from "../../icons";
import { cx } from "../../utils";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./TrustStrip.module.css";
import { useMessages } from "../../i18n";

export interface TrustStripProps {
  items: Omit<FeatureProps, "layout">[];
  layout?: FeatureProps["layout"];
  /** plain: side by side. cards: each in its own card. divided: lines between them. ticker: titles scrolling in one line. */
  look?: "plain" | "cards" | "divided" | "ticker";
  tone?: SectionTone;
}

export function TrustStrip({ items, layout = "inline", look = "plain", tone = "muted" }: TrustStripProps) {
  const m = useMessages();
  if (look === "ticker") {
    const row = (hidden: boolean) => (
      <ul className={styles.tickerRow} aria-hidden={hidden || undefined}>
        {items.map((item) => (
          <li key={item.title}>
            <Icon name={item.icon} size={18} />
            {item.title}
          </li>
        ))}
      </ul>
    );
    // The row is drawn twice so the loop has no gap; the copy is hidden from screen readers.
    return (
      <Section label={m.whyShopWithUs} tone={tone} spacing="flush">
        <div className={styles.ticker}>
          <div className={styles.tickerTrack}>
            {row(false)}
            {row(true)}
          </div>
        </div>
      </Section>
    );
  }
  return (
    <Section label={m.whyShopWithUs} tone={tone} spacing="tight">
      <div className={cx(styles.strip, look !== "plain" && styles[look])} style={{ "--msu-count": items.length } as CSSProperties}>
        {items.map((item) => (
          <Feature key={item.title} {...item} layout={layout} />
        ))}
      </div>
    </Section>
  );
}
