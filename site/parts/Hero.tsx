import { useState } from "react";
import { compositionOf, homeClassic, PageRenderer, ProductCard, themes, type ThemeId } from "../../src";
import { CopyButton } from "./CodeBlock";
import { Frame } from "./Frame";
import { LivePreview } from "./LivePreview";

const INSTALL = "npm install @mel-company/storefront-ui";
const THEME_IDS = Object.keys(themes) as ThemeId[];

/**
 * The real home page in a browser window, cycling through the theme presets.
 * The progress bar's animationend advances the theme, so hovering pauses both
 * and reduced motion leaves it on the first theme.
 */
function HeroStage() {
  const [index, setIndex] = useState(0);
  const theme = themes[THEME_IDS[index]!];
  const next = () => setIndex((current) => (current + 1) % THEME_IDS.length);

  return (
    <div className="stage">
      <div className="stage-glow" aria-hidden="true" />
      <div className="window">
        <div className="window-bar">
          <span className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="window-url">atelier.store</span>
          <span className="window-theme" key={theme.id}>
            {theme.name}
          </span>
        </div>
        <div className="window-body" aria-hidden="true">
          <Frame width={1280} title="Home page preview" maxHeight={900}>
            <LivePreview theme={theme}>
              <PageRenderer composition={compositionOf(homeClassic)} />
            </LivePreview>
          </Frame>
        </div>
      </div>

      <div className="float float-card" aria-hidden="true">
        <LivePreview theme={theme}>
          <ProductCard productId="p4" variant="boxed" imageRatio="square" showQuickAdd={false} />
        </LivePreview>
      </div>

      <div className="float float-toast" aria-hidden="true">
        <span className="toast-icon">
          <svg width="14" height="14" viewBox="0 0 16 16">
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>
          <strong>home.classic</strong>
          <span className="muted">Valid in light, dark, LTR and RTL</span>
        </span>
      </div>

      <div className="float float-code" aria-hidden="true">
        <span className="tok-key">"section"</span>: <span className="tok-str">"products.grid"</span>,
        <br />
        <span className="tok-key">"source"</span>: {"{ "}
        <span className="tok-key">"tag"</span>: <span className="tok-str">"bestseller"</span>
        {" }"}
      </div>

      <div className="theme-picker" role="group" aria-label="Preview theme">
        {THEME_IDS.map((id, i) => (
          <button key={id} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}>
            <span className="swatch-dot" style={{ background: themes[id].colors.light.accent }} aria-hidden="true" />
            {themes[id].name}
            {i === index && <span className="progress" onAnimationEnd={next} aria-hidden="true" />}
          </button>
        ))}
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
      </div>
      <div className="container wide">
        <HeroStage />
      </div>
    </section>
  );
}
