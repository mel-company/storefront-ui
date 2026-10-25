import { useId, useState, type CSSProperties } from "react";
import { Button } from "../../components/Button/Button";
import { FilterChips } from "../../components/FilterChips/FilterChips";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { SearchField } from "../../components/SearchField/SearchField";
import { SelectMenu } from "../../components/SelectField/SelectField";
import { useCategories, useProducts } from "../../store";
import type { ProductQuery } from "../../store/types";
import { usePageContext } from "../_shared/PageContext";
import { Section } from "../_shared/Section";
import grid from "../_shared/grid.module.css";
import type { CardOptions } from "../ProductsGrid/ProductsGrid";
import styles from "./CatalogueBrowse.module.css";
import { useMessages } from "../../i18n";

type Sort = NonNullable<ProductQuery["sort"]>;

const SORTS: Sort[] = ["featured", "newest", "price-asc", "price-desc", "rating"];

export interface CatalogueBrowseProps {
  title?: string;
  showSearch?: boolean;
  showCategories?: boolean;
  showSort?: boolean;
  pageSize?: number;
  columns?: number;
  card?: CardOptions;
  emptyText?: string;
}

/** The products page: search, category chips, sort, the grid and load more. Holds the page's h1. */
export function CatalogueBrowse({
  title,
  showSearch = true,
  showCategories = true,
  showSort = true,
  pageSize = 12,
  columns = 4,
  card,
  emptyText,
}: CatalogueBrowseProps) {
  const headingId = useId();
  const sortId = useId();
  const page = usePageContext();
  const m = useMessages();
  const categories = useCategories();
  const initialCategory = categories.find((c) => c.slug === page.categorySlug)?.id ?? "";
  const [search, setSearch] = useState(page.search ?? "");
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [sort, setSort] = useState<Sort>("featured");
  const [visible, setVisible] = useState(pageSize);
  const products = useProducts({ search, categoryId: categoryId || undefined, sort });

  const shown = products.slice(0, visible);
  const heading = categories.find((c) => c.id === categoryId)?.name ?? (title || m.allProducts);

  return (
    <Section labelledBy={headingId}>
      <h1 id={headingId} className={styles.title}>
        {heading}
      </h1>
      <div className={styles.toolbar}>
        {showSearch && (
          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value);
              setVisible(pageSize);
            }}
          />
        )}
        {showCategories && (
          <FilterChips
            label={m.categories}
            value={categoryId}
            onChange={(value) => {
              setCategoryId(value);
              setVisible(pageSize);
            }}
            options={[{ value: "", label: m.all }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          />
        )}
      </div>
      <div className={styles.row}>
        <p className={styles.count} aria-live="polite">
          {m.productCount(products.length)}
        </p>
        {showSort && (
          <div className={styles.sort}>
            <label htmlFor={sortId}>{m.sortBy}</label>
            <SelectMenu
              id={sortId}
              className={styles.select}
              value={sort}
              onChange={(next) => setSort(next as Sort)}
              items={SORTS.map((key) => ({ value: key, label: m.sort[key] }))}
            />
          </div>
        )}
      </div>
      {shown.length === 0 ? (
        <div className={styles.empty}>
          <p>{emptyText || m.noMatch}</p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearch("");
              setCategoryId("");
            }}
          >
            {m.clearFilters}
          </Button>
        </div>
      ) : (
        <div className={grid.grid} style={{ "--msu-columns": columns, marginBlockStart: "var(--msu-space-4)" } as CSSProperties}>
          {shown.map((product) => (
            <ProductCard key={product.id} productId={product.id} headingLevel={2} {...card} />
          ))}
        </div>
      )}
      {visible < products.length && (
        <div className={styles.more}>
          <Button variant="secondary" onClick={() => setVisible((value) => value + pageSize)}>
            {m.showMore}
          </Button>
        </div>
      )}
    </Section>
  );
}
