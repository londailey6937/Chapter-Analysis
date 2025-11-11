import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

interface CustomPdfViewerProps {
  fileBuffer: ArrayBuffer;
  currentPage?: number; // 1-based
  onPageChange?: (page: number) => void;
  onTextEdit?: (editedText: string) => void;
}

export const CustomPdfViewer: React.FC<CustomPdfViewerProps> = ({
  fileBuffer,
  currentPage = 1,
  onPageChange,
  onTextEdit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.5);
  const [textLayerVisible, setTextLayerVisible] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [replacementText, setReplacementText] = useState("");
  const [fullText, setFullText] = useState(""); // Store extracted text
  const [editedText, setEditedText] = useState(""); // Track edits
  const [showEditOverlay, setShowEditOverlay] = useState(false); // Toggle edited view
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Analyze spacing and render with visual indicators
  const renderTextWithSpacingIndicators = (text: string) => {
    // Split by double newlines (paragraph breaks)
    const paragraphs = text.split(/\n\n+/);

    return (
      <div>
        {paragraphs.map((para, index) => {
          const trimmedPara = para.trim();
          if (!trimmedPara) return null;

          // Calculate if spacing is appropriate
          const nextPara = paragraphs[index + 1]?.trim();
          const currentLength = trimmedPara.length;
          const needsMoreSpacing =
            nextPara &&
            // Long paragraph followed by another long paragraph
            ((currentLength > 500 && nextPara.length > 500) ||
              // Heading pattern (short line followed by long text)
              (currentLength < 100 && nextPara.length > 200) ||
              // Topic change detection (ending punctuation patterns)
              (/[.!?]$/.test(trimmedPara) && nextPara.match(/^[A-Z]/)));

          return (
            <div
              key={index}
              style={{ marginBottom: needsMoreSpacing ? "32px" : "16px" }}
            >
              {/* Top spacing line */}
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#e5e7eb",
                  marginBottom: "12px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "-8px",
                    fontSize: "10px",
                    color: "#9ca3af",
                    backgroundColor: "white",
                    padding: "0 4px",
                  }}
                >
                  ━━━ {currentLength} chars ━━━
                </span>
              </div>

              {/* Paragraph text */}
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.8",
                }}
              >
                {trimmedPara}
              </p>

              {/* Bottom spacing indicator with recommendation */}
              {nextPara && (
                <div
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    paddingTop: "8px",
                    borderTop: needsMoreSpacing
                      ? "2px dashed #fbbf24"
                      : "1px solid #e5e7eb",
                  }}
                >
                  {needsMoreSpacing && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#f59e0b",
                        fontWeight: "600",
                        marginTop: "4px",
                        padding: "4px 8px",
                        backgroundColor: "#fef3c7",
                        borderRadius: "4px",
                        display: "inline-block",
                      }}
                    >
                      ⚠️ Consider more spacing here (topic/section break)
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Load PDF document
  useEffect(() => {
    if (!fileBuffer) return;

    setLoading(true);
    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });

    loadingTask.promise
      .then((pdf) => {
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
        console.log("📄 [CustomPdfViewer] PDF loaded:", pdf.numPages, "pages");
      })
      .catch((error) => {
        console.error("❌ [CustomPdfViewer] Error loading PDF:", error);
        setLoading(false);
      });

    return () => {
      loadingTask.destroy();
    };
  }, [fileBuffer]);

  // Render all pages
  useEffect(() => {
    if (!pdfDoc || !containerRef.current) return;

    const renderPages = async () => {
      const container = containerRef.current;
      if (!container) return;

      // Clear existing pages
      container.innerHTML = "";
      pageRefs.current.clear();

      // Extract all text first
      let allText = "";
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        allText += pageText + "\n\n";
      }
      setFullText(allText);
      if (!editedText) {
        setEditedText(allText);
      }

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        // Create page container with relative positioning for text layer
        const pageDiv = document.createElement("div");
        pageDiv.className = "pdf-page";
        pageDiv.style.position = "relative";
        pageDiv.style.marginBottom = "20px";
        pageDiv.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        pageDiv.style.backgroundColor = "white";
        pageDiv.setAttribute("data-page-number", pageNum.toString());

        // Create canvas layer
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.display = "block";
        pageDiv.appendChild(canvas);

        // Create text layer for selection
        const textLayerDiv = document.createElement("div");
        textLayerDiv.className = "textLayer";
        textLayerDiv.style.position = "absolute";
        textLayerDiv.style.left = "0";
        textLayerDiv.style.top = "0";
        textLayerDiv.style.right = "0";
        textLayerDiv.style.bottom = "0";
        textLayerDiv.style.overflow = "hidden";
        textLayerDiv.style.opacity = textLayerVisible ? "0" : "0"; // Invisible but selectable
        textLayerDiv.style.lineHeight = "1.0";
        textLayerDiv.style.userSelect = "text";
        textLayerDiv.style.pointerEvents = textLayerVisible ? "auto" : "none";
        textLayerDiv.style.cursor = textLayerVisible ? "text" : "default";
        pageDiv.appendChild(textLayerDiv);

        // Add page number label
        const pageLabel = document.createElement("div");
        pageLabel.textContent = `Page ${pageNum}`;
        pageLabel.style.textAlign = "center";
        pageLabel.style.padding = "8px";
        pageLabel.style.fontSize = "14px";
        pageLabel.style.color = "#666";
        pageLabel.style.backgroundColor = "#f5f5f5";
        pageLabel.style.borderTop = "1px solid #ddd";
        pageDiv.appendChild(pageLabel);

        container.appendChild(pageDiv);
        pageRefs.current.set(pageNum, pageDiv);

        // Render canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Render text layer for selection
        const textContent = await page.getTextContent();
        const textLayer = pdfjsLib.renderTextLayer({
          textContent: textContent,
          container: textLayerDiv,
          viewport: viewport,
          textDivs: [],
        });

        await textLayer.promise;
        console.log(
          `✅ [CustomPdfViewer] Rendered page ${pageNum} with text layer`
        );
      }
    };

    renderPages();
  }, [pdfDoc, scale, textLayerVisible]);

  // Handle page navigation - scroll to page
  useEffect(() => {
    if (!currentPage || currentPage < 1 || currentPage > numPages) return;

    const pageDiv = pageRefs.current.get(currentPage);
    if (pageDiv && containerRef.current) {
      console.log("🎯 [CustomPdfViewer] Scrolling to page:", currentPage);

      // Scroll the page into view at the top
      pageDiv.scrollIntoView({ behavior: "smooth", block: "start" });

      // Alternative: Manual scroll for more control
      // const container = containerRef.current;
      // const offsetTop = pageDiv.offsetTop;
      // container.scrollTop = offsetTop - 20; // 20px padding from top

      console.log("✅ [CustomPdfViewer] Scrolled to page:", currentPage);

      // Notify parent of page change
      onPageChange?.(currentPage);
    }
  }, [currentPage, numPages, onPageChange]);

  // Handle text selection
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString() || "";
      if (text.trim()) {
        setSelectedText(text);
        console.log(
          "📝 [CustomPdfViewer] Text selected:",
          text.substring(0, 50) + "..."
        );
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // Zoom controls
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleResetZoom = () => setScale(1.5);
  const toggleTextLayer = () => setTextLayerVisible((v) => !v);

  const copySelectedText = () => {
    if (selectedText) {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(selectedText)
          .then(() => {
            console.log(
              "📋 [CustomPdfViewer] Copied to clipboard:",
              selectedText.length,
              "characters"
            );
            alert(`✅ Copied ${selectedText.length} characters to clipboard!`);
          })
          .catch((err) => {
            console.error("❌ Clipboard API failed:", err);
            // Fallback to legacy method
            fallbackCopy(selectedText);
          });
      } else {
        // Use fallback for older browsers
        fallbackCopy(selectedText);
      }
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        alert(`✅ Copied ${text.length} characters to clipboard!`);
        console.log("📋 [CustomPdfViewer] Copied using fallback method");
      } else {
        alert("❌ Copy failed. Please try selecting and using Ctrl+C/Cmd+C");
      }
    } catch (err) {
      console.error("❌ Fallback copy failed:", err);
      alert("❌ Copy failed. Please try selecting and using Ctrl+C/Cmd+C");
    }
    document.body.removeChild(textArea);
  };

  const deleteSelectedText = () => {
    if (selectedText) {
      // Use the tracked text, not DOM innerText
      const updatedText = editedText.replace(selectedText, "");
      setEditedText(updatedText);
      onTextEdit?.(updatedText);
      console.log(
        "🗑️ [CustomPdfViewer] Deleted text:",
        selectedText.substring(0, 50)
      );
      alert(
        `✅ Deleted ${selectedText.length} characters. Click "Show Edited" to see changes.`
      );
      setSelectedText("");
      window.getSelection()?.removeAllRanges();
      setShowEditOverlay(true); // Auto-switch to edited view
    }
  };

  const openReplaceDialog = () => {
    if (selectedText) {
      setReplacementText(selectedText);
      setShowReplaceDialog(true);
    }
  };

  const handleReplace = () => {
    if (selectedText) {
      // Use the tracked text
      const updatedText = editedText.replace(selectedText, replacementText);
      setEditedText(updatedText);
      onTextEdit?.(updatedText);
      console.log("✏️ [CustomPdfViewer] Replaced text");
      alert("✅ Text replaced! Click 'Show Edited' to see changes.");
      setShowReplaceDialog(false);
      setSelectedText("");
      setReplacementText("");
      window.getSelection()?.removeAllRanges();
      setShowEditOverlay(true); // Auto-switch to edited view
    }
  };

  return (
    <div style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      {/* Inject CSS for text layer */}
      <style>
        {`
          .textLayer {
            mix-blend-mode: multiply;
          }
          .textLayer > span {
            color: transparent;
            position: absolute;
            white-space: pre;
            cursor: text;
            transform-origin: 0% 0%;
          }
          .textLayer ::selection {
            background: rgba(0, 123, 255, 0.3);
          }
          .textLayer ::-moz-selection {
            background: rgba(0, 123, 255, 0.3);
          }
        `}
      </style>

      {/* Toolbar */}
      <div
        style={{
          padding: "12px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleZoomOut}
          style={{
            padding: "6px 12px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={scale <= 0.5}
        >
          🔍− Zoom Out
        </button>
        <button
          onClick={handleResetZoom}
          style={{
            padding: "6px 12px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        <button
          onClick={handleZoomIn}
          style={{
            padding: "6px 12px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={scale >= 3}
        >
          🔍+ Zoom In
        </button>
        <span style={{ marginLeft: "16px", color: "#666", fontSize: "14px" }}>
          {Math.round(scale * 100)}%
        </span>

        {/* Text Selection Toggle */}
        <button
          onClick={toggleTextLayer}
          style={{
            padding: "6px 12px",
            backgroundColor: textLayerVisible ? "#3b82f6" : "white",
            color: textLayerVisible ? "white" : "#333",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: textLayerVisible ? "600" : "normal",
          }}
          title={
            textLayerVisible
              ? "Text selection enabled - click to disable"
              : "Enable text selection"
          }
        >
          {textLayerVisible ? "✓ Text Selection" : "Text Selection"}
        </button>

        {/* Copy Selected Text Button */}
        {selectedText && (
          <>
            <button
              onClick={copySelectedText}
              style={{
                padding: "6px 12px",
                backgroundColor: "#10b981",
                color: "white",
                border: "1px solid #059669",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
              }}
              title="Copy selected text to clipboard"
            >
              📋 Copy
            </button>

            <button
              onClick={openReplaceDialog}
              style={{
                padding: "6px 12px",
                backgroundColor: "#f59e0b",
                color: "white",
                border: "1px solid #d97706",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
              }}
              title="Replace selected text"
            >
              ✏️ Replace
            </button>

            <button
              onClick={deleteSelectedText}
              style={{
                padding: "6px 12px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "1px solid #dc2626",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
              }}
              title="Delete selected text"
            >
              🗑️ Delete
            </button>
          </>
        )}

        {numPages > 0 && (
          <span style={{ marginLeft: "auto", color: "#666", fontSize: "14px" }}>
            {numPages} pages
          </span>
        )}

        {/* Edit indicator */}
        {editedText !== fullText && (
          <>
            <button
              onClick={() => setShowEditOverlay(!showEditOverlay)}
              style={{
                padding: "6px 12px",
                backgroundColor: showEditOverlay ? "#8b5cf6" : "#fbbf24",
                color: showEditOverlay ? "white" : "#78350f",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              title={showEditOverlay ? "Show original PDF" : "Show edited text"}
            >
              {showEditOverlay ? "📄 Show PDF" : "✏️ Show Edited"}
            </button>
            <button
              onClick={() => {
                const charDiff = fullText.length - editedText.length;
                alert(
                  `Original: ${fullText.length} chars\n` +
                    `Current: ${editedText.length} chars\n` +
                    `Difference: ${charDiff > 0 ? "-" : "+"}${Math.abs(
                      charDiff
                    )} chars\n\n` +
                    `Preview:\n${editedText.substring(0, 200)}...`
                );
              }}
              style={{
                padding: "4px 8px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              title="View edited text preview"
            >
              📝 View Changes
            </button>
          </>
        )}
      </div>

      {/* PDF Container */}
      {loading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
          }}
        >
          Loading PDF...
        </div>
      ) : showEditOverlay && editedText !== fullText ? (
        /* Edited Text View */
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "40px",
            backgroundColor: "#f9fafb",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                backgroundColor: "#dbeafe",
                borderLeft: "4px solid #3b82f6",
                borderRadius: "4px",
              }}
            >
              <strong>📝 Edited Text View</strong>
              <div
                style={{ fontSize: "14px", marginTop: "4px", color: "#1e40af" }}
              >
                Original: {fullText.length.toLocaleString()} chars → Current:{" "}
                {editedText.length.toLocaleString()} chars (
                {fullText.length - editedText.length > 0 ? "-" : "+"}
                {Math.abs(
                  fullText.length - editedText.length
                ).toLocaleString()}{" "}
                chars)
              </div>
            </div>
            <div
              style={{
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                fontSize: "16px",
                color: "#1f2937",
                userSelect: "text",
              }}
            >
              {renderTextWithSpacingIndicators(editedText)}
            </div>
          </div>
        </div>
      ) : (
        /* PDF View */
        <div
          ref={containerRef}
          style={{
            flex: 1,
            overflow: "auto",
            padding: "20px",
            backgroundColor: "#e5e5e5",
          }}
        />
      )}

      {/* Replace Dialog Modal */}
      {showReplaceDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowReplaceDialog(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              maxWidth: "600px",
              width: "90%",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{ marginTop: 0, marginBottom: "16px", fontSize: "20px" }}
            >
              Replace Text
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Selected Text:
              </label>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                  fontSize: "14px",
                  maxHeight: "100px",
                  overflow: "auto",
                  border: "1px solid #d1d5db",
                }}
              >
                {selectedText}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Replace With:
              </label>
              <textarea
                value={replacementText}
                onChange={(e) => setReplacementText(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
                placeholder="Enter replacement text..."
                autoFocus
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowReplaceDialog(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReplace}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "1px solid #2563eb",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
