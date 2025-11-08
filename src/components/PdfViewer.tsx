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
  skipTextExtraction?: boolean; // New prop to skip text extraction when already done
  preExtractedPageTexts?: string[]; // Pre-extracted page texts to avoid re-processing
}

// Simple cache for PDF documents to avoid re-parsing
const pdfDocumentCache = new Map<string, PDFDocumentProxy>();

export const PdfViewer: React.FC<PdfViewerProps> = ({
  fileBuffer,
  onTextExtracted,
  skipTextExtraction = false,
  preExtractedPageTexts,
}) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageOffsetsRef = useRef<number[] | null>(null);
  const pageTextsRef = useRef<string[] | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const loadPdf = async () => {
      try {
        // Create a hash of the buffer for caching
        const bufferHash = Array.from(new Uint8Array(fileBuffer.slice(0, 1024)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        let loadedPdf: PDFDocumentProxy;

        // Check cache first
        if (pdfDocumentCache.has(bufferHash)) {
          loadedPdf = pdfDocumentCache.get(bufferHash)!;
        } else {
          // Clone the buffer to prevent detachment issues when component remounts
          const bufferCopy = fileBuffer.slice(0);
          loadedPdf = await getDocument({
            data: bufferCopy,
            // Add options to handle problematic PDFs and reduce loading time
            verbosity: 0, // Reduce console warnings including TT errors
            useSystemFonts: false, // Prevent font loading issues
            disableFontFace: true, // Skip custom fonts that cause TT errors
            cMapUrl: undefined, // Skip character mapping for faster loading
            standardFontDataUrl: undefined, // Skip standard font loading
          }).promise;

          // Cache the document (limit cache size to prevent memory leaks)
          if (pdfDocumentCache.size >= 3) {
            const firstKey = pdfDocumentCache.keys().next().value;
            if (firstKey) {
              const firstPdf = pdfDocumentCache.get(firstKey);
              if (firstPdf) {
                firstPdf.cleanup?.();
                firstPdf.destroy?.();
              }
              pdfDocumentCache.delete(firstKey);
            }
          }
          pdfDocumentCache.set(bufferHash, loadedPdf);
        }

        if (!mounted) return;

        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);

        // Use pre-extracted text if available, otherwise extract if needed
        if (preExtractedPageTexts && preExtractedPageTexts.length > 0) {
          // Use pre-extracted data to set up page references for timeline functionality
          const offsets: number[] = [];
          let sum = 0;
          for (let i = 0; i < preExtractedPageTexts.length; i++) {
            offsets.push(sum);
            sum +=
              preExtractedPageTexts[i].length +
              (i < preExtractedPageTexts.length - 1 ? 2 : 0);
          }
          pageOffsetsRef.current = offsets;
          pageTextsRef.current = preExtractedPageTexts;

          if (onTextExtracted) {
            onTextExtracted(preExtractedPageTexts.join("\n\n"));
          }
        } else if (onTextExtracted && !skipTextExtraction) {
          const pageTexts: string[] = [];
          const batchSize = 5; // Reduced batch size for better responsiveness

          for (let i = 1; i <= loadedPdf.numPages; i++) {
            if (!mounted) return; // Check mounted state in loop

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

          if (!mounted) return;

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

        if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (!mounted) return;
        setError(
          `Failed to load PDF: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      mounted = false;
      // Note: Don't destroy PDF here since it might be cached and reused
    };
  }, [fileBuffer, onTextExtracted, skipTextExtraction, preExtractedPageTexts]);

  // Listen for jump-to-position events from overview/timeline and scroll to page
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      const pos = ce.detail?.position as number | undefined;
      const heading = ce.detail?.heading as string | undefined;
      const sectionIndex = ce.detail?.sectionIndex as number | undefined;
      const offsets = pageOffsetsRef.current;
      const pageTexts = pageTextsRef.current;

      console.log("🎯 Jump event received:", {
        pos,
        heading,
        sectionIndex,
        hasOffsets: !!offsets,
        hasPageTexts: !!pageTexts,
        offsetsLength: offsets?.length,
        pageTextsLength: pageTexts?.length,
      });

      if (!offsets || offsets.length === 0) {
        console.warn("⚠️ No page offsets available for jump navigation");
        return;
      }

      let pageIdx = 0;
      // Strategy 1: position mapping if provided
      if (typeof pos === "number") {
        for (let i = 0; i < offsets.length; i++) {
          if (offsets[i] <= pos) pageIdx = i;
          else break;
        }
        console.log("📍 Position strategy:", { pos, pageIdx });
      }
      // Strategy 2: heading search within pages (case-insensitive)
      if (heading && pageTexts && pageTexts.length) {
        const h = heading
          .toLowerCase()
          .replace(/[^a-z0-9\s]/gi, "")
          .slice(0, 60);
        const found = pageTexts.findIndex((t) => t.toLowerCase().includes(h));
        if (found >= 0) {
          pageIdx = found;
          console.log("🔍 Heading strategy:", { heading, found, pageIdx });
        }
      }
      // Strategy 3: proportional fallback by section index
      if (typeof sectionIndex === "number" && (!pageIdx || pageIdx === 0)) {
        // use proportional estimate if position/heading not decisive
        const est = Math.round(
          (sectionIndex / Math.max(1, offsets.length - 1)) *
            (offsets.length - 1)
        );
        pageIdx = Math.min(offsets.length - 1, Math.max(0, est));
        console.log("📊 Section index strategy:", {
          sectionIndex,
          est,
          pageIdx,
        });
      }
      const pageNum = pageIdx + 1;
      const container = containerRef.current;
      if (!container) {
        console.warn("⚠️ No container ref");
        return;
      }

      // Find the target page element
      const pageEl = container.querySelector(
        `[data-pdf-page="${pageNum}"]`
      ) as HTMLElement | null;

      if (pageEl) {
        // Find the scrollable parent - prioritize .pdf-panel which is the sticky scrollable container
        const pdfPanel = container.closest(".pdf-panel") as HTMLElement | null;
        const scrollContainer = pdfPanel || container;

        console.log("📜 Scroll info:", {
          pageNum,
          scrollContainer: scrollContainer.className,
          hasScrollTop: "scrollTop" in scrollContainer,
          currentScrollTop: scrollContainer.scrollTop,
          scrollHeight: scrollContainer.scrollHeight,
          clientHeight: scrollContainer.clientHeight,
        });

        const containerRect = scrollContainer.getBoundingClientRect();
        const pageRect = pageEl.getBoundingClientRect();
        const scrollTop =
          scrollContainer.scrollTop + (pageRect.top - containerRect.top) - 50;

        console.log("✨ Scrolling to:", { scrollTop, behavior: "smooth" });

        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });

        // flash highlight
        pageEl.classList.add("flash-highlight");
        setTimeout(() => pageEl.classList.remove("flash-highlight"), 1500);
      } else {
        console.warn("⚠️ Page element not found:", pageNum);
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

      {isLoading && (
        <div className="pdf-loading">
          <div className="loading-spinner"></div>
          <p>Loading PDF...</p>
        </div>
      )}

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
        .pdf-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: white;
          color: #666;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .pdf-pages {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .flash-highlight {
          outline: 3px solid #0ea5e9;
          transition: outline-color 1s ease;
        }
        .error-message {
          padding: 15px;
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          margin: 10px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
// Lazy page that only renders canvas when visible - optimized for performance
const LazyPdfPage: React.FC<PdfPageProps> = ({ pdf, pageNum, scale }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRendered) {
            setShouldRender(true);
            setHasRendered(true); // Once rendered, keep it rendered
          }
        });
      },
      {
        root: el.closest(".pdf-pages") as Element | null,
        rootMargin: "200px 0px", // Reduced margin for better performance
        threshold: 0.01,
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasRendered]);

  return (
    <div ref={holderRef} className="pdf-page-container" data-pdf-page={pageNum}>
      {shouldRender ? (
        <PdfPage pdf={pdf} pageNum={pageNum} scale={scale} />
      ) : (
        <div className="page-placeholder">
          <div className="page-loading">Page {pageNum}</div>
        </div>
      )}
      <style>{`
        .pdf-page-container {
          position: relative;
          min-height: 100px;
        }
        .page-placeholder {
          width: 850px;
          height: 1100px;
          background: white;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-style: italic;
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
  const renderTaskRef = useRef<any>(null);

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

        // Set canvas dimensions with device pixel ratio for crisp rendering
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const transform =
          outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : undefined;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          ...(transform && { transform }),
        };

        // Cancel any previous render task
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;

        if (mounted) {
          setIsLoading(false);
        }
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error(`Failed to render page ${pageNum}:`, err);
        }
        if (mounted) setIsLoading(false);
      }
    };

    renderPage();

    return () => {
      mounted = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
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
          maxWidth: "100%",
          height: "auto",
        }}
      />
      <style>{`
        .pdf-page-container {
          position: relative;
          margin-bottom: 10px;
        }
        .page-loading {
          padding: 40px;
          text-align: center;
          color: #666;
          font-style: italic;
          background: white;
          border: 1px solid #ddd;
          width: 850px;
          height: 1100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
