import { useEffect, type KeyboardEvent, type RefObject } from "react";

/**
 * Some hosts render the store from their own page into an iframe through a
 * React portal: an editor canvas, a docs preview. The store's elements then
 * live in the frame's document while the script, `window`, `document` and
 * `Node` are the parent page's. Radix reads those globals, so inside such a
 * frame a few of its behaviours break; these hooks put them back. They do
 * nothing for a store on its own page or running inside its own frame.
 */
export const isFramed = (node: Node | null | undefined): node is Node => Boolean(node && node.ownerDocument !== document);

/**
 * Radix Select closes when `window` blurs, and the click that moves focus
 * into the frame blurs the parent page's window, so a list would close as it
 * opened. Swallows that one blur.
 */
export function useFramedBlurGuard(node: HTMLElement | null) {
  useEffect(() => {
    if (!isFramed(node)) return;
    const frame = node.ownerDocument.defaultView?.frameElement;
    if (!frame) return;
    const keep = (event: FocusEvent) => {
      if (event.target === window && document.activeElement === frame) event.stopImmediatePropagation();
    };
    window.addEventListener("blur", keep, true);
    return () => window.removeEventListener("blur", keep, true);
  }, [node]);
}

/**
 * Radix ignores presses outside a popup when the pressed element is not an
 * `instanceof Node` of the parent page, which no element in the frame is.
 * Closes the popup on a press outside `inside` while it is open.
 */
export function useFramedOutsidePress(node: HTMLElement | null, open: boolean, inside: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open || !isFramed(node)) return;
    const doc = node.ownerDocument;
    const press = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !inside.current?.contains(target)) close();
    };
    doc.addEventListener("pointerdown", press, true);
    return () => doc.removeEventListener("pointerdown", press, true);
  }, [node, open, inside, close]);
}

const TABBABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Radix keeps Tab inside a dialog by comparing against the parent page's
 * `document.activeElement`, which inside the frame is the frame itself.
 * Wraps Tab and Shift+Tab inside `panel` instead. For a `keydown` handler.
 */
export function trapFramedTab(event: KeyboardEvent, panel: HTMLElement) {
  if (event.key !== "Tab" || !isFramed(panel)) return;
  const items = Array.from(panel.querySelectorAll<HTMLElement>(TABBABLE)).filter((item) => !item.closest("[hidden]"));
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return;
  const active = panel.ownerDocument.activeElement;
  if (event.shiftKey && (active === first || active === panel)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
