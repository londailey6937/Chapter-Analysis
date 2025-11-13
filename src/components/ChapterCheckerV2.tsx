/**
 * Simplified Chapter Checker - DOCX First Workflow
 * Upload DOCX/OBT → Analyze → Edit → Export
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import { DocumentUploader, UploadedDocumentPayload } from "./DocumentUploader";
import { DocumentEditor } from "./DocumentEditor";
import { ChapterAnalysisDashboard } from "./VisualizationComponents";
import { HelpModal } from "./HelpModal";
import { NavigationMenu } from "./NavigationMenu";
import { UpgradePrompt, InlineUpgradePrompt } from "./UpgradePrompt";
import { MissingConceptSuggestions } from "./MissingConceptSuggestions";
import { ChapterAnalysis } from "@/types";
import { AccessLevel, ACCESS_TIERS } from "../../types";
import {
  Domain,
  getAvailableDomains,
  CONCEPT_LIBRARIES,
} from "@/data/conceptLibraryRegistry";
import type { ConceptDefinition } from "@/data/conceptLibraryRegistry";
import {
  loadCustomDomains,
  saveCustomDomain,
  getCustomDomain,
  convertToConceptDefinitions,
} from "@/utils/customDomainStorage";

export const ChapterCheckerV2: React.FC = () => {
  // Access control state
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("free");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<
    "premium" | "professional"
  >("premium");
  const [upgradeFeature, setUpgradeFeature] = useState("");

  // Document state
  const [chapterText, setChapterText] = useState(""); // Keep for backwards compatibility
  const [chapterData, setChapterData] = useState<{
    html: string;
    plainText: string;
    isHybridDocx: boolean;
    imageCount: number;
  } | null>(null); // Single source of truth - extracted at upload
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
  const [highlightedConceptId, setHighlightedConceptId] = useState<
    string | null
  >(null);
  const [currentMentionIndex, setCurrentMentionIndex] = useState<number>(0);
  const [highlightPosition, setHighlightPosition] = useState<number | null>(
    null
  );
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [searchOccurrence, setSearchOccurrence] = useState<number>(0); // Which occurrence to find

  // Ref for analysis panel
  const analysisPanelRef = useRef<HTMLDivElement>(null);
  const documentHeaderRef = useRef<HTMLDivElement>(null);

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
          // All concepts are core, equal weighting
          const weight = 3;
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

  // Load saved custom domains on startup
  useEffect(() => {
    try {
      // Load custom domain from localStorage if user has access
      const features = ACCESS_TIERS[accessLevel];
      if (features.customDomains) {
        const savedDomains = loadCustomDomains();

        // Try to restore last used custom domain if it exists
        const lastCustomDomain = localStorage.getItem(
          "tomeiq_last_custom_domain"
        );
        if (lastCustomDomain) {
          const domain = getCustomDomain(lastCustomDomain);
          if (domain) {
            setCustomDomainName(domain.name);
            setCustomConcepts(convertToConceptDefinitions(domain));
            // Don't auto-select, just load it for availability
          }
        }
      }
    } catch (error) {
      console.error("Error loading custom domains:", error);
    }
  }, [accessLevel]);

  // Listen for jump-to-position events (from dual coding buttons, etc.)
  useEffect(() => {
    const handleJumpToPosition = (event: CustomEvent) => {
      const position = event.detail?.position;
      if (typeof position === "number") {
        setHighlightPosition(position);
      }
    };

    window.addEventListener(
      "jump-to-position" as any,
      handleJumpToPosition as any
    );

    return () => {
      window.removeEventListener(
        "jump-to-position" as any,
        handleJumpToPosition as any
      );
    };
  }, []);

  const handleDocumentLoad = (payload: UploadedDocumentPayload) => {
    const {
      content,
      plainText,
      fileName: incomingName,
      fileType,
      format,
      imageCount,
    } = payload;

    const normalizedPlainText = plainText?.trim().length
      ? plainText.trim()
      : content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/\s+/g, " ")
          .trim();

    setChapterText(normalizedPlainText);
    setFileName(incomingName);
    setFileType(fileType);
    setError(null);
    setAnalysis(null); // Clear previous analysis

    const hasHtmlContent = format === "html" && content.trim().length > 0;
    console.log(
      `📄 Stored ${
        hasHtmlContent ? "hybrid (HTML + text)" : "plain text"
      } document`
    );
    if (imageCount > 0) {
      console.log(`  📷 Embedded images: ${imageCount}`);
    }

    setChapterData({
      html: hasHtmlContent ? content : normalizedPlainText,
      plainText: normalizedPlainText,
      isHybridDocx: hasHtmlContent,
      imageCount,
    });

    const detected = detectDomain(normalizedPlainText);
    setDetectedDomain(detected);
    setSelectedDomain(detected);
  };

  const handleTextChange = (newText: string) => {
    setChapterText(newText);
    setChapterData((prev) =>
      prev
        ? {
            html: newText,
            plainText: newText,
            isHybridDocx: false,
            imageCount: 0,
          }
        : prev
    );
  };

  const handleAcceptMissingConcept = (
    concept: ConceptDefinition,
    insertionPoint: number
  ) => {
    // Scroll to and highlight the suggested insertion point
    setHighlightPosition(insertionPoint);

    // You could also insert placeholder text for the concept
    // For now, just scroll to show where it should go
    console.log(
      "💡 Suggesting to add concept:",
      concept.name,
      "at position:",
      insertionPoint
    );
  };

  const handleConceptClick = (concept: any, mentionIndex: number) => {
    console.log(
      "🎯 CONCEPT CLICKED:",
      concept.name,
      "mentionIndex:",
      mentionIndex
    );
    console.log("🎯 Concept object:", concept);

    // Set the highlighted concept and mention index
    setHighlightedConceptId(concept.id);
    setCurrentMentionIndex(mentionIndex);

    // Get the position of the mention
    const mention = concept.mentions?.[mentionIndex];
    console.log("🎯 Mention object:", mention);

    if (mention && mention.position !== undefined) {
      console.log("🎯 Setting highlightPosition to:", mention.position);
      setHighlightPosition(mention.position);
      const normalizeMatchedText = (text: string | null | undefined) =>
        text ? text.replace(/\s+/g, " ").trim() : "";

      const matchedTextRaw = normalizeMatchedText(mention.matchedText);
      const effectiveSearchWord =
        matchedTextRaw && matchedTextRaw.length > 0
          ? matchedTextRaw
          : concept.name;

      const normalizedTarget = effectiveSearchWord.toLowerCase();
      const occurrenceIndex =
        concept.mentions
          ?.slice(0, mentionIndex)
          .reduce((count: number, currentMention: any) => {
            if (!currentMention) {
              return count;
            }
            const currentMatched = normalizeMatchedText(
              currentMention.matchedText
            );
            const currentSearchWord = (
              currentMatched && currentMatched.length > 0
                ? currentMatched
                : concept.name
            ).toLowerCase();

            return currentSearchWord === normalizedTarget ? count + 1 : count;
          }, 0) ?? 0;

      setSearchWord(effectiveSearchWord);
      setSearchOccurrence(occurrenceIndex);
      console.log(
        "📍 Jumping to position:",
        mention.position,
        "for concept:",
        concept.name,
        "mention:",
        mentionIndex + 1,
        "/",
        concept.mentions.length
      );

      // DEBUG: Show first 5 positions for this concept
      console.log(
        "🔍 First 5 positions for",
        concept.name,
        ":",
        concept.mentions
          .slice(0, 5)
          .map((m: any, i: number) => `[${i}]: pos=${m.position}`)
          .join(", ")
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

    // Check access level for full analysis
    const features = ACCESS_TIERS[accessLevel];
    if (!features.fullAnalysis) {
      setUpgradeFeature("Full 10-Principle Analysis");
      setUpgradeTarget("premium");
      setShowUpgradePrompt(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress("Analyzing chapter...");

    try {
      // Use normalized chapter data - no need to re-parse
      if (!chapterData) {
        throw new Error("No chapter data loaded");
      }

      // Use PLAIN TEXT everywhere - no HTML
      const textForAnalysis = chapterData.plainText; // Plain text
      const displayText = chapterData.plainText; // Same plain text for display
      const isHybridDocx = chapterData.isHybridDocx;

      console.log("📄 Using normalized plain text for analysis");
      console.log("  Text length:", textForAnalysis.length);

      // Create Chapter object with plain text
      const chapter = {
        id: `chapter-${Date.now()}`,
        title: fileName || "Untitled Chapter",
        content: textForAnalysis, // Plain text
        wordCount: textForAnalysis.split(/\s+/).length,
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
            textForAnalysis.split(/\s+/).length / 200
          ),
          createdAt: new Date(),
          lastAnalyzed: new Date(),
        },
      };

      // Run analysis in worker (with cache-busting timestamp for dev)
      const workerUrl = new URL(
        "../workers/analysisWorker.ts",
        import.meta.url
      );
      // Force worker reload in development by adding timestamp
      workerUrl.searchParams.set("t", Date.now().toString());
      const worker = new Worker(workerUrl, { type: "module" });

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

          // DEBUG: Show first mention positions for all concepts
          const concepts = e.data.result?.conceptGraph?.concepts || [];
          console.log("🔍 === CONCEPT FIRST MENTION POSITIONS ===");
          concepts.forEach((c: any) => {
            const firstPos = c.mentions?.[0]?.position ?? "undefined";
            console.log(
              `  ${c.name}: position ${firstPos} (${
                c.mentions?.length || 0
              } total mentions)`
            );
          });
          console.log("🔍 =========================================");

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
        console.error("Worker error:", err);
        setError(`Worker error: ${err.message || "Unknown worker error"}`);
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
    setChapterData(null);
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

  const tierFeatures = ACCESS_TIERS[accessLevel];
  const canEditChapter =
    viewMode === "writer" && tierFeatures.writerMode && !isAnalyzing;

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
          <button
            onClick={() => setIsNavigationOpen(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ☰
          </button>

          <img src="/TomeIQ.png" alt="TomeIQ" style={{ height: "96px" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
              Tome
              <span style={{ fontStyle: "italic", fontWeight: "700" }}>IQ</span>
            </h1>
            <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.9 }}>
              AI-Powered Textbook Analysis
            </p>
          </div>

          {/* Access Level Selector (for demo purposes) */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.875rem", opacity: 0.9 }}>
              Demo Mode:
            </span>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
              style={{
                padding: "6px 12px",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              <option value="free" style={{ color: "#000" }}>
                Free (Spacing + Dual Coding)
              </option>
              <option value="premium" style={{ color: "#000" }}>
                Premium (Full Analysis)
              </option>
              <option value="professional" style={{ color: "#000" }}>
                Professional (Writer Mode)
              </option>
            </select>
          </div>
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
            ref={documentHeaderRef}
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

              {chapterData && !isAnalyzing && (
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

          {chapterData ? (
            <DocumentEditor
              key={fileName} // Force new component instance when file changes
              initialText={chapterData.plainText}
              htmlContent={
                chapterData.isHybridDocx && viewMode === "analysis"
                  ? chapterData.html
                  : null
              }
              searchText={chapterData.plainText}
              onTextChange={(text) => {
                if (viewMode === "writer" && !tierFeatures.writerMode) {
                  setUpgradeFeature("Writer Mode");
                  setUpgradeTarget("professional");
                  setShowUpgradePrompt(true);
                  return;
                }
                if (!canEditChapter) {
                  return;
                }
                handleTextChange(text);
              }}
              showSpacingIndicators={true}
              showVisualSuggestions={true}
              highlightPosition={highlightPosition}
              searchWord={searchWord}
              searchOccurrence={searchOccurrence}
              onSave={
                analysis && viewMode === "writer" ? handleExportDocx : undefined
              }
              readOnly={!canEditChapter}
              onBackToTop={() => {
                if (documentHeaderRef.current) {
                  documentHeaderRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
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
                        {selectedDomain === "custom" ? (
                          <>🎨 {customDomainName || "Custom Domain"}</>
                        ) : (
                          <>
                            {
                              sortedDomains.find((d) => d.id === selectedDomain)
                                ?.icon
                            }{" "}
                            {sortedDomains.find((d) => d.id === selectedDomain)
                              ?.label || selectedDomain}
                          </>
                        )}
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
                          {selectedDomain === "custom"
                            ? "✓ Custom"
                            : "✓ Auto-detected"}
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
                      <span>⚠️ Domain not detected: upload document</span>
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
                          onClick={() => {
                            // Check access level for custom domains
                            const features = ACCESS_TIERS[accessLevel];
                            if (!features.customDomains) {
                              setUpgradeFeature("Custom Domains");
                              setUpgradeTarget("premium");
                              setShowUpgradePrompt(true);
                              return;
                            }
                            setShowCustomDomainDialog(true);
                          }}
                          style={{
                            padding: "4px 12px",
                            backgroundColor: ACCESS_TIERS[accessLevel]
                              .customDomains
                              ? "#8b5cf6"
                              : "#9ca3af",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: ACCESS_TIERS[accessLevel].customDomains
                              ? "pointer"
                              : "not-allowed",
                          }}
                        >
                          Create Custom{" "}
                          {!ACCESS_TIERS[accessLevel].customDomains && "🔒"}
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
                      const value = e.target.value;

                      // Check if it's a saved custom domain
                      if (value.startsWith("custom:")) {
                        const domainName = value.substring(7); // Remove "custom:" prefix
                        const savedDomain = getCustomDomain(domainName);
                        if (savedDomain) {
                          setCustomDomainName(savedDomain.name);
                          setCustomConcepts(
                            convertToConceptDefinitions(savedDomain)
                          );
                          setSelectedDomain("custom");
                          localStorage.setItem(
                            "tomeiq_last_custom_domain",
                            savedDomain.name
                          );
                        }
                      } else {
                        setSelectedDomain(value as Domain);
                      }
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
                    {/* Show saved custom domains if user has access */}
                    {ACCESS_TIERS[accessLevel].customDomains &&
                      loadCustomDomains().length > 0 && (
                        <>
                          <option disabled>──────────</option>
                          <optgroup label="📁 Your Custom Domains">
                            {loadCustomDomains().map((domain) => (
                              <option
                                key={`custom:${domain.name}`}
                                value={`custom:${domain.name}`}
                              >
                                🎨 {domain.name}
                              </option>
                            ))}
                          </optgroup>
                        </>
                      )}
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
                      onClick={() => {
                        // Check access level for custom domains
                        const features = ACCESS_TIERS[accessLevel];
                        if (!features.customDomains) {
                          setUpgradeFeature("Custom Domains");
                          setUpgradeTarget("premium");
                          setShowUpgradePrompt(true);
                          setShowDomainSelector(false);
                          return;
                        }
                        setShowCustomDomainDialog(true);
                      }}
                      style={{
                        flex: 1,
                        padding: "6px",
                        backgroundColor: ACCESS_TIERS[accessLevel].customDomains
                          ? "#8b5cf6"
                          : "#9ca3af",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: ACCESS_TIERS[accessLevel].customDomains
                          ? "pointer"
                          : "not-allowed",
                      }}
                    >
                      Create Custom{" "}
                      {!ACCESS_TIERS[accessLevel].customDomains && "🔒"}
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

            {/* Free tier info */}
            {accessLevel === "free" && chapterText && !isAnalyzing && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "#e0f2fe",
                  borderLeft: "4px solid #3b82f6",
                  borderRadius: "6px",
                  fontSize: "13px",
                  lineHeight: "1.6",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#1e40af",
                  }}
                >
                  🎁 Free Preview Available
                </div>
                <div style={{ color: "#1e3a8a" }}>
                  <strong>Spacing Analysis:</strong> See optimal concept
                  repetition patterns for better retention.
                  <br />
                  <strong>Dual Coding:</strong> Get AI suggestions for where to
                  add visuals, diagrams, and illustrations.
                  <br />
                  <br />
                  <span style={{ fontSize: "12px", opacity: 0.9 }}>
                    💡 Upgrade to Premium for full 10-principle analysis with
                    concept graphs, pattern recognition, and detailed
                    recommendations.
                  </span>
                </div>
              </div>
            )}

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
                    // Check access for Writer Mode
                    const features = ACCESS_TIERS[accessLevel];
                    if (!features.writerMode) {
                      setUpgradeFeature("Writer Mode");
                      setUpgradeTarget("professional");
                      setShowUpgradePrompt(true);
                      return;
                    }
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
                  ✍️ Writer {!ACCESS_TIERS[accessLevel].writerMode && "👑"}
                </button>
              </div>

              <button
                onClick={handleExport}
                disabled={!ACCESS_TIERS[accessLevel].exportResults}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: ACCESS_TIERS[accessLevel].exportResults
                    ? "#8b5cf6"
                    : "#d1d5db",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: ACCESS_TIERS[accessLevel].exportResults
                    ? "pointer"
                    : "not-allowed",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                📥 Export JSON{" "}
                {!ACCESS_TIERS[accessLevel].exportResults && "🔒"}
              </button>

              {viewMode === "analysis" ? (
                <>
                  {!ACCESS_TIERS[accessLevel].fullAnalysis && (
                    <InlineUpgradePrompt
                      targetLevel="premium"
                      feature="Full Analysis - 10 Learning Principles"
                      description="Unlock comprehensive analysis with all 10 evidence-based learning principles, concept graphs, pattern recognition, and detailed recommendations."
                      onUpgrade={() => {
                        setUpgradeFeature("Full Analysis");
                        setUpgradeTarget("premium");
                        setShowUpgradePrompt(true);
                      }}
                    />
                  )}
                  {console.log(
                    "[ChapterCheckerV2] Passing accessLevel to dashboard:",
                    accessLevel
                  )}
                  <ChapterAnalysisDashboard
                    analysis={analysis}
                    concepts={analysis.conceptGraph?.concepts || []}
                    onConceptClick={handleConceptClick}
                    highlightedConceptId={highlightedConceptId}
                    currentMentionIndex={currentMentionIndex}
                    accessLevel={accessLevel}
                  />
                </>
              ) : (
                <div
                  style={{ padding: "20px", overflow: "auto", height: "100%" }}
                >
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
                          {Math.round(principle.score)}/100
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

                  {/* Missing Concepts - Professional Tier Feature */}
                  {ACCESS_TIERS[accessLevel].writerMode &&
                    selectedDomain &&
                    CONCEPT_LIBRARIES[selectedDomain] && (
                      <div style={{ marginTop: "24px" }}>
                        <MissingConceptSuggestions
                          domain={
                            getAvailableDomains().find(
                              (d) => d.id === selectedDomain
                            )?.label || selectedDomain
                          }
                          libraryConcepts={
                            CONCEPT_LIBRARIES[selectedDomain]?.concepts || []
                          }
                          identifiedConcepts={
                            analysis.conceptGraph?.concepts || []
                          }
                          chapterText={chapterText}
                          onAcceptSuggestion={handleAcceptMissingConcept}
                        />
                      </div>
                    )}
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
                    try {
                      // Save custom domain to localStorage
                      saveCustomDomain(customDomainName, customConcepts);

                      // Remember last used custom domain
                      localStorage.setItem(
                        "tomeiq_last_custom_domain",
                        customDomainName
                      );

                      setSelectedDomain("custom");
                      setShowCustomDomainDialog(false);
                      setShowDomainSelector(false);

                      // Success message
                      alert(
                        `✅ Custom domain "${customDomainName}" saved successfully!\n\n` +
                          `It will be available next time you open the app.`
                      );
                    } catch (error) {
                      console.error("Error saving custom domain:", error);
                      alert(
                        "❌ Failed to save custom domain. Please try again."
                      );
                    }
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

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <UpgradePrompt
          currentLevel={accessLevel}
          targetLevel={upgradeTarget}
          feature={upgradeFeature}
          onUpgrade={() => {
            // In production, this would redirect to payment page
            alert(`Upgrade to ${upgradeTarget} would happen here!`);
            setShowUpgradePrompt(false);
          }}
          onDismiss={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  );
};
