import { builtInRegistry } from "../../src";

const LAYERS = [
  {
    name: "Components",
    count: builtInRegistry.components.size,
    text: "The smallest parts: price, rating, add to cart, product card, option picker, countdown. Each reads the store through hooks, so it shows real products and real stock.",
    sample: "product.card · commerce.addToCart · cart.freeDeliveryProgress",
  },
  {
    name: "Sections",
    count: builtInRegistry.sections.size,
    text: "Components put together into full-width blocks with their own logic: a catalogue with search and filters, a build-your-set bundle, a product page with a sticky buy bar.",
    sample: "catalogue.browse · bundle.builder · product.detail",
  },
  {
    name: "Pages",
    count: builtInRegistry.pages.size,
    text: "Sections in order, saved as plain JSON. An agent reorders, swaps and fills them; the page checker holds it to one h1, one header, one footer and valid props.",
    sample: "home.classic · catalogue.default · cart.default",
  },
];

export function Layers() {
  return (
    <section className="block" aria-labelledby="layers-title">
      <div className="block-head">
        <p className="eyebrow">Three layers</p>
        <h2 id="layers-title">Small parts, put together twice</h2>
      </div>
      <ol className="layers">
        {LAYERS.map((layer, index) => (
          <li key={layer.name} className="glass layer">
            <span className="layer-step">{index + 1}</span>
            <h3>
              {layer.name} <span className="count">{layer.count}</span>
            </h3>
            <p className="muted">{layer.text}</p>
            <code className="small">{layer.sample}</code>
          </li>
        ))}
      </ol>
    </section>
  );
}
