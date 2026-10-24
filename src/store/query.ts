import type { Product, ProductQuery } from "./types";

/** Pure product filtering, shared by the memory store and components. */
export function queryProducts(products: Product[], query: ProductQuery = {}): Product[] {
  const search = query.search?.trim().toLowerCase();
  let result = products.filter((product) => {
    if (query.ids && !query.ids.includes(product.id)) return false;
    if (query.categoryId && product.categoryId !== query.categoryId) return false;
    if (query.tag && !product.tags.includes(query.tag)) return false;
    if (query.maxPrice !== undefined && product.price > query.maxPrice) return false;
    if (query.onSale && !(product.compareAtPrice && product.compareAtPrice > product.price)) return false;
    if (search && !`${product.name} ${product.description}`.toLowerCase().includes(search)) return false;
    return true;
  });

  if (query.ids) {
    const order = new Map(query.ids.map((id, index) => [id, index]));
    result.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }

  switch (query.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case "newest":
      result = [...result].reverse();
      break;
    default:
      break;
  }

  return query.limit ? result.slice(0, query.limit) : result;
}

export const cartLineKey = (productId: string, options: Record<string, string> = {}): string => {
  const parts = Object.keys(options)
    .sort()
    .map((key) => `${key}=${options[key]}`);
  return parts.length ? `${productId}?${parts.join("&")}` : productId;
};
