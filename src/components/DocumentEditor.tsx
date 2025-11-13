import React, {
  ChangeEvent,
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

type SpacingSummary = {
  id: number;
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
  onTextChange,
  showSpacingIndicators = false,
  showVisualSuggestions = false,
  highlightPosition,
  searchWord,
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

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

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(
        highlightRange.start,
        highlightRange.start + highlightRange.length
      );
      setShowBackToTop(false);
    }
  }, [highlightRange, readOnly]);

  const segments = useMemo(
    () => buildHighlightSegments(text, highlightRange),
    [text, highlightRange]
  );

  const spacingSummaries = useMemo(
    () => (showSpacingIndicators ? summarizeParagraphSpacing(text) : []),
    [text, showSpacingIndicators]
  );

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setText(value);
    onTextChange(value);
  };

  const handleSave = () => {
    onSave?.();
  };

  const handleBackToTop = () => {
    onBackToTop?.();
    setShowBackToTop(false);
  };

  const hasSidePanel =
    (showSpacingIndicators && spacingSummaries.length > 0) ||
    (showVisualSuggestions && visualSuggestions.length > 0);

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
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          {readOnly ? "Read-only view" : "Editable view"}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
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
            flex: hasSidePanel ? 2 : 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {readOnly ? (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                fontSize: "15px",
                backgroundColor: "white",
              }}
            >
              {segments.map((segment, index) => {
                if (segment.highlighted) {
                  return (
                    <mark
                      key={index}
                      ref={highlightRef}
                      style={HIGHLIGHT_STYLE}
                    >
                      {segment.text}
                    </mark>
                  );
                }
                return <span key={index}>{segment.text}</span>;
              })}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              style={{
                flex: 1,
                resize: "none",
                padding: "16px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontFamily: "inherit",
                fontSize: "15px",
                lineHeight: 1.5,
              }}
            />
          )}

          {htmlContent && htmlContent.trim().length > 0 && (
            <details style={PANEL_STYLE}>
              <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                Original formatting
              </summary>
              <div
                style={{ marginTop: "12px", lineHeight: 1.5 }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </details>
          )}
        </div>

        {hasSidePanel && (
          <aside
            style={{
              flex: 1,
              minWidth: "260px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              overflowY: "auto",
            }}
          >
            {showSpacingIndicators && spacingSummaries.length > 0 && (
              <section style={PANEL_STYLE}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                  Paragraph spacing overview
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {spacingSummaries.map((summary) => (
                    <li key={summary.id} style={{ marginBottom: "6px" }}>
                      <span style={{ fontWeight: 600 }}>
                        Paragraph {summary.id + 1}
                      </span>
                      <span style={{ color: "#6b7280", marginLeft: "6px" }}>
                        {summary.wordCount} words / {summary.charCount} chars
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {showVisualSuggestions && visualSuggestions.length > 0 && (
              <section style={PANEL_STYLE}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                  Visual suggestions
                </h3>
                <ul
                  style={{ listStyle: "disc", paddingLeft: "18px", margin: 0 }}
                >
                  {visualSuggestions.map((suggestion, index) => (
                    <li
                      key={`${suggestion.position}-${index}`}
                      style={{ marginBottom: "8px" }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        {formatVisualSuggestionTitle(suggestion)}
                      </div>
                      <div style={{ color: "#4b5563", fontSize: "13px" }}>
                        {suggestion.reason}
                      </div>
                      <div
                        style={{
                          color: "#6b7280",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {suggestion.paragraph}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

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

function buildHighlightSegments(
  text: string,
  range: HighlightRange | null
): HighlightSegment[] {
  if (!range) {
    return [{ text, highlighted: false }];
  }

  const start = Math.max(0, Math.min(range.start, text.length));
  const end = Math.max(start, Math.min(start + range.length, text.length));

  const before = text.slice(0, start);
  const target = text.slice(start, end);
  const after = text.slice(end);

  const segments: HighlightSegment[] = [];
  if (before.length > 0) {
    segments.push({ text: before, highlighted: false });
  }
  if (target.length > 0) {
    segments.push({ text: target, highlighted: true });
  }
  if (after.length > 0) {
    segments.push({ text: after, highlighted: false });
  }

  if (segments.length === 0) {
    return [{ text, highlighted: false }];
  }

  return segments;
}

function summarizeParagraphSpacing(text: string): SpacingSummary[] {
  const normalized = text.replace(/\r\n/g, "\n");
  const rawParagraphs = normalized.split(/\n\s*\n+/);

  const summaries: SpacingSummary[] = [];

  rawParagraphs.forEach((raw) => {
    const trimmed = raw.trim();
    if (!trimmed.length) {
      return;
    }

    summaries.push({
      id: summaries.length,
      charCount: trimmed.length,
      wordCount: countWords(trimmed),
    });
  });

  return summaries;
}

function countWords(text: string): number {
  const matches = text.match(/[A-Za-z0-9']+/g);
  return matches ? matches.length : 0;
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

export default DocumentEditor;
