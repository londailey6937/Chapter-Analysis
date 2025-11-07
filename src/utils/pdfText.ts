// pdfjs-dist v4 ships ESM. We import the worker asset URL so the version matches the runtime library.
// Mismatch error seen: "API version X does not match Worker version Y" occurs when workerSrc points to a different pdf.js build.
// Using the Vite `?url` suffix returns the resolved static asset URL; this keeps versions aligned and avoids CDN drift.
import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
} from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Assign worker source to the bundled URL (same version as installed dependency)
GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Extract text content from a PDF File
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return extractTextFromPdfArrayBuffer(buffer);
}

/**
 * Extract text content from a PDF ArrayBuffer
 */
export async function extractTextFromPdfArrayBuffer(
  buffer: ArrayBuffer
): Promise<string> {
  const { text } = await extractPdfStructureArrayBuffer(buffer);
  return text;
}

/**
 * Structured PDF extraction including per-page text and document outline (bookmarks)
 */
export async function extractPdfStructure(file: File) {
  const buffer = await file.arrayBuffer();
  return extractPdfStructureArrayBuffer(buffer);
}

export interface PdfOutlineItem {
  title: string;
  pageNumber: number; // 1-based
}

export interface PdfStructureResult {
  text: string;
  pageTexts: string[];
  outline: PdfOutlineItem[];
}

export async function extractPdfStructureArrayBuffer(
  buffer: ArrayBuffer
): Promise<PdfStructureResult> {
  const pdf = (await getDocument({ data: buffer }).promise) as PDFDocumentProxy;
  const maxPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent({
      includeMarkedContent: true,
    } as any);
    const strings = (content.items || []).map((item: any) => item.str);
    const text = strings.join(" ").replace(/\s+/g, " ").trim();
    pageTexts.push(text);
  }

  let outline: PdfOutlineItem[] = [];
  try {
    const raw = (await (pdf as any).getOutline?.()) || [];
    const items: any[] = [];
    const stack = Array.isArray(raw) ? [...raw] : [];
    while (stack.length) {
      const it = stack.shift();
      if (!it) continue;
      items.push(it);
      if (Array.isArray(it.items)) stack.push(...it.items);
    }
    const resolved: PdfOutlineItem[] = [];
    for (const it of items) {
      const title: string = it.title || "";
      const dest = it.dest;
      if (!title || !dest) continue;
      try {
        const destArr: any = await (pdf as any).getDestination?.(dest);
        if (Array.isArray(destArr) && destArr[0]) {
          const pageRef = destArr[0];
          const pageIndex = await (pdf as any).getPageIndex?.(pageRef);
          if (typeof pageIndex === "number") {
            resolved.push({ title, pageNumber: pageIndex + 1 });
          }
        }
      } catch {}
    }
    // Sort by page number and de-dup titles by first occurrence
    outline = resolved
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .filter((v, i, arr) => i === arr.findIndex((x) => x.title === v.title));
  } catch {
    outline = [];
  }

  await pdf.cleanup?.();
  await pdf.destroy?.();

  return {
    text: pageTexts.join("\n\n"),
    pageTexts,
    outline,
  };
}
