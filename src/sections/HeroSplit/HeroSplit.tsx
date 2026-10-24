import { useId } from "react";
import { Icon, type IconName } from "../../icons";
import type { Route } from "../../store/types";
import { cx } from "../../utils";
import { ButtonLink } from "../../components/Button/Button";
import { Media, type MediaRatio } from "../../components/Media/Media";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./HeroSplit.module.css";

export interface HeroAction {
  label: string;
  route: Route;
}

export interface HeroSplitProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  image: string;
  imageAlt: string;
  imageSide?: "start" | "end";
  imageRatio?: MediaRatio;
  points?: { icon: IconName; text: string }[];
  tone?: SectionTone;
}

export function HeroSplit({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  image,
  imageAlt,
  imageSide = "end",
  imageRatio = "portrait",
  points = [],
  tone,
}: HeroSplitProps) {
  const headingId = useId();
  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={cx(styles.hero, imageSide === "start" && styles.mediaStart)}>
        <div className={styles.copy}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 id={headingId} className={styles.title}>
            {title}
          </h1>
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
          {points.length > 0 && (
            <ul className={styles.points}>
              {points.map((point) => (
                <li key={point.text}>
                  <Icon name={point.icon} size={18} />
                  {point.text}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.media}>
          <Media src={image} alt={imageAlt} ratio={imageRatio} priority />
        </div>
      </div>
    </Section>
  );
}
