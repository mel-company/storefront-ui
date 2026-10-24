import { cartLineKey } from "./query";
import type { Category, Product, Route, StoreClient, StoreInfo, StoreSnapshot, TrackedOrder } from "./types";

export interface MemoryStoreData {
  info: StoreInfo;
  products: Product[];
  categories: Category[];
  cart?: StoreSnapshot["cart"];
  favourites?: string[];
  /** Orders `trackOrder` can find, with the phone each was placed with. */
  orders?: { phone: string; order: TrackedOrder }[];
}

/** Digits only, compared from the end, so `+964 770 123 4567` matches `0770 123 4567` and `+1 555 0177` matches `555 0177`. */
const samePhone = (a: string, b: string) => {
  const x = a.replace(/\D/g, "");
  const y = b.replace(/\D/g, "");
  const length = Math.min(9, x.length, y.length);
  return length >= 7 && x.slice(-length) === y.slice(-length);
};

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
    case "tracking":
      return route.number ? `#/track?order=${encodeURIComponent(route.number)}` : "#/track";
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
  const orders = [...(data.orders ?? [])];
  let placed = 0;
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
    async placeOrder(order) {
      placed += 1;
      const id = String(1000 + placed);
      const now = new Date().toISOString();
      orders.push({
        phone: order.customer.phone,
        order: {
          number: id,
          status: "placed",
          placedAt: now,
          history: { placed: now },
          city: order.customer.city,
          subtotal: order.subtotal,
          delivery: order.delivery,
          total: order.total,
          lines: order.lines.flatMap((line) => {
            const product = snapshot.products.find((item) => item.id === line.productId);
            return product
              ? [{ name: product.name, quantity: line.quantity, total: product.price * line.quantity, image: product.images[0], options: line.options }]
              : [];
          }),
        },
      });
      update({ cart: [] });
      return { id };
    },
    async trackOrder({ number, phone }) {
      const wanted = number.replace(/^#/, "").trim();
      return orders.find((entry) => entry.order.number === wanted && samePhone(entry.phone, phone))?.order ?? null;
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
