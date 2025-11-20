import React, { useEffect, useRef, useState, useCallback } from "react";
import { analyzeParagraphSpacing, countWords } from "@/utils/spacingInsights";
import { DualCodingAnalyzer } from "@/utils/dualCodingAnalyzer";

interface CustomEditorProps {
  content: string;
  onUpdate?: (content: { html: string; text: string }) => void;
  isEditable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showSpacingIndicators?: boolean;
  showVisualSuggestions?: boolean;
  concepts?: string[];
  onConceptClick?: (concept: string) => void;
  isFreeMode?: boolean;
}

interface AnalysisData {
  spacing: Array<{
    index: number;
    wordCount: number;
    tone: string;
    label: string;
  }>;
  visuals: Array<{ index: number; suggestions: any[] }>;
}

export const CustomEditor: React.FC<CustomEditorProps> = ({
  content,
  onUpdate,
  isEditable = true,
  className,
  style,
  showSpacingIndicators = true,
  showVisualSuggestions = true,
  concepts = [],
  onConceptClick,
  isFreeMode = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [analysis, setAnalysis] = useState<AnalysisData>({
    spacing: [],
    visuals: [],
  });
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Undo/Redo history
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isUndoRedoRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // New feature states
  const [blockType, setBlockType] = useState("p");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [statistics, setStatistics] = useState({
    words: 0,
    characters: 0,
    paragraphs: 0,
    readingTime: 0,
    readingLevel: 0,
  });

  // Analyze content for spacing and dual-coding
  const analyzeContent = useCallback((text: string) => {
    if (!editorRef.current) return;

    const paragraphs = text.split("\n\n").filter((p) => p.trim());
    const spacingData: AnalysisData["spacing"] = [];
    const visualsData: AnalysisData["visuals"] = [];

    paragraphs.forEach((para, index) => {
      const wordCount = countWords(para);
      if (wordCount > 0) {
        const spacingInfo = analyzeParagraphSpacing(wordCount);
        spacingData.push({
          index,
          wordCount,
          tone: spacingInfo.tone,
          label: spacingInfo.shortLabel,
        });
      }

      if (para.length >= 10) {
        const suggestions = DualCodingAnalyzer.analyzeParagraph(para, index);
        if (suggestions.length > 0) {
          visualsData.push({ index, suggestions });
        }
      }
    });

    setAnalysis({ spacing: spacingData, visuals: visualsData });

    // Calculate statistics
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    const characters = text.length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute
    const sentences = text
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const syllables = text.split(/\s+/).reduce((count, word) => {
      return count + Math.max(1, word.match(/[aeiouy]{1,2}/gi)?.length || 1);
    }, 0);
    const readingLevel =
      sentences > 0 && words > 0
        ? 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
        : 0;

    setStatistics({
      words,
      characters,
      paragraphs: paragraphs.length,
      readingTime,
      readingLevel: Math.max(0, Math.round(readingLevel * 10) / 10),
    });
  }, []);

  // Save to history
  const saveToHistory = useCallback((html: string) => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    // Remove any history after current index
    historyRef.current = historyRef.current.slice(
      0,
      historyIndexRef.current + 1
    );

    // Add new state
    historyRef.current.push(html);
    historyIndexRef.current = historyRef.current.length - 1;

    // Limit history to 50 states
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }

    // Update button states
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;

    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText;

    // Save to undo history
    saveToHistory(html);

    // Debounce updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      onUpdate?.({ html, text });
      analyzeContent(text);
    }, 300);
  }, [onUpdate, saveToHistory, analyzeContent]);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && content) {
      const isHtml = /<[^>]+>/.test(content);
      if (isHtml) {
        editorRef.current.innerHTML = content;
      } else {
        editorRef.current.innerHTML = content
          .split("\n\n")
          .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
          .join("");
      }

      // Initialize history with initial content
      const html = editorRef.current.innerHTML;
      historyRef.current = [html];
      historyIndexRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);
    }
  }, []); // Only on mount

  // Undo function
  const performUndo = useCallback(() => {
    if (!editorRef.current || historyIndexRef.current <= 0) return;

    historyIndexRef.current--;
    const html = historyRef.current[historyIndexRef.current];

    isUndoRedoRef.current = true;
    editorRef.current.innerHTML = html;

    const text = editorRef.current.innerText;
    onUpdate?.({ html, text });
    analyzeContent(text);
    editorRef.current.focus();

    // Update button states
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, [onUpdate, analyzeContent]);

  // Redo function
  const performRedo = useCallback(() => {
    if (
      !editorRef.current ||
      historyIndexRef.current >= historyRef.current.length - 1
    )
      return;

    historyIndexRef.current++;
    const html = historyRef.current[historyIndexRef.current];

    isUndoRedoRef.current = true;
    editorRef.current.innerHTML = html;

    const text = editorRef.current.innerText;
    onUpdate?.({ html, text });
    analyzeContent(text);
    editorRef.current.focus();

    // Update button states
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, [onUpdate, analyzeContent]);

  // Format text
  const formatText = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      updateFormatState();
      editorRef.current?.focus();
      // Trigger input to save to history
      setTimeout(() => handleInput(), 0);
    },
    [handleInput]
  );

  // Change block type (heading, paragraph, etc.)
  const changeBlockType = useCallback(
    (tag: string) => {
      formatText("formatBlock", tag);
      setBlockType(tag);
    },
    [formatText]
  );

  // Insert link
  const insertLink = useCallback(() => {
    if (!linkUrl) return;
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    formatText("createLink", url);
    setShowLinkModal(false);
    setLinkUrl("");
  }, [linkUrl, formatText]);

  // Remove link
  const removeLink = useCallback(() => {
    formatText("unlink");
  }, [formatText]);

  // Insert table
  const insertTable = useCallback(() => {
    const table = `
      <table border="1" style="border-collapse: collapse; width: 100%; margin: 1em 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Cell 1</td>
          <td style="padding: 8px; border: 1px solid #ddd;">Cell 2</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Cell 3</td>
          <td style="padding: 8px; border: 1px solid #ddd;">Cell 4</td>
        </tr>
      </table>
    `;
    document.execCommand("insertHTML", false, table);
    setTimeout(() => handleInput(), 0);
  }, [handleInput]);

  // Find text
  const findInText = useCallback(() => {
    if (!findText || !editorRef.current) return;
    const selection = window.getSelection();
    const range = document.createRange();
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT
    );

    let node;
    while ((node = walker.nextNode())) {
      const index = node.textContent
        ?.toLowerCase()
        .indexOf(findText.toLowerCase());
      if (index !== undefined && index !== -1 && node.textContent) {
        range.setStart(node, index);
        range.setEnd(node, index + findText.length);
        selection?.removeAllRanges();
        selection?.addRange(range);
        editorRef.current.focus();
        break;
      }
    }
  }, [findText]);

  // Replace text
  const replaceInText = useCallback(() => {
    if (!editorRef.current || !findText) return;
    const html = editorRef.current.innerHTML;
    const newHtml = html.replace(new RegExp(findText, "g"), replaceText);
    editorRef.current.innerHTML = newHtml;
    handleInput();
  }, [findText, replaceText, handleInput]);

  // Clear formatting
  const clearFormatting = useCallback(() => {
    formatText("removeFormat");
  }, [formatText]);

  // Text alignment
  const alignText = useCallback(
    (alignment: string) => {
      formatText(
        `justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`
      );
      setTextAlign(alignment);
    },
    [formatText]
  );

  // Insert image
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editorRef.current) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imgHtml = `<p><img src="${event.target?.result}" style="max-width: 100%; height: auto; display: block; margin: 1rem 0;" /></p>`;

        // Focus editor and insert
        editorRef.current?.focus();
        document.execCommand("insertHTML", false, imgHtml);

        // Trigger input to save to history
        setTimeout(() => handleInput(), 0);
      };
      reader.readAsDataURL(file);

      // Reset input
      e.target.value = "";
    },
    [handleInput]
  );

  // Handle paste with images
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (!blob) continue;

          const reader = new FileReader();
          reader.onload = (event) => {
            const imgHtml = `<p><img src="${event.target?.result}" style="max-width: 100%; height: auto; display: block; margin: 1rem 0;" /></p>`;
            document.execCommand("insertHTML", false, imgHtml);
            setTimeout(() => handleInput(), 0);
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
    },
    [handleInput]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (!modKey) return;

      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          formatText("bold");
          break;
        case "i":
          e.preventDefault();
          formatText("italic");
          break;
        case "u":
          e.preventDefault();
          formatText("underline");
          break;
        case "k":
          e.preventDefault();
          setShowLinkModal(true);
          break;
        case "f":
          e.preventDefault();
          setShowFindReplace(true);
          break;
        case "z":
          if (e.shiftKey) {
            e.preventDefault();
            performRedo();
          } else {
            e.preventDefault();
            performUndo();
          }
          break;
        case "y":
          if (!isMac) {
            e.preventDefault();
            performRedo();
          }
          break;
      }
    },
    [formatText, performUndo, performRedo]
  );

  // Update format state
  const updateFormatState = useCallback(() => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));

    // Get current block type
    const selection = window.getSelection();
    if (selection && selection.anchorNode) {
      let node = selection.anchorNode.parentElement;
      while (node && node !== editorRef.current) {
        const tag = node.tagName?.toLowerCase();
        if (
          ["p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"].includes(tag)
        ) {
          setBlockType(tag);
          break;
        }
        node = node.parentElement;
      }
    }
  }, []);

  // Track selection changes for toolbar
  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        updateFormatState();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [updateFormatState]);

  // Render spacing indicators
  const renderIndicators = () => {
    if (!editorRef.current || !showSpacingIndicators || focusMode) return null;

    const paragraphs = Array.from(editorRef.current.querySelectorAll("p, div"));

    return analysis.spacing.map((item, idx) => {
      const para = paragraphs[item.index];
      if (!para) return null;

      const rect = para.getBoundingClientRect();
      const container = editorRef.current?.getBoundingClientRect();
      if (!container) return null;

      const colors = {
        compact: "bg-blue-100 text-blue-800 border-blue-200",
        extended: "bg-orange-100 text-orange-800 border-orange-200",
        balanced: "bg-green-100 text-green-800 border-green-200",
      };

      return (
        <div
          key={`spacing-${idx}`}
          className={`absolute text-xs px-2 py-0.5 rounded-full border shadow-sm z-10 ${
            colors[item.tone as keyof typeof colors] || colors.balanced
          } select-none whitespace-nowrap pointer-events-none`}
          style={{
            top: `${rect.top - container.top - 24}px`,
            left: `${rect.left - container.left}px`,
          }}
        >
          {item.label} · {item.wordCount} words
        </div>
      );
    });
  };

  // Render visual suggestions
  const renderSuggestions = () => {
    if (!editorRef.current || !showVisualSuggestions || focusMode) return null;

    const paragraphs = Array.from(editorRef.current.querySelectorAll("p, div"));

    return analysis.visuals.map((item, idx) => {
      const para = paragraphs[item.index];
      if (!para) return null;

      const rect = para.getBoundingClientRect();
      const container = editorRef.current?.getBoundingClientRect();
      if (!container) return null;

      return (
        <div
          key={`visual-${idx}`}
          className="absolute left-0 right-0 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r text-sm text-yellow-900 select-none pointer-events-none"
          style={{
            top: `${rect.bottom - container.top + 8}px`,
          }}
        >
          {item.suggestions.map((s, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <div className="font-semibold flex items-center gap-1">
                <span>💡</span> {s.visualType}
              </div>
              <div className="text-xs mt-1">{s.reason}</div>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div
      className="custom-editor-container"
      style={{ position: "relative", height: "100%", ...style }}
    >
      {/* Toolbar */}
      <div className="toolbar flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50 sticky top-0 z-20 shadow-sm">
        {/* Block type dropdown */}
        <select
          value={blockType}
          onChange={(e) => changeBlockType(e.target.value)}
          className="px-2 py-1.5 rounded border bg-white hover:bg-gray-50 transition-colors text-sm"
          title="Block Type"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="blockquote">Quote</option>
        </select>

        <div className="w-px h-6 bg-gray-300" />

        {/* Text formatting */}
        <div className="flex gap-1">
          <button
            onClick={() => formatText("bold")}
            className={`px-3 py-1.5 rounded font-bold transition-colors ${
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
            className={`px-3 py-1.5 rounded italic transition-colors ${
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
            className={`px-3 py-1.5 rounded underline transition-colors ${
              isUnderline
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Underline (⌘U / Ctrl+U)"
          >
            U
          </button>
          <button
            onClick={() => formatText("strikeThrough")}
            className="px-3 py-1.5 rounded line-through hover:bg-gray-200 text-gray-700 transition-colors"
            title="Strikethrough"
          >
            S
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Text alignment */}
        <div className="flex gap-1">
          <button
            onClick={() => alignText("left")}
            className={`px-2 py-1.5 rounded transition-colors ${
              textAlign === "left"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Align Left"
          >
            ≡
          </button>
          <button
            onClick={() => alignText("center")}
            className={`px-2 py-1.5 rounded transition-colors ${
              textAlign === "center"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Align Center"
          >
            ≡
          </button>
          <button
            onClick={() => alignText("right")}
            className={`px-2 py-1.5 rounded transition-colors ${
              textAlign === "right"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Align Right"
          >
            ≡
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Lists */}
        <div className="flex gap-1">
          <button
            onClick={() => formatText("insertUnorderedList")}
            className="px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="Bullet List"
          >
            • List
          </button>
          <button
            onClick={() => formatText("insertOrderedList")}
            className="px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Insert options */}
        <div className="flex gap-1">
          <button
            onClick={() => setShowLinkModal(true)}
            className="px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="Insert Link (⌘K / Ctrl+K)"
          >
            🔗
          </button>
          <button
            onClick={removeLink}
            className="px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="Remove Link"
          >
            ⛓️‍💥
          </button>
          <label className="px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer">
            📸
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              title="Insert Image"
            />
          </label>
          <button
            onClick={insertTable}
            className="px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="Insert Table"
          >
            ⊞
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Utilities */}
        <div className="flex gap-1">
          <button
            onClick={clearFormatting}
            className="px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors text-sm"
            title="Clear Formatting"
          >
            ⌫
          </button>
          <button
            onClick={() => setShowFindReplace(!showFindReplace)}
            className={`px-3 py-1.5 rounded transition-colors ${
              showFindReplace
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Find & Replace (⌘F / Ctrl+F)"
          >
            🔍
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* History */}
        <div className="flex gap-1">
          <button
            onClick={performUndo}
            disabled={!canUndo}
            className="px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="Undo (⌘Z / Ctrl+Z)"
          >
            ↶
          </button>
          <button
            onClick={performRedo}
            disabled={!canRedo}
            className="px-3 py-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="Redo (⌘⇧Z / Ctrl+Y)"
          >
            ↷
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* View options */}
        <div className="flex gap-1">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-3 py-1.5 rounded transition-colors text-sm ${
              showStats
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Show Statistics"
          >
            📊
          </button>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`px-3 py-1.5 rounded transition-colors text-sm ${
              focusMode
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Focus Mode (Hide Indicators)"
          >
            🎯
          </button>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") insertLink();
                if (e.key === "Escape") setShowLinkModal(false);
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertLink}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Find & Replace Panel */}
      {showFindReplace && (
        <div className="border-b bg-yellow-50 p-3 flex items-center gap-3 flex-wrap">
          <input
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Find..."
            className="px-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") findInText();
              if (e.key === "Escape") setShowFindReplace(false);
            }}
          />
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace with..."
            className="px-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowFindReplace(false);
            }}
          />
          <button
            onClick={findInText}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Find
          </button>
          <button
            onClick={replaceInText}
            className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
          >
            Replace All
          </button>
          <button
            onClick={() => setShowFindReplace(false)}
            className="px-3 py-1.5 hover:bg-gray-200 rounded transition-colors text-sm"
          >
            Close
          </button>
        </div>
      )}

      {/* Statistics Panel */}
      {showStats && (
        <div className="border-b bg-blue-50 p-3 flex items-center gap-6 text-sm flex-wrap">
          <div>
            <span className="font-semibold">Words:</span> {statistics.words}
          </div>
          <div>
            <span className="font-semibold">Characters:</span>{" "}
            {statistics.characters}
          </div>
          <div>
            <span className="font-semibold">Paragraphs:</span>{" "}
            {statistics.paragraphs}
          </div>
          <div>
            <span className="font-semibold">Reading Time:</span>{" "}
            {statistics.readingTime} min
          </div>
          <div>
            <span className="font-semibold">Reading Level:</span> Grade{" "}
            {statistics.readingLevel}
          </div>
        </div>
      )}

      {/* Editor area with indicators */}
      <div
        className="editor-wrapper"
        style={{ position: "relative", flex: 1, overflow: "auto" }}
      >
        <div
          ref={editorRef}
          contentEditable={isEditable}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          className={`editor-content p-4 focus:outline-none ${className || ""}`}
          style={{
            minHeight: "300px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
          suppressContentEditableWarning
        />

        {/* Spacing indicators overlay */}
        {renderIndicators()}

        {/* Visual suggestions overlay */}
        {renderSuggestions()}
      </div>

      <style>{`
        .editor-content p {
          margin: 1em 0;
        }
        .editor-content p:first-child {
          margin-top: 0;
        }
        .editor-content h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        .editor-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        .editor-content h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        .editor-content h4 {
          font-size: 1em;
          font-weight: bold;
          margin: 1em 0;
        }
        .editor-content h5 {
          font-size: 0.83em;
          font-weight: bold;
          margin: 1.5em 0;
        }
        .editor-content h6 {
          font-size: 0.67em;
          font-weight: bold;
          margin: 2em 0;
        }
        .editor-content blockquote {
          border-left: 4px solid #ddd;
          padding-left: 1em;
          margin: 1em 0;
          color: #666;
          font-style: italic;
        }
        .editor-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1rem 0;
        }
        .editor-content ul,
        .editor-content ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        .editor-content li {
          margin: 0.5em 0;
        }
        .editor-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        .editor-content table td {
          padding: 8px;
          border: 1px solid #ddd;
        }
        .editor-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .editor-content a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};
