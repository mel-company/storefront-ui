import { createContext, useContext, type ReactNode } from "react";

/** What the current route is about, e.g. the product a product page shows. */
export interface PageContextValue {
  productSlug?: string;
  categorySlug?: string;
  /** What the shopper searched for, e.g. from `/products?search=cream`. */
  search?: string;
  /** The order a confirmation page is about, e.g. after an online payment. */
  orderNumber?: string;
}

const PageContext = createContext<PageContextValue>({});

export function PageContextProvider({ value, children }: { value: PageContextValue; children: ReactNode }) {
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export const usePageContext = () => useContext(PageContext);
