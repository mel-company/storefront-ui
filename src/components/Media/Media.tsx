import { cx } from "../../utils";
import styles from "./Media.module.css";

export type MediaRatio = "square" | "portrait" | "landscape" | "wide" | "tall";

export interface MediaProps {
  src: string;
  /** Empty string marks the image as decorative. */
  alt: string;
  ratio?: MediaRatio;
  fit?: "cover" | "contain";
  /** Above-the-fold images load eagerly. */
  priority?: boolean;
  className?: string;
}

export function Media({ src, alt, ratio = "square", fit = "cover", priority = false, className }: MediaProps) {
  return (
    <div className={cx(styles.media, styles[ratio], fit === "contain" && styles.contain, className)}>
      <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" />
    </div>
  );
}
