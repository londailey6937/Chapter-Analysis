import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  DualCodingAnalyzer,
  VisualSuggestion,
} from "@/utils/dualCodingAnalyzer";

interface DocumentEditorProps {
  initialText: string;
  onTextChange: (text: string) => void;
  showSpacingIndicators?: boolean;
  showVisualSuggestions?: boolean;
  readOnly?: boolean;
  highlightPosition?: number | null;
  onSave?: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialText,
  onTextChange,
  showSpacingIndicators = true,
  showVisualSuggestions = true,
  readOnly = false,
  highlightPosition = null,
  onSave,
}) => {
  const [text, setText] = useState(initialText);
  const [selectedText, setSelectedText] = useState("");
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [replacementText, setReplacementText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if content is actual HTML document structure (not just code examples with tags)
  const isHtmlContent = useMemo(() => {
    // Only treat as HTML if it starts with HTML structure or has multiple HTML block elements
    // OR if it has images (from DOCX conversion)
    const startsWithHtml = /^\s*<!DOCTYPE|^\s*<html|^\s*<head|^\s*<body/i.test(
      text
    );
    const hasMultipleBlockElements =
      (text.match(/<(div|section|article|main|header|footer|nav)/gi) || [])
        .length > 3;
    const hasMultipleParagraphs = (text.match(/<p>/gi) || []).length > 5; // Mammoth generates <p> tags
    const hasImages = text.includes("<img");
    // Treat as HTML if it has HTML structure OR multiple p tags (mammoth output) OR images
    const hasHtmlStructure =
      startsWithHtml ||
      hasMultipleBlockElements ||
      hasMultipleParagraphs ||
      hasImages;

    return hasHtmlStructure;
  }, [text]);

  // Undo/Redo stacks
  const [history, setHistory] = useState<string[]>([initialText]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Analyze text for visual suggestions
  const visualSuggestions = useMemo(() => {
    if (!showVisualSuggestions) return [];
    return DualCodingAnalyzer.analyzeForVisuals(text);
  }, [text, showVisualSuggestions]);

  // Create a mapping from HTML positions to rendered text positions
  const htmlToTextPositionMap = useMemo(() => {
    if (!isHtmlContent) return new Map<number, number>();

    const map = new Map<number, number>();
    let htmlPos = 0;
    let textPos = 0;

    // Walk through HTML character by character
    let insideTag = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === "<") {
        insideTag = true;
        map.set(i, textPos); // Map this HTML position to current text position
      } else if (char === ">") {
        insideTag = false;
        map.set(i, textPos);
      } else if (!insideTag) {
        // Count actual text characters
        map.set(i, textPos);
        textPos++;
      } else {
        // Inside a tag, don't count toward text position
        map.set(i, textPos);
      }
    }

    return map;
  }, [text, isHtmlContent]);

  useEffect(() => {
    setText(initialText);
    setHistory([initialText]);
    setHistoryIndex(0);
  }, [initialText]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + Z: Undo
      if (modKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y: Redo
      if (
        (modKey && e.shiftKey && e.key === "z") ||
        (modKey && e.key === "y")
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Cmd/Ctrl + C: Copy (browser default, but we show feedback)
      if (modKey && e.key === "c" && selectedText) {
        // Let browser handle it, but show feedback
        setTimeout(() => {
          const msg = document.createElement("div");
          msg.textContent = "✅ Copied to clipboard";
          msg.style.cssText =
            "position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 24px;border-radius:8px;z-index:10000;font-size:14px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.15)";
          document.body.appendChild(msg);
          setTimeout(() => msg.remove(), 2000);
        }, 100);
      }

      // Cmd/Ctrl + X: Cut (browser default)
      // Cmd/Ctrl + V: Paste (browser default)
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedText, historyIndex]);

  // Scroll to highlighted position
  useEffect(() => {
    if (highlightPosition !== null) {
      if (readOnly && containerRef.current) {
        // Read-only mode: scroll to position
        if (isHtmlContent) {
          // Convert HTML position to rendered text position
          const textPosition =
            htmlToTextPositionMap.get(highlightPosition) ?? highlightPosition;

          const container = containerRef.current;
          const allTextNodes: Text[] = [];

          // Walk through all text nodes
          const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null
          );

          let node;
          while ((node = walker.nextNode())) {
            allTextNodes.push(node as Text);
          }

          console.log(
            "[DocumentEditor] Found",
            allTextNodes.length,
            "text nodes"
          );

          // Find the text node containing our highlight position
          let charCount = 0;
          let found = false;
          for (const textNode of allTextNodes) {
            const nodeLength = textNode.textContent?.length || 0;
            if (charCount + nodeLength > textPosition) {
              // Found the node, scroll its parent element into view
              const element = textNode.parentElement;
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                // Flash highlight
                const originalBg = element.style.backgroundColor;
                element.style.backgroundColor = "#fef3c7";
                setTimeout(() => {
                  element.style.backgroundColor = originalBg;
                }, 2000);
              }
              found = true;
              break;
            }
            charCount += nodeLength;
          }

          if (!found) {
            console.warn(
              "[DocumentEditor] Could not find text node at position:",
              textPosition,
              "Total text length:",
              charCount
            );
          }
        } else {
          // For plain text rendering, use paragraph IDs
          let charCount = 0;
          const paragraphs = text.split(/\n\n+/);

          for (let i = 0; i < paragraphs.length; i++) {
            const paraLength = paragraphs[i].length + 2; // +2 for \n\n
            if (charCount + paraLength > highlightPosition) {
              // Found the paragraph, scroll to it
              const element = document.getElementById(`para-${i}`);
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                // Flash highlight
                element.style.backgroundColor = "#fef3c7";
                setTimeout(() => {
                  element.style.backgroundColor = "";
                }, 2000);
              }
              break;
            }
            charCount += paraLength;
          }
        }
      } else if (!readOnly && textareaRef.current) {
        // Edit mode: select text in textarea
        const textarea = textareaRef.current;

        // Set selection to the word at this position
        const beforeText = text.substring(0, highlightPosition);
        const afterText = text.substring(highlightPosition);

        // Find word boundaries
        const wordStart = beforeText.search(/\S+$/);
        const startPos =
          wordStart >= 0
            ? beforeText.length - beforeText.substring(wordStart).length
            : highlightPosition;
        const wordMatch = afterText.match(/^\S+/);
        const endPos = wordMatch
          ? highlightPosition + wordMatch[0].length
          : highlightPosition + 10;

        // Select the text
        textarea.focus();
        textarea.setSelectionRange(startPos, endPos);

        // Scroll into view
        // Calculate line height and position
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const lines = text.substring(0, highlightPosition).split("\n").length;
        const scrollPosition = Math.max(0, (lines - 5) * lineHeight);
        textarea.scrollTop = scrollPosition;

        // Flash background color on the textarea briefly
        textarea.style.backgroundColor = "#fef3c7";
        setTimeout(() => {
          textarea.style.backgroundColor = "";
        }, 2000);
      }
    }
  }, [highlightPosition, text, readOnly, isHtmlContent, htmlToTextPositionMap]);

  const addToHistory = (newText: string) => {
    // Remove any "future" history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);

    // Keep only last 50 states to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousText = history[newIndex];
      setText(previousText);
      onTextChange(previousText);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextText = history[newIndex];
      setText(nextText);
      onTextChange(nextText);
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    onTextChange(newText);
    addToHistory(newText);
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    const selected = selection?.toString() || "";
    setSelectedText(selected);
  };

  const deleteSelectedText = () => {
    if (!selectedText) {
      return;
    }

    const updatedText = text.replace(selectedText, "");
    handleTextChange(updatedText);
    setSelectedText("");
  };

  const openReplaceDialog = () => {
    if (!selectedText) {
      return;
    }
    setReplacementText(selectedText);
    setShowReplaceDialog(true);
  };

  const handleReplace = () => {
    if (!selectedText) return;

    const updatedText = text.replace(selectedText, replacementText);
    handleTextChange(updatedText);
    setShowReplaceDialog(false);
    setSelectedText("");
    setReplacementText("");
  };

  const copySelectedText = () => {
    if (!selectedText) {
      return;
    }

    navigator.clipboard.writeText(selectedText).catch(() => {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = selectedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("✅ Text copied to clipboard");
    });
  };

  // Render HTML content with images (with spacing and dual coding overlays)
  const renderHtmlContent = () => {
    // Extract plain text from HTML for analysis
    const plainText = text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .trim();

    // Parse HTML into paragraphs for spacing analysis
    const htmlParagraphs: { html: string; textLength: number }[] = [];
    if (showSpacingIndicators) {
      // Match paragraph tags and extract content
      const paragraphMatches = text.match(/<p[^>]*>.*?<\/p>/gi) || [];
      paragraphMatches.forEach((paraHtml) => {
        // Extract text length for spacing calculation
        const paraText = paraHtml
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .trim();
        if (paraText.length > 0) {
          htmlParagraphs.push({ html: paraHtml, textLength: paraText.length });
        }
      });
    }

    return (
      <div>
        {/* Dual Coding Summary */}
        {showVisualSuggestions && visualSuggestions.length > 0 && (
          <div
            style={{
              padding: "16px",
              marginBottom: "24px",
              backgroundColor: "#fef3c7",
              border: "2px solid #f59e0b",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>
              📊 Dual Coding Analysis
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#92400e",
                marginBottom: "12px",
              }}
            >
              Found <strong>{visualSuggestions.length}</strong>{" "}
              {visualSuggestions.length === 1 ? "location" : "locations"} where
              adding visuals (diagrams, charts, illustrations) would improve
              comprehension. Consider adding images at key concept explanations.
            </div>
            {/* Jump to location buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {visualSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Dispatch custom event to jump to position
                    window.dispatchEvent(
                      new CustomEvent("jump-to-position", {
                        detail: { position: suggestion.position },
                      })
                    );
                  }}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d97706";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f59e0b";
                  }}
                  title={`${suggestion.reason} - Suggested: ${suggestion.visualType}`}
                >
                  Jump to location {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render HTML content with spacing indicators */}
        {showSpacingIndicators && htmlParagraphs.length > 0 ? (
          <div>
            {htmlParagraphs.map((para, index) => {
              const nextPara = htmlParagraphs[index + 1];
              const currentLength = para.textLength;
              const needsMoreSpacing = currentLength > 800; // Long paragraph needs more spacing

              return (
                <div
                  key={index}
                  style={{ marginBottom: needsMoreSpacing ? "32px" : "16px" }}
                >
                  {/* Top spacing indicator */}
                  {index > 0 && (
                    <div
                      style={{
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#d1d5db",
                        marginBottom: "16px",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "0",
                          top: "-10px",
                          fontSize: "11px",
                          color: "#6b7280",
                          backgroundColor: "white",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontWeight: "500",
                        }}
                      >
                        ━━━ {currentLength} chars ━━━
                      </span>
                    </div>
                  )}

                  {/* Paragraph content */}
                  <div
                    dangerouslySetInnerHTML={{ __html: para.html }}
                    style={{
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                      lineHeight: "1.8",
                      color: "#1f2937",
                    }}
                    className="prose-content"
                  />

                  {/* Bottom spacing indicator */}
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
        ) : (
          /* Fallback: render raw HTML without spacing indicators */
          <div
            dangerouslySetInnerHTML={{ __html: text }}
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              lineHeight: "1.8",
              color: "#1f2937",
            }}
            className="prose-content"
          />
        )}
      </div>
    );
  };

  // Render text with spacing indicators
  const renderTextWithSpacing = () => {
    console.log(
      `[DocumentEditor] renderTextWithSpacing called, text.length=${text.length}`
    );

    // Split by double newlines first, but also handle single newlines if no double newlines exist
    let paragraphs = text.split(/\n\n+/);

    // If only one paragraph and it's very long, split by single newlines instead
    if (paragraphs.length === 1 && text.length > 1000) {
      console.log(
        `[DocumentEditor] Single long paragraph detected (${text.length} chars), splitting by single newlines`
      );
      paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);
      console.log(
        `[DocumentEditor] After split: ${
          paragraphs.length
        } paragraphs, first para length: ${
          paragraphs[0]?.length
        }, last para length: ${paragraphs[paragraphs.length - 1]?.length}`
      );
    } else {
      console.log(
        `[DocumentEditor] Split into ${paragraphs.length} paragraphs by double newlines`
      );
    }

    // Build position map for visual suggestions
    const visualSuggestionMap = new Map<number, VisualSuggestion>();
    let charCount = 0;
    paragraphs.forEach((para, index) => {
      const trimmedPara = para.trim();
      if (trimmedPara) {
        // Find suggestions that fall within this paragraph
        const suggestions = visualSuggestions.filter(
          (s) =>
            s.position >= charCount && s.position < charCount + para.length + 2
        );
        if (suggestions.length > 0) {
          visualSuggestionMap.set(index, suggestions[0]); // Use highest priority
        }
      }
      charCount += para.length + 2; // +2 for \n\n
    });

    return (
      <div style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        {paragraphs.map((para, index) => {
          const trimmedPara = para.trim();
          if (!trimmedPara)
            return <React.Fragment key={index}></React.Fragment>;

          const nextPara = paragraphs[index + 1]?.trim();
          const currentLength = trimmedPara.length;
          const needsMoreSpacing =
            nextPara &&
            ((currentLength > 500 && nextPara.length > 500) ||
              (currentLength < 100 && nextPara.length > 200) ||
              (/[.!?]$/.test(trimmedPara) && nextPara.match(/^[A-Z]/)));

          const visualSuggestion = visualSuggestionMap.get(index);

          return (
            <div
              key={index}
              style={{ marginBottom: needsMoreSpacing ? "32px" : "16px" }}
            >
              {/* Top spacing line */}
              {showSpacingIndicators && (
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
              )}

              {/* Visual Suggestion Alert - BEFORE paragraph */}
              {showVisualSuggestions && visualSuggestion && (
                <div
                  style={{
                    padding: "12px 16px",
                    marginBottom: "12px",
                    backgroundColor:
                      visualSuggestion.priority === "high"
                        ? "#fef3c7"
                        : visualSuggestion.priority === "medium"
                        ? "#dbeafe"
                        : "#f3f4f6",
                    border: `2px solid ${
                      visualSuggestion.priority === "high"
                        ? "#f59e0b"
                        : visualSuggestion.priority === "medium"
                        ? "#3b82f6"
                        : "#9ca3af"
                    }`,
                    borderRadius: "8px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      gap: "12px",
                    }}
                  >
                    <div style={{ fontSize: "24px" }}>
                      {visualSuggestion.visualType === "diagram"
                        ? "📊"
                        : visualSuggestion.visualType === "flowchart"
                        ? "🔄"
                        : visualSuggestion.visualType === "graph"
                        ? "📈"
                        : visualSuggestion.visualType === "concept-map"
                        ? "🗺️"
                        : "🖼️"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            backgroundColor:
                              visualSuggestion.priority === "high"
                                ? "#f59e0b"
                                : visualSuggestion.priority === "medium"
                                ? "#3b82f6"
                                : "#6b7280",
                            color: "white",
                            textTransform: "uppercase",
                          }}
                        >
                          {visualSuggestion.priority}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#374151",
                          }}
                        >
                          Add {visualSuggestion.visualType}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: "0 0 6px 0",
                          fontSize: "13px",
                          color: "#1f2937",
                          fontWeight: "500",
                        }}
                      >
                        💡 {visualSuggestion.reason}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          color: "#6b7280",
                          fontStyle: "italic",
                        }}
                      >
                        Dual coding improves comprehension by presenting
                        information both visually and verbally
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      fontSize: "10px",
                      color: "#9ca3af",
                      backgroundColor: "white",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    ↓ Visual needed
                  </div>
                </div>
              )}

              {/* Paragraph text */}
              <p
                id={`para-${index}`}
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.8",
                  fontSize: "16px",
                  color: "#1f2937",
                  transition: "background-color 0.5s ease",
                  ...(visualSuggestion && {
                    borderLeft: `4px solid ${
                      visualSuggestion.priority === "high"
                        ? "#f59e0b"
                        : visualSuggestion.priority === "medium"
                        ? "#3b82f6"
                        : "#9ca3af"
                    }`,
                    paddingLeft: "12px",
                    backgroundColor: visualSuggestion
                      ? "#fefce8"
                      : "transparent",
                  }),
                }}
                onMouseUp={handleSelection}
              >
                {trimmedPara}
              </p>

              {/* Bottom spacing indicator */}
              {showSpacingIndicators && nextPara && (
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

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      {!readOnly && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600" }}
          >
            Text Editing:
          </span>

          {onSave && (
            <button
              onClick={onSave}
              style={{
                padding: "6px 16px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                marginRight: "8px",
              }}
              title="Save as DOCX"
            >
              💾 Save DOCX
            </button>
          )}

          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            style={{
              padding: "6px 12px",
              backgroundColor: historyIndex > 0 ? "#3b82f6" : "#d1d5db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: historyIndex > 0 ? "pointer" : "not-allowed",
            }}
            title="Undo (Cmd/Ctrl+Z)"
          >
            ↶ Undo
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            style={{
              padding: "6px 12px",
              backgroundColor:
                historyIndex < history.length - 1 ? "#3b82f6" : "#d1d5db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              cursor:
                historyIndex < history.length - 1 ? "pointer" : "not-allowed",
            }}
            title="Redo (Cmd/Ctrl+Shift+Z)"
          >
            ↷ Redo
          </button>

          <button
            onClick={copySelectedText}
            disabled={!selectedText}
            style={{
              padding: "6px 12px",
              backgroundColor: selectedText ? "#10b981" : "#d1d5db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: selectedText ? "pointer" : "not-allowed",
            }}
            title="Copy selected text"
          >
            📋 Copy
          </button>
          <button
            onClick={deleteSelectedText}
            disabled={!selectedText}
            style={{
              padding: "6px 12px",
              backgroundColor: selectedText ? "#ef4444" : "#d1d5db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: selectedText ? "pointer" : "not-allowed",
            }}
            title="Delete selected text"
          >
            🗑️ Delete
          </button>
          <button
            onClick={openReplaceDialog}
            disabled={!selectedText}
            style={{
              padding: "6px 12px",
              backgroundColor: selectedText ? "#3b82f6" : "#d1d5db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: selectedText ? "pointer" : "not-allowed",
            }}
            title="Replace selected text"
          >
            ✏️ Replace
          </button>

          {selectedText && (
            <span
              style={{
                fontSize: "11px",
                color: "#6b7280",
                marginLeft: "auto",
              }}
            >
              Selected: {selectedText.length} chars
            </span>
          )}
        </div>
      )}

      {/* Document Content */}
      <div
        ref={containerRef}
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
            padding: "60px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            minHeight: "100%",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              padding: "12px",
              backgroundColor: readOnly ? "#fef3c7" : "#dbeafe",
              borderLeft: `4px solid ${readOnly ? "#f59e0b" : "#3b82f6"}`,
              borderRadius: "4px",
            }}
          >
            <strong>
              {readOnly ? "📖 Document Viewer" : " Document Editor"}
            </strong>
            <div
              style={{
                fontSize: "14px",
                marginTop: "4px",
                color: readOnly ? "#92400e" : "#1e40af",
              }}
            >
              {text.length.toLocaleString()} characters •{" "}
              {text.split(/\s+/).length.toLocaleString()} words
              {readOnly && (
                <div style={{ marginTop: "6px", fontWeight: "600" }}>
                  🔒 Read-only mode: Switch to Writer mode to edit
                </div>
              )}
            </div>
          </div>

          {readOnly ? (
            isHtmlContent ? (
              renderHtmlContent()
            ) : (
              renderTextWithSpacing()
            )
          ) : (
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              onMouseUp={handleSelection}
              onKeyUp={handleSelection}
              onPaste={(e) => {
                // Trigger history update after paste
                setTimeout(() => {
                  const textarea = e.currentTarget;
                  handleTextChange(textarea.value);
                }, 10);
              }}
              style={{
                width: "100%",
                minHeight: "500px",
                padding: "16px",
                fontSize: "16px",
                lineHeight: "1.8",
                color: "#1f2937",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                resize: "vertical",
                outline: "none",
                transition: "border-color 0.2s, background-color 0.5s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
              placeholder="Start typing or paste your document here..."
            />
          )}
        </div>
      </div>

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
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>
              Replace Text
            </h3>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "4px",
                  color: "#6b7280",
                }}
              >
                Original:
              </label>
              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#fef3c7",
                  borderRadius: "4px",
                  fontSize: "14px",
                  maxHeight: "100px",
                  overflow: "auto",
                }}
              >
                {selectedText}
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "4px",
                  color: "#6b7280",
                }}
              >
                Replace with:
              </label>
              <textarea
                value={replacementText}
                onChange={(e) => setReplacementText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "14px",
                  minHeight: "100px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
                autoFocus
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowReplaceDialog(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f3f4f6",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
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
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
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
