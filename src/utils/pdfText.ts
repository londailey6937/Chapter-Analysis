// pdfjs-dist v4 ships ESM. We import the worker asset URL so the version matches the runtime library.
// Mismatch error seen: "API version X does not match Worker version Y" occurs when workerSrc points to a different pdf.js build.
// Using the Vite `?url` suffix returns the resolved static asset URL; this keeps versions aligned and avoids CDN drift.
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
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
  const pdf = await getDocument({ data: buffer }).promise;
  const maxPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = (content.items || []).map((item: any) => item.str);

    // Join with spaces and normalize
    const text = strings.join(" ").replace(/\s+/g, " ").trim();
    pageTexts.push(text);
  }

  await pdf.cleanup?.();
  await pdf.destroy?.();

  return pageTexts.join("\n\n");
}
