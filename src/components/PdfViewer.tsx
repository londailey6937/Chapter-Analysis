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
import type { Concept } from "@/types";

GlobalWorkerOptions.workerSrc = workerUrl;

interface PdfViewerProps {
  fileBuffer: ArrayBuffer;
  onTextExtracted?: (text: string) => void;
  skipTextExtraction?: boolean; // New prop to skip text extraction when already done
  preExtractedPageTexts?: string[]; // Pre-extracted page texts to avoid re-processing
  highlightedConcept?: Concept | null; // Concept to highlight in the PDF
  chapterText?: string; // Full chapter text for position mapping
  currentMentionIndex?: number; // Index of the mention to scroll to
  onMentionNavigate?: (newIndex: number) => void; // Callback when user navigates mentions
  tocEndPage?: number; // Last page of TOC (default: 10) - concepts before this will be skipped
}

// Simple cache for PDF documents to avoid re-parsing
const pdfDocumentCache = new Map<string, PDFDocumentProxy>();

// Helper function to detect if page labels contain Roman numerals
async function detectRomanNumeralPages(pdf: PDFDocumentProxy): Promise<number> {
  try {
    const pageLabels = await pdf.getPageLabels();
    if (!pageLabels || pageLabels.length === 0) {
      return 0; // No page labels, can't detect
    }

    // Check each label to find where Roman numerals end
    const romanNumeralRegex =
      /^(m{0,3})(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i;

    for (let i = 0; i < pageLabels.length; i++) {
      const label = pageLabels[i];
      if (label && typeof label === "string") {
        // If this label is NOT a Roman numeral (likely Arabic or regular numbering)
        // Then the previous page was the last Roman numeral page
        if (!romanNumeralRegex.test(label.trim())) {
          console.log(
            `📑 Auto-detected TOC end: Page ${i} (last Roman numeral page)`
          );
          return i; // Return 0-based index, which is the last Roman numeral page
        }
      }
    }

    return 0; // No Roman numerals detected
  } catch (error) {
    console.warn("Could not detect page labels:", error);
    return 0;
  }
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  fileBuffer,
  onTextExtracted,
  skipTextExtraction = false,
  preExtractedPageTexts,
  highlightedConcept,
  chapterText,
  currentMentionIndex = 0,
  onMentionNavigate,
  tocEndPage = 10, // Default: TOC ends at page 10
}) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoDetectedTocEnd, setAutoDetectedTocEnd] = useState<number | null>(
    null
  );
  const [pendingIndicator, setPendingIndicator] = useState<{
    type: "concept" | "section";
    text: string;
    conceptName?: string; // Actual concept name for text search
    pageNum: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageOffsetsRef = useRef<number[] | null>(null);
  const pageTextsRef = useRef<string[] | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const highlightCanvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

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

        // Auto-detect Roman numeral pages (TOC)
        const detectedTocEnd = await detectRomanNumeralPages(loadedPdf);
        if (detectedTocEnd > 0) {
          setAutoDetectedTocEnd(detectedTocEnd);
          console.log(
            `✅ Auto-detected TOC ending at page ${detectedTocEnd} (will skip to page ${
              detectedTocEnd + 1
            })`
          );
        } else {
          console.warn(
            `⚠️ Could not auto-detect page labels. PDF may not have proper page label metadata. Please set TOC end page manually.`
          );
        }

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
      let strategyUsed = "none";

      // Strategy 1: position mapping if provided (HIGHEST PRIORITY)
      if (typeof pos === "number") {
        for (let i = 0; i < offsets.length; i++) {
          if (offsets[i] <= pos) pageIdx = i;
          else break;
        }
        strategyUsed = "position";
        console.log("📍 Position strategy:", { pos, pageIdx });
      }
      // Strategy 2: heading search within pages (ONLY if no position provided)
      else if (heading && pageTexts && pageTexts.length) {
        const h = heading
          .toLowerCase()
          .replace(/[^a-z0-9\s]/gi, "")
          .slice(0, 60);
        const found = pageTexts.findIndex((t) => t.toLowerCase().includes(h));
        if (found >= 0) {
          pageIdx = found;
          strategyUsed = "heading";
          console.log("🔍 Heading strategy:", { heading, found, pageIdx });
        }
      }
      // Strategy 3: proportional fallback by section index
      if (typeof sectionIndex === "number" && strategyUsed === "none") {
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

      // Skip TOC pages - if we land on TOC, move to first content page
      const minContentPage = tocEndPage + 1;
      const adjustedPageNum =
        pageNum < minContentPage ? minContentPage : pageNum;

      if (adjustedPageNum !== pageNum) {
        console.log(
          `⚠️ Skipping TOC: Page ${pageNum} → Page ${adjustedPageNum}`
        );
      }

      console.log("🎯 Jumping to page:", {
        originalPageNum: pageNum,
        adjustedPageNum,
        pageIdx,
        strategyUsed,
      });

      // Simply change the current page - no scrolling needed!
      setCurrentPage(adjustedPageNum);

      // Set pending indicator to show after page renders
      setPendingIndicator({
        type: "section",
        text: heading || `Page ${adjustedPageNum}`,
        pageNum: adjustedPageNum,
      });
    };
    window.addEventListener("jump-to-position", handler as EventListener);
    return () => {
      window.removeEventListener("jump-to-position", handler as EventListener);
    };
  }, []);

  // Scroll to highlighted concept when it changes
  useEffect(() => {
    console.log("🔔 Concept highlight useEffect triggered:", {
      hasHighlightedConcept: !!highlightedConcept,
      conceptName: highlightedConcept?.name,
      hasMentions: highlightedConcept?.mentions.length || 0,
      currentMentionIndex,
      hasOffsets: !!pageOffsetsRef.current,
    });

    if (!highlightedConcept || !highlightedConcept.mentions.length) {
      console.log("⚠️ No highlighted concept or no mentions, exiting");
      return;
    }

    const offsets = pageOffsetsRef.current;
    if (!offsets || offsets.length === 0) {
      console.warn("⚠️ No page offsets available for concept navigation");
      return;
    }

    // Use auto-detected TOC end if available, otherwise use manual setting
    const effectiveTocEnd =
      autoDetectedTocEnd !== null ? autoDetectedTocEnd : tocEndPage;
    const minContentPage = effectiveTocEnd + 1; // First content page after TOC

    console.log(
      `📑 TOC Filter: Using ${
        autoDetectedTocEnd !== null ? "auto-detected" : "manual"
      } value: ${effectiveTocEnd}`
    );

    // Filter out mentions that fall on TOC pages
    const contentMentions = highlightedConcept.mentions.filter((mention) => {
      let pageIdx = 0;
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] <= mention.position) {
          pageIdx = i;
        } else {
          break;
        }
      }
      const pageNum = pageIdx + 1;
      return pageNum >= minContentPage;
    });

    // If all mentions are in TOC, fall back to all mentions
    const validMentions =
      contentMentions.length > 0
        ? contentMentions
        : highlightedConcept.mentions;

    const tocMentionsFiltered =
      highlightedConcept.mentions.length - validMentions.length;

    // Get the mention at the specified index
    const mentionIdx = Math.min(currentMentionIndex, validMentions.length - 1);
    const targetMention = validMentions[mentionIdx];
    const position = targetMention.position;

    console.log("🎯 Scrolling to concept:", {
      name: highlightedConcept.name,
      mentionIndex: mentionIdx + 1,
      totalMentions: validMentions.length,
      filteredOutTOC: tocMentionsFiltered,
      position,
    });

    if (tocMentionsFiltered > 0) {
      console.warn(
        `⚠️ Skipped ${tocMentionsFiltered} mention(s) in TOC (pages 1-${effectiveTocEnd}). First content mention on page ${
          Math.floor(position / 2000) + 1
        }`
      );
    }

    // Find which page contains this position
    let pageIdx = 0;
    for (let i = 0; i < offsets.length; i++) {
      if (offsets[i] <= position) {
        pageIdx = i;
      } else {
        break;
      }
    }

    const pageNum = pageIdx + 1;

    // Warn if we're landing close to the TOC threshold
    if (pageNum <= effectiveTocEnd + 5 && tocMentionsFiltered > 0) {
      console.warn(
        `⚠️ LANDING ON PAGE ${pageNum} - Close to TOC threshold (${effectiveTocEnd}). ${
          autoDetectedTocEnd !== null
            ? "Auto-detection may have failed."
            : "If this is still TOC, increase the TOC setting!"
        }`
      );
    }

    console.log("🎯 Jumping to concept page:", {
      name: highlightedConcept.name,
      mentionIndex: mentionIdx + 1,
      totalValidMentions: validMentions.length,
      pageNum,
      pageIdx,
      effectiveTocEnd,
      autoDetected: autoDetectedTocEnd !== null,
      landingInSuspectedTOC: pageNum <= effectiveTocEnd + 5,
    });

    // Simply change the current page - no scrolling needed!
    setCurrentPage(pageNum);

    // Set pending indicator to show after page renders - include TOC warning if needed
    const indicatorText =
      tocMentionsFiltered > 0
        ? `${
            highlightedConcept.name
          } (skipped ${tocMentionsFiltered} TOC mention${
            tocMentionsFiltered > 1 ? "s" : ""
          })`
        : highlightedConcept.name;

    setPendingIndicator({
      type: "concept",
      text: indicatorText,
      conceptName: highlightedConcept.name, // Pass actual concept name for searching
      pageNum: pageNum,
    });
  }, [highlightedConcept, currentMentionIndex, tocEndPage, autoDetectedTocEnd]);

  // Helper function for simple indicator fallback
  const showSimpleIndicator = (pageEl: HTMLElement, text: string) => {
    const indicator = document.createElement("div");
    indicator.className = "concept-simple-indicator";
    indicator.innerHTML = `
      <div class="simple-indicator-content">
        <span class="simple-indicator-icon">📍</span>
        <span class="simple-indicator-text">${text}</span>
      </div>
    `;
    pageEl.appendChild(indicator);

    setTimeout(() => {
      indicator.classList.add("fade-out");
      setTimeout(() => indicator.remove(), 500);
    }, 4000);
  };

  // Show indicator after page change
  useEffect(() => {
    if (!pendingIndicator) return;

    console.log("🎨 Adding indicator:", pendingIndicator);

    // Wait for page to render
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) {
        console.warn("⚠️ No container for indicator");
        return;
      }

      const pageEl = container.querySelector(
        `[data-pdf-page="${pendingIndicator.pageNum}"]`
      ) as HTMLElement | null;

      if (pageEl) {
        console.log("✅ Found page element, adding indicator");

        // Scroll the PDF viewer into view
        container.scrollIntoView({ behavior: "smooth", block: "start" });

        // Remove any existing indicators
        const existingIndicators = pageEl.querySelectorAll(
          ".concept-indicator, .page-jump-indicator"
        );
        existingIndicators.forEach((ind) => ind.remove());

        if (pendingIndicator.type === "concept") {
          // Highlight the actual concept text on the page
          const searchText =
            pendingIndicator.conceptName || pendingIndicator.text;
          console.log("🎯 Highlighting concept text:", searchText);

          // Try to find the concept text in the page's text content
          const pageTexts = pageTextsRef.current;
          const pageIndex = pendingIndicator.pageNum - 1;

          if (pageTexts && pageTexts[pageIndex]) {
            const pageText = pageTexts[pageIndex].toLowerCase();
            const conceptText = searchText.toLowerCase();
            const conceptIndex = pageText.indexOf(conceptText);

            if (conceptIndex !== -1) {
              console.log(
                `✅ Found concept "${searchText}" at position ${conceptIndex} in page text`
              );

              // Get surrounding context (50 chars before and after)
              const contextStart = Math.max(0, conceptIndex - 50);
              const contextEnd = Math.min(
                pageText.length,
                conceptIndex + conceptText.length + 50
              );
              const context = pageTexts[pageIndex].substring(
                contextStart,
                contextEnd
              );

              // Create a text highlight with context
              const highlightOverlay = document.createElement("div");
              highlightOverlay.className = "concept-text-highlight-box";
              highlightOverlay.innerHTML = `
                <div class="highlight-header">
                  <span class="highlight-icon">🎯</span>
                  <span class="highlight-concept-name">${
                    pendingIndicator.text
                  }</span>
                </div>
                <div class="highlight-context">
                  <span class="context-text">${context.replace(
                    new RegExp(`(${pendingIndicator.text})`, "gi"),
                    '<mark class="concept-mark">$1</mark>'
                  )}</span>
                </div>
              `;

              pageEl.style.position = "relative";
              pageEl.appendChild(highlightOverlay);

              // Animate and remove after delay
              setTimeout(() => {
                highlightOverlay.classList.add("fade-out");
                setTimeout(() => highlightOverlay.remove(), 500);
              }, 6000);
            } else {
              console.warn(
                `⚠️ Concept "${pendingIndicator.text}" not found in page text`
              );
              // Fallback: show simple indicator
              showSimpleIndicator(pageEl, pendingIndicator.text);
            }
          } else {
            console.warn("⚠️ No page text available for highlighting");
            // Fallback: show simple indicator
            showSimpleIndicator(pageEl, pendingIndicator.text);
          }
        } else {
          // Section indicator
          const indicator = document.createElement("div");
          indicator.className = "page-jump-indicator";
          indicator.textContent = `📍 ${pendingIndicator.text}`;
          pageEl.appendChild(indicator);
          setTimeout(() => indicator.remove(), 3500);
        }

        // Clear the pending indicator
        setPendingIndicator(null);
      } else {
        console.warn(
          "⚠️ Page element not found for indicator:",
          pendingIndicator.pageNum
        );
      }
    }, 300); // Give time for page to render

    return () => clearTimeout(timer);
  }, [pendingIndicator, currentPage]);

  return (
    <div className="pdf-viewer" ref={containerRef}>
      {/* Concept Navigation - Sticky bar when concept is selected */}
      {highlightedConcept && highlightedConcept.mentions.length > 1 && (
        <div className="concept-navigation-bar">
          <div className="concept-nav-info">
            <span className="concept-name">📍 {highlightedConcept.name}</span>
            <span className="mention-counter">
              Mention {currentMentionIndex + 1} of{" "}
              {highlightedConcept.mentions.length}
              {(autoDetectedTocEnd !== null || tocEndPage > 0) && (
                <span
                  style={{
                    fontSize: "0.85em",
                    opacity: 0.7,
                    marginLeft: "0.5rem",
                  }}
                >
                  (
                  {autoDetectedTocEnd !== null
                    ? `Auto-detected TOC: skip pages 1-${autoDetectedTocEnd}`
                    : `TOC filter: skip pages 1-${tocEndPage}`}
                  )
                </span>
              )}
            </span>
          </div>
          <div className="concept-nav-buttons">
            <button
              onClick={() =>
                onMentionNavigate?.(Math.max(0, currentMentionIndex - 1))
              }
              disabled={currentMentionIndex === 0}
              title="Previous mention"
            >
              ← Prev
            </button>
            <button
              onClick={() =>
                onMentionNavigate?.(
                  Math.min(
                    highlightedConcept.mentions.length - 1,
                    currentMentionIndex + 1
                  )
                )
              }
              disabled={
                currentMentionIndex >= highlightedConcept.mentions.length - 1
              }
              title="Next mention"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      <div className="pdf-controls">
        <button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}>
          Zoom Out
        </button>
        <span style={{ margin: "0 10px" }}>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale((s) => Math.min(3, s + 0.25))}>
          Zoom In
        </button>

        <span
          style={{
            margin: "0 20px",
            borderLeft: "1px solid #ccc",
            paddingLeft: "20px",
          }}
        >
          Page {currentPage} of {numPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          disabled={currentPage >= numPages}
        >
          Next
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
        {pdf && <SinglePdfPage pdf={pdf} pageNum={currentPage} scale={scale} />}
      </div>

      <style>{`
        .pdf-viewer {
          width: 100%;
          background: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
        }
        .concept-navigation-bar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .concept-nav-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .concept-name {
          font-weight: 600;
          font-size: 16px;
        }
        .mention-counter {
          font-size: 13px;
          opacity: 0.9;
        }
        .concept-nav-buttons {
          display: flex;
          gap: 8px;
        }
        .concept-nav-buttons button {
          padding: 8px 16px;
          border: 2px solid white;
          background: rgba(255,255,255,0.2);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .concept-nav-buttons button:hover:not(:disabled) {
          background: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }
        .concept-nav-buttons button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
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
        .pdf-controls button:hover:not(:disabled) {
          background: #f0f0f0;
        }
        .pdf-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
          animation: flashHighlight 2s ease-in-out;
          outline: 6px solid #0ea5e9 !important;
          outline-offset: 8px;
          box-shadow: 0 0 30px rgba(14, 165, 233, 0.8),
                      0 0 60px rgba(14, 165, 233, 0.6),
                      inset 0 0 30px rgba(14, 165, 233, 0.3) !important;
          border-radius: 8px;
          position: relative;
          z-index: 10;
        }

        .page-jump-indicator {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 24px;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
          animation: bounceIn 0.5s ease-out;
          z-index: 1001;
        }

        @keyframes bounceIn {
          0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
          50% { transform: translateX(-50%) scale(1.1); }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        .jump-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(14, 165, 233, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: overlayFadeIn 0.2s ease-out;
        }

        .jump-overlay.fade-out {
          animation: overlayFadeOut 0.3s ease-out;
          opacity: 0;
        }

        .jump-overlay-content {
          text-align: center;
          color: white;
        }

        .jump-overlay-icon {
          font-size: 80px;
          margin-bottom: 20px;
          animation: iconPulse 0.6s ease-in-out;
        }

        .jump-overlay-text {
          font-size: 24px;
          font-weight: 500;
          line-height: 1.4;
        }

        .jump-overlay-text strong {
          display: block;
          font-size: 32px;
          margin-top: 10px;
          font-weight: 700;
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes overlayFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Concept indicator overlay - appears in center of page with concept name */
        .concept-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          pointer-events: none;
          animation: indicatorFadeIn 0.3s ease-out;
        }

        .concept-indicator.fade-out {
          animation: indicatorFadeOut 0.5s ease-out forwards;
        }

        .concept-indicator-content {
          position: relative;
        }

        .concept-indicator-label {
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4),
                      0 0 60px rgba(14, 165, 233, 0.3);
          animation: conceptBounce 0.6s ease-out;
          white-space: nowrap;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .concept-indicator-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(14, 165, 233, 0) 70%);
          animation: conceptPulse 2s ease-out infinite;
          z-index: 1;
        }

        @keyframes indicatorFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes indicatorFadeOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }

        @keyframes conceptBounce {
          0% {
            transform: scale(0.8) translateY(20px);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) translateY(0);
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes conceptPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }

        /* Text highlight box for concepts with context */
        .concept-text-highlight-box {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 90%;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border: 3px solid #d97706;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(251, 191, 36, 0.5),
            inset 0 2px 0 rgba(255, 255, 255, 0.3);
          z-index: 1000;
          animation: highlightBoxSlideIn 0.4s ease-out;
          pointer-events: none;
        }

        .concept-text-highlight-box.fade-out {
          animation: highlightBoxFadeOut 0.5s ease-out forwards;
        }

        .highlight-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(120, 53, 15, 0.3);
        }

        .highlight-icon {
          font-size: 20px;
        }

        .highlight-concept-name {
          font-size: 16px;
          font-weight: 700;
          color: #78350f;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
        }

        .highlight-context {
          background: rgba(255, 255, 255, 0.9);
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.6;
          color: #1f2937;
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid rgba(120, 53, 15, 0.2);
        }

        .context-text {
          display: block;
          word-wrap: break-word;
        }

        .concept-mark {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #78350f;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          border: 2px solid #f59e0b;
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
          animation: conceptMarkPulse 1.5s ease-in-out infinite;
        }

        .concept-simple-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          color: white;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 18px;
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4);
          animation: simpleIndicatorBounce 0.6s ease-out;
          z-index: 1000;
          pointer-events: none;
        }

        .concept-simple-indicator.fade-out {
          animation: indicatorFadeOut 0.5s ease-out forwards;
        }

        .simple-indicator-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .simple-indicator-icon {
          font-size: 24px;
        }

        .simple-indicator-text {
          font-size: 18px;
        }

        @keyframes highlightBoxSlideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes highlightBoxFadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
        }

        @keyframes conceptMarkPulse {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
          }
          50% {
            box-shadow: 0 2px 16px rgba(251, 191, 36, 0.8);
          }
        }

        @keyframes simpleIndicatorBounce {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        /* Text highlight overlay for concepts */
        .concept-text-highlight {
          background: radial-gradient(
            circle at center,
            rgba(255, 215, 0, 0.3) 0%,
            rgba(255, 215, 0, 0.15) 40%,
            rgba(255, 215, 0, 0) 70%
          );
          animation: highlightPulse 2s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid rgba(255, 215, 0, 0.6);
          box-shadow:
            0 0 30px rgba(255, 215, 0, 0.5),
            inset 0 0 50px rgba(255, 215, 0, 0.2);
        }

        .concept-text-highlight.fade-out {
          animation: highlightFadeOut 0.5s ease-out forwards;
        }

        .highlight-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 215, 0, 0.4) 0%,
            rgba(255, 215, 0, 0) 70%
          );
          animation: pulseExpand 2s ease-out infinite;
        }

        .highlight-label {
          position: relative;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #78350f;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 18px;
          box-shadow:
            0 4px 20px rgba(251, 191, 36, 0.5),
            0 0 60px rgba(251, 191, 36, 0.3);
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          border: 2px solid rgba(120, 53, 15, 0.2);
          animation: labelBounce 0.6s ease-out;
        }

        @keyframes highlightPulse {
          0%, 100% {
            background: radial-gradient(
              circle at center,
              rgba(255, 215, 0, 0.3) 0%,
              rgba(255, 215, 0, 0.15) 40%,
              rgba(255, 215, 0, 0) 70%
            );
          }
          50% {
            background: radial-gradient(
              circle at center,
              rgba(255, 215, 0, 0.5) 0%,
              rgba(255, 215, 0, 0.25) 40%,
              rgba(255, 215, 0, 0) 70%
            );
          }
        }

        @keyframes highlightFadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes pulseExpand {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(3.5);
            opacity: 0;
          }
        }

        @keyframes labelBounce {
          0% {
            transform: scale(0.8) translateY(20px);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) translateY(-5px);
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes flashHighlight {
          0%, 100% {
            outline-color: transparent;
            box-shadow: none;
          }
          10%, 30%, 50% {
            outline-color: #0ea5e9;
            box-shadow: 0 0 20px rgba(14, 165, 233, 0.6),
                        0 0 40px rgba(14, 165, 233, 0.4),
                        inset 0 0 20px rgba(14, 165, 233, 0.2);
          }
          20%, 40%, 60% {
            outline-color: #06b6d4;
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.7),
                        0 0 50px rgba(6, 182, 212, 0.5),
                        inset 0 0 30px rgba(6, 182, 212, 0.3);
          }
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

// Single page component - always renders immediately (no lazy loading)
const SinglePdfPage: React.FC<PdfPageProps> = ({ pdf, pageNum, scale }) => {
  return (
    <div className="pdf-page-container" data-pdf-page={pageNum}>
      <PdfPage pdf={pdf} pageNum={pageNum} scale={scale} />
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
