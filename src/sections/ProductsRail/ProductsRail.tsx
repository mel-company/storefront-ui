import { useId, useRef, type CSSProperties } from "react";
import { Button } from "../../components/Button/Button";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { useTheme } from "../../theme/ThemeProvider";
import { useProducts } from "../../store";
import type { ProductQuery } from "../../store/types";
import { Section, type SectionTone } from "../_shared/Section";
import type { CardOptions } from "../ProductsGrid/ProductsGrid";
import styles from "./ProductsRail.module.css";

export interface ProductsRailProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  source?: ProductQuery;
  visible?: number;
  card?: CardOptions;
  tone?: SectionTone;
  /** A product id to leave out, e.g. the one the page is about. */
  exclude?: string;
}

/** A swipeable row of real products with previous / next buttons on desktop. */
export function ProductsRail({ eyebrow, title, subtitle, source, visible = 4, card, tone, exclude }: ProductsRailProps) {
  const headingId = useId();
  const railRef = useRef<HTMLDivElement>(null);
  const { dir } = useTheme();
  const products = useProducts(source).filter((product) => product.id !== exclude);
  if (products.length === 0) return null;

  const scroll = (forward: boolean) => {
    const rail = railRef.current;
    if (!rail) return;
    const sign = (forward ? 1 : -1) * (dir === "rtl" ? -1 : 1);
    rail.scrollBy({ left: sign * rail.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <Section labelledBy={headingId} tone={tone}>
      <SectionHeading
        id={headingId}
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        action={
          <div className={styles.controls}>
            <Button variant="secondary" size="sm" icon="chevronStart" aria-label="Previous products" onClick={() => scroll(false)} />
            <Button variant="secondary" size="sm" icon="chevronEnd" aria-label="Next products" onClick={() => scroll(true)} />
          </div>
        }
      />
      {/* Focusable so keyboard users can scroll it. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div ref={railRef} className={styles.rail} style={{ "--msu-visible": visible } as CSSProperties} tabIndex={0} role="region" aria-labelledby={headingId}>
        {products.map((product) => (
          <ProductCard key={product.id} productId={product.id} {...card} />
        ))}
      </div>
    </Section>
  );
}
