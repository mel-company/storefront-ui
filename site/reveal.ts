import { useEffect } from "react";

/** Fades `.reveal` elements and section headings in as they scroll into view. Without IntersectionObserver everything just shows. */
export function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal, .block-head");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}
