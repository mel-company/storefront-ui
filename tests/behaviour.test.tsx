import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { buildPdf, pageCuts } from "../src/sections/_shared/invoice/pdf";
import {
  AddToCart,
  BundleBuilder,
  CatalogueBrowse,
  CheckoutForm,
  Countdown,
  FavouritesGrid,
  OrderInvoice,
  OrderTracking,
  PageContextProvider,
  demoOrderKey,
  createDemoStore,
  FreeDeliveryProgress,
  HeaderBar,
  PageRenderer,
  Storefront,
  ThemeProvider,
  compositionOf,
  productDefault,
  themes,
  validateComposition,
  type StoreClient,
} from "../src";

function setup(ui: React.ReactElement, store: StoreClient = createDemoStore()) {
  const user = userEvent.setup();
  render(
    <Storefront store={store} mode="light">
      {ui}
    </Storefront>,
  );
  return { user, store };
}

describe("cart logic", () => {
  it("adds to the real cart and the header count follows", async () => {
    const { user, store } = setup(
      <>
        <HeaderBar />
        <AddToCart productId="p2" />
      </>,
    );
    expect(screen.getByRole("link", { name: "Cart, 0 items" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(store.getSnapshot().cart).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Cart, 1 items" })).toBeInTheDocument();
  });

  it("never adds a sold-out product", () => {
    setup(<AddToCart productId="p7" />);
    expect(screen.getByRole("button", { name: /sold out/i })).toBeDisabled();
  });

  it("asks for options before adding", () => {
    setup(<AddToCart productId="p1" />);
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeDisabled();
  });

  it("caps the quantity at stock", () => {
    const store = createDemoStore();
    store.addToCart("p2", 10);
    expect(store.getSnapshot().cart[0]?.quantity).toBe(3);
  });

  it("free delivery progress updates with the cart", () => {
    const store = createDemoStore();
    setup(<FreeDeliveryProgress />, store);
    expect(screen.getByText(/more for free delivery/)).toBeInTheDocument();
    act(() => store.addToCart("p4", 2));
    expect(screen.getByText("You get free delivery")).toBeInTheDocument();
  });
});

describe("bundle builder", () => {
  it("unlocks once the set is full and adds every pick", async () => {
    const { user, store } = setup(<BundleBuilder title="Build your set" pickCount={2} />);
    const add = screen.getByRole("button", { name: "Add set to cart" });
    expect(add).toBeDisabled();
    const options = screen.getAllByRole("button", { pressed: false });
    await user.click(options[0]!);
    await user.click(options[1]!);
    expect(add).toBeEnabled();
    await user.click(add);
    expect(store.getSnapshot().cart).toHaveLength(2);
  });
});

describe("catalogue", () => {
  it("filters by search and category", async () => {
    const { user } = setup(<CatalogueBrowse title="All products" />);
    expect(screen.getByText("8 products")).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox"), "candle");
    expect(screen.getByText("1 product")).toBeInTheDocument();
    await user.clear(screen.getByRole("searchbox"));
    await user.click(within(screen.getByRole("group", { name: "Categories" })).getByRole("button", { name: "Skincare" }));
    expect(screen.getByRole("heading", { level: 1, name: "Skincare" })).toBeInTheDocument();
    expect(screen.getByText("3 products")).toBeInTheDocument();
  });
});

describe("pages", () => {
  it("renders a product page from data with one h1", () => {
    setup(<PageRenderer composition={compositionOf(productDefault)} context={{ productSlug: "fig-eau" }} />);
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["Fig Eau de Parfum"]);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("drops a section with bad props instead of crashing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const composition = { page: "x", sections: [{ section: "hero.split", props: { title: 42 } }] };
    expect(validateComposition(composition, "home").ok).toBe(false);
    setup(<PageRenderer composition={composition} />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    warn.mockRestore();
  });
});

describe("theme", () => {
  it("sets dark mode and direction on its own root", () => {
    const { container } = render(
      <ThemeProvider theme={themes.noir} mode="dark" dir="rtl">
        <p>Hello</p>
      </ThemeProvider>,
    );
    const root = container.querySelector(".msu-root") as HTMLElement;
    expect(root.dataset.msuMode).toBe("dark");
    expect(root.dir).toBe("rtl");
    expect(root.style.getPropertyValue("--msu-background")).toBe(themes.noir.colors.dark.background);
  });

  it("hides a countdown after its date", () => {
    render(<Countdown endsAt="2026-01-01T00:00:00Z" now={Date.parse("2026-02-01T00:00:00Z")} />);
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });
});

describe("Arabic store", () => {
  it("uses Arabic built-in text and Iraqi dinars", async () => {
    const store = createDemoStore({ language: "ar" });
    const { user } = setup(
      <>
        <HeaderBar />
        <AddToCart productId="p2" />
        <FreeDeliveryProgress />
      </>,
      store,
    );
    await user.click(screen.getByRole("button", { name: "أضف إلى السلة" }));
    expect(screen.getByRole("link", { name: "السلة، 1 قطعة" })).toBeInTheDocument();
    expect(screen.getByText(/للحصول على توصيل مجاني/).textContent).toMatch(/د\.ع/);
  });

  it("lets a store replace any built-in text", () => {
    const base = createDemoStore();
    const store = { ...base, info: { ...base.info, messages: { addToCart: "Buy now" } } };
    setup(<AddToCart productId="p2" />, store);
    expect(screen.getByRole("button", { name: "Buy now" })).toBeInTheDocument();
  });
});

describe("checkout", () => {
  const filledStore = () => {
    const store = createDemoStore();
    store.addToCart("p2", 1);
    return store;
  };

  it("points at every missing field instead of sending", async () => {
    const store = filledStore();
    const placeOrder = vi.fn(store.placeOrder);
    const { user } = setup(<CheckoutForm />, { ...store, placeOrder });
    await user.click(screen.getByRole("button", { name: "Place order" }));
    expect(placeOrder).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Check the 4 fields marked below.");
    expect(screen.getByLabelText("Full name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Full name")).toHaveFocus();
  });

  it("rejects a phone number nobody can call", async () => {
    const { user } = setup(<CheckoutForm />, filledStore());
    await user.type(screen.getByLabelText("Phone number"), "12");
    await user.click(screen.getByRole("button", { name: "Place order" }));
    expect(screen.getByText("Enter a phone number we can call")).toBeInTheDocument();
  });

  it("sends the order, empties the cart and shows the order number", async () => {
    const store = filledStore();
    const placeOrder = vi.fn(store.placeOrder);
    const { user } = setup(<CheckoutForm />, { ...store, placeOrder });
    await user.type(screen.getByLabelText("Full name"), "Sara Ali");
    await user.type(screen.getByLabelText("Phone number"), "+1 555 0100");
    await user.type(screen.getByLabelText("City"), "Riverside");
    await user.type(screen.getByLabelText("Address"), "12 Market Street");
    await user.click(screen.getByRole("radio", { name: /card/i }));
    await user.click(screen.getByRole("button", { name: "Place order" }));
    expect(placeOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        payment: "card",
        customer: { name: "Sara Ali", phone: "+1 555 0100", city: "Riverside", address: "12 Market Street" },
        lines: [expect.objectContaining({ productId: "p2", quantity: 1 })],
      }),
    );
    expect(await screen.findByRole("heading", { level: 1, name: "Thank you, your order is in" })).toBeInTheDocument();
    expect(screen.getByText("Order number 1001")).toBeInTheDocument();
    expect(store.getSnapshot().cart).toHaveLength(0);
  });

  it("takes the store's own wording for every field", () => {
    const store = filledStore();
    setup(<CheckoutForm />, { ...store, info: { ...store.info, messages: { fullName: "Your name", placeOrder: "Send my order" } } });
    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send my order" })).toBeInTheDocument();
  });

  it("asks for an Arabic store's city from its list, in Arabic", () => {
    const store = createDemoStore({ language: "ar" });
    store.addToCart("p2", 1);
    setup(<CheckoutForm />, store);
    expect(screen.getByRole("combobox", { name: "المحافظة" })).toHaveDisplayValue("اختر المحافظة");
    expect(screen.getByRole("button", { name: "تأكيد الطلب" })).toBeInTheDocument();
  });

  it("says so when the platform cannot take orders", async () => {
    const store = filledStore();
    const { user } = setup(<CheckoutForm />, { ...store, placeOrder: undefined });
    await user.type(screen.getByLabelText("Full name"), "Sara Ali");
    await user.type(screen.getByLabelText("Phone number"), "5550100");
    await user.type(screen.getByLabelText("City"), "Riverside");
    await user.type(screen.getByLabelText("Address"), "12 Market Street");
    await user.click(screen.getByRole("button", { name: "Place order" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Ordering is not set up for this store yet.");
  });
});

describe("favourites page", () => {
  it("lists saved products, newest first, and empties when unsaved", async () => {
    const store = createDemoStore();
    store.toggleFavourite("p1");
    store.toggleFavourite("p4");
    const { user } = setup(<FavouritesGrid />, store);
    const names = screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
    expect(names).toEqual([store.getSnapshot().products.find((p) => p.id === "p4")!.name, store.getSnapshot().products.find((p) => p.id === "p1")!.name]);
    for (const button of screen.getAllByRole("button", { name: /remove .* from favourites/i })) await user.click(button);
    expect(screen.getByRole("heading", { level: 1, name: "No favourites yet" })).toBeInTheDocument();
  });
});

describe("order tracking", () => {
  const find = async (user: ReturnType<typeof userEvent.setup>, number: string, phone: string) => {
    await user.type(screen.getByLabelText("Order number"), number);
    await user.type(screen.getByLabelText("Phone number"), phone);
    await user.click(screen.getByRole("button", { name: "Find my order" }));
  };

  it("shows where an order is once number and phone match", async () => {
    const { user } = setup(<OrderTracking />);
    await find(user, "1042", "555 0123");
    expect(await screen.findByRole("heading", { level: 2, name: "Order number 1042" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Your order is on its way.");
    const steps = within(screen.getByRole("list", { name: "Order progress" })).getAllByRole("listitem");
    expect(steps).toHaveLength(5);
    expect(steps[2]).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("link", { name: "Track with Swift Courier" })).toHaveAttribute("href", "https://courier.example/track/AT1042");
  });

  it("finds nothing when the phone does not match", async () => {
    const { user } = setup(<OrderTracking />);
    await find(user, "1042", "555 9999");
    expect(await screen.findByRole("alert")).toHaveTextContent("We could not find an order with that number and phone.");
  });

  it("tracks an order placed a moment ago", async () => {
    const store = createDemoStore();
    store.addToCart("p2", 1);
    await store.placeOrder!({
      customer: { name: "Sara", phone: "+1 555 0177", city: "Riverside", address: "1 Lane" },
      payment: "cash",
      lines: store.getSnapshot().cart,
      subtotal: 18,
      delivery: 6,
      total: 24,
    });
    const { user } = setup(<OrderTracking />, store);
    await find(user, "1001", "5550177");
    expect(await screen.findByText("We have your order and will confirm it soon.")).toBeInTheDocument();
  });
});

describe("invoices", () => {
  const show = async (user: ReturnType<typeof userEvent.setup>, number: string, phone: string) => {
    await user.type(screen.getByLabelText("Order number"), number);
    await user.type(screen.getByLabelText("Phone number"), phone);
    await user.click(screen.getByRole("button", { name: "Show invoice" }));
  };

  it("shows the invoice once number and phone match, and prints only the paper", async () => {
    const { user } = setup(<OrderInvoice />);
    await show(user, "1042", "555 0123");
    const paper = await screen.findByRole("article", { name: "Invoice" });
    expect(within(paper).getByText("INV-1042")).toBeInTheDocument();
    expect(within(paper).getByText("Sam Rivers")).toBeInTheDocument();
    expect(within(paper).getByText("TX-4410-2291")).toBeInTheDocument();
    const rows = within(paper).getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent("Cloud Cream");
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeEnabled();

    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    await user.click(screen.getByRole("button", { name: "Print" }));
    expect(print).toHaveBeenCalledOnce();
    const host = document.querySelector(".msu-print-host");
    expect(host?.querySelector("table")).not.toBeNull();
    window.dispatchEvent(new Event("afterprint"));
    expect(document.querySelector(".msu-print-host")).toBeNull();
    print.mockRestore();
  });

  it("finds nothing when the phone does not match", async () => {
    const { user } = setup(<OrderInvoice />);
    await show(user, "1042", "555 9999");
    expect(await screen.findByRole("alert")).toHaveTextContent("We could not find an order with that number and phone.");
  });

  it("links to the store's own PDF when it has one", async () => {
    const store = createDemoStore();
    const own = await store.getInvoice!({ number: "1042", phone: "555 0123" });
    const { user } = setup(<OrderInvoice />, { ...store, getInvoice: async () => ({ ...own!, pdfUrl: "https://files.example/INV-1042.pdf" }) });
    await show(user, "1042", "555 0123");
    expect(await screen.findByRole("link", { name: "Download PDF" })).toHaveAttribute("href", "https://files.example/INV-1042.pdf");
  });

  it("opens the invoice from the tracked order, then goes back", async () => {
    const { user } = setup(<OrderTracking />);
    await user.type(screen.getByLabelText("Order number"), "1042");
    await user.type(screen.getByLabelText("Phone number"), "555 0123");
    await user.click(screen.getByRole("button", { name: "Find my order" }));
    await user.click(await screen.findByRole("button", { name: "View invoice" }));
    expect(await screen.findByRole("article", { name: "Invoice" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to the order" }));
    expect(screen.getByRole("heading", { level: 2, name: "Order number 1042" })).toBeInTheDocument();
  });

  it("makes an invoice for an order placed a moment ago, in Arabic too", async () => {
    const store = createDemoStore({ language: "ar" });
    store.addToCart("p2", 2);
    await store.placeOrder!({
      customer: { name: "علي", phone: "0770 555 0177", city: "البصرة", address: "شارع 1" },
      payment: "cash",
      lines: store.getSnapshot().cart,
      subtotal: 36000,
      delivery: 5000,
      total: 41000,
    });
    const invoice = await store.getInvoice!({ number: "1001", phone: "07705550177" });
    expect(invoice).toMatchObject({ number: "INV-1001", status: "due", payment: "الدفع عند الاستلام", total: 41000 });
    expect(invoice?.lines[0]).toMatchObject({ quantity: 2 });
  });

  it("prints a receipt on a roll as long as the receipt", async () => {
    const { user } = setup(<OrderInvoice template="receipt58" />);
    await show(user, "1042", "555 0123");
    const paper = await screen.findByRole("article", { name: "Invoice INV-1042" });
    expect(within(paper).getAllByRole("listitem")).toHaveLength(2);
    expect(within(paper).queryByRole("table")).toBeNull();
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    await user.click(screen.getByRole("button", { name: "Print" }));
    await vi.waitFor(() => expect(print).toHaveBeenCalledOnce());
    expect(document.querySelector(".msu-print-host style")?.textContent).toMatch(/size: 58mm \d+mm; margin: 0;/);
    window.dispatchEvent(new Event("afterprint"));
    print.mockRestore();
  });

  it("uses the store's own design unless the section picks one", async () => {
    const store = createDemoStore();
    const { user } = setup(<OrderInvoice />, { ...store, info: { ...store.info, invoice: { ...store.info.invoice, template: "modern" } } });
    await show(user, "1042", "555 0123");
    expect(await screen.findByRole("article", { name: "Invoice" })).toHaveAttribute("data-template", "modern");
  });

  it("writes a PDF with one page per image, cut between rows", () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    const text = new TextDecoder("latin1").decode(buildPdf([{ jpeg, width: 10, height: 10 }, { jpeg, width: 10, height: 5 }]));
    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text).toContain("/Count 2");
    expect(text.trimEnd().endsWith("%%EOF")).toBe(true);
    // A receipt roll page is as tall as its image: 100pt wide, 10x30 image -> 300pt.
    expect(new TextDecoder("latin1").decode(buildPdf([{ jpeg, width: 10, height: 30 }], { width: 100, height: null, margin: 0 }))).toContain("/MediaBox [0 0 100.00 300.00]");
    // Cuts at the last row edge that fits, or at the page edge when no row edge does.
    expect(pageCuts(2500, 1000, [400, 950, 1300, 1990])).toEqual([950, 1950]);
  });
});

describe("loading pages", () => {
  it("shows the page's skeleton: busy, named Loading, nothing to press", () => {
    setup(<PageRenderer composition={compositionOf(productDefault)} context={{ productSlug: "cloud-cream" }} loading />);
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByRole("region", { name: "Loading…" }).length).toBeGreaterThan(0);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});

describe("orders opened from a link", () => {
  it("opens the order straight away with the link's key, no phone asked", async () => {
    setup(
      <PageContextProvider value={{ orderNumber: "1042", orderKey: demoOrderKey }}>
        <OrderTracking />
      </PageContextProvider>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Looking up your order…");
    expect(await screen.findByRole("heading", { level: 2, name: "Order number 1042" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Phone number")).toBeNull();
  });

  it("opens the invoice straight away too", async () => {
    setup(
      <PageContextProvider value={{ orderNumber: "1042", orderKey: demoOrderKey }}>
        <OrderInvoice />
      </PageContextProvider>,
    );
    expect(await screen.findByRole("article", { name: "Invoice" })).toBeInTheDocument();
  });

  it("asks for the phone when the key is wrong or missing, with the number filled in", async () => {
    setup(
      <PageContextProvider value={{ orderNumber: "1042", orderKey: "guess" }}>
        <OrderTracking />
      </PageContextProvider>,
    );
    expect(await screen.findByLabelText("Phone number")).toBeInTheDocument();
    expect(screen.getByLabelText("Order number")).toHaveValue("1042");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("gives a new order a key, and its tracking link carries it", async () => {
    const store = createDemoStore();
    store.addToCart("p2", 1);
    const result = await store.placeOrder!({
      customer: { name: "Sara", phone: "+1 555 0177", city: "Riverside", address: "1 Lane" },
      payment: "cash",
      lines: store.getSnapshot().cart,
      subtotal: 18,
      delivery: 6,
      total: 24,
    });
    expect(result.accessKey).toBeTruthy();
    expect(await store.trackOrder!({ number: "1001", key: result.accessKey })).toMatchObject({ number: "1001" });
    expect(await store.trackOrder!({ number: "1001" })).toBeNull();
    expect(store.href({ to: "tracking", number: "1001", key: result.accessKey })).toBe(`#/track?order=1001&key=${result.accessKey}`);
  });
});
