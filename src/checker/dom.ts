import type { CheckIssue } from "./types";

/** Turns HTML into a document. Browsers pass nothing; Node passes jsdom's parser. */
export type HtmlParser = (html: string) => Document;

export const browserParser: HtmlParser = (html) => new DOMParser().parseFromString(html, "text/html");

const INTERACTIVE = "a[href], button, input, select, textarea, summary";
const RAW_COLOR = /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i;

const accessibleName = (el: Element): string => {
  const label = el.getAttribute("aria-label");
  if (label?.trim()) return label.trim();
  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map((id) => el.ownerDocument.getElementById(id)?.textContent ?? "")
      .join(" ")
      .trim();
    if (text) return text;
  }
  const imgAlt = [...el.querySelectorAll("img[alt], [role=img][aria-label]")]
    .map((node) => node.getAttribute("alt") ?? node.getAttribute("aria-label") ?? "")
    .join(" ");
  return `${el.textContent ?? ""} ${imgAlt}`.trim();
};

/**
 * DOM rules every rendered component, section and page must pass. They are
 * the bugs that slip through review: a button with no name, a link that goes
 * nowhere, an input with no label, a hard-coded colour that breaks dark mode.
 */
export function checkDom(root: Element, where: string): { issues: CheckIssue[]; checks: number } {
  const issues: CheckIssue[] = [];
  const error = (rule: string, message: string) => issues.push({ severity: "error", rule, message, where });
  let checks = 0;

  checks += 1;
  if (root.children.length === 0) error("render.empty", "Rendered nothing. Every example must show something.");

  for (const button of root.querySelectorAll("button")) {
    checks += 1;
    if (!accessibleName(button)) error("a11y.button-name", `A <button> has no text or aria-label: ${button.outerHTML.slice(0, 120)}`);
    checks += 1;
    if (!button.getAttribute("type")) error("a11y.button-type", "A <button> has no type, so inside a form it would submit.");
  }

  for (const link of root.querySelectorAll("a")) {
    checks += 1;
    const href = link.getAttribute("href");
    if (!href || href === "#") error("a11y.link-href", `A link goes nowhere: ${link.outerHTML.slice(0, 120)}`);
    checks += 1;
    if (!accessibleName(link)) error("a11y.link-name", `A link has no text or aria-label: ${link.outerHTML.slice(0, 120)}`);
  }

  for (const img of root.querySelectorAll("img")) {
    checks += 1;
    if (!img.hasAttribute("alt")) error("a11y.img-alt", `An image has no alt (use alt="" if decorative): ${img.getAttribute("src")?.slice(0, 60)}`);
  }

  // aria-hidden fields are a widget's hidden form copy (e.g. Radix Select's native select): not exposed, not focusable.
  for (const field of root.querySelectorAll("input:not([type=hidden]):not([aria-hidden=true]), select:not([aria-hidden=true]), textarea")) {
    checks += 1;
    const id = field.getAttribute("id");
    const labelled =
      field.getAttribute("aria-label") ||
      field.getAttribute("aria-labelledby") ||
      field.closest("label") ||
      (id && root.ownerDocument.querySelector(`label[for="${id}"]`));
    if (!labelled) error("a11y.input-label", `A form field has no label: ${field.outerHTML.slice(0, 120)}`);
  }

  for (const el of root.querySelectorAll(INTERACTIVE)) {
    checks += 1;
    const parent = el.parentElement?.closest(INTERACTIVE);
    if (parent && !(el.tagName === "SUMMARY")) error("a11y.nested-interactive", `<${el.tagName.toLowerCase()}> is inside another control (<${parent.tagName.toLowerCase()}>).`);
  }

  const ids = new Map<string, number>();
  for (const el of root.querySelectorAll("[id]")) ids.set(el.id, (ids.get(el.id) ?? 0) + 1);
  for (const [id, count] of ids) {
    checks += 1;
    if (count > 1) error("a11y.duplicate-id", `id="${id}" is used ${count} times.`);
  }

  for (const el of root.querySelectorAll("[aria-labelledby], [aria-controls]")) {
    for (const attr of ["aria-labelledby", "aria-controls"]) {
      const value = el.getAttribute(attr);
      if (!value) continue;
      checks += 1;
      const missing = value.split(/\s+/).filter((id) => !root.ownerDocument.getElementById(id));
      // aria-controls may point at a panel that only exists while open.
      if (missing.length && attr === "aria-labelledby") error("a11y.aria-reference", `${attr} points at missing id(s): ${missing.join(", ")}`);
    }
  }

  for (const el of root.querySelectorAll("[style]")) {
    checks += 1;
    const style = el.getAttribute("style") ?? "";
    // The provider's own variables are the only place raw colours may live.
    if (!el.classList.contains("msu-root") && RAW_COLOR.test(style.replace(/url\([^)]*\)/g, ""))) {
      error("style.inline-color", `Inline style hard-codes a colour, which breaks themes and dark mode: ${style.slice(0, 100)}`);
    }
  }

  return { issues, checks };
}

export const countHeadings = (root: Element, level: number) => root.querySelectorAll(`h${level}`).length;
