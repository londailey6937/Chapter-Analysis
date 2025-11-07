/**
 * Concept Extraction Engine
 * Identifies key concepts from chapter text using:
 * - NLP pattern matching
 * - Semantic analysis
 * - Structural signals (headings, emphasis)
 * - Frequency and TF-IDF analysis
 */

import {
  Concept,
  ConceptMention,
  ConceptGraph,
  ConceptRelationship,
  Section,
} from "../../types";

import {
  createConceptLookup,
  isChemistryConcept,
  getConceptDefinition,
  type ConceptDefinition,
} from "../data/chemistryConceptLibrary";

// ============================================================================
// CONCEPT EXTRACTOR
// ============================================================================

export class ConceptExtractor {
  // Concept library lookup for matching known concepts
  private conceptLibrary: Map<string, ConceptDefinition>;

  constructor() {
    this.conceptLibrary = createConceptLookup();
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
    sections: Section[]
  ): Promise<ConceptGraph> {
    const extractor = new ConceptExtractor();

    // Phase 1: Identify candidate concepts
    const candidates = extractor.identifyCandidateConcepts(chapter, sections);

    // Phase 2: Score and filter candidates
    const scored = extractor.scoreAndFilterCandidates(candidates, chapter);

    // Phase 3: Create concept objects with mentions
    const concepts = extractor.createConceptObjects(scored, chapter);

    // Phase 4: Establish relationships
    const relationships = extractor.establishRelationships(concepts, chapter);

    // Phase 5: Build hierarchy
    const hierarchy = extractor.buildHierarchy(concepts);

    // Phase 6: Extract concept sequence
    const sequence = extractor.extractConceptSequence(concepts);

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

    // STEP 3: Extract from sentences with defining patterns (only library concepts)
    const sentences = this.splitIntoSentences(text);
    sentences.forEach((sentence, _idx) => {
      const position = text.indexOf(sentence);

      // Pattern 1: "X is a/an Y" (definition)
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
        });
      }

      // Pattern 3: Capitalized terms at sentence start or in emphasis
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

        // Factor 9: Penalize very short single-word terms unless frequently mentioned or library concept
        if (
          wordCount === 1 &&
          candidate.term.length <= 4 &&
          candidate.frequency < 3 &&
          !candidate.isLibraryConcept
        ) {
          score -= 10;
        }

        return {
          ...candidate,
          score,
          confidence: Math.min(score / 100, 1),
        };
      })
      .filter((c) => c.score > 20) // Lower threshold since library concepts get +50
      .sort((a, b) => b.score - a.score)
      .slice(0, 60); // Increased limit to capture more library concepts
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
              context.includes(`foundation`)
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
    return concepts
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
    const lowerText = text.toLowerCase();

    // Check for each concept in the library
    for (const [conceptKey, conceptDef] of this.conceptLibrary.entries()) {
      // Create regex pattern for whole word matching
      const pattern = new RegExp(`\\b${this.escapeRegex(conceptKey)}\\b`, "gi");
      const matches = text.match(pattern);

      if (matches && matches.length > 0) {
        // Find all positions
        const positions: number[] = [];
        let match;
        const regex = new RegExp(`\\b${this.escapeRegex(conceptKey)}\\b`, "gi");
        while ((match = regex.exec(text)) !== null) {
          positions.push(match.index);
        }

        const existing = candidates.get(conceptKey) || {
          term: conceptDef.name, // Use canonical name from library
          normalized: conceptKey,
          frequency: 0,
          fromHeading: 0,
          inlineDefinitions: [],
          positions: [],
          sentenceContexts: [],
          isLibraryConcept: true,
        };

        existing.frequency += matches.length;
        existing.positions.push(...positions);
        candidates.set(conceptKey, existing);
      }
    }
  }

  /**
   * Check if a term is a valid concept (either in library or passes strict criteria)
   */
  private isValidConcept(normalized: string): boolean {
    // If it's in the chemistry library, allow (domain boost handled later)
    if (this.conceptLibrary.has(normalized)) return true;

    // Generic gating for all domains
    if (this.commonWords.has(normalized)) return false;
    if (this.isCommonNonConcept(normalized)) return false;

    // Accept multi-word phrases generously
    if (normalized.includes(" ")) return true;

    // Accept single words that are at least 5 chars (more likely domain terms)
    if (normalized.length >= 5) return true;

    // Reject very short single tokens by default
    return false;
  }

  private findAllMentions(text: string, term: string): ConceptMention[] {
    const mentions: ConceptMention[] = [];
    const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, "gi");
    let match;

    while ((match = regex.exec(text)) !== null) {
      const position = match.index;
      const start = Math.max(0, position - 100);
      const end = Math.min(text.length, position + 100);
      const context = text.substring(start, end);

      mentions.push({
        position,
        context,
        depth: this.estimateMentionDepth(context),
        isRevisit: mentions.length > 0,
        associatedConcepts: [],
      });
    }

    return mentions;
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
   */
  private isCommonNonConcept(normalized: string): boolean {
    const nonConceptWords = new Set([
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
      "initial",
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
      "right",
      "wrong",
      "correct",
      "incorrect",
      "true",
      "false",
      "yes",
      "no",
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
      Array.from(map.entries())
        .filter(([, c]) => c >= minCount)
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
}

interface ScoredCandidate extends ConceptCandidate {
  score: number;
  confidence: number;
}

// ============================================================================
// EXPORT
// ============================================================================

export default ConceptExtractor;
