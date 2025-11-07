/**
 * Learning Principle Evaluators
 * Analyzes chapter content against 10 evidence-based learning principles
 */

import {
  PrincipleEvaluation,
  Finding,
  Suggestion,
  Evidence,
  Chapter,
  ConceptGraph,
  // LearningPrinciple, (unused)
} from "./types";

// ============================================================================
// DEEP PROCESSING & ELABORATION
// ============================================================================

export class DeepProcessingEvaluator {
  static evaluate(
    chapter: Chapter,
    concepts: ConceptGraph
  ): PrincipleEvaluation {
    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    // Check 1: Questions that invite thinking ("Why?", "How?")
    const whyHowQuestions = this.countWhyHowQuestions(chapter.content);
    evidence.push({
      type: "count",
      metric: "why_how_questions",
      value: whyHowQuestions,
      threshold: Math.ceil(chapter.wordCount / 500),
      quality:
        whyHowQuestions > Math.ceil(chapter.wordCount / 500)
          ? "strong"
          : "weak",
    });

    if (whyHowQuestions === 0) {
      findings.push({
        type: "critical",
        message:
          'No "Why?" or "How?" questions detected to encourage deep thinking',
        severity: 0.8,
        evidence: "Section headers and content lack reflective questions",
      });
    } else if (whyHowQuestions > chapter.sections.length * 2) {
      findings.push({
        type: "positive",
        message: `✓ Excellent: ${whyHowQuestions} reflective questions found throughout`,
        severity: 0,
        evidence: `Frequent use of "Why?" and "How?" patterns`,
      });
    }

    // Check 2: Explanation variety (multiple ways of explaining concepts)
    const explanationMethods = this.analyzeExplanationVariety(
      chapter,
      concepts
    );
    evidence.push({
      type: "metric",
      metric: "explanation_variety",
      value: explanationMethods.uniqueMethods,
      threshold: 3,
      quality: explanationMethods.uniqueMethods >= 3 ? "strong" : "weak",
    });

    if (explanationMethods.uniqueMethods < 2) {
      findings.push({
        type: "warning",
        message:
          "Limited explanation variety; most concepts explained in only one way",
        severity: 0.6,
        evidence: explanationMethods.examples.join(", "),
      });
    } else {
      findings.push({
        type: "positive",
        message: `✓ Good: Concepts explained through ${explanationMethods.uniqueMethods} different methods`,
        severity: 0,
        evidence: explanationMethods.examples.join(", "),
      });
    }

    // Check 3: Prior knowledge connections
    const connections = this.detectPriorKnowledgeConnections(chapter.content);
    evidence.push({
      type: "count",
      metric: "prior_knowledge_connections",
      value: connections.count,
      threshold: Math.max(3, Math.ceil(chapter.sections.length / 3)),
      quality: connections.count > 0 ? "moderate" : "weak",
    });

    if (connections.count === 0) {
      findings.push({
        type: "warning",
        message: "Limited connection to prior knowledge or experiences",
        severity: 0.5,
        evidence:
          'Few phrases like "recall that", "previously learned", "similar to"',
      });
    } else {
      findings.push({
        type: "positive",
        message: `✓ Found ${connections.count} connections to prior knowledge`,
        severity: 0,
        evidence: connections.examples[0],
      });
    }

    // Check 4: Concept mapping or analogies
    const analogies = this.detectAnalogiesAndMaps(chapter.content);
    evidence.push({
      type: "count",
      metric: "analogies_concept_maps",
      value: analogies.count,
      quality: analogies.count > 2 ? "strong" : "weak",
    });

    if (analogies.count === 0) {
      findings.push({
        type: "warning",
        message: "No analogies or concept mapping instructions found",
        severity: 0.4,
        evidence:
          'Consider adding: "Think of X as..." or "Create a concept map showing..."',
      });
    }

    // Calculate score
    let score = 50;
    score += whyHowQuestions > 0 ? 15 : 0;
    score +=
      explanationMethods.uniqueMethods >= 3
        ? 15
        : explanationMethods.uniqueMethods >= 2
        ? 8
        : 0;
    score += connections.count > 2 ? 10 : connections.count > 0 ? 5 : 0;
    score += analogies.count > 0 ? 10 : 0;
    score = Math.min(score, 100);

    const suggestions: Suggestion[] = [];
    if (whyHowQuestions === 0) {
      suggestions.push({
        id: "deep-proc-1",
        principle: "deepProcessing",
        priority: "high",
        title: "Add Reflective Questions",
        description:
          'Incorporate "Why?" and "How?" questions to encourage deep thinking',
        implementation:
          'After each major concept, add questions like "Why might this be true?" or "How would you apply this?"',
        expectedImpact:
          "Learners will actively make meaning rather than passively consume information",
        relatedConcepts: concepts.hierarchy.core.map((c) => c.id),
        examples: [
          "Why do you think the author chose this example?",
          "How does this connect to what we learned earlier?",
          "What assumptions is this argument making?",
        ],
      });
    }

    if (connections.count === 0) {
      suggestions.push({
        id: "deep-proc-2",
        principle: "deepProcessing",
        priority: "medium",
        title: "Bridge to Prior Knowledge",
        description:
          "Explicitly connect new concepts to previously learned material or common experiences",
        implementation:
          'Add transition phrases like "Recall that...", "Similar to what you learned about...", "Think back to when..."',
        expectedImpact:
          "New information attaches to existing mental models, strengthening retention",
        relatedConcepts: concepts.hierarchy.core.map((c) => c.id).slice(0, 3),
        examples: [
          "Recall that in Chapter 2, we learned about X. This concept builds on that foundation.",
          "You've probably experienced this when...",
          "Similar to how a muscle gets stronger with exercise, memory strengthens with retrieval practice.",
        ],
      });
    }

    return {
      principle: "deepProcessing",
      score,
      weight: 0.95, // Very important
      findings,
      suggestions,
      evidence,
    };
  }

  private static countWhyHowQuestions(text: string): number {
    const questionPatterns = [
      /\bwhy\s*\??/gi,
      /\bhow\s*\??/gi,
      /\bwhat causes\s*\??/gi,
      /\bwhat would happen if\s*\??/gi,
    ];
    return questionPatterns.reduce((count, pattern) => {
      const matches = text.match(pattern) || [];
      return count + matches.length;
    }, 0);
  }

  private static analyzeExplanationVariety(
    chapter: Chapter,
    _concepts: ConceptGraph
  ) {
    const methods = new Set<string>();
    const examples: string[] = [];

    // Detect different explanation types
    if (
      /(?:for example|such as|like|e\.g\.|including?)/i.test(chapter.content)
    ) {
      methods.add("examples");
      examples.push("examples");
    }
    if (/(?:analogy|think of|similar to|as if)/i.test(chapter.content)) {
      methods.add("analogy");
      examples.push("analogies");
    }
    if (/(?:definition|refers? to|means?|is a|is an)/i.test(chapter.content)) {
      methods.add("definition");
      examples.push("definitions");
    }
    if (/(?:step-by-step|process|sequence|procedure)/i.test(chapter.content)) {
      methods.add("process");
      examples.push("procedures");
    }
    if (/(?:formula|equation|diagram|visual)/i.test(chapter.content)) {
      methods.add("formula");
      examples.push("formulas");
    }
    if (/(?:history|background|context|why)/i.test(chapter.content)) {
      methods.add("context");
      examples.push("context/history");
    }

    return { uniqueMethods: methods.size, examples };
  }

  private static detectPriorKnowledgeConnections(text: string): {
    count: number;
    examples: string[];
  } {
    const patterns = [
      /recall\s+that/gi,
      /you\s+(?:may\s+)?know\s+(?:that)?/gi,
      /as\s+you\s+learned/gi,
      /previously/gi,
      /similar\s+to/gi,
      /like\s+(?:you|we)\s+(?:saw|learned|discussed)/gi,
    ];

    let count = 0;
    const matches: string[] = [];

    patterns.forEach((pattern) => {
      const found = text.match(pattern) || [];
      count += found.length;
      matches.push(...found);
    });

    return { count, examples: matches.slice(0, 3) };
  }

  private static detectAnalogiesAndMaps(text: string): { count: number } {
    const patterns = [
      /think\s+of\s+.+\s+as/gi,
      /is\s+like\s+a?/gi,
      /analogous\s+to/gi,
    ];

    return {
      count: patterns.reduce((sum, pattern) => {
        return sum + (text.match(pattern) || []).length;
      }, 0),
    };
  }
}

// ============================================================================
// SPACED REPETITION
// ============================================================================

export class SpacedRepetitionEvaluator {
  static evaluate(
    chapter: Chapter,
    concepts: ConceptGraph
  ): PrincipleEvaluation {
    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    // Analyze concept mention patterns
    const conceptMentionStats = this.analyzeConceptMentionPatterns(
      chapter,
      concepts
    );

    evidence.push({
      type: "metric",
      metric: "avg_concept_mentions",
      value: conceptMentionStats.avgMentions,
      threshold: 3,
      quality:
        conceptMentionStats.avgMentions >= 3 &&
        conceptMentionStats.avgMentions <= 5
          ? "strong"
          : "moderate",
    });

    if (conceptMentionStats.avgMentions < 2) {
      findings.push({
        type: "warning",
        message: `Concepts mentioned too infrequently (avg ${conceptMentionStats.avgMentions.toFixed(
          1
        )} times)`,
        severity: 0.7,
        evidence: `Optimal spacing: 3-5 mentions per 10,000 word chapter`,
      });
    } else if (
      conceptMentionStats.avgMentions > 2 &&
      conceptMentionStats.avgMentions <= 5
    ) {
      findings.push({
        type: "positive",
        message: `✓ Good spacing: Concepts revisited ${conceptMentionStats.avgMentions.toFixed(
          1
        )} times on average`,
        severity: 0,
        evidence: "Follows spaced repetition principles",
      });
    } else if (conceptMentionStats.avgMentions > 5) {
      findings.push({
        type: "warning",
        message: `Concepts repeated too frequently (${conceptMentionStats.avgMentions.toFixed(
          1
        )} times)`,
        severity: 0.4,
        evidence: "May feel redundant; risk of passive reading",
      });
    }

    // Analyze spacing gaps
    const spacingAnalysis = this.analyzeSpacingGaps(chapter, concepts);
    evidence.push({
      type: "metric",
      metric: "spacing_gap_consistency",
      value: spacingAnalysis.consistency,
      threshold: 0.6,
      quality: spacingAnalysis.consistency > 0.6 ? "strong" : "weak",
    });

    if (spacingAnalysis.evenSpacing) {
      findings.push({
        type: "positive",
        message: "✓ Concepts spread evenly throughout chapter",
        severity: 0,
        evidence: `Spacing gaps are consistent (${spacingAnalysis.avgGap} characters)`,
      });
    } else {
      findings.push({
        type: "warning",
        message:
          "Uneven spacing: Some concepts revisited early, others abandoned",
        severity: 0.5,
        evidence: spacingAnalysis.unevenConcepts.slice(0, 2).join(", "),
      });
    }

    // Calculate score
    let score = 50;
    score +=
      conceptMentionStats.avgMentions >= 2 &&
      conceptMentionStats.avgMentions <= 5
        ? 25
        : 10;
    score += spacingAnalysis.evenSpacing ? 15 : 5;
    score = Math.min(score, 100);

    const suggestions: Suggestion[] = [];
    if (conceptMentionStats.avgMentions < 2) {
      suggestions.push({
        id: "spaced-rep-1",
        principle: "spacedRepetition",
        priority: "high",
        title: "Increase Concept Revisits",
        description:
          "Revisit core concepts at strategic intervals throughout the chapter",
        implementation:
          "After introducing a concept, plan to mention it again after 300-500 words, then again near the chapter conclusion",
        expectedImpact:
          "Spaced repetition strengthens neural pathways and prevents forgetting",
        relatedConcepts: concepts.hierarchy.core.map((c) => c.id),
        examples: [
          'Section 1: Introduce concept X\nSection 3: "Recall that X is important because..."\nSection 5 (conclusion): "We\'ve seen X applied in...',
        ],
      });
    }

    return {
      principle: "spacedRepetition",
      score,
      weight: 0.9,
      findings,
      suggestions,
      evidence,
    };
  }

  private static analyzeConceptMentionPatterns(
    _chapter: Chapter,
    concepts: ConceptGraph
  ) {
    const mentions = concepts.concepts.map((c) => c.mentions.length);
    const avgMentions =
      mentions.length > 0
        ? mentions.reduce((a, b) => a + b, 0) / mentions.length
        : 0;

    return {
      avgMentions,
      minMentions: Math.min(...mentions),
      maxMentions: Math.max(...mentions),
      totalMentions: mentions.reduce((a, b) => a + b, 0),
    };
  }

  private static analyzeSpacingGaps(_chapter: Chapter, concepts: ConceptGraph) {
    const gaps: number[] = [];
    const unevenConcepts: string[] = [];

    concepts.concepts.forEach((concept) => {
      if (concept.mentions.length < 2) return;

      const positions = concept.mentions.map((m) => m.position);
      const conceptGaps = [];

      for (let i = 1; i < positions.length; i++) {
        conceptGaps.push(positions[i] - positions[i - 1]);
      }

      gaps.push(...conceptGaps);

      // Check if gaps are too varied
      if (conceptGaps.length > 0) {
        const avgGap = conceptGaps.reduce((a, b) => a + b) / conceptGaps.length;
        const variance =
          conceptGaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) /
          conceptGaps.length;
        if (variance > avgGap * avgGap) {
          unevenConcepts.push(concept.name);
        }
      }
    });

    const avgGap =
      gaps.length > 0 ? gaps.reduce((a, b) => a + b) / gaps.length : 0;
    const variance =
      gaps.length > 0
        ? gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) /
          gaps.length
        : 0;
    const stdDev = Math.sqrt(variance);
    const consistency = 1 - Math.min(stdDev / avgGap, 1);

    return {
      avgGap: Math.round(avgGap),
      evenSpacing: consistency > 0.6,
      consistency,
      unevenConcepts,
    };
  }
}

// ============================================================================
// RETRIEVAL PRACTICE (ACTIVE RECALL)
// ============================================================================

export class RetrievalPracticeEvaluator {
  static evaluate(
    chapter: Chapter,
    concepts: ConceptGraph
  ): PrincipleEvaluation {
    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    // Check 1: Direct questions
    const directQuestions = this.countDirectQuestions(chapter.content);
    evidence.push({
      type: "count",
      metric: "direct_questions",
      value: directQuestions,
      threshold: Math.ceil(chapter.sections.length / 2),
      quality:
        directQuestions > Math.ceil(chapter.sections.length / 2)
          ? "strong"
          : "weak",
    });

    if (directQuestions === 0) {
      findings.push({
        type: "critical",
        message: "No direct recall questions found",
        severity: 0.9,
        evidence:
          'Questions like "What is...", "Which of...", or "Answer this:" are absent',
      });
    } else {
      findings.push({
        type: "positive",
        message: `✓ Found ${directQuestions} direct recall questions`,
        severity: 0,
        evidence: `Encourages active recall without reference materials`,
      });
    }

    // Check 2: Summary/recap prompts
    const summaryPrompts = this.detectSummaryPrompts(chapter.content);
    evidence.push({
      type: "count",
      metric: "summary_prompts",
      value: summaryPrompts.count,
      quality: summaryPrompts.count > 2 ? "strong" : "weak",
    });

    if (summaryPrompts.count === 0) {
      findings.push({
        type: "warning",
        message: 'No "summarize what you just read" prompts',
        severity: 0.7,
        evidence: 'Add checkpoints with: "In your own words, what is..."',
      });
    }

    // Check 3: Application scenarios
    const applicationPrompts = this.detectApplicationPrompts(chapter.content);
    evidence.push({
      type: "count",
      metric: "application_scenarios",
      value: applicationPrompts.count,
      quality: applicationPrompts.count > 0 ? "moderate" : "weak",
    });

    let score = 40;
    score += directQuestions > 0 ? 30 : 0;
    score += summaryPrompts.count > 0 ? 15 : 0;
    score += applicationPrompts.count > 0 ? 15 : 0;
    score = Math.min(score, 100);

    const suggestions: Suggestion[] = [];
    if (directQuestions === 0) {
      suggestions.push({
        id: "retrieval-1",
        principle: "retrievalPractice",
        priority: "high",
        title: "Add Recall Questions",
        description:
          "Include questions that require learners to recall without looking back",
        implementation:
          'After each section, add questions like: "What is X?", "Explain how Y works", "Which statement is true?"',
        expectedImpact:
          "Active recall strengthens long-term retention far more than rereading",
        relatedConcepts: concepts.hierarchy.core.map((c) => c.id),
        examples: [
          "What are the three main types of X?",
          "Explain the relationship between Y and Z",
          "How would you apply X in this scenario?",
        ],
      });
    }

    return {
      principle: "retrievalPractice",
      score,
      weight: 0.95,
      findings,
      suggestions,
      evidence,
    };
  }

  private static countDirectQuestions(text: string): number {
    // Look for question patterns
    const questionEnds = (text.match(/\?/g) || []).length;
    const explicitPrompts = (
      text.match(/(?:question|quiz|what is|which|how|why)\s*:/gi) || []
    ).length;
    return questionEnds + explicitPrompts;
  }

  private static detectSummaryPrompts(text: string): {
    count: number;
    examples: string[];
  } {
    const patterns = [
      /summarize/gi,
      /in your own words/gi,
      /recap/gi,
      /recall/gi,
      /without looking back/gi,
    ];

    let count = 0;
    const examples: string[] = [];

    patterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      count += matches.length;
      examples.push(...matches.slice(0, 1));
    });

    return { count, examples };
  }

  private static detectApplicationPrompts(text: string): { count: number } {
    const patterns = [
      /apply this/gi,
      /how would you use/gi,
      /real-world/gi,
      /scenario/gi,
      /case study/gi,
      /practice this/gi,
    ];

    const count = patterns.reduce((sum, pattern) => {
      return sum + (text.match(pattern) || []).length;
    }, 0);

    return { count };
  }
}

// ============================================================================
// REMAINING EVALUATORS (Abbreviated for brevity)
// ============================================================================

export class InterleavingEvaluator {
  static evaluate(
    _chapter: Chapter,
    concepts: ConceptGraph
  ): PrincipleEvaluation {
    const sequence = concepts.sequence;
    const blockingSegments = this.identifyBlockingSegments(sequence);
    const totalPositions = sequence.length;
    const blockingRatio =
      blockingSegments.length > 0
        ? blockingSegments.reduce((sum, seg) => sum + seg.length, 0) /
          totalPositions
        : 0;

    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    evidence.push({
      type: "metric",
      metric: "blocking_ratio",
      value: blockingRatio,
      threshold: 0.4,
      quality:
        blockingRatio < 0.4
          ? "strong"
          : blockingRatio < 0.6
          ? "moderate"
          : "weak",
    });

    if (blockingRatio > 0.7) {
      findings.push({
        type: "critical",
        message: "Heavy blocking detected: Topics too isolated from each other",
        severity: 0.8,
        evidence: `${(blockingRatio * 100).toFixed(
          0
        )}% of content focuses on single topics`,
      });
    } else if (blockingRatio < 0.4) {
      findings.push({
        type: "positive",
        message: "✓ Excellent interleaving: Topics well-mixed",
        severity: 0,
        evidence: `Topics switch every ${(
          totalPositions / blockingSegments.length
        ).toFixed(1)} concepts`,
      });
    }

    let score = 50 + (1 - blockingRatio) * 50;

    return {
      principle: "interleaving",
      score: Math.min(score, 100),
      weight: 0.85,
      findings,
      suggestions: [],
      evidence,
    };
  }

  private static identifyBlockingSegments(sequence: string[]) {
    const segments = [];
    let current = { topic: sequence[0], length: 1, start: 0 };

    for (let i = 1; i < sequence.length; i++) {
      if (sequence[i] === current.topic) {
        current.length++;
      } else {
        if (current.length > 1) {
          segments.push(current);
        }
        current = { topic: sequence[i], length: 1, start: i };
      }
    }

    return segments;
  }
}

export class DualCodingEvaluator {
  static evaluate(
    chapter: Chapter,
    _concepts: ConceptGraph
  ): PrincipleEvaluation {
    const visualReferences = this.countVisualReferences(chapter.content);
    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    evidence.push({
      type: "count",
      metric: "visual_references",
      value: visualReferences,
      threshold: Math.ceil(chapter.sections.length / 2),
      quality:
        visualReferences > Math.ceil(chapter.sections.length / 2)
          ? "strong"
          : "weak",
    });

    let score = 50 + visualReferences * 5;

    return {
      principle: "dualCoding",
      score: Math.min(score, 100),
      weight: 0.8,
      findings,
      suggestions: [],
      evidence,
    };
  }

  private static countVisualReferences(text: string): number {
    const patterns = [
      /diagram/gi,
      /chart/gi,
      /graph/gi,
      /image/gi,
      /figure/gi,
      /illustration/gi,
      /visualize/gi,
      /see figure/gi,
    ];

    return patterns.reduce((sum, pattern) => {
      return sum + (text.match(pattern) || []).length;
    }, 0);
  }
}

export class GenerativeLearningEvaluator {
  static evaluate(
    chapter: Chapter,
    _concepts: ConceptGraph
  ): PrincipleEvaluation {
    const generativePrompts = this.countGenerativePrompts(chapter.content);
    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    evidence.push({
      type: "count",
      metric: "generative_prompts",
      value: generativePrompts,
      quality: generativePrompts > 0 ? "moderate" : "weak",
    });

    let score = 50 + generativePrompts * 5;

    return {
      principle: "generativeLearning",
      score: Math.min(score, 100),
      weight: 0.85,
      findings,
      suggestions: [],
      evidence,
    };
  }

  private static countGenerativePrompts(text: string): number {
    const patterns = [
      /predict/gi,
      /generate/gi,
      /create/gi,
      /write/gi,
      /construct/gi,
      /solve/gi,
      /design/gi,
    ];

    return patterns.reduce((sum, pattern) => {
      return sum + (text.match(pattern) || []).length;
    }, 0);
  }
}

export class MetacognitionEvaluator {
  static evaluate(
    chapter: Chapter,
    _concepts: ConceptGraph
  ): PrincipleEvaluation {
    const metacognitivePrompts = this.countMetacognitiveElements(
      chapter.content
    );
    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    evidence.push({
      type: "count",
      metric: "metacognitive_prompts",
      value: metacognitivePrompts,
      quality: metacognitivePrompts > 0 ? "moderate" : "weak",
    });

    let score = 50 + metacognitivePrompts * 5;

    return {
      principle: "metacognition",
      score: Math.min(score, 100),
      weight: 0.75,
      findings,
      suggestions: [],
      evidence,
    };
  }

  private static countMetacognitiveElements(text: string): number {
    const patterns = [
      /do you understand/gi,
      /confused/gi,
      /misconception/gi,
      /self-test/gi,
      /check your understanding/gi,
      /reflect/gi,
    ];

    return patterns.reduce((sum, pattern) => {
      return sum + (text.match(pattern) || []).length;
    }, 0);
  }
}

export class SchemaBuildingEvaluator {
  static evaluate(
    _chapter: Chapter,
    concepts: ConceptGraph
  ): PrincipleEvaluation {
    const hierarchyBalance = this.analyzeHierarchyBalance(concepts);
    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    evidence.push({
      type: "metric",
      metric: "hierarchy_balance",
      value: hierarchyBalance,
      threshold: 0.6,
      quality: hierarchyBalance > 0.6 ? "strong" : "weak",
    });

    let score = hierarchyBalance * 100;

    return {
      principle: "schemaBuilding",
      score: Math.min(score, 100),
      weight: 0.9,
      findings,
      suggestions: [],
      evidence,
    };
  }

  private static analyzeHierarchyBalance(concepts: ConceptGraph): number {
    const total = concepts.concepts.length;
    const coreRatio = concepts.hierarchy.core.length / total;
    const supportingRatio = concepts.hierarchy.supporting.length / total;

    // Optimal: 20% core, 30% supporting, 50% detail
    const coreDeviation = Math.abs(coreRatio - 0.2);
    const supportingDeviation = Math.abs(supportingRatio - 0.3);
    const balance = 1 - (coreDeviation + supportingDeviation) / 2;

    return Math.max(balance, 0);
  }
}

export class CognitiveLoadEvaluator {
  static evaluate(
    chapter: Chapter,
    _concepts: ConceptGraph
  ): PrincipleEvaluation {
    const segmentAnalysis = this.analyzeSectionSegmentation(chapter);
    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    evidence.push({
      type: "metric",
      metric: "avg_section_length",
      value: segmentAnalysis.avgLength,
      threshold: 500,
      quality: segmentAnalysis.avgLength < 800 ? "strong" : "moderate",
    });

    let score = 50;
    if (segmentAnalysis.avgLength < 600) score += 30;
    else if (segmentAnalysis.avgLength < 1000) score += 15;

    return {
      principle: "cognitiveLoad",
      score: Math.min(score, 100),
      weight: 0.8,
      findings,
      suggestions: [],
      evidence,
    };
  }

  private static analyzeSectionSegmentation(chapter: Chapter) {
    const lengths = chapter.sections.map((s) => s.wordCount);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const tooLong = lengths.filter((l) => l > 1000).length;

    return { avgLength, tooLong };
  }
}

export class EmotionAndRelevanceEvaluator {
  static evaluate(
    chapter: Chapter,
    _concepts: ConceptGraph
  ): PrincipleEvaluation {
    const emotionalElements = this.countEmotionalElements(chapter.content);
    const relevanceElements = this.countRelevanceStatements(chapter.content);
    const findings: Finding[] = [];
    const evidence: Evidence[] = [];

    evidence.push({
      type: "count",
      metric: "emotional_elements",
      value: emotionalElements,
      quality: emotionalElements > 0 ? "moderate" : "weak",
    });

    evidence.push({
      type: "count",
      metric: "relevance_statements",
      value: relevanceElements,
      quality: relevanceElements > 0 ? "moderate" : "weak",
    });

    let score = 50 + emotionalElements * 3 + relevanceElements * 3;

    return {
      principle: "emotionAndRelevance",
      score: Math.min(score, 100),
      weight: 0.7,
      findings,
      suggestions: [],
      evidence,
    };
  }

  private static countEmotionalElements(text: string): number {
    const patterns = [/story/gi, /example/gi, /imagine/gi, /visualize/gi];
    return patterns.reduce((sum, pattern) => {
      return sum + (text.match(pattern) || []).length;
    }, 0);
  }

  private static countRelevanceStatements(text: string): number {
    const patterns = [
      /matters/gi,
      /important/gi,
      /applies to/gi,
      /real-world/gi,
    ];
    return patterns.reduce((sum, pattern) => {
      return sum + (text.match(pattern) || []).length;
    }, 0);
  }
}

export default {
  DeepProcessingEvaluator,
  SpacedRepetitionEvaluator,
  RetrievalPracticeEvaluator,
  InterleavingEvaluator,
  DualCodingEvaluator,
  GenerativeLearningEvaluator,
  MetacognitionEvaluator,
  SchemaBuildingEvaluator,
  CognitiveLoadEvaluator,
  EmotionAndRelevanceEvaluator,
};
