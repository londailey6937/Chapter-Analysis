/**
 * Simplified Chapter Checker - DOCX First Workflow
 * Upload DOCX/MD/TXT → Analyze → Edit → Export
 */

import React, { useState, useMemo, useRef } from "react";
import { DocumentUploader } from "./DocumentUploader";
import { DocumentEditor } from "./DocumentEditor";
import { ChapterAnalysisDashboard } from "./VisualizationComponents";
import { HelpModal } from "./HelpModal";
import { NavigationMenu } from "./NavigationMenu";
import { ChapterAnalysis } from "@/types";
import {
  Domain,
  getAvailableDomains,
  CONCEPT_LIBRARIES,
} from "@/data/conceptLibraryRegistry";
import type { ConceptDefinition } from "@/data/conceptLibraryRegistry";

export const ChapterCheckerV2: React.FC = () => {
  // Document state
  const [chapterText, setChapterText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");

  // Analysis state
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [detectedDomain, setDetectedDomain] = useState<Domain | null>(null);
  const [customConcepts, setCustomConcepts] = useState<ConceptDefinition[]>([]);
  const [customDomainName, setCustomDomainName] = useState("");
  const [showCustomDomainDialog, setShowCustomDomainDialog] = useState(false);
  const [showDomainSelector, setShowDomainSelector] = useState(false);
  const [analysis, setAnalysis] = useState<ChapterAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  // UI state
  const [viewMode, setViewMode] = useState<"analysis" | "writer">("analysis");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState<number | null>(
    null
  );

  // Ref for analysis panel
  const analysisPanelRef = useRef<HTMLDivElement>(null);

  // Detect document domain based on keywords from concept libraries
  const detectDomain = (text: string): Domain | null => {
    const lowerText = text.toLowerCase();
    const scores: Record<string, number> = {};

    // Get available domains (excluding custom and cross-domain)
    const domains = getAvailableDomains().filter(
      (d) => d.id !== "custom" && d.id !== "cross-domain"
    );

    // Score each domain based on concept matches from their libraries
    for (const domain of domains) {
      const library = CONCEPT_LIBRARIES[domain.id];
      if (!library) continue;

      let score = 0;

      // Check each concept in the library
      for (const concept of library.concepts) {
        // Check main concept name
        const conceptName = concept.name.toLowerCase();
        const regex = new RegExp(`\\b${conceptName}\\b`, "gi");
        const matches = lowerText.match(regex);
        if (matches) {
          // Core concepts are weighted more heavily
          const weight =
            concept.importance === "core"
              ? 3
              : concept.importance === "supporting"
              ? 2
              : 1;
          score += matches.length * weight;
        }

        // Check aliases
        if (concept.aliases) {
          for (const alias of concept.aliases) {
            const aliasRegex = new RegExp(`\\b${alias.toLowerCase()}\\b`, "gi");
            const aliasMatches = lowerText.match(aliasRegex);
            if (aliasMatches) {
              score += aliasMatches.length;
            }
          }
        }
      }

      scores[domain.id] = score;
    }

    // Find domain with highest score
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topDomain = sortedScores[0];

    // Require at least 5 weighted matches to suggest a domain (stricter threshold)
    if (topDomain && topDomain[1] >= 5) {
      return topDomain[0] as Domain;
    }

    return null;
  };

  // Get and sort domains alphabetically
  const sortedDomains = useMemo(() => {
    return getAvailableDomains()
      .filter((d) => d.id !== "custom" && d.id !== "cross-domain")
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const handleDocumentLoad = (text: string, name: string, type: string) => {
    setChapterText(text);
    setFileName(name);
    setFileType(type);
    setError(null);
    setAnalysis(null); // Clear previous analysis

    // Auto-detect domain
    const detected = detectDomain(text);
    setDetectedDomain(detected);
    setSelectedDomain(detected);
  };

  const handleTextChange = (newText: string) => {
    setChapterText(newText);
  };

  const handleConceptClick = (concept: any, mentionIndex: number) => {
    // Get the position of the mention
    const mention = concept.mentions?.[mentionIndex];
    if (mention && mention.position !== undefined) {
      setHighlightPosition(mention.position);
      console.log(
        "📍 Jumping to position:",
        mention.position,
        "for concept:",
        concept.name
      );
    }
  };

  const handleAnalyzeChapter = async () => {
    if (!chapterText.trim()) {
      setError("Please upload or enter chapter text");
      return;
    }

    if (chapterText.trim().split(/\s+/).length < 200) {
      setError("Chapter should be at least 200 words");
      return;
    }

    // Check if domain was detected
    if (!selectedDomain) {
      setError(
        "⚠️ Domain not detected. Please create a custom domain or add more domain-specific content to your document."
      );
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress("Analyzing chapter...");

    try {
      // Create Chapter object
      const chapter = {
        id: `chapter-${Date.now()}`,
        title: fileName || "Untitled Chapter",
        content: chapterText,
        wordCount: chapterText.split(/\s+/).length,
        sections: [],
        conceptGraph: {
          concepts: [],
          relationships: [],
          hierarchy: { core: [], supporting: [], detail: [] },
          sequence: [],
        },
        metadata: {
          readingLevel: "college",
          domain: selectedDomain,
          targetAudience: "adult learners",
          estimatedReadingTime: Math.ceil(
            chapterText.split(/\s+/).length / 200
          ),
          createdAt: new Date(),
          lastAnalyzed: new Date(),
        },
      };

      // Run analysis in worker
      const worker = new Worker(
        new URL("../workers/analysisWorker.ts", import.meta.url),
        { type: "module" }
      );

      worker.postMessage({
        chapter,
        options: {
          domain: selectedDomain,
          includeCrossDomain: false,
          customConcepts,
        },
      });

      worker.onmessage = (e) => {
        if (e.data.type === "complete") {
          setAnalysis(e.data.result);
          setProgress("");
          setIsAnalyzing(false);
          worker.terminate();
          // Scroll analysis panel to top
          setTimeout(() => {
            if (analysisPanelRef.current) {
              analysisPanelRef.current.scrollTop = 0;
            }
          }, 100);
        } else if (e.data.type === "error") {
          setError(e.data.error || "Analysis failed");
          setProgress("");
          setIsAnalyzing(false);
          worker.terminate();
        }
      };

      worker.onerror = (err) => {
        setError(`Worker error: ${err.message}`);
        setProgress("");
        setIsAnalyzing(false);
        worker.terminate();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setProgress("");
      setIsAnalyzing(false);
    }
  };
  const handleClear = () => {
    setChapterText("");
    setFileName("");
    setFileType("");
    setAnalysis(null);
    setError(null);
  };

  const handleExportDocx = async () => {
    try {
      const { exportToDocx } = await import("@/utils/docxExport");
      await exportToDocx({
        text: chapterText,
        fileName: fileName || "edited-chapter",
        analysis,
        includeHighlights: true,
      });
    } catch (err) {
      alert(
        "Error exporting DOCX: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const handleExport = () => {
    if (!analysis) return;

    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#667eea",
          color: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/TomeIQ.png" alt="TomeIQ" style={{ height: "48px" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem" }}>TomeIQ</h1>
            <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.9 }}>
              AI-Powered Textbook Analysis
            </p>
          </div>
          <button
            onClick={() => setIsNavigationOpen(true)}
            style={{
              marginLeft: "auto",
              padding: "8px 16px",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ☰ Menu
          </button>
        </div>
      </header>

      <NavigationMenu
        isOpen={isNavigationOpen}
        onClose={() => setIsNavigationOpen(false)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: Document Editor */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <DocumentUploader
                onDocumentLoad={handleDocumentLoad}
                disabled={isAnalyzing}
              />

              {fileName && (
                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                  📄 {fileName}
                </div>
              )}

              {chapterText && !isAnalyzing && (
                <>
                  <button
                    onClick={handleClear}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    🗑️ Clear
                  </button>

                  <button
                    onClick={handleExportDocx}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    📥 Export DOCX
                  </button>
                </>
              )}
            </div>
          </div>

          {chapterText ? (
            <DocumentEditor
              initialText={chapterText}
              onTextChange={handleTextChange}
              showSpacingIndicators={true}
              showVisualSuggestions={true}
              highlightPosition={highlightPosition}
              onSave={
                analysis && viewMode === "writer" ? handleExportDocx : undefined
              }
              readOnly={!analysis || viewMode === "analysis"}
            />
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ fontSize: "64px" }}>📄</div>
              <div style={{ fontSize: "18px", fontWeight: "600" }}>
                Upload a document to get started
              </div>
              <div style={{ fontSize: "14px" }}>
                Supports .docx, .md, and .txt files
              </div>
            </div>
          )}
        </div>

        {/* Right: Analysis Panel */}
        <div
          style={{
            width: "50%",
            minWidth: "600px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f9fafb",
          }}
        >
          <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "18px" }}>
              Analysis Controls
            </h2>

            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "4px",
                  color: "#6b7280",
                }}
              >
                Detected Domain:
              </label>

              {!showDomainSelector ? (
                <div
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: selectedDomain
                      ? "2px solid #10b981"
                      : "2px solid #f59e0b",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: selectedDomain ? "#f0fdf4" : "#fef3c7",
                    color: selectedDomain ? "#166534" : "#92400e",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  {selectedDomain ? (
                    <>
                      <span>
                        {
                          sortedDomains.find((d) => d.id === selectedDomain)
                            ?.icon
                        }{" "}
                        {sortedDomains.find((d) => d.id === selectedDomain)
                          ?.label || selectedDomain}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{ fontSize: "12px", fontWeight: "normal" }}
                        >
                          ✓ Auto-detected
                        </span>
                        <button
                          onClick={() => setShowDomainSelector(true)}
                          disabled={isAnalyzing}
                          style={{
                            padding: "4px 10px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "600",
                            cursor: isAnalyzing ? "not-allowed" : "pointer",
                            opacity: isAnalyzing ? 0.5 : 1,
                          }}
                        >
                          Change
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>⚠️ Domain not detected</span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => setShowDomainSelector(true)}
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Select Domain
                        </button>
                        <button
                          onClick={() => setShowCustomDomainDialog(true)}
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#8b5cf6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Create Custom
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <select
                    value={selectedDomain || ""}
                    onChange={(e) => {
                      setSelectedDomain(e.target.value as Domain);
                      setShowDomainSelector(false);
                    }}
                    disabled={isAnalyzing}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #3b82f6",
                      borderRadius: "6px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  >
                    <option value="">-- Select a domain --</option>
                    {sortedDomains.map((domain) => (
                      <option key={domain.id} value={domain.id}>
                        {domain.icon} {domain.label}
                      </option>
                    ))}
                  </select>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => setShowDomainSelector(false)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowCustomDomainDialog(true)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        backgroundColor: "#8b5cf6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Create Custom
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyzeChapter}
              disabled={!chapterText.trim() || isAnalyzing || !selectedDomain}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor:
                  chapterText.trim() && !isAnalyzing && selectedDomain
                    ? "#10b981"
                    : "#d1d5db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor:
                  chapterText.trim() && !isAnalyzing && selectedDomain
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              {isAnalyzing ? "⏳ Analyzing..." : "🔍 Analyze Chapter"}
            </button>

            {error && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {progress && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "#dbeafe",
                  color: "#1e40af",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                {progress}
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div
              ref={analysisPanelRef}
              style={{ flex: 1, overflow: "auto", padding: "16px" }}
            >
              <div
                style={{ marginBottom: "16px", display: "flex", gap: "8px" }}
              >
                <button
                  onClick={() => {
                    setViewMode("analysis");
                    setTimeout(() => {
                      if (analysisPanelRef.current) {
                        analysisPanelRef.current.scrollTop = 0;
                      }
                    }, 50);
                  }}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor:
                      viewMode === "analysis" ? "#3b82f6" : "#e5e7eb",
                    color: viewMode === "analysis" ? "white" : "#6b7280",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  📊 Analysis
                </button>
                <button
                  onClick={() => {
                    setViewMode("writer");
                    setTimeout(() => {
                      if (analysisPanelRef.current) {
                        analysisPanelRef.current.scrollTop = 0;
                      }
                    }, 50);
                  }}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor:
                      viewMode === "writer" ? "#3b82f6" : "#e5e7eb",
                    color: viewMode === "writer" ? "white" : "#6b7280",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  ✍️ Writer
                </button>
              </div>

              <button
                onClick={handleExport}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                📥 Export JSON
              </button>

              {viewMode === "analysis" ? (
                <ChapterAnalysisDashboard
                  analysis={analysis}
                  concepts={analysis.conceptGraph?.concepts || []}
                  onConceptClick={handleConceptClick}
                />
              ) : (
                <div style={{ padding: "20px", overflow: "auto" }}>
                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    ✍️ Writing Suggestions
                  </h3>

                  {/* Principle Scores */}
                  <div style={{ marginBottom: "24px" }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "12px",
                        color: "#6b7280",
                      }}
                    >
                      Learning Principles
                    </h4>
                    {analysis.principles?.slice(0, 5).map((principle: any) => (
                      <div
                        key={principle.principle}
                        style={{
                          marginBottom: "8px",
                          padding: "8px 12px",
                          backgroundColor: "#f9fafb",
                          borderRadius: "6px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: "500" }}>
                          {principle.principle
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color:
                              principle.score > 70
                                ? "#10b981"
                                : principle.score > 50
                                ? "#f59e0b"
                                : "#ef4444",
                          }}
                        >
                          {principle.score}/100
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "12px",
                        color: "#6b7280",
                      }}
                    >
                      Top Recommendations
                    </h4>
                    {analysis.recommendations?.slice(0, 8).map((rec: any) => (
                      <div
                        key={rec.id}
                        style={{
                          marginBottom: "12px",
                          padding: "12px",
                          backgroundColor: "#fff",
                          border: `2px solid ${
                            rec.priority === "high"
                              ? "#ef4444"
                              : rec.priority === "medium"
                              ? "#f59e0b"
                              : "#d1d5db"
                          }`,
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "start",
                            gap: "8px",
                            marginBottom: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "600",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor:
                                rec.priority === "high"
                                  ? "#fee2e2"
                                  : rec.priority === "medium"
                                  ? "#fef3c7"
                                  : "#f3f4f6",
                              color:
                                rec.priority === "high"
                                  ? "#991b1b"
                                  : rec.priority === "medium"
                                  ? "#92400e"
                                  : "#6b7280",
                              textTransform: "uppercase",
                            }}
                          >
                            {rec.priority}
                          </span>
                          <h5
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              fontWeight: "600",
                              flex: 1,
                            }}
                          >
                            {rec.title}
                          </h5>
                        </div>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "12px",
                            color: "#6b7280",
                            lineHeight: "1.5",
                          }}
                        >
                          {rec.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Domain Dialog */}
      {showCustomDomainDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCustomDomainDialog(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "600px",
              width: "90%",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              🎨 Create Custom Domain
            </h3>
            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              Create a custom domain for documents that don't fit existing
              categories. You can add specific concepts relevant to your field
              of study.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#374151",
                }}
              >
                Domain Name:
              </label>
              <input
                type="text"
                value={customDomainName}
                onChange={(e) => setCustomDomainName(e.target.value)}
                placeholder="e.g., Music Theory, Architecture, Law"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#374151",
                }}
              >
                Key Concepts (optional):
              </label>
              <textarea
                placeholder="Enter key concepts, one per line..."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  outline: "none",
                  resize: "vertical",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              />
              <div
                style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}
              >
                💡 You can add concepts now or after creating the domain
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setShowCustomDomainDialog(false);
                  setCustomDomainName("");
                }}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customDomainName.trim()) {
                    setSelectedDomain("custom");
                    setShowCustomDomainDialog(false);
                    setShowDomainSelector(false);
                    // TODO: Save custom domain and concepts
                    alert(
                      `Custom domain "${customDomainName}" created! (Feature in development)`
                    );
                    setCustomDomainName("");
                  }
                }}
                disabled={!customDomainName.trim()}
                style={{
                  padding: "10px 24px",
                  backgroundColor: customDomainName.trim()
                    ? "#10b981"
                    : "#d1d5db",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: customDomainName.trim() ? "pointer" : "not-allowed",
                }}
              >
                Create Domain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
