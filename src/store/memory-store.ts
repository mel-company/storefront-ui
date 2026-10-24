import { cartLineKey } from "./query";
import type { Category, Product, Route, StoreClient, StoreInfo, StoreSnapshot } from "./types";

export interface MemoryStoreData {
  info: StoreInfo;
  products: Product[];
  categories: Category[];
  cart?: StoreSnapshot["cart"];
  favourites?: string[];
}

/** Hash routes, so previews work inside any page without a router. */
export function defaultHref(route: Route): string {
  switch (route.to) {
    case "home":
      return "#/";
    case "catalogue": {
      const params = new URLSearchParams(
        Object.entries(route.query ?? {}).filter((entry): entry is [string, string] => Boolean(entry[1])),
      ).toString();
      return params ? `#/products?${params}` : "#/products";
    }
    case "category":
      return `#/category/${route.slug}`;
    case "product":
      return `#/product/${route.slug}`;
    case "cart":
      return "#/cart";
    case "checkout":
      return "#/checkout";
    case "favourites":
      return "#/favourites";
    case "url":
      return route.href;
  }
}

/**
 * An in-memory store. Immutable snapshots, so `useSyncExternalStore` sees a
 * new object only when something changed.
 */
export function createMemoryStore(data: MemoryStoreData): StoreClient {
  const listeners = new Set<() => void>();
  let snapshot: StoreSnapshot = {
    products: data.products,
    categories: data.categories,
    cart: data.cart ?? [],
    favourites: data.favourites ?? [],
  };

  const update = (next: Partial<StoreSnapshot>) => {
    snapshot = { ...snapshot, ...next };
    listeners.forEach((listener) => listener());
  };

  const stockOf = (productId: string) =>
    snapshot.products.find((product) => product.id === productId)?.stock ?? 0;

  return {
    info: data.info,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    addToCart(productId, quantity = 1, options = {}) {
      const key = cartLineKey(productId, options);
      const existing = snapshot.cart.find((line) => line.key === key);
      const max = stockOf(productId);
      if (max <= 0) return;
      const cart = existing
        ? snapshot.cart.map((line) =>
            line.key === key ? { ...line, quantity: Math.min(max, line.quantity + quantity) } : line,
          )
        : [...snapshot.cart, { key, productId, quantity: Math.min(max, quantity), options }];
      update({ cart });
    },
    setQuantity(lineKey, quantity) {
      if (quantity <= 0) {
        update({ cart: snapshot.cart.filter((line) => line.key !== lineKey) });
        return;
      }
      update({
        cart: snapshot.cart.map((line) =>
          line.key === lineKey ? { ...line, quantity: Math.min(stockOf(line.productId), quantity) } : line,
        ),
      });
    },
    removeFromCart(lineKey) {
      update({ cart: snapshot.cart.filter((line) => line.key !== lineKey) });
    },
    toggleFavourite(productId) {
      const favourites = snapshot.favourites.includes(productId)
        ? snapshot.favourites.filter((id) => id !== productId)
        : [...snapshot.favourites, productId];
      update({ favourites });
    },
    href: defaultHref,
  };
}
