import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <Logo />
      <p className="muted small">Components, sections and pages for storefronts. Built to be composed by people and by agents.</p>
      <a className="muted small" href="https://github.com/mel-company/storefront-ui">
        GitHub
      </a>
    </footer>
  );
}
