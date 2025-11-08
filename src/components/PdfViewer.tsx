/**
 * PDF Viewer Component
 * Renders PDF pages as canvas images with zoom/scroll
 */

import React, { useEffect, useRef, useState } from "react";
import {
  getDocument,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;

interface PdfViewerProps {
  fileBuffer: ArrayBuffer;
  onTextExtracted?: (text: string) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  fileBuffer,
  onTextExtracted,
}) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageOffsetsRef = useRef<number[] | null>(null);
  const pageTextsRef = useRef<string[] | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPdf = async () => {
      try {
        // Clone the buffer to prevent detachment issues when component remounts
        const bufferCopy = fileBuffer.slice(0);
        const loadedPdf = await getDocument({ data: bufferCopy }).promise;
        if (!mounted) return;
        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);

        // Extract text in background for analysis, yielding between batches
        if (onTextExtracted) {
          const pageTexts: string[] = [];
          const batchSize = 8;
          for (let i = 1; i <= loadedPdf.numPages; i++) {
            const page = await loadedPdf.getPage(i);
            const content = await page.getTextContent();
            const text = (content.items || [])
              .map((item: any) => item.str)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim();
            pageTexts.push(text);
            // Yield every batch to keep UI responsive
            if (i % batchSize === 0) {
              await new Promise((r) => setTimeout(r, 0));
            }
          }
          const offsets: number[] = [];
          let sum = 0;
          for (let i = 0; i < pageTexts.length; i++) {
            offsets.push(sum);
            sum += pageTexts[i].length + (i < pageTexts.length - 1 ? 2 : 0);
          }
          pageOffsetsRef.current = offsets;
          pageTextsRef.current = pageTexts;
          onTextExtracted(pageTexts.join("\n\n"));
        }
      } catch (err) {
        if (!mounted) return;
        setError(
          `Failed to load PDF: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    };

    loadPdf();

    return () => {
      mounted = false;
      pdf?.cleanup?.();
      pdf?.destroy?.();
    };
  }, [fileBuffer, onTextExtracted]);

  // Listen for jump-to-position events from overview/timeline and scroll to page
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      const pos = ce.detail?.position as number | undefined;
      const heading = ce.detail?.heading as string | undefined;
      const sectionIndex = ce.detail?.sectionIndex as number | undefined;
      const offsets = pageOffsetsRef.current;
      const pageTexts = pageTextsRef.current;
      if (!offsets || offsets.length === 0) return;

      let pageIdx = 0;
      // Strategy 1: position mapping if provided
      if (typeof pos === "number") {
        for (let i = 0; i < offsets.length; i++) {
          if (offsets[i] <= pos) pageIdx = i;
          else break;
        }
      }
      // Strategy 2: heading search within pages (case-insensitive)
      if (heading && pageTexts && pageTexts.length) {
        const h = heading
          .toLowerCase()
          .replace(/[^a-z0-9\s]/gi, "")
          .slice(0, 60);
        const found = pageTexts.findIndex((t) => t.toLowerCase().includes(h));
        if (found >= 0) pageIdx = found;
      }
      // Strategy 3: proportional fallback by section index
      if (typeof sectionIndex === "number" && (!pageIdx || pageIdx === 0)) {
        // use proportional estimate if position/heading not decisive
        const est = Math.round(
          (sectionIndex / Math.max(1, offsets.length - 1)) *
            (offsets.length - 1)
        );
        pageIdx = Math.min(offsets.length - 1, Math.max(0, est));
      }
      const pageNum = pageIdx + 1;
      const container = containerRef.current;
      if (!container) return;
      const pageEl = container.querySelector(
        `[data-pdf-page="${pageNum}"]`
      ) as HTMLElement | null;
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
        // flash highlight
        pageEl.classList.add("flash-highlight");
        setTimeout(() => pageEl.classList.remove("flash-highlight"), 1500);
      }
    };
    window.addEventListener("jump-to-position", handler as EventListener);
    return () => {
      window.removeEventListener("jump-to-position", handler as EventListener);
    };
  }, []);

  return (
    <div className="pdf-viewer" ref={containerRef}>
      <div className="pdf-controls">
        <button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}>
          Zoom Out
        </button>
        <span style={{ margin: "0 10px" }}>
          {Math.round(scale * 100)}% | {numPages} pages
        </span>
        <button onClick={() => setScale((s) => Math.min(3, s + 0.25))}>
          Zoom In
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="pdf-pages" id="pdf-pages">
        {pdf &&
          Array.from({ length: numPages }, (_, i) => (
            <LazyPdfPage key={i} pdf={pdf} pageNum={i + 1} scale={scale} />
          ))}
      </div>

      <style>{`
        .pdf-viewer {
          width: 100%;
          background: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
        }
        .pdf-controls {
          padding: 12px;
          background: white;
          border-bottom: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pdf-controls button {
          padding: 6px 12px;
          border: 1px solid #ccc;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .pdf-controls button:hover {
          background: #f0f0f0;
        }
        .pdf-pages {
          padding: 20px;
          max-height: 600px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .flash-highlight {
          outline: 3px solid #0ea5e9;
          transition: outline-color 1s ease;
        }
      `}</style>
    </div>
  );
};
// Lazy page that only renders canvas when visible
const LazyPdfPage: React.FC<PdfPageProps> = ({ pdf, pageNum, scale }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setShouldRender(true);
          else if (entry.boundingClientRect.top > 0) {
            // optionally pause rendering when far away
          }
        });
      },
      { root: el.closest(".pdf-pages") as Element | null, rootMargin: "400px 0px", threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={holderRef} className="pdf-page-container" data-pdf-page={pageNum}>
      {shouldRender ? (
        <PdfPage pdf={pdf} pageNum={pageNum} scale={scale} />
      ) : (
        <div className="page-loading">Loading page {pageNum}...</div>
      )}
      <style>{`
        .pdf-page-container { position: relative; }
      `}</style>
    </div>
  );
};

interface PdfPageProps {
  pdf: PDFDocumentProxy;
  pageNum: number;
  scale: number;
}

const PdfPage: React.FC<PdfPageProps> = ({ pdf, pageNum, scale }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const renderPage = async () => {
      try {
        const page: PDFPageProxy = await pdf.getPage(pageNum);
        if (!mounted) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        if (mounted) setIsLoading(false);
      } catch (err) {
        console.error(`Failed to render page ${pageNum}:`, err);
        if (mounted) setIsLoading(false);
      }
    };

    renderPage();

    return () => {
      mounted = false;
    };
  }, [pdf, pageNum, scale]);

  return (
    <div className="pdf-page-container" data-pdf-page={pageNum}>
      {isLoading && (
        <div className="page-loading">Loading page {pageNum}...</div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: isLoading ? "none" : "block",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #ddd",
          background: "white",
        }}
      />
      <style>{`
        .pdf-page-container {
          position: relative;
        }
        .page-loading {
          padding: 40px;
          text-align: center;
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};
