import { useId } from "react";
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

/** Native `<details>`: keyboard and screen reader support with no script. */
export function Accordion({ items, single = true, openFirst = false }: AccordionProps) {
  const group = useId();
  return (
    <div className={styles.accordion}>
      {items.map((item, index) => (
        <details
          key={item.question}
          className={styles.item}
          name={single ? group : undefined}
          open={openFirst && index === 0 ? true : undefined}
        >
          <summary className={styles.summary}>
            {item.question}
            <Icon name="chevronEnd" className={styles.chevron} />
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
