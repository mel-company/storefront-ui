import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
};

/** The site's current path, e.g. `/components/product.card`. */
export function usePath(): string {
  return useSyncExternalStore(subscribe, () => window.location.pathname);
}

export function navigate(href: string) {
  const url = new URL(href, window.location.href);
  const samePage = url.pathname === window.location.pathname;
  window.history.pushState(null, "", url);
  if (samePage) {
    // Same page: glide to the anchor (the stylesheet's smooth scrolling, off under reduced motion).
    if (url.hash) document.getElementById(url.hash.slice(1))?.scrollIntoView();
    return;
  }
  listeners.forEach((listener) => listener());
  // `useAnchorScroll` jumps to the anchor once the new page has rendered.
  if (!url.hash) window.scrollTo(0, 0);
}

/** A link that changes page without a reload. Plain anchors (`#id`) and other sites behave as usual. */
export function Link({ href, onClick, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const internal = href.startsWith("/");
  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!internal || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    navigate(href);
  };
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}

/** After each page change (and on first load), scroll to the anchor in the URL. */
export function useAnchorScroll(path: string) {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Previews above the anchor grow as their frames load, so keep it in view for a moment, unless the reader scrolls.
    // Instant, because each smooth scroll would cancel the one before it.
    const timers = [0, 150, 400, 900, 1500].map((delay) =>
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant" }), delay),
    );
    const stop = () => timers.forEach((timer) => window.clearTimeout(timer));
    window.addEventListener("wheel", stop, { once: true, passive: true });
    window.addEventListener("touchstart", stop, { once: true, passive: true });
    return () => {
      stop();
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
    };
  }, [path]);
}
