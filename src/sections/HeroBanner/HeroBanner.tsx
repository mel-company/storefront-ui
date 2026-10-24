import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { Countdown } from "../../components/Countdown/Countdown";
import type { Route } from "../../store/types";
import { cx } from "../../utils";
import { Section } from "../_shared/Section";
import styles from "./HeroBanner.module.css";

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  action?: { label: string; route: Route };
  image: string;
  imageAlt: string;
  align?: "start" | "center";
  /** Optional offer end; the timer hides itself after it. */
  endsAt?: string;
  now?: number;
}

/**
 * Full-width image with the copy on a solid panel. The panel is the theme's
 * surface, so text contrast never depends on the photo.
 */
export function HeroBanner({ title, subtitle, action, image, imageAlt, align = "start", endsAt, now }: HeroBannerProps) {
  const headingId = useId();
  return (
    <Section labelledBy={headingId} spacing="tight">
      <div className={cx(styles.banner, align === "center" && styles.center)}>
        <img className={styles.image} src={image} alt={imageAlt} />
        <div className={styles.panel}>
          <h1 id={headingId} className={styles.title}>
            {title}
          </h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {endsAt && <Countdown endsAt={endsAt} now={now} />}
          {action && (
            <ButtonLink route={action.route} size="lg" iconEnd="chevronEnd">
              {action.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </Section>
  );
}
