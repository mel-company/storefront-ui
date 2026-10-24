import { builtInRegistry, compositionOf, homeClassic, PageRenderer } from "../../src";
import { CodeBlock } from "./CodeBlock";
import { Frame } from "./Frame";
import { LivePreview } from "./LivePreview";

const counts = [
  { value: builtInRegistry.components.size, label: "components" },
  { value: builtInRegistry.sections.size, label: "sections" },
  { value: builtInRegistry.pages.size, label: "pages" },
  { value: 4, label: "themes, light + dark" },
];

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-copy">
        <p className="pill">For developers and AI agents</p>
        <h1 id="hero-title">
          Storefronts from <span className="gradient-text">checked parts</span>, not generated code.
        </h1>
        <p className="lead">
          Components, sections and pages with the shop logic built in: cart, stock, options, filters, bundles. Agents compose them
          from a schema; a checker proves every result renders, reads well in light and dark, and works right to left.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#gallery">
            Open the gallery
          </a>
          <a className="btn btn-ghost" href="#agents">
            Use it from an agent
          </a>
        </div>
        <ul className="stats">
          {counts.map((item) => (
            <li key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <CodeBlock label="Install" code="npm install @mel-company/storefront-ui" />
      </div>
      <div className="hero-visual glass" aria-label="Live home page preview">
        <div className="window-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <Frame width={1280} title="Home page preview" maxHeight={1100}>
          <LivePreview>
            <PageRenderer composition={compositionOf(homeClassic)} />
          </LivePreview>
        </Frame>
      </div>
    </section>
  );
}
