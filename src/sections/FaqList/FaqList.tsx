import { useId } from "react";
import { Accordion, type AccordionItem } from "../../components/Accordion/Accordion";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { cx } from "../../utils";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./FaqList.module.css";

export interface FaqListProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: AccordionItem[];
  /** split: heading beside the questions. stacked: heading centred above them. columns: questions in two columns. */
  layout?: "split" | "stacked" | "columns";
  tone?: SectionTone;
}

export function FaqList({ eyebrow, title, subtitle, items, layout = "split", tone }: FaqListProps) {
  const headingId = useId();
  const half = Math.ceil(items.length / 2);
  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={cx(styles.layout, layout !== "split" && styles[layout])}>
        <SectionHeading id={headingId} eyebrow={eyebrow} title={title} subtitle={subtitle} align={layout === "split" ? undefined : "center"} />
        {layout === "columns" ? (
          <div className={styles.columns2}>
            <Accordion items={items.slice(0, half)} openFirst />
            {items.length > 1 && <Accordion items={items.slice(half)} />}
          </div>
        ) : (
          <Accordion items={items} openFirst />
        )}
      </div>
    </Section>
  );
}
