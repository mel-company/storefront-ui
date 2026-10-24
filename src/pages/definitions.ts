import { definePage, type PageDefinition } from "../core/define";
import { demoBanners } from "../demo";

const header = { section: "header.bar", key: "header", props: { announcement: "Free delivery on orders over $80" } };
const footer = { section: "footer.columns", key: "footer", props: { about: "Small-batch skincare, scent and home goods." } };

const trust = {
  section: "trust.strip",
  key: "trust",
  props: {
    items: [
      { icon: "truck", title: "Free delivery", text: "On orders over $80" },
      { icon: "refresh", title: "30-day returns", text: "No questions asked" },
      { icon: "shield", title: "Secure payment", text: "Cards and cash on delivery" },
    ],
  },
};

export const homeClassic = definePage({
  id: "home.classic",
  name: "Home, classic",
  description: "Split hero, categories, bestsellers, trust, story, new arrivals, free-delivery offer, FAQ.",
  pageType: "home",
  requires: ["header.bar", "footer.columns"],
  sections: [
    header,
    {
      section: "hero.split",
      key: "hero",
      props: {
        eyebrow: "New season",
        title: "Skincare that feels like nothing at all",
        subtitle: "Light formulas, made in small batches with ingredients you can read.",
        primaryAction: { label: "Shop now", route: { to: "catalogue" } },
        secondaryAction: { label: "Bestsellers", route: { to: "catalogue", query: { tag: "bestseller" } } },
        image: demoBanners.warm,
        imageAlt: "Jars of cream on a warm background",
        points: [
          { icon: "truck", text: "Free delivery over $80" },
          { icon: "leaf", text: "Vegan formulas" },
        ],
      },
    },
    { section: "categories.tiles", key: "categories", props: { title: "Shop by category" } },
    {
      section: "products.grid",
      key: "bestsellers",
      props: { eyebrow: "Loved by many", title: "Bestsellers", source: { tag: "bestseller", limit: 4 }, action: { label: "Shop all", route: { to: "catalogue" } } },
    },
    trust,
    {
      section: "story.editorial",
      key: "story",
      props: {
        eyebrow: "Our story",
        title: "Started in a kitchen, still made by hand",
        body: ["We mix every batch ourselves, in small runs, so nothing sits on a shelf for months."],
        image: demoBanners.green,
        imageAlt: "",
      },
    },
    { section: "products.rail", key: "new", props: { title: "New arrivals", source: { tag: "new" } } },
    { section: "offer.freeDelivery", key: "offer", props: { title: "Free delivery is close", text: "Every order over the threshold ships free." } },
    {
      section: "faq.list",
      key: "faq",
      props: {
        title: "Questions, answered",
        items: [
          { question: "How long does delivery take?", answer: "Two to four working days." },
          { question: "Can I pay on delivery?", answer: "Yes, cash or card when your order arrives." },
        ],
      },
    },
    footer,
  ],
});

export const homeCampaign = definePage({
  id: "home.campaign",
  name: "Home, campaign",
  description: "Sale-led: banner with countdown, sale products, build-your-set, circle categories, trust.",
  pageType: "home",
  requires: ["header.bar", "footer.columns"],
  sections: [
    { ...header, props: { layout: "centered", announcement: "Autumn sale ends Sunday" } },
    {
      section: "hero.banner",
      key: "hero",
      props: {
        title: "Autumn sale, up to 30% off",
        subtitle: "Ends Sunday at midnight.",
        action: { label: "Shop the sale", route: { to: "catalogue" } },
        image: demoBanners.cool,
        imageAlt: "",
        endsAt: "2026-10-26T23:59:00+03:00",
      },
    },
    { section: "products.grid", key: "sale", props: { title: "On sale now", source: { onSale: true }, columns: 3, card: { variant: "boxed" } } },
    { section: "bundle.builder", key: "bundle", props: { eyebrow: "Make it yours", title: "Build your ritual", subtitle: "Pick any three.", tone: "muted" } },
    { section: "categories.tiles", key: "categories", props: { title: "Browse", variant: "circle" } },
    trust,
    { ...footer },
  ],
});

export const catalogueDefault = definePage({
  id: "catalogue.default",
  name: "Catalogue",
  description: "Search, filters and every product. Pass `search` in the page context for search results.",
  pageType: "catalogue",
  requires: ["header.bar", "catalogue.browse", "footer.columns"],
  sections: [header, { section: "catalogue.browse", key: "catalogue", props: {} }, trust, footer],
});

export const productDefault = definePage({
  id: "product.default",
  name: "Product",
  description: "Product detail, related products, free-delivery offer.",
  pageType: "product",
  requires: ["header.bar", "product.detail", "footer.columns"],
  sections: [
    header,
    {
      section: "product.detail",
      key: "product",
      props: { details: [{ question: "Delivery and returns", answer: "Ships in 1–2 days. Returns within 30 days." }] },
    },
    { section: "products.related", key: "related", props: { title: "You may also like" } },
    trust,
    footer,
  ],
});

export const cartDefault = definePage({
  id: "cart.default",
  name: "Cart",
  description: "Cart lines and totals, with bestsellers to add.",
  pageType: "cart",
  requires: ["header.bar", "cart.summary", "footer.columns"],
  sections: [
    header,
    { section: "cart.summary", key: "cart", props: {} },
    { section: "products.rail", key: "more", props: { title: "Add something small", source: { maxPrice: 30 } } },
    footer,
  ],
});

export const checkoutDefault = definePage({
  id: "checkout.default",
  name: "Checkout",
  description: "Contact, delivery and payment with the order summary, then a thank-you with the order number.",
  pageType: "checkout",
  requires: ["header.bar", "checkout.form", "footer.columns"],
  sections: [header, { section: "checkout.form", key: "checkout", props: {} }, trust, footer],
  preview: { cart: [{ productId: "p1", quantity: 1, options: { size: "50 ml" } }, { productId: "p6", quantity: 2 }] },
});

export const confirmationDefault = definePage({
  id: "confirmation.default",
  name: "Order confirmation",
  description: "Thank-you after an order placed or paid elsewhere, with bestsellers to keep browsing.",
  pageType: "confirmation",
  requires: ["header.bar", "order.confirmation", "footer.columns"],
  sections: [
    header,
    { section: "order.confirmation", key: "confirmation", props: {} },
    { section: "products.rail", key: "more", props: { title: "Picked for you", source: { tag: "bestseller" } } },
    footer,
  ],
});

export const trackingDefault = definePage({
  id: "tracking.default",
  name: "Order tracking",
  description: "Order number and phone in, then where the order is, what is in it and who is delivering it.",
  pageType: "tracking",
  requires: ["header.bar", "order.tracking", "footer.columns"],
  sections: [
    header,
    { section: "order.tracking", key: "tracking", props: {} },
    { section: "faq.list", key: "faq", props: { title: "Questions, answered", items: [{ question: "How long does delivery take?", answer: "Two to four working days." }] } },
    footer,
  ],
});

export const invoiceDefault = definePage({
  id: "invoice.default",
  name: "Invoice",
  description: "Order number and phone in, then the invoice with Print and Download PDF.",
  pageType: "invoice",
  requires: ["header.bar", "order.invoice", "footer.columns"],
  sections: [header, { section: "order.invoice", key: "invoice", props: {} }, footer],
});

export const favouritesDefault = definePage({
  id: "favourites.default",
  name: "Favourites",
  description: "Every product the shopper saved, with new arrivals underneath.",
  pageType: "favourites",
  requires: ["header.bar", "favourites.grid", "footer.columns"],
  sections: [
    header,
    { section: "favourites.grid", key: "favourites", props: {} },
    { section: "products.rail", key: "new", props: { title: "New arrivals", source: { tag: "new" } } },
    footer,
  ],
  preview: { favourites: ["p1", "p4", "p6"] },
});

export const notFoundDefault = definePage({
  id: "notfound.default",
  name: "Page not found",
  description: "A broken or old link: a plain message, the way back, and bestsellers.",
  pageType: "notFound",
  requires: ["header.bar", "error.notFound", "footer.columns"],
  sections: [
    header,
    { section: "error.notFound", key: "not-found", props: {} },
    { section: "products.grid", key: "bestsellers", props: { title: "Bestsellers", source: { tag: "bestseller", limit: 4 } } },
    footer,
  ],
});

export const pageDefinitions: PageDefinition[] = [
  homeClassic,
  homeCampaign,
  catalogueDefault,
  productDefault,
  cartDefault,
  checkoutDefault,
  confirmationDefault,
  trackingDefault,
  invoiceDefault,
  favouritesDefault,
  notFoundDefault,
];
