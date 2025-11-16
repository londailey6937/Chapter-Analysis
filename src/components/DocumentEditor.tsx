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
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [isTemplateMode, setIsTemplateMode] = useState(false);

  // Generate AI-driven template based on analysis issues
  const generateAITemplate = () => {
    if (!analysisResult) return;

    setIsGeneratingTemplate(true);

    try {
      const concepts = analysisResult?.conceptGraph?.concepts || [];
      const principleScores = analysisResult?.principles || [];

      const spacingPrinciple = principleScores.find((p: any) =>
        p.principle.toLowerCase().includes("spacing")
      );
      const dualCodingPrinciple = principleScores.find(
        (p: any) =>
          p.principle.toLowerCase().includes("dual") ||
          p.principle.toLowerCase().includes("coding")
      );

      const hasSpacingIssues = spacingPrinciple && spacingPrinciple.score < 70;
      const hasDualCodingIssues =
        dualCodingPrinciple && dualCodingPrinciple.score < 70;

      let template = `<h1>ENHANCED CHAPTER TEMPLATE</h1><p><em>Generated based on analysis results</em></p><hr>`;

      // Add intro section
      template += `<h2>SECTION 1: INTRODUCTION</h2>`;
      template += `<p><strong>[WRITER: Introduce the main topic. Mention 2-3 key concepts that will be covered.]</strong></p>`;
      template += `<p><strong>Key Concepts to Introduce:</strong></p><ul>`;
      concepts.slice(0, 3).forEach((c: any) => {
        template += `<li>${c.name}: <strong>[BRIEF DEFINITION]</strong></li>`;
      });
      template += `</ul><hr>`;

      // Add concept development sections
      const coreConceptsToAddress = concepts
        .filter((c: any) => c.importance === "core")
        .slice(0, 3);
      coreConceptsToAddress.forEach((concept: any, idx: number) => {
        template += `<h2>SECTION ${
          idx + 2
        }: ${concept.name.toUpperCase()}</h2>`;

        if (hasDualCodingIssues) {
          template += `<h3>Visual Element Needed</h3>`;
          template += `<p><strong>[WRITER: Add a diagram, chart, or visual representation of "${concept.name}"]</strong></p>`;
          template += `<p><em>[CLAUDE: Suggest what type of visual would work best - flowchart, diagram, table, etc.]</em></p>`;
        }

        template += `<h3>Explanation</h3>`;
        template += `<p><strong>[WRITER: Explain "${concept.name}" in clear, concrete terms]</strong></p>`;
        template += `<p><em>[CLAUDE: Provide 2-3 real-world examples that illustrate "${concept.name}"]</em></p>`;

        if (hasSpacingIssues) {
          template += `<h3>Quick Review</h3>`;
          template += `<p><strong>[WRITER: Add a brief review question or summary statement about "${concept.name}"]</strong></p>`;
        }

        template += `<hr>`;
      });

      // Add spacing/reinforcement section
      if (hasSpacingIssues) {
        template += `<h2>SECTION ${
          coreConceptsToAddress.length + 2
        }: CONCEPT CONNECTIONS</h2>`;
        template += `<p><strong>[WRITER: Connect the concepts introduced earlier. Show how they relate.]</strong></p>`;
        template += `<p><strong>Concepts to Reinforce:</strong></p><ul>`;
        concepts.slice(0, 5).forEach((c: any) => {
          template += `<li>${c.name}: <strong>[MENTION IN NEW CONTEXT]</strong></li>`;
        });
        template += `</ul><hr>`;
      }

      // Add application section
      template += `<h2>SECTION ${
        hasSpacingIssues
          ? coreConceptsToAddress.length + 3
          : coreConceptsToAddress.length + 2
      }: PRACTICAL APPLICATION</h2>`;
      template += `<p><strong>[WRITER: Provide a real-world scenario or problem that uses these concepts]</strong></p>`;
      template += `<p><em>[CLAUDE: Generate a worked example showing how to apply the concepts]</em></p>`;

      if (hasDualCodingIssues) {
        template += `<p><strong>[VISUAL: Add a step-by-step diagram or process flow]</strong></p>`;
      }

      template += `<hr>`;

      // Add summary with spaced retrieval
      template += `<h2>FINAL SECTION: SUMMARY & RETRIEVAL PRACTICE</h2>`;
      template += `<h3>Key Takeaways</h3><ul>`;
      concepts.slice(0, 5).forEach((c: any) => {
        template += `<li>${c.name}: <strong>[ONE-SENTENCE SUMMARY]</strong></li>`;
      });
      template += `</ul>`;

      template += `<h3>Self-Check Questions</h3>`;
      template += `<p><strong>[WRITER: Create 3-5 questions that require recalling the key concepts]</strong></p>`;
      template += `<ol>`;
      template += `<li><strong>[QUESTION ABOUT CORE CONCEPT]</strong></li>`;
      template += `<li><strong>[QUESTION CONNECTING TWO CONCEPTS]</strong></li>`;
      template += `<li><strong>[APPLICATION QUESTION]</strong></li>`;
      template += `</ol>`;

      // Add analysis summary
      template += `<hr><h2>ANALYSIS INSIGHTS</h2>`;
      if (hasSpacingIssues) {
        template += `<p>⚠️ <strong>Spacing Issue Detected</strong>: Score ${Math.round(
          spacingPrinciple?.score || 0
        )}/100<br>`;
        template += `Action: Revisit key concepts multiple times at increasing intervals</p>`;
      }
      if (hasDualCodingIssues) {
        template += `<p>⚠️ <strong>Dual Coding Issue Detected</strong>: Score ${Math.round(
          dualCodingPrinciple?.score || 0
        )}/100<br>`;
        template += `Action: Add visual elements (diagrams, charts, tables) for complex concepts</p>`;
      }

      template += `<hr><h2>NEXT STEPS</h2><ol>`;
      template += `<li>Fill in the [WRITER] sections with your content</li>`;
      template += `<li>Use Claude API to generate content for [CLAUDE] sections (if connected)</li>`;
      template += `<li>Add visual elements where marked [VISUAL]</li>`;
      template += `<li>Review and refine the complete chapter</li>`;
      template += `<li>Export when satisfied</li>`;
      template += `</ol>`;

      // Set the template in the editor
      if (editorRef.current) {
        editorRef.current.innerHTML = template;
        const plainText = editorRef.current.innerText;
        setText(plainText);
        onTextChange(plainText);
        if (onContentChange) {
          onContentChange({ plainText, html: template });
        }
      }

      setIsTemplateMode(true);
    } catch (error) {
      console.error("Error generating template:", error);
      alert("Error generating template. Please try again.");
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

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

    if (readOnly) {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
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
                style={buttonStyle("#10b981", isCompactLayout)}
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
          />
        </div>

        {isEditing && (
          <div
            style={{
              flex: isCompactLayout ? 1 : 0.5,
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
}) => {
  let highlightAnchorAssigned = false;

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
        backgroundColor: "#ffffff",
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
