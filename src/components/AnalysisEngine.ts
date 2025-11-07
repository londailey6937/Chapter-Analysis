/**
 * Chapter Analysis Engine
 * Orchestrates concept extraction, principle evaluation, and report generation
 */

import type {
  Chapter,
  ChapterAnalysis,
  ConceptGraph,
  PrincipleEvaluation,
  PrincipleScoreDisplay,
  AnalysisVisualization,
  Recommendation,
  Suggestion,
  ConceptAnalysisResult,
  StructureAnalysisResult,
  ReviewPattern,
  ReviewScheduleData,
} from "../types";

import {
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
} from "../../LearningPrincipleEvaluators";

import { ConceptExtractor } from "./ConceptExtractor";

export class AnalysisEngine {
  /**
   * Main entry point: Analyze a complete chapter
   */
  static async analyzeChapter(chapter: Chapter): Promise<ChapterAnalysis> {
    // Extract concepts and build graph
    const conceptGraph = await ConceptExtractor.extractConceptsFromChapter(
      chapter.content,
      chapter.sections
    );

    // Evaluate all learning principles (full evaluations used by UI)
    const principleEvaluations = this.runEvaluators(chapter, conceptGraph);
    // Derive lightweight display scores for visualization summary
    const principleDisplay: PrincipleScoreDisplay[] = principleEvaluations.map(
      (ev) => ({
        name: ev.principle,
        displayName: ev.principle,
        score: ev.score,
        weight: ev.weight ?? 1,
      })
    );

    // Build concept analysis (basic defaults from graph/metrics)
    const reviewPatterns: ReviewPattern[] = conceptGraph.concepts.map(
      (concept) => {
        const mentions = concept.mentions.length;
        const positions = concept.mentions
          .map((m) => m.position)
          .sort((a, b) => a - b);
        const spacing: number[] = [];
        for (let i = 1; i < positions.length; i++) {
          spacing.push(positions[i] - positions[i - 1]);
        }
        const avgSpacing =
          spacing.length > 0
            ? spacing.reduce((a, b) => a + b, 0) / spacing.length
            : 0;
        // Heuristic: optimal if 2+ mentions and spacing variance is low
        const variance =
          spacing.length > 0
            ? spacing.reduce(
                (sum, gap) => sum + Math.pow(gap - avgSpacing, 2),
                0
              ) / spacing.length
            : 0;
        const isOptimal = mentions >= 2 && variance < avgSpacing * avgSpacing;

        return {
          conceptId: concept.id,
          conceptName: concept.name,
          mentions,
          firstAppearance: concept.firstMentionPosition,
          spacing,
          avgSpacing: Math.round(avgSpacing),
          isOptimal,
          recommendation: isOptimal
            ? undefined
            : mentions < 2
            ? "Consider revisiting this concept at least once more"
            : "Try spacing mentions more evenly",
        };
      }
    );

    // Generate visualization data (after reviewPatterns are available)
    const visualization = this.generateVisualization(
      chapter,
      conceptGraph,
      principleDisplay,
      reviewPatterns
    );

    // Build recommendations based on principle scores and suggestions
    const recommendations: Recommendation[] = principleEvaluations.flatMap(
      (p) =>
        (p.suggestions || [])
          .filter((s: Suggestion) => s.priority === "high" || p.score < 70)
          .map((s: Suggestion) => ({
            id: s.id || `${p.principle}-${s.title.slice(0, 20)}`,
            priority: s.priority,
            category: "enhance",
            title: s.title,
            description: s.description,
            affectedSections: [],
            affectedConcepts: s.relatedConcepts || [],
            estimatedEffort: "medium",
            expectedOutcome: s.expectedImpact,
            actionItems: [s.implementation],
          }))
    );

    const overallScore = this.calculateWeightedScoreDisplay(principleDisplay);

    const metrics = {
      totalWords: chapter.wordCount,
      readingTime: Math.round(chapter.wordCount / 200),
      averageSectionLength:
        chapter.sections.reduce((sum, s) => sum + s.wordCount, 0) /
        Math.max(1, chapter.sections.length),
      conceptDensity:
        conceptGraph.concepts.length / Math.max(1, chapter.wordCount / 1000),
      readabilityScore: 0,
      complexityScore: 0,
      timestamp: new Date(),
    };

    // reviewPatterns already built above

    const conceptAnalysis: ConceptAnalysisResult = {
      totalConceptsIdentified: conceptGraph.concepts.length,
      coreConceptCount: conceptGraph.hierarchy.core.length,
      conceptDensity: metrics.conceptDensity,
      novelConceptsPerSection: chapter.sections.map(
        (s) => s.conceptsIntroduced.length
      ),
      reviewPatterns,
      hierarchyBalance: (() => {
        const total =
          conceptGraph.hierarchy.core.length +
          conceptGraph.hierarchy.supporting.length +
          conceptGraph.hierarchy.detail.length;
        if (!total) return 0;
        const ideal = total / 3;
        const diffs = [
          Math.abs(conceptGraph.hierarchy.core.length - ideal),
          Math.abs(conceptGraph.hierarchy.supporting.length - ideal),
          Math.abs(conceptGraph.hierarchy.detail.length - ideal),
        ];
        const maxDiff = ideal; // worst case: all in one bucket
        const balance =
          1 - Math.min(1, diffs.reduce((a, b) => a + b, 0) / (3 * maxDiff));
        return Number(balance.toFixed(2));
      })(),
      orphanConcepts: conceptGraph.concepts
        .filter(
          (c) =>
            !conceptGraph.relationships.some(
              (r) => r.source === c.id || r.target === c.id
            )
        )
        .map((c) => c.id),
    };

    // Build structure analysis (lightweight heuristics)
    const lengths = chapter.sections.map((s) => s.wordCount);
    const avg =
      metrics.averageSectionLength ||
      lengths.reduce((a, b) => a + b, 0) / Math.max(1, lengths.length);
    const variance =
      lengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) /
      Math.max(1, lengths.length);
    const pacing: StructureAnalysisResult["pacing"] =
      avg < 150 ? "fast" : avg < 350 ? "moderate" : "slow";
    const structureAnalysis: StructureAnalysisResult = {
      sectionCount: chapter.sections.length,
      avgSectionLength: Math.round(avg),
      sectionLengthVariance: Math.round(variance),
      pacing,
      scaffolding: {
        hasIntroduction: chapter.sections.some((s) =>
          /intro|overview/i.test(s.heading)
        ),
        hasProgression: chapter.sections.length > 1,
        hasSummary: chapter.sections.some((s) =>
          /summary|conclusion/i.test(s.heading)
        ),
        hasReview: chapter.sections.some((s) =>
          /review|practice|questions/i.test(s.heading)
        ),
        scaffoldingScore: 0.5,
      },
      transitionQuality: 0.5,
      conceptualization: "moderate",
    };

    return {
      chapterId: chapter.id,
      timestamp: new Date(),
      overallScore,
      principles: principleEvaluations,
      conceptAnalysis,
      structureAnalysis,
      recommendations,
      visualizations: visualization,
    } as ChapterAnalysis;
  }

  private static runEvaluators(
    chapter: Chapter,
    conceptGraph: ConceptGraph
  ): PrincipleEvaluation[] {
    const evaluators = [
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
    ];

    return evaluators.map((E) => E.evaluate(chapter, conceptGraph));
  }

  private static calculateWeightedScoreDisplay(
    principles: PrincipleScoreDisplay[]
  ): number {
    if (!principles || principles.length === 0) return 0;
    const total = principles.reduce(
      (sum, p) => sum + p.score * (p.weight ?? 1),
      0
    );
    const weightSum = principles.reduce((sum, p) => sum + (p.weight ?? 1), 0);
    return Math.round(total / Math.max(1, weightSum));
  }

  private static generateVisualization(
    chapter: Chapter,
    conceptGraph: ConceptGraph,
    principles: PrincipleScoreDisplay[],
    reviewPatterns: ReviewPattern[]
  ): AnalysisVisualization {
    const cognitiveLoadCurve = this.estimateCognitiveLoad(
      chapter,
      conceptGraph
    );
    const interleavingPattern = this.estimateInterleavingPattern(
      chapter,
      conceptGraph
    );

    const reviewSchedule = this.estimateReviewSchedule(reviewPatterns);

    return {
      conceptMap: {
        nodes: conceptGraph.concepts.map((concept) => ({
          id: concept.id,
          label: concept.name,
          importance: concept.importance,
          size: concept.mentions.length,
          color: "#000000",
          firstMention: concept.firstMentionPosition,
        })),
        links: conceptGraph.relationships.map((rel) => ({
          source: rel.source,
          target: rel.target,
          type: rel.type,
          strength: rel.strength,
        })),
        clusters: [],
      },
      cognitiveLoadCurve,
      interleavingPattern,
      reviewSchedule,
      principleScores: {
        principles,
        overallWeightedScore: 0,
        strongestPrinciples: [],
        weakestPrinciples: [],
      },
    };
  }

  /**
   * Estimate cognitive load per section using a simple weighted heuristic.
   * Factors (normalized 0-1): novel concepts, concept density, sentence complexity, technical terms.
   */
  private static estimateCognitiveLoad(
    chapter: Chapter,
    conceptGraph: ConceptGraph
  ) {
    const sections = chapter.sections;

    // Precompute concept mentions by section boundaries
    const conceptMentionsPerSection: number[] = sections.map((s) => 0);
    for (const concept of conceptGraph.concepts) {
      for (const m of concept.mentions) {
        const idx = sections.findIndex(
          (s) => m.position >= s.startPosition && m.position <= s.endPosition
        );
        if (idx >= 0) conceptMentionsPerSection[idx]++;
      }
    }

    // Compute raw metrics per section
    const rawNovel: number[] = sections.map((s) => s.conceptsIntroduced.length);
    const rawDensityPer100: number[] = sections.map((s, i) => {
      const words = Math.max(1, s.wordCount || this.countWords(s.content));
      return (conceptMentionsPerSection[i] / words) * 100;
    });
    const rawAvgSentenceLen: number[] = sections.map((s) =>
      this.avgSentenceLength(s.content)
    );
    const rawTechPer100: number[] = sections.map((s) => {
      const words = this.tokenizeWords(s.content);
      const technical = words.filter((w) => this.isTechnicalToken(w)).length;
      const denom = Math.max(1, words.length);
      return (technical / denom) * 100;
    });

    // Normalization helpers
    const maxNovel = Math.max(0, ...rawNovel);
    const maxDensity = Math.max(0.0001, ...rawDensityPer100);
    const novelNorm = rawNovel.map((v) => (maxNovel > 0 ? v / maxNovel : 0));
    // Cap density at 1 using observed max to prevent extreme spikes
    const densityNorm = rawDensityPer100.map((v) =>
      Math.min(1, v / maxDensity)
    );
    // Map avg sentence length roughly: 12 (low) -> 0, 30 (high) -> 1
    const complexityNorm = rawAvgSentenceLen.map((len) => {
      const n = (len - 12) / (30 - 12);
      return this.clamp(n, 0, 1);
    });
    // Technical terms per 100 words: cap at 5/100 -> 1
    const technicalNorm = rawTechPer100.map((v) => Math.min(1, v / 5));

    // Weights sum to 1
    const W = {
      novel: 0.3,
      density: 0.25,
      complexity: 0.25,
      technical: 0.2,
    } as const;

    return sections.map((s, i) => {
      const load =
        W.novel * novelNorm[i] +
        W.density * densityNorm[i] +
        W.complexity * complexityNorm[i] +
        W.technical * technicalNorm[i];

      return {
        sectionId: s.id,
        position: s.startPosition || 0,
        load: this.clamp(load, 0, 1),
        factors: {
          novelConcepts: rawNovel[i],
          conceptDensity: Number(densityNorm[i].toFixed(2)),
          sentenceComplexity: Number(complexityNorm[i].toFixed(2)),
          technicalTerms: Number(technicalNorm[i].toFixed(2)),
        },
      };
    });
  }

  // ---------- Local utilities ----------
  private static clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }

  private static tokenizeWords(text: string): string[] {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\-\u0370-\u03FF\s]/g, " ") // keep greek range
      .split(/\s+/)
      .filter(Boolean);
  }

  private static countWords(text: string): number {
    return this.tokenizeWords(text).length;
  }

  private static avgSentenceLength(text: string): number {
    if (!text) return 0;
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const words = this.countWords(text);
    const sCount = Math.max(1, sentences.length);
    return words / sCount;
  }

  private static isTechnicalToken(token: string): boolean {
    if (!token) return false;
    // Heuristics: long words, embedded digits/symbols, greek letters, hyphenated compounds
    const hasDigit = /\d/.test(token);
    const hasGreek = /[\u0370-\u03FF]/.test(token);
    const longWord = token.length >= 12;
    const hasHyphen = /.+-.+/.test(token);
    return longWord || hasDigit || hasGreek || hasHyphen;
  }

  /**
   * Build review schedule data from review patterns.
   * optimalSpacing: median of avgSpacing for concepts with >=2 mentions.
   * currentAvgSpacing: overall average of avgSpacing values (>=2 mentions).
   */
  private static estimateReviewSchedule(
    patterns: ReviewPattern[]
  ): ReviewScheduleData {
    if (!patterns || patterns.length === 0) {
      return {
        concepts: [],
        optimalSpacing: 0,
        currentAvgSpacing: 0,
      };
    }
    const multiMention = patterns.filter((p) => p.mentions >= 2);
    const spacings = multiMention.map((p) => p.avgSpacing).filter((v) => v > 0);
    spacings.sort((a, b) => a - b);
    const median = spacings.length
      ? spacings[Math.floor(spacings.length / 2)]
      : 0;
    const avg = spacings.length
      ? spacings.reduce((a, b) => a + b, 0) / spacings.length
      : 0;

    return {
      concepts: patterns.map((p) => ({
        conceptId: p.conceptId,
        mentions: p.mentions,
        spacing: p.spacing,
        isOptimal: p.isOptimal,
      })),
      optimalSpacing: Math.round(median),
      currentAvgSpacing: Math.round(avg),
    };
  }

  /**
   * Estimate interleaving pattern by analyzing sequence of concept mentions.
   * Creates blocking segments (>=3 consecutive identical concept mentions).
   */
  private static estimateInterleavingPattern(
    chapter: Chapter,
    conceptGraph: ConceptGraph
  ) {
    const mentionEvents: { conceptId: string; position: number }[] = [];
    for (const c of conceptGraph.concepts) {
      for (const m of c.mentions) {
        mentionEvents.push({ conceptId: c.id, position: m.position });
      }
    }
    mentionEvents.sort((a, b) => a.position - b.position);
    const totalMentions = mentionEvents.length;
    if (totalMentions === 0) {
      return {
        conceptSequence: [],
        blockingSegments: [],
        blockingRatio: 0,
        topicSwitches: 0,
        avgBlockSize: 0,
        recommendation: "No concept mentions detected.",
      };
    }
    const sequence = mentionEvents.map((e) => e.conceptId);
    const blocks: {
      conceptId: string;
      length: number;
      startPosition: number;
      endPosition: number;
    }[] = [];
    let i = 0;
    while (i < sequence.length) {
      const conceptId = sequence[i];
      const startIdx = i;
      let j = i + 1;
      while (j < sequence.length && sequence[j] === conceptId) j++;
      const endIdx = j - 1;
      blocks.push({
        conceptId,
        length: endIdx - startIdx + 1,
        startPosition: mentionEvents[startIdx].position,
        endPosition: mentionEvents[endIdx].position,
      });
      i = j;
    }
    const BLOCK_THRESHOLD = 3;
    const blockingBlocks = blocks.filter((b) => b.length >= BLOCK_THRESHOLD);
    const mentionsInBlocking = blockingBlocks.reduce(
      (sum, b) => sum + b.length,
      0
    );
    const blockingRatio = mentionsInBlocking / totalMentions;
    let topicSwitches = 0;
    for (let k = 1; k < sequence.length; k++) {
      if (sequence[k] !== sequence[k - 1]) topicSwitches++;
    }
    const avgBlockSize =
      blocks.reduce((sum, b) => sum + b.length, 0) / Math.max(1, blocks.length);
    let recommendation = "";
    if (totalMentions < 5) {
      recommendation = "Few mentions detected; interleaving signal is weak.";
    } else if (blockingRatio > 0.5) {
      const worst = blockingBlocks.sort((a, b) => b.length - a.length)[0];
      recommendation = `High blocking detected (${Math.round(
        blockingRatio * 100
      )}%). Break up large blocks like ${worst.conceptId} (run of ${
        worst.length
      }).`;
    } else if (blockingRatio > 0.3) {
      recommendation = `Moderate blocking (${Math.round(
        blockingRatio * 100
      )}%). Consider interleaving shorter segments.`;
    } else {
      recommendation =
        "Good interleaving; keep mixing topics where appropriate.";
    }
    return {
      conceptSequence: sequence,
      blockingSegments: blockingBlocks.map((b) => ({
        startPosition: b.startPosition,
        endPosition: b.endPosition,
        conceptId: b.conceptId,
        length: b.length,
        issue: "blocking",
      })),
      blockingRatio,
      topicSwitches,
      avgBlockSize,
      recommendation,
    };
  }
}
