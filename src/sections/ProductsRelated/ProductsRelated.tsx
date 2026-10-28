import { useProduct, useProducts } from "../../store";
import { usePageContext } from "../../pages/PageContext";
import { ProductsRail } from "../ProductsRail/ProductsRail";
import type { CardOptions } from "../ProductsGrid/ProductsGrid";
import { useMessages } from "../../i18n";

export interface ProductsRelatedProps {
  title?: string;
  /** Defaults to the product the page is about. */
  productId?: string;
  limit?: number;
  card?: CardOptions;
}

/** "Complete the look": other products from the same category as the current product. */
export function ProductsRelated({ title, productId, limit = 8, card }: ProductsRelatedProps) {
  const page = usePageContext();
  const m = useMessages();
  const product = useProduct(productId ?? page.productSlug);
  const sameCategory = useProducts({ categoryId: product?.categoryId, limit: limit + 1 });
  // A small category is topped up with the best-rated products, so the rail never stops at one or two.
  const bestRated = useProducts({ sort: "rating", limit: limit + 1 });
  if (!product) return null;
  const ids = [...new Set([...sameCategory, ...bestRated].map((item) => item.id))].filter((id) => id !== product.id).slice(0, limit);
  return (
    <ProductsRail
      title={title || m.relatedTitle}
      source={{ ids }}
      card={card}
      exclude={product.id}
    />
  );
}
