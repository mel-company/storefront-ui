import { buildPdf, pageCuts, pageHeightFor, type PdfImage } from "./pdf";

/** The paper is laid out at this width for PDFs (A4 at 96 dpi), whatever the screen. */
const PAPER_WIDTH = 794;
const SCALE = 2;
const HOST = "msu-print-host";

/**
 * Prints only the invoice: a copy of it goes into a host element that the
 * print stylesheet shows on its own, then the browser's print dialog opens.
 */
export function printPaper(paper: HTMLElement) {
  const doc = paper.ownerDocument;
  const win = doc.defaultView;
  if (!win) return;
  doc.querySelectorAll(`.${HOST}`).forEach((host) => host.remove());
  const host = doc.createElement("div");
  host.className = HOST;
  host.appendChild(paper.cloneNode(true));
  doc.body.appendChild(host);
  win.addEventListener("afterprint", () => host.remove(), { once: true });
  win.print();
}

/**
 * Draws the invoice into a PDF in the browser and downloads it. The copy is
 * laid out off screen at paper width, so a phone gets the same PDF as a
 * laptop, and pages break between rows.
 */
export async function downloadPaperPdf(paper: HTMLElement, fileName: string) {
  const doc = paper.ownerDocument;
  const { toCanvas } = await import("html-to-image");
  const stage = doc.createElement("div");
  stage.className = "msu-pdf-stage";
  stage.setAttribute("aria-hidden", "true");
  Object.assign(stage.style, { position: "fixed", top: "0", left: "-10000px", width: `${PAPER_WIDTH}px`, pointerEvents: "none" });
  const copy = paper.cloneNode(true) as HTMLElement;
  stage.appendChild(copy);
  doc.body.appendChild(stage);
  try {
    await doc.fonts?.ready;
    const top = copy.getBoundingClientRect().top;
    const breaks = [...copy.querySelectorAll("tr, [data-msu-break]")].map((node) => Math.round((node.getBoundingClientRect().bottom - top) * SCALE));
    const canvas = await toCanvas(copy, {
      pixelRatio: SCALE,
      width: PAPER_WIDTH,
      backgroundColor: doc.defaultView?.getComputedStyle(copy).backgroundColor,
    });
    const pageHeight = pageHeightFor(canvas.width);
    const edges = [0, ...pageCuts(canvas.height, pageHeight, breaks), canvas.height];
    const images: PdfImage[] = [];
    for (let index = 0; index < edges.length - 1; index += 1) {
      const from = edges[index] ?? 0;
      const height = (edges[index + 1] ?? canvas.height) - from;
      const slice = doc.createElement("canvas");
      slice.width = canvas.width;
      slice.height = height;
      const context = slice.getContext("2d");
      if (!context) throw new Error("No canvas");
      context.drawImage(canvas, 0, from, canvas.width, height, 0, 0, canvas.width, height);
      const blob = await new Promise<Blob | null>((resolve) => slice.toBlob(resolve, "image/jpeg", 0.92));
      if (!blob) throw new Error("No JPEG");
      images.push({ jpeg: new Uint8Array(await blob.arrayBuffer()), width: canvas.width, height });
    }
    save(doc, new Blob([buildPdf(images)], { type: "application/pdf" }), fileName);
  } finally {
    stage.remove();
  }
}

function save(doc: Document, blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = doc.createElement("a");
  link.href = url;
  link.download = fileName;
  doc.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
