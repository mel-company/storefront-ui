import { useId } from "react";
import { Accordion, type AccordionItem } from "../../components/Accordion/Accordion";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./FaqList.module.css";

export interface FaqListProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: AccordionItem[];
  tone?: SectionTone;
}

export function FaqList({ eyebrow, title, subtitle, items, tone }: FaqListProps) {
  const headingId = useId();
  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={styles.layout}>
        <SectionHeading id={headingId} eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <Accordion items={items} openFirst />
      </div>
    </Section>
  );
}
