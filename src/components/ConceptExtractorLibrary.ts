/**
 * Library-Based Concept Extraction Engine
 * Identifies concepts from chapter text using predefined domain-specific libraries
 */

import {
  Concept,
  ConceptMention,
  ConceptGraph,
  ConceptRelationship,
  Section,
} from "../../types";

import {
  Domain,
  ConceptLibrary,
  ConceptDefinition,
  getLibraryByDomain,
} from "../data/conceptLibraryRegistry";

// ============================================================================
// LIBRARY-BASED CONCEPT EXTRACTOR
// ============================================================================

export class ConceptExtractor {
  private domain: Domain;
  private includeCrossDomain: boolean;
  private customConcepts: ConceptDefinition[];
  private conceptLibrary: ConceptDefinition[];

  constructor(
    domain: Domain = "chemistry",
    includeCrossDomain: boolean = true,
    customConcepts: ConceptDefinition[] = []
  ) {
    this.domain = domain;
    this.includeCrossDomain = includeCrossDomain;
    this.customConcepts = customConcepts;

    // Load library concepts
    const domainLib = getLibraryByDomain(domain);
    const crossDomainLib = includeCrossDomain
      ? getLibraryByDomain("cross-domain")
      : null;

    this.conceptLibrary = [
      ...(domainLib?.concepts || []),
      ...(crossDomainLib?.concepts || []),
      ...customConcepts,
    ];

    console.log(
      `[ConceptExtractor] Initialized with ${this.conceptLibrary.length} concepts from domain: ${domain}, cross-domain: ${includeCrossDomain}, custom: ${customConcepts.length}`
    );
  }

  /**
   * Extract all concepts from chapter text using library matching
   */
  static async extractConceptsFromChapter(
    chapter: string,
    sections: Section[],
    onProgress?: (step: string, detail?: string) => void,
    domain: Domain = "chemistry",
    includeCrossDomain: boolean = true,
    customConcepts: ConceptDefinition[] = []
  ): Promise<ConceptGraph> {
    const overallStart = performance.now();
    console.log(
      "[ConceptExtractor] Starting library-based extraction, chapter length:",
      chapter.length,
      "domain:",
      domain
    );
    const extractor = new ConceptExtractor(
      domain,
      includeCrossDomain,
      customConcepts
    );

    // Phase 1: Search for library concepts in text
    onProgress?.("concept-phase-1", "Searching for known concepts");
    const phase1Start = performance.now();
    const foundConcepts = extractor.searchLibraryConcepts(chapter);
    const phase1Time = performance.now() - phase1Start;
    console.log(
      `[ConceptExtractor] Phase 1: Found ${
        foundConcepts.length
      } concepts in ${phase1Time.toFixed(2)}ms`
    );
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Phase 2: Track all mentions for each concept
    onProgress?.("concept-phase-2", "Tracking concept mentions");
    const phase2Start = performance.now();
    const conceptsWithMentions = extractor.trackMentions(
      foundConcepts,
      chapter
    );
    const phase2Time = performance.now() - phase2Start;
    console.log(
      `[ConceptExtractor] Phase 2: Tracked mentions for ${
        conceptsWithMentions.length
      } concepts in ${phase2Time.toFixed(2)}ms`
    );

    const overallTime = performance.now() - overallStart;
    console.log(
      `[ConceptExtractor] ✅ Extraction complete in ${overallTime.toFixed(
        2
      )}ms (${(overallTime / 1000).toFixed(2)}s)`
    );
    console.log(
      `[ConceptExtractor] Phase breakdown: P1=${phase1Time.toFixed(
        0
      )}ms P2=${phase2Time.toFixed(0)}ms`
    );

    // Return simple concept list with no relationships or complex hierarchies
    return {
      concepts: conceptsWithMentions,
      relationships: [], // No relationship inference
      hierarchy: {
        core: conceptsWithMentions.filter((c) => c.importance === "core"),
        supporting: conceptsWithMentions.filter(
          (c) => c.importance === "supporting"
        ),
        detail: conceptsWithMentions.filter((c) => c.importance === "detail"),
      },
      sequence: conceptsWithMentions.map((c) => c.id), // Simple ID sequence
    };
  }

  /**
   * Search for all library concepts in the text
   * OPTIMIZED: Pre-compile all regex patterns, single-pass scanning
   */
  private searchLibraryConcepts(text: string): FoundConcept[] {
    console.error("🚨🚨🚨 SEARCH LIBRARY CONCEPTS CALLED 🚨🚨🚨");
    console.log(
      `🔧 [ConceptExtractor] CODE VERSION: 2024-11-12-v4-FORCE-RELOAD - Phase 1 starting`
    );
    const startTime = performance.now();

    interface ConceptMatches {
      canonical: MentionMatch[];
      aliases: MentionMatch[];
    }

    const foundMap = new Map<ConceptDefinition, ConceptMatches>();

    const addMatch = (
      definition: ConceptDefinition,
      index: number,
      text: string,
      isAlias: boolean
    ) => {
      let entry = foundMap.get(definition);
      if (!entry) {
        entry = { canonical: [], aliases: [] };
        foundMap.set(definition, entry);
      }

      const target = isAlias ? entry.aliases : entry.canonical;

      if (isAlias) {
        // Skip alias match if canonical already recorded at this index
        if (entry.canonical.some((m) => m.index === index)) {
          return;
        }
        // Keep the longest alias for the same index
        if (
          target.some(
            (m) => m.index === index && m.text.length >= (text?.length || 0)
          )
        ) {
          return;
        }
      } else {
        // Prefer canonical matches; drop duplicate shorter ones
        const existingCanonical = target.find((m) => m.index === index);
        if (existingCanonical) {
          if (existingCanonical.text.length >= (text?.length || 0)) {
            return;
          }
          entry.canonical = entry.canonical.filter((m) => m.index !== index);
        }
        // Remove any aliases recorded at this index
        entry.aliases = entry.aliases.filter((m) => m.index !== index);
      }

      target.push({ index, text: text ?? definition.name, isAlias });
    };

    const collectMatches = (
      definition: ConceptDefinition,
      term: string,
      isAlias: boolean
    ) => {
      const trimmed = term?.trim();
      if (!trimmed) {
        return;
      }
      const regex = this.createFlexibleRegex(trimmed);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        addMatch(definition, match.index, match[0], isAlias);
      }
    };

    for (const definition of this.conceptLibrary) {
      // Always collect canonical matches first
      collectMatches(definition, definition.name, false);

      if (definition.aliases) {
        for (const alias of definition.aliases) {
          collectMatches(definition, alias, true);
        }
      }
    }

    console.log(
      `🔍 [ConceptExtractor] foundMap has ${foundMap.size} concept entries`
    );

    const found: FoundConcept[] = [];
    for (const [definition, matches] of foundMap.entries()) {
      const mentions = [...matches.canonical, ...matches.aliases].sort(
        (a, b) => a.index - b.index
      );

      if (mentions.length > 0) {
        found.push({ definition, mentions });
      }
    }

    const endTime = performance.now();
    console.log(
      `[ConceptExtractor] Phase 1 complete: Found ${
        found.length
      } concepts in ${(endTime - startTime).toFixed(2)}ms`
    );
    console.log(
      `[ConceptExtractor] Phase 1 concepts found:`,
      found.map((f) => `${f.definition.name}(${f.mentions.length})`).join(", ")
    );

    return found.sort((a, b) => b.mentions.length - a.mentions.length);
  }

  /**
   * Track all mentions for each found concept
   */
  private trackMentions(
    foundConcepts: FoundConcept[],
    text: string
  ): Concept[] {
    const validConcepts: Concept[] = [];

    // VERSION: 2024-11-12-FINAL-FORCE-RELOAD
    console.error("🚨🚨🚨 TRACK MENTIONS CALLED - VERSION FINAL 🚨🚨🚨");
    console.warn(
      `🔍 [trackMentions] Processing ${foundConcepts.length} concepts`
    );
    console.warn(
      `🔍 [trackMentions] Concept names: ${foundConcepts
        .map((fc) => fc.definition.name)
        .join(", ")}`
    );

    for (let index = 0; index < foundConcepts.length; index++) {
      const fc = foundConcepts[index];
      const validMentions: ConceptMention[] = [];

      // DEBUG: Track specific concepts
      if (fc.definition.name === "promise" || fc.definition.name === "array") {
        console.error(
          `🎯 [trackMentions] ${fc.definition.name.toUpperCase()} DETECTED! Positions: ${
            fc.mentions.length
          }`
        );
        fc.mentions.slice(0, 5).forEach((mention, idx) => {
          const pos = mention.index;
          const matchedSample = mention.text;
          const aliasTag = mention.isAlias ? " (alias)" : "";
          const contextPreview = text.substring(
            Math.max(0, pos - 50),
            Math.min(text.length, pos + matchedSample.length + 50)
          );
          // Show the actual word at this position
          console.error(`   Position ${idx + 1}: ${pos}${aliasTag}`);
          console.error(`      Matched text: "${matchedSample}"`);
          console.error(`      Context: "...${contextPreview}..."`);
        });
      }

      for (const mention of fc.mentions) {
        const pos = mention.index;
        const matchedText = mention.text;
        const canonicalMatch = this.matchCanonicalAtPosition(
          text,
          pos,
          fc.definition.name
        );
        const resolvedMatchedText = canonicalMatch || matchedText;
        const isAliasMention = mention.isAlias && !canonicalMatch;
        const context = this.extractContext(
          text,
          pos,
          resolvedMatchedText.length
        );

        // DEBUG: Track position processing
        if (fc.definition.name === "promise") {
          console.error(
            `🎯 [trackMentions] Processing promise position ${pos}, context: "${context.substring(
              0,
              50
            )}..." matched="${matchedText}"`
          );
        }

        // Skip TOC entries
        if (context.startsWith("[TOC]")) {
          if (fc.definition.name === "promise") {
            console.error(`🎯 [trackMentions] Promise skipped - TOC entry`);
          }
          continue;
        }

        // For computing domain, validate programming context
        if (this.domain === "computing") {
          if (fc.definition.name === "promise") {
            console.error(
              `🎯 [trackMentions] Promise about to validate, domain: ${this.domain}`
            );
          }
          const isValid = this.isValidProgrammingContext(
            context,
            fc.definition
          );
          console.log(
            `[FILTER CHECK] concept: "${fc.definition.name}" domain: "${this.domain}" isValid: ${isValid}`
          );
          if (!isValid) {
            console.log(
              `[FILTERED OUT] "${fc.definition.name}" at position ${pos}`
            );
            continue;
          }
        }

        validMentions.push({
          position: pos,
          matchedText: resolvedMatchedText,
          context,
          depth: "moderate" as const,
          isRevisit: false,
          associatedConcepts: [],
          isAlias: isAliasMention,
        });
      }

      // Skip concepts with no valid mentions (all were TOC)
      if (validMentions.length === 0) {
        continue;
      }

      const earliestPosition = validMentions.reduce(
        (min, mention) => Math.min(min, mention.position),
        Number.POSITIVE_INFINITY
      );

      const mentionsByPosition = validMentions
        .slice()
        .sort((a, b) => a.position - b.position);

      validConcepts.push({
        id: `concept-${validConcepts.length}`,
        name: fc.definition.name,
        definition:
          fc.definition.description ||
          `${fc.definition.category}${
            fc.definition.subcategory ? " - " + fc.definition.subcategory : ""
          }`,
        importance: fc.definition.importance || "supporting",
        firstMentionPosition:
          earliestPosition === Number.POSITIVE_INFINITY
            ? validMentions[0].position
            : earliestPosition,
        mentions: mentionsByPosition,
        relatedConcepts: fc.definition.relatedConcepts || [],
        prerequisites: [],
        applications: [],
        commonMisconceptions: [],
      });
    }

    return validConcepts;
  }

  /**
   * Extract context around a concept mention
   */
  private extractContext(
    text: string,
    position: number,
    termLength: number
  ): string {
    const contextRadius = 100;
    const start = Math.max(0, position - contextRadius);
    const end = Math.min(text.length, position + termLength + contextRadius);
    let context = text.slice(start, end);

    // Filter out TOC-like contexts (many page numbers or short lines)
    const pageNumberPattern = /\d+\s*$/; // Ends with page number
    const shortLinePattern = /^.{1,30}$/; // Very short lines typical of TOC

    if (
      pageNumberPattern.test(context.trim()) ||
      (shortLinePattern.test(context.trim()) && context.includes("........"))
    ) {
      // This looks like a TOC entry - mark as low quality
      return "[TOC] " + context.trim();
    }

    // Add ellipsis if truncated
    if (start > 0) context = "..." + context;
    if (end < text.length) context = context + "...";

    return context.trim();
  }

  private matchCanonicalAtPosition(
    text: string,
    start: number,
    canonical: string
  ): string | null {
    if (!canonical || !canonical.trim()) {
      return null;
    }

    const regex = this.createFlexibleRegex(canonical.trim());
    regex.lastIndex = start;
    const match = regex.exec(text);
    if (match && match.index === start) {
      return match[0];
    }
    return null;
  }

  /**
   * Validate if a concept mention occurs in a valid programming context
   * Used for computing domain to filter out casual English usage
   */
  private isValidProgrammingContext(
    context: string,
    definition: ConceptDefinition
  ): boolean {
    const lowerContext = context.toLowerCase();
    const conceptName = definition.name.toLowerCase();

    console.log(
      `[isValidProgrammingContext] Checking concept: "${conceptName}" context: "${context.substring(
        0,
        100
      )}..."`
    );

    // TERM-SPECIFIC VALIDATION - Check confusing terms first
    const termSpecificPatterns: Record<string, RegExp[]> = {
      promise: [
        // Must have explicit Promise API terms - be VERY strict
        /\b(async|await)\b/i,
        /\.then\s*\(/i,
        /\.catch\s*\(/i,
        /new\s+Promise\s*\(/i,
        /Promise\.resolve/i,
        /Promise\.reject/i,
        /Promise\.all/i,
      ],
      function: [
        /\bfunction\s+\w+\s*\(/i,
        /=>\s*{/i,
        /\(.*\)\s*=>/i,
        /function\s*\(/i,
        /arrow\s+function/i,
        /callback/i,
      ],
      state: [
        /\b(useState|setState|state\s+management|component\s+state)\b/i,
        /this\.state/i,
        /state\s+variable/i,
      ],
      object: [
        /\b(object|class|instance|property|method)\b/i,
        /new\s+\w+\(/i,
        /\.\w+\s*=/i,
        /\{\s*\w+:/i,
      ],
    };

    // If this concept has specific patterns, it MUST match one of them
    const patterns = termSpecificPatterns[conceptName];
    if (patterns && Array.isArray(patterns)) {
      const hasMatch = patterns.some((pattern) => pattern.test(context));
      console.log(
        `[isValidProgrammingContext] "${conceptName}" has term-specific patterns, match result: ${hasMatch}`
      );
      return hasMatch;
    }

    // Programming keywords that indicate code context
    const programmingKeywords = [
      // Control structures
      "if",
      "else",
      "else if",
      "elseif",
      "switch",
      "case",
      "default",
      "for",
      "while",
      "do",
      "break",
      "continue",
      "return",
      // Functions and OOP
      "function",
      "def",
      "method",
      "class",
      "object",
      "constructor",
      "this",
      "self",
      "super",
      "new",
      "extends",
      "implements",
      // Data structures and types
      "array",
      "list",
      "dict",
      "map",
      "set",
      "int",
      "string",
      "bool",
      "var",
      "let",
      "const",
      "type",
      "interface",
      "struct",
      // Common programming terms
      "algorithm",
      "data structure",
      "runtime",
      "complexity",
      "compile",
      "execute",
      "debug",
      "syntax",
      "semantics",
      "parameter",
      "argument",
      "pointer",
      "reference",
      "memory",
      "code",
      "program",
      "script",
      "library",
      "framework",
      // Operators and symbols often appear near programming concepts
      "==",
      "!=",
      "<=",
      ">=",
      "&&",
      "||",
      "++",
      "--",
      "=>",
      "true",
      "false",
      "null",
      "undefined",
      "none",
    ];

    // Code syntax patterns (regex, parentheses, brackets, braces)
    const codeSyntaxPatterns = [
      /\(.*\)/, // Function calls: something()
      /\[.*\]/, // Array access: array[0]
      /\{.*\}/, // Code blocks: { ... }
      /\w+\s*=\s*\w+/, // Assignments: x = 5
      /;/, // Semicolons (common in many languages)
      /\w+\.\w+/, // Dot notation: object.property
      /::/, // Scope resolution: Class::method
      /->/, // Arrow notation: pointer->field
      /=>/, // Arrow functions: () => {}
      /\$\w+/, // Variables: $var (PHP, shell)
      /@\w+/, // Decorators: @decorator (Python, Java)
    ];

    // Check for programming keywords nearby
    for (const keyword of programmingKeywords) {
      if (lowerContext.includes(keyword)) {
        return true;
      }
    }

    // Check for code syntax patterns
    for (const pattern of codeSyntaxPatterns) {
      if (pattern.test(context)) {
        return true;
      }
    }

    // Specific concept category checks
    const category = definition.category;

    // Programming Fundamentals should have strong code indicators
    if (category === "Programming Fundamentals") {
      // Look for code-like structure: indentation, multiple lines with similar patterns
      const lines = context.split("\n");
      if (lines.length > 2) {
        // Check if multiple lines start with similar indentation (code blocks)
        const indentedLines = lines.filter((line) => line.match(/^\s{2,}/));
        if (indentedLines.length >= 2) {
          return true;
        }
      }
    }

    // Data Structures and Algorithms should appear near technical discussion
    if (category === "Data Structures" || category === "Algorithms") {
      const technicalTerms = [
        "complexity",
        "time",
        "space",
        "efficiency",
        "optimization",
        "performance",
        "access",
        "search",
        "insert",
        "delete",
        "traverse",
        "operation",
        "implementation",
      ];
      for (const term of technicalTerms) {
        if (lowerContext.includes(term)) {
          return true;
        }
      }
    }

    // If no programming context found, reject this mention
    return false;
  }

  /**
   * Find which section a position belongs to (simplified)
   */
  private findSectionId(position: number, text: string): string {
    // Simple heuristic: section based on position
    const sectionIndex = Math.floor((position / text.length) * 10);
    return `section-${sectionIndex}`;
  }

  /**
   * Establish relationships between concepts based on proximity, context, and order
   * Enhanced to detect: co-occurrence, prerequisites, contrasts, and examples
   */
  private establishRelationships(
    concepts: Concept[],
    text: string
  ): ConceptRelationship[] {
    const relationships: ConceptRelationship[] = [];
    const proximityThreshold = 500; // characters
    const textLower = text.toLowerCase();

    // For each pair of concepts, check relationships
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const concept1 = concepts[i];
        const concept2 = concepts[j];

        let cooccurrences = 0;
        let prerequisiteIndicators = 0;
        let contrastIndicators = 0;
        let exampleIndicators = 0;

        // Check proximity and context of mentions
        for (const m1 of concept1.mentions) {
          for (const m2 of concept2.mentions) {
            const distance = Math.abs(m1.position - m2.position);

            if (distance < proximityThreshold) {
              cooccurrences++;

              // Extract context around both mentions to detect relationship type
              const start = Math.min(m1.position, m2.position) - 100;
              const end = Math.max(m1.position, m2.position) + 100;
              const contextText = textLower.slice(Math.max(0, start), end);

              // Detect prerequisite patterns (concept1 before concept2)
              if (m1.position < m2.position) {
                if (
                  contextText.includes("before") ||
                  contextText.includes("first") ||
                  contextText.includes("foundation") ||
                  contextText.includes("builds on") ||
                  contextText.includes("requires") ||
                  contextText.includes("prerequisite")
                ) {
                  prerequisiteIndicators++;
                }
              }

              // Detect contrast patterns
              if (
                contextText.includes("unlike") ||
                contextText.includes("whereas") ||
                contextText.includes("in contrast") ||
                contextText.includes("however") ||
                contextText.includes("but") ||
                contextText.includes("different from")
              ) {
                contrastIndicators++;
              }

              // Detect example patterns (stricter: check if source is actually mentioned as example)
              // Pattern: "X such as Y" or "Y is an example of X"
              const examplePatterns = [
                new RegExp(
                  `${concept1.name}\\s+such as\\s+${concept2.name}`,
                  "i"
                ),
                new RegExp(`${concept1.name}\\s+like\\s+${concept2.name}`, "i"),
                new RegExp(
                  `${concept1.name}\\s+\\(e\\.g\\.?,?\\s+${concept2.name}`,
                  "i"
                ),
                new RegExp(
                  `${concept2.name}\\s+is an example of\\s+${concept1.name}`,
                  "i"
                ),
                new RegExp(
                  `${concept2.name}\\s+exemplifies?\\s+${concept1.name}`,
                  "i"
                ),
              ];

              if (
                examplePatterns.some((pattern) => pattern.test(contextText))
              ) {
                exampleIndicators++;
              }
            }
          }
        }

        // Create relationships based on strongest detected pattern
        if (cooccurrences > 0) {
          // Determine relationship type based on indicators
          let relType: "prerequisite" | "related" | "contrasts" | "example" =
            "related";
          let strength = Math.min(cooccurrences / 5, 1);

          if (prerequisiteIndicators >= 2) {
            relType = "prerequisite";
            strength = Math.min(prerequisiteIndicators / 3, 1);
            relationships.push({
              source: concept1.id,
              target: concept2.id,
              type: relType,
              strength,
            });
          } else if (contrastIndicators >= 2) {
            relType = "contrasts";
            strength = Math.min(contrastIndicators / 3, 1);
            relationships.push({
              source: concept1.id,
              target: concept2.id,
              type: relType,
              strength,
            });
          } else if (exampleIndicators >= 2) {
            // Increased threshold from 1 to 2 to reduce false positives
            relType = "example";
            relationships.push({
              source: concept2.id, // Flip: concept2 is example of concept1
              target: concept1.id,
              type: relType,
              strength,
            });
          } else {
            // Default to related
            relationships.push({
              source: concept1.id,
              target: concept2.id,
              type: "related",
              strength,
            });
          }
        }
      }
    }

    return relationships;
  }

  /**
   * Populate concept prerequisites based on prerequisite relationships
   */
  private populatePrerequisites(
    concepts: Concept[],
    relationships: ConceptRelationship[]
  ): void {
    // Build a map for quick concept lookup
    const conceptMap = new Map<string, Concept>();
    for (const concept of concepts) {
      conceptMap.set(concept.id, concept);
    }

    // For each prerequisite relationship, add to target concept's prerequisites
    for (const rel of relationships) {
      if (rel.type === "prerequisite") {
        const targetConcept = conceptMap.get(rel.target);
        if (
          targetConcept &&
          !targetConcept.prerequisites.includes(rel.source)
        ) {
          targetConcept.prerequisites.push(rel.source);
        }
      }
    }
  }

  /**
   * Build concept hierarchy (core, supporting, detail)
   */
  private buildHierarchy(concepts: Concept[]) {
    return {
      core: concepts.filter((c) => c.importance === "core").map((c) => c.id),
      supporting: concepts
        .filter((c) => c.importance === "supporting")
        .map((c) => c.id),
      detail: concepts
        .filter((c) => c.importance === "detail")
        .map((c) => c.id),
    };
  }

  /**
   * Extract the sequence of concept introduction
   */
  private extractConceptSequence(concepts: Concept[]): string[] {
    return concepts
      .slice()
      .sort((a, b) => a.firstMentionPosition - b.firstMentionPosition)
      .map((c) => c.id);
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private createFlexibleRegex(term: string): RegExp {
    const normalized = term.trim();
    if (!normalized) {
      return /$^/gi; // Matches nothing
    }
    const pattern = normalized
      .split(/\s+/)
      .map((part) => this.escapeRegex(part))
      .join("[\\s\\-]+");
    return new RegExp(`\\b${pattern}\\b`, "gi");
  }

  /**
   * Build a concept graph (network visualization)
   */
  static buildConceptGraph(
    concepts: Concept[],
    relationships: ConceptRelationship[]
  ): ConceptGraph {
    return {
      concepts,
      relationships,
      hierarchy: {
        core: concepts.filter((c) => c.importance === "core"),
        supporting: concepts.filter((c) => c.importance === "supporting"),
        detail: concepts.filter((c) => c.importance === "detail"),
      },
      sequence: concepts
        .slice()
        .sort((a, b) => a.firstMentionPosition - b.firstMentionPosition)
        .map((c) => c.id),
    };
  }
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

interface FoundConcept {
  definition: ConceptDefinition;
  mentions: MentionMatch[];
}

interface MentionMatch {
  index: number;
  text: string;
  isAlias: boolean;
}

// ============================================================================
// EXPORT
// ============================================================================

export default ConceptExtractor;
