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
import { ChapterAnalysis, Section } from "@/types";
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
import AnalysisWorker from "@/workers/analysisWorker?worker";
import { buildTierOneAnalysisSummary } from "@/utils/tierOneAnalysis";
import tomeIqLogo from "@/assets/tomeiq-logo.png";

const HEADING_LENGTH_LIMIT = 120;
const MAX_FALLBACK_SECTIONS = 8;
const STICKY_HEADER_OFFSET = 140;

const countWordsQuick = (value: string): number => {
  if (!value.trim()) {
    return 0;
  }
  const matches = value.trim().match(/[A-Za-z0-9'’]+/g);
  return matches ? matches.length : 0;
};

const normalizeHeadingLabel = (
  value: string | null | undefined,
  fallback: string
): string => {
  const raw = (value || "")
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/[_*#]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!raw) {
    return fallback;
  }
  const limited = raw.slice(0, HEADING_LENGTH_LIMIT).trim();
  return /[A-Za-z0-9]/.test(limited) ? limited : fallback;
};

type SectionCandidate = {
  heading: string;
  start: number;
  contentStart: number;
  depth: number;
};

const looksLikeHeading = (
  line: string,
  prevBlank: boolean,
  nextBlank: boolean
) => {
  if (!prevBlank) return false;
  if (line.length > HEADING_LENGTH_LIMIT) return false;
  const noTerminalPunctuation = !/[.!?]$/.test(line);
  const uppercaseCount = (line.match(/[A-Z]/g) || []).length;
  const letterCount = (line.match(/[A-Za-z]/g) || []).length || 1;
  const uppercaseRatio = uppercaseCount / letterCount;
  return (
    uppercaseRatio > 0.6 ||
    (nextBlank &&
      /^[A-Z][A-Za-z0-9 ,:'\-]{3,}$/.test(line) &&
      noTerminalPunctuation)
  );
};

const buildSectionsFromCandidates = (
  text: string,
  candidates: SectionCandidate[]
): Section[] => {
  if (candidates.length === 0) {
    return [];
  }

  const normalized = [...candidates];

  if (normalized[0].start > 0) {
    normalized.unshift({
      heading: "Introduction",
      start: 0,
      contentStart: 0,
      depth: 1,
    });
  }

  const sections: Section[] = [];

  normalized.forEach((candidate, idx) => {
    const nextStart = normalized[idx + 1]?.start ?? text.length;
    const content = text.slice(candidate.contentStart, nextStart).trim();
    if (!content) {
      return;
    }

    const sectionId = sections.length + 1;
    sections.push({
      id: `section-${sectionId}`,
      heading: normalizeHeadingLabel(candidate.heading, `Section ${sectionId}`),
      content,
      startPosition: candidate.start,
      endPosition: nextStart,
      wordCount: content.split(/\s+/).filter(Boolean).length,
      conceptsIntroduced: [],
      conceptsRevisited: [],
      depth: candidate.depth,
    });
  });

  return sections;
};

const buildFallbackSections = (text: string): Section[] => {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const desiredSections = Math.max(
    1,
    Math.min(
      MAX_FALLBACK_SECTIONS,
      Math.round(trimmed.split(/\s+/).length / 350)
    )
  );
  const chunkSize = Math.max(1, Math.floor(text.length / desiredSections));
  const sections: Section[] = [];

  for (let start = 0; start < text.length; start += chunkSize) {
    const end = Math.min(text.length, start + chunkSize);
    const content = text.slice(start, end).trim();
    if (!content) continue;

    const sectionId = sections.length + 1;
    sections.push({
      id: `auto-section-${sectionId}`,
      heading: normalizeHeadingLabel(
        `Segment ${sectionId}`,
        `Segment ${sectionId}`
      ),
      content,
      startPosition: start,
      endPosition: end,
      wordCount: content.split(/\s+/).filter(Boolean).length,
      conceptsIntroduced: [],
      conceptsRevisited: [],
      depth: 1,
    });
  }

  if (sections.length === 0) {
    sections.push({
      id: "auto-section-1",
      heading: normalizeHeadingLabel("Full Chapter", "Full Chapter"),
      content: trimmed,
      startPosition: 0,
      endPosition: text.length,
      wordCount: trimmed.split(/\s+/).filter(Boolean).length,
      conceptsIntroduced: [],
      conceptsRevisited: [],
      depth: 1,
    });
  }

  return sections;
};

const deriveSectionsFromText = (rawText: string): Section[] => {
  const text = rawText.replace(/\r\n?/g, "\n");
  if (!text.trim()) return [];

  const lines = text.split("\n");
  const candidates: SectionCandidate[] = [];
  let cursor = 0;

  const pushCandidate = (
    heading: string,
    start: number,
    contentStart: number,
    depth: number
  ) => {
    candidates.push({
      heading: heading.trim() || `Section ${candidates.length + 1}`,
      start,
      contentStart: Math.min(contentStart, text.length),
      depth,
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineStart = cursor;
    const nextStart = Math.min(text.length, cursor + line.length + 1);
    const prevBlank = i === 0 || !lines[i - 1].trim();
    const nextBlank = i + 1 >= lines.length || !lines[i + 1].trim();

    let detectedHeading: string | null = null;
    let depth = 1;

    if (!trimmed) {
      cursor = nextStart;
      continue;
    }

    const markdownMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (markdownMatch) {
      depth = markdownMatch[1].length;
      detectedHeading = markdownMatch[2];
    } else {
      const numberedMatch = trimmed.match(
        /^(\d+(?:\.\d+){0,3}[).\-]?)\s+(.*)$/
      );
      if (numberedMatch) {
        depth = numberedMatch[1].split(".").length;
        detectedHeading = numberedMatch[2];
      } else if (looksLikeHeading(trimmed, prevBlank, nextBlank)) {
        detectedHeading = trimmed.replace(/[:\-]+$/, "");
      }
    }

    if (detectedHeading) {
      pushCandidate(detectedHeading, lineStart, nextStart, depth);
    }

    cursor = nextStart;
  }

  const sections = buildSectionsFromCandidates(text, candidates);
  if (sections.length > 0) {
    return sections;
  }

  return buildFallbackSections(text);
};

const scrollWindowToElement = (
  element: HTMLElement | null,
  offset: number = STICKY_HEADER_OFFSET
) => {
  if (typeof window === "undefined" || !element) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const top = rect.top + window.scrollY - offset;
  window.scrollTo({
    top: top > 0 ? top : 0,
    behavior: "smooth",
  });
};

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
    originalPlainText: string;
    isHybridDocx: boolean;
    imageCount: number;
    editorHtml?: string;
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
  const [scrollToTopSignal, setScrollToTopSignal] = useState(0);
  const [windowScrolled, setWindowScrolled] = useState(false);
  const [contentScrolled, setContentScrolled] = useState(false);

  const statisticsText =
    chapterData?.originalPlainText ??
    chapterData?.plainText ??
    chapterText ??
    "";
  const wordCount = useMemo(
    () => countWordsQuick(statisticsText),
    [statisticsText]
  );
  const charCount = statisticsText.length;

  // Ref for analysis panel
  const analysisPanelRef = useRef<HTMLDivElement>(null);
  const analysisControlsRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleWindowScroll = () => {
      setWindowScrolled(window.scrollY > 200);
    };

    handleWindowScroll();
    window.addEventListener("scroll", handleWindowScroll);
    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
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

  const handleAccessLevelChange = (level: AccessLevel) => {
    setAccessLevel(level);

    if (typeof window === "undefined") {
      return;
    }

    window.requestAnimationFrame(() => {
      if (analysisControlsRef.current) {
        analysisControlsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleDocumentScrollDepthChange = (hasScrolled: boolean) => {
    setContentScrolled(hasScrolled);
  };

  const handleBackToTop = () => {
    scrollWindowToElement(documentHeaderRef.current);

    if (analysisPanelRef.current) {
      analysisPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    analysisControlsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setScrollToTopSignal(Date.now());
  };

  const shouldShowBackToTop = windowScrolled || contentScrolled;

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
      originalPlainText: normalizedPlainText,
      isHybridDocx: hasHtmlContent,
      imageCount,
      editorHtml: hasHtmlContent ? content : undefined,
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
            ...prev,
            plainText: newText,
            editorHtml: undefined,
            isHybridDocx: false,
            html: prev.html ?? newText,
          }
        : {
            html: newText,
            plainText: newText,
            originalPlainText: newText,
            isHybridDocx: false,
            imageCount: 0,
            editorHtml: undefined,
          }
    );
  };

  const handleEditorContentChange = (content: {
    plainText: string;
    html: string;
  }) => {
    setChapterText(content.plainText);
    setChapterData((prev) =>
      prev
        ? {
            ...prev,
            plainText: content.plainText,
            editorHtml: content.html,
          }
        : {
            html: content.html,
            plainText: content.plainText,
            originalPlainText: content.plainText,
            isHybridDocx: true,
            imageCount: 0,
            editorHtml: content.html,
          }
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
      const normalizeMatchedText = (text: string | null | undefined) =>
        text ? text.replace(/\s+/g, " ").trim() : "";

      const displayText = chapterData?.plainText ?? chapterText ?? "";
      const displayTextLower = displayText.toLowerCase();

      const matchedTextRaw = normalizeMatchedText(mention.matchedText);
      const fallbackTerm = concept.name;
      const searchTerm =
        matchedTextRaw && matchedTextRaw.length > 0
          ? matchedTextRaw
          : fallbackTerm;
      const searchTermLower = searchTerm.toLowerCase();
      const canonicalLower = fallbackTerm.toLowerCase();

      const escapeRegex = (value: string) =>
        value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const buildFlexiblePattern = (termLower: string) =>
        escapeRegex(termLower).replace(/\s+/g, "\\s+");

      const matchFlexibleAtPosition = (position: number, termLower: string) => {
        if (!termLower || position < 0 || position >= displayTextLower.length) {
          return null;
        }
        const snippet = displayTextLower.slice(position);
        const regex = new RegExp(`^${buildFlexiblePattern(termLower)}`);
        const match = regex.exec(snippet);
        if (match && match[0]) {
          return { position, length: match[0].length };
        }
        return null;
      };

      const findFlexibleOccurrence = (
        termLower: string,
        occurrence: number
      ) => {
        if (!termLower || occurrence < 0) {
          return null;
        }
        const regex = new RegExp(buildFlexiblePattern(termLower), "g");
        let match: RegExpExecArray | null;
        let count = 0;
        while ((match = regex.exec(displayTextLower)) !== null) {
          if (count === occurrence) {
            return { position: match.index, length: match[0].length };
          }
          count++;
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
        return null;
      };

      const findNearestFlexible = (termLower: string, reference: number) => {
        if (!termLower) {
          return null;
        }
        const regex = new RegExp(buildFlexiblePattern(termLower), "g");
        let best: { position: number; length: number } | null = null;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(displayTextLower)) !== null) {
          const candidate = { position: match.index, length: match[0].length };
          if (
            !best ||
            Math.abs(candidate.position - reference) <
              Math.abs(best.position - reference)
          ) {
            best = candidate;
          }
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
        return best;
      };

      const getOccurrenceIndex = (termLower: string): number => {
        if (!termLower) {
          return 0;
        }
        return (
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
                  : fallbackTerm
              ).toLowerCase();

              return currentSearchWord === termLower ? count + 1 : count;
            }, 0) ?? 0
        );
      };

      const locateTerm = (
        termLower: string,
        preferredStart: number,
        occurrence: number
      ) => {
        if (!termLower) {
          return null;
        }

        const direct = matchFlexibleAtPosition(preferredStart, termLower);
        if (direct) {
          return direct;
        }

        const occurrenceMatch = findFlexibleOccurrence(termLower, occurrence);
        if (occurrenceMatch) {
          return occurrenceMatch;
        }

        return findNearestFlexible(termLower, preferredStart);
      };

      const aliasOccurrenceIndex = getOccurrenceIndex(searchTermLower);
      const canonicalOccurrenceIndex = getOccurrenceIndex(canonicalLower);

      let matchResult = locateTerm(
        searchTermLower,
        Number.isFinite(mention.position) ? (mention.position as number) : 0,
        aliasOccurrenceIndex
      );

      if (!matchResult && searchTermLower !== canonicalLower) {
        matchResult = locateTerm(
          canonicalLower,
          Number.isFinite(mention.position) ? (mention.position as number) : 0,
          canonicalOccurrenceIndex
        );
      }

      if (!matchResult) {
        console.warn(
          "⚠️ Unable to resolve concept position, skipping highlight",
          concept.name,
          "mentionIndex:",
          mentionIndex
        );
        return;
      }

      const { position: resolvedPosition, length: matchLength } = matchResult;
      const highlightText = displayText.substring(
        resolvedPosition,
        resolvedPosition + matchLength
      );
      const finalHighlightText = highlightText || searchTerm;
      const normalizedFinal =
        normalizeMatchedText(finalHighlightText).toLowerCase();
      const finalOccurrenceIndex = getOccurrenceIndex(
        normalizedFinal || canonicalLower
      );

      console.log("🎯 Setting highlightPosition to:", resolvedPosition);
      setHighlightPosition(resolvedPosition);
      setSearchWord(finalHighlightText);
      setSearchOccurrence(finalOccurrenceIndex);

      console.log(
        "📍 Jumping to position:",
        resolvedPosition,
        "for concept:",
        concept.name,
        "mention:",
        mentionIndex + 1,
        "/",
        concept.mentions.length
      );

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

      const sections = deriveSectionsFromText(textForAnalysis);
      console.log(
        `[ChapterCheckerV2] Derived ${sections.length} sections for analysis`
      );

      // Create Chapter object with plain text
      const chapter = {
        id: `chapter-${Date.now()}`,
        title: fileName || "Untitled Chapter",
        content: textForAnalysis, // Plain text
        wordCount: textForAnalysis.split(/\s+/).length,
        sections,
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
      const worker = new AnalysisWorker({ type: "module" });

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
          const details = (e.data as { details?: unknown }).details;
          if (details) {
            console.error("[Analysis Worker] error details:", details);
          }

          const fallbackMessage = (() => {
            if (typeof e.data.error === "string" && e.data.error.trim()) {
              return e.data.error;
            }

            if (details && typeof details === "object") {
              const detailRecord = details as Record<string, unknown>;
              const detailName =
                typeof detailRecord.name === "string"
                  ? detailRecord.name
                  : undefined;
              const detailMessage =
                typeof detailRecord.message === "string"
                  ? detailRecord.message
                  : undefined;

              if (detailName || detailMessage) {
                return [detailName, detailMessage]
                  .filter(Boolean)
                  .join(": ")
                  .trim();
              }
            }

            return "Analysis failed";
          })();

          setError(fallbackMessage);
          setProgress("");
          setIsAnalyzing(false);
          worker.terminate();
        }
      };

      worker.onerror = (err) => {
        console.error("Worker error event:", err);

        let detailMessage = "";
        const rawError = err.error as unknown;

        if (typeof err.message === "string" && err.message.trim()) {
          detailMessage = err.message;
        }

        if (!detailMessage) {
          if (rawError instanceof Error) {
            detailMessage = rawError.message;
            if (rawError.stack) {
              console.error("Worker error stack:", rawError.stack);
            }
          } else if (typeof rawError === "string") {
            detailMessage = rawError;
          }
        }

        const finalMessage = detailMessage?.trim()
          ? detailMessage.trim()
          : "Unknown worker error";

        setError(`Worker error: ${finalMessage}`);
        setProgress("");
        setIsAnalyzing(false);
        worker.terminate();
      };

      worker.onmessageerror = (event) => {
        console.error("Worker message error:", event);
        setError("Worker message error: Failed to decode message from worker");
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
    if (!chapterData) {
      alert("No document to export");
      return;
    }

    try {
      const { exportToDocx } = await import("@/utils/docxExport");
      const richHtmlContent =
        chapterData.editorHtml ??
        (chapterData.isHybridDocx ? chapterData.html : null) ??
        null;

      const fallbackAnalysis =
        analysis ??
        buildTierOneAnalysisSummary({
          plainText: chapterData.plainText || chapterText,
          htmlContent: richHtmlContent,
        });

      await exportToDocx({
        text: chapterText,
        html: richHtmlContent,
        fileName: fileName || "edited-chapter",
        analysis: fallbackAnalysis,
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f3f4f6",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
          padding: "16px",
          paddingBottom: 0,
          backgroundColor: "#f9fafb",
          marginBottom: 0,
        }}
      >
        <header
          role="banner"
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#667eea",
            color: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: "12px",
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

            <img
              src={tomeIqLogo}
              alt="TomeIQ"
              style={{ height: "96px", display: "block", objectFit: "contain" }}
            />
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  color: "white",
                  fontWeight: "700",
                  lineHeight: "1.2",
                }}
              >
                Tome
                <span style={{ fontStyle: "italic", fontWeight: "700" }}>
                  IQ
                </span>
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  opacity: 0.9,
                  color: "white",
                }}
              >
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
                onChange={(e) =>
                  handleAccessLevelChange(e.target.value as AccessLevel)
                }
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
      </div>

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
      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "16px",
          boxSizing: "border-box",
          gap: "16px",
          backgroundColor: "#f9fafb",
          minHeight: 0,
        }}
      >
        {/* Left: Document Column (60%) */}
        <div
          style={{
            flex: "0 0 60%",
            maxWidth: "60%",
            minWidth: "520px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div className="app-panel" style={{ padding: 0 }}>
            <div
              ref={documentHeaderRef}
              style={{
                padding: "16px",
                scrollMarginTop: "140px",
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
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      minWidth: "180px",
                    }}
                  >
                    <span>📄 {fileName}</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#4b5563",
                        fontWeight: 500,
                      }}
                    >
                      {wordCount.toLocaleString()} words &middot;{" "}
                      {charCount.toLocaleString()} characters
                    </span>
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
                      📥 Export Document
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className="app-panel"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              padding: 0,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                minHeight: 0,
              }}
            >
              {chapterData ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                  }}
                >
                  <DocumentEditor
                    key={fileName} // Force new component instance when file changes
                    initialText={
                      chapterData.originalPlainText ?? chapterData.plainText
                    }
                    htmlContent={
                      chapterData.editorHtml
                        ? chapterData.editorHtml
                        : chapterData.isHybridDocx
                        ? chapterData.html
                        : null
                    }
                    searchText={
                      chapterData.originalPlainText ?? chapterData.plainText
                    }
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
                    onContentChange={(content) => {
                      if (viewMode === "writer" && !tierFeatures.writerMode) {
                        setUpgradeFeature("Writer Mode");
                        setUpgradeTarget("professional");
                        setShowUpgradePrompt(true);
                        return;
                      }
                      if (!canEditChapter) {
                        return;
                      }
                      handleEditorContentChange(content);
                    }}
                    showSpacingIndicators={true}
                    showVisualSuggestions={true}
                    highlightPosition={highlightPosition}
                    searchWord={searchWord}
                    searchOccurrence={searchOccurrence}
                    onSave={
                      analysis && viewMode === "writer"
                        ? handleExportDocx
                        : undefined
                    }
                    readOnly={!canEditChapter}
                    scrollToTopSignal={scrollToTopSignal}
                    onScrollDepthChange={handleDocumentScrollDepthChange}
                  />
                </div>
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
          </div>
        </div>

        {/* Right: Analysis Panel (40%) */}
        <div
          className="app-panel"
          style={{
            flex: "0 0 40%",
            maxWidth: "40%",
            minWidth: "420px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!tierFeatures.fullAnalysis ? (
            <div
              ref={analysisControlsRef}
              style={{
                flex: 1,
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                justifyContent: chapterData ? "flex-start" : "center",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                Tier 1 - Document Insights
              </h2>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  color: "#4b5563",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  listStyleType: "disc",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <li>
                  <strong style={{ color: "#111827" }}>
                    Tier 1 · Document Insights
                  </strong>
                  <p style={{ margin: "4px 0" }}>
                    Upload any DOCX or OBT chapter to unlock live spacing
                    metrics and dual-coding suggestions directly inside the
                    editor. Highlights update instantly as you revise.
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "18px",
                      lineHeight: 1.6,
                      listStyleType: "circle",
                    }}
                  >
                    <li>
                      Spacing overview shows paragraph word counts and density
                      trends.
                    </li>
                    <li>
                      Dual-coding panel recommends visuals for sequences,
                      spatial descriptions, and quantitative passages.
                    </li>
                    <li>
                      Search + highlight controls jump to key concept mentions.
                    </li>
                  </ul>
                </li>

                <li>
                  <strong style={{ color: "#111827" }}>
                    Tier 2 · Full Analysis Suite
                  </strong>
                  <p style={{ margin: "4px 0" }}>
                    Run the complete 10-principle evaluator over your draft for
                    richer learning-science diagnostics.
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "18px",
                      lineHeight: 1.6,
                      listStyleType: "circle",
                    }}
                  >
                    <li>
                      Principle-by-principle scoring with severity badges and
                      supporting evidence.
                    </li>
                    <li>
                      Concept relationship graphs show coverage depth, overlap,
                      and gaps.
                    </li>
                    <li>
                      Auto-generated recommendations with rationale and
                      suggested edits.
                    </li>
                  </ul>
                </li>

                <li>
                  <strong style={{ color: "#111827" }}>
                    Tier 3 · Pro Collaboration Mode
                  </strong>
                  <p style={{ margin: "4px 0" }}>
                    Unlock writer tools and export workflows for teams
                    finalizing publish-ready chapters.
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "18px",
                      lineHeight: 1.6,
                      listStyleType: "circle",
                    }}
                  >
                    <li>
                      Real-time writer mode with tracked highlights and
                      version-safe exports.
                    </li>
                    <li>
                      Custom domain libraries plus bulk concept suggestions for
                      specialized curricula.
                    </li>
                    <li>
                      Download bundled reports (DOCX + JSON insights) for review
                      cycles.
                    </li>
                  </ul>
                </li>
              </ul>
              {!chapterData && (
                <div
                  style={{
                    fontSize: "13px",
                    color: "#1f2937",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  Upload a chapter to generate spacing summaries and dual-coding
                  insights.
                </div>
              )}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "12px",
                  borderTop: "1px solid #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <strong style={{ fontSize: "14px", color: "#111827" }}>
                  Ready for more?
                </strong>
                <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
                  Switch to Tier 2 to run the full 10-principle analyzer with
                  concept graphs, recommendations, and exportable reports.
                </p>
                <button
                  onClick={() => {
                    setUpgradeFeature("Full 10-Principle Analysis");
                    setUpgradeTarget("premium");
                    setShowUpgradePrompt(true);
                  }}
                  style={{
                    alignSelf: "flex-start",
                    padding: "10px 20px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Preview Tier 2 Features
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={analysisControlsRef}
                style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}
              >
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
                                  sortedDomains.find(
                                    (d) => d.id === selectedDomain
                                  )?.icon
                                }{" "}
                                {sortedDomains.find(
                                  (d) => d.id === selectedDomain
                                )?.label || selectedDomain}
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
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAnalyzeChapter}
                  disabled={
                    !chapterText.trim() || isAnalyzing || !selectedDomain
                  }
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
                      <strong>Dual Coding:</strong> Get AI suggestions for where
                      to add visuals, diagrams, and illustrations.
                      <br />
                      <br />
                      <span style={{ fontSize: "12px", opacity: 0.9 }}>
                        💡 Upgrade to Premium for full 10-principle analysis
                        with concept graphs, pattern recognition, and detailed
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
                    style={{
                      marginBottom: "16px",
                      display: "flex",
                      gap: "8px",
                    }}
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
                      style={{
                        padding: "20px",
                        overflow: "auto",
                        height: "100%",
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "inset 0 1px 2px rgba(15,23,42,0.05)",
                      }}
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
                        {analysis.principles
                          ?.slice(0, 5)
                          .map((principle: any) => (
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
                              <span
                                style={{ fontSize: "13px", fontWeight: "500" }}
                              >
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
                        {analysis.recommendations
                          ?.slice(0, 8)
                          .map((rec: any) => (
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
                                CONCEPT_LIBRARIES[selectedDomain]?.concepts ||
                                []
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
            </>
          )}
        </div>
      </div>

      {shouldShowBackToTop && (
        <button
          type="button"
          onClick={handleBackToTop}
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            padding: "12px 18px",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(135deg, rgba(31,41,55,0.95), rgba(55,65,81,0.95))",
            color: "white",
            fontWeight: 600,
            fontSize: "14px",
            boxShadow: "0 12px 25px rgba(15,23,42,0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 1200,
          }}
          aria-label="Back to top"
        >
          <span style={{ fontSize: "16px" }}>↑</span>
          Back to top
        </button>
      )}

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
