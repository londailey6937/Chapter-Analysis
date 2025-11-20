import React from "react";
import { SyncfusionEditor } from "./SyncfusionEditor";

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
  onExitTemplateMode?: () => void;
  concepts?: string[];
  onConceptClick?: (concept: string) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialText,
  htmlContent,
  onTextChange,
  onContentChange,
  showSpacingIndicators,
  showVisualSuggestions,
  highlightPosition,
  searchWord,
  searchOccurrence,
  readOnly,
  concepts,
  onConceptClick,
}) => {
  // Determine initial content: prefer HTML if available, otherwise text
  const startContent = htmlContent || initialText;

  const handleUpdate = (content: { html: string; text: string }) => {
    onTextChange(content.text);
    if (onContentChange) {
      onContentChange({ plainText: content.text, html: content.html });
    }
  };

  return (
    <div
      className="document-editor-wrapper"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <SyncfusionEditor
        content={startContent}
        onUpdate={handleUpdate}
        isEditable={!readOnly}
        showSpacingIndicators={showSpacingIndicators}
        showVisualSuggestions={showVisualSuggestions}
        concepts={concepts}
        onConceptClick={onConceptClick}
        style={{ flex: 1, minHeight: 0 }}
      />
    </div>
  );
};
