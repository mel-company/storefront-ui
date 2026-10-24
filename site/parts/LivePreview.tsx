import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { Storefront, createDemoStore, type LinkProps, type StoreClient, type Theme } from "../../src";
import { useSettings } from "../settings";

export type Navigate = (href: string) => void;

/** A demo store whose links stay inside the preview instead of changing the page URL. */
function useDemoStore(onNavigate?: Navigate, seed?: (store: StoreClient) => void): StoreClient {
  const [store] = useState(() => {
    const base = createDemoStore();
    seed?.(base);
    return base;
  });
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
  /** Overrides the site-wide theme, e.g. for the hero's theme carousel. */
  theme?: Theme;
}

/** Library content under the gallery's current theme, mode and direction. */
export function LivePreview({ children, onNavigate, seed, theme: themeOverride }: LivePreviewProps) {
  const { theme: siteTheme, mode, dir } = useSettings();
  const theme = themeOverride ?? siteTheme;
  const store = useDemoStore(onNavigate, seed);
  return (
    <Storefront store={store} theme={theme} mode={mode} dir={dir}>
      {children}
    </Storefront>
  );
}
