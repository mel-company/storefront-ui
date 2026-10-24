import { builtInRegistry } from "../../src";
import { CodeBlock } from "./CodeBlock";
import { highlightTsx } from "./Highlight";

const USAGE = `import "@mel-company/storefront-ui/style.css";
import { PageRenderer, Storefront, themes } from "@mel-company/storefront-ui";
import { store } from "./store"; // your StoreClient
import home from "./pages/home.json";

export function App() {
  return (
    <Storefront store={store} theme={themes.porcelain} mode="system" dir="rtl">
      <PageRenderer composition={home} />
    </Storefront>
  );
}`;

const LAYERS = [
  {
    name: "Components",
    count: builtInRegistry.components.size,
    text: "Price, rating, add to cart, product card, option picker, countdown. They read products, stock and the cart from the store, never from props.",
  },
  {
    name: "Sections",
    count: builtInRegistry.sections.size,
    text: "Full-width blocks made of components: header, hero, product grid, catalogue with filters, bundle builder, product detail, cart.",
  },
  {
    name: "Pages",
    count: builtInRegistry.pages.size,
    text: "An ordered list of sections with their props, stored as JSON. This is what the editor saves and what an agent writes.",
  },
];

export function Overview() {
  return (
    <section className="block" id="overview" aria-labelledby="overview-title">
      <div className="container">
        <header className="block-head">
          <h2 id="overview-title">How it fits together</h2>
          <p className="muted">Three layers. Each one is built only from the layer below it.</p>
        </header>
        <div className="overview">
          <dl className="layers">
            {LAYERS.map((layer) => (
              <div key={layer.name}>
                <dt>
                  {layer.name} <span className="muted">{layer.count}</span>
                </dt>
                <dd>{layer.text}</dd>
              </div>
            ))}
          </dl>
          <CodeBlock label="App.tsx" code={USAGE}>
            {highlightTsx(USAGE)}
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}
