import React, {
  ClipboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DualCodingAnalyzer,
  VisualSuggestion,
} from "@/utils/dualCodingAnalyzer";
import {
  analyzeParagraphSpacing,
  countWords,
  extractParagraphs,
  ParagraphSummary,
  SpacingTone,
} from "@/utils/spacingInsights";

interface DocumentEditorProps {
  initialText: string;
  htmlContent?: string | null;
  searchText?: string | null;
  onTextChange: (text: string) => void;
  onContentChange?: (content: { plainText: string; html: string }) => void;
  showSpacingIndicators?: boolean;
  showVisualSuggestions?: boolean;
  highlightPosition: number | null;
  searchWord: string | null;
  searchOccurrence: number;
  onSave?: () => void;
  readOnly?: boolean;
  scrollToTopSignal?: number;
  onScrollDepthChange?: (hasScrolled: boolean) => void;
  isCompactLayout?: boolean;
  analysisResult?: any;
  viewMode?: string;
  isTemplateMode?: boolean;
}

type HighlightRange = {
  start: number;
  length: number;
};

type HighlightSegment = {
  text: string;
  highlighted: boolean;
};

const HIGHLIGHT_STYLE: React.CSSProperties = {
  backgroundColor: "#fde68a",
  color: "#1f2937",
  padding: "0 2px",
  borderRadius: "2px",
};

const PANEL_STYLE: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "12px",
  backgroundColor: "#f9fafb",
  marginTop: "16px",
};

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialText,
  htmlContent = null,
  searchText,
  searchWord,
  onTextChange,
  onContentChange,
  showSpacingIndicators = false,
  showVisualSuggestions = false,
  highlightPosition,
  searchOccurrence,
  onSave,
  readOnly = false,
  scrollToTopSignal,
  onScrollDepthChange,
  isCompactLayout = false,
  analysisResult,
  viewMode,
  isTemplateMode = false,
}) => {
  const [text, setText] = useState(() => initialText);
  const [visualSuggestions, setVisualSuggestions] = useState<
    VisualSuggestion[]
  >([]);
  const [editorWordCount, setEditorWordCount] = useState(() =>
    countWords(initialText)
  );
  const editorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isEditing = !readOnly;
  const skipNextPropSyncRef = useRef(false);
  const initialHtmlRef = useRef(
    htmlContent && htmlContent.trim().length
      ? sanitizeHtml(htmlContent)
      : convertTextToHtml(initialText)
  );
  const scrollStateRef = useRef({ preview: false, editor: false });

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtmlRef.current;
    }
  }, []);

  useEffect(() => {
    setEditorWordCount(countWords(initialText));
  }, [initialText]);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.innerHTML = initialHtmlRef.current;
    }
  }, [isEditing]);

  useEffect(() => {
    if (skipNextPropSyncRef.current) {
      skipNextPropSyncRef.current = false;
      return;
    }

    if (initialText !== text) {
      setText(initialText);
      const nextHtml =
        htmlContent && htmlContent.trim().length
          ? sanitizeHtml(htmlContent)
          : convertTextToHtml(initialText);
      initialHtmlRef.current = nextHtml;
      if (editorRef.current) {
        editorRef.current.innerHTML = nextHtml;
      }
    }
  }, [htmlContent, initialText, text]);

  const highlightRange = useMemo(
    () =>
      computeHighlightRange({
        text,
        searchText,
        searchWord,
        searchOccurrence,
        highlightPosition,
      }),
    [text, searchText, searchWord, searchOccurrence, highlightPosition]
  );

  useEffect(() => {
    if (!showVisualSuggestions) {
      setVisualSuggestions([]);
      return;
    }

    try {
      const suggestions = DualCodingAnalyzer.analyzeForVisuals(text);
      setVisualSuggestions(suggestions);
    } catch (error) {
      console.error("DualCodingAnalyzer failed", error);
      setVisualSuggestions([]);
    }
  }, [text, showVisualSuggestions]);

  useEffect(() => {
    if (!highlightRange) {
      return;
    }

    console.log("📍 Scroll to highlight triggered:", {
      readOnly,
      highlightRange,
      hasEditorRef: !!editorRef.current,
      hasHighlightRef: !!highlightRef.current,
      highlightRangeStart: highlightRange?.start,
      highlightRangeLength: highlightRange?.length,
    });

    if (readOnly) {
      // Try using highlightRef first, but fall back quickly if not available
      if (highlightRef.current) {
        console.log("📍 Scrolling preview to highlight using ref");
        highlightRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        // Fallback: scroll the preview container to approximate position
        console.warn("⚠️ Highlight ref not available, using fallback scroll");
        const previewContainer = previewRef.current || document.querySelector(
          ".preview-pane, .readonly-view"
        );
        if (previewContainer && highlightRange) {
          console.log("📍 Scrolling preview container to position");
          const estimatedScroll =
            (highlightRange.start / text.length) *
            previewContainer.scrollHeight;
          previewContainer.scrollTop =
            estimatedScroll - previewContainer.clientHeight / 2;
        }
      }
      return;
    }

    const editor = editorRef.current;
    if (editor) {
      console.log("📍 Scrolling editor to range:", highlightRange);
      scrollEditableToRange(
        editor,
        highlightRange.start,
        highlightRange.length
      );
    } else {
      console.warn("⚠️ Editor ref not available for scrolling");
    }
  }, [highlightRange, readOnly]);

  const paragraphs = useMemo(() => extractParagraphs(text), [text]);

  const suggestionsByParagraph = useMemo(() => {
    if (!showVisualSuggestions) {
      return new Map<number, VisualSuggestion[]>();
    }
    return buildParagraphSuggestionMap(paragraphs, visualSuggestions);
  }, [paragraphs, visualSuggestions, showVisualSuggestions]);

  const syncEditorState = () => {
    const currentHtml = editorRef.current?.innerHTML ?? "";
    const plain = htmlToPlainText(currentHtml);
    initialHtmlRef.current = currentHtml;
    setEditorWordCount(countWords(plain));
    skipNextPropSyncRef.current = true;
    if (onContentChange) {
      onContentChange({ plainText: plain, html: currentHtml });
    } else {
      onTextChange(plain);
    }
  };

  const handleEditorInput = () => {
    syncEditorState();
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (readOnly) {
      return;
    }

    const clipboard = event.clipboardData;
    if (!clipboard) {
      requestAnimationFrame(syncEditorState);
      return;
    }

    const pastedText =
      clipboard.getData("text/plain")?.toString() ||
      clipboard.getData("text")?.toString() ||
      "";

    const imageItem = Array.from(clipboard.items || []).find((item) =>
      item.type.startsWith("image/")
    );

    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        event.preventDefault();
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          insertHtmlWithUndoSupport(
            `<img src="${dataUrl}" alt="Pasted image" style="max-width:100%;height:auto;" />`
          );
          syncEditorState();
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    const htmlData = clipboard.getData("text/html");
    if (htmlData) {
      event.preventDefault();
      insertHtmlWithUndoSupport(htmlData);
      syncEditorState();
      return;
    }

    // Allow default text insertion for undo stack, then sync state
    if (pastedText.length) {
      requestAnimationFrame(syncEditorState);
    }
  };

  const handleSave = () => {
    onSave?.();
  };

  const emitScrollDepth = () => {
    const hasScrolled =
      scrollStateRef.current.preview || scrollStateRef.current.editor;
    onScrollDepthChange?.(hasScrolled);
  };

  const handlePreviewScroll = () => {
    const scrolled = (previewRef.current?.scrollTop ?? 0) > 160;
    if (scrollStateRef.current.preview !== scrolled) {
      scrollStateRef.current.preview = scrolled;
      emitScrollDepth();
    }
  };

  const handleEditorScroll = () => {
    const scrolled = (editorRef.current?.scrollTop ?? 0) > 160;
    if (scrollStateRef.current.editor !== scrolled) {
      scrollStateRef.current.editor = scrolled;
      emitScrollDepth();
    }
  };

  useEffect(() => {
    if (!scrollToTopSignal) {
      return;
    }

    previewRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    editorRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    scrollStateRef.current = { preview: false, editor: false };
    onScrollDepthChange?.(false);
  }, [scrollToTopSignal, onScrollDepthChange]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: isCompactLayout ? "12px" : "16px",
      }}
    >
      <div
        className="app-panel"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isCompactLayout ? "8px" : "12px",
          padding: isCompactLayout ? "12px" : "16px",
          backgroundColor: "#f5ead9",
          background: "#f5ead9",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ flex: 1, minWidth: isCompactLayout ? "200px" : "240px" }}
          >
            <div
              style={{
                fontSize: isCompactLayout ? "14px" : "15px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              {isEditing
                ? "Author workspace with live spacing guidance"
                : "Live preview with spacing + dual coding"}
            </div>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: isCompactLayout ? "12px" : "13px",
                color: "#6b7280",
                lineHeight: 1.5,
              }}
            >
              {isEditing
                ? "Scroll the preview on the left to see spacing targets and dual-coding callouts update as you edit on the right."
                : "Spacing targets and dual-coding callouts render inline below for accurate placement."}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              marginRight: isCompactLayout ? "0" : "8px",
            }}
          >
            {onSave && (
              <button
                onClick={handleSave}
                style={{
                  padding: isCompactLayout ? "5px 12px" : "6px 14px",
                  borderRadius: "20px",
                  border: "1.5px solid #ef8432",
                  fontSize: isCompactLayout ? "12px" : "13px",
                  fontWeight: 600,
                  color: "#ef8432",
                  backgroundColor: "white",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {isCompactLayout ? "Save" : "Save changes"}
              </button>
            )}
          </div>
        </div>

        {(showSpacingIndicators || showVisualSuggestions) && (
          <div style={{ marginTop: "4px" }}>
            <GuidanceLegend
              showSpacing={showSpacingIndicators}
              showVisual={showVisualSuggestions}
            />
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          gap: isCompactLayout ? "12px" : "16px",
          minHeight: 0,
          flexDirection: isCompactLayout ? "column" : "row",
        }}
      >
        {!isTemplateMode && (
          <div
            style={{
              flex: !isEditing || isCompactLayout ? 1 : 0.5,
              minHeight: isCompactLayout ? "300px" : 0,
              display: "flex",
              flexDirection: "column",
              gap: isCompactLayout ? "8px" : "12px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#111827",
                fontWeight: 600,
                fontSize: isCompactLayout ? "13px" : "14px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span>Document Preview</span>
              <span
                style={{
                  fontSize: isCompactLayout ? "11px" : "12px",
                  color: "#6b7280",
                }}
              >
                Spacing indicators + dual coding
              </span>
            </div>

            <ReadOnlyView
              paragraphs={paragraphs}
              highlightRange={highlightRange}
              highlightRef={highlightRef}
              showSpacingIndicators={showSpacingIndicators}
              showVisualSuggestions={showVisualSuggestions}
              suggestionsByParagraph={suggestionsByParagraph}
              containerRef={previewRef}
              onScroll={handlePreviewScroll}
              htmlContent={htmlContent}
            />
          </div>
        )}

        {isEditing && (
          <div
            style={{
              flex: isTemplateMode || isCompactLayout ? 1 : 0.5,
              minHeight: isCompactLayout ? "300px" : 0,
              display: "flex",
              flexDirection: "column",
              gap: isCompactLayout ? "8px" : "12px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#111827",
                fontWeight: 600,
                fontSize: isCompactLayout ? "13px" : "14px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span>Editable document</span>
              <span
                style={{
                  fontSize: isCompactLayout ? "11px" : "12px",
                  color: "#6b7280",
                  fontWeight: 500,
                }}
              >
                {text.split(/\s+/).filter(Boolean).length.toLocaleString()}{" "}
                words
              </span>
            </div>
            <EditableView
              editorRef={editorRef}
              onInput={handleEditorInput}
              onPaste={handlePaste}
              onScroll={handleEditorScroll}
            />
          </div>
        )}
      </div>
    </div>
  );
};

type GuidanceLegendProps = {
  showSpacing: boolean;
  showVisual: boolean;
};

const GuidanceLegend: React.FC<GuidanceLegendProps> = ({
  showSpacing,
  showVisual,
}) => {
  return (
    <div
      style={{
        ...PANEL_STYLE,
        marginTop: 0,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {showSpacing && (
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "13px",
              color: "#1d4ed8",
            }}
          >
            Spacing targets
          </div>
          <div
            style={{
              marginTop: "4px",
              fontSize: "12px",
              color: "#374151",
              lineHeight: 1.5,
            }}
          >
            Dashed lines show where each new paragraph begins. Aim for 60-160
            words between targets—amber badges ask you to split long paragraphs,
            while green badges suggest adding detail if the point feels rushed.
            <br />
            <em style={{ fontSize: "11px", color: "#6b7280" }}>
              Note: Indicators appear inside the preview panel for accurate
              positioning.
            </em>
          </div>
        </div>
      )}

      {showVisual && (
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "13px",
              color: "#b45309",
            }}
          >
            Dual-coding callouts
          </div>
          <div
            style={{
              marginTop: "4px",
              fontSize: "12px",
              color: "#4b5563",
              lineHeight: 1.5,
            }}
          >
            Gold markers highlight high-impact visuals to add. Check the preview
            panel below for the reason and follow the suggested action to
            reinforce the concept.
            <br />
            <em style={{ fontSize: "11px", color: "#6b7280" }}>
              Note: Callouts appear inside the preview panel for accurate
              positioning.
            </em>
          </div>
        </div>
      )}
    </div>
  );
};

type ReadOnlyViewProps = {
  paragraphs: ParagraphSummary[];
  highlightRange: HighlightRange | null;
  highlightRef: React.RefObject<HTMLSpanElement>;
  showSpacingIndicators: boolean;
  showVisualSuggestions: boolean;
  suggestionsByParagraph: Map<number, VisualSuggestion[]>;
  containerRef?: React.RefObject<HTMLDivElement>;
  onScroll?: () => void;
  htmlContent?: string | null;
};

const ReadOnlyView: React.FC<ReadOnlyViewProps> = ({
  paragraphs,
  highlightRange,
  highlightRef,
  showSpacingIndicators,
  showVisualSuggestions,
  suggestionsByParagraph,
  containerRef,
  onScroll,
  htmlContent,
}) => {
  let highlightAnchorAssigned = false;

  // If HTML content with images is available, render it directly
  if (htmlContent && htmlContent.includes("<img")) {
    return (
      <div
        ref={containerRef}
        onScroll={onScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "white",
          lineHeight: 1.6,
          fontSize: "14px",
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "12px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "white",
        lineHeight: 1.6,
        fontSize: "14px",
      }}
    >
      {paragraphs.length === 0 ? (
        <span style={{ color: "#9ca3af", fontSize: "13px" }}>
          Start writing to see spacing guidance and dual-coding suggestions.
        </span>
      ) : (
        paragraphs.map((paragraph, index) => {
          const callouts = suggestionsByParagraph.get(paragraph.id) || [];
          const segments = buildParagraphHighlightSegments(
            paragraph,
            highlightRange
          );
          const spacingInfo = analyzeParagraphSpacing(paragraph.wordCount);
          const spacingBadgeStyle = getSpacingBadgeStyle(spacingInfo.tone);

          return (
            <div
              key={paragraph.id}
              style={{
                padding: "12px 0",
                borderTop:
                  index === 0 ? "none" : "1px dashed rgba(59,130,246,0.45)",
                position: "relative",
              }}
            >
              {index > 0 && showSpacingIndicators && (
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: 0,
                    fontSize: "11px",
                    color: "#1d4ed8",
                    backgroundColor: "rgba(219,234,254,0.9)",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    fontWeight: 600,
                    boxShadow: "0 1px 2px rgba(17, 24, 39, 0.08)",
                    ...spacingBadgeStyle,
                  }}
                  title={spacingInfo.message}
                >
                  Spacing target · Paragraph {paragraph.id + 1}
                  <span style={{ color: "#2563eb", fontWeight: 500 }}>
                    {` · ${paragraph.wordCount} words · ${spacingInfo.shortLabel}`}
                  </span>
                </span>
              )}

              <div style={{ whiteSpace: "pre-wrap" }}>
                {segments.map((segment, segmentIndex) => {
                  if (!segment.text.length) {
                    return null;
                  }

                  if (segment.highlighted) {
                    // Assign ref only to the first highlighted segment for scrolling
                    const ref = !highlightAnchorAssigned
                      ? highlightRef
                      : undefined;
                    if (!highlightAnchorAssigned) {
                      highlightAnchorAssigned = true;
                    }
                    return (
                      <mark
                        key={`${paragraph.id}-segment-${segmentIndex}`}
                        ref={ref}
                        style={HIGHLIGHT_STYLE}
                      >
                        {segment.text}
                      </mark>
                    );
                  }

                  return (
                    <span key={`${paragraph.id}-segment-${segmentIndex}`}>
                      {segment.text}
                    </span>
                  );
                })}
              </div>

              {showVisualSuggestions && callouts.length > 0 && (
                <div
                  style={{
                    marginTop: "10px",
                    borderLeft: "4px solid #facc15",
                    backgroundColor: "#fefce8",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    color: "#78350f",
                    boxShadow: "0 2px 4px rgba(31, 41, 55, 0.08)",
                  }}
                >
                  {callouts.map((suggestion, suggestionIndex) => (
                    <div
                      key={`${suggestion.position}-${suggestionIndex}`}
                      style={{
                        marginBottom:
                          suggestionIndex === callouts.length - 1 ? 0 : "10px",
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: "13px" }}>
                        {getVisualIcon(suggestion.visualType)}{" "}
                        {formatVisualSuggestionTitle(suggestion)}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#92400e",
                          marginTop: "4px",
                        }}
                      >
                        {suggestion.reason}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "4px",
                        }}
                      >
                        {suggestion.paragraph}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#c2410c",
                          marginTop: "6px",
                          fontWeight: 500,
                        }}
                      >
                        Suggested action: {formatVisualAction(suggestion)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

type EditableViewProps = {
  editorRef: React.RefObject<HTMLDivElement>;
  onInput: () => void;
  onPaste: (event: ClipboardEvent<HTMLDivElement>) => void;
  onScroll?: () => void;
};

const EditableView: React.FC<EditableViewProps> = ({
  editorRef,
  onInput,
  onPaste,
  onScroll,
}) => {
  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={onInput}
      onPaste={onPaste}
      onScroll={onScroll}
      style={{
        flex: 1,
        minHeight: "300px",
        padding: "12px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#f5ead9",
        boxShadow: "inset 0 1px 2px rgba(15,23,42,0.05)",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "15px",
        lineHeight: 1.6,
        width: "100%",
        height: "100%",
        overflowY: "auto",
      }}
      data-placeholder="Start writing here..."
    />
  );
};

function buildParagraphSuggestionMap(
  paragraphs: ParagraphSummary[],
  suggestions: VisualSuggestion[]
): Map<number, VisualSuggestion[]> {
  const map = new Map<number, VisualSuggestion[]>();

  if (!paragraphs.length || !suggestions.length) {
    return map;
  }

  suggestions.forEach((suggestion) => {
    const target =
      paragraphs.find(
        (paragraph) =>
          suggestion.position >= paragraph.startIndex &&
          suggestion.position <= paragraph.endIndex
      ) || paragraphs[paragraphs.length - 1];

    if (!target) {
      return;
    }

    const current = map.get(target.id) || [];
    current.push(suggestion);
    map.set(target.id, current);
  });

  return map;
}

type SpacingOverlayProps = {
  paragraphs: ParagraphSummary[];
  textLength: number;
};

const SpacingOverlay: React.FC<SpacingOverlayProps> = ({
  paragraphs,
  textLength,
}) => {
  if (textLength === 0 || paragraphs.length <= 1) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: "16px",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {paragraphs.slice(1).map((paragraph) => {
        const topPercent = clamp(
          (paragraph.startIndex / textLength) * 100,
          4,
          96
        );
        const spacingInfo = analyzeParagraphSpacing(paragraph.wordCount);
        const spacingBadgeStyle = getSpacingBadgeStyle(spacingInfo.tone);

        return (
          <div
            key={`spacing-line-${paragraph.id}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${topPercent}%`,
            }}
          >
            <div
              style={{
                borderTop: "1px dashed rgba(59,130,246,0.45)",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-9px",
                  left: 0,
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#1d4ed8",
                  backgroundColor: "rgba(191,219,254,0.9)",
                  padding: "2px 6px",
                  borderRadius: "999px",
                  ...spacingBadgeStyle,
                }}
                title={spacingInfo.message}
              >
                Spacing target · P{paragraph.id + 1}
                {` · ${paragraph.wordCount} words · ${spacingInfo.shortLabel}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

type VisualOverlayProps = {
  suggestions: VisualSuggestion[];
  textLength: number;
};

const VisualOverlay: React.FC<VisualOverlayProps> = ({
  suggestions,
  textLength,
}) => {
  if (!suggestions.length || textLength === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: "16px",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      {suggestions.map((suggestion, index) => {
        const topPercent = clamp(
          (suggestion.position / textLength) * 100,
          5,
          95
        );
        const actionText = formatVisualAction(suggestion);

        return (
          <div
            key={`${suggestion.position}-${index}`}
            style={{
              position: "absolute",
              right: "-12px",
              top: `${topPercent}%`,
              transform: "translateY(-50%)",
              maxWidth: "200px",
              pointerEvents: "auto",
            }}
            onMouseDown={(event) => event.preventDefault()}
          >
            <div
              style={{
                backgroundColor: "rgba(250,204,21,0.92)",
                color: "#78350f",
                padding: "6px 10px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(17, 24, 39, 0.18)",
                cursor: "help",
              }}
              title={`${formatVisualSuggestionTitle(
                suggestion
              )} - ${actionText}`}
            >
              {getVisualIcon(suggestion.visualType)}{" "}
              {formatVisualSuggestionTitle(suggestion)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function buildParagraphHighlightSegments(
  paragraph: ParagraphSummary,
  highlightRange: HighlightRange | null
): HighlightSegment[] {
  if (!highlightRange) {
    return [{ text: paragraph.text, highlighted: false }];
  }

  const rangeStart = highlightRange.start;
  const rangeEnd = highlightRange.start + highlightRange.length;
  const paragraphStart = paragraph.startIndex;
  const paragraphEnd = paragraph.endIndex;

  const overlaps = rangeStart < paragraphEnd && rangeEnd > paragraphStart;

  if (!overlaps) {
    return [{ text: paragraph.text, highlighted: false }];
  }

  const relativeStart = Math.max(0, rangeStart - paragraphStart);
  const relativeEnd = Math.min(
    paragraph.text.length,
    rangeEnd - paragraphStart
  );

  const before = paragraph.text.slice(0, relativeStart);
  const target = paragraph.text.slice(relativeStart, relativeEnd);
  const after = paragraph.text.slice(relativeEnd);

  const results: HighlightSegment[] = [];
  if (before.length) {
    results.push({ text: before, highlighted: false });
  }
  if (target.length) {
    results.push({ text: target, highlighted: true });
  }
  if (after.length) {
    results.push({ text: after, highlighted: false });
  }

  if (results.length === 0) {
    results.push({ text: paragraph.text, highlighted: false });
  }

  return results;
}

const VISUAL_TYPE_ICON: Record<string, string> = {
  diagram: "📊",
  flowchart: "🧭",
  graph: "📈",
  illustration: "🎨",
  "concept-map": "🧠",
};

function getVisualIcon(type: string): string {
  return VISUAL_TYPE_ICON[type] || "✨";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computeHighlightRange({
  text,
  searchText,
  searchWord,
  searchOccurrence,
  highlightPosition,
}: {
  text: string;
  searchText?: string | null;
  searchWord: string | null;
  searchOccurrence: number;
  highlightPosition: number | null;
}): HighlightRange | null {
  const base = searchText ?? text ?? "";
  if (!base.length) {
    return null;
  }

  if (typeof highlightPosition === "number" && highlightPosition >= 0) {
    if (highlightPosition >= base.length) {
      return null;
    }
    const length = determineMatchLength(base, highlightPosition, searchWord);
    return { start: highlightPosition, length };
  }

  if (searchWord && searchWord.trim().length > 0) {
    const normalizedHaystack = base.toLowerCase();
    const needle = searchWord.trim().toLowerCase();
    let occurrence = 0;
    let index = normalizedHaystack.indexOf(needle);
    let targetIndex = -1;

    while (index !== -1) {
      if (occurrence === searchOccurrence) {
        targetIndex = index;
        break;
      }
      occurrence += 1;
      index = normalizedHaystack.indexOf(needle, index + needle.length);
    }

    if (targetIndex === -1) {
      targetIndex = normalizedHaystack.indexOf(needle);
    }

    if (targetIndex !== -1) {
      const length = determineMatchLength(base, targetIndex, searchWord);
      return { start: targetIndex, length };
    }
  }

  return null;
}

function determineMatchLength(
  base: string,
  startIndex: number,
  searchWord: string | null
): number {
  if (!searchWord || searchWord.trim().length === 0) {
    // When no search word (e.g., clicking timeline), highlight a meaningful chunk
    // Try to find the end of the current paragraph or heading
    const slice = base.slice(startIndex);

    // Look for paragraph break (double newline) or single newline followed by heading indicator
    const paragraphMatch = slice.match(/^(.+?)(\n\n|\n#|\n[A-Z])/s);
    if (paragraphMatch && paragraphMatch[1]) {
      return paragraphMatch[1].length;
    }

    // Look for end of sentence
    const sentenceMatch = slice.match(/^(.+?[.!?])\s/);
    if (sentenceMatch && sentenceMatch[1]) {
      return sentenceMatch[1].length;
    }

    // Look for end of line
    const lineMatch = slice.match(/^(.+?)$/m);
    if (lineMatch && lineMatch[1] && lineMatch[1].length > 10) {
      return lineMatch[1].length;
    }

    // Fallback: highlight at least 100 characters or until newline
    const newlineIndex = slice.indexOf("\n");
    if (newlineIndex > 0 && newlineIndex < 300) {
      return newlineIndex;
    }

    return Math.min(100, slice.length);
  }

  const escaped = searchWord
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "\\s+");

  const regex = new RegExp(`^${escaped}`, "i");
  const slice = base.slice(startIndex);
  const match = regex.exec(slice);

  if (match && match[0].length > 0) {
    return match[0].length;
  }

  return Math.max(searchWord.length, 1);
}

function getSpacingBadgeStyle(tone: SpacingTone): React.CSSProperties {
  switch (tone) {
    case "compact":
      return {
        color: "#065f46",
        backgroundColor: "rgba(209,250,229,0.95)",
        border: "1px solid rgba(16,185,129,0.25)",
      };
    case "extended":
      return {
        color: "#92400e",
        backgroundColor: "rgba(254,243,199,0.95)",
        border: "1px solid rgba(217,119,6,0.25)",
      };
    default:
      return {
        color: "#1d4ed8",
        backgroundColor: "rgba(219,234,254,0.9)",
        border: "1px solid rgba(59,130,246,0.2)",
      };
  }
}

function formatVisualAction(suggestion: VisualSuggestion): string {
  switch (suggestion.visualType) {
    case "diagram":
      return "Create a diagram that maps the structure or spatial relationships described.";
    case "flowchart":
      return "Lay out the steps as a flowchart so learners can follow the process visually.";
    case "graph":
      return "Plot the data in a graph to expose the comparison or trend you mention.";
    case "concept-map":
      return "Draft a concept map linking the key ideas to show how they interrelate.";
    case "illustration":
      return "Provide a labeled illustration to anchor the dense terminology in a visual reference.";
    default:
      return "Add the recommended visual aid to reinforce this explanation.";
  }
}

function formatVisualSuggestionTitle(suggestion: VisualSuggestion): string {
  const typeLabel = suggestion.visualType
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const priorityLabel =
    suggestion.priority === "high"
      ? "High priority"
      : suggestion.priority === "medium"
      ? "Medium priority"
      : "Low priority";

  return `${typeLabel} - ${priorityLabel}`;
}

function buttonStyle(
  backgroundColor: string,
  isCompact?: boolean
): React.CSSProperties {
  return {
    padding: isCompact ? "5px 12px" : "6px 14px",
    borderRadius: "6px",
    border: "none",
    fontSize: isCompact ? "12px" : "13px",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    backgroundColor,
    whiteSpace: "nowrap",
  };
}

function convertTextToHtml(value: string): string {
  if (!value.trim().length) {
    return "";
  }
  const escaped = escapeHtml(value);
  return escaped
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function htmlToPlainText(html: string): string {
  if (!html.trim().length) {
    return "";
  }
  if (typeof window === "undefined") {
    return html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent?.replace(/\u00A0/g, " ") ?? "";
}

function sanitizeHtml(html: string): string {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function insertHtmlAtCursor(html: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return false;
  }
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const fragment = document.createDocumentFragment();
  let node: ChildNode | null;
  while ((node = temp.firstChild)) {
    fragment.appendChild(node);
  }
  range.insertNode(fragment);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}

function insertHtmlWithUndoSupport(html: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  const canExecCommand = typeof document.execCommand === "function";
  if (canExecCommand) {
    try {
      const inserted = document.execCommand("insertHTML", false, html);
      if (inserted) {
        return true;
      }
    } catch {
      // Fall back to manual insertion if execCommand fails
    }
  }
  return insertHtmlAtCursor(html);
}

function scrollEditableToRange(
  container: HTMLElement,
  start: number,
  length: number
): void {
  console.log("📍 scrollEditableToRange called:", { start, length });

  // Remove any existing highlights
  const existingHighlights = container.querySelectorAll(".jump-highlight");
  existingHighlights.forEach((el) => {
    const parent = el.parentNode;
    if (parent) {
      const textNode = document.createTextNode(el.textContent || "");
      parent.replaceChild(textNode, el);
    }
  });
  // Normalize to merge adjacent text nodes after removing highlights
  container.normalize();

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  let currentNode: Node | null = walker.nextNode();
  let currentIndex = 0;
  const targetStart = start;
  const targetEnd = start + length;
  let targetNode: Node | null = null;
  let startOffset = 0;
  let endNode: Node | null = null;
  let endOffset = 0;

  console.log("📍 Walking through text nodes...");

  // Find the start and end nodes
  while (currentNode) {
    const nodeLength = currentNode.textContent?.length ?? 0;
    const nextIndex = currentIndex + nodeLength;

    if (
      targetNode === null &&
      targetStart >= currentIndex &&
      targetStart < nextIndex
    ) {
      targetNode = currentNode;
      startOffset = targetStart - currentIndex;
      console.log("📍 Found start node:", {
        text: currentNode.textContent?.substring(0, 50),
        startOffset,
      });
    }

    if (targetEnd >= currentIndex && targetEnd <= nextIndex) {
      endNode = currentNode;
      endOffset = targetEnd - currentIndex;
      console.log("📍 Found end node:", {
        text: currentNode.textContent?.substring(0, 50),
        endOffset,
      });
      break;
    }

    currentIndex = nextIndex;
    currentNode = walker.nextNode();
  }

  if (!targetNode) {
    console.warn("⚠️ Could not find target text node at position:", start);
    return;
  }

  try {
    // Create range for selection
    const range = document.createRange();
    range.setStart(targetNode, startOffset);
    range.setEnd(
      endNode || targetNode,
      endNode ? endOffset : targetNode.textContent?.length ?? 0
    );

    // Scroll the range into view
    const rangeRect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (
      rangeRect.top < containerRect.top ||
      rangeRect.bottom > containerRect.bottom
    ) {
      console.log("📍 Scrolling container to range");
      container.scrollTop +=
        rangeRect.top -
        containerRect.top -
        containerRect.height / 2 +
        rangeRect.height / 2;
    }

    // Create a temporary highlight element
    const highlightSpan = document.createElement("mark");
    highlightSpan.className = "jump-highlight";
    highlightSpan.style.backgroundColor = "#fef08a";
    highlightSpan.style.padding = "2px 4px";
    highlightSpan.style.borderRadius = "3px";
    highlightSpan.style.transition = "background-color 1.5s ease";
    highlightSpan.style.boxShadow = "0 0 0 2px rgba(251, 191, 36, 0.3)";

    // Extract and wrap the content
    const fragment = range.extractContents();
    highlightSpan.appendChild(fragment);
    range.insertNode(highlightSpan);

    console.log("📍 Highlight created:", {
      text: highlightSpan.textContent?.substring(0, 50),
      length: highlightSpan.textContent?.length,
    });

    // Fade out and remove highlight after delay
    setTimeout(() => {
      highlightSpan.style.backgroundColor = "transparent";
      highlightSpan.style.boxShadow = "none";

      setTimeout(() => {
        const parent = highlightSpan.parentNode;
        if (parent && highlightSpan.isConnected) {
          // Move children out of the highlight span
          while (highlightSpan.firstChild) {
            parent.insertBefore(highlightSpan.firstChild, highlightSpan);
          }
          parent.removeChild(highlightSpan);
          parent.normalize();
          console.log("📍 Highlight removed");
        }
      }, 1500);
    }, 2000);
  } catch (error) {
    console.error("⚠️ Error highlighting range:", error);
    // Fallback: just scroll to approximate position
    const estimatedScroll =
      (start / (container.textContent?.length || 1)) * container.scrollHeight;
    container.scrollTop = estimatedScroll - container.clientHeight / 2;
  }
}

export default DocumentEditor;
