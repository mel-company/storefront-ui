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
  /** Where the copy sits over the image. */
  align?: "start" | "center" | "end";
  /** compact is a short strip, tall the default, full fills the screen. */
  height?: "compact" | "tall" | "full";
  /** panel puts the copy on a solid card; shade darkens the image and sets the copy straight on it. */
  copyStyle?: "panel" | "shade";
  /** On phones: keep the copy over the image, or move it under the image. */
  phoneLayout?: "over" | "below";
  /** Optional offer end; the timer hides itself after it. */
  endsAt?: string;
  now?: number;
}

/**
 * Full-width image with the copy on a solid panel, or on a dark shade.
 * Either way, text contrast never depends on the photo.
 */
export function HeroBanner({
  title,
  subtitle,
  action,
  image,
  imageAlt,
  align = "start",
  height = "tall",
  copyStyle = "panel",
  phoneLayout = "over",
  endsAt,
  now,
}: HeroBannerProps) {
  const headingId = useId();
  return (
    <Section labelledBy={headingId} spacing="tight">
      <div
        className={cx(
          styles.banner,
          align !== "start" && styles[align],
          height !== "tall" && styles[height],
          copyStyle === "shade" && styles.shade,
          phoneLayout === "below" && styles.below,
        )}
      >
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
