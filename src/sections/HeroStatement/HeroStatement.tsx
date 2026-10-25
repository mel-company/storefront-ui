import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { cx } from "../../utils";
import { Section, type SectionTone } from "../_shared/Section";
import type { HeroAction } from "../HeroSplit/HeroSplit";
import styles from "./HeroStatement.module.css";

export interface HeroStatementProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  align?: "start" | "center";
  /** large suits a sentence, huge a few words. */
  size?: "large" | "huge";
  /** A line under the title in the accent colour. */
  rule?: boolean;
  tone?: SectionTone;
}

/** Page opener without an image: a big headline, for brands whose voice is the design. */
export function HeroStatement({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  align = "start",
  size = "large",
  rule = false,
  tone,
}: HeroStatementProps) {
  const headingId = useId();
  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={cx(styles.statement, align === "center" && styles.center, size === "huge" && styles.huge)}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 id={headingId} className={styles.title}>
          {title}
        </h1>
        {rule && <span className={styles.rule} aria-hidden="true" />}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {(primaryAction || secondaryAction) && (
          <div className={styles.actions}>
            {primaryAction && (
              <ButtonLink route={primaryAction.route} size="lg" iconEnd="chevronEnd">
                {primaryAction.label}
              </ButtonLink>
            )}
            {secondaryAction && (
              <ButtonLink route={secondaryAction.route} size="lg" variant="secondary">
                {secondaryAction.label}
              </ButtonLink>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
