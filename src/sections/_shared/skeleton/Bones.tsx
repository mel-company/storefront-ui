import type { CSSProperties, ReactNode } from "react";
import { Skeleton, type SkeletonRatio } from "../../../components/Skeleton/Skeleton";
import { useMessages } from "../../../i18n";
import { cx } from "../../../utils";
import grid from "../grid.module.css";
import { containerClassName, Section, type SectionTone } from "../Section";
import styles from "./Bones.module.css";

export { Skeleton };

export interface SectionSkeletonProps {
  tone?: SectionTone;
  spacing?: "normal" | "tight";
  /** The landmark to render, matching the real section's placement. */
  as?: "section" | "header" | "footer";
  className?: string;
  children: ReactNode;
}

/** The loading frame of a section: the same landmark and spacing, named "Loading" and marked busy. */
export function SectionSkeleton({ tone, spacing, as = "section", className, children }: SectionSkeletonProps) {
  const m = useMessages();
  if (as === "section") {
    return (
      <Section label={m.loading} tone={tone} spacing={spacing} busy className={className}>
        {children}
      </Section>
    );
  }
  const Landmark = as;
  return (
    <Landmark aria-busy="true" aria-label={m.loading} className={cx(as === "header" ? styles.header : styles.footer, className)}>
      <div className={containerClassName}>{children}</div>
    </Landmark>
  );
}

/** Eyebrow, title and subtitle placeholders, like `SectionHeading`. */
export function HeadingBones({ eyebrow, subtitle, align = "start" }: { eyebrow?: boolean; subtitle?: boolean; align?: "start" | "center" }) {
  return (
    <div className={cx(styles.heading, align === "center" && styles.center)}>
      {eyebrow && <Skeleton width="90px" />}
      <Skeleton shape="heading" width="min(320px, 70%)" />
      {subtitle && <Skeleton width="min(460px, 90%)" />}
    </div>
  );
}

export interface CardOptions {
  variant?: "standard" | "boxed" | "overlay" | "minimal" | "horizontal";
  imageRatio?: SkeletonRatio;
}

/** A product card placeholder in the card's own style and image shape. */
export function CardBone({ variant = "standard", imageRatio = "portrait" }: CardOptions) {
  if (variant === "horizontal") {
    return (
      <div className={styles.cardRow}>
        <Skeleton shape="block" ratio="square" className={styles.thumb} />
        <div className={styles.stack}>
          <Skeleton width="80%" />
          <Skeleton width="40%" />
        </div>
      </div>
    );
  }
  return (
    <div className={cx(styles.card, variant === "boxed" && styles.boxed)}>
      <Skeleton shape="block" ratio={imageRatio} />
      {variant !== "overlay" && (
        <div className={styles.stack}>
          <Skeleton width="80%" />
          {variant !== "minimal" && <Skeleton width="45%" />}
        </div>
      )}
    </div>
  );
}

/** A grid of card placeholders: two columns on phones, `columns` on desktop, like the real grid. */
export function CardGridBones({ columns = 4, count = columns, card, featured = false }: { columns?: number; count?: number; card?: CardOptions; featured?: boolean }) {
  return (
    <div className={cx(grid.grid, featured && styles.featured)} style={{ "--msu-columns": columns } as CSSProperties}>
      {Array.from({ length: count }, (_, index) => (
        <CardBone key={index} {...card} />
      ))}
    </div>
  );
}

/** A row of cards that runs off the edge, like a rail. */
export function RailBones({ visible = 4, card, numbered = false }: { visible?: number; card?: CardOptions; numbered?: boolean }) {
  return (
    <div className={styles.rail} style={{ "--msu-visible": visible } as CSSProperties}>
      {Array.from({ length: visible + 1 }, (_, index) =>
        numbered ? (
          <div key={index} className={styles.ranked}>
            <Skeleton shape="heading" width="56px" />
            <CardBone {...card} />
          </div>
        ) : (
          <CardBone key={index} {...card} />
        ),
      )}
    </div>
  );
}

/** A labelled input placeholder. */
export function FieldBone({ tall = false }: { tall?: boolean }) {
  return (
    <div className={styles.stack}>
      <Skeleton width="30%" />
      <Skeleton shape="block" height={tall ? "96px" : "48px"} />
    </div>
  );
}

/** Label and value rows, e.g. totals. */
export function RowsBones({ rows = 3 }: { rows?: number }) {
  return (
    <div className={styles.rows}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={styles.row}>
          <Skeleton width="35%" />
          <Skeleton width="20%" />
        </div>
      ))}
    </div>
  );
}

/** A bordered card that holds other bones. */
export function PanelBone({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx(styles.panel, className)}>{children}</div>;
}

export const boneStyles = styles;
