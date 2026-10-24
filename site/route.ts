import {
  builtInRegistry,
  cartDefault,
  catalogueDefault,
  checkoutDefault,
  defaultContext,
  favouritesDefault,
  productDefault,
  type PageContextValue,
  type PageDefinition,
} from "../src";

export interface View {
  page: PageDefinition;
  context: PageContextValue;
}

export const initialView = (page: PageDefinition): View => ({ page, context: defaultContext(page.pageType) });

/** Turns a link inside a preview into the page it points at, so previews are a clickable store. */
export function route(href: string, home: PageDefinition = builtInRegistry.pages.get("home.classic")!): View {
  const path = href.replace(/^#/, "");
  const product = path.match(/^\/product\/([^/?]+)/);
  if (product) return { page: productDefault, context: { productSlug: product[1] } };
  const category = path.match(/^\/category\/([^/?]+)/);
  if (category) return { page: catalogueDefault, context: { categorySlug: category[1] } };
  if (path.startsWith("/products")) {
    const search = new URLSearchParams(path.split("?")[1] ?? "").get("search");
    return { page: catalogueDefault, context: search ? { search } : {} };
  }
  if (path.startsWith("/cart")) return { page: cartDefault, context: {} };
  if (path.startsWith("/checkout")) return { page: checkoutDefault, context: {} };
  if (path.startsWith("/favourites")) return { page: favouritesDefault, context: {} };
  return { page: home, context: {} };
}
