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

        // Extract text in background for analysis
        if (onTextExtracted) {
          const pageTexts: string[] = [];
          for (let i = 1; i <= loadedPdf.numPages; i++) {
            const page = await loadedPdf.getPage(i);
            const content = await page.getTextContent();
            const text = (content.items || [])
              .map((item: any) => item.str)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim();
            pageTexts.push(text);
          }
          // Build cumulative page start offsets for jump-to-position mapping
          const offsets: number[] = [];
          let sum = 0;
          for (let i = 0; i < pageTexts.length; i++) {
            offsets.push(sum);
            // account for the two newlines we insert between pages in join
            sum += pageTexts[i].length + (i < pageTexts.length - 1 ? 2 : 0);
          }
          pageOffsetsRef.current = offsets;
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
      if (typeof pos !== "number") return;
      const offsets = pageOffsetsRef.current;
      if (!offsets || offsets.length === 0) return;
      // find the page index whose start offset is <= pos and next start > pos
      let pageIdx = 0;
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] <= pos) pageIdx = i;
        else break;
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

      <div className="pdf-pages">
        {pdf &&
          Array.from({ length: numPages }, (_, i) => (
            <PdfPage key={i} pdf={pdf} pageNum={i + 1} scale={scale} />
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
