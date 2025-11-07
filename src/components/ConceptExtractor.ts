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

// ============================================================================
// CONCEPT EXTRACTOR
// ============================================================================

export class ConceptExtractor {
  private commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "is",
    "are",
    "be",
    "been",
    "have",
    "has",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
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
   */
  private identifyCandidateConcepts(
    text: string,
    sections: Section[]
  ): ConceptCandidate[] {
    const candidates: Map<string, ConceptCandidate> = new Map();

    // Extract from section headings (high importance)
    sections.forEach((section) => {
      const headingTerms = this.extractTerms(section.heading);
      headingTerms.forEach((term) => {
        const existing = candidates.get(term.normalized) || {
          term: term.original,
          normalized: term.normalized,
          frequency: 0,
          fromHeading: 0,
          inlineDefinitions: [],
          positions: [],
          sentenceContexts: [],
        };
        existing.frequency++;
        existing.fromHeading++;
        candidates.set(term.normalized, existing);
      });
    });

    // Extract from sentences with defining patterns
    const sentences = this.splitIntoSentences(text);
    sentences.forEach((sentence, _idx) => {
      const position = text.indexOf(sentence);

      // Pattern 1: "X is a/an Y" (definition)
      const defPattern = /(\w+(?:\s+\w+)*)\s+is\s+(?:a|an|the)\s+([^.!?]+)/gi;
      let defMatch;
      while ((defMatch = defPattern.exec(sentence)) !== null) {
        const concept = this.normalizeText(defMatch[1]);
        const definition = defMatch[2].trim();
        this.addCandidate(candidates, concept, defMatch[1], position, {
          definition,
          hasInlineDefinition: true,
        });
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
        if (!this.commonWords.has(concept)) {
          this.addCandidate(candidates, concept, capMatch[1], position, {});
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
        score += candidate.fromHeading * 20; // 20 points per heading

        // Factor 3: Has inline definition
        if (candidate.inlineDefinitions.length > 0) {
          score += 25;
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

        return {
          ...candidate,
          score,
          confidence: Math.min(score / 100, 1),
        };
      })
      .filter((c) => c.score > 15) // Minimum threshold
      .sort((a, b) => b.score - a.score);
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

      const concept: Concept = {
        id: `concept-${index}`,
        name: candidate.term,
        definition:
          candidate.inlineDefinitions[0] ||
          `A key concept in this material (mentioned ${mentions.length} times)`,
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
    // Extract noun phrases and capitalized terms
    const nounPhrasePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
    const matches = text.match(nounPhrasePattern) || [];

    return matches
      .filter((m) => !this.commonWords.has(this.normalizeText(m)))
      .map((m) => ({
        original: m,
        normalized: this.normalizeText(m),
      }));
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
}

interface ScoredCandidate extends ConceptCandidate {
  score: number;
  confidence: number;
}

// ============================================================================
// EXPORT
// ============================================================================

export default ConceptExtractor;
