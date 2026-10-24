import { builtInRegistry } from "../../src";
import { CopyButton } from "./CodeBlock";
import { Playground } from "./Playground";

const INSTALL = "npm install @mel-company/storefront-ui";

export function Hero() {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="container">
        <p className="meta">
          v0.1.0 · React 18 · TypeScript · {builtInRegistry.components.size} components, {builtInRegistry.sections.size} sections,{" "}
          {builtInRegistry.pages.size} pages
        </p>
        <h1 id="intro-title">React building blocks for online stores</h1>
        <p className="lead">
          Components, sections and pages with cart, stock, options and filters already wired. Every piece has a props schema, so
          developers and AI agents describe a page as JSON and a checker validates it before it ships.
        </p>
        <div className="intro-actions">
          <div className="cmd">
            <code>
              <span className="muted" aria-hidden="true">
                ${" "}
              </span>
              {INSTALL}
            </code>
            <CopyButton text={INSTALL} />
          </div>
          <a className="btn btn-primary" href="https://github.com/mel-company/storefront-ui#readme">
            Documentation
          </a>
          <a className="btn" href="#components">
            Browse components
          </a>
        </div>
      </div>
      <div className="container wide">
        <Playground />
        <p className="caption">
          Edit the JSON and the page re-renders and re-validates. Links in the preview work: open a product, filter the catalogue, fill
          the cart.
        </p>
      </div>
    </section>
  );
}
