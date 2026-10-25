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
  | { to: "tracking"; number?: string; key?: string }
  | { to: "invoice"; number?: string; key?: string }
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
  /** Seller details printed on invoices. */
  invoice?: InvoiceSettings;
}

/** `classic`, `modern` and `compact` print on A4; `receipt80` and `receipt58` on thermal receipt rolls. */
export type InvoiceTemplate = "classic" | "modern" | "compact" | "receipt80" | "receipt58";

export interface InvoiceSettings {
  /** The design every invoice uses unless a section picks another. Default `classic`. */
  template?: InvoiceTemplate;
  /** Shown at the top of the invoice. Absent = the store name as text. */
  logo?: string;
  /** Registered business name, when it differs from the store name. */
  legalName?: string;
  /** Defaults to `contact.address`. */
  address?: string;
  /** Tax or business registration number. */
  taxId?: string;
  /** A line at the bottom, e.g. a returns policy. Absent = a built-in thank-you. */
  note?: string;
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

export type OrderStatus = "placed" | "confirmed" | "shipped" | "outForDelivery" | "delivered" | "cancelled";

export interface TrackedOrderLine {
  name: string;
  quantity: number;
  /** Line total. */
  total: number;
  image?: string;
  options?: Record<string, string>;
}

/** What a shopper sees when tracking an order. Only `number` and `status` are required. */
export interface TrackedOrder {
  number: string;
  status: OrderStatus;
  /** ISO date-time. */
  placedAt?: string;
  /** ISO date or date-time. */
  estimatedDelivery?: string;
  /** When each status was reached, ISO date-time. */
  history?: Partial<Record<OrderStatus, string>>;
  lines?: TrackedOrderLine[];
  subtotal?: number;
  delivery?: number;
  total?: number;
  city?: string;
  courier?: { name: string; trackingUrl?: string; phone?: string };
}

export interface InvoiceLine {
  name: string;
  quantity: number;
  unitPrice: number;
  /** Line total. */
  total: number;
  options?: Record<string, string>;
  sku?: string;
}

/** A bill for one order, ready to show, print or save as PDF. */
export interface Invoice {
  /** e.g. `INV-1042`. */
  number: string;
  orderNumber: string;
  /** ISO date or date-time. */
  issuedAt: string;
  status?: "paid" | "due" | "refunded";
  customer: { name: string; phone: string; email?: string; city?: string; address?: string };
  /** How it was or will be paid, as the shopper should read it. */
  payment?: string;
  lines: InvoiceLine[];
  subtotal: number;
  delivery?: number;
  /** A positive amount taken off. */
  discount?: number;
  tax?: { label: string; amount: number };
  total: number;
  /** A PDF your server made. When set, Download PDF opens it instead of drawing one in the browser. */
  pdfUrl?: string;
}

/**
 * How a shopper proves an order is theirs: its number plus the phone it was
 * placed with, or plus `key`, the access key your store gave with the order
 * (in the confirmation link or email). With neither, return the order only
 * when your own session shows this shopper owns it (signed in), else `null`.
 */
export interface OrderQuery {
  number: string;
  phone?: string;
  key?: string;
}

export interface OrderResult {
  id: string;
  /** What the shopper sees, e.g. `1042`. Defaults to `id`. */
  number?: string;
  /**
   * A secret for this order. Tracking and invoice links from the
   * confirmation carry it, so the shopper is not asked for their phone.
   */
  accessKey?: string;
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
 * Everything the library needs from a platform. A platform implements this
 * over its own API and cart store; `createMemoryStore` implements it for
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
  /**
   * Finds an order, or `null`. See `OrderQuery`: a number alone must never
   * be enough unless your session knows the shopper. The tracking page first
   * tries the number and key from its link (or the session), and asks for
   * the phone only when that finds nothing.
   */
  trackOrder?(query: OrderQuery): Promise<TrackedOrder | null>;
  /** The invoice for an order, found the same way as `trackOrder`, or `null`. */
  getInvoice?(query: OrderQuery): Promise<Invoice | null>;
  /** The platform's router link. Defaults to a plain `<a>`. */
  Link?: ComponentType<LinkProps>;
}
