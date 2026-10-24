import { Icon } from "../../icons";
import { useCategories, useLink, useStore } from "../../store";
import { cx } from "../../utils";
import { Media, type MediaRatio } from "../Media/Media";
import styles from "./CategoryTile.module.css";

export type CategoryTileVariant = "image" | "circle" | "label";

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
        <Media src={category.image} alt="" ratio={variant === "circle" ? "square" : ratio} className={styles.media} />
      )}
      <span className={styles.name}>{category.name}</span>
      {variant === "label" && <Icon name="chevronEnd" />}
    </Link>
  );
}
