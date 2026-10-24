import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AddToCart,
  BundleBuilder,
  CatalogueBrowse,
  Countdown,
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
