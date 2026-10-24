/** Joins class names, skipping falsy ones. */
export const cx = (...classes: (string | false | null | undefined)[]): string =>
  classes.filter(Boolean).join(" ");

/** Stable, readable id for headings and anchors. */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
