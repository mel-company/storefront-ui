import type { ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./SectionHeading.module.css";

export interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  /** Heading level. Sections use 2; a page's first section uses 1. */
  level?: 1 | 2 | 3;
  action?: ReactNode;
}

export function SectionHeading({ id, eyebrow, title, subtitle, align = "start", level = 2, action }: SectionHeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <div className={cx(styles.heading, align === "center" && styles.center)}>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <Tag id={id} className={styles.title}>
          {title}
        </Tag>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
