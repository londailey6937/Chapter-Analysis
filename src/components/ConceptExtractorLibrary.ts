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
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Phase 3: Establish relationships
    onProgress?.("concept-phase-3", "Establishing concept relationships");
    const phase3Start = performance.now();
    const relationships = extractor.establishRelationships(
      conceptsWithMentions,
      chapter
    );
    const phase3Time = performance.now() - phase3Start;
    console.log(
      `[ConceptExtractor] Phase 3: Found ${
        relationships.length
      } relationships in ${phase3Time.toFixed(2)}ms`
    );
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Phase 4: Build hierarchy
    onProgress?.("concept-phase-4", "Building concept hierarchy");
    const phase4Start = performance.now();
    const hierarchy = extractor.buildHierarchy(conceptsWithMentions);
    const phase4Time = performance.now() - phase4Start;
    console.log(
      `[ConceptExtractor] Phase 4: Hierarchy built in ${phase4Time.toFixed(
        2
      )}ms - core: ${hierarchy.core.length}, supporting: ${
        hierarchy.supporting.length
      }`
    );
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Phase 5: Extract concept sequence
    onProgress?.("concept-phase-5", "Extracting concept sequence");
    const phase5Start = performance.now();
    const sequence = extractor.extractConceptSequence(conceptsWithMentions);
    const phase5Time = performance.now() - phase5Start;
    console.log(
      `[ConceptExtractor] Phase 5: Sequence extracted (${
        sequence.length
      } items) in ${phase5Time.toFixed(2)}ms`
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
      )}ms P2=${phase2Time.toFixed(0)}ms P3=${phase3Time.toFixed(
        0
      )}ms P4=${phase4Time.toFixed(0)}ms P5=${phase5Time.toFixed(0)}ms`
    );

    return {
      concepts: conceptsWithMentions,
      relationships,
      hierarchy: {
        core: conceptsWithMentions.filter((c) => c.importance === "core"),
        supporting: conceptsWithMentions.filter(
          (c) => c.importance === "supporting"
        ),
        detail: conceptsWithMentions.filter((c) => c.importance === "detail"),
      },
      sequence: sequence,
    };
  }

  /**
   * Search for all library concepts in the text
   * OPTIMIZED: Pre-compile all regex patterns, single-pass scanning
   */
  private searchLibraryConcepts(text: string): FoundConcept[] {
    const startTime = performance.now();
    const found: FoundConcept[] = [];

    // OPTIMIZATION 1: Pre-compile all regex patterns once
    interface SearchPattern {
      regex: RegExp;
      definition: ConceptDefinition;
    }

    const patterns: SearchPattern[] = [];

    for (const libraryDef of this.conceptLibrary) {
      // Collect all search terms (name + aliases)
      const searchTerms = [libraryDef.name.toLowerCase()];
      if (libraryDef.aliases) {
        searchTerms.push(...libraryDef.aliases.map((a) => a.toLowerCase()));
      }

      // Create one pattern per unique term
      for (const term of searchTerms) {
        const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, "gi");
        patterns.push({ regex, definition: libraryDef });
      }
    }

    console.log(
      `[ConceptExtractor] Pre-compiled ${patterns.length} search patterns`
    );

    // OPTIMIZATION 2: Track found concepts by definition reference
    const foundMap = new Map<
      ConceptDefinition,
      { count: number; positions: number[] }
    >();

    // OPTIMIZATION 3: Scan text once per pattern (unavoidable for position tracking)
    for (const { regex, definition } of patterns) {
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (!foundMap.has(definition)) {
          foundMap.set(definition, { count: 0, positions: [] });
        }
        const entry = foundMap.get(definition)!;
        entry.count++;
        entry.positions.push(match.index);
      }

      // Reset regex lastIndex
      regex.lastIndex = 0;
    }

    // Convert map to array
    for (const [definition, data] of foundMap.entries()) {
      found.push({
        definition,
        count: data.count,
        positions: data.positions.sort((a, b) => a - b),
      });
    }

    const endTime = performance.now();
    console.log(
      `[ConceptExtractor] Phase 1 complete: Found ${
        found.length
      } concepts in ${(endTime - startTime).toFixed(2)}ms`
    );

    // Sort by frequency (most mentioned first)
    return found.sort((a, b) => b.count - a.count);
  }

  /**
   * Track all mentions for each found concept
   */
  private trackMentions(
    foundConcepts: FoundConcept[],
    text: string
  ): Concept[] {
    const validConcepts: Concept[] = [];

    for (let index = 0; index < foundConcepts.length; index++) {
      const fc = foundConcepts[index];
      const validMentions: ConceptMention[] = [];

      for (const pos of fc.positions) {
        const context = this.extractContext(
          text,
          pos,
          fc.definition.name.length
        );

        // Skip TOC entries
        if (context.startsWith("[TOC]")) {
          continue;
        }

        validMentions.push({
          position: pos,
          context,
          depth: "moderate" as const,
          isRevisit: false,
          associatedConcepts: [],
        });
      }

      // Skip concepts with no valid mentions (all were TOC)
      if (validMentions.length === 0) {
        continue;
      }

      validConcepts.push({
        id: `concept-${validConcepts.length}`,
        name: fc.definition.name,
        definition:
          fc.definition.description ||
          `${fc.definition.category}${
            fc.definition.subcategory ? " - " + fc.definition.subcategory : ""
          }`,
        importance: fc.definition.importance || "supporting",
        firstMentionPosition: validMentions[0].position,
        mentions: validMentions,
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

  /**
   * Find which section a position belongs to (simplified)
   */
  private findSectionId(position: number, text: string): string {
    // Simple heuristic: section based on position
    const sectionIndex = Math.floor((position / text.length) * 10);
    return `section-${sectionIndex}`;
  }

  /**
   * Establish relationships between concepts based on proximity
   */
  private establishRelationships(
    concepts: Concept[],
    text: string
  ): ConceptRelationship[] {
    const relationships: ConceptRelationship[] = [];
    const proximityThreshold = 500; // characters

    // For each pair of concepts, check if they appear close together
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const concept1 = concepts[i];
        const concept2 = concepts[j];

        let cooccurrences = 0;

        // Check proximity of mentions
        for (const m1 of concept1.mentions) {
          for (const m2 of concept2.mentions) {
            if (Math.abs(m1.position - m2.position) < proximityThreshold) {
              cooccurrences++;
            }
          }
        }

        if (cooccurrences > 0) {
          relationships.push({
            source: concept1.id,
            target: concept2.id,
            type: "related",
            strength: Math.min(cooccurrences / 5, 1), // Normalize to 0-1
          });
        }
      }
    }

    return relationships;
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
  count: number;
  positions: number[];
}

// ============================================================================
// EXPORT
// ============================================================================

export default ConceptExtractor;
