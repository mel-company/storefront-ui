import { useId, type CSSProperties } from "react";
import { CategoryTile, type CategoryTileVariant } from "../../components/CategoryTile/CategoryTile";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { useCategories } from "../../store";
import { Section, type SectionTone } from "../_shared/Section";
import { cx } from "../../utils";
import grid from "../_shared/grid.module.css";
import styles from "./CategoriesTiles.module.css";

export interface CategoriesTilesProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Leave empty to show every category. */
  categoryIds?: string[];
  variant?: CategoryTileVariant;
  /** grid: rows of columns. mosaic: the first category big, image style only. scroll: one row that swipes sideways. */
  layout?: "grid" | "mosaic" | "scroll";
  columns?: number;
  tone?: SectionTone;
}

export function CategoriesTiles({ eyebrow, title, subtitle, categoryIds = [], variant = "image", layout = "grid", columns = 4, tone }: CategoriesTilesProps) {
  const headingId = useId();
  const all = useCategories();
  const categories = categoryIds.length ? all.filter((c) => categoryIds.includes(c.id) || categoryIds.includes(c.slug)) : all;
  if (categories.length === 0) return null;
  return (
    <Section labelledBy={headingId} tone={tone}>
      <SectionHeading id={headingId} eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div
        className={cx(
          layout === "scroll" ? styles.scroll : layout === "mosaic" && variant === "image" ? styles.mosaic : variant !== "pill" && grid.grid,
          variant === "pill" && styles.pills,
          variant === "banner" && layout === "grid" && styles.banners,
        )}
        style={{ "--msu-columns": columns } as CSSProperties}
      >
        {categories.map((category) => (
          <CategoryTile key={category.id} categoryId={category.id} variant={variant} ratio={layout === "mosaic" ? "square" : undefined} />
        ))}
      </div>
    </Section>
  );
}
