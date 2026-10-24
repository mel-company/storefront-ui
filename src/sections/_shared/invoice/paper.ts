import type { InvoiceTemplate } from "../../../store/types";

export const INVOICE_TEMPLATES = ["classic", "modern", "compact", "receipt80", "receipt58"] as const satisfies readonly InvoiceTemplate[];

export interface Paper {
  /** Width the paper is laid out at for PDFs, in CSS pixels. */
  layoutWidth: number;
  /** PDF page in points. `height: null` = one page as tall as the content (receipt rolls). */
  pdf: { width: number; height: number | null; margin: number };
  /** Roll width in mm for receipts; absent = A4 sheets. */
  rollWidth?: number;
}

const mm = (value: number) => (value * 72) / 25.4;

export const PAPERS: Record<"a4" | "receipt80" | "receipt58", Paper> = {
  a4: { layoutWidth: 794, pdf: { width: 595.28, height: 841.89, margin: 28 } },
  receipt80: { layoutWidth: 302, pdf: { width: mm(80), height: null, margin: 0 }, rollWidth: 80 },
  receipt58: { layoutWidth: 219, pdf: { width: mm(58), height: null, margin: 0 }, rollWidth: 58 },
};

export const isReceipt = (template: InvoiceTemplate): template is "receipt80" | "receipt58" => template.startsWith("receipt");

export const paperFor = (template: InvoiceTemplate): Paper => (isReceipt(template) ? PAPERS[template] : PAPERS.a4);
