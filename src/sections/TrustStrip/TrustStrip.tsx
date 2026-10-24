import type { CSSProperties } from "react";
import { Feature, type FeatureProps } from "../../components/Feature/Feature";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./TrustStrip.module.css";

export interface TrustStripProps {
  items: Omit<FeatureProps, "layout">[];
  layout?: FeatureProps["layout"];
  tone?: SectionTone;
}

export function TrustStrip({ items, layout = "inline", tone = "muted" }: TrustStripProps) {
  return (
    <Section label="Why shop with us" tone={tone} spacing="tight">
      <div className={styles.strip} style={{ "--msu-count": items.length } as CSSProperties}>
        {items.map((item) => (
          <Feature key={item.title} {...item} layout={layout} />
        ))}
      </div>
    </Section>
  );
}
