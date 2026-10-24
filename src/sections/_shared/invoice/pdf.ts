/** One page image for `buildPdf`: JPEG bytes and its size in pixels. */
export interface PdfImage {
  jpeg: Uint8Array;
  width: number;
  height: number;
}

/** A4 in points. */
const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = 28;

const encoder = new TextEncoder();

/**
 * A minimal PDF: one JPEG per page, drawn at the page's content width from
 * the top. No dependencies, so it works the same in every browser.
 */
export function buildPdf(images: PdfImage[]): Uint8Array {
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: string | Uint8Array) => {
    const bytes = typeof chunk === "string" ? encoder.encode(chunk) : chunk;
    parts.push(bytes);
    length += bytes.length;
  };
  const object = (id: number, body: string, stream?: Uint8Array) => {
    offsets[id] = length;
    push(`${id} 0 obj\n${body}\n`);
    if (stream) {
      push("stream\n");
      push(stream);
      push("\nendstream\n");
    }
    push("endobj\n");
  };

  push("%PDF-1.4\n%âã\n");
  const pageId = (index: number) => 3 + index * 3;
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, `<< /Type /Pages /Kids [${images.map((_, index) => `${pageId(index)} 0 R`).join(" ")}] /Count ${images.length} >>`);
  const contentWidth = PAGE.width - MARGIN * 2;
  images.forEach((image, index) => {
    const id = pageId(index);
    const drawHeight = (image.height / image.width) * contentWidth;
    const content = encoder.encode(
      `q ${contentWidth.toFixed(2)} 0 0 ${drawHeight.toFixed(2)} ${MARGIN} ${(PAGE.height - MARGIN - drawHeight).toFixed(2)} cm /Im0 Do Q`,
    );
    object(id, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /XObject << /Im0 ${id + 2} 0 R >> >> /Contents ${id + 1} 0 R >>`);
    object(id + 1, `<< /Length ${content.length} >>`, content);
    object(
      id + 2,
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.jpeg.length} >>`,
      image.jpeg,
    );
  });

  const count = pageId(images.length);
  const xref = length;
  push(`xref\n0 ${count}\n0000000000 65535 f \n`);
  for (let id = 1; id < count; id += 1) push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

/** Page height in source pixels for an image `width` pixels wide. */
export const pageHeightFor = (width: number) => Math.floor(((PAGE.height - MARGIN * 2) / (PAGE.width - MARGIN * 2)) * width);

/**
 * Where to cut a tall image into pages: as far down as fits, but at the last
 * safe break (a row edge) above that, so rows are never split.
 */
export function pageCuts(total: number, pageHeight: number, breaks: number[]): number[] {
  const cuts: number[] = [];
  let start = 0;
  while (total - start > pageHeight) {
    const limit = start + pageHeight;
    const safe = breaks.filter((at) => at > start + pageHeight / 2 && at <= limit);
    const cut = safe.length ? Math.max(...safe) : limit;
    cuts.push(cut);
    start = cut;
  }
  return cuts;
}
