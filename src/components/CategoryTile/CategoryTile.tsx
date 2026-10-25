import { Icon } from "../../icons";
import { useCategories, useLink, useStore } from "../../store";
import { cx } from "../../utils";
import { Media, type MediaRatio } from "../Media/Media";
import styles from "./CategoryTile.module.css";

/** image: photo with the name on it. circle: round photo, name under. label: text row. banner: wide photo, big name. pill: small chip with a round thumbnail. */
export type CategoryTileVariant = "image" | "circle" | "label" | "banner" | "pill";

export interface CategoryTileProps {
  categoryId: string;
  variant?: CategoryTileVariant;
  ratio?: MediaRatio;
}

export function CategoryTile({ categoryId, variant = "image", ratio = "portrait" }: CategoryTileProps) {
  const store = useStore();
  const Link = useLink();
  const category = useCategories().find((item) => item.id === categoryId || item.slug === categoryId);
  if (!category) return null;
  const href = store.href({ to: "category", slug: category.slug });

  return (
    <Link href={href} className={cx(styles.tile, styles[variant])}>
      {variant !== "label" && category.image && (
        <Media src={category.image} alt="" ratio={variant === "circle" || variant === "pill" ? "square" : variant === "banner" ? "wide" : ratio} className={styles.media} />
      )}
      <span className={styles.name}>
        {category.name}
        {variant === "banner" && <Icon name="chevronEnd" size={18} />}
      </span>
      {variant === "label" && <Icon name="chevronEnd" />}
    </Link>
  );
}
