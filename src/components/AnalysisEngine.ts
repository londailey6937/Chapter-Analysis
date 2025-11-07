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

    // Generate visualization data
    const visualization = this.generateVisualization(
      chapter,
      conceptGraph,
      principleDisplay
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

    // Build concept analysis (basic defaults from graph/metrics)
    const conceptAnalysis: ConceptAnalysisResult = {
      totalConceptsIdentified: conceptGraph.concepts.length,
      coreConceptCount: conceptGraph.hierarchy.core.length,
      conceptDensity: metrics.conceptDensity,
      novelConceptsPerSection: chapter.sections.map(
        (s) => s.conceptsIntroduced.length
      ),
      reviewPatterns: [] as ReviewPattern[],
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
    principles: PrincipleScoreDisplay[]
  ): AnalysisVisualization {
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
      cognitiveLoadCurve: chapter.sections.map((section) => ({
        sectionId: section.id,
        position: 0,
        load: 0,
        factors: {
          novelConcepts: 0,
          conceptDensity: 0,
          sentenceComplexity: 0,
          technicalTerms: 0,
        },
      })),
      interleavingPattern: {
        conceptSequence: conceptGraph.sequence,
        blockingSegments: [],
        blockingRatio: 0,
        topicSwitches: 0,
        avgBlockSize: 0,
        recommendation: "",
      },
      reviewSchedule: {
        concepts: [],
        optimalSpacing: 0,
        currentAvgSpacing: 0,
      },
      principleScores: {
        principles,
        overallWeightedScore: 0,
        strongestPrinciples: [],
        weakestPrinciples: [],
      },
    };
  }
}
