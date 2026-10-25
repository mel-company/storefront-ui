/**
 * Product and banner pictures drawn in code, so demos need no stock images
 * and no network. Each is a small SVG data URI: a studio shot with a wall,
 * a floor, a soft shadow and a shaded product.
 */

type Shape = "bottle" | "jar" | "candle" | "bag" | "tube" | "vase";

/** Mixes two #rrggbb colours; `t` is how much of `b`. */
function mix(a: string, b: string, t: number): string {
  const channel = (hex: string, index: number) => parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
  return `#${[0, 1, 2]
    .map((index) => Math.round(channel(a, index) * (1 - t) + channel(b, index) * t).toString(16).padStart(2, "0"))
    .join("")}`;
}

const WHITE = "#ffffff";
const INK = "#1d1b22";

/** A left-to-right gradient that makes a flat shape read as a lit cylinder. */
function round(id: string, base: string): string {
  return `<linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${mix(base, INK, 0.16)}"/><stop offset=".22" stop-color="${mix(base, WHITE, 0.35)}"/><stop offset=".38" stop-color="${base}"/><stop offset=".8" stop-color="${mix(base, INK, 0.1)}"/><stop offset="1" stop-color="${mix(base, INK, 0.24)}"/></linearGradient>`;
}

function label(x: number, y: number, width: number, color: string): string {
  const center = x + width / 2;
  return `<text x="${center}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${Math.round(width / 6.4)}" letter-spacing="3" fill="${color}">ATELIER</text><rect x="${center - width * 0.22}" y="${y + 10}" width="${width * 0.44}" height="3" rx="1.5" fill="${color}" fill-opacity=".5"/><rect x="${center - width * 0.14}" y="${y + 19}" width="${width * 0.28}" height="3" rx="1.5" fill="${color}" fill-opacity=".35"/>`;
}

/** Each shape's own gradients and its drawing, standing on y = 318 around x = 200. */
function drawShape(shape: Shape, tint: string, p: string): { defs: string; body: string } {
  const dark = mix(tint, INK, 0.45);
  switch (shape) {
    case "jar":
      return {
        defs: round(`${p}lid`, mix(tint, INK, 0.12)) + round(`${p}body`, "#f7f4f1"),
        body: `<rect x="112" y="150" width="176" height="44" rx="10" fill="url(#${p}lid)"/>${[0, 1, 2, 3, 4, 5, 6]
          .map((index) => `<rect x="${124 + index * 24}" y="154" width="3" height="36" rx="1.5" fill="#000" fill-opacity=".07"/>`)
          .join("")}<rect x="102" y="190" width="196" height="128" rx="30" fill="url(#${p}body)"/><rect x="102" y="226" width="196" height="56" fill="${mix(tint, WHITE, 0.55)}" fill-opacity=".9"/>${label(130, 252, 140, dark)}<rect x="126" y="200" width="10" height="104" rx="5" fill="#fff" fill-opacity=".55"/>`,
      };
    case "bottle":
      return {
        defs:
          round(`${p}glass`, mix(tint, WHITE, 0.25)) +
          `<linearGradient id="${p}cap" x1="0" x2="1"><stop offset="0" stop-color="#8a6a3c"/><stop offset=".3" stop-color="#f3dca6"/><stop offset=".55" stop-color="#c8a062"/><stop offset="1" stop-color="#6e5330"/></linearGradient>`,
        body: `<rect x="176" y="96" width="48" height="58" rx="6" fill="url(#${p}cap)"/><rect x="188" y="150" width="24" height="16" fill="${mix(tint, INK, 0.25)}"/><rect x="128" y="162" width="144" height="156" rx="22" fill="url(#${p}glass)" fill-opacity=".92"/><rect x="138" y="196" width="124" height="112" rx="14" fill="${mix(tint, INK, 0.08)}" fill-opacity=".55"/><rect x="152" y="214" width="96" height="58" rx="4" fill="#fffdf8"/>${label(152, 240, 96, dark)}<rect x="140" y="172" width="9" height="132" rx="4.5" fill="#fff" fill-opacity=".6"/>`,
      };
    case "tube":
      return {
        defs: round(`${p}tube`, "#f8f5f2") + round(`${p}cap`, mix(tint, INK, 0.1)),
        body: `<rect x="146" y="72" width="108" height="16" rx="3" fill="${mix(tint, WHITE, 0.4)}"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8]
          .map((index) => `<rect x="${152 + index * 11}" y="74" width="2" height="12" fill="#000" fill-opacity=".08"/>`)
          .join("")}<path d="M148 88h104l-16 196h-72Z" fill="url(#${p}tube)"/><path d="M156 150h88l-6 76h-76Z" fill="${mix(tint, WHITE, 0.45)}"/>${label(160, 182, 80, dark)}<rect x="162" y="280" width="76" height="38" rx="6" fill="url(#${p}cap)"/><path d="M160 96h8l-12 180h-6Z" fill="#fff" fill-opacity=".5"/>`,
      };
    case "candle":
      return {
        defs:
          round(`${p}glass`, mix(tint, WHITE, 0.2)) +
          `<radialGradient id="${p}glow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient><linearGradient id="${p}flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a3d"/><stop offset=".6" stop-color="#ffc35c"/><stop offset="1" stop-color="#fff1c4"/></linearGradient>`,
        body: `<circle cx="200" cy="112" r="56" fill="url(#${p}glow)"/><path d="M200 82c12 16 13 30 0 40-13-10-12-24 0-40Z" fill="url(#${p}flame)"/><rect x="198" y="120" width="4" height="40" rx="2" fill="#3a2f28"/><rect x="116" y="150" width="168" height="168" rx="18" fill="url(#${p}glass)"/><ellipse cx="200" cy="164" rx="76" ry="10" fill="#fbf6ec"/><rect x="124" y="164" width="152" height="146" rx="12" fill="#fbf6ec" fill-opacity=".55"/><rect x="138" y="214" width="124" height="60" rx="4" fill="#fffdf8"/>${label(138, 242, 124, dark)}<rect x="128" y="166" width="10" height="138" rx="5" fill="#fff" fill-opacity=".5"/>`,
      };
    case "bag":
      return {
        defs: round(`${p}cloth`, mix(tint, WHITE, 0.3)),
        body: `<path d="M158 168c0-70 84-70 84 0" fill="none" stroke="${mix(tint, INK, 0.3)}" stroke-width="11" stroke-linecap="round"/><path d="M110 166h180l12 152H98Z" fill="url(#${p}cloth)"/><path d="M114 180h172" stroke="${mix(tint, INK, 0.25)}" stroke-width="2" stroke-dasharray="7 6" fill="none" stroke-opacity=".6"/><rect x="146" y="218" width="108" height="56" rx="4" fill="#fffdf8" fill-opacity=".92"/>${label(146, 244, 108, dark)}`,
      };
    case "vase":
      return {
        defs: round(`${p}clay`, mix(tint, WHITE, 0.15)),
        body: `<path d="M196 150c-6-40-18-70-40-96M204 150c4-46 20-76 44-104M200 150c0-40 2-70-2-104" fill="none" stroke="${mix(tint, INK, 0.5)}" stroke-width="3" stroke-linecap="round"/>${[
          [156, 54],
          [248, 46],
          [198, 46],
          [170, 80],
          [236, 76],
        ]
          .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="${mix(tint, INK, 0.35)}" transform="rotate(-30 ${x} ${y})"/>`)
          .join("")}<path d="M172 140h56v18c44 26 58 78 46 118-8 28-30 42-74 42s-66-14-74-42c-12-40 2-92 46-118Z" fill="url(#${p}clay)"/><path d="M146 196c-10 28-8 62 4 88" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="9" stroke-linecap="round"/>`,
      };
  }
}

/** The wall, the floor and the shadow every product stands in. */
function studio(width: number, height: number, from: string, to: string, floorY: number): { defs: string; body: string } {
  return {
    defs: `<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(from, WHITE, 0.35)}"/><stop offset="1" stop-color="${from}"/></linearGradient><linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(from, to, 0.28)}"/><stop offset="1" stop-color="${mix(from, to, 0.62)}"/></linearGradient><radialGradient id="light" cx=".3" cy=".2" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>`,
    body: `<rect width="${width}" height="${height}" fill="url(#wall)"/><rect y="${floorY}" width="${width}" height="${height - floorY}" fill="url(#floor)"/><rect width="${width}" height="${height}" fill="url(#light)"/>`,
  };
}

function shadow(x: number, y: number, rx: number): string {
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.12}" fill="#000" fill-opacity=".22" filter="url(#soft)"/>`;
}

function uri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function productArt(from: string, to: string, shape: Shape): string {
  const room = studio(400, 400, from, to, 286);
  const item = drawShape(shape, to, "p");
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs>${room.defs}${item.defs}</defs>${room.body}${shadow(200, 320, 116)}${item.body}</svg>`,
  );
}

/** A wide studio scene for heroes and editorial blocks: three products on plinths. */
export function bannerArt(from: string, to: string, accent: string): string {
  const room = studio(1200, 800, from, to, 560);
  // Shape, centre x, where its plinth starts, scale.
  const products: [Shape, number, number, number][] = [
    ["bottle", 560, 600, 1.4],
    ["jar", 790, 650, 1.2],
    ["candle", 1000, 615, 1],
  ];
  const plinth = (x: number, top: number, width: number) =>
    `<rect x="${x}" y="${top}" width="${width}" height="${800 - top}" fill="url(#plinth)"/><ellipse cx="${x + width / 2}" cy="${top}" rx="${width / 2}" ry="${width * 0.08}" fill="${mix(from, WHITE, 0.6)}"/>`;
  const drawn = products.map(([shape, x, base, scale], index) => {
    const item = drawShape(shape, to, `b${index}`);
    const left = x - 200 * scale;
    const y = base - 318 * scale;
    return {
      defs: item.defs,
      body: `${plinth(left + 60 * scale, y + 318 * scale, 280 * scale)}${shadow(x, y + 320 * scale, 110 * scale)}<g transform="translate(${left} ${y}) scale(${scale})">${item.body}</g>`,
    };
  });
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs>${room.defs}${round("plinth", mix(from, WHITE, 0.25))}<radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${accent}" stop-opacity=".9"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>${drawn.map((item) => item.defs).join("")}</defs>${room.body}<circle cx="820" cy="330" r="360" fill="url(#halo)"/>${drawn.map((item) => item.body).join("")}</svg>`,
  );
}
