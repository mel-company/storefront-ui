import { cartLineKey } from "./query";
import { languageOf, messages } from "../i18n/messages";
import type { Category, Invoice, OrderQuery, Product, Route, StoreClient, StoreInfo, StoreSnapshot, TrackedOrder } from "./types";

export interface MemoryStoreData {
  info: StoreInfo;
  products: Product[];
  categories: Category[];
  cart?: StoreSnapshot["cart"];
  favourites?: string[];
  /** Orders `trackOrder` and `getInvoice` can find, with the phone each was placed with and its access key. */
  orders?: { phone: string; key?: string; order: TrackedOrder; invoice?: Invoice }[];
}

/** Digits only, compared from the end, so `+964 770 123 4567` matches `0770 123 4567` and `+1 555 0177` matches `555 0177`. */
const samePhone = (a: string, b: string) => {
  const x = a.replace(/\D/g, "");
  const y = b.replace(/\D/g, "");
  const length = Math.min(9, x.length, y.length);
  return length >= 7 && x.slice(-length) === y.slice(-length);
};

const orderParams = ({ number, key }: { number?: string; key?: string }) => {
  const params = new URLSearchParams();
  if (number) params.set("order", number);
  if (number && key) params.set("key", key);
  const query = params.toString();
  return query ? `?${query}` : "";
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
      return `#/track${orderParams(route)}`;
    case "invoice":
      return `#/invoice${orderParams(route)}`;
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

  // The number plus the phone or the access key. The memory store has no sessions, so a number alone finds nothing.
  const findOrder = ({ number, phone, key }: OrderQuery) => {
    const wanted = number.replace(/^#/, "").replace(/^INV-/i, "").trim();
    return orders.find(
      (entry) => entry.order.number === wanted && ((key && entry.key === key) || (phone && samePhone(entry.phone, phone))),
    );
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
      const lines = order.lines.flatMap((line) => {
        const product = snapshot.products.find((item) => item.id === line.productId);
        return product ? [{ product, quantity: line.quantity, options: line.options }] : [];
      });
      const { customer } = order;
      const payment =
        data.info.checkout?.payments?.find((method) => method.id === order.payment)?.label ??
        (order.payment === "cash" ? messages[languageOf(data.info.locale)].cashOnDelivery : order.payment);
      const key = `${id}-${Math.random().toString(36).slice(2, 10)}`;
      orders.push({
        phone: customer.phone,
        key,
        order: {
          number: id,
          status: "placed",
          placedAt: now,
          history: { placed: now },
          city: customer.city,
          subtotal: order.subtotal,
          delivery: order.delivery,
          total: order.total,
          lines: lines.map(({ product, quantity, options }) => ({ name: product.name, quantity, total: product.price * quantity, image: product.images[0], options })),
        },
        invoice: {
          number: `INV-${id}`,
          orderNumber: id,
          issuedAt: now,
          status: order.payment === "cash" ? "due" : "paid",
          customer: { name: customer.name, phone: customer.phone, email: customer.email, city: customer.city, address: customer.address },
          payment,
          lines: lines.map(({ product, quantity, options }) => ({ name: product.name, quantity, unitPrice: product.price, total: product.price * quantity, options })),
          subtotal: order.subtotal,
          delivery: order.delivery,
          total: order.total,
        },
      });
      update({ cart: [] });
      return { id, accessKey: key };
    },
    async trackOrder(query) {
      return findOrder(query)?.order ?? null;
    },
    async getInvoice(query) {
      return findOrder(query)?.invoice ?? null;
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
