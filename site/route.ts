import { builtInRegistry, cartDefault, catalogueDefault, productDefault, type PageContextValue, type PageDefinition } from "../src";

export interface View {
  page: PageDefinition;
  context: PageContextValue;
}

export const initialView = (page: PageDefinition): View => ({
  page,
  context: page.pageType === "product" ? { productSlug: "cloud-cream" } : {},
});

/** Turns a link inside a preview into the page it points at, so previews are a clickable store. */
export function route(href: string, home: PageDefinition = builtInRegistry.pages.get("home.classic")!): View {
  const path = href.replace(/^#/, "");
  const product = path.match(/^\/product\/([^/?]+)/);
  if (product) return { page: productDefault, context: { productSlug: product[1] } };
  const category = path.match(/^\/category\/([^/?]+)/);
  if (category) return { page: catalogueDefault, context: { categorySlug: category[1] } };
  if (path.startsWith("/products")) return { page: catalogueDefault, context: {} };
  if (path.startsWith("/cart") || path.startsWith("/checkout")) return { page: cartDefault, context: {} };
  return { page: home, context: {} };
}
