/**
 * Core Type Definitions for Chapter Checker Application
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the application for type safety and IDE autocompletion.
 */

// ============================================================================
// CONCEPT & KNOWLEDGE STRUCTURE
// ============================================================================

/**
 * Individual mention of a concept in the chapter
 */
export interface ConceptMention {
  position: number;
  context: string;
  depth: 'shallow' | 'moderate' | 'deep';
  isRevisit: boolean;
  associatedConcepts: string[];
}

/**
 * Represents a key concept identified in the chapter
 */
export interface Concept {
  id: string;
  name: string;
  definition: string;
  importance: 'core' | 'supporting' | 'detail';
  firstMentionPosition: number;
  mentions: ConceptMention[];
  relatedConcepts: string[];
  prerequisites: string[];
  applications: string[];
  commonMisconceptions: string[];
}

/**
 * Relationship between two concepts
 */
export interface ConceptRelationship {
  source: string;
  target: string;
  type: 'prerequisite' | 'related' | 'contrasts' | 'extends' | 'example';
  strength: number;
}

/**
 * Hierarchy organization of concepts
 */
export interface ConceptHierarchy {
  core: Concept[];
  supporting: Concept[];
  detail: Concept[];
}

/**
 * Complete concept graph for a chapter
 */
export interface ConceptGraph {
  concepts: Concept[];
  relationships: ConceptRelationship[];
  hierarchy: ConceptHierarchy;
  sequence: string[];
}

// ============================================================================
// CHAPTER STRUCTURE
// ============================================================================

/**
 * Metadata about the chapter
 */
export interface ChapterMetadata {
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  domain: string;
  targetAudience: string;
  estimatedReadingTime: number;
  createdAt: Date;
  lastAnalyzed: Date;
}

/**
 * Individual section within a chapter
 */
export interface Section {
  id: string;
  heading: string;
  content: string;
  startPosition: number;
  endPosition: number;
  wordCount: number;
  conceptsIntroduced: string[];
  conceptsRevisited: string[];
  depth: number;
}

/**
 * Complete chapter data
 */
export interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  sections: Section[];
  conceptGraph: ConceptGraph;
  metadata: ChapterMetadata;
}

// ============================================================================
// LEARNING PRINCIPLE EVALUATION
// ============================================================================

/**
 * Learning principle type
 */
export type LearningPrinciple =
  | 'deepProcessing'
  | 'spacedRepetition'
  | 'retrievalPractice'
  | 'interleaving'
  | 'dualCoding'
  | 'generativeLearning'
  | 'metacognition'
  | 'schemaBuilding'
  | 'cognitiveLoad'
  | 'emotionAndRelevance';

/**
 * Finding from principle evaluation
 */
export interface Finding {
  type: 'positive' | 'warning' | 'neutral' | 'critical';
  message: string;
  severity: number;
  location?: {
    sectionId: string;
    position: number;
  };
  evidence: string;
}

/**
 * Suggestion for improvement
 */
export interface Suggestion {
  id: string;
  principle: LearningPrinciple;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementation: string;
  expectedImpact: string;
  relatedConcepts: string[];
  examples?: string[];
}

/**
 * Supporting evidence for evaluation
 */
export interface Evidence {
  type: 'count' | 'metric' | 'pattern' | 'absence';
  metric: string;
  value: number | string;
  threshold?: number;
  quality: 'strong' | 'moderate' | 'weak';
}

/**
 * Evaluation of a single learning principle
 */
export interface PrincipleEvaluation {
  principle: LearningPrinciple;
  score: number;
  weight: number;
  findings: Finding[];
  suggestions: Suggestion[];
  evidence: Evidence[];
}

// ============================================================================
// ANALYSIS RESULTS
// ============================================================================

/**
 * Pattern of concept review/mention
 */
export interface ReviewPattern {
  conceptId: string;
  mentions: number;
  firstAppearance: number;
  spacing: number[];
  avgSpacing: number;
  isOptimal: boolean;
  recommendation?: string;
}

/**
 * Concept analysis results
 */
export interface ConceptAnalysisResult {
  totalConceptsIdentified: number;
  coreConceptCount: number;
  conceptDensity: number;
  novelConceptsPerSection: number[];
  reviewPatterns: ReviewPattern[];
  hierarchyBalance: number;
  orphanConcepts: string[];
}

/**
 * Scaffolding analysis
 */
export interface ScaffoldingAnalysis {
  hasIntroduction: boolean;
  hasProgression: boolean;
  hasSummary: boolean;
  hasReview: boolean;
  scaffoldingScore: number;
}

/**
 * Chapter structure analysis results
 */
export interface StructureAnalysisResult {
  sectionCount: number;
  avgSectionLength: number;
  sectionLengthVariance: number;
  pacing: 'slow' | 'moderate' | 'fast';
  scaffolding: ScaffoldingAnalysis;
  transitionQuality: number;
  conceptualization: 'shallow' | 'moderate' | 'deep';
}

/**
 * Recommendation for improvement
 */
export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'restructure' | 'enhance' | 'add' | 'clarify' | 'remove';
  title: string;
  description: string;
  affectedSections: string[];
  affectedConcepts: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  expectedOutcome: string;
  actionItems: string[];
}

// ============================================================================
// VISUALIZATIONS
// ============================================================================

/**
 * Node in concept map
 */
export interface ConceptNode {
  id: string;
  label: string;
  importance: 'core' | 'supporting' | 'detail';
  size: number;
  color: string;
  firstMention: number;
}

/**
 * Link in concept map
 */
export interface ConceptLink {
  source: string;
  target: string;
  type: 'prerequisite' | 'related' | 'contrasts' | 'extends' | 'example';
  strength: number;
}

/**
 * Cluster of related concepts
 */
export interface ConceptCluster {
  id: string;
  conceptIds: string[];
  theme: string;
  centroid: { x: number; y: number };
}

/**
 * Concept map visualization data
 */
export interface ConceptMapData {
  nodes: ConceptNode[];
  links: ConceptLink[];
  clusters: ConceptCluster[];
}

/**
 * Single point on cognitive load curve
 */
export interface CognitiveLoadPoint {
  sectionId: string;
  position: number;
  load: number;
  factors: {
    novelConcepts: number;
    conceptDensity: number;
    sentenceComplexity: number;
    technicalTerms: number;
  };
}

/**
 * Blocking segment in interleaving analysis
 */
export interface BlockingSegment {
  startPosition: number;
  endPosition: number;
  conceptId: string;
  length: number;
  issue: string;
}

/**
 * Interleaving pattern data
 */
export interface InterleavingData {
  conceptSequence: string[];
  blockingSegments: BlockingSegment[];
  blockingRatio: number;
  topicSwitches: number;
  avgBlockSize: number;
  recommendation: string;
}

/**
 * Concept for review schedule
 */
export interface ReviewConcept {
  conceptId: string;
  mentions: number;
  spacing: number[];
  isOptimal: boolean;
}

/**
 * Review schedule data
 */
export interface ReviewScheduleData {
  concepts: ReviewConcept[];
  optimalSpacing: number;
  currentAvgSpacing: number;
}

/**
 * Single principle score for display
 */
export interface PrincipleScoreDisplay {
  name: LearningPrinciple;
  displayName: string;
  score: number;
  weight: number;
}

/**
 * Principle scores visualization data
 */
export interface PrincipleScoreData {
  principles: PrincipleScoreDisplay[];
  overallWeightedScore: number;
  strongestPrinciples: LearningPrinciple[];
  weakestPrinciples: LearningPrinciple[];
}

/**
 * All visualization data
 */
export interface AnalysisVisualization {
  conceptMap: ConceptMapData;
  cognitiveLoadCurve: CognitiveLoadPoint[];
  interleavingPattern: InterleavingData;
  reviewSchedule: ReviewScheduleData;
  principleScores: PrincipleScoreData;
}

// ============================================================================
// COMPLETE ANALYSIS RESULT
// ============================================================================

/**
 * Complete chapter analysis result
 */
export interface ChapterAnalysis {
  chapterId: string;
  timestamp: Date;
  overallScore: number;
  principles: PrincipleEvaluation[];
  conceptAnalysis: ConceptAnalysisResult;
  structureAnalysis: StructureAnalysisResult;
  recommendations: Recommendation[];
  visualizations: AnalysisVisualization;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Analysis configuration
 */
export interface AnalysisConfig {
  domain: string;
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  focusPrinciples?: LearningPrinciple[];
  enableVisualization: boolean;
  conceptExtractionThreshold: number;
  detailedReport: boolean;
}

/**
 * Export options
 */
export interface ExportData {
  format: 'json' | 'markdown' | 'html';
  includeVisualizations: boolean;
  includeSuggestions: boolean;
  includeEvidence: boolean;
}
