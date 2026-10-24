import { useId, type CSSProperties } from "react";
import { CategoryTile, type CategoryTileVariant } from "../../components/CategoryTile/CategoryTile";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { useCategories } from "../../store";
import { Section, type SectionTone } from "../_shared/Section";
import grid from "../_shared/grid.module.css";

export interface CategoriesTilesProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Leave empty to show every category. */
  categoryIds?: string[];
  variant?: CategoryTileVariant;
  columns?: number;
  tone?: SectionTone;
}

export function CategoriesTiles({ eyebrow, title, subtitle, categoryIds = [], variant = "image", columns = 4, tone }: CategoriesTilesProps) {
  const headingId = useId();
  const all = useCategories();
  const categories = categoryIds.length ? all.filter((c) => categoryIds.includes(c.id) || categoryIds.includes(c.slug)) : all;
  if (categories.length === 0) return null;
  return (
    <Section labelledBy={headingId} tone={tone}>
      <SectionHeading id={headingId} eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className={grid.grid} style={{ "--msu-columns": columns } as CSSProperties}>
        {categories.map((category) => (
          <CategoryTile key={category.id} categoryId={category.id} variant={variant} />
        ))}
      </div>
    </Section>
  );
}
