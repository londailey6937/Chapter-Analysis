import React, { useEffect, useMemo, useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  EditorState,
  ParagraphNode,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  ElementNode,
  TextNode,
} from "lexical";
import {
  HeadingNode,
  QuoteNode,
  $createHeadingNode,
  $createQuoteNode,
} from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import { analyzeParagraphSpacing, countWords } from "@/utils/spacingInsights";
import { DualCodingAnalyzer } from "@/utils/dualCodingAnalyzer";

// Spacing Analysis Plugin - analyzes paragraphs and adds decorative elements
const SpacingAnalysisPlugin: React.FC<{
  showSpacingIndicators: boolean;
  showVisualSuggestions: boolean;
}> = ({ showSpacingIndicators, showVisualSuggestions }) => {
  const [editor] = useLexicalComposerContext();
  const [paragraphs, setParagraphs] = React.useState<
    Array<{
      key: string;
      text: string;
      wordCount: number;
      element: HTMLElement | null;
    }>
  >([]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const children = root.getChildren();
        const newParagraphs: typeof paragraphs = [];

        children.forEach((node) => {
          if (node instanceof ParagraphNode) {
            const text = node.getTextContent();
            const key = node.getKey();
            const element = editor.getElementByKey(key);

            newParagraphs.push({
              key,
              text,
              wordCount: countWords(text),
              element,
            });
          }
        });

        setParagraphs(newParagraphs);
      });
    });
  }, [editor]);

  // Render spacing indicators as overlays
  return (
    <>
      {paragraphs.map((para) => {
        if (!para.element || !para.text) return null;

        const spacingInfo = analyzeParagraphSpacing(para.wordCount);
        const suggestions =
          para.text.length >= 10
            ? DualCodingAnalyzer.analyzeParagraph(para.text, 0)
            : [];

        const getSpacingColor = (tone: string) => {
          switch (tone) {
            case "compact":
              return "bg-blue-100 text-blue-800 border-blue-200";
            case "extended":
              return "bg-orange-100 text-orange-800 border-orange-200";
            default:
              return "bg-green-100 text-green-800 border-green-200";
          }
        };

        const rect = para.element.getBoundingClientRect();
        const container = editor.getRootElement()?.getBoundingClientRect();

        if (!container) return null;

        return (
          <React.Fragment key={para.key}>
            {showSpacingIndicators && (
              <div
                className={`spacing-indicator absolute text-xs px-2 py-0.5 rounded-full border shadow-sm z-10 ${getSpacingColor(
                  spacingInfo.tone
                )} transition-opacity duration-200 select-none whitespace-nowrap pointer-events-none`}
                style={{
                  top: `${rect.top - container.top - 24}px`,
                  left: `${rect.left - container.left}px`,
                }}
              >
                {spacingInfo.shortLabel} · {para.wordCount} words
              </div>
            )}

            {showVisualSuggestions && suggestions.length > 0 && (
              <div
                className="visual-suggestions absolute left-0 right-0 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r text-sm text-yellow-900 select-none pointer-events-none"
                style={{
                  top: `${rect.bottom - container.top + 8}px`,
                }}
              >
                {suggestions.map((s, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    <div className="font-semibold flex items-center gap-1">
                      <span>💡</span> {s.visualType}
                    </div>
                    <div className="text-xs mt-1">{s.reason}</div>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

// Concept Highlighting Plugin
const ConceptHighlightPlugin: React.FC<{
  concepts: string[];
  onConceptClick?: (concept: string) => void;
}> = ({ concepts, onConceptClick }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!concepts || concepts.length === 0) return;

    // We'll add concept highlighting via a simpler approach
    // by adding event listeners to the editor root
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("concept-highlight")) {
        const concept = target.getAttribute("data-concept");
        if (concept && onConceptClick) {
          onConceptClick(concept);
        }
      }
    };

    rootElement.addEventListener("click", handleClick);
    return () => rootElement.removeEventListener("click", handleClick);
  }, [editor, concepts, onConceptClick]);

  return null;
};

// Initial Content Plugin - loads content when component mounts
const InitialContentPlugin: React.FC<{ content: string }> = ({ content }) => {
  const [editor] = useLexicalComposerContext();
  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    if (!content || initialized) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      // Split content into paragraphs and create nodes
      const paragraphs = content.split(/\n\n+/);

      paragraphs.forEach((paragraphText) => {
        if (!paragraphText.trim()) return;

        const paragraph = $createParagraphNode();
        const lines = paragraphText.split(/\n/);

        lines.forEach((line, index) => {
          if (index > 0) {
            // Add line break for single newlines within paragraph
            paragraph.append($createTextNode("\n"));
          }
          paragraph.append($createTextNode(line));
        });

        root.append(paragraph);
      });
    });

    setInitialized(true);
  }, [editor, content, initialized]);

  return null;
};

// Toolbar Plugin
const ToolbarPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isStrike, setIsStrike] = React.useState(false);
  const [blockType, setBlockType] = React.useState("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrike(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (
    format: "bold" | "italic" | "underline" | "strikethrough"
  ) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (level: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(level));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (
    <div className="editor-toolbar p-2 border-b bg-gray-50 flex gap-1 flex-wrap items-center sticky top-0 z-20 shadow-sm">
      {/* History */}
      <div className="flex gap-0.5 mr-2">
        <button
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
          title="Undo (⌘Z / Ctrl+Z)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
          title="Redo (⌘⇧Z / Ctrl+Y)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
            />
          </svg>
        </button>
      </div>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Text Style */}
      <div className="flex gap-0.5 mr-2">
        <button
          onClick={() => formatText("bold")}
          className={`px-2 py-1.5 rounded min-w-[32px] font-bold text-sm transition-colors ${
            isBold
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Bold (⌘B / Ctrl+B)"
        >
          B
        </button>
        <button
          onClick={() => formatText("italic")}
          className={`px-2 py-1.5 rounded min-w-[32px] italic text-sm transition-colors ${
            isItalic
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Italic (⌘I / Ctrl+I)"
        >
          I
        </button>
        <button
          onClick={() => formatText("underline")}
          className={`px-2 py-1.5 rounded min-w-[32px] underline text-sm transition-colors ${
            isUnderline
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Underline (⌘U / Ctrl+U)"
        >
          U
        </button>
        <button
          onClick={() => formatText("strikethrough")}
          className={`px-2 py-1.5 rounded min-w-[32px] line-through text-sm transition-colors ${
            isStrike
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Strikethrough"
        >
          S
        </button>
      </div>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Headings */}
      <div className="flex gap-0.5 mr-2">
        <button
          onClick={formatParagraph}
          className="px-2 py-1.5 rounded text-xs transition-colors hover:bg-gray-200 text-gray-700"
          title="Paragraph"
        >
          ¶
        </button>
        <button
          onClick={() => formatHeading("h1")}
          className="px-2 py-1.5 rounded text-xs font-bold transition-colors hover:bg-gray-200 text-gray-700"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => formatHeading("h2")}
          className="px-2 py-1.5 rounded text-xs font-bold transition-colors hover:bg-gray-200 text-gray-700"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => formatHeading("h3")}
          className="px-2 py-1.5 rounded text-xs font-bold transition-colors hover:bg-gray-200 text-gray-700"
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Quote */}
      <div className="flex gap-0.5">
        <button
          onClick={formatQuote}
          className="p-1.5 rounded min-w-[32px] transition-colors hover:bg-gray-200 text-gray-700"
          title="Quote"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Main Editor Component
interface LexicalEditorProps {
  content: string;
  onUpdate?: (content: { html: string; text: string }) => void;
  isEditable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showSpacingIndicators?: boolean;
  showVisualSuggestions?: boolean;
  concepts?: string[];
  onConceptClick?: (concept: string) => void;
}

export const LexicalEditor: React.FC<LexicalEditorProps> = ({
  content,
  onUpdate,
  isEditable = true,
  className,
  style,
  showSpacingIndicators = true,
  showVisualSuggestions = true,
  concepts = [],
  onConceptClick,
}) => {
  const initialConfig = {
    namespace: "RichTextEditor",
    theme: {
      paragraph: "relative my-6",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
      },
      heading: {
        h1: "text-3xl font-bold mt-6 mb-3",
        h2: "text-2xl font-semibold mt-5 mb-3",
        h3: "text-xl font-semibold mt-4 mb-2",
      },
      quote: "border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4",
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
    ],
    editable: isEditable,
    onError: (error: Error) => {
      console.error("Lexical Error:", error);
    },
  };

  const handleChange = (editorState: EditorState) => {
    if (onUpdate) {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        const html = ""; // We'll implement HTML serialization if needed
        onUpdate({ html, text });
      });
    }
  };

  return (
    <div
      className={`lexical-editor ${className || ""} ${
        showSpacingIndicators ? "show-spacing" : ""
      } ${showVisualSuggestions ? "show-visuals" : ""}`}
      style={style}
    >
      <LexicalComposer initialConfig={initialConfig}>
        {isEditable && <ToolbarPlugin />}
        <div className="editor-container relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input prose max-w-none p-4 min-h-[300px] outline-none" />
            }
            placeholder={
              <div className="editor-placeholder absolute top-4 left-4 text-gray-400 pointer-events-none">
                Start writing or paste your chapter content here...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <InitialContentPlugin content={content} />
          <ConceptHighlightPlugin
            concepts={concepts}
            onConceptClick={onConceptClick}
          />
          <SpacingAnalysisPlugin
            showSpacingIndicators={showSpacingIndicators}
            showVisualSuggestions={showVisualSuggestions}
          />
        </div>
      </LexicalComposer>

      <style>{`
        .lexical-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .editor-container {
          position: relative;
          flex: 1;
          background: white;
        }

        .editor-input {
          position: relative;
          line-height: 1.75;
        }

        .editor-placeholder {
          color: #9ca3af;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lexical-editor p {
          position: relative;
          margin: 1.5rem 0;
        }

        /* Toggle visibility based on parent class */
        .lexical-editor:not(.show-spacing) .spacing-indicator {
          display: none;
        }

        .lexical-editor:not(.show-visuals) .visual-suggestions {
          display: none;
        }

        /* Selection styling */
        .editor-input ::selection {
          background-color: #bfdbfe;
        }
      `}</style>
    </div>
  );
};
