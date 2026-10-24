/** Colour maths used by the theme checker. Hex only: themes are data an AI writes. */

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export const isHexColor = (value: string): boolean => HEX.test(value);

/** `#abc` or `#aabbcc` to 0–255 channels. */
export function hexToRgb(hex: string): [number, number, number] {
  if (!isHexColor(hex)) throw new Error(`Not a hex colour: ${hex}`);
  const body = hex.slice(1);
  const full = body.length === 3 ? [...body].map((c) => c + c).join("") : body;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** WCAG 2.x relative luminance. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
