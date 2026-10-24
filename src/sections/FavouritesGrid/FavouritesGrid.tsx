import { useId, type CSSProperties } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { useFavourites, useProducts } from "../../store";
import type { CardOptions } from "../ProductsGrid/ProductsGrid";
import { Section, type SectionTone } from "../_shared/Section";
import grid from "../_shared/grid.module.css";
import styles from "./FavouritesGrid.module.css";
import { useMessages } from "../../i18n";

export interface FavouritesGridProps {
  title?: string;
  emptyTitle?: string;
  emptyText?: string;
  columns?: number;
  card?: CardOptions;
  tone?: SectionTone;
}

/** The favourites page: every saved product, newest first, with an empty state. Holds the page's h1. */
export function FavouritesGrid({ title, emptyTitle, emptyText, columns = 4, card, tone }: FavouritesGridProps) {
  const headingId = useId();
  const m = useMessages();
  const { ids } = useFavourites();
  const found = useProducts({ ids });
  // Newest saved first, and only products the store still has.
  const products = [...ids].reverse().flatMap((id) => found.filter((product) => product.id === id));

  if (products.length === 0) {
    return (
      <Section labelledBy={headingId} tone={tone}>
        <EmptyState
          icon="heart"
          headingLevel={1}
          headingId={headingId}
          title={emptyTitle || m.favouritesEmptyTitle}
          text={emptyText || m.favouritesEmptyText}
          actions={<ButtonLink route={{ to: "catalogue" }}>{m.startShopping}</ButtonLink>}
        />
      </Section>
    );
  }

  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={styles.head}>
        <h1 id={headingId} className={styles.title}>
          {title || m.favourites}
        </h1>
        <span className={styles.count}>{m.productCount(products.length)}</span>
      </div>
      <div className={grid.grid} style={{ "--msu-columns": columns } as CSSProperties}>
        {products.map((product) => (
          <ProductCard key={product.id} productId={product.id} {...card} />
        ))}
      </div>
    </Section>
  );
}
