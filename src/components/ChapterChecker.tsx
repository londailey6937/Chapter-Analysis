/**
 * Complete Chapter Checker React Application
 * Main component integrating extraction, analysis, and visualization
 */

import React, { useState, useRef } from "react";
import { AnalysisEngine } from "./AnalysisEngine";
import { ChapterAnalysisDashboard } from "./VisualizationComponents";
import { PdfViewer } from "./PdfViewer";
import { Chapter, ChapterAnalysis } from "@/types";
import {
  extractTextFromPdf,
  extractTextFromPdfArrayBuffer,
  extractPdfStructure,
} from "@/utils/pdfText";

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export const ChapterChecker: React.FC = () => {
  const [chapterText, setChapterText] = useState("");
  const [sectionHints, setSectionHints] = useState<
    { title: string; startIndex: number }[] | null
  >(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [analysis, setAnalysis] = useState<ChapterAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  /**
   * Handle chapter analysis
   */
  const handleAnalyzeChapter = async () => {
    if (!chapterText.trim()) {
      setError("Please enter chapter text to analyze");
      return;
    }

    if (chapterText.trim().split(/\s+/).length < 200) {
      setError("Chapter should be at least 200 words");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      setProgress("Parsing chapter...");

      // Parse chapter into sections (use PDF outline hints if available)
      const sections = parseChapterIntoSections(
        chapterText,
        sectionHints || undefined
      );

      setProgress("Extracting concepts...");

      // Create chapter object
      const chapter: Chapter = {
        id: `chapter-${Date.now()}`,
        title: "Analyzed Chapter",
        content: chapterText,
        wordCount: chapterText.split(/\s+/).length,
        sections,
        conceptGraph: {
          concepts: [],
          relationships: [],
          hierarchy: { core: [], supporting: [], detail: [] },
          sequence: [],
        },
        metadata: {
          readingLevel: estimateReadingLevel(chapterText),
          domain: "general",
          targetAudience: "adult learners",
          estimatedReadingTime: Math.ceil(
            chapterText.split(/\s+/).length / 200
          ),
          createdAt: new Date(),
          lastAnalyzed: new Date(),
        },
      };

      setProgress("Evaluating learning principles...");

      // Run analysis
      const result = await AnalysisEngine.analyzeChapter(chapter);

      setProgress("");
      setAnalysis(result);
    } catch (err) {
      setError(
        `Analysis failed: ${err instanceof Error ? err.message : String(err)}`
      );
      setProgress("");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        // Read buffer once and clone for separate uses
        const originalBuffer = await file.arrayBuffer();

        // Clone for visual rendering (will be transferred to worker)
        const viewerBuffer = originalBuffer.slice(0);
        setPdfBuffer(viewerBuffer);

        // Extract structure for analysis using original
        const { text, pageTexts, outline } = await extractPdfStructure(file);
        if (outline && outline.length > 0) {
          // Compute offsets matching join("\n\n") used by extractor
          const pageOffsets: number[] = [];
          let acc = 0;
          for (let i = 0; i < pageTexts.length; i++) {
            pageOffsets[i] = acc;
            acc += pageTexts[i].length + (i < pageTexts.length - 1 ? 2 : 0);
          }
          const hints = outline
            .map((o) => ({
              title: o.title,
              startIndex: pageOffsets[Math.max(0, o.pageNumber - 1)] ?? 0,
            }))
            .sort((a, b) => a.startIndex - b.startIndex);
          setSectionHints(hints);
        } else {
          setSectionHints(null);
        }
        setChapterText(text);
      } else {
        setPdfBuffer(null);
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setChapterText(content);
          setSectionHints(null);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setError(
        `Failed to read file: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  /**
   * Export analysis as JSON
   */
  const handleExport = () => {
    if (!analysis) return;

    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chapter-analysis-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Clear analysis
   */
  const handleClear = () => {
    setChapterText("");
    setPdfBuffer(null);
    setAnalysis(null);
    setError(null);
    setSectionHints(null);
  };

  /**
   * Unified file reader for upload and drag-drop
   */
  const readFile = async (file: File) => {
    try {
      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        const originalBuffer = await file.arrayBuffer();
        // Clone buffer for viewer (prevents detachment issues)
        const viewerBuffer = originalBuffer.slice(0);
        setPdfBuffer(viewerBuffer);
        const text = await extractTextFromPdfArrayBuffer(originalBuffer);
        setChapterText((prev) => (prev ? prev + "\n\n" + text : text));
      } else {
        const content = await file.text();
        setChapterText((prev) => (prev ? prev + "\n\n" + content : content));
      }
    } catch (err) {
      setError(
        `Failed to process file: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  /** Drag & Drop handlers */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer?.files || []);
    if (!files.length) return;
    for (const file of files) {
      if (!/(\.txt|\.md|\.pdf)$/i.test(file.name)) continue;
      await readFile(file);
    }
  };

  return (
    <div className="chapter-checker">
      <header className="app-header">
        <h1>🧠 Chapter Checker</h1>
        <p>Analyze your chapters using evidence-based learning science</p>
      </header>

      <div className="app-container">
        {!analysis ? (
          <>
            {/* INPUT SECTION */}
            <div
              className={`input-section ${isDragActive ? "drag-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="editor-controls">
                <h2>Paste or Upload Your Chapter</h2>
                <div className="control-buttons">
                  <button
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                  >
                    📄 Upload File (.txt, .md, .pdf)
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  {chapterText && (
                    <button
                      className="btn btn-secondary"
                      onClick={handleClear}
                      disabled={isAnalyzing}
                    >
                      🗑️ Clear
                    </button>
                  )}
                </div>
              </div>

              {/* PDF Visual Preview */}
              {pdfBuffer && (
                <div className="pdf-preview-section">
                  <h3>📄 PDF Preview</h3>
                  <PdfViewer
                    fileBuffer={pdfBuffer}
                    onTextExtracted={(text) => {
                      if (!chapterText) setChapterText(text);
                    }}
                  />
                </div>
              )}

              {/* Text Editor (hidden when PDF shown) */}
              {!pdfBuffer && (
                <>
                  <textarea
                    value={chapterText}
                    onChange={(e) => setChapterText(e.target.value)}
                    placeholder="Paste your chapter text here... (minimum 200 words)"
                    className="chapter-textarea"
                    disabled={isAnalyzing}
                    onPaste={async (e) => {
                      try {
                        const items = e.clipboardData?.items;
                        if (!items) return;
                        for (let i = 0; i < items.length; i++) {
                          const item = items[i];
                          if (
                            item.kind === "file" &&
                            item.type === "application/pdf"
                          ) {
                            e.preventDefault();
                            const file = item.getAsFile();
                            if (!file) return;
                            const originalBuffer = await file.arrayBuffer();
                            // Clone buffer for viewer
                            const viewerBuffer = originalBuffer.slice(0);
                            setPdfBuffer(viewerBuffer);
                            const text = await extractTextFromPdfArrayBuffer(
                              originalBuffer
                            );
                            setChapterText((prev) =>
                              prev ? prev + "\n\n" + text : text
                            );
                            return;
                          }
                        }
                      } catch (err) {
                        setError(
                          `Failed to paste PDF: ${
                            err instanceof Error ? err.message : String(err)
                          }`
                        );
                      }
                    }}
                  />

                  {/* Drag & Drop hint */}
                  <div
                    className="drop-zone"
                    aria-label="Drag and drop files here"
                  >
                    <strong>Drag & Drop</strong> a .txt, .md, or .pdf file
                    anywhere in this box
                    <div className="accepted-note">
                      Accepted: .txt .md .pdf (PDF text extracted)
                    </div>
                  </div>
                </>
              )}

              <div className="word-count">
                <span>{chapterText.trim().split(/\s+/).length} words</span>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                className="btn btn-primary btn-large"
                onClick={handleAnalyzeChapter}
                disabled={isAnalyzing || !chapterText.trim()}
              >
                {isAnalyzing ? `${progress} ...` : "🔍 Analyze Chapter"}
              </button>

              {isAnalyzing && <div className="loading-spinner" />}
            </div>

            {/* INFO SECTION */}
            <div className="info-section">
              <div className="info-card">
                <h3>🎓 What This Analyzes</h3>
                <ul>
                  <li>
                    <strong>Deep Processing:</strong> Questions that encourage
                    deeper thinking
                  </li>
                  <li>
                    <strong>Spaced Repetition:</strong> How concepts are
                    revisited
                  </li>
                  <li>
                    <strong>Retrieval Practice:</strong> Opportunities for
                    active recall
                  </li>
                  <li>
                    <strong>Interleaving:</strong> How topics are mixed vs.
                    blocked
                  </li>
                  <li>
                    <strong>Dual Coding:</strong> Balance of verbal and visual
                    elements
                  </li>
                  <li>
                    <strong>Generative Learning:</strong> Prompts for
                    creating/predicting
                  </li>
                  <li>
                    <strong>Schema Building:</strong> Concept hierarchy and
                    connections
                  </li>
                  <li>
                    <strong>Cognitive Load:</strong> Section complexity and
                    pacing
                  </li>
                  <li>
                    <strong>Emotion & Relevance:</strong> Personal connection
                    elements
                  </li>
                </ul>
              </div>

              <div className="info-card">
                <h3>📊 You'll Get</h3>
                <ul>
                  <li>Overall pedagogical effectiveness score</li>
                  <li>Detailed analysis of each learning principle</li>
                  <li>Concept extraction and relationship mapping</li>
                  <li>Cognitive load distribution analysis</li>
                  <li>Interleaving pattern visualization</li>
                  <li>Prioritized recommendations for improvement</li>
                  <li>Detailed evidence and supporting data</li>
                </ul>
              </div>

              <div className="info-card">
                <h3>💡 Tips for Better Results</h3>
                <ul>
                  <li>Include complete chapters with proper structure</li>
                  <li>Ensure sections have clear headings</li>
                  <li>Include any questions or exercises you have</li>
                  <li>Use consistent formatting</li>
                  <li>Minimum 200 words recommended</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ANALYSIS RESULTS */}
            <div className="results-controls">
              <button
                className="btn btn-secondary"
                onClick={() => setAnalysis(null)}
              >
                ← Back to Editor
              </button>
              <button className="btn btn-secondary" onClick={handleExport}>
                📥 Export as JSON
              </button>
            </div>

            <ChapterAnalysisDashboard analysis={analysis} />
          </>
        )}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .chapter-checker {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--brand-navy-600) 0%, var(--brand-navy-700) 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .app-header {
          padding: 40px 20px;
          text-align: center;
          color: white;
        }

        .app-header h1 {
          margin: 0;
          font-size: 44px;
        }

        .app-header p {
          margin: 10px 0 0 0;
          font-size: 18px;
          opacity: 0.9;
        }

        .app-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .input-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .input-section.drag-active {
          outline: 3px dashed var(--brand-navy-600);
          outline-offset: 2px;
          background: linear-gradient(180deg, #ffffff 0%, #f0f4ff 100%);
        }

        .drop-zone {
          margin-top: 18px;
          padding: 14px 16px;
          border: 2px dashed #cbd5e1;
          border-radius: 10px;
          font-size: 14px;
          text-align: center;
          color: #334155;
          background: #f8fafc;
          transition: background 0.25s, border-color 0.25s;
          user-select: none;
        }

        .drag-active .drop-zone {
          border-color: var(--brand-navy-600);
          background: #eef2ff;
        }

        .drop-zone strong {
          display: block;
          font-size: 13px;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          color: #1e3a8a;
        }

        .accepted-note {
          margin-top: 6px;
          font-size: 11px;
          color: #64748b;
        }

        .editor-controls {
          margin-bottom: 20px;
        }

        .editor-controls h2 {
          margin: 0 0 15px 0;
          font-size: 22px;
          color: #333;
        }

        .control-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .chapter-textarea {
          width: 100%;
          height: 300px;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          resize: vertical;
          transition: border-color 0.3s;
        }

        .chapter-textarea:focus {
          outline: none;
          border-color: var(--brand-navy-600);
        }

        .chapter-textarea:disabled {
          background: #f5f5f5;
          color: #999;
        }

        .pdf-preview-section {
          margin: 20px 0;
        }

        .pdf-preview-section h3 {
          margin-bottom: 12px;
          color: #333;
        }

        .word-count {
          text-align: right;
          color: #666;
          font-size: 13px;
          margin-top: 8px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--brand-navy-600) 0%, var(--brand-navy-700) 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #333;
          border: 2px solid #e0e0e0;
        }

        .btn-secondary:hover:not(:disabled) {
          border-color: var(--brand-navy-600);
          color: var(--brand-navy-600);
        }

        .btn-large {
          width: 100%;
          padding: 15px;
          font-size: 16px;
          margin-top: 20px;
        }

        .error-message {
          background: #ffebee;
          border-left: 4px solid #f44336;
          padding: 12px;
          border-radius: 4px;
          color: #c62828;
          margin: 15px 0;
          font-size: 14px;
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid var(--brand-navy-600);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-top: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .info-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .info-card h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .info-card ul {
          margin: 0;
          padding-left: 20px;
          list-style: none;
        }

        .info-card li {
          margin: 10px 0;
          color: #666;
          font-size: 14px;
          position: relative;
          padding-left: 20px;
        }

        .info-card li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--brand-navy-600);
          font-weight: bold;
        }

        .results-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .app-header h1 {
            font-size: 32px;
          }

          .chapter-textarea {
            height: 200px;
          }

          .info-section {
            grid-template-columns: 1fr;
          }

          .control-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function parseChapterIntoSections(
  text: string,
  hints?: { title: string; startIndex: number }[]
) {
  const sections: Array<{
    id: string;
    heading: string;
    content: string;
    startPosition: number;
    endPosition: number;
    wordCount: number;
    conceptsIntroduced: string[];
    conceptsRevisited: string[];
    depth: number;
  }> = [];

  // Enhanced heading detection:
  // 1. Markdown headings (# ## ###)
  // 2. Lines in ALL CAPS (at least 3 words, under 60 chars)
  // 3. Numbered headings (1. 2. 1.1 etc.)
  // 4. Lines ending with colon followed by newline (e.g., "Introduction:")
  const lines = text.split("\n");
  let currentSection: {
    heading: string;
    startLine: number;
    startPosition: number;
  } | null = null;

  // If hints provided (e.g., PDF outline), build sections from them directly
  if (hints && hints.length > 0) {
    const sorted = [...hints].sort((a, b) => a.startIndex - b.startIndex);
    for (let i = 0; i < sorted.length; i++) {
      const start = Math.max(0, sorted[i].startIndex);
      const end =
        i < sorted.length - 1
          ? Math.max(start, sorted[i + 1].startIndex)
          : text.length;
      const content = text.substring(start, end).trim();
      const words = content.split(/\s+/).filter(Boolean).length;
      sections.push({
        id: `section-${i}`,
        heading: sorted[i].title,
        content,
        startPosition: start,
        endPosition: end,
        wordCount: words,
        conceptsIntroduced: [],
        conceptsRevisited: [],
        depth: 1,
      });
    }
    return sections;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    let isHeading = false;
    let heading = line;
    let depth = 1;

    // Check for markdown heading
    const mdMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (mdMatch) {
      isHeading = true;
      heading = mdMatch[2];
      depth = mdMatch[1].length;
    }
    // Check for ALL CAPS heading (3+ words, under 60 chars, not all punctuation)
    else if (
      line.length > 5 &&
      line.length < 60 &&
      line === line.toUpperCase() &&
      /[A-Z].*\s+[A-Z].*\s+[A-Z]/.test(line) &&
      !/^\s*[^A-Za-z0-9\s]+\s*$/.test(line)
    ) {
      isHeading = true;
      heading = line;
      depth = 1;
    }
    // Check for numbered heading (1. or 1.1 etc.)
    else if (/^\d+(\.\d+)*\.\s+[A-Z]/.test(line) && line.length < 80) {
      isHeading = true;
      heading = line.replace(/^\d+(\.\d+)*\.\s+/, "");
      depth = (line.match(/\./g) || []).length;
    }
    // Check for colon-ended heading on its own line
    else if (
      /^[A-Z][^:]{2,50}:\s*$/.test(line) &&
      i < lines.length - 1 &&
      lines[i + 1].trim().length > 0
    ) {
      isHeading = true;
      heading = line.replace(/:$/, "");
      depth = 1;
    }

    if (isHeading) {
      // Save previous section
      if (currentSection) {
        const startPos = currentSection.startPosition;
        const endLine = i - 1;
        const endPos = lines.slice(0, i).join("\n").length;
        const content = text.substring(startPos, endPos).trim();
        const words = content.split(/\s+/).filter(Boolean).length;

        sections.push({
          id: `section-${sections.length}`,
          heading: currentSection.heading,
          content,
          startPosition: startPos,
          endPosition: endPos,
          wordCount: words,
          conceptsIntroduced: [],
          conceptsRevisited: [],
          depth: 1,
        });
      }

      // Start new section
      const startPos = lines.slice(0, i + 1).join("\n").length + 1;
      currentSection = {
        heading,
        startLine: i,
        startPosition: startPos,
      };
    }
  }

  // Add final section
  if (currentSection) {
    const content = text.substring(currentSection.startPosition).trim();
    const words = content.split(/\s+/).filter(Boolean).length;
    sections.push({
      id: `section-${sections.length}`,
      heading: currentSection.heading,
      content,
      startPosition: currentSection.startPosition,
      endPosition: text.length,
      wordCount: words,
      conceptsIntroduced: [],
      conceptsRevisited: [],
      depth: 1,
    });
  }

  // If no headings found, create balanced fallback sections by splitting the text
  if (sections.length === 0) {
    const totalWords = text.split(/\s+/).filter(Boolean).length;
    const totalLen = text.length;
    // Aim for ~400 words per section, between 3 and 8 sections
    const estimated = Math.max(3, Math.min(8, Math.ceil(totalWords / 400)));
    const count = Math.max(2, estimated);
    const fallback: any[] = [];
    for (let i = 0; i < count; i++) {
      const start = Math.floor((i * totalLen) / count);
      const end =
        i === count - 1
          ? totalLen
          : Math.floor(((i + 1) * totalLen) / count) - 1;
      const content = text.substring(start, end).trim();
      const words = content.split(/\s+/).filter(Boolean).length;
      fallback.push({
        id: `section-${i}`,
        heading: `Part ${i + 1}`,
        content,
        startPosition: start,
        endPosition: end,
        wordCount: words,
        conceptsIntroduced: [],
        conceptsRevisited: [],
        depth: 1,
      });
    }
    return fallback;
  }
  return sections;
}

function estimateReadingLevel(
  text: string
): "beginner" | "intermediate" | "advanced" {
  // Flesch-Kincaid style heuristic
  const words = text.split(/\s+/).length;
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const syllables = text.split(/\s+/).reduce((sum, word) => {
    const syllableCount = (word.match(/[aeiouy]/g) || []).length;
    return sum + Math.max(1, syllableCount);
  }, 0);

  const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;

  if (grade < 6) return "beginner";
  if (grade < 12) return "intermediate";
  return "advanced";
}

export default ChapterChecker;
