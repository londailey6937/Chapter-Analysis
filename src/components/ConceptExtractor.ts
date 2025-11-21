/**
 * Concept Extraction Engine
 * Identifies key concepts from chapter text using domain-specific libraries
 * - Library-based matching for chemistry, literature, physics, etc.
 * - Cross-domain concept frameworks (logic, systems, methodology)
 * - Custom user-added concepts
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
  private conceptLibrary: Map<string, ConceptDefinition>;

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

    // Convert to Map for efficient lookups
    const allConcepts = [
      ...(domainLib?.concepts || []),
      ...(crossDomainLib?.concepts || []),
      ...customConcepts,
    ];

    this.conceptLibrary = new Map();
    for (const concept of allConcepts) {
      const key = concept.name.toLowerCase();
      this.conceptLibrary.set(key, concept);
      // Also add aliases
      if (concept.aliases) {
        for (const alias of concept.aliases) {
          this.conceptLibrary.set(alias.toLowerCase(), concept);
        }
      }
    }
  }

  // Comprehensive stopword list - common English words that aren't domain concepts
  private commonWords = new Set([
    // Articles, determiners
    "the",
    "a",
    "an",
    "this",
    "that",
    "these",
    "those",
    "each",
    "every",
    "some",
    "any",
    // Conjunctions
    "and",
    "or",
    "but",
    "nor",
    "so",
    "yet",
    "for",
    // Prepositions
    "in",
    "on",
    "at",
    "to",
    "from",
    "by",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "up",
    "down",
    "out",
    "off",
    "over",
    "under",
    "near",
    "far",
    "around",
    "behind",
    "beyond",
    "within",
    "without",
    // Pronouns
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "who",
    "what",
    "which",
    "whom",
    "whose",
    "my",
    "your",
    "his",
    "her",
    "its",
    "our",
    "their",
    "mine",
    "yours",
    "theirs",
    "ours",
    "myself",
    "yourself",
    "himself",
    "herself",
    "itself",
    "ourselves",
    "themselves",
    // Verbs (common auxiliary and linking)
    "is",
    "are",
    "am",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "will",
    "would",
    "shall",
    "should",
    "may",
    "might",
    "must",
    "can",
    "could",
    "ought",
    // Common adverbs/question words
    "how",
    "when",
    "where",
    "why",
    "very",
    "too",
    "much",
    "many",
    "more",
    "most",
    "less",
    "least",
    "only",
    "just",
    "even",
    "also",
    "still",
    "already",
    "finally",
    "yet",
    "always",
    "never",
    "sometimes",
    "often",
    "usually",
    "rarely",
    "seldom",
    // Common adjectives
    "all",
    "both",
    "few",
    "other",
    "another",
    "such",
    "same",
    "own",
    "different",
    "various",
    "several",
    "certain",
    "similar",
    "particular",
    // Transitional/connective words (NOT concepts - don't group/classify)
    "instead",
    "rather",
    "otherwise",
    "moreover",
    "furthermore",
    "additionally",
    "likewise",
    "similarly",
    "conversely",
    "nonetheless",
    "nevertheless",
    "meanwhile",
    "accordingly",
    "consequently",
    "subsequently",
    "previously",
    "formerly",
    "later",
    "earlier",
    "recently",
    "ultimately",
    "eventually",
    "initially",
    "originally",
    "generally",
    "specifically",
    "particularly",
    "especially",
    "namely",
    "indeed",
    "certainly",
    "surely",
    "obviously",
    "clearly",
    "essentially",
    "basically",
    "primarily",
    "mainly",
    "mostly",
    "largely",
    "partly",
    "partially",
    // Other common words
    "not",
    "no",
    "yes",
    "there",
    "here",
    "then",
    "now",
    "well",
    "however",
    "therefore",
    "thus",
    "hence",
    "whereas",
    "although",
    "though",
    "because",
    "since",
    "if",
    "unless",
    "until",
    "while",
    "as",
    "than",
    "like",
  ]);

  /**
   * Extract all concepts from chapter text
   */
  static async extractConceptsFromChapter(
    chapter: string,
    sections: Section[],
    onProgress?: (step: string, detail?: string) => void
  ): Promise<ConceptGraph> {
    const overallStart = performance.now();
    console.log(
      "[ConceptExtractor] Starting extraction, chapter length:",
      chapter.length,
      "sections:",
      sections.length
    );
    const extractor = new ConceptExtractor();

    // Phase 1: Identify candidate concepts
    onProgress?.("concept-phase-1", "Identifying candidate concepts");
    const phase1Start = performance.now();
    const candidates = extractor.identifyCandidateConcepts(chapter, sections);
    const phase1Time = performance.now() - phase1Start;
    console.log(
      `[ConceptExtractor] Phase 1: Found ${
        candidates.length
      } candidates in ${phase1Time.toFixed(2)}ms`
    );
    await new Promise((resolve) => setTimeout(resolve, 50)); // Yield control

    // Phase 2: Score and filter candidates
    onProgress?.("concept-phase-2", "Scoring and filtering concepts");
    const phase2Start = performance.now();
    const scored = extractor.scoreAndFilterCandidates(candidates, chapter);
    const phase2Time = performance.now() - phase2Start;
    console.log(
      `[ConceptExtractor] Phase 2: Scored ${
        scored.length
      } concepts in ${phase2Time.toFixed(2)}ms`
    );
    await new Promise((resolve) => setTimeout(resolve, 50)); // Yield control

    // Phase 3: Create concept objects with mentions
    onProgress?.("concept-phase-3", "Creating concept objects");
    const phase3Start = performance.now();
    const concepts = extractor.createConceptObjects(scored, chapter);
    const phase3Time = performance.now() - phase3Start;
    console.log(
      `[ConceptExtractor] Phase 3: Created ${
        concepts.length
      } concept objects in ${phase3Time.toFixed(2)}ms`
    );
    await new Promise((resolve) => setTimeout(resolve, 50)); // Yield control

    // Phase 4: Establish relationships
    onProgress?.("concept-phase-4", "Establishing concept relationships");
    const phase4Start = performance.now();
    const relationships = extractor.establishRelationships(concepts, chapter);
    const phase4Time = performance.now() - phase4Start;
    console.log(
      `[ConceptExtractor] Phase 4: Found ${
        relationships.length
      } relationships in ${phase4Time.toFixed(2)}ms`
    );
    await new Promise((resolve) => setTimeout(resolve, 50)); // Yield control

    // Phase 5: Build hierarchy
    onProgress?.("concept-phase-5", "Building concept hierarchy");
    const phase5Start = performance.now();
    const hierarchy = extractor.buildHierarchy(concepts);
    const phase5Time = performance.now() - phase5Start;
    console.log(
      `[ConceptExtractor] Phase 5: Hierarchy built in ${phase5Time.toFixed(
        2
      )}ms - core: ${hierarchy.core.length}, supporting: ${
        hierarchy.supporting.length
      }`
    );
    await new Promise((resolve) => setTimeout(resolve, 50)); // Yield control

    // Phase 6: Extract concept sequence
    onProgress?.("concept-phase-6", "Extracting concept sequence");
    const phase6Start = performance.now();
    const sequence = extractor.extractConceptSequence(concepts);
    const phase6Time = performance.now() - phase6Start;
    console.log(
      `[ConceptExtractor] Phase 6: Sequence extracted (${
        sequence.length
      } items) in ${phase6Time.toFixed(2)}ms`
    );
    await new Promise((resolve) => setTimeout(resolve, 50)); // Yield control

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
      )}ms P4=${phase4Time.toFixed(0)}ms P5=${phase5Time.toFixed(
        0
      )}ms P6=${phase6Time.toFixed(0)}ms`
    );

    return {
      concepts,
      relationships,
      hierarchy,
      sequence,
    };
  }

  /**
   * Phase 1: Identify candidate concepts from text patterns
   *
   * NEW APPROACH: Prioritize concepts from the chemistry concept library
   */
  private identifyCandidateConcepts(
    text: string,
    sections: Section[]
  ): ConceptCandidate[] {
    const candidates: Map<string, ConceptCandidate> = new Map();

    // STEP 1: Scan for library concepts throughout the text
    this.extractLibraryConcepts(text, candidates);

    // STEP 2: Extract from section headings (high importance)
    sections.forEach((section) => {
      const headingTerms = this.extractTerms(section.heading);
      headingTerms.forEach((term) => {
        // Allow heading-derived concepts if they pass generic filters
        if (this.isValidConcept(term.normalized)) {
          const existing = candidates.get(term.normalized) || {
            term: term.original,
            normalized: term.normalized,
            frequency: 0,
            fromHeading: 0,
            inlineDefinitions: [],
            positions: [],
            sentenceContexts: [],
            isLibraryConcept: this.conceptLibrary.has(term.normalized),
          };
          existing.frequency++;
          existing.fromHeading++;
          candidates.set(term.normalized, existing);
        }
      });
    });

    // STEP 2b: Add frequent n-grams (bi/tri-grams) to capture domain-agnostic concepts
    this.addFrequentPhrases(text, candidates);

    // STEP 2c: Extract code-like identifiers (e.g., Object.create, toString, Map.prototype)
    this.extractCodeIdentifiers(text, candidates);

    // STEP 3: Extract from sentences with defining patterns (enhanced with educational indicators)
    const sentences = this.splitIntoSentences(text);
    sentences.forEach((sentence, _idx) => {
      const position = text.indexOf(sentence);

      // Pattern 1: "X is a/an Y" (definition & classification)
      const defPattern =
        /(\w+(?:\s+\w+){0,3})\s+is\s+(?:a|an|the)\s+([^.!?]+)/gi;
      let defMatch;
      while ((defMatch = defPattern.exec(sentence)) !== null) {
        const concept = this.normalizeText(defMatch[1]);
        const definition = defMatch[2].trim();

        // Only add if it's a known concept
        if (this.isValidConcept(concept)) {
          this.addCandidate(candidates, concept, defMatch[1], position, {
            definition,
            hasInlineDefinition: true,
            isDefinitionPattern: true,
          });
        }
      }

      // Pattern 2: "X refers to Y"
      const refPattern = /(\w+(?:\s+\w+)*)\s+refers?\s+to\s+([^.!?]+)/gi;
      let refMatch;
      while ((refMatch = refPattern.exec(sentence)) !== null) {
        const concept = this.normalizeText(refMatch[1]);
        this.addCandidate(candidates, concept, refMatch[1], position, {
          definition: refMatch[2].trim(),
          hasInlineDefinition: true,
          isDefinitionPattern: true,
        });
      }

      // Pattern 3: "X means Y" / "X can be defined as Y" (abstraction indicators)
      const meansPattern =
        /(\w+(?:\s+\w+){0,3})\s+(?:means?|can be defined as|is defined as|is characterized by)\s+([^.!?]+)/gi;
      let meansMatch;
      while ((meansMatch = meansPattern.exec(sentence)) !== null) {
        const concept = this.normalizeText(meansMatch[1]);
        if (this.isValidConcept(concept)) {
          this.addCandidate(candidates, concept, meansMatch[1], position, {
            definition: meansMatch[2].trim(),
            hasInlineDefinition: true,
            isDefinitionPattern: true,
          });
        }
      }

      // Pattern 4: Classification - "X is a type/kind/form of Y"
      const classifyPattern =
        /(\w+(?:\s+\w+){0,3})\s+is\s+(?:a|an)\s+(?:type|kind|form|example|instance|category)\s+of\s+([^.!?]+)/gi;
      let classifyMatch;
      while ((classifyMatch = classifyPattern.exec(sentence)) !== null) {
        const concept = this.normalizeText(classifyMatch[1]);
        if (this.isValidConcept(concept)) {
          this.addCandidate(candidates, concept, classifyMatch[1], position, {
            definition: `Type of ${classifyMatch[2].trim()}`,
            hasInlineDefinition: true,
            isClassification: true,
          });
        }
      }

      // Pattern 5: Process patterns - "X is the process of Y"
      const processPattern =
        /(\w+(?:\s+\w+){0,3})\s+is\s+(?:the\s+)?(?:process|method|technique|procedure)\s+(?:of|by which|in which)\s+([^.!?]+)/gi;
      let processMatch;
      while ((processMatch = processPattern.exec(sentence)) !== null) {
        const concept = this.normalizeText(processMatch[1]);
        if (this.isValidConcept(concept)) {
          this.addCandidate(candidates, concept, processMatch[1], position, {
            definition: `Process: ${processMatch[2].trim()}`,
            hasInlineDefinition: true,
            isDefinitionPattern: true,
          });
        }
      }

      // Pattern 6: Capitalized terms at sentence start or in emphasis
      const capitalPattern = /(?:^|\s)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
      let capMatch;
      while ((capMatch = capitalPattern.exec(sentence)) !== null) {
        const concept = this.normalizeText(capMatch[1]);
        if (
          !this.commonWords.has(concept) &&
          !this.isCommonNonConcept(concept)
        ) {
          this.addCandidate(candidates, concept, capMatch[1], position, {});
        }
      }

      // Pattern 4: Chemical formulas (e.g., NaCl, H₂O, CO₂)
      const chemicalPattern = /\b([A-Z][a-z]?(?:[₀-₉0-9]|[A-Z][a-z]?)*)\b/g;
      let chemMatch;
      while ((chemMatch = chemicalPattern.exec(sentence)) !== null) {
        const formula = chemMatch[1];
        // Must have at least one capital letter followed by lowercase or number
        if (/[A-Z][a-z₀-₉0-9]/.test(formula) && formula.length <= 10) {
          this.addCandidate(
            candidates,
            formula.toLowerCase(),
            formula,
            position,
            {
              isChemicalFormula: true,
            }
          );
        }
      }

      // Pattern 5: Technical multi-word terms (lowercase, near definitions)
      const technicalPattern =
        /\b([a-z]+(?:\s+[a-z]+){1,2})\s+(?:is|are|refers?|means?|involves?)\s/gi;
      let techMatch;
      while ((techMatch = technicalPattern.exec(sentence)) !== null) {
        const concept = this.normalizeText(techMatch[1]);
        if (
          !this.commonWords.has(concept) &&
          !this.isCommonNonConcept(concept)
        ) {
          this.addCandidate(candidates, concept, techMatch[1], position, {
            isTechnicalTerm: true,
          });
        }
      }

      // Add sentence context for all terms
      const terms = this.extractTerms(sentence);
      terms.forEach((term) => {
        const existing = candidates.get(term.normalized);
        if (existing) {
          existing.sentenceContexts.push(sentence.substring(0, 120));
        }
      });
    });

    return Array.from(candidates.values());
  }

  /**
   * Phase 2: Score and filter candidates
   */
  private scoreAndFilterCandidates(
    candidates: ConceptCandidate[],
    text: string
  ): ScoredCandidate[] {
    const totalWords = text.split(/\s+/).length;

    return candidates
      .map((candidate) => {
        let score = 0;

        // Factor 1: Frequency (TF-IDF style)
        const tf = candidate.frequency / totalWords;
        score += Math.min(tf * 100, 30); // Max 30 points

        // Factor 2: From heading (high signal)
        score += candidate.fromHeading * 25; // 25 points per heading appearance

        // Factor 3: Has inline definition
        if (candidate.inlineDefinitions.length > 0) {
          score += 30;
        }

        // Factor 4: Term length (longer = more specific)
        const wordCount = candidate.term.split(/\s+/).length;
        score += Math.min(wordCount * 5, 15);

        // Factor 5: Early appearance
        const firstPos = candidate.positions[0];
        if (firstPos < text.length * 0.1) {
          score += 10; // Early = more foundational
        }

        // Factor 6: Position variance (revisited = important)
        if (candidate.positions.length > 1) {
          score += Math.min(candidate.frequency * 3, 20);
        }

        // Factor 7: HUGE BONUS for library concepts (priority)
        if (candidate.isLibraryConcept) {
          score += 50; // Library concepts get massive boost
        }

        // Factor 8: Chemical formula or technical term bonus
        if (candidate.isChemicalFormula) {
          score += 20; // Chemical formulas are likely important
        }
        if (candidate.isTechnicalTerm) {
          score += 15; // Technical terms near definitions are important
        }

        // Factor 9: Educational indicator bonuses (abstraction, classification, explanatory weight)
        if (candidate.isDefinitionPattern) {
          score += 20; // Strong signal: explicit definition/explanation
        }
        if (candidate.isClassification) {
          score += 15; // Classification pattern ("is a type of")
        }
        // Reusability heuristic: multiple mentions across text spread
        if (candidate.positions.length >= 3) {
          const spread =
            Math.max(...candidate.positions) - Math.min(...candidate.positions);
          const textLength = text.length;
          if (spread > textLength * 0.3) {
            score += 10; // Concept reused across substantial portion of text
          }
        }
        // Explanatory weight: Check if concept appears in contexts with explanation keywords
        const explanatoryContexts = candidate.sentenceContexts.filter((ctx) =>
          /\b(because|therefore|thus|means?|involves?|enables?|allows?|provides?|results? in|leads to|characterized by)\b/i.test(
            ctx
          )
        ).length;
        if (explanatoryContexts >= 2) {
          score += 12; // Concept frequently explained = higher abstraction/importance
        }

        // Factor 10: Penalize very short single-word terms unless frequently mentioned or library concept
        if (
          wordCount === 1 &&
          candidate.term.length <= 4 &&
          candidate.frequency < 3 &&
          !candidate.isLibraryConcept
        ) {
          score -= 10;
        }

        // Penalize generic standalone programming nouns without structural signals
        const genericPenaltyTerms = new Set([
          "object",
          "objects",
          "property",
          "properties",
          "value",
          "values",
          "function",
          "functions",
          "method",
          "methods",
          "variable",
          "variables",
          "data",
          "type",
          "types",
        ]);
        if (
          genericPenaltyTerms.has(candidate.normalized) &&
          candidate.fromHeading === 0 &&
          candidate.inlineDefinitions.length === 0 &&
          !candidate.isLibraryConcept
        ) {
          score -= 30; // strong penalty to push below threshold
        }

        return {
          ...candidate,
          score,
          confidence: Math.min(score / 100, 1),
        };
      })
      .filter((c) => c.score > 20) // Lower threshold since library concepts get +50
      .sort((a, b) => b.score - a.score)
      .slice(0, this.dynamicConceptCap(text)); // Dynamic cap based on chapter size
  }

  /**
   * Dynamically determine the concept cap based on chapter length.
   * Rationale: Avoid overloading UI while scaling extraction for large books.
   * Heuristic: Base allowance grows sublinearly with word count to favor the most salient concepts.
   *  - Base: 180
   *  - Add: sqrt(words) * 2 (grows slowly)
   *  - Clamp: 180 .. 900 (upper bound for very large books ~ >300k words)
   */
  private dynamicConceptCap(text: string): number {
    const words = Math.max(1, text.split(/\s+/).length);
    const base = 180;
    const additional = Math.sqrt(words) * 2; // sublinear growth
    const raw = Math.round(base + additional);
    return Math.min(900, Math.max(180, raw));
  }

  /**
   * Phase 3: Create concept objects with mention tracking
   */
  private createConceptObjects(
    scored: ScoredCandidate[],
    text: string
  ): Concept[] {
    const concepts: Concept[] = [];

    scored.forEach((candidate, index) => {
      const mentions = this.findAllMentions(text, candidate.term);

      // Get library definition if available
      const libraryDef = this.conceptLibrary.get(candidate.normalized);
      const conceptName = libraryDef?.name || candidate.term;
      const conceptDefinition = libraryDef
        ? `${libraryDef.category}${
            libraryDef.subcategory ? " - " + libraryDef.subcategory : ""
          }`
        : candidate.inlineDefinitions[0] ||
          `A key concept in this material (mentioned ${mentions.length} times)`;

      const concept: Concept = {
        id: `concept-${index}`,
        name: conceptName, // Use canonical name from library
        definition: conceptDefinition,
        importance: this.determineImportance(mentions, candidate, index),
        category: libraryDef?.category, // Add category for prerequisite ordering
        firstMentionPosition: mentions[0]?.position || 0,
        mentions: mentions,
        relatedConcepts: [],
        prerequisites: [],
        applications: [],
        commonMisconceptions: [],
      };

      concepts.push(concept);
    });

    return concepts;
  }

  /**
   * Phase 4: Establish relationships between concepts
   */
  private establishRelationships(
    concepts: Concept[],
    text: string
  ): ConceptRelationship[] {
    const relationships: ConceptRelationship[] = [];

    concepts.forEach((concept, i) => {
      // Look for co-occurrence patterns
      concept.mentions.forEach((mention: ConceptMention) => {
        const context = text.substring(
          Math.max(0, mention.position - 200),
          Math.min(text.length, mention.position + 200)
        );

        // Find other concepts in same context
        concepts.forEach((other, j) => {
          if (i === j) return;

          if (context.includes(other.name)) {
            const existing = relationships.find(
              (r) => r.source === concept.id && r.target === other.id
            );

            let relationshipType:
              | "related"
              | "extends"
              | "prerequisite"
              | "contrasts"
              | "example" = "related";

            // Detect specific relationship types
            if (
              context.includes(`before ${other.name}`) ||
              context.includes(`prerequisite`) ||
              context.includes(`foundation`) ||
              context.includes(`requires ${other.name}`) ||
              context.includes(`depends on ${other.name}`) ||
              context.includes(`builds on ${other.name}`) ||
              context.includes(`assumes ${other.name}`) ||
              context.includes(`first learn ${other.name}`) ||
              context.includes(`understanding of ${other.name}`)
            ) {
              relationshipType = "prerequisite";
            } else if (
              context.includes(`example`) ||
              context.includes(`instance`)
            ) {
              relationshipType = "example";
            } else if (
              context.includes(`contrasts`) ||
              context.includes(`unlike`)
            ) {
              relationshipType = "contrasts";
            } else if (
              context.includes(`extends`) ||
              context.includes(`builds`)
            ) {
              relationshipType = "extends";
            }

            if (existing) {
              existing.strength = Math.min(existing.strength + 0.1, 1);
            } else {
              relationships.push({
                source: concept.id,
                target: other.id,
                type: relationshipType,
                strength: 0.5,
              });
            }
          }
        });
      });

      // Establish bidirectional relationships
      concepts.slice(i + 1).forEach((other) => {
        const related = relationships.find(
          (r) => r.source === concept.id && r.target === other.id
        );
        if (related && related.type === "related") {
          relationships.push({
            source: other.id,
            target: concept.id,
            type: "related",
            strength: related.strength,
          });
        }
      });
    });

    // Populate concept.prerequisites arrays from relationships
    relationships.forEach((rel) => {
      if (rel.type === "prerequisite") {
        const targetConcept = concepts.find((c) => c.id === rel.target);
        if (
          targetConcept &&
          !targetConcept.prerequisites.includes(rel.source)
        ) {
          targetConcept.prerequisites.push(rel.source);
        }
      }
    });

    return relationships;
  }

  /**
   * Phase 5: Build hierarchy (core, supporting, detail)
   */
  private buildHierarchy(concepts: Concept[]) {
    const totalConcepts = concepts.length;
    const coreCount = Math.ceil(totalConcepts * 0.2); // Top 20%
    const supportingCount = Math.ceil(totalConcepts * 0.3); // Next 30%

    const sorted = [...concepts].sort((a, b) => {
      // Sort by: frequency, position, definition quality
      const scoreA =
        a.mentions.length * 10 + (1000 - a.firstMentionPosition) * 0.01;
      const scoreB =
        b.mentions.length * 10 + (1000 - b.firstMentionPosition) * 0.01;
      return scoreB - scoreA;
    });

    // Update importance in original array
    sorted.forEach((concept, idx) => {
      if (idx < coreCount) {
        concept.importance = "core";
      } else if (idx < coreCount + supportingCount) {
        concept.importance = "supporting";
      } else {
        concept.importance = "detail";
      }
    });

    return {
      core: sorted.slice(0, coreCount),
      supporting: sorted.slice(coreCount, coreCount + supportingCount),
      detail: sorted.slice(coreCount + supportingCount),
    };
  }

  /**
   * Phase 6: Extract concept sequence (order of first mention)
   */
  private extractConceptSequence(concepts: Concept[]): string[] {
    // Defensive filter: exclude any concept whose normalized label is a stopword/common non-concept.
    // We look up the original concept objects (their 'term' is canonical; we normalize to compare).
    const filtered = concepts.filter((c) => {
      const norm = c.name?.toLowerCase() || c.id.toLowerCase();
      // Reject if matches commonWords or isCommonNonConcept
      if (this.commonWords.has(norm)) return false;
      if (this.isCommonNonConcept(norm)) return false;
      return true;
    });
    return filtered
      .sort((a, b) => a.firstMentionPosition - b.firstMentionPosition)
      .map((c) => c.id);
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  /**
   * Extract all known chemistry concepts from the library that appear in text
   */
  private extractLibraryConcepts(
    text: string,
    candidates: Map<string, ConceptCandidate>
  ): void {
    // OPTIMIZED: Build all patterns once, scan text once
    // Old: O(n * m) where n=text length, m=concept count (261+ concepts = slow!)
    // New: O(n) single pass through text

    const conceptPatterns: Array<{
      key: string;
      pattern: RegExp;
      def: ConceptDefinition;
    }> = [];

    // Pre-compile all patterns
    for (const [conceptKey, conceptDef] of this.conceptLibrary.entries()) {
      const pattern = new RegExp(`\\b${this.escapeRegex(conceptKey)}\\b`, "gi");
      conceptPatterns.push({ key: conceptKey, pattern, def: conceptDef });
    }

    // Single pass: find all matches for all concepts
    for (const { key, pattern, def } of conceptPatterns) {
      const matches: RegExpExecArray[] = [];
      let match;

      // Find all matches for this concept
      while ((match = pattern.exec(text)) !== null) {
        matches.push(match);
      }

      if (matches.length > 0) {
        const positions = matches.map((m) => m.index);

        const existing = candidates.get(key) || {
          term: def.name, // Use canonical name from library
          normalized: key,
          frequency: 0,
          fromHeading: 0,
          inlineDefinitions: [],
          positions: [],
          sentenceContexts: [],
          isLibraryConcept: true,
        };

        existing.frequency += matches.length;
        existing.positions.push(...positions);
        candidates.set(key, existing);
      }

      // Reset regex lastIndex
      pattern.lastIndex = 0;
    }
  }

  /**
   * Check if a term is a valid concept (either in library or passes strict criteria)
   */
  /**
   * Validates if a term qualifies as a concept according to the definition:
   * A concept is an abstract mental category used to group things that share
   * essential features. It functions as a general idea that organizes related
   * objects, actions, properties, or relationships under a single cognitive label.
   *
   * Key criteria:
   * • Abstraction: Distills common features from specific examples
   * • Generalization: Applies broadly across instances
   * • Discrimination: Excludes instances that don't meet defining features
   * • Function: Helps with reasoning, classification, and communication
   *
   * Examples of valid concepts: "tree" (groups oaks, maples, pines),
   * "enzyme" (groups proteins that catalyze reactions), "oxidation" (groups
   * reactions involving electron loss)
   *
   * NOT concepts: "instead", "rather", "very", "following" (these are
   * transitional/qualifying words that don't create categorical groupings)
   */
  private isValidConcept(normalized: string): boolean {
    // If it's in the chemistry library, allow (domain boost handled later)
    if (this.conceptLibrary.has(normalized)) return true;

    // Generic gating for all domains
    if (this.commonWords.has(normalized)) return false;
    if (this.isCommonNonConcept(normalized)) return false;

    // Additional heuristic filters to ensure conceptual nature

    // Reject pure adverbs (typically end in -ly and don't represent categories)
    if (
      /ly$/.test(normalized) &&
      normalized.length > 4 &&
      !this.isLikelyNounEndingInLy(normalized)
    ) {
      return false;
    }

    // Reject standalone verbs in base form (concepts should be nouns/noun phrases)
    const commonVerbs = new Set([
      "create",
      "add",
      "remove",
      "set",
      "get",
      "use",
      "make",
      "call",
      "return",
      "change",
      "move",
      "take",
      "give",
      "show",
      "tell",
      "become",
      "seem",
      "feel",
      "leave",
      "put",
      "bring",
      "begin",
      "start",
      "stop",
      "end",
      "happen",
      "occur",
      "exist",
      "appear",
      "continue",
      "follow",
      "remain",
      "stay",
      "keep",
      "hold",
    ]);
    if (commonVerbs.has(normalized) && !normalized.includes(" ")) {
      return false;
    }

    // Additional generic single-word domain-neutral nouns we usually don't treat as standalone concepts
    const genericSingleNouns = new Set([
      "object",
      "objects",
      "property",
      "properties",
      "value",
      "values",
      "function",
      "functions",
      "method",
      "methods",
      "variable",
      "variables",
      "data",
      "type",
      "types",
      "concept",
      "concepts",
      "thing",
      "things",
      "item",
      "items",
      "array",
      "arrays",
      "string",
      "strings",
      "number",
      "numbers",
      "element",
      "elements",
    ]);

    // Filter out grammatical fragments and determiners
    const fragmentPatterns = [
      /^(the|a|an|this|that|these|those)\s+/, // starts with determiner
      /\s+(the|a|an|of|to|from|in|on|at)$/, // ends with preposition/article
      /^(of|to|from|in|on|at|with|by)\s+/, // starts with preposition
      /\s+and\s+/, // contains "and" (e.g., "x and y")
      /^because\s+/i, // starts with "because"
      /^(first|second|third|fourth|fifth|last|next|previous)\s*$/i, // ordinals alone
    ];

    // Multi-word phrase validation
    if (normalized.includes(" ")) {
      // Reject if matches fragment patterns
      if (fragmentPatterns.some((pattern) => pattern.test(normalized)))
        return false;

      // Reject if it's just "verb + article + generic noun" (e.g., "create an object")
      const verbArticleNoun =
        /^(create|add|remove|set|get|use|make|call|return)\s+(a|an|the)\s+(object|property|function|method|variable|array|string)s?$/;
      if (verbArticleNoun.test(normalized)) return false;

      // Reject if all words are generic stopwords/nouns
      const words = normalized.split(/\s+/);
      const allGeneric = words.every(
        (w) => this.commonWords.has(w) || genericSingleNouns.has(w)
      );
      if (allGeneric) return false;

      // Accept phrases with at least one substantive word
      return true;
    }

    // Reject common generic nouns and verbs
    if (genericSingleNouns.has(normalized)) return false;

    // Accept single words that are at least 5 chars (more likely domain terms)
    if (normalized.length >= 5) return true;

    // Reject very short single tokens by default
    return false;
  }

  /**
   * Helper to identify nouns that happen to end in -ly (e.g., "anomaly", "rally")
   */
  private isLikelyNounEndingInLy(word: string): boolean {
    const nounsEndingInLy = new Set([
      "anomaly",
      "rally",
      "ally",
      "family",
      "assembly",
      "monopoly",
      "melancholy",
      "folly",
      "jelly",
      "belly",
    ]);
    return nounsEndingInLy.has(word);
  }

  private findAllMentions(text: string, term: string): ConceptMention[] {
    const mentions: ConceptMention[] = [];
    const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, "gi");
    let match;
    let totalMatches = 0;
    let filteredMatches = 0;

    while ((match = regex.exec(text)) !== null) {
      totalMatches++;
      const position = match.index;
      const start = Math.max(0, position - 100);
      const end = Math.min(text.length, position + 100);
      const context = text.substring(start, end);

      // Filter out non-technical usage (casual English)
      const passes = this.isTechnicalContext(term, context, text, position);
      if (passes) {
        filteredMatches++;
        mentions.push({
          position,
          context,
          depth: this.estimateMentionDepth(context),
          isRevisit: mentions.length > 0,
          associatedConcepts: [],
        });
      }
    }

    // Log filtering results for debugging
    if (term.toLowerCase() === "promise" && totalMatches > 0) {
      console.log(
        `[findAllMentions] "${term}": found ${totalMatches} matches, kept ${filteredMatches} after filtering`
      );
    }

    return mentions;
  }

  /**
   * Check if a term appears in a technical context (not casual English)
   */
  private isTechnicalContext(
    term: string,
    context: string,
    fullText: string,
    position: number
  ): boolean {
    const lowerTerm = term.toLowerCase();
    const lowerContext = context.toLowerCase();

    // Get the paragraph containing this mention
    const paragraphStart = fullText.lastIndexOf("\n\n", position);
    const paragraphEnd = fullText.indexOf("\n\n", position);
    const paragraph = fullText.substring(
      paragraphStart >= 0 ? paragraphStart : 0,
      paragraphEnd >= 0 ? paragraphEnd : fullText.length
    );

    // Special handling for commonly confused terms - CHECK FIRST before density
    const technicalPatterns: Record<string, RegExp[]> = {
      // Promise - only match in async/programming context
      promise: [
        /\b(async|await|then|catch|resolve|reject|promise)\b/i,
        /new\s+promise/i,
        /promise\s*\(/i,
        /\.then\(/i,
        /\.catch\(/i,
      ],
      // Function - only match in programming context
      function: [
        /\bfunction\s+\w+\s*\(/i,
        /=>\s*{/i,
        /\(.*\)\s*=>/i,
        /function\s*\(/i,
        /arrow\s+function/i,
        /callback/i,
      ],
      // Semantic - only match in versioning/meaning context
      semantic: [
        /semantic\s+(versioning|version|web|html|meaning)/i,
        /semver/i,
      ],
      // State - only match in programming/React context
      state: [
        /\b(useState|setState|state\s+management|component\s+state)\b/i,
        /this\.state/i,
        /state\s+variable/i,
      ],
      // Object - only match in programming context
      object: [
        /\b(object|class|instance|property|method)\b/i,
        /new\s+\w+\(/i,
        /\.\w+\s*=/i, // property assignment
        /\{\s*\w+:/i, // object literal
      ],
      // Class - only match in programming context
      class: [
        /class\s+\w+/i,
        /\bextends\b/i,
        /\bimplements\b/i,
        /constructor/i,
      ],
      // Method - only match in programming context
      method: [
        /\bmethod\s+\w+\s*\(/i,
        /\.\w+\s*\(/i,
        /class\s+method/i,
        /instance\s+method/i,
      ],
      // Variable - only match in programming context
      variable: [
        /\b(var|let|const|variable)\b/i,
        /variable\s+(declaration|assignment|name)/i,
      ],
      // Interface - only match in programming context
      interface: [
        /interface\s+\w+/i,
        /\bimplements\b/i,
        /API\s+interface/i,
        /user\s+interface/i,
      ],
    };

    // Check if this term has specific patterns - if so, MUST match pattern
    const patterns = technicalPatterns[lowerTerm];
    if (patterns) {
      // Must match at least one technical pattern for these confusing terms
      const hasPattern = patterns.some((pattern) => pattern.test(paragraph));
      console.log(
        `[Context Filter] "${term}" at position ${position}: hasPattern=${hasPattern}`
      );
      return hasPattern;
    }

    // For terms without specific patterns, use concept density as fallback
    const conceptDensity = this.countConceptsInParagraph(paragraph);
    const passes = conceptDensity >= 3;
    console.log(
      `[Context Filter] "${term}" at position ${position}: density=${conceptDensity}, passes=${passes}`
    );
    return passes;
  }

  /**
   * Count domain concepts in a paragraph to determine if it's technical
   */
  private countConceptsInParagraph(paragraph: string): number {
    let count = 0;
    const lowerParagraph = paragraph.toLowerCase();

    // Check against all concepts in library
    this.conceptLibrary.forEach((conceptDef, conceptName) => {
      const terms = [conceptName, ...(conceptDef.aliases || [])];
      for (const term of terms) {
        const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, "i");
        if (regex.test(lowerParagraph)) {
          count++;
          break; // Count each concept only once
        }
      }
    });

    return count;
  }

  private determineImportance(
    mentions: ConceptMention[],
    candidate: ScoredCandidate,
    _index: number
  ): "core" | "supporting" | "detail" {
    // Will be recalculated in buildHierarchy, but provide initial guess
    if (mentions.length > 5 || candidate.fromHeading > 0) {
      return "core";
    }
    if (mentions.length > 2) {
      return "supporting";
    }
    return "detail";
  }

  private estimateMentionDepth(
    context: string
  ): "shallow" | "moderate" | "deep" {
    // Heuristic: longer context with explanation = deeper
    const hasExplanation =
      /\b(because|therefore|thus|results? in|means?|involves?)\b/i.test(
        context
      );
    const hasExample = /\b(for example|such as|like|e\.g\.|including?)\b/i.test(
      context
    );

    if (hasExplanation && hasExample) return "deep";
    if (hasExplanation || hasExample) return "moderate";
    return "shallow";
  }

  private extractTerms(
    text: string
  ): { original: string; normalized: string }[] {
    const terms: { original: string; normalized: string }[] = [];

    // Pattern 1: Multi-word capitalized terms (e.g., "Lewis Notation", "Octet Rule")
    const capitalizedPhrasePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
    const capitalizedMatches = text.match(capitalizedPhrasePattern) || [];

    // Pattern 2: Single capitalized terms (e.g., "Sodium", "Chlorine")
    const singleCapitalPattern = /\b[A-Z][a-z]+\b/g;
    const singleMatches = text.match(singleCapitalPattern) || [];

    // Pattern 3: Technical terms (lowercase multi-word phrases near definitions)
    // e.g., "valence electrons", "covalent bonding", "electron configuration"
    const technicalPattern =
      /\b([a-z]+(?:\s+[a-z]+){1,3})\b(?=\s+(?:is|are|refers?|means?|involves?))/gi;
    const technicalMatches = text.match(technicalPattern) || [];

    // Combine and deduplicate
    const allMatches = [
      ...capitalizedMatches,
      ...singleMatches,
      ...technicalMatches,
    ];
    const seen = new Set<string>();

    for (const match of allMatches) {
      const normalized = this.normalizeText(match);

      // Skip if already seen or is a common word
      if (seen.has(normalized) || this.commonWords.has(normalized)) continue;

      // Skip single-letter terms or very short terms
      if (normalized.length <= 2) continue;

      // Skip if it's just a common word even when capitalized
      if (this.isCommonNonConcept(normalized)) continue;

      seen.add(normalized);
      terms.push({
        original: match,
        normalized: normalized,
      });
    }

    return terms;
  }

  /**
   * Check if a term is a common word that shouldn't be a concept
   * even when capitalized (e.g., "Think", "Notice", "Remember")
   *
   * Per the conceptual definition: A concept is an abstract mental category
   * used to group things that share essential features. Transitional words,
   * adverbs, and procedural verbs are NOT concepts - they don't represent
   * categories that group objects/actions/properties by shared features.
   */
  private isCommonNonConcept(normalized: string): boolean {
    const nonConceptWords = new Set([
      // Metacognitive/instructional verbs (actions, not categories)
      "think",
      "notice",
      "remember",
      "understand",
      "learn",
      "know",
      "see",
      "look",
      "read",
      "write",
      "explain",
      "ask",
      "answer",
      "reduce",
      // Document structure terms (not conceptual categories)
      "question",
      "example",
      "section",
      "chapter",
      "introduction",
      "conclusion",
      "summary",
      "note",
      "tip",
      "hint",
      "practice",
      "exercise",
      "review",
      "test",
      "quiz",
      "problem",
      "solution",
      "step",
      "part",
      "figure",
      "table",
      "diagram",
      "graph",
      "chart",
      "image",
      // Positional/ordinal descriptors (not conceptual groupings)
      "following",
      "above",
      "below",
      "next",
      "previous",
      "first",
      "second",
      "third",
      "last",
      "final",
      "finally",
      "initial",
      // Qualitative adjectives (descriptors, not abstract categories)
      "main",
      "key",
      "important",
      "basic",
      "simple",
      "complex",
      "easy",
      "hard",
      "difficult",
      "quick",
      "slow",
      "new",
      "old",
      "good",
      "bad",
      "better",
      "best",
      "worse",
      "worst",
      // Generic descriptive adjectives (NOT concepts)
      "popular",
      "common",
      "rare",
      "frequent",
      "unusual",
      "normal",
      "typical",
      "standard",
      "regular",
      "ordinary",
      "special",
      "unique",
      "general",
      "specific",
      "particular",
      "certain",
      "various",
      "different",
      "similar",
      "same",
      "other",
      "another",
      "such",
      "own",
      "several",
      "few",
      "many",
      "much",
      "some",
      "little",
      "large",
      "small",
      "big",
      "tiny",
      "huge",
      "great",
      "long",
      "short",
      "high",
      "low",
      "deep",
      "shallow",
      "wide",
      "narrow",
      "thick",
      "thin",
      "heavy",
      "light",
      "strong",
      "weak",
      "hard",
      "soft",
      "rough",
      "smooth",
      "hot",
      "cold",
      "warm",
      "cool",
      "wet",
      "dry",
      "clean",
      "dirty",
      "full",
      "empty",
      "open",
      "closed",
      "complete",
      "incomplete",
      "whole",
      "partial",
      "total",
      "entire",
      "perfect",
      "imperfect",
      "pure",
      "mixed",
      "simple",
      "complicated",
      // Evaluative terms (not conceptual groupings)
      "right",
      "wrong",
      "correct",
      "incorrect",
      "true",
      "false",
      "yes",
      "no",
      // Temporal/transitional adverbs (NOT concepts per definition)
      "instead",
      "rather",
      "otherwise",
      "moreover",
      "furthermore",
      "however",
      "therefore",
      "thus",
      "hence",
      "then",
      "now",
      "later",
      "earlier",
      "before",
      "after",
      "during",
      "meanwhile",
      "eventually",
      "ultimately",
      "initially",
      "originally",
      "previously",
      "subsequently",
      "recently",
      "formerly",
      // Intensifiers/modifiers (not conceptual categories)
      "very",
      "quite",
      "really",
      "actually",
      "generally",
      "specifically",
      "particularly",
      "especially",
      "mainly",
      "mostly",
      "largely",
      "partly",
      "partially",
      "completely",
      "entirely",
      "totally",
      "absolutely",
      "exactly",
      "precisely",
      // Other non-conceptual terms
      "certain",
      "certain",
      "perhaps",
      "maybe",
      "probably",
      "possibly",
      "definitely",
      "surely",
      "clearly",
      "obviously",
      "indeed",
      "essentially",
      "basically",
      "primarily",
    ]);

    return nonConceptWords.has(normalized);
  }

  private normalizeText(text: string): string {
    return text.toLowerCase().trim();
  }

  private splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  }

  private addCandidate(
    candidates: Map<string, ConceptCandidate>,
    normalized: string,
    original: string,
    position: number,
    metadata: Record<string, any>
  ) {
    if (this.commonWords.has(normalized)) return;

    const existing = candidates.get(normalized);
    if (existing) {
      existing.frequency++;
      existing.positions.push(position);
    } else {
      candidates.set(normalized, {
        term: original,
        normalized,
        frequency: 1,
        fromHeading: 0,
        inlineDefinitions: metadata.inlineDefinitions || [],
        positions: [position],
        sentenceContexts: [],
        ...metadata,
      });
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // -------------------------
  // Phrase and code extraction
  // -------------------------
  private addFrequentPhrases(
    text: string,
    candidates: Map<string, ConceptCandidate>
  ) {
    const tokens = (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter(
      (t) =>
        t.length > 2 && !this.commonWords.has(t) && !this.isCommonNonConcept(t)
    );
    const bigrams: Map<string, number> = new Map();
    const trigrams: Map<string, number> = new Map();
    for (let i = 0; i < tokens.length; i++) {
      if (i + 1 < tokens.length) {
        const bi = `${tokens[i]} ${tokens[i + 1]}`;
        bigrams.set(bi, (bigrams.get(bi) || 0) + 1);
      }
      if (i + 2 < tokens.length) {
        const tri = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
        trigrams.set(tri, (trigrams.get(tri) || 0) + 1);
      }
    }
    const addTop = (
      map: Map<string, number>,
      minCount: number,
      cap: number
    ) => {
      const genericPenaltyTerms = new Set([
        "object",
        "objects",
        "property",
        "properties",
        "value",
        "values",
        "function",
        "functions",
        "method",
        "methods",
        "variable",
        "variables",
        "data",
        "type",
        "types",
        "array",
        "arrays",
        "string",
        "strings",
        "number",
        "numbers",
        "element",
        "elements",
        "name",
        "names",
      ]);
      Array.from(map.entries())
        .filter(([phrase, c]) => {
          // Skip phrases consisting solely of generic penalty terms
          const words = phrase.split(" ");
          if (words.every((w) => genericPenaltyTerms.has(w))) return false;
          // Skip if phrase isn't a valid concept (will catch fragments)
          if (!this.isValidConcept(phrase)) return false;
          return c >= minCount;
        })
        .sort((a, b) => b[1] - a[1])
        .slice(0, cap)
        .forEach(([phrase, count]) => {
          const norm = phrase;
          if (!candidates.has(norm)) {
            // approximate first position
            const pos = Math.max(0, text.toLowerCase().indexOf(phrase));
            candidates.set(norm, {
              term: phrase,
              normalized: norm,
              frequency: count,
              fromHeading: 0,
              inlineDefinitions: [],
              positions: [pos],
              sentenceContexts: [],
            });
          }
        });
    };
    addTop(bigrams, 2, 25);
    addTop(trigrams, 2, 15);
  }

  private extractCodeIdentifiers(
    text: string,
    candidates: Map<string, ConceptCandidate>
  ) {
    // Match identifiers with dots (e.g., Object.create) and camel/Pascal case words used in code
    const dotted =
      text.match(/\b[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)+\b/g) || [];
    const plainIds = text.match(/\b[A-Za-z_$][A-Za-z0-9_$]{3,}\b/g) || [];
    const codeTerms = new Set<string>([...dotted, ...plainIds]);
    codeTerms.forEach((original) => {
      const cleaned = original.replace(/\(.*\)$/g, "");
      const normalized = this.normalizeText(cleaned);
      if (
        !this.isCommonNonConcept(normalized) &&
        !this.commonWords.has(normalized)
      ) {
        const pos = text.indexOf(original);
        const existing = candidates.get(normalized) || {
          term: cleaned,
          normalized,
          frequency: 0,
          fromHeading: 0,
          inlineDefinitions: [],
          positions: [],
          sentenceContexts: [],
        };
        existing.frequency++;
        existing.positions.push(pos >= 0 ? pos : 0);
        candidates.set(normalized, existing);
      }
    });
  }
}

// ============================================================================
// INTERFACE DEFINITIONS (Internal)
// ============================================================================

interface ConceptCandidate {
  term: string;
  normalized: string;
  frequency: number;
  fromHeading: number;
  inlineDefinitions: string[];
  positions: number[];
  sentenceContexts: string[];
  isLibraryConcept?: boolean; // NEW: track if concept is from library
  isTechnicalTerm?: boolean;
  isChemicalFormula?: boolean;
  hasInlineDefinition?: boolean;
  isDefinitionPattern?: boolean; // Educational indicator: explicit definition
  isClassification?: boolean; // Educational indicator: classification pattern
}

interface ScoredCandidate extends ConceptCandidate {
  score: number;
  confidence: number;
}

// ============================================================================
// EXPORT
// ============================================================================

export default ConceptExtractor;
