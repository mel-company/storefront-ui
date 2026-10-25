import * as Radix from "@radix-ui/react-accordion";
import { Icon } from "../../icons";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Only one open at a time. */
  single?: boolean;
  openFirst?: boolean;
}

/**
 * Built on Radix Accordion: arrow keys move between questions, and answers
 * open and close smoothly. Closed answers stay in the HTML for search engines.
 */
export function Accordion({ items, single = true, openFirst = false }: AccordionProps) {
  const first = openFirst ? "0" : undefined;
  const content = items.map((item, index) => (
    <Radix.Item key={item.question} value={String(index)} className={styles.item}>
      <Radix.Header className={styles.header}>
        <Radix.Trigger className={styles.summary}>
          {item.question}
          <Icon name="chevronDown" className={styles.chevron} />
        </Radix.Trigger>
      </Radix.Header>
      <Radix.Content forceMount className={styles.content}>
        <p className={styles.answer}>{item.answer}</p>
      </Radix.Content>
    </Radix.Item>
  ));
  return single ? (
    <Radix.Root type="single" collapsible defaultValue={first} className={styles.accordion}>
      {content}
    </Radix.Root>
  ) : (
    <Radix.Root type="multiple" defaultValue={first ? [first] : []} className={styles.accordion}>
      {content}
    </Radix.Root>
  );
}
