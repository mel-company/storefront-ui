import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { Storefront, createDemoStore, type Language, type LinkProps, type StoreClient, type Theme } from "../../src";
import { useSettings } from "../settings";

const ARABIC_FONT = '"IBM Plex Sans Arabic"';

export type Navigate = (href: string) => void;

/** A demo store whose links stay inside the preview instead of changing the page URL. */
function useDemoStore(language: Language, onNavigate?: Navigate, seed?: (store: StoreClient) => void): StoreClient {
  const [stores] = useState(() => new Map<Language, StoreClient>());
  // One store per language, so switching back keeps that cart.
  let store = stores.get(language);
  if (!store) {
    store = createDemoStore({ language });
    seed?.(store);
    stores.set(language, store);
  }
  return useMemo(() => {
    function PreviewLink({ href, children, ...rest }: LinkProps) {
      const external = /^https?:/.test(href) || href.startsWith("tel:") || href.startsWith("mailto:");
      const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (external) return;
        event.preventDefault();
        onNavigate?.(href);
      };
      return (
        <a href={href} onClick={onClick} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
          {children}
        </a>
      );
    }
    return { ...store, Link: PreviewLink };
  }, [store, onNavigate]);
}

export interface LivePreviewProps {
  children: ReactNode;
  onNavigate?: Navigate;
  seed?: (store: StoreClient) => void;
  /** Use this theme instead of the gallery's. */
  theme?: Theme;
}

/** Library content under the gallery's current theme, mode and direction. */
export function LivePreview({ children, onNavigate, seed, theme: override }: LivePreviewProps) {
  const settings = useSettings();
  const { mode, dir, lang } = settings;
  const store = useDemoStore(lang, onNavigate, seed);
  const base = override ?? settings.theme;
  // Arabic text gets an Arabic face in front of the theme's own fonts.
  const theme = useMemo(
    () =>
      lang === "ar"
        ? { ...base, fonts: { heading: `${ARABIC_FONT}, ${base.fonts.heading}`, body: `${ARABIC_FONT}, ${base.fonts.body}` } }
        : base,
    [base, lang],
  );
  return (
    <Storefront store={store} theme={theme} mode={mode} dir={dir}>
      {children}
    </Storefront>
  );
}
