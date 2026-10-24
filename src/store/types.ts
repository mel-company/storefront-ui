import type { ComponentType, ReactNode } from "react";
import type { Messages } from "../i18n/messages";

export interface ProductOption {
  /** e.g. `size`, `color`. */
  id: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  /** Original price when on sale. */
  compareAtPrice?: number;
  images: string[];
  categoryId: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  stock: number;
  options?: ProductOption[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image?: string;
}

export interface CartEntry {
  /** Product id plus chosen options, so two sizes are two lines. */
  key: string;
  productId: string;
  quantity: number;
  options: Record<string, string>;
}

export interface ProductQuery {
  categoryId?: string;
  tag?: string;
  search?: string;
  ids?: string[];
  maxPrice?: number;
  onSale?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
  limit?: number;
}

export type Route =
  | { to: "home" }
  | { to: "catalogue"; query?: Pick<ProductQuery, "categoryId" | "tag" | "search"> }
  | { to: "category"; slug: string }
  | { to: "product"; slug: string }
  | { to: "cart" }
  | { to: "checkout" }
  | { to: "favourites" }
  | { to: "url"; href: string };

export interface StoreSnapshot {
  products: Product[];
  categories: Category[];
  cart: CartEntry[];
  favourites: string[];
}

export interface StoreInfo {
  name: string;
  currency: string;
  locale: string;
  /** Free delivery from this cart subtotal. Absent = never free. */
  freeDeliveryThreshold?: number;
  deliveryFee: number;
  contact?: { phone?: string; whatsapp?: string; email?: string; address?: string };
  social?: { instagram?: string; tiktok?: string; facebook?: string };
  /** Replace any built-in text. The language itself follows `locale`. */
  messages?: Partial<Messages>;
  /** What the checkout form asks for. Absent = a city text field and cash on delivery. */
  checkout?: CheckoutSettings;
}

export interface PaymentMethod {
  /** Sent back in the order, e.g. `cash`, `card`. */
  id: string;
  label: string;
  description?: string;
}

export interface CheckoutSettings {
  /** Cities the shopper picks from. Absent = a free text field. */
  cities?: string[];
  /** Absent = cash on delivery only, with built-in text. */
  payments?: PaymentMethod[];
  /** Ask for an email address. Default `off`. */
  email?: "off" | "optional" | "required";
}

export interface CheckoutCustomer {
  name: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
}

export interface OrderRequest {
  customer: CheckoutCustomer;
  /** A `PaymentMethod` id. */
  payment: string;
  lines: CartEntry[];
  subtotal: number;
  delivery: number;
  total: number;
}

export interface OrderResult {
  id: string;
  /** What the shopper sees, e.g. `1042`. Defaults to `id`. */
  number?: string;
  /** Send the shopper here next, e.g. an online payment page. */
  redirectUrl?: string;
}

export interface LinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page";
}

/**
 * Everything the library needs from a platform. The Mel platform implements
 * this over its own API and cart store; `createMemoryStore` implements it for
 * tests, the gallery and AI previews.
 */
export interface StoreClient {
  info: StoreInfo;
  subscribe(listener: () => void): () => void;
  getSnapshot(): StoreSnapshot;
  addToCart(productId: string, quantity?: number, options?: Record<string, string>): void;
  setQuantity(lineKey: string, quantity: number): void;
  removeFromCart(lineKey: string): void;
  toggleFavourite(productId: string): void;
  href(route: Route): string;
  /**
   * Sends an order and empties the cart. Without it the checkout form
   * explains that ordering is not set up instead of failing silently.
   */
  placeOrder?(order: OrderRequest): Promise<OrderResult>;
  /** The platform's router link. Defaults to a plain `<a>`. */
  Link?: ComponentType<LinkProps>;
}
