import { CopyButton } from "./CodeBlock";

const INSTALL = "npm install @mel-company/storefront-ui";

/** Code-drawn illustration: components, sections and a page stacked as glass layers, with the checker scanning the top one. */
function LayerStack() {
  return (
    <div className="stack-art" aria-hidden="true">
      <div className="stack-glow" />
      <div className="stack-scene">
        <div className="plane plane-1">
          <div className="pl-grid">
            <span className="w-btn" />
            <span className="w-pill" />
            <span className="w-stars">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="w-toggle" />
            <span className="w-chip" />
            <span className="w-chip" />
            <span className="w-step">
              <i />
              <i />
              <i />
            </span>
            <span className="w-card" />
          </div>
        </div>
        <div className="plane plane-2">
          <div className="pl-sections">
            <span className="s-hero">
              <i />
              <b />
            </span>
            <span className="s-row">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="s-strip" />
          </div>
        </div>
        <div className="plane plane-3">
          <div className="pl-page">
            <span className="p-bar" />
            <span className="p-hero">
              <i />
              <b />
            </span>
            <span className="p-row">
              <i />
              <i />
              <i />
            </span>
            <span className="p-foot" />
          </div>
          <div className="scan" />
        </div>
      </div>
      <ul className="stack-labels">
        <li className="lb-3">
          <span>Page</span> JSON
        </li>
        <li className="lb-2">
          <span>Sections</span> 16
        </li>
        <li className="lb-1">
          <span>Components</span> 19
        </li>
      </ul>
      <div className="check-chip">
        <svg width="14" height="14" viewBox="0 0 16 16">
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All checks passed
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-inner">
        <a className="announce" href="#mcp">
          <span className="dot" aria-hidden="true" />
          MCP server for AI agents
          <span aria-hidden="true">→</span>
        </a>
        <h1 id="hero-title">Build your store from parts that already work</h1>
        <p className="lead">
          Components, sections and pages with cart, stock and filters built in. Describe a page as JSON, by hand or with an AI agent,
          and the checker proves it renders before it ships.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary btn-lg" href="https://github.com/mel-company/storefront-ui#readme">
            Get started
          </a>
          <a className="btn btn-lg" href="#components">
            Browse components
          </a>
        </div>
        <div className="cmd">
          <code>
            <span className="muted" aria-hidden="true">
              ${" "}
            </span>
            {INSTALL}
          </code>
          <CopyButton text={INSTALL} />
        </div>
        <LayerStack />
      </div>
    </section>
  );
}
