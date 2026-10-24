import { PAPERS, type Paper } from "./paper";
import { buildPdf, pageCuts, pageHeightFor, type PdfImage } from "./pdf";

const SCALE = 2;
const HOST = "msu-print-host";
const pxToMm = (px: number) => (px * 25.4) / 96;

/**
 * Lays a copy of the paper out off screen at the paper's own width, so a phone
 * gets the same result as a laptop. Animations are off on the stage.
 */
async function withStage<T>(paper: HTMLElement, width: number, run: (copy: HTMLElement) => Promise<T> | T): Promise<T> {
  const doc = paper.ownerDocument;
  const stage = doc.createElement("div");
  stage.className = "msu-pdf-stage";
  stage.setAttribute("aria-hidden", "true");
  Object.assign(stage.style, { position: "fixed", top: "0", left: "-10000px", width: `${width}px`, pointerEvents: "none" });
  const copy = paper.cloneNode(true) as HTMLElement;
  stage.appendChild(copy);
  doc.body.appendChild(stage);
  try {
    return await run(copy);
  } finally {
    stage.remove();
  }
}

/**
 * Prints only the invoice: a copy of it goes into a host element that the
 * print stylesheet shows on its own, with the page size for its paper (A4, or
 * a receipt roll exactly as long as the receipt), then the print dialog opens.
 */
export async function printPaper(paper: HTMLElement, sheet: Paper = PAPERS.a4) {
  const doc = paper.ownerDocument;
  const win = doc.defaultView;
  if (!win) return;
  let page = "size: A4; margin: 12mm;";
  if (sheet.rollWidth) {
    const height = await withStage(paper, sheet.layoutWidth, (copy) => copy.getBoundingClientRect().height);
    // Rolls print to their own length; a few mm extra so the cutter clears the last line.
    page = `size: ${sheet.rollWidth}mm ${Math.ceil(pxToMm(height) + 6)}mm; margin: 0;`;
  }
  doc.querySelectorAll(`.${HOST}`).forEach((host) => host.remove());
  const host = doc.createElement("div");
  host.className = HOST;
  const style = doc.createElement("style");
  style.textContent = `@page { ${page} }`;
  host.append(style, paper.cloneNode(true));
  doc.body.appendChild(host);
  win.addEventListener("afterprint", () => host.remove(), { once: true });
  win.print();
}

/**
 * Draws the invoice into a PDF in the browser and downloads it. A4 invoices
 * break between rows; receipts are one page as long as the receipt.
 */
export async function downloadPaperPdf(paper: HTMLElement, fileName: string, sheet: Paper = PAPERS.a4) {
  const doc = paper.ownerDocument;
  const { toCanvas } = await import("html-to-image");
  const images = await withStage(paper, sheet.layoutWidth, async (copy) => {
    await doc.fonts?.ready;
    const top = copy.getBoundingClientRect().top;
    const breaks = [...copy.querySelectorAll("tr, li, [data-msu-break]")].map((node) => Math.round((node.getBoundingClientRect().bottom - top) * SCALE));
    const canvas = await toCanvas(copy, {
      pixelRatio: SCALE,
      width: sheet.layoutWidth,
      backgroundColor: doc.defaultView?.getComputedStyle(copy).backgroundColor,
    });
    const pageHeight = pageHeightFor(canvas.width, sheet.pdf);
    const edges = [0, ...pageCuts(canvas.height, pageHeight, breaks), canvas.height];
    const pages: PdfImage[] = [];
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
      pages.push({ jpeg: new Uint8Array(await blob.arrayBuffer()), width: canvas.width, height });
    }
    return pages;
  });
  save(doc, new Blob([buildPdf(images, sheet.pdf)], { type: "application/pdf" }), fileName);
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
