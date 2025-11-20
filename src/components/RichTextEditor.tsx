import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { TextSelection } from "@tiptap/pm/state";
import { analyzeParagraphSpacing, countWords } from "@/utils/spacingInsights";
import { DualCodingAnalyzer } from "@/utils/dualCodingAnalyzer";

// --- Concept Highlighter Extension ---

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const ConceptHighlighter = Extension.create({
  name: "conceptHighlighter",

  addStorage() {
    return {
      concepts: [] as string[],
      onConceptClick: null as ((concept: string) => void) | null,
    };
  },

  addCommands() {
    return {
      setConcepts:
        (concepts: string[]) =>
        ({ editor }: { editor: any }) => {
          editor.storage.conceptHighlighter.concepts = concepts;
          // Trigger a re-render of decorations by dispatching a dummy transaction
          const tr = editor.state.tr;
          tr.setMeta("conceptHighlighter", true);
          editor.view.dispatch(tr);
          return true;
        },
      setConceptClickHandler:
        (handler: (concept: string) => void) =>
        ({ editor }: { editor: any }) => {
          editor.storage.conceptHighlighter.onConceptClick = handler;
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("conceptHighlighter"),
        props: {
          decorations: (state) => {
            // @ts-ignore
            const { concepts } = this.editor.storage.conceptHighlighter;
            if (!concepts || concepts.length === 0) {
              return DecorationSet.empty;
            }

            const decorations: Decoration[] = [];
            const doc = state.doc;

            doc.descendants((node, pos) => {
              if (!node.isText) return;

              const text = node.text;
              if (!text) return;

              concepts.forEach((concept: string) => {
                if (!concept || concept.length < 3) return; // Skip very short concepts

                // Create a regex that matches the concept as a whole word
                // Case insensitive
                const regex = new RegExp(
                  `\\b${escapeRegExp(concept)}\\b`,
                  "gi"
                );

                let match;
                while ((match = regex.exec(text)) !== null) {
                  const from = pos + match.index;
                  const to = pos + match.index + match[0].length;

                  decorations.push(
                    Decoration.inline(from, to, {
                      class: "concept-highlight",
                      "data-concept": concept,
                      style:
                        "background-color: rgba(255, 140, 0, 0.22); font-weight: 500; cursor: pointer; transition: background-color 0.2s;",
                    })
                  );
                }
              });
            });

            return DecorationSet.create(doc, decorations);
          },
          handleClick: (view, pos, event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains("concept-highlight")) {
              const concept = target.getAttribute("data-concept");
              const handler = (this.editor.storage as any).conceptHighlighter
                .onConceptClick;
              if (concept && handler) {
                handler(concept);
                return true; // Prevent default behavior
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});

// --- Custom Node View for Paragraphs ---

const ParagraphWithAnalysis: React.FC<any> = ({ node, editor }) => {
  const text = node.textContent;
  const wordCount = useMemo(() => countWords(text), [text]);

  // Access props passed via editor.storage or context if needed,
  // but for now we'll assume we want to show them if the editor is configured to.
  // We can check editor.options.editorProps for custom props if we passed them,
  // or use a context. For simplicity, let's assume we always calculate but conditionally render CSS.

  const spacingInfo = useMemo(
    () => analyzeParagraphSpacing(wordCount),
    [wordCount]
  );

  const suggestions = useMemo(() => {
    if (!text || text.length < 10) return [];
    return DualCodingAnalyzer.analyzeParagraph(text, 0); // Position 0 as it's relative to paragraph
  }, [text]);

  // We need to know if we should show indicators.
  // Since NodeViews are React components, they don't easily access the parent's props
  // unless we pass them down or use a context.
  // Let's use a CSS class on the editor wrapper to toggle visibility.

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

  return (
    <NodeViewWrapper className="paragraph-wrapper relative my-6 group">
      {/* Spacing Indicator */}
      <div
        className={`spacing-indicator absolute -top-6 left-0 text-xs px-2 py-0.5 rounded-full border shadow-sm z-10 ${getSpacingColor(
          spacingInfo.tone
        )} transition-opacity duration-200 select-none whitespace-nowrap`}
        contentEditable={false}
      >
        {spacingInfo.shortLabel} · {wordCount} words
      </div>

      <NodeViewContent className="content" />

      {/* Visual Suggestions */}
      {suggestions.length > 0 && (
        <div
          className="visual-suggestions mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r text-sm text-yellow-900 select-none"
          contentEditable={false}
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
    </NodeViewWrapper>
  );
};

// --- Main Component ---

// Extend the commands interface
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    conceptHighlighter: {
      setConcepts: (concepts: string[]) => ReturnType;
      setConceptClickHandler: (
        handler: (concept: string) => void
      ) => ReturnType;
    };
  }
}

interface RichTextEditorProps {
  content: string;
  onUpdate?: (content: { html: string; text: string }) => void;
  isEditable?: boolean;
  highlightPosition?: number | null;
  searchWord?: string | null;
  searchOccurrence?: number;
  className?: string;
  style?: React.CSSProperties;
  showSpacingIndicators?: boolean;
  showVisualSuggestions?: boolean;
  concepts?: string[];
  onConceptClick?: (concept: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onUpdate,
  isEditable = true,
  highlightPosition,
  searchWord,
  searchOccurrence,
  className,
  style,
  showSpacingIndicators,
  showVisualSuggestions,
  concepts = [],
  onConceptClick,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false, // We'll add our custom paragraph
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: "code-block",
          },
        },
      }),
      Paragraph.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ParagraphWithAnalysis);
        },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing or paste your chapter content here...",
      }),
      ConceptHighlighter,
    ],
    content,
    editable: isEditable,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate({
          html: editor.getHTML(),
          text: editor.getText({
            blockSeparator: "\n",
            textSerializers: {
              hardBreak: () => "\n",
            },
          }),
        });
      }
    },
  });

  // Update concepts when prop changes
  useEffect(() => {
    if (editor && concepts) {
      editor.commands.setConcepts(concepts);
    }
  }, [editor, concepts]);

  // Update click handler when prop changes
  useEffect(() => {
    if (editor && onConceptClick) {
      editor.commands.setConceptClickHandler(onConceptClick);
    }
  }, [editor, onConceptClick]);

  const lastHighlightRange = useRef<{ from: number; to: number } | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  // Helper to find the scroll container
  const findScrollContainer = (): HTMLElement | null => {
    if (!editor) return null;
    if (typeof window === "undefined") return null;

    let el: HTMLElement | null = editor.view.dom.parentElement;
    while (el) {
      const style = window.getComputedStyle(el);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return el;
      }
      el = el.parentElement;
    }
    return document.scrollingElement as HTMLElement | null;
  };

  // Helper to map plain text offset to Tiptap position
  const resolvePlainOffsetToEditorPos = (targetOffset: number) => {
    if (!editor) return null;
    if (Number.isNaN(targetOffset) || targetOffset < 0) return null;

    let cumulative = 0;
    let resolved: number | null = null;

    editor.state.doc.descendants((node, pos, parent, index) => {
      if (resolved !== null) return false;

      if (node.isBlock && parent && index > 0) {
        // We assume 1 newline between blocks to match the analysis text
        if (targetOffset === cumulative) {
          resolved = pos;
          return false;
        }
        cumulative += 1;
      }

      if (node.isText) {
        const text = node.text || "";
        const next = cumulative + text.length;

        if (targetOffset >= cumulative && targetOffset <= next) {
          const relative = Math.min(
            text.length,
            Math.max(0, targetOffset - cumulative)
          );
          resolved = pos + relative;
          return false;
        }

        cumulative = next;
        return;
      }

      if (node.type.name === "hardBreak") {
        cumulative += 1;
        if (targetOffset === cumulative) {
          resolved = pos + node.nodeSize;
          return false;
        }
      }

      return;
    });

    return resolved;
  };

  // Flash highlight effect
  const flashHighlight = (from: number, to: number) => {
    if (!editor) return;

    const highlightType = editor.schema.marks.highlight;
    if (!highlightType) return;

    // Clear previous highlight
    if (lastHighlightRange.current) {
      const { from: prevFrom, to: prevTo } = lastHighlightRange.current;
      const removePrev = editor.state.tr.removeMark(
        prevFrom,
        prevTo,
        highlightType
      );
      removePrev.setMeta("addToHistory", false);
      editor.view.dispatch(removePrev);
      lastHighlightRange.current = null;
    }

    // Add new highlight
    const tr = editor.state.tr.addMark(
      from,
      to,
      highlightType.create({ color: "#fef08a" }) // Yellow highlight
    );
    tr.setMeta("addToHistory", false);
    editor.view.dispatch(tr);
    lastHighlightRange.current = { from, to };

    // Remove after delay
    if (highlightTimeoutRef.current) {
      window.clearTimeout(highlightTimeoutRef.current);
    }

    highlightTimeoutRef.current = window.setTimeout(() => {
      if (!editor || !lastHighlightRange.current) return;
      const { from: activeFrom, to: activeTo } = lastHighlightRange.current;
      const removeTr = editor.state.tr.removeMark(
        activeFrom,
        activeTo,
        highlightType
      );
      removeTr.setMeta("addToHistory", false);
      editor.view.dispatch(removeTr);
      lastHighlightRange.current = null;
    }, 2000);
  };

  // Scroll to range
  const scrollToRange = (from: number, to: number) => {
    if (!editor) return;

    const docSize = editor.state.doc.content.size;
    const safeFrom = Math.max(0, Math.min(from, docSize));
    const safeTo = Math.max(safeFrom, Math.min(to, docSize));

    // Set selection
    const tr = editor.state.tr.setSelection(
      TextSelection.create(editor.state.doc, safeFrom, safeTo)
    );
    editor.view.dispatch(tr);
    editor.view.focus();

    // Scroll into view
    requestAnimationFrame(() => {
      try {
        const scrollContainer = findScrollContainer();
        if (scrollContainer) {
          const coords = editor.view.coordsAtPos(safeFrom);
          const containerRect = scrollContainer.getBoundingClientRect();
          const currentScrollTop = scrollContainer.scrollTop;
          const offsetWithinContainer = coords.top - containerRect.top;

          // Center the selection
          const targetScroll =
            currentScrollTop + offsetWithinContainer - containerRect.height / 2;

          scrollContainer.scrollTo({
            top: targetScroll,
            behavior: "smooth",
          });
        } else {
          editor.view.dispatch(editor.state.tr.scrollIntoView());
        }
      } catch (e) {
        console.warn("Scroll failed", e);
      }
    });

    flashHighlight(safeFrom, safeTo);
  };

  // Handle jumps
  useEffect(() => {
    if (
      !editor ||
      highlightPosition === null ||
      highlightPosition === undefined
    )
      return;

    const resolvedPos = resolvePlainOffsetToEditorPos(highlightPosition);
    if (resolvedPos !== null) {
      const length = searchWord ? searchWord.length : 0;
      scrollToRange(resolvedPos, resolvedPos + length);
    }
  }, [editor, highlightPosition, searchWord, searchOccurrence]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`rich-text-editor ${className || ""} ${
        showSpacingIndicators ? "show-spacing" : ""
      } ${showVisualSuggestions ? "show-visuals" : ""}`}
      style={style}
    >
      {isEditable && (
        <div className="editor-toolbar p-2 border-b bg-gray-50 flex gap-1 flex-wrap items-center sticky top-0 z-20 shadow-sm">
          {/* History */}
          <div className="flex gap-0.5 mr-2">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 transition-colors"
              title="Undo (⌘Z / Ctrl+Z)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 transition-colors"
              title="Redo (⌘⇧Z / Ctrl+Y)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            </button>
          </div>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Text Style */}
          <div className="flex gap-0.5 mr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-2 py-1.5 rounded min-w-[32px] font-bold text-sm transition-colors ${
                editor.isActive("bold")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Bold (⌘B / Ctrl+B)"
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-2 py-1.5 rounded min-w-[32px] italic text-sm transition-colors ${
                editor.isActive("italic")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Italic (⌘I / Ctrl+I)"
            >
              I
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`px-2 py-1.5 rounded min-w-[32px] underline text-sm transition-colors ${
                editor.isActive("underline")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Underline (⌘U / Ctrl+U)"
            >
              U
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-2 py-1.5 rounded min-w-[32px] line-through text-sm transition-colors ${
                editor.isActive("strike")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Strikethrough (⌘⇧X)"
            >
              S
            </button>
          </div>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Headings */}
          <div className="flex gap-0.5 mr-2">
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`px-2 py-1.5 rounded text-xs transition-colors ${
                editor.isActive("paragraph")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Paragraph"
            >
              ¶
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`px-2 py-1.5 rounded text-xs font-bold transition-colors ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Heading 1 (⌘⌥1)"
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`px-2 py-1.5 rounded text-xs font-bold transition-colors ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Heading 2 (⌘⌥2)"
            >
              H2
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`px-2 py-1.5 rounded text-xs font-bold transition-colors ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Heading 3 (⌘⌥3)"
            >
              H3
            </button>
          </div>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Lists */}
          <div className="flex gap-0.5 mr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded min-w-[32px] transition-colors ${
                editor.isActive("bulletList")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Bullet List (⌘⇧8)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded min-w-[32px] transition-colors ${
                editor.isActive("orderedList")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Numbered List (⌘⇧7)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded min-w-[32px] transition-colors ${
                editor.isActive("blockquote")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Quote (⌘⇧B)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
          </div>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Alignment */}
          <div className="flex gap-0.5 mr-2">
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-1.5 rounded min-w-[32px] transition-colors ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Align Left (⌘⇧L)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={`p-1.5 rounded min-w-[32px] transition-colors ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Align Center (⌘⇧E)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`p-1.5 rounded min-w-[32px] transition-colors ${
                editor.isActive({ textAlign: "right" })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Align Right (⌘⇧R)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={`p-1.5 rounded min-w-[32px] transition-colors ${
                editor.isActive({ textAlign: "justify" })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Justify (⌘⇧J)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* Additional Tools */}
          <div className="flex gap-0.5">
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded min-w-[32px] transition-colors ${
                editor.isActive("codeBlock")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              title="Code Block (⌘⌥C)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded min-w-[32px] hover:bg-gray-200 text-gray-700 transition-colors"
              title="Horizontal Rule"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().setHardBreak().run()}
              className="p-1.5 rounded min-w-[32px] hover:bg-gray-200 text-gray-700 transition-colors"
              title="Line Break (⇧↵)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <EditorContent editor={editor} className="prose max-w-none p-4" />

      <style>{`
        .ProseMirror {
          outline: none;
          min-height: 300px;
          line-height: 1.75;
        }
        
        .ProseMirror p {
          margin-bottom: 1em;
          line-height: 1.75;
        }
        
        .ProseMirror h1 {
          font-size: 2em;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          font-weight: 700;
          line-height: 1.2;
        }
        
        .ProseMirror h2 {
          font-size: 1.5em;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          font-weight: 600;
          line-height: 1.3;
        }
        
        .ProseMirror h3 {
          font-size: 1.25em;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.4;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          list-style-position: outside;
          padding-left: 1.75em;
          margin: 1em 0;
        }
        
        .ProseMirror ul {
          list-style-type: disc;
        }
        
        .ProseMirror ol {
          list-style-type: decimal;
        }
        
        .ProseMirror li {
          margin: 0.5em 0;
        }
        
        .ProseMirror blockquote {
          border-left: 3px solid #d1d5db;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
          font-style: italic;
        }
        
        .ProseMirror pre {
          background: #1f2937;
          color: #f3f4f6;
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .ProseMirror code {
          background: #f3f4f6;
          color: #1f2937;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
        }
        
        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: inherit;
        }
        
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2em 0;
        }
        
        .ProseMirror mark {
          background-color: #fef08a;
          color: #1f2937;
          border-radius: 2px;
          padding: 0.1em 0.2em;
        }
        
        .ProseMirror [data-placeholder]::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* Concept highlighting */
        .ProseMirror .concept-highlight {
          transition: background-color 0.2s ease;
        }
        
        .ProseMirror .concept-highlight:hover {
          background-color: rgba(255, 140, 0, 0.35) !important;
        }

        /* Toggle visibility based on parent class */
        .rich-text-editor:not(.show-spacing) .spacing-indicator {
          display: none;
        }
        
        .rich-text-editor:not(.show-visuals) .visual-suggestions {
          display: none;
        }
        
        /* Better focus styles */
        .ProseMirror:focus {
          outline: none;
        }
        
        /* Selection styling */
        .ProseMirror ::selection {
          background-color: #bfdbfe;
        }
      `}</style>
    </div>
  );
};
