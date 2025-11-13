import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  DualCodingAnalyzer,
  VisualSuggestion,
} from "@/utils/dualCodingAnalyzer";

interface ParagraphSegment {
  id: number;
  start: number;
  end: number;
  raw: string;
}

interface DocumentEditorProps {
  initialText: string;
  searchText?: string | null;
  onTextChange: (text: string) => void;
  showSpacingIndicators?: boolean;
  showVisualSuggestions?: boolean;
  highlightPosition: number | null;
  searchWord: string | null;
  searchOccurrence: number;
  onSave?: () => void;
  readOnly?: boolean;
}

const computeParagraphSegments = (input: string): ParagraphSegment[] => {
  const normalized = input.replace(/\r\n/g, "\n");

  if (!normalized.length) {
    return [
      {
        id: 0,
        start: 0,
        end: 0,
        raw: "",
      },
    ];
  }

  const segments: ParagraphSegment[] = [];
  const parts = normalized.split(/(\n\s*\n+)/);
  let offset = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) {
      continue;
    }

    let raw = part;
    if (i + 1 < parts.length && /\n\s*\n+/.test(parts[i + 1])) {
      raw += parts[i + 1];
      i++;
    }

    const end = offset + raw.length;
    segments.push({
      id: segments.length,
      start: offset,
      end,
      raw,
    });
    offset = end;
  }

  if (segments.length === 0) {
    segments.push({
      id: 0,
      start: 0,
      end: normalized.length,
      raw: normalized,
    });
  }

  return segments;
};

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialText,
  searchText,
  onTextChange,
  showSpacingIndicators = false,
  showVisualSuggestions = false,
  highlightPosition,
  searchWord,
  searchOccurrence,
  onSave,
  readOnly = false,
}) => {
  const [text, setText] = useState(() => initialText);
  const [history, setHistory] = useState<string[]>([initialText]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [replacementText, setReplacementText] = useState("");
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visualSuggestions, setVisualSuggestions] = useState<
    VisualSuggestion[]
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText);
    setHistory([initialText]);
    setHistoryIndex(0);
  }, [initialText]);

  const paragraphSegments = useMemo(
    () => computeParagraphSegments(text),
    [text]
  );

  const isHtmlContent = useMemo(() => {
    const trimmed = text.trim();
    return trimmed.startsWith("<") && trimmed.includes("</");
  }, [text]);

  useEffect(() => {
    if (!showVisualSuggestions) {
      setVisualSuggestions([]);
      return;
    }

    try {
      const suggestions = DualCodingAnalyzer.analyzeForVisuals(text);
      setVisualSuggestions(suggestions);
    } catch (error) {
      console.error("Error running dual coding analyzer:", error);
      setVisualSuggestions([]);
    }
  }, [text, showVisualSuggestions]);

  useEffect(() => {
    const searchContent = searchText ?? text;

    const resolveHighlightStart = (): number | null => {
      if (typeof highlightPosition === "number" && highlightPosition >= 0) {
        return highlightPosition;
      }

      if (!searchWord) {
        return null;
      }

      const escaped = searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "gi");
      const haystack = searchContent.toLowerCase();
      let match: RegExpExecArray | null;
      let occurrenceIndex = 0;

      while ((match = regex.exec(haystack)) !== null) {
        if (occurrenceIndex === searchOccurrence) {
          return match.index;
        }
        occurrenceIndex += 1;

        // Prevent zero-length match infinite loops
        if (match.index === regex.lastIndex) {
          regex.lastIndex += 1;
        }
      }

      return null;
    };

    const deriveHighlightLength = (startIndex: number): number => {
      let highlightLength = 1;

      if (searchWord && searchWord.trim().length > 0) {
        const escapedWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const anchoredRegex = new RegExp(
          `^${escapedWord.replace(/\s+/g, "\\s+")}`,
          "i"
        );
        const segment = searchContent.slice(startIndex);
        const anchoredMatch = anchoredRegex.exec(segment);

        if (anchoredMatch && anchoredMatch[0].length > 0) {
          highlightLength = anchoredMatch[0].length;
        } else {
          highlightLength = Math.max(searchWord.length, 1);
        }
      } else {
        const fallbackMatch = searchContent.slice(startIndex).match(/^\S+/);
        if (fallbackMatch && fallbackMatch[0].length > 0) {
          highlightLength = fallbackMatch[0].length;
        }
      }

      return Math.max(highlightLength, 1);
    };

    const targetStart = resolveHighlightStart();
    if (targetStart === null || targetStart < 0) {
      return;
    }

    const highlightLength = deriveHighlightLength(targetStart);

    if (readOnly) {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      let targetElement: HTMLElement | null = null;

      for (let i = 0; i < paragraphSegments.length; i++) {
        const segment = paragraphSegments[i];
        if (targetStart >= segment.start && targetStart < segment.end) {
          targetElement = document.getElementById(`para-${i}`);
          break;
        }
      }

      if (!targetElement && paragraphSegments.length > 0) {
        const fallbackIndex = paragraphSegments.length - 1;
        targetElement = document.getElementById(`para-${fallbackIndex}`);
      }

      if (!targetElement) {
        return;
      }

      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setShowBackToTop(true);
      targetElement.style.backgroundColor = "#fef3c7";
      setTimeout(() => {
        targetElement!.style.backgroundColor = "";
      }, 2000);

      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection) {
          return;
        }
        selection.removeAllRanges();

        const walker = document.createTreeWalker(
          container,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node: Node) => {
              let parent = node.parentElement;
              while (parent && parent !== container) {
                if (parent.getAttribute("data-paragraph-text") === "true") {
                  return NodeFilter.FILTER_ACCEPT;
                }
                parent = parent.parentElement;
              }
              return NodeFilter.FILTER_SKIP;
            },
          }
        );

        let currentPos = 0;
        let targetNode: Node | null = null;
        let offsetInNode = 0;
        let walkerNode: Node | null;

        while ((walkerNode = walker.nextNode())) {
          const nodeLength = walkerNode.textContent?.length || 0;
          if (currentPos + nodeLength > targetStart) {
            targetNode = walkerNode;
            offsetInNode = targetStart - currentPos;
            break;
          }
          currentPos += nodeLength;
        }

        if (!targetNode) {
          return;
        }

        const range = document.createRange();
        range.setStart(targetNode, offsetInNode);

        let remaining = highlightLength;
        let currentNode: Node | null = targetNode;
        let startOffset = offsetInNode;

        while (currentNode && remaining > 0) {
          const nodeText = currentNode.textContent || "";
          const available = nodeText.length - startOffset;

          if (available >= remaining) {
            range.setEnd(currentNode, startOffset + remaining);
            remaining = 0;
          } else {
            range.setEnd(currentNode, nodeText.length);
            remaining -= available;
            currentNode = walker.nextNode();
            startOffset = 0;
          }
        }

        selection.addRange(range);
      }, 120);
    } else if (textareaRef.current) {
      const textarea = textareaRef.current;
      const beforeText = text.substring(0, targetStart);

      const wordStart = beforeText.search(/\S+$/);
      const startPos =
        wordStart >= 0
          ? beforeText.length - beforeText.substring(wordStart).length
          : targetStart;
      const endPos = targetStart + highlightLength;

      textarea.focus();
      textarea.setSelectionRange(startPos, endPos);

      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const lines = text.substring(0, targetStart).split("\n").length;
      const scrollPosition = Math.max(0, (lines - 5) * lineHeight);
      textarea.scrollTop = scrollPosition;

      textarea.style.backgroundColor = "#fef3c7";
      setTimeout(() => {
        textarea.style.backgroundColor = "";
      }, 2000);
    }
  }, [
    highlightPosition,
    searchWord,
    searchOccurrence,
    readOnly,
    searchText,
    text,
    paragraphSegments,
  ]);

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
        {showSpacingIndicators &&
        htmlParagraphs.length > 0 &&
        !text.includes("<img") ? (
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
          <>
            {(() => {
              console.log("🖼️ Rendering HTML content");
              console.log("  Text length:", text.length);
              console.log("  Has <img tags:", text.includes("<img"));
              console.log(
                "  Number of <img tags:",
                (text.match(/<img/g) || []).length
              );
              console.log("  First 500 chars:", text.substring(0, 500));
              return null;
            })()}
            <div
              dangerouslySetInnerHTML={{ __html: text }}
              style={{
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                lineHeight: "1.8",
                color: "#1f2937",
              }}
              className="prose-content"
            />
          </>
        )}
      </div>
    );
  };

  // Render text with spacing indicators
  const renderTextWithSpacing = () => {
    console.log(
      `[DocumentEditor] renderTextWithSpacing called, text.length=${text.length}`
    );
    console.log(
      `[DocumentEditor] Using ${paragraphSegments.length} paragraph segments`
    );

    const visualSuggestionMap = new Map<number, VisualSuggestion>();
    paragraphSegments.forEach((segment, index) => {
      const trimmed = segment.raw.trim();
      if (!trimmed) {
        return;
      }
      const suggestions = visualSuggestions.filter(
        (suggestion) =>
          suggestion.position >= segment.start &&
          suggestion.position < segment.end
      );
      if (suggestions.length > 0) {
        visualSuggestionMap.set(index, suggestions[0]);
      }
    });

    return (
      <div style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        {paragraphSegments.map((segment, index) => {
          const rawParagraph = segment.raw;
          const trimmedParagraph = rawParagraph.trim();
          const nextSegment = paragraphSegments[index + 1];
          const nextTrimmed = nextSegment ? nextSegment.raw.trim() : "";

          if (!trimmedParagraph) {
            return (
              <p
                key={segment.id}
                id={`para-${index}`}
                data-paragraph-text="true"
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.8",
                  fontSize: "16px",
                  color: "#1f2937",
                }}
                onMouseUp={handleSelection}
              >
                {rawParagraph}
              </p>
            );
          }

          const currentLength = trimmedParagraph.length;
          const needsMoreSpacing =
            nextTrimmed &&
            ((currentLength > 500 && nextTrimmed.length > 500) ||
              (currentLength < 100 && nextTrimmed.length > 200) ||
              (/[.!?]$/.test(trimmedParagraph) && /^[A-Z]/.test(nextTrimmed)));

          const visualSuggestion = visualSuggestionMap.get(index);

          return (
            <div
              key={segment.id}
              style={{ marginBottom: needsMoreSpacing ? "32px" : "16px" }}
            >
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

              <p
                id={`para-${index}`}
                data-paragraph-text="true"
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
                    backgroundColor: "#fefce8",
                  }),
                }}
                onMouseUp={handleSelection}
              >
                {rawParagraph}
              </p>

              {showSpacingIndicators && nextTrimmed && (
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

      {/* Back to Top Button */}
      {showBackToTop && readOnly && (
        <button
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setShowBackToTop(false);
              console.log("🔝 Scrolling to top, hiding button");
            }
          }}
          style={{
            position: "fixed",
            bottom: "320px",
            left: "30px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
            cursor: "pointer",
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            transition: "all 0.2s ease",
            pointerEvents: "auto",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3b82f6";
            e.currentTarget.style.transform = "scale(1)";
          }}
          title="Back to top"
        >
          ⬆️
        </button>
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

export default DocumentEditor;
