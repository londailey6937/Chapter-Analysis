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
  onBackToTop?: () => void;
}

type HighlightRange = {
  start: number;
  length: number;
};

type HighlightSegment = {
  text: string;
  highlighted: boolean;
};

type ParagraphSummary = {
  id: number;
  text: string;
  startIndex: number;
  endIndex: number;
  charCount: number;
  wordCount: number;
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
  onBackToTop,
}) => {
  const [text, setText] = useState(() => initialText);
  const [visualSuggestions, setVisualSuggestions] = useState<
    VisualSuggestion[]
  >([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const isEditing = !readOnly;
  const skipNextPropSyncRef = useRef(false);
  const initialHtmlRef = useRef(
    htmlContent && htmlContent.trim().length
      ? sanitizeHtml(htmlContent)
      : convertTextToHtml(initialText)
  );

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtmlRef.current;
    }
  }, []);

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
      setShowBackToTop(false);
      return;
    }

    if (readOnly) {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setShowBackToTop(true);
      }
      return;
    }

    const editor = editorRef.current;
    if (editor) {
      scrollEditableToRange(
        editor,
        highlightRange.start,
        highlightRange.length
      );
      setShowBackToTop(false);
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
    setText(plain);
    initialHtmlRef.current = currentHtml;
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

  const handleBackToTop = () => {
    onBackToTop?.();
    setShowBackToTop(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "16px",
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
        <div style={{ flex: 1, minWidth: "240px" }}>
          <div
            style={{
              fontSize: "15px",
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
              fontSize: "13px",
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            {isEditing
              ? "Scroll the preview on the left to see spacing targets and dual-coding callouts update as you edit on the right."
              : "Spacing targets and dual-coding callouts render inline below for accurate placement."}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {showBackToTop && (
            <button onClick={handleBackToTop} style={buttonStyle("#3b82f6")}>
              Back to top
            </button>
          )}
          {onSave && (
            <button onClick={handleSave} style={buttonStyle("#10b981")}>
              Save changes
            </button>
          )}
        </div>
      </div>

      {(showSpacingIndicators || showVisualSuggestions) && (
        <GuidanceLegend
          showSpacing={showSpacingIndicators}
          showVisual={showVisualSuggestions}
        />
      )}

      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "16px",
          minHeight: 0,
        }}
      >
        <div
          style={{
            flex: isEditing ? 0.55 : 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#111827",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            <span>Document Preview</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
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
          />
        </div>

        {isEditing && (
          <div
            style={{
              flex: 0.45,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#111827",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              <span>Editable document</span>
              <span
                style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}
              >
                {text.split(/\s+/).filter(Boolean).length.toLocaleString()}{" "}
                words
              </span>
            </div>
            <EditableView
              editorRef={editorRef}
              onInput={handleEditorInput}
              onPaste={handlePaste}
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
};

const ReadOnlyView: React.FC<ReadOnlyViewProps> = ({
  paragraphs,
  highlightRange,
  highlightRef,
  showSpacingIndicators,
  showVisualSuggestions,
  suggestionsByParagraph,
}) => {
  let highlightAnchorAssigned = false;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "white",
        lineHeight: 1.6,
        fontSize: "15px",
      }}
    >
      {paragraphs.length === 0 ? (
        <span style={{ color: "#9ca3af" }}>
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
};

const EditableView: React.FC<EditableViewProps> = ({
  editorRef,
  onInput,
  onPaste,
}) => {
  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={onInput}
      onPaste={onPaste}
      style={{
        flex: 1,
        minHeight: "400px",
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: "16px",
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
    return 1;
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

function extractParagraphs(text: string): ParagraphSummary[] {
  const normalized = text.replace(/\r\n/g, "\n");
  if (!normalized.trim().length) {
    return [];
  }

  const rawParagraphs = normalized.split(/\n\s*\n+/);
  const summaries: ParagraphSummary[] = [];
  let searchIndex = 0;

  rawParagraphs.forEach((raw) => {
    const trimmed = raw.trim();
    if (!trimmed.length) {
      searchIndex += raw.length;
      return;
    }

    const start = normalized.indexOf(trimmed, searchIndex);
    if (start === -1) {
      return;
    }

    const end = start + trimmed.length;

    summaries.push({
      id: summaries.length,
      text: trimmed,
      startIndex: start,
      endIndex: end,
      charCount: trimmed.length,
      wordCount: countWords(trimmed),
    });

    searchIndex = end;
    while (
      searchIndex < normalized.length &&
      /\s/.test(normalized.charAt(searchIndex))
    ) {
      searchIndex += 1;
    }
  });

  return summaries;
}

function countWords(text: string): number {
  const matches = text.match(/[A-Za-z0-9']+/g);
  return matches ? matches.length : 0;
}

type SpacingTone = "compact" | "balanced" | "extended";

type SpacingAnalysis = {
  tone: SpacingTone;
  shortLabel: string;
  message: string;
};

function analyzeParagraphSpacing(wordCount: number): SpacingAnalysis {
  if (wordCount < 60) {
    return {
      tone: "compact",
      shortLabel: "Expand detail",
      message:
        "This paragraph is compact—consider adding examples or explanation if the idea feels rushed.",
    };
  }

  if (wordCount > 160) {
    return {
      tone: "extended",
      shortLabel: "Consider splitting",
      message:
        "This paragraph is long—split it or add a subheading so readers can process the concept in steps.",
    };
  }

  return {
    tone: "balanced",
    shortLabel: "On target",
    message: "This paragraph sits in the target range—keep the current pacing.",
  };
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

function buttonStyle(backgroundColor: string): React.CSSProperties {
  return {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "none",
    fontSize: "13px",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    backgroundColor,
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
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  let currentNode: Node | null = walker.nextNode();
  let currentIndex = 0;
  const targetStart = start;
  const targetEnd = start + length;

  while (currentNode) {
    const nodeLength = currentNode.textContent?.length ?? 0;
    const nextIndex = currentIndex + nodeLength;
    if (targetStart >= currentIndex && targetStart <= nextIndex) {
      (currentNode.parentElement as HTMLElement)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      break;
    }
    currentIndex = nextIndex;
    currentNode = walker.nextNode();
  }
}

export default DocumentEditor;
