import "@/syncfusion/registerLicense";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  WordExport,
  SfdtExport,
  TextExport,
  Selection,
  Search,
  Editor,
  ContextMenu,
  OptionsPane,
  Inject,
} from "@syncfusion/ej2-react-documenteditor";
import { analyzeParagraphSpacing, countWords } from "@/utils/spacingInsights";
import { DualCodingAnalyzer } from "@/utils/dualCodingAnalyzer";

interface SyncfusionEditorProps {
  content: string; // HTML or Text
  onUpdate?: (content: { html: string; text: string }) => void;
  isEditable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showSpacingIndicators?: boolean;
  showVisualSuggestions?: boolean;
  concepts?: string[];
  onConceptClick?: (concept: string) => void;
}

export const SyncfusionEditor: React.FC<SyncfusionEditorProps> = ({
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
  const containerRef = useRef<DocumentEditorContainerComponent>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    spacing: any[];
    visuals: any[];
  }>({ spacing: [], visuals: [] });
  const [isEditorReady, setIsEditorReady] = useState(false);
  const programmaticUpdateRef = useRef(false);
  const lastSyncedContentRef = useRef<string>("");

  const looksLikeHtml = (value: string) => /<[^>]+>/.test(value);

  const normalizePlainTextValue = (value: string) =>
    value
      .replace(/\r\n?/g, "\n")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/ {2,}/g, " ")
      .trim();

  const normalizePlainText = useCallback((value: string) => {
    if (!value) {
      return "";
    }

    return normalizePlainTextValue(value);
  }, []);

  const convertHtmlToPlainText = (html: string) => {
    if (typeof window !== "undefined") {
      try {
        const parser = new DOMParser();
        const parsed = parser.parseFromString(html, "text/html");
        return parsed.body.textContent || "";
      } catch (error) {
        console.warn("DOMParser failed, falling back to regex strip", error);
      }
    }

    return html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<(br|hr)\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|section|article|li|h[1-6])>/gi, "\n\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\r?\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/ {2,}/g, " ")
      .trim();
  };

  const convertHtmlToEditorText = useCallback(
    (html: string) => {
      if (typeof window === "undefined") {
        return normalizePlainText(convertHtmlToPlainText(html));
      }

      try {
        const container = document.createElement("div");
        container.innerHTML = html;

        // Prefix list markers so innerText keeps bullet/number markers
        container.querySelectorAll("ol").forEach((ol) => {
          const start = parseInt(ol.getAttribute("start") || "1", 10) || 1;
          Array.from(ol.children).forEach((child, index) => {
            if (child instanceof HTMLElement && child.tagName === "LI") {
              child.setAttribute("data-marker", `${start + index}. `);
            }
          });
        });

        container.querySelectorAll("ul li").forEach((li) => {
          li.setAttribute("data-marker", "• ");
        });

        container.querySelectorAll("li").forEach((li) => {
          const marker = li.getAttribute("data-marker");
          if (marker) {
            li.insertBefore(document.createTextNode(marker), li.firstChild);
            li.removeAttribute("data-marker");
          }
        });

        const text = container.innerText;
        return normalizePlainText(text);
      } catch (error) {
        console.warn(
          "Enhanced HTML conversion failed; reverting to basic mode.",
          error
        );
        return normalizePlainText(convertHtmlToPlainText(html));
      }
    },
    [normalizePlainText]
  );

  const normalizedContent = useMemo(() => {
    if (!content) return "";
    const trimmed = content.trim();
    if (!trimmed) return "";

    if (looksLikeHtml(trimmed)) {
      return convertHtmlToEditorText(trimmed);
    }

    return normalizePlainText(trimmed);
  }, [content, convertHtmlToEditorText, normalizePlainText]);

  const paragraphBlocks = useMemo(() => {
    if (!normalizedContent) {
      return [] as string[];
    }

    return normalizedContent
      .split(/\n\s*\n/g)
      .map((block) => block.trim())
      .filter((block) => block.length > 0);
  }, [normalizedContent]);

  const analysisText = useMemo(() => {
    if (paragraphBlocks.length === 0) {
      return normalizedContent;
    }
    return paragraphBlocks.join("\n\n");
  }, [normalizedContent, paragraphBlocks]);

  const runAnalysis = useCallback(
    (text: string) => {
      const spacing: any[] = [];
      const visuals: any[] = [];

      const paragraphs = text.split(/\n\s*\n/);

      paragraphs.forEach((para, index) => {
        if (!para.trim()) return;

        const wordCount = countWords(para);
        const spacingInfo = analyzeParagraphSpacing(wordCount);

        if (showSpacingIndicators) {
          spacing.push({ index, text: para, ...spacingInfo });
        }

        if (showVisualSuggestions && para.length > 50) {
          const suggestions = DualCodingAnalyzer.analyzeParagraph(para, index);
          if (suggestions.length > 0) {
            visuals.push(...suggestions);
          }
        }
      });

      setAnalysisResults({ spacing, visuals });
    },
    [showSpacingIndicators, showVisualSuggestions]
  );

  const loadContentIntoEditor = useCallback(() => {
    if (!isEditorReady || !containerRef.current) {
      return;
    }

    const editor = containerRef.current.documentEditor;
    if (!editor || !editor.editor) {
      console.error(
        "Syncfusion editor module unavailable. Ensure Editor service is injected."
      );
      programmaticUpdateRef.current = false;
      return;
    }

    const textToLoad = analysisText;
    if (textToLoad === lastSyncedContentRef.current) {
      return;
    }

    programmaticUpdateRef.current = true;

    const wasReadOnly = editor.isReadOnly;
    if (wasReadOnly) {
      editor.isReadOnly = false;
    }

    // Try to load HTML content if it looks like HTML
    const isHtml = looksLikeHtml(content);

    if (isHtml) {
      // For HTML content with images and formatting, try to preserve structure
      try {
        console.log("📄 Loading HTML content into Syncfusion editor...");

        // Parse HTML to extract structured content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;

        // Extract paragraphs with their text
        const paragraphs: string[] = [];
        tempDiv
          .querySelectorAll("p, div, h1, h2, h3, h4, h5, h6, li")
          .forEach((el) => {
            const text = el.textContent?.trim();
            if (text && text.length > 0) {
              paragraphs.push(text);
            }
          });

        // If we extracted structured content, use it
        if (paragraphs.length > 0) {
          editor.openBlank();

          // Build content with styled analysis indicators
          let formattedContent = "";
          paragraphs.forEach((para, index) => {
            if (index > 0) {
              const wordCount = countWords(para);
              const spacingInfo = analyzeParagraphSpacing(wordCount);

              // Add spacing pill-style indicator
              if (showSpacingIndicators) {
                const pillText = `━━ 📏 Spacing: ${spacingInfo.shortLabel} · ${wordCount} words ━━`;
                formattedContent += `${pillText}\n`;
              }

              // Check for dual-coding opportunities
              if (showVisualSuggestions && para.length > 50) {
                const suggestions = DualCodingAnalyzer.analyzeParagraph(
                  para,
                  index
                );
                if (suggestions.length > 0) {
                  const suggestion = suggestions[0];
                  // Create banner-style visual
                  const bannerTop = `┌${"─".repeat(70)}┐`;
                  const bannerTitle = `│ 💡 VISUAL OPPORTUNITY: ${suggestion.visualType
                    .toUpperCase()
                    .padEnd(51)} │`;
                  const bannerPriority = `│ Priority: ${suggestion.priority
                    .toUpperCase()
                    .padEnd(61)} │`;
                  const bannerBottom = `└${"─".repeat(70)}┘`;

                  formattedContent += `${bannerTop}\n${bannerTitle}\n${bannerPriority}\n${bannerBottom}\n`;
                }
              }
            }

            formattedContent += para + "\n\n";
          });

          editor.selection?.moveToDocumentStart();
          editor.editor.insertText(formattedContent);
          editor.selection?.moveToDocumentStart();

          // Apply formatting to indicators
          setTimeout(() => {
            applyInlineFormatting(editor, paragraphs);
          }, 200);

          console.log(
            `✓ Loaded ${paragraphs.length} paragraphs from HTML with inline analysis`
          );
        } else {
          // Fallback to plain text
          loadAsPlainText(editor, textToLoad);
        }

        // Note: Images from HTML cannot be directly inserted in client-side mode
        // They are preserved in the HTML export but not visible in the editor
        const images = tempDiv.querySelectorAll("img");
        if (images.length > 0) {
          console.log(
            `ℹ️ Document contains ${images.length} images (visible in HTML export)`
          );
        }
      } catch (error) {
        console.warn("Failed to parse HTML, using plain text", error);
        loadAsPlainText(editor, textToLoad);
      }
    } else {
      loadAsPlainText(editor, textToLoad);
    }

    editor.isReadOnly = !isEditable;
    lastSyncedContentRef.current = textToLoad;

    if (showSpacingIndicators || showVisualSuggestions) {
      runAnalysis(textToLoad);
    }

    // Apply formatting after content settles
    setTimeout(() => {
      programmaticUpdateRef.current = false;

      if (onUpdate) {
        onUpdate({ html: isHtml ? content : "", text: textToLoad });
      }
    }, 150);
  }, [
    isEditorReady,
    isEditable,
    analysisText,
    content,
    onUpdate,
    paragraphBlocks,
    runAnalysis,
    showSpacingIndicators,
    showVisualSuggestions,
  ]);

  const loadAsPlainText = (editor: any, textToLoad: string) => {
    editor.openBlank();

    if (textToLoad) {
      const blocks = paragraphBlocks.length
        ? paragraphBlocks
        : textToLoad
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean);

      // Build content with styled analysis indicators
      let formattedContent = "";
      blocks.forEach((block, index) => {
        if (index > 0) {
          const wordCount = countWords(block);
          const spacingInfo = analyzeParagraphSpacing(wordCount);

          // Add spacing pill-style indicator
          if (showSpacingIndicators) {
            // Use box-drawing characters to create a pill-like visual separator
            const pillText = `━━ 📏 Spacing: ${spacingInfo.shortLabel} · ${wordCount} words ━━`;
            formattedContent += `${pillText}\n`;
          }

          // Check for dual-coding opportunities
          if (showVisualSuggestions && block.length > 50) {
            const suggestions = DualCodingAnalyzer.analyzeParagraph(
              block,
              index
            );
            if (suggestions.length > 0) {
              const suggestion = suggestions[0];
              // Create banner-style visual with box characters
              const bannerTop = `┌${"─".repeat(70)}┐`;
              const bannerTitle = `│ 💡 VISUAL OPPORTUNITY: ${suggestion.visualType
                .toUpperCase()
                .padEnd(51)} │`;
              const bannerPriority = `│ Priority: ${suggestion.priority
                .toUpperCase()
                .padEnd(61)} │`;
              const bannerBottom = `└${"─".repeat(70)}┘`;

              formattedContent += `${bannerTop}\n${bannerTitle}\n${bannerPriority}\n${bannerBottom}\n`;
            }
          }
        }

        formattedContent += block + "\n\n";
      });

      editor.selection?.moveToDocumentStart();
      editor.editor.insertText(formattedContent);
      editor.selection?.moveToDocumentStart();

      // Now apply formatting to the indicators
      setTimeout(() => {
        applyInlineFormatting(editor, blocks);
      }, 200);

      console.log(
        `✓ Loaded plain text with inline indicators (${blocks.length} blocks)`
      );
    }

    if (showSpacingIndicators || showVisualSuggestions) {
      runAnalysis(textToLoad);
    }
  };

  const applyInlineFormatting = (editor: any, blocks: string[]) => {
    if (!editor.search || !editor.selection) return;

    console.log("🎨 Applying visual styling to indicators...");

    blocks.forEach((block, index) => {
      if (index === 0) return; // Skip first paragraph

      const wordCount = countWords(block);
      const spacingInfo = analyzeParagraphSpacing(wordCount);

      // Style spacing pill indicators
      if (showSpacingIndicators) {
        const pillText = `━━ 📏 Spacing: ${spacingInfo.shortLabel} · ${wordCount} words ━━`;
        try {
          editor.search.findAll(pillText);
          if (editor.selection) {
            // Apply color based on tone (pill background effect via text color)
            const color =
              spacingInfo.tone === "compact"
                ? "#065f46" // dark green
                : spacingInfo.tone === "extended"
                ? "#92400e" // dark orange
                : "#1d4ed8"; // dark blue

            editor.selection.characterFormat.fontColor = color;
            editor.selection.characterFormat.bold = true;
            editor.selection.characterFormat.fontSize = 11;
          }
        } catch (e) {
          // Silent fail for search issues
        }
      }

      // Style dual-coding banner indicators
      if (showVisualSuggestions && block.length > 50) {
        const suggestions = DualCodingAnalyzer.analyzeParagraph(block, index);
        if (suggestions.length > 0) {
          const suggestion = suggestions[0];

          // Style the banner title line
          const bannerTitle = `│ 💡 VISUAL OPPORTUNITY: ${suggestion.visualType
            .toUpperCase()
            .padEnd(51)} │`;
          try {
            editor.search.findAll(bannerTitle);
            if (editor.selection) {
              editor.selection.characterFormat.fontColor = "#92400e"; // dark yellow/brown
              editor.selection.characterFormat.bold = true;
              editor.selection.characterFormat.fontSize = 11;
            }
          } catch (e) {
            // Silent fail
          }

          // Style the priority line
          const bannerPriority = `│ Priority: ${suggestion.priority
            .toUpperCase()
            .padEnd(61)} │`;
          try {
            editor.search.findAll(bannerPriority);
            if (editor.selection) {
              editor.selection.characterFormat.fontColor =
                suggestion.priority === "high" ? "#dc2626" : "#ca8a04";
              editor.selection.characterFormat.bold = true;
              editor.selection.characterFormat.fontSize = 10;
            }
          } catch (e) {
            // Silent fail
          }

          // Style border lines
          try {
            const bannerTop = `┌${"─".repeat(70)}┐`;
            const bannerBottom = `└${"─".repeat(70)}┘`;

            editor.search.findAll(bannerTop);
            if (editor.selection) {
              editor.selection.characterFormat.fontColor = "#fbbf24"; // yellow
            }

            editor.search.findAll(bannerBottom);
            if (editor.selection) {
              editor.selection.characterFormat.fontColor = "#fbbf24"; // yellow
            }
          } catch (e) {
            // Silent fail
          }
        }
      }
    });

    // Move cursor back to start
    editor.selection?.moveToDocumentStart();
    console.log("✓ Visual styling applied");
  };

  const applyFormattingHighlights = (editor: any, text: string) => {
    // Inline indicators are now applied in loadAsPlainText
    // Sidebar shows detailed analysis
    if (!showSpacingIndicators && !showVisualSuggestions) return;

    console.log(
      "✓ Analysis displayed: inline indicators in document + detailed cards in sidebar"
    );
  };

  useEffect(() => {
    loadContentIntoEditor();
  }, [loadContentIntoEditor]);

  useEffect(() => {
    if (containerRef.current?.documentEditor) {
      containerRef.current.documentEditor.isReadOnly = !isEditable;
    }
  }, [isEditable]);

  // Handle content changes
  const handleContentChange = () => {
    if (programmaticUpdateRef.current) {
      return;
    }

    if (containerRef.current) {
      const editor = containerRef.current.documentEditor;
      if (editor) {
        editor.saveAsBlob("Txt").then((blob: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result as string;
            const normalized = normalizePlainText(text);
            lastSyncedContentRef.current = normalized;

            if (showSpacingIndicators || showVisualSuggestions) {
              runAnalysis(normalized);
            }

            if (onUpdate) {
              onUpdate({ html: "", text: normalized });
            }
          };
          reader.readAsText(blob);
        });
      }
    }
  };

  // Highlight concepts
  useEffect(() => {
    if (
      containerRef.current &&
      concepts.length > 0 &&
      containerRef.current.documentEditor &&
      isEditorReady
    ) {
      const editor = containerRef.current.documentEditor;
      if (editor) {
        concepts.forEach((concept) => {
          try {
            const search = editor.search;
            if (search) {
              search.findAll(concept);
            }
          } catch (e) {
            console.error("Error highlighting concept:", concept, e);
          }
        });
      }
    }
  }, [concepts, isEditorReady]);

  return (
    <div
      className={`syncfusion-editor-wrapper ${className || ""}`}
      style={{ display: "flex", height: "100%", ...style }}
    >
      <div style={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <DocumentEditorContainerComponent
          ref={containerRef}
          id="container"
          height="100%"
          width="100%"
          enableToolbar={true}
          restrictEditing={!isEditable}
          serviceUrl="" // We are client-side only for now
          contentChange={handleContentChange}
          created={() => {
            if (containerRef.current) {
              containerRef.current.documentEditor.isReadOnly = !isEditable;

              // Disable the "Open" button in toolbar since we use DocumentUploader component
              const toolbar = containerRef.current.toolbarModule;
              if (toolbar) {
                try {
                  // Hide the Open button from the toolbar
                  const openButton = document.querySelector('[title="Open"]');
                  if (openButton) {
                    (openButton as HTMLElement).style.display = "none";
                  }
                } catch (e) {
                  console.warn("Could not hide Open button:", e);
                }
              }

              setIsEditorReady(true);
            }
          }}
        >
          <Inject
            services={[
              Toolbar,
              WordExport,
              SfdtExport,
              TextExport,
              Selection,
              Search,
              Editor,
              ContextMenu,
              OptionsPane,
            ]}
          />
        </DocumentEditorContainerComponent>
      </div>

      {/* Analysis Sidebar */}
      {(showSpacingIndicators || showVisualSuggestions) && (
        <div className="analysis-sidebar w-64 bg-gray-50 border-l border-gray-200 overflow-y-auto p-4 text-sm">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
            <div className="font-semibold text-blue-800 mb-1">
              💡 How Analysis Works
            </div>
            <div className="text-blue-700">
              <strong>In Document:</strong> Color-coded labels show spacing &
              visual opportunities inline.
              <br />
              <strong>In Sidebar:</strong> Detailed cards provide full analysis
              context.
            </div>
          </div>

          <h3 className="font-bold text-gray-700 mb-4">Analysis Insights</h3>

          {showSpacingIndicators && analysisResults.spacing.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-600 mb-2">
                📏 Spacing & Pacing
              </h4>
              <div className="text-xs text-gray-500 mb-2">
                Paragraph lengths analyzed for optimal learning
              </div>
              {analysisResults.spacing.map((item, i) => (
                <div
                  key={i}
                  className={`mb-2 p-2 rounded border cursor-pointer hover:shadow-sm transition ${
                    item.tone === "compact"
                      ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : item.tone === "extended"
                      ? "bg-orange-50 border-orange-200 hover:bg-orange-100"
                      : "bg-green-50 border-green-200 hover:bg-green-100"
                  }`}
                  title="Click to find in document"
                >
                  <div className="font-medium text-sm">{item.shortLabel}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.wordCount} words
                  </div>
                  <div
                    className="text-xs mt-1 italic text-gray-600 line-clamp-2"
                    title={item.text}
                  >
                    "{item.text.substring(0, 50)}
                    {item.text.length > 50 ? "..." : ""}"
                  </div>
                </div>
              ))}
            </div>
          )}

          {showVisualSuggestions && analysisResults.visuals.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-600 mb-2">
                🎨 Visual Opportunities
              </h4>
              <div className="text-xs text-gray-500 mb-2">
                Paragraphs that would benefit from diagrams or images
              </div>
              {analysisResults.visuals.map((item, i) => (
                <div
                  key={i}
                  className="mb-2 p-2 rounded border bg-yellow-50 border-yellow-200 hover:bg-yellow-100 cursor-pointer hover:shadow-sm transition"
                  title="Click to find in document"
                >
                  <div className="font-medium flex items-center gap-1 text-sm">
                    <span>💡</span> {item.visualType}
                  </div>
                  <div className="text-xs mt-1 text-gray-600">
                    {item.reason}
                  </div>
                  {item.priority === "high" && (
                    <div className="text-xs mt-1 font-semibold text-orange-600">
                      High Priority
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!analysisResults.spacing.length &&
            !analysisResults.visuals.length && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm">
                  Start typing to see analysis insights
                </div>
              </div>
            )}
        </div>
      )}

      <style>{`
        /* Syncfusion Material Theme Overrides if needed */
        .e-documenteditor-container {
          border: none !important;
        }
      `}</style>
    </div>
  );
};
