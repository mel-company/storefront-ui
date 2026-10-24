import { createContext, useContext, type ReactNode } from "react";

/** What the current route is about, e.g. the product a product page shows. */
export interface PageContextValue {
  productSlug?: string;
  categorySlug?: string;
}

const PageContext = createContext<PageContextValue>({});

export function PageContextProvider({ value, children }: { value: PageContextValue; children: ReactNode }) {
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export const usePageContext = () => useContext(PageContext);
