import type { ReactNode } from "react";
import { cx } from "../../utils";
import styles from "./Section.module.css";

export type SectionTone = "default" | "muted";
export type SectionSpacing = "normal" | "tight" | "flush";

export interface SectionProps {
  /** Id of the heading that names this section, for screen readers. */
  labelledBy?: string;
  label?: string;
  tone?: SectionTone;
  spacing?: SectionSpacing;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

/** The outer frame every body section uses: full-bleed background, centred content. */
export function Section({ labelledBy, label, tone = "default", spacing = "normal", className, containerClassName, children }: SectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      className={cx(styles.section, tone === "muted" && styles.muted, spacing !== "normal" && styles[spacing], className)}
    >
      <div className={cx(styles.container, containerClassName)}>{children}</div>
    </section>
  );
}

export const containerClassName = styles.container;
