/**
 * Chapter Analysis Engine
 * Orchestrates concept extraction, principle evaluation, and report generation
 */

import type {
  Chapter,
  ChapterAnalysis,
  ConceptGraph,
  PrincipleScore,
  AnalysisVisualization,
  Recommendation,
  Suggestion,
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

    // Evaluate all learning principles
    const principles = this.evaluateAllPrinciples(chapter, conceptGraph);

    // Generate visualization data
    const visualization = this.generateVisualization(
      chapter,
      conceptGraph,
      principles
    );

    // Build recommendations based on principle scores and suggestions
    const recommendations: Recommendation[] = principles.flatMap((p) =>
      (p.suggestions || [])
        .filter((s: Suggestion) => s.priority === "high" || p.score < 0.7)
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

    const overallScore = this.calculateWeightedScore(principles);

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

    return {
      chapterId: chapter.id,
      overallScore,
      principleScores: principles,
      recommendations,
      conceptGraph,
      metrics,
      timestamp: new Date(),
      visualization,
    };
  }

  private static evaluateAllPrinciples(
    chapter: Chapter,
    conceptGraph: ConceptGraph
  ): PrincipleScore[] {
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

    const evaluations = evaluators.map((E) =>
      E.evaluate(chapter, conceptGraph)
    );

    // Map PrincipleEvaluation -> PrincipleScore shape
    const principleScores: PrincipleScore[] = evaluations.map((ev: any) => ({
      principleId: ev.principle,
      principle: ev.principle,
      score: ev.score,
      weight: ev.weight ?? 1,
      details: (ev.findings || []).map((f: any) => f.message || String(f)),
      suggestions: ev.suggestions || [],
      timestamp: new Date(),
    }));

    return principleScores;
  }

  private static calculateWeightedScore(principles: PrincipleScore[]): number {
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
    principles: PrincipleScore[]
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
        principles: principles.map((p) => ({
          name: p.principleId,
          displayName: p.principleId,
          score: p.score,
          weight: 1,
        })),
        overallWeightedScore: 0,
        strongestPrinciples: [],
        weakestPrinciples: [],
      },
    };
  }
}
