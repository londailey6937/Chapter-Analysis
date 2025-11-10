/**
 * Complete Chapter Checker React Application
 * Main component integrating extraction, analysis, and visualization
 */

import React, { useState, useRef, useEffect } from "react";
import { AnalysisEngine } from "./AnalysisEngine"; // retained for types / future direct calls
import { ChapterAnalysisDashboard } from "./VisualizationComponents";
import { PdfViewer } from "./PdfViewer";
import { ConceptList } from "./ConceptList";
import { Chapter, ChapterAnalysis, Concept } from "@/types";
import {
  extractTextFromPdf,
  extractTextFromPdfArrayBuffer,
  extractPdfStructure,
} from "@/utils/pdfText";
import { Domain, getAvailableDomains } from "@/data/conceptLibraryRegistry";
import type { ConceptDefinition } from "@/data/conceptLibraryRegistry";

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export const ChapterChecker: React.FC = () => {
  const [chapterText, setChapterText] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<Domain>("chemistry");
  const [includeCrossDomain, setIncludeCrossDomain] = useState(false);
  const [customConcepts, setCustomConcepts] = useState<ConceptDefinition[]>([]);
  const [tocEndPage, setTocEndPage] = useState<number>(10); // Configurable TOC end page
  const [sectionHints, setSectionHints] = useState<
    { title: string; startIndex: number }[] | null
  >(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pdfPageTexts, setPdfPageTexts] = useState<string[] | null>(null);
  const [analysis, setAnalysis] = useState<ChapterAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadAnalysisInputRef = useRef<HTMLInputElement>(null);
  const [isSlowPdf, setIsSlowPdf] = useState(false);
  const [isSlowAnalysis, setIsSlowAnalysis] = useState(false);
  const fileProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [highlightedConcept, setHighlightedConcept] = useState<Concept | null>(
    null
  );
  const [currentMentionIndex, setCurrentMentionIndex] = useState<number>(0);
  const [hasAnalyzedOnce, setHasAnalyzedOnce] = useState(false);

  // Detect Mac for keyboard shortcut hints
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modKey = isMac ? "⌘" : "Ctrl";

  /**
   * Keyboard shortcuts
   * - Cmd/Ctrl + U: Upload file
   * - Cmd/Ctrl + Enter: Analyze chapter
   * - Escape: Close expanded sections (future: close modals)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Mac (Cmd) vs PC (Ctrl)
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + U: Upload file
      if (modifierKey && e.key === "u") {
        e.preventDefault();
        fileInputRef.current?.click();
        return;
      }

      // Cmd/Ctrl + Enter: Analyze chapter
      if (modifierKey && e.key === "Enter") {
        e.preventDefault();
        if (chapterText.trim() && !isAnalyzing) {
          handleAnalyzeChapter();
        }
        return;
      }

      // Escape: Close expanded details sections
      if (e.key === "Escape") {
        // Find all open details elements and close them
        const openDetails = document.querySelectorAll("details[open]");
        if (openDetails.length > 0) {
          e.preventDefault();
          openDetails.forEach((detail) => {
            (detail as HTMLDetailsElement).open = false;
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chapterText, isAnalyzing]); // Re-bind when these change

  /**
   * Handle chapter analysis
   */
  const analysisWorkerRef = useRef<Worker | null>(null);

  const handleCancelAnalysis = () => {
    if (analysisWorkerRef.current) {
      analysisWorkerRef.current.terminate();
      analysisWorkerRef.current = null;
    }
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    setIsAnalyzing(false);
    setIsSlowAnalysis(false);
    setProgress("");
    setProgressPercent(0);
    setError("Analysis cancelled by user");
  };

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
    setIsSlowAnalysis(false);
    setHasAnalyzedOnce(true); // Stop pulsating animation permanently

    // Set a timeout to detect slow analysis (30 seconds)
    analysisTimeoutRef.current = setTimeout(() => {
      setIsSlowAnalysis(true);
    }, 30000);

    try {
      setProgress("Parsing chapter...");

      // Filter out TOC before parsing sections
      const filteredText = filterOutTOC(chapterText);

      // Parse chapter into sections (use PDF outline hints if available)
      const sections = parseChapterIntoSections(
        filteredText,
        sectionHints || undefined
      );

      setProgress("Extracting concepts...");

      // Create chapter object (use ORIGINAL text for concept extraction)
      const chapter: Chapter = {
        id: `chapter-${Date.now()}`,
        title: "Analyzed Chapter",
        content: chapterText, // Use original text for concept extraction
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

      setProgress("Dispatching to analysis worker...");

      // Spawn worker (terminate previous if still around)
      if (analysisWorkerRef.current) {
        analysisWorkerRef.current.terminate();
      }
      const worker = new Worker(
        new URL("../workers/analysisWorker.ts", import.meta.url),
        { type: "module" }
      );
      analysisWorkerRef.current = worker;
      worker.onmessage = (evt) => {
        const { type } = evt.data;
        if (type === "progress") {
          const { step, detail } = evt.data;
          // Capitalize first letter of step text for display
          const stepText = step.replace(/-/g, " ");
          const capitalizedStep =
            stepText.charAt(0).toUpperCase() + stepText.slice(1);
          const progressText = `${capitalizedStep}${
            detail ? ": " + detail : ""
          }`;
          setProgress(progressText);

          // Update progress percentage based on step - 10% intervals for more visibility
          let percent = 0;
          switch (step) {
            case "received":
              percent = 10;
              break;
            case "analysis-start":
              percent = 20;
              break;
            case "extracting-concepts":
              percent = 25;
              break;
            case "concept-phase-1":
              percent = 27;
              break;
            case "concept-phase-2":
              percent = 29;
              break;
            case "concept-phase-3":
              percent = 31;
              break;
            case "concept-phase-4":
              percent = 33;
              break;
            case "concept-phase-5":
              percent = 35;
              break;
            case "concept-phase-6":
              percent = 37;
              break;
            case "concept-analysis-complete":
              percent = 39;
              break;
            case "evaluating-principles":
              percent = 40;
              break;
            case "evaluating-1":
              percent = 42;
              break;
            case "evaluating-2":
              percent = 44;
              break;
            case "evaluating-3":
              percent = 46;
              break;
            case "evaluating-4":
              percent = 48;
              break;
            case "evaluating-5":
              percent = 50;
              break;
            case "evaluating-6":
              percent = 52;
              break;
            case "evaluating-7":
              percent = 54;
              break;
            case "evaluating-8":
              percent = 56;
              break;
            case "evaluating-9":
              percent = 58;
              break;
            case "evaluating-10":
              percent = 60;
              break;
            case "principles-complete":
              percent = 65;
              break;
            case "building-visualizations":
              percent = 75;
              break;
            case "analyzing-concepts":
              percent = 85;
              break;
            case "finalizing":
              percent = 95;
              break;
            case "analysis-complete":
              percent = 100;
              break;
            default:
              // Gradual increment for unknown steps
              setProgressPercent((prev) => Math.min(prev + 1, 95));
              return;
          }
          setProgressPercent(percent);
        } else if (type === "complete") {
          if (analysisTimeoutRef.current) {
            clearTimeout(analysisTimeoutRef.current);
            analysisTimeoutRef.current = null;
          }
          setIsSlowAnalysis(false);
          setIsAnalyzing(false);
          setAnalysis(evt.data.result);
          setProgress("");
          setProgressPercent(0);
          worker.terminate();
          analysisWorkerRef.current = null;
        } else if (type === "error") {
          if (analysisTimeoutRef.current) {
            clearTimeout(analysisTimeoutRef.current);
            analysisTimeoutRef.current = null;
          }
          setIsSlowAnalysis(false);
          setIsAnalyzing(false);
          setError(`Analysis failed: ${evt.data.message}`);
          setProgress("");
          setProgressPercent(0);
          worker.terminate();
          analysisWorkerRef.current = null;
        }
      };
      worker.postMessage({
        chapter,
        domain: selectedDomain,
        includeCrossDomain,
        customConcepts,
      });
    } catch (err) {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
        analysisTimeoutRef.current = null;
      }
      setIsSlowAnalysis(false);
      setIsAnalyzing(false);
      setError(
        `Analysis failed: ${err instanceof Error ? err.message : String(err)}`
      );
      setProgress("");
    }
  };

  /**
   * Save analysis results to JSON file
   */
  const handleSaveAnalysis = () => {
    if (!analysis) return;

    const dataToSave = {
      analysis,
      chapterText,
      timestamp: new Date().toISOString(),
      domain: selectedDomain,
    };

    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chapter-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Load analysis results from JSON file
   */
  const handleLoadAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.analysis && data.chapterText) {
        setAnalysis(data.analysis);
        setChapterText(data.chapterText);
        if (data.domain) {
          setSelectedDomain(data.domain);
        }
        setError(null);
      } else {
        setError("Invalid analysis file format");
      }
    } catch (err) {
      setError(
        `Failed to load analysis: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  /**
   * Handle file upload with optimized PDF loading
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress("Loading file...");
    setIsSlowPdf(false);

    // Set a timeout to detect slow PDFs
    fileProcessingTimeoutRef.current = setTimeout(() => {
      setIsSlowPdf(true);
    }, 10000); // 10 seconds

    try {
      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        setProgress("Processing PDF...");

        // Read buffer once for all operations
        const originalBuffer = await file.arrayBuffer();

        // Set buffer for viewer immediately (no text extraction needed in viewer now)
        setPdfBuffer(originalBuffer.slice(0));

        setProgress("Extracting text and structure...");

        // Extract structure for analysis - this is the only text extraction we need
        const { text, pageTexts, outline } = await extractPdfStructure(
          file,
          (progressText) => {
            setProgress(progressText);
            // Extract progress percentage from progress text
            const match = progressText.match(/(\d+) of (\d+)/);
            if (match) {
              const [, current, total] = match;
              const percent = Math.round(
                (parseInt(current) / parseInt(total)) * 100
              );
              setProgressPercent(percent);
            }
          }
        );

        // Store page texts for later use in analysis view
        setPdfPageTexts(pageTexts);

        setProgress("Building section outline...");

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
        setProgress("");
        setProgressPercent(0);

        // Clear timeout on success
        if (fileProcessingTimeoutRef.current) {
          clearTimeout(fileProcessingTimeoutRef.current);
          fileProcessingTimeoutRef.current = null;
        }
        setIsSlowPdf(false);

        // Clear timeout since processing completed
        if (fileProcessingTimeoutRef.current) {
          clearTimeout(fileProcessingTimeoutRef.current);
          fileProcessingTimeoutRef.current = null;
        }
        setIsSlowPdf(false);
      } else {
        setPdfBuffer(null);
        setPdfPageTexts(null);
        setProgress("Reading text file...");

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setChapterText(content);
          setSectionHints(null);
          setProgress("");
          setProgressPercent(0);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setError(
        `Failed to read file: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setProgress("");
      setProgressPercent(0);

      // Clear timeout on error
      if (fileProcessingTimeoutRef.current) {
        clearTimeout(fileProcessingTimeoutRef.current);
        fileProcessingTimeoutRef.current = null;
      }
      setIsSlowPdf(false);
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

  return (
    <div className="chapter-checker">
      <header className="app-header">
        <h1>🧠 Chapter Checker</h1>
        <p>Analyze your chapters using evidence-based learning science</p>
      </header>

      <div className="app-container">
        <div className="unified-layout">
          {/* LEFT PANEL: PDF Viewer */}
          <div className="pdf-panel">
            {pdfBuffer ? (
              <>
                <h3>📄 Chapter PDF</h3>
                <div className="pdf-viewer-container">
                  <PdfViewer
                    fileBuffer={pdfBuffer}
                    skipTextExtraction={true}
                    preExtractedPageTexts={pdfPageTexts || undefined}
                    highlightedConcept={highlightedConcept}
                    chapterText={chapterText}
                    currentMentionIndex={currentMentionIndex}
                    onMentionNavigate={(newIndex) =>
                      setCurrentMentionIndex(newIndex)
                    }
                    tocEndPage={tocEndPage}
                  />
                </div>
              </>
            ) : (
              <div className="pdf-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon">📄</div>
                  <p>Upload a PDF &gt;&gt;&gt;&gt; to view it here</p>
                  <p className="placeholder-hint">
                    The PDF will remain visible during analysis
                  </p>
                </div>
                {/* Arrow pointing to Analyze button */}
                {pdfBuffer && chapterText.trim() && !analysis && (
                  <div className="analyze-arrow-pointer">
                    <div className="arrow-curve"></div>
                    <div className="arrow-text">Click Analyze →</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Controls & Analysis */}
          <div className="control-panel">
            {/* How It Works - Always visible, collapsible */}
            <div className="how-it-works-section">
              <details open={false}>
                <summary className="how-it-works-header">
                  <span>🎓 How the Analyzer Works</span>
                  <span className="toggle-icon">▼</span>
                </summary>
                <div className="how-it-works-content">
                  <p className="how-it-works-intro">
                    Chapter Checker evaluates your content against 10
                    evidence-based learning principles from cognitive science
                    research:
                  </p>
                  <ul className="principles-list">
                    <li>
                      <strong>Deep Processing:</strong> Measures the presence of
                      "why" and "how" questions, worked examples, and prompts
                      that encourage elaboration beyond memorization. Deeper
                      processing leads to stronger, more flexible understanding.
                    </li>
                    <li>
                      <strong>Spaced Repetition:</strong> Analyzes how concepts
                      are revisited across the chapter with increasing time
                      intervals. Strategic spacing combats the forgetting curve
                      and strengthens long-term retention more effectively than
                      massed practice.
                    </li>
                    <li>
                      <strong>Retrieval Practice:</strong> Identifies
                      opportunities for students to actively recall information
                      from memory through questions, prompts, and application
                      exercises. Retrieval strengthens memory pathways better
                      than passive re-reading.
                    </li>
                    <li>
                      <strong>Interleaving:</strong> Evaluates whether different
                      topics are mixed together rather than presented in
                      isolated blocks. Interleaving improves discrimination
                      between concepts and enhances transfer to new situations.
                    </li>
                    <li>
                      <strong>Dual Coding:</strong> Assesses the balance between
                      verbal explanations and visual representations like
                      diagrams, charts, and illustrations. Multiple modalities
                      create richer mental models and memory pathways.
                    </li>
                    <li>
                      <strong>Generative Learning:</strong> Detects prompts that
                      ask students to create, predict, summarize, or explain in
                      their own words. Generating content actively builds
                      understanding rather than passively receiving it.
                    </li>
                    <li>
                      <strong>Schema Building:</strong> Examines how concepts
                      are organized into hierarchical structures showing
                      relationships from foundational to advanced ideas.
                      Well-organized schemas enable faster retrieval and better
                      problem-solving.
                    </li>
                    <li>
                      <strong>Cognitive Load:</strong> Analyzes section length
                      and complexity to ensure working memory isn't overwhelmed.
                      Proper pacing with manageable chunks allows mental
                      resources to focus on learning rather than just surviving
                      information overload.
                    </li>
                    <li>
                      <strong>Emotion & Relevance:</strong> Identifies
                      connections to real-world applications, personal
                      experiences, and emotional engagement. Relevant material
                      increases motivation, attention, and memory formation.
                    </li>
                  </ul>
                </div>
              </details>
            </div>

            {/* User's Guide - Collapsible */}
            <div className="how-it-works-section">
              <details open={false}>
                <summary className="how-it-works-header">
                  <span>📖 User's Guide</span>
                  <span className="toggle-icon">▼</span>
                </summary>
                <div className="how-it-works-content">
                  <p className="how-it-works-intro">
                    Follow these steps to analyze your chapter:
                  </p>
                  <ul className="principle-list">
                    <li>
                      <strong>Select Domain:</strong> Choose the subject area
                      that best matches your content (Chemistry, Algebra &
                      Trigonometry, or Literature).
                    </li>
                    <li>
                      <strong>Upload File:</strong> Click the "Upload File"
                      button and select a .md (Markdown) or .pdf file from your
                      computer.
                    </li>
                    <li>
                      <strong>Review Analysis:</strong> Once processed, the
                      analyzer will display scores for each learning principle
                      along with specific findings and recommendations.
                    </li>
                    <li>
                      <strong>Explore Details:</strong> Click on individual
                      principle cards to see detailed evidence, suggestions for
                      improvement, and specific text excerpts.
                    </li>
                    <li>
                      <strong>Export Results:</strong> Save your analysis as
                      JSON for future reference or sharing with colleagues.
                    </li>
                  </ul>

                  {/* In-Depth Analysis Results Guide */}
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1rem",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <a
                      href="https://github.com/londailey6937/Chapter-Analysis/blob/main/docs/ANALYSIS_RESULTS_GUIDE.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        padding: "0.75rem 1.5rem",
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "6px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.3)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.2)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <svg
                        style={{ width: "24px", height: "24px" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span>📚 Analysis Results - In-Depth Guide</span>
                      <svg
                        style={{ width: "16px", height: "16px" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                    <p
                      style={{
                        marginTop: "0.75rem",
                        marginBottom: 0,
                        fontSize: "0.9rem",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      Complete guide to understanding your analysis: scores,
                      learning principles, pattern recognition, concept
                      relationships, and recommendations
                    </p>
                  </div>
                </div>
              </details>
            </div>

            {/* Upload Controls - Collapsible after analysis */}
            <div className="control-section">
              <details open={!hasAnalyzedOnce}>
                <summary className="how-it-works-header">
                  <span>📤 Upload Your Chapter</span>
                  <span className="toggle-icon">▼</span>
                </summary>
                <div className="how-it-works-content">
                  {/* Domain Selector */}
                  <div className="domain-selector">
                    <label htmlFor="domain-select">
                      <strong>📚 Select Domain:</strong>
                    </label>
                    <select
                      id="domain-select"
                      value={selectedDomain}
                      onChange={(e) =>
                        setSelectedDomain(e.target.value as Domain)
                      }
                      disabled={isAnalyzing}
                      className="domain-dropdown"
                    >
                      {getAvailableDomains()
                        .filter((d) => d.id !== "cross-domain")
                        .map((domain) => (
                          <option key={domain.id} value={domain.id}>
                            {domain.icon} {domain.label}
                          </option>
                        ))}
                    </select>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={includeCrossDomain}
                        onChange={(e) =>
                          setIncludeCrossDomain(e.target.checked)
                        }
                        disabled={isAnalyzing}
                      />
                      <span>Include Cross-Domain Concepts</span>
                    </label>

                    {/* Custom Concepts Input */}
                    {selectedDomain === "custom" && (
                      <div
                        className="custom-concepts-input"
                        style={{ marginTop: "1rem" }}
                      >
                        <label htmlFor="custom-concepts">
                          <strong>✏️ Enter Custom Concepts:</strong>
                          <br />
                          <small style={{ color: "#666" }}>
                            Enter concepts separated by commas or one per line
                          </small>
                        </label>
                        <textarea
                          id="custom-concepts"
                          placeholder="e.g., recursion, algorithm, data structure"
                          rows={5}
                          disabled={isAnalyzing}
                          onChange={(e) => {
                            const input = e.target.value;
                            const conceptNames = input
                              .split(/[,\n]+/)
                              .map((c) => c.trim())
                              .filter((c) => c.length > 0);

                            const concepts: ConceptDefinition[] =
                              conceptNames.map((name, idx) => ({
                                name,
                                category: "Custom",
                                subcategory: "User-Defined",
                                importance: "core" as const,
                              }));

                            setCustomConcepts(concepts);
                          }}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            fontSize: "0.9rem",
                            fontFamily: "inherit",
                          }}
                        />
                        <div
                          style={{
                            marginTop: "0.5rem",
                            fontSize: "0.85rem",
                            color: "#555",
                          }}
                        >
                          {customConcepts.length > 0 && (
                            <span>
                              ✓ {customConcepts.length} custom concept(s)
                              defined
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TOC End Page Setting */}
                    <div className="toc-setting" style={{ marginTop: "1rem" }}>
                      <label htmlFor="toc-end-page">
                        <strong>📑 Table of Contents ends at page:</strong>
                        <br />
                        <small style={{ color: "#666" }}>
                          Enter the LAST page number of your TOC (e.g., if TOC
                          ends at page xvii, enter 17).
                          <br />
                          Concept navigation will skip to page {tocEndPage +
                            1}{" "}
                          or later.
                        </small>
                      </label>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                          marginTop: "0.5rem",
                        }}
                      >
                        <input
                          id="toc-end-page"
                          type="number"
                          min="0"
                          max="200"
                          value={tocEndPage}
                          onChange={(e) =>
                            setTocEndPage(
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          disabled={isAnalyzing}
                          style={{
                            width: "100px",
                            padding: "0.5rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            fontSize: "0.9rem",
                          }}
                          placeholder="e.g., 17"
                        />
                        <span style={{ fontSize: "0.85rem", color: "#666" }}>
                          Quick:
                          {[0, 10, 20, 30, 50].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setTocEndPage(preset)}
                              disabled={isAnalyzing}
                              style={{
                                marginLeft: "0.3rem",
                                padding: "0.2rem 0.5rem",
                                fontSize: "0.8rem",
                                background:
                                  tocEndPage === preset ? "#e3f2fd" : "#f5f5f5",
                                border: "1px solid #ccc",
                                borderRadius: "3px",
                                cursor: isAnalyzing ? "not-allowed" : "pointer",
                              }}
                            >
                              {preset === 0 ? "None" : preset}
                            </button>
                          ))}
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.85rem",
                          color: "#0066cc",
                        }}
                      >
                        💡 Tip: Count pages manually - most PDFs lack proper
                        metadata for auto-detection.
                      </div>
                      <div
                        style={{
                          marginTop: "0.3rem",
                          fontSize: "0.8rem",
                          color: "#666",
                          fontStyle: "italic",
                        }}
                      >
                        Note: Auto-detection rarely works as PDFs don't reliably
                        store page label metadata (e.g., Roman numerals i, ii,
                        iii). Manual setting is recommended.
                      </div>
                    </div>
                  </div>

                  <div className="control-buttons">
                    <button
                      className="btn btn-secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzing}
                      title={`Upload file (${modKey}+U)`}
                    >
                      📄 Upload File{" "}
                      <span style={{ opacity: 0.6, fontSize: "0.85em" }}>
                        ({modKey}+U)
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".md,.pdf"
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
                    {analysis && (
                      <button
                        className="btn btn-secondary"
                        onClick={handleExport}
                      >
                        📥 Export JSON
                      </button>
                    )}
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  {progress && !error && (
                    <div className="progress-indicator">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width:
                              progressPercent > 0
                                ? `${progressPercent}%`
                                : "30%",
                          }}
                        ></div>
                      </div>
                      <div className="progress-text">{progress}</div>
                      {isSlowPdf && (
                        <div className="slow-pdf-warning">
                          ⚠️ This PDF is taking longer than expected. This may
                          be due to complex fonts or encoding. The process will
                          continue, but it may take several minutes.
                        </div>
                      )}
                      {isSlowAnalysis && (
                        <div className="slow-analysis-warning">
                          ⚠️ This analysis is taking longer than expected. This
                          may be due to chapter length or complexity. The
                          process will continue, but it may take several
                          minutes.
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    className={`btn btn-primary btn-large ${
                      chapterText.trim() &&
                      !isAnalyzing &&
                      !analysis &&
                      !hasAnalyzedOnce
                        ? "attention-pulse"
                        : ""
                    }`}
                    onClick={handleAnalyzeChapter}
                    disabled={isAnalyzing || !chapterText.trim()}
                    title={`Analyze chapter (${modKey}+Enter)`}
                  >
                    {isAnalyzing ? "Processing..." : `🔍 Analyze Chapter`}
                    {!isAnalyzing && (
                      <span
                        style={{
                          opacity: 0.7,
                          fontSize: "0.85em",
                          marginLeft: "8px",
                        }}
                      >
                        ({modKey}+⏎)
                      </span>
                    )}
                  </button>

                  {isAnalyzing && <div className="loading-spinner" />}
                </div>
              </details>

              {/* Loading indicator - shows during analysis */}
              {isAnalyzing && (
                <div
                  className="analysis-loading-indicator"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px",
                    margin: "24px 0",
                    background:
                      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    border: "2px solid #0ea5e9",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.15)",
                  }}
                >
                  <div
                    className="loading-spinner-large"
                    style={{
                      width: "48px",
                      height: "48px",
                      border: "4px solid rgba(14, 165, 233, 0.2)",
                      borderTopColor: "#0ea5e9",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      marginBottom: "16px",
                    }}
                  ></div>
                  <div
                    className="loading-text"
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#1e40af",
                      marginBottom: "16px",
                    }}
                  >
                    {progress || "Analyzing chapter..."}
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      marginTop: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#0369a1",
                        }}
                      >
                        Progress
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#0369a1",
                        }}
                      >
                        {progressPercent}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        backgroundColor: "rgba(14, 165, 233, 0.2)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${progressPercent}%`,
                          height: "100%",
                          backgroundColor: "#0ea5e9",
                          transition: "width 0.3s ease-out",
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <button
                    onClick={handleCancelAnalysis}
                    style={{
                      marginTop: "16px",
                      padding: "8px 20px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ef4444";
                    }}
                  >
                    ✕ Cancel Analysis
                  </button>
                </div>
              )}
            </div>

            {/* Analysis Results - Shows when available */}
            {analysis && (
              <div className="analysis-results">
                {/* Save/Load Analysis Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "20px",
                    padding: "16px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <button
                    onClick={handleSaveAnalysis}
                    className="btn btn-primary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      backgroundColor: "#0ea5e9",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                    title="Save analysis results to JSON file"
                  >
                    💾 Save Analysis
                  </button>
                  <button
                    onClick={() => loadAnalysisInputRef.current?.click()}
                    className="btn btn-secondary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      backgroundColor: "#64748b",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                    title="Load previously saved analysis"
                  >
                    📂 Load Analysis
                  </button>
                  <input
                    ref={loadAnalysisInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleLoadAnalysis}
                    style={{ display: "none" }}
                  />
                </div>

                <ChapterAnalysisDashboard
                  analysis={analysis}
                  concepts={analysis.conceptGraph?.concepts || []}
                  onConceptClick={(concept, mentionIndex) => {
                    setHighlightedConcept(concept);
                    setCurrentMentionIndex(mentionIndex);
                  }}
                  highlightedConceptId={highlightedConcept?.id}
                  currentMentionIndex={currentMentionIndex}
                />

                {/* Custom Concepts Input - Separate section after analysis */}
                <div className="custom-concepts-section custom-concepts-after-analysis">
                  <details>
                    <summary className="custom-concepts-header">
                      <strong>➕ Add Custom Concepts</strong>
                      <span className="custom-count">
                        ({customConcepts.length} added)
                      </span>
                    </summary>
                    <div className="custom-concepts-form">
                      <p className="form-hint">
                        Add domain-specific concepts unique to your chapter and
                        re-analyze
                      </p>
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Concept name (e.g., mitochondria)"
                          id="custom-concept-name"
                          className="form-input"
                        />
                        <input
                          type="text"
                          placeholder="Aliases (comma-separated)"
                          id="custom-concept-aliases"
                          className="form-input"
                        />
                      </div>
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Category (e.g., Cell Biology)"
                          id="custom-concept-category"
                          className="form-input"
                        />
                        <select
                          id="custom-concept-importance"
                          className="form-input"
                        >
                          <option value="core">Core Concept</option>
                          <option value="supporting">Supporting</option>
                          <option value="detail">Detail</option>
                        </select>
                      </div>
                      <button
                        className="btn-add-concept"
                        onClick={() => {
                          const nameEl = document.getElementById(
                            "custom-concept-name"
                          ) as HTMLInputElement;
                          const aliasesEl = document.getElementById(
                            "custom-concept-aliases"
                          ) as HTMLInputElement;
                          const categoryEl = document.getElementById(
                            "custom-concept-category"
                          ) as HTMLInputElement;
                          const importanceEl = document.getElementById(
                            "custom-concept-importance"
                          ) as HTMLSelectElement;

                          const name = nameEl?.value.trim();
                          if (!name) {
                            alert("Please enter a concept name");
                            return;
                          }

                          const newConcept: ConceptDefinition = {
                            name,
                            aliases: aliasesEl?.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                            category: categoryEl?.value.trim() || "Custom",
                            importance: (importanceEl?.value ||
                              "supporting") as "core" | "supporting" | "detail",
                          };

                          setCustomConcepts([...customConcepts, newConcept]);

                          // Clear form
                          if (nameEl) nameEl.value = "";
                          if (aliasesEl) aliasesEl.value = "";
                          if (categoryEl) categoryEl.value = "";
                        }}
                      >
                        ➕ Add Concept
                      </button>

                      {customConcepts.length > 0 && (
                        <div className="custom-concepts-list">
                          <h4>Added Concepts:</h4>
                          {customConcepts.map((concept, idx) => (
                            <div key={idx} className="custom-concept-item">
                              <span className="concept-name">
                                {concept.name}
                              </span>
                              <span className="concept-category">
                                {concept.category}
                              </span>
                              <button
                                className="btn-remove"
                                onClick={() => {
                                  setCustomConcepts(
                                    customConcepts.filter((_, i) => i !== idx)
                                  );
                                }}
                                title="Remove concept"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>
        </div>
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
          opacity: 0.85;
          color: white;
        }

        .app-container {
          max-width: 1800px;
          margin: 0 auto;
          padding: 0 20px 40px;
        }

        .unified-layout {
          display: grid;
          grid-template-columns: 900px 1fr;
          gap: 24px;
          align-items: stretch;
        }

        /* LEFT PANEL: PDF Viewer */
        .pdf-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .pdf-panel h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
          color: #1e293b;
          flex-shrink: 0;
        }

        .pdf-viewer-container {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        .pdf-placeholder {
          flex: 1;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          background: #f8fafc;
        }

        .placeholder-content {
          text-align: center;
          color: #64748b;
        }

        .placeholder-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .placeholder-content p {
          margin: 8px 0;
          font-size: 16px;
        }

        .placeholder-hint {
          font-size: 14px;
          color: #94a3b8;
        }

        /* Arrow pointing from PDF placeholder to Analyze button */
        .analyze-arrow-pointer {
          position: absolute;
          right: -120px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          animation: bounceRight 1.5s ease-in-out infinite;
          z-index: 100;
        }

        .arrow-curve {
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6 0%, #0ea5e9 100%);
          position: relative;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
        }

        .arrow-curve::after {
          content: '➤';
          position: absolute;
          right: -8px;
          top: -9px;
          font-size: 20px;
          color: #0ea5e9;
          text-shadow: 0 0 10px rgba(14, 165, 233, 0.6);
        }

        .arrow-text {
          font-size: 13px;
          font-weight: 700;
          color: #0ea5e9;
          white-space: nowrap;
          background: rgba(14, 165, 233, 0.1);
          padding: 4px 10px;
          border-radius: 6px;
          border: 2px solid #0ea5e9;
          box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
        }

        @keyframes bounceRight {
          0%, 100% {
            transform: translateY(-50%) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-50%) translateX(12px);
            opacity: 0.8;
          }
        }

        @media (max-width: 1400px) {
          .analyze-arrow-pointer {
            display: none; /* Hide arrow on smaller screens */
          }
        }

        /* RIGHT PANEL: Controls & Analysis */
        .control-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 0;
          overflow-x: hidden;
        }

        /* How It Works Section - Collapsible */
        .how-it-works-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .how-it-works-section details {
          cursor: pointer;
        }

        .how-it-works-section details[open] .toggle-icon {
          transform: rotate(180deg);
        }

        .how-it-works-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          user-select: none;
          transition: background 0.2s;
        }

        .how-it-works-header:hover {
          background: linear-gradient(135deg, #e0e7ff 0%, #d0d9ff 100%);
        }

        .toggle-icon {
          transition: transform 0.3s ease;
          color: #667eea;
          font-size: 14px;
        }

        .how-it-works-content {
          padding: 20px 24px;
          background: white;
        }

        .how-it-works-intro {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .principles-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .principles-list li {
          margin: 12px 0;
          padding-left: 20px;
          position: relative;
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
        }

        .principles-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
        }

        .principles-list strong {
          color: #1e293b;
        }

        .control-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          min-width: 0;
          position: sticky;
          top: 20px;
          max-height: calc(100vh - 60px);
          overflow-y: auto;
        }

        .control-section h2 {
          margin: 0 0 16px 0;
          font-size: 22px;
          color: #1e293b;
        }

        .domain-selector {
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .domain-selector label {
          display: block;
          margin-bottom: 8px;
          color: #1e293b;
          font-size: 14px;
        }

        .domain-dropdown {
          width: 100%;
          padding: 10px 14px;
          font-size: 16px;
          border: 2px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 12px;
        }

        .domain-dropdown:hover:not(:disabled) {
          border-color: var(--brand-navy-600);
        }

        .domain-dropdown:focus {
          outline: none;
          border-color: var(--brand-navy-600);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .domain-dropdown:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-label span {
          font-size: 14px;
          color: #475569;
        }

        /* Custom Concepts Section */
        .custom-concepts-section {
          margin-top: 16px;
          border-top: 2px solid #e2e8f0;
          padding-top: 16px;
        }

        /* Custom Concepts After Analysis - Separate styling */
        .custom-concepts-after-analysis {
          margin: 30px 0;
          padding: 20px;
          background: white;
          border: 2px solid #e0e7ff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .custom-concepts-after-analysis .custom-concepts-header {
          background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
          padding: 16px;
          font-size: 16px;
        }

        .custom-concepts-after-analysis .custom-concepts-header:hover {
          background: linear-gradient(135deg, #e0e7ff 0%, #d0d9ff 100%);
        }

        .custom-concepts-header {
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f1f5f9;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .custom-concepts-header:hover {
          background: #e2e8f0;
        }

        .custom-count {
          font-size: 12px;
          color: #64748b;
          font-weight: normal;
        }

        .custom-concepts-form {
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          margin-top: 12px;
        }

        .form-hint {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
        }

        .form-input {
          padding: 8px 12px;
          font-size: 14px;
          border: 2px solid #cbd5e1;
          border-radius: 6px;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--brand-navy-600);
        }

        .btn-add-concept {
          width: 100%;
          padding: 10px;
          background: var(--brand-navy-600);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .btn-add-concept:hover {
          background: var(--brand-navy-700);
          transform: translateY(-1px);
        }

        .custom-concepts-list {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .custom-concepts-list h4 {
          font-size: 13px;
          color: #475569;
          margin-bottom: 8px;
        }

        .custom-concept-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          margin-bottom: 6px;
        }

        .concept-name {
          font-weight: 600;
          color: #1e293b;
          flex: 1;
        }

        .concept-category {
          font-size: 12px;
          color: #64748b;
          padding: 2px 8px;
          background: #f1f5f9;
          border-radius: 4px;
        }

        .btn-remove {
          width: 24px;
          height: 24px;
          padding: 0;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 4px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .btn-remove:hover {
          background: #fecaca;
          transform: scale(1.1);
        }

        .analysis-results {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          min-width: 0;
          overflow-x: hidden;
        }

        /* Responsive: Stack on smaller screens */
        @media (max-width: 1400px) {
          .unified-layout {
            grid-template-columns: 1fr;
          }
          .pdf-panel {
            position: relative;
            top: 0;
            max-height: 600px;
          }
        }

        .control-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
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

        /* Attention-grabbing pulse animation for Analyze button */
        .attention-pulse {
          animation: attentionPulse 2s ease-in-out infinite;
          position: relative;
        }

        .attention-pulse::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: linear-gradient(135deg, var(--brand-navy-600), #3b82f6);
          border-radius: 8px;
          opacity: 0;
          animation: attentionGlow 2s ease-in-out infinite;
          z-index: -1;
        }

        @keyframes attentionPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 2px 5px rgba(102, 126, 234, 0.2);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5),
                        0 0 30px rgba(59, 130, 246, 0.3);
          }
        }

        @keyframes attentionGlow {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.6;
            filter: blur(10px);
          }
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

        .progress-indicator {
          margin: 15px 0;
          padding: 15px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb !important;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2563eb, #06b6d4) !important;
          border-radius: 4px;
          transition: width 0.3s ease;
          min-width: 20px;
        }

        .progress-text {
          font-size: 14px;
          color: #495057;
          text-align: center;
          font-weight: 500;
        }

        .slow-pdf-warning {
          margin-top: 10px;
          padding: 10px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          color: #856404;
          font-size: 13px;
          text-align: left;
        }

        .slow-analysis-warning {
          margin-top: 10px;
          padding: 10px;
          background: #e3f2fd;
          border: 1px solid #90caf9;
          border-radius: 4px;
          color: #1565c0;
          font-size: 13px;
          text-align: left;
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

        @media (max-width: 768px) {
          .app-header h1 {
            font-size: 32px;
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

        /* Loading indicator below collapsed section */
        .analysis-loading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px;
          margin: 24px 0;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px solid var(--brand-accent);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
        }

        .loading-spinner-large {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(14, 165, 233, 0.2);
          border-top-color: #0ea5e9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .loading-text {
          font-size: 16px;
          font-weight: 500;
          color: var(--brand-navy-700);
          animation: pulse-opacity 2s ease-in-out infinite;
        }

        @keyframes pulse-opacity {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Remove Table of Contents patterns from text
 * Filters out lines that look like TOC entries (dots, page numbers)
 */
function filterOutTOC(text: string): string {
  const lines = text.split("\n");
  const filtered: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip TOC-like patterns:
    // 1. Lines with lots of dots/periods followed by numbers (Chapter 1 ........... 5)
    // 2. Very short lines (< 30 chars) ending with page numbers
    // 3. Lines with multiple page number patterns (1.1, 1.2, 1.3)
    const hasDotLeader = /\.{3,}/.test(trimmed) && /\d+\s*$/.test(trimmed);
    const shortWithPageNum =
      trimmed.length < 30 && /^\S.*\s+\d+\s*$/.test(trimmed);
    const multipleNumberedItems =
      (trimmed.match(/\d+\.\d+/g) || []).length >= 3;

    if (hasDotLeader || shortWithPageNum || multipleNumberedItems) {
      // Skip this TOC line
      continue;
    }

    filtered.push(line);
  }

  return filtered.join("\n");
}

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
