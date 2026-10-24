import { useId, useState, type CSSProperties } from "react";
import { Button } from "../../components/Button/Button";
import { FilterChips } from "../../components/FilterChips/FilterChips";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { SearchField } from "../../components/SearchField/SearchField";
import { useCategories, useProducts } from "../../store";
import type { ProductQuery } from "../../store/types";
import { usePageContext } from "../_shared/PageContext";
import { Section } from "../_shared/Section";
import grid from "../_shared/grid.module.css";
import type { CardOptions } from "../ProductsGrid/ProductsGrid";
import styles from "./CatalogueBrowse.module.css";

type Sort = NonNullable<ProductQuery["sort"]>;

const SORT_LABELS: Record<Sort, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  rating: "Top rated",
};

export interface CatalogueBrowseProps {
  title: string;
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
  emptyText = "No products match. Try another search.",
}: CatalogueBrowseProps) {
  const headingId = useId();
  const sortId = useId();
  const page = usePageContext();
  const categories = useCategories();
  const initialCategory = categories.find((c) => c.slug === page.categorySlug)?.id ?? "";
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [sort, setSort] = useState<Sort>("featured");
  const [visible, setVisible] = useState(pageSize);
  const products = useProducts({ search, categoryId: categoryId || undefined, sort });

  const shown = products.slice(0, visible);
  const heading = categories.find((c) => c.id === categoryId)?.name ?? title;

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
            label="Categories"
            value={categoryId}
            onChange={(value) => {
              setCategoryId(value);
              setVisible(pageSize);
            }}
            options={[{ value: "", label: "All" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          />
        )}
      </div>
      <div className={styles.row}>
        <p className={styles.count} aria-live="polite">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        {showSort && (
          <label className={styles.sort} htmlFor={sortId}>
            Sort by
            <select id={sortId} className={styles.select} value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              {(Object.keys(SORT_LABELS) as Sort[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {shown.length === 0 ? (
        <div className={styles.empty}>
          <p>{emptyText}</p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearch("");
              setCategoryId("");
            }}
          >
            Clear filters
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
            Show more
          </Button>
        </div>
      )}
    </Section>
  );
}
