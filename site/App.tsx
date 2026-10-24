import { AgentPanel } from "./parts/AgentPanel";
import { Controls } from "./parts/Controls";
import { Footer } from "./parts/Footer";
import { Gallery } from "./parts/Gallery";
import { Hero } from "./parts/Hero";
import { Layers } from "./parts/Layers";
import { Logo } from "./parts/Logo";
import { RunAll } from "./parts/RunAll";
import { ThemeLab } from "./parts/ThemeLab";
import { SettingsProvider, useSettings } from "./settings";

function Shell() {
  const { dir } = useSettings();
  return (
    <div className="site">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Storefront UI home">
          <Logo />
        </a>
        <nav aria-label="Sections" className="site-nav">
          <a href="#gallery">Gallery</a>
          <a href="#themes">Themes</a>
          <a href="#agents">Agents</a>
        </nav>
        <Controls />
      </header>
      <main id="content" data-preview-dir={dir}>
        <span id="top" />
        <Hero />
        <Layers />
        <Gallery />
        <div className="block">
          <RunAll />
        </div>
        <ThemeLab />
        <AgentPanel />
      </main>
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
