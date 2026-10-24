import { useState, type ReactNode } from "react";
import {
  Accordion,
  AddToCart,
  Badge,
  CartLine,
  Countdown,
  Feature,
  FilterChips,
  FreeDeliveryProgress,
  Media,
  OptionPicker,
  Price,
  ProductCard,
  QuantityStepper,
  Rating,
  SearchField,
  useCart,
  useCategories,
  useFormatPrice,
  useProduct,
  useMessages,
  useProducts,
} from "../../src";
import { useT } from "../i18n";
import { LivePreview } from "./LivePreview";

function Tile({ ids, children, className }: { ids: string[]; children: ReactNode; className?: string }) {
  return (
    <figure className={`tile reveal ${className ?? ""}`}>
      <div className="tile-body">{children}</div>
      <figcaption>{ids.join(" · ")}</figcaption>
    </figure>
  );
}

function BuyBox() {
  const product = useProduct("p4")!;
  const [size, setSize] = useState(product.options?.[0]?.values[0]);
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="buy">
      <Media src={product.images[0]!} alt={product.name} ratio="square" />
      <div className="buy-info">
        <h3>{product.name}</h3>
        <Rating value={product.rating ?? 0} count={product.reviewCount} />
        <Price amount={product.price} size="lg" />
        {product.options?.[0] && <OptionPicker option={product.options[0]} value={size} onChange={setSize} />}
        <div className="buy-row">
          <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} />
          <AddToCart productId={product.id} quantity={quantity} options={size ? { size } : undefined} fullWidth />
        </div>
      </div>
    </div>
  );
}

function MiniCart() {
  const cart = useCart();
  const format = useFormatPrice();
  const m = useMessages();
  const t = useT();
  return (
    <div className="mini-cart">
      <div className="mini-head">
        <h3>{m.yourCart}</h3>
        <span className="tile-muted">{m.itemCount(cart.count)}</span>
      </div>
      <FreeDeliveryProgress />
      <div className="mini-lines">
        {cart.lines.map((line) => (
          <CartLine key={line.key} lineKey={line.key} />
        ))}
        {cart.lines.length === 0 && <p className="tile-muted">{t("Empty. Add something from the other cards.")}</p>}
      </div>
      <div className="mini-total">
        <span>{m.total}</span>
        <strong>{format(cart.total)}</strong>
      </div>
    </div>
  );
}

function Browse() {
  const categories = useCategories();
  const m = useMessages();
  const t = useT();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const products = useProducts({ categoryId: category === "all" ? undefined : category, search: query || undefined, limit: 3 });
  return (
    <div className="browse">
      <SearchField value={query} onChange={setQuery} />
      <FilterChips
        label={m.categories}
        value={category}
        onChange={setCategory}
        options={[{ value: "all", label: m.all }, ...categories.map((item) => ({ value: item.id, label: item.name }))]}
      />
      <ul className="browse-list">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard productId={product.id} variant="horizontal" showRating={false} />
          </li>
        ))}
        {products.length === 0 && <li className="tile-muted">{t("No products match.")}</li>}
      </ul>
    </div>
  );
}

// Always about two days away, so the offer tile never expires.
const OFFER_ENDS = new Date(Date.now() + (2 * 24 + 5) * 3600 * 1000).toISOString();

const FAQ = [
  { question: "How long does delivery take?", answer: "Two to four working days in the city, five to seven elsewhere." },
  { question: "Can I return an opened product?", answer: "Yes, within 30 days, no questions asked." },
  { question: "Are the formulas vegan?", answer: "Every formula is vegan and made without fragrance oils." },
];

/** Real components on one shared demo store: add something in one card and the cart card updates. */
export function Showcase() {
  const t = useT();
  const faq = FAQ.map((item) => ({ question: t(item.question), answer: t(item.answer) }));
  return (
    <section className="showcase" id="showcase" aria-label="Component showcase">
      <div className="container wide">
        <LivePreview seed={(store) => store.addToCart("p6", 1)}>
          <div className="tiles">
            <Tile ids={["product.optionPicker", "commerce.quantityStepper", "commerce.addToCart"]}>
              <BuyBox />
            </Tile>
            <Tile ids={["cart.line", "cart.freeDeliveryProgress"]}>
              <MiniCart />
            </Tile>
            <Tile ids={["ui.countdown", "ui.badge"]} className="tile-offer">
              <div className="offer">
                <Badge tone="danger">{t("Autumn sale")}</Badge>
                <h3>{t("Up to 30% off candles")}</h3>
                <Countdown endsAt={OFFER_ENDS} />
              </div>
            </Tile>
            <Tile ids={["catalogue.search", "catalogue.categoryChips", "product.card"]}>
              <Browse />
            </Tile>
            <Tile ids={["product.card"]}>
              <div className="pair">
                <ProductCard productId="p1" variant="boxed" imageRatio="square" />
                <ProductCard productId="p3" variant="boxed" imageRatio="square" />
              </div>
            </Tile>
            <Tile ids={["ui.feature"]}>
              <div className="features">
                <Feature icon="truck" title={t("Free delivery")} text={t("On orders over $80")} />
                <Feature icon="refresh" title={t("30-day returns")} text={t("No questions asked")} />
                <Feature icon="shield" title={t("Secure payment")} text={t("Cards and cash on delivery")} />
              </div>
            </Tile>
            <Tile ids={["ui.accordion"]}>
              <Accordion items={faq} openFirst />
            </Tile>
          </div>
        </LivePreview>
        <p className="caption center">Every card above is a real component on one shared store. Add the perfume to the cart and watch the cart card.</p>
      </div>
    </section>
  );
}
