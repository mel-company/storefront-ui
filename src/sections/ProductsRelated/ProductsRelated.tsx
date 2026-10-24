import { useProduct } from "../../store";
import { usePageContext } from "../_shared/PageContext";
import { ProductsRail } from "../ProductsRail/ProductsRail";
import type { CardOptions } from "../ProductsGrid/ProductsGrid";

export interface ProductsRelatedProps {
  title: string;
  /** Defaults to the product the page is about. */
  productId?: string;
  limit?: number;
  card?: CardOptions;
}

/** "Complete the look": other products from the same category as the current product. */
export function ProductsRelated({ title, productId, limit = 8, card }: ProductsRelatedProps) {
  const page = usePageContext();
  const product = useProduct(productId ?? page.productSlug);
  if (!product) return null;
  return (
    <ProductsRail
      title={title}
      source={{ categoryId: product.categoryId, limit: limit + 1 }}
      card={card}
      exclude={product.id}
    />
  );
}
