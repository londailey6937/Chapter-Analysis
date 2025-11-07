/**
 * Complete Chapter Checker React Application
 * Main component integrating extraction, analysis, and visualization
 */

import React, { useState, useRef } from "react";
import { AnalysisEngine } from "./AnalysisEngine";
import { ChapterAnalysisDashboard } from "./VisualizationComponents";
import { Chapter, ChapterAnalysis } from "@/types";

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export const ChapterChecker: React.FC = () => {
  const [chapterText, setChapterText] = useState("");
  const [analysis, setAnalysis] = useState<ChapterAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Parse chapter into sections
      const sections = parseChapterIntoSections(chapterText);

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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setChapterText(content);
    };
    reader.readAsText(file);
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
    setAnalysis(null);
    setError(null);
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
            <div className="input-section">
              <div className="editor-controls">
                <h2>Paste or Upload Your Chapter</h2>
                <div className="control-buttons">
                  <button
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                  >
                    📄 Upload File (.txt)
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md"
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

              <textarea
                value={chapterText}
                onChange={(e) => setChapterText(e.target.value)}
                placeholder="Paste your chapter text here... (minimum 200 words)"
                className="chapter-textarea"
                disabled={isAnalyzing}
              />

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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          border-color: #667eea;
        }

        .chapter-textarea:disabled {
          background: #f5f5f5;
          color: #999;
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          border-color: #667eea;
          color: #667eea;
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
          border-top: 3px solid #667eea;
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
          color: #667eea;
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

function parseChapterIntoSections(text: string) {
  const sections = [];

  // Split by major headings (lines starting with # or ALL CAPS or numbered)
  const headingPattern = /\n(#{1,3}\s+.+|[A-Z][A-Z\s]+|^\d+\.\s+.+)\n/gm;
  let match;
  let lastPos = 0;

  while ((match = headingPattern.exec(text)) !== null) {
    if (match.index > lastPos) {
      const heading = match[1].replace(/^#+\s+/, "").trim();
      const content = text.substring(lastPos, match.index);
      const words = content.split(/\s+/).length;

      sections.push({
        id: `section-${sections.length}`,
        heading,
        content,
        startPosition: lastPos,
        endPosition: match.index,
        wordCount: words,
        conceptsIntroduced: [],
        conceptsRevisited: [],
        depth: (match[1].match(/#+/) || [""])[0].length,
      });
    }
    lastPos = match.index + match[0].length;
  }

  // Add final section
  if (lastPos < text.length) {
    const content = text.substring(lastPos);
    sections.push({
      id: `section-${sections.length}`,
      heading: "Conclusion",
      content,
      startPosition: lastPos,
      endPosition: text.length,
      wordCount: content.split(/\s+/).length,
      conceptsIntroduced: [],
      conceptsRevisited: [],
      depth: 1,
    });
  }

  return sections.length > 0
    ? sections
    : [
        {
          id: "section-0",
          heading: "Main Content",
          content: text,
          startPosition: 0,
          endPosition: text.length,
          wordCount: text.split(/\s+/).length,
          conceptsIntroduced: [],
          conceptsRevisited: [],
          depth: 1,
        },
      ];
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
