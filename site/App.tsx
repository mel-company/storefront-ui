import { lazy, Suspense } from "react";
import { AgentPanel } from "./parts/AgentPanel";
import { Checker } from "./parts/Checker";
import { Controls } from "./parts/Controls";
import { Footer } from "./parts/Footer";
import { Gallery } from "./parts/Gallery";
import { Hero } from "./parts/Hero";
import { Logo } from "./parts/Logo";
import { Overview } from "./parts/Overview";
import { PlaygroundSection } from "./parts/PlaygroundSection";
import { Showcase } from "./parts/Showcase";
import { ThemeLab } from "./parts/ThemeLab";
import type { DocsKind } from "./docs/Docs";
import { useReveal } from "./reveal";
import { Link, useAnchorScroll, usePath } from "./router";
import { SettingsProvider } from "./settings";

const DOCS_NAV = [
  { href: "/components", label: "Components" },
  { href: "/sections", label: "Sections" },
  { href: "/pages", label: "Pages" },
];

const SITE_NAV = [
  { href: "/#playground", label: "Playground" },
  { href: "/#checker", label: "Checker" },
  { href: "/#theming", label: "Theming" },
  { href: "/#mcp", label: "MCP" },
];

// Docs carry the library's source text, so they load only when opened.
const Docs = lazy(() => import("./docs/Docs").then((module) => ({ default: module.Docs })));

const DOCS_PATH = /^\/(components|sections|pages)(?:\/([^/]+))?\/?$/;

function Landing() {
  useReveal();
  return (
    <main id="content">
      <span id="top" />
      <Hero />
      <Showcase />
      <PlaygroundSection />
      <Overview />
      <Gallery />
      <Checker />
      <ThemeLab />
      <AgentPanel />
    </main>
  );
}

function Shell() {
  const path = usePath();
  useAnchorScroll(path);
  const docs = path.match(DOCS_PATH);
  return (
    <div className="site">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container bar">
          <Link href="/" className="brand" aria-label="storefront-ui home">
            <Logo />
          </Link>
          <nav aria-label="Site" className="site-nav">
            {DOCS_NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-current={docs && item.href === `/${docs[1]}` ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            <span className="nav-sep" aria-hidden="true" />
            {SITE_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/components" className="nav-docs">
            Docs
          </Link>
          <Controls />
          <a className="gh" href="https://github.com/mel-company/storefront-ui" aria-label="GitHub repository">
            <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              />
            </svg>
          </a>
        </div>
      </header>
      {docs ? (
        <Suspense fallback={<div className="docs-loading" />}>
          <Docs kind={docs[1] as DocsKind} id={docs[2] && decodeURIComponent(docs[2])} />
        </Suspense>
      ) : (
        <Landing key={path} />
      )}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <SettingsProvider>
      <Shell />
    </SettingsProvider>
  );
}
