import type { CSSProperties } from "react";
import { cx } from "../../utils";
import styles from "./Skeleton.module.css";

export type SkeletonShape = "text" | "heading" | "block" | "circle" | "pill";
export type SkeletonRatio = "square" | "portrait" | "landscape" | "wide" | "tall";

export interface SkeletonProps {
  shape?: SkeletonShape;
  /** Lines of text, the last one shorter. */
  lines?: number;
  /** `block` only. */
  ratio?: SkeletonRatio;
  /** Inline size, e.g. `60%` or `120px`. */
  width?: string;
  /** Block size for `block` without a ratio, and the size of a `circle`. */
  height?: string;
  className?: string;
}

/**
 * A placeholder shape while content loads. Decorative: the section that holds
 * it says it is loading (`aria-busy`). The shimmer runs on the theme's motion
 * and stops with reduced motion.
 */
export function Skeleton({ shape = "text", lines = 1, ratio, width, height, className }: SkeletonProps) {
  if ((shape === "text" || shape === "heading") && lines > 1) {
    return (
      <span className={cx(styles.lines, className)} aria-hidden="true" style={width ? { inlineSize: width } : undefined}>
        {Array.from({ length: lines }, (_, index) => (
          <span key={index} className={cx(styles.bone, styles[shape])} style={index === lines - 1 ? { inlineSize: "60%" } : undefined} />
        ))}
      </span>
    );
  }
  const style: CSSProperties = {};
  if (width) style.inlineSize = width;
  if (height) style.blockSize = height;
  if (shape === "circle" && height) style.inlineSize = height;
  return <span aria-hidden="true" className={cx(styles.bone, styles[shape], ratio && styles[ratio], className)} style={style} />;
}
