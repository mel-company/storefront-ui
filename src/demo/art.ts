/**
 * Product and banner pictures drawn in code, so demos need no stock images
 * and no network. Each is a small SVG data URI.
 */

type Shape = "bottle" | "jar" | "candle" | "bag" | "tube" | "vase";

const SHAPES: Record<Shape, string> = {
  bottle:
    '<rect x="168" y="70" width="64" height="40" rx="8" fill="#0002"/><rect x="130" y="108" width="140" height="210" rx="30" fill="#fff" fill-opacity=".9"/><rect x="152" y="180" width="96" height="60" rx="8" fill="#0001"/>',
  jar:
    '<rect x="120" y="120" width="160" height="46" rx="14" fill="#0003"/><rect x="108" y="160" width="184" height="150" rx="36" fill="#fff" fill-opacity=".92"/><rect x="138" y="210" width="124" height="44" rx="8" fill="#0001"/>',
  candle:
    '<path d="M200 70c14 18 14 34 0 44-14-10-14-26 0-44Z" fill="#ffb347"/><rect x="196" y="112" width="8" height="22" fill="#0004"/><rect x="118" y="134" width="164" height="180" rx="20" fill="#fff" fill-opacity=".92"/>',
  bag:
    '<path d="M160 140v-22a40 40 0 0 1 80 0v22" fill="none" stroke="#0004" stroke-width="12"/><rect x="104" y="138" width="192" height="176" rx="22" fill="#fff" fill-opacity=".92"/>',
  tube:
    '<rect x="176" y="72" width="48" height="36" rx="6" fill="#0003"/><path d="M150 108h100l-12 210h-76Z" fill="#fff" fill-opacity=".92"/>',
  vase:
    '<path d="M168 80h64v30c40 30 52 80 40 130-8 36-28 70-72 70s-64-34-72-70c-12-50 0-100 40-130Z" fill="#fff" fill-opacity=".9"/>',
};

export function productArt(from: string, to: string, shape: Shape): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><ellipse cx="200" cy="330" rx="120" ry="18" fill="#0002"/>${SHAPES[shape]}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** A wide, soft banner for heroes and editorial blocks. */
export function bannerArt(from: string, to: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><radialGradient id="a" cx=".25" cy=".3" r=".7"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="1200" height="800" fill="url(#b)"/><rect width="1200" height="800" fill="url(#a)"/><circle cx="860" cy="420" r="230" fill="#fff" fill-opacity=".18"/><rect x="760" y="260" width="200" height="320" rx="60" fill="#fff" fill-opacity=".85"/><rect x="560" y="420" width="160" height="200" rx="40" fill="#fff" fill-opacity=".6"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
