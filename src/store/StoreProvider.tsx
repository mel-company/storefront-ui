import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { queryProducts } from "./query";
import type { LinkProps, Product, ProductQuery, StoreClient, StoreSnapshot } from "./types";

const StoreContext = createContext<StoreClient | null>(null);

export function StoreProvider({ store, children }: { store: StoreClient; children: ReactNode }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreClient {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Storefront components must be rendered inside <StoreProvider>");
  return store;
}

/** The store, or `null` outside a provider. For parts that also work standalone. */
export function useOptionalStore(): StoreClient | null {
  return useContext(StoreContext);
}

export function useStoreSnapshot(): StoreSnapshot {
  const store = useStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export function useProducts(query?: ProductQuery): Product[] {
  const { products } = useStoreSnapshot();
  const key = JSON.stringify(query ?? {});
  // `key` stands in for `query`, so a new object literal each render does not refilter.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => queryProducts(products, query), [products, key]);
}

export function useProduct(idOrSlug: string | undefined): Product | undefined {
  const { products } = useStoreSnapshot();
  return products.find((product) => product.id === idOrSlug || product.slug === idOrSlug);
}

export function useCategories() {
  return useStoreSnapshot().categories;
}

export function useCart() {
  const store = useStore();
  const { cart, products } = useStoreSnapshot();
  return useMemo(() => {
    const lines = cart.flatMap((line) => {
      const product = products.find((p) => p.id === line.productId);
      return product ? [{ ...line, product, total: product.price * line.quantity }] : [];
    });
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const threshold = store.info.freeDeliveryThreshold;
    const freeDelivery = threshold !== undefined && subtotal >= threshold;
    const delivery = lines.length === 0 || freeDelivery ? 0 : store.info.deliveryFee;
    return { lines, subtotal, count, delivery, total: subtotal + delivery, freeDelivery };
  }, [cart, products, store.info]);
}

export function useFavourites() {
  const store = useStore();
  const { favourites } = useStoreSnapshot();
  return {
    ids: favourites,
    isFavourite: (id: string) => favourites.includes(id),
    toggle: store.toggleFavourite,
  };
}

/** Formats in the store's currency and locale, e.g. `25,000 IQD`. */
export function useFormatPrice(): (amount: number) => string {
  const { info } = useStore();
  return useMemo(() => {
    const format = new Intl.NumberFormat(info.locale, {
      style: "currency",
      currency: info.currency,
      maximumFractionDigits: 0,
    });
    return (amount: number) => format.format(amount);
  }, [info.locale, info.currency]);
}

function PlainLink({ href, children, ...rest }: LinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

export function useLink() {
  return useStore().Link ?? PlainLink;
}
