import { useId, type CSSProperties } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { ProductCard, type ProductCardProps } from "../../components/ProductCard/ProductCard";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { useProducts } from "../../store";
import type { ProductQuery, Route } from "../../store/types";
import { Section, type SectionTone } from "../_shared/Section";
import grid from "../_shared/grid.module.css";

export type CardOptions = Omit<ProductCardProps, "productId" | "headingLevel">;

export interface ProductsGridProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  source?: ProductQuery;
  columns?: number;
  card?: CardOptions;
  action?: { label: string; route: Route };
  tone?: SectionTone;
}

/** A heading and a grid of real products picked by `source`. Hides itself when nothing matches. */
export function ProductsGrid({ eyebrow, title, subtitle, source, columns = 4, card, action, tone }: ProductsGridProps) {
  const headingId = useId();
  const products = useProducts(source);
  if (products.length === 0) return null;
  return (
    <Section labelledBy={headingId} tone={tone}>
      <SectionHeading
        id={headingId}
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        action={
          action && (
            <ButtonLink route={action.route} variant="ghost" size="sm" iconEnd="chevronEnd">
              {action.label}
            </ButtonLink>
          )
        }
      />
      <div className={grid.grid} style={{ "--msu-columns": columns } as CSSProperties}>
        {products.map((product) => (
          <ProductCard key={product.id} productId={product.id} {...card} />
        ))}
      </div>
    </Section>
  );
}
