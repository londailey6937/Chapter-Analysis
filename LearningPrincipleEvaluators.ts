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
} from "./index";

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
    const isLiterature =
      chapter.metadata?.domain?.toLowerCase() === "literature";

    // NEW: Bloom's Taxonomy Classification
    const bloomsAnalysis = this.classifyQuestionsByBloomsLevel(chapter.content);
    evidence.push({
      type: "metric",
      metric: "blooms_higher_order",
      value: bloomsAnalysis.higherOrderPercentage,
      threshold: 40,
      quality:
        bloomsAnalysis.higherOrderPercentage >= 40
          ? "strong"
          : bloomsAnalysis.higherOrderPercentage >= 25
          ? "moderate"
          : "weak",
    });

    if (bloomsAnalysis.higherOrderPercentage < 25) {
      findings.push({
        type: "critical",
        message: isLiterature
          ? `Only ${bloomsAnalysis.higherOrderPercentage.toFixed(
              0
            )}% of prompts encourage analytical or interpretive thinking`
          : `Only ${bloomsAnalysis.higherOrderPercentage.toFixed(
              0
            )}% of questions target higher-order thinking (Analyze/Evaluate/Create)`,
        severity: 0.85,
        evidence: `Found: ${bloomsAnalysis.analyze} analyze, ${bloomsAnalysis.evaluate} evaluate, ${bloomsAnalysis.create} create questions`,
      });
    } else if (bloomsAnalysis.higherOrderPercentage >= 40) {
      findings.push({
        type: "positive",
        message: isLiterature
          ? `✓ Excellent: ${bloomsAnalysis.higherOrderPercentage.toFixed(
              0
            )}% of prompts promote close reading and critical interpretation`
          : `✓ Excellent: ${bloomsAnalysis.higherOrderPercentage.toFixed(
              0
            )}% of questions promote higher-order thinking`,
        severity: 0,
        evidence: `Strong balance across Bloom's levels (Apply: ${bloomsAnalysis.apply}, Analyze: ${bloomsAnalysis.analyze}, Evaluate: ${bloomsAnalysis.evaluate}, Create: ${bloomsAnalysis.create})`,
      });
    }

    // NEW: Elaborative Interrogation Detection
    const elaborativeQuestions = this.detectElaborativeInterrogation(
      chapter.content
    );
    evidence.push({
      type: "count",
      metric: "elaborative_interrogation",
      value: elaborativeQuestions.count,
      threshold: Math.ceil(chapter.sections.length * 1.5),
      quality:
        elaborativeQuestions.count >= chapter.sections.length
          ? "strong"
          : "weak",
    });

    if (elaborativeQuestions.count < chapter.sections.length) {
      findings.push({
        type: "warning",
        message: "Limited elaborative interrogation prompts",
        severity: 0.7,
        evidence: `Only ${elaborativeQuestions.count} "why/how/what if" prompts encourage explanation generation`,
      });
    }

    // NEW: Worked Example Detection (skip for literature)
    if (!isLiterature) {
      const workedExamples = this.detectWorkedExamples(chapter.content);
      evidence.push({
        type: "count",
        metric: "worked_examples",
        value: workedExamples.count,
        threshold: Math.max(2, Math.ceil(chapter.sections.length / 3)),
        quality: workedExamples.count >= 2 ? "strong" : "weak",
      });

      if (workedExamples.count === 0) {
        findings.push({
          type: "warning",
          message: "No worked examples with step-by-step reasoning",
          severity: 0.65,
          evidence: "Worked examples model expert thinking patterns",
        });
      } else {
        findings.push({
          type: "positive",
          message: `✓ Found ${workedExamples.count} worked examples modeling problem-solving`,
          severity: 0,
          evidence: workedExamples.examples.slice(0, 2).join("; "),
        });
      }
    }

    // NEW: Explanation Depth Analysis
    const explanationDepth = this.measureExplanationDepth(
      chapter.content,
      concepts
    );
    evidence.push({
      type: "metric",
      metric: "explanation_depth_score",
      value: explanationDepth.avgDepth,
      threshold: 3,
      quality:
        explanationDepth.avgDepth >= 3
          ? "strong"
          : explanationDepth.avgDepth >= 2
          ? "moderate"
          : "weak",
    });

    if (explanationDepth.avgDepth < 2) {
      findings.push({
        type: "warning",
        message: isLiterature
          ? "Shallow analysis - literary elements lack multi-level interpretation"
          : "Shallow explanations - concepts lack multi-level elaboration",
        severity: 0.6,
        evidence: isLiterature
          ? `Average depth: ${explanationDepth.avgDepth.toFixed(
              1
            )}/5 (identification → context → analysis → connection → interpretation)`
          : `Average depth: ${explanationDepth.avgDepth.toFixed(
              1
            )}/5 (definition → example → mechanism → connection → application)`,
      });
    }

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

    // Calculate score (enhanced with new metrics)
    let score = 30; // Base score

    // Bloom's taxonomy (0-25 points)
    score += bloomsAnalysis.higherOrderPercentage * 0.25;

    // Elaborative interrogation (0-15 points)
    const elaborationRatio =
      elaborativeQuestions.count / Math.max(chapter.sections.length, 1);
    score += Math.min(elaborationRatio * 10, 15);

    // Worked examples (0-10 points) - only for non-literature
    if (!isLiterature) {
      const workedExamples = this.detectWorkedExamples(chapter.content);
      score += Math.min(workedExamples.count * 3, 10);
    } else {
      // For literature, give baseline points since worked examples don't apply
      score += 8;
    }

    // Explanation depth (0-15 points)
    score += explanationDepth.avgDepth * 3;

    // Original metrics (0-35 points)
    score += whyHowQuestions > 0 ? 10 : 0;
    score +=
      explanationMethods.uniqueMethods >= 3
        ? 10
        : explanationMethods.uniqueMethods >= 2
        ? 5
        : 0;
    score += connections.count > 2 ? 8 : connections.count > 0 ? 4 : 0;
    score += analogies.count > 0 ? 7 : 0;
    score = Math.min(score, 100);

    const suggestions: Suggestion[] = [];

    if (bloomsAnalysis.higherOrderPercentage < 25) {
      suggestions.push({
        id: "deep-proc-0",
        principle: "deepProcessing",
        priority: "high",
        title: isLiterature
          ? "Elevate to Deeper Literary Analysis"
          : "Elevate to Higher-Order Thinking",
        description: isLiterature
          ? "Add more prompts that require close reading, interpretation, and textual analysis"
          : "Add more questions that require analysis, evaluation, and creation (Bloom's higher levels)",
        implementation: isLiterature
          ? 'Replace "Who is the narrator?" with "How does the narrative perspective shape the reader\'s understanding?", "What does this symbolize and why?", "How do these themes interconnect?"'
          : 'Replace "What is X?" with "How does X compare to Y?", "Why would X be more effective than Y?", "Design a solution using X"',
        expectedImpact: isLiterature
          ? "Promotes critical interpretation and deeper textual engagement"
          : "Promotes critical thinking and deeper understanding rather than memorization",
        relatedConcepts: concepts.hierarchy.core.map((c) => c.id),
        examples: isLiterature
          ? [
              "Analyze: How does the author use imagery to convey meaning?",
              "Evaluate: Which interpretation is better supported by the text?",
              "Create: Write an alternative ending that maintains thematic consistency",
            ]
          : [
              "Analyze: Compare and contrast X with Y",
              "Evaluate: Which approach would be most effective and why?",
              "Create: Design an experiment to test this hypothesis",
            ],
      });
    }

    // Only suggest worked examples for non-literature domains
    if (!isLiterature) {
      const workedExamples = this.detectWorkedExamples(chapter.content);
      if (workedExamples.count === 0) {
        suggestions.push({
          id: "deep-proc-0.5",
          principle: "deepProcessing",
          priority: "high",
          title: "Add Worked Examples",
          description:
            "Include step-by-step demonstrations that model expert problem-solving",
          implementation:
            'Create examples with explicit reasoning: "Step 1: First, we identify... Step 2: Next, we apply... because..."',
          expectedImpact:
            "Learners observe expert thinking patterns and build mental models for problem-solving",
          relatedConcepts: concepts.hierarchy.core.map((c) => c.id).slice(0, 3),
          examples: [
            "Example 1: Let's solve this problem step-by-step...",
            "Work through: How would an expert approach this?",
            "Demonstration: Watch how we break this down systematically",
          ],
        });
      }
    }

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

  // NEW: Bloom's Taxonomy Classification
  private static classifyQuestionsByBloomsLevel(text: string): {
    remember: number;
    understand: number;
    apply: number;
    analyze: number;
    evaluate: number;
    create: number;
    higherOrderPercentage: number;
  } {
    // Remember: recall facts, terms, basic concepts
    const rememberPatterns = [
      /what is\s+(?:the\s+)?definition/gi,
      /list\s+(?:the|all)/gi,
      /name\s+(?:the|all)/gi,
      /identify\s+(?:the|all)/gi,
      /recall/gi,
      /define/gi,
    ];

    // Understand: explain ideas, summarize
    const understandPatterns = [
      /explain\s+(?:why|how|what)/gi,
      /describe\s+(?:the|how)/gi,
      /summarize/gi,
      /paraphrase/gi,
      /what does\s+\w+\s+mean/gi,
    ];

    // Apply: use information in new situations
    const applyPatterns = [
      /apply\s+this/gi,
      /use\s+(?:the|this|these)/gi,
      /demonstrate/gi,
      /solve\s+(?:the|this)/gi,
      /calculate/gi,
      /how would you\s+(?:use|apply)/gi,
    ];

    // Analyze: draw connections, examine structure
    const analyzePatterns = [
      /analyze/gi,
      /compare\s+(?:and\s+contrast)?/gi,
      /categorize/gi,
      /what is the relationship/gi,
      /distinguish\s+between/gi,
      /examine/gi,
      /why\s+(?:does|do|is|are)/gi,
    ];

    // Evaluate: justify decisions, critique
    const evaluatePatterns = [
      /evaluate/gi,
      /judge/gi,
      /critique/gi,
      /justify/gi,
      /which is better/gi,
      /assess/gi,
      /defend/gi,
      /what would you recommend/gi,
    ];

    // Create: produce new work, design
    const createPatterns = [
      /create/gi,
      /design/gi,
      /construct/gi,
      /develop\s+a/gi,
      /propose/gi,
      /formulate/gi,
      /generate\s+a/gi,
      /what if/gi,
    ];

    const countMatches = (patterns: RegExp[]) =>
      patterns.reduce((sum, p) => sum + (text.match(p) || []).length, 0);

    const remember = countMatches(rememberPatterns);
    const understand = countMatches(understandPatterns);
    const apply = countMatches(applyPatterns);
    const analyze = countMatches(analyzePatterns);
    const evaluate = countMatches(evaluatePatterns);
    const create = countMatches(createPatterns);

    const total = remember + understand + apply + analyze + evaluate + create;
    const higherOrder = analyze + evaluate + create;
    const higherOrderPercentage = total > 0 ? (higherOrder / total) * 100 : 0;

    return {
      remember,
      understand,
      apply,
      analyze,
      evaluate,
      create,
      higherOrderPercentage,
    };
  }

  // NEW: Detect Elaborative Interrogation (prompts that encourage explanation)
  private static detectElaborativeInterrogation(text: string): {
    count: number;
    examples: string[];
  } {
    const patterns = [
      /why\s+(?:is|are|does|do|would|might|should)/gi,
      /how\s+(?:does|do|would|might|could|can)/gi,
      /what\s+if/gi,
      /what\s+causes/gi,
      /what\s+would\s+happen\s+if/gi,
      /explain\s+why/gi,
      /can\s+you\s+explain/gi,
    ];

    let count = 0;
    const examples: string[] = [];

    patterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      count += matches.length;
      if (matches.length > 0 && matches[0]) {
        examples.push(matches[0]);
      }
    });

    return { count, examples: examples.slice(0, 3) };
  }

  // NEW: Detect Worked Examples (step-by-step demonstrations)
  private static detectWorkedExamples(text: string): {
    count: number;
    examples: string[];
  } {
    const patterns = [
      /(?:step\s+\d+|first|second|third|next|then|finally)/gi,
      /(?:let's\s+)?work\s+through/gi,
      /(?:for\s+)?example[:\s]+/gi,
      /solution:/gi,
      /procedure:/gi,
    ];

    // Look for sequences of step indicators
    const stepSequences = text.match(
      /(?:step\s+1|first).{50,500}(?:step\s+2|second|next)/gi
    );
    const workThroughs = text.match(/work\s+through[^.]{20,200}\./gi);
    const exampleSolutions = text.match(/example[:\s]+[^.]{50,300}\./gi);

    const count =
      (stepSequences?.length || 0) +
      (workThroughs?.length || 0) +
      (exampleSolutions?.length || 0);

    const examples: string[] = [];
    if (stepSequences) examples.push("Multi-step procedure");
    if (workThroughs) examples.push("Worked-through problem");
    if (exampleSolutions) examples.push("Example with solution");

    return { count, examples };
  }

  // NEW: Measure Explanation Depth (layers of explanation)
  private static measureExplanationDepth(
    text: string,
    concepts: ConceptGraph
  ): {
    avgDepth: number;
    depths: number[];
  } {
    const depths: number[] = [];

    // For each core concept, measure explanation depth
    concepts.hierarchy.core.forEach((concept) => {
      let depth = 0;

      // Level 1: Definition present
      if (
        new RegExp(
          `${concept.name}\\s+(?:is|are|refers?\\s+to|means?)`,
          "i"
        ).test(text)
      ) {
        depth++;
      }

      // Level 2: Example provided
      if (
        new RegExp(
          `(?:for\\s+example|such\\s+as|like|e\\.g\\.).*${concept.name}`,
          "i"
        ).test(text)
      ) {
        depth++;
      }

      // Level 3: Mechanism/process explained
      if (
        new RegExp(
          `(?:how|why).*${concept.name}|${concept.name}.*(?:because|works\\s+by|occurs\\s+when)`,
          "i"
        ).test(text)
      ) {
        depth++;
      }

      // Level 4: Connection to other concepts
      if (concept.relatedConcepts && concept.relatedConcepts.length > 0) {
        depth++;
      }

      // Level 5: Application/real-world use
      if (
        new RegExp(
          `(?:apply|use|real-world|practical).*${concept.name}`,
          "i"
        ).test(text)
      ) {
        depth++;
      }

      depths.push(depth);
    });

    const avgDepth =
      depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;

    return { avgDepth, depths };
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

    // NEW: Optimal Spacing Interval Analysis
    const spacingIntervals = this.calculateOptimalSpacingIntervals(
      chapter,
      concepts
    );
    evidence.push({
      type: "metric",
      metric: "optimal_spacing_alignment",
      value: spacingIntervals.alignmentScore,
      threshold: 0.6,
      quality:
        spacingIntervals.alignmentScore >= 0.6
          ? "strong"
          : spacingIntervals.alignmentScore >= 0.4
          ? "moderate"
          : "weak",
    });

    if (spacingIntervals.alignmentScore < 0.4) {
      findings.push({
        type: "critical",
        message: `Poor spacing alignment (${(
          spacingIntervals.alignmentScore * 100
        ).toFixed(0)}%) - concepts not revisited at optimal intervals`,
        severity: 0.85,
        evidence: `Recommended: 1 day, 1 week, 1 month spacing. Found: ${spacingIntervals.actualPattern}`,
      });
    } else if (spacingIntervals.alignmentScore >= 0.7) {
      findings.push({
        type: "positive",
        message: `✓ Excellent spacing: ${(
          spacingIntervals.alignmentScore * 100
        ).toFixed(0)}% alignment with optimal intervals`,
        severity: 0,
        evidence: `Concepts revisited at approximately: ${spacingIntervals.actualPattern}`,
      });
    }

    // NEW: Forgetting Curve Analysis
    const forgettingCurve = this.analyzeForgettingCurve(chapter, concepts);
    evidence.push({
      type: "metric",
      metric: "forgetting_prevention_score",
      value: forgettingCurve.preventionScore,
      threshold: 0.65,
      quality: forgettingCurve.preventionScore >= 0.65 ? "strong" : "moderate",
    });

    if (forgettingCurve.preventionScore < 0.5) {
      findings.push({
        type: "warning",
        message:
          "High forgetting risk - concepts not reinforced before memory decay",
        severity: 0.75,
        evidence: `${forgettingCurve.conceptsAtRisk} concepts likely forgotten before re-encountered`,
      });
    }

    // NEW: Massed vs. Distributed Practice Detection
    const practiceType = this.detectMassedVsDistributed(chapter, concepts);
    evidence.push({
      type: "metric",
      metric: "distributed_practice_ratio",
      value: practiceType.distributedRatio,
      threshold: 0.7,
      quality:
        practiceType.distributedRatio >= 0.7
          ? "strong"
          : practiceType.distributedRatio >= 0.5
          ? "moderate"
          : "weak",
    });

    if (practiceType.distributedRatio < 0.5) {
      findings.push({
        type: "critical",
        message: `Too much massed practice (${(
          practiceType.massedRatio * 100
        ).toFixed(0)}%) - cramming detected`,
        severity: 0.8,
        evidence: `${practiceType.massedSegments.length} segments show concept clustering without spacing`,
      });
    } else if (practiceType.distributedRatio >= 0.7) {
      findings.push({
        type: "positive",
        message: `✓ Good distribution: ${(
          practiceType.distributedRatio * 100
        ).toFixed(0)}% of practice is spaced`,
        severity: 0,
        evidence: "Concepts spread throughout chapter rather than clustered",
      });
    }

    // Analyze concept mention patterns (existing)
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

    // Calculate score (enhanced with new metrics)
    let score = 20; // Base score

    // Optimal spacing intervals (0-25 points)
    score += spacingIntervals.alignmentScore * 25;

    // Forgetting curve prevention (0-20 points)
    score += forgettingCurve.preventionScore * 20;

    // Distributed vs massed practice (0-20 points)
    score += practiceType.distributedRatio * 20;

    // Original metrics (0-35 points)
    score +=
      conceptMentionStats.avgMentions >= 2 &&
      conceptMentionStats.avgMentions <= 5
        ? 20
        : 8;
    score += spacingAnalysis.evenSpacing ? 15 : 5;
    score = Math.min(score, 100);

    const suggestions: Suggestion[] = [];

    if (spacingIntervals.alignmentScore < 0.4) {
      suggestions.push({
        id: "spaced-rep-0",
        principle: "spacedRepetition",
        priority: "high",
        title: "Implement Optimal Spacing Intervals",
        description:
          "Revisit concepts at scientifically-validated intervals: ~1 day, ~1 week, ~1 month",
        implementation:
          "For each core concept: (1) Initial introduction, (2) Revisit after 300-500 words (minutes later), (3) Mid-chapter callback (days), (4) End-chapter summary (weeks)",
        expectedImpact:
          "Aligns with memory consolidation research - maximizes retention with minimal repetition",
        relatedConcepts: concepts.hierarchy.core.map((c) => c.id),
        examples: [
          "Day 1: Introduce concept\nDay 2-3: Brief review question\nWeek 1: Apply in new context\nMonth 1: Synthesis problem",
        ],
      });
    }

    if (practiceType.distributedRatio < 0.5) {
      suggestions.push({
        id: "spaced-rep-0.5",
        principle: "spacedRepetition",
        priority: "high",
        title: "Reduce Massed Practice",
        description:
          "Break up concept clusters - avoid presenting too much related content at once",
        implementation: `Redistribute the ${practiceType.massedSegments.length} massed practice segments throughout the chapter with spacing between repetitions`,
        expectedImpact:
          "Distributed practice produces 2-3x better long-term retention than cramming",
        relatedConcepts: practiceType.massedConcepts.slice(0, 5),
        examples: [
          "Instead of: A, A, A, B, B, B\nUse: A, B, A, B, A, B (interleaved + spaced)",
        ],
      });
    }

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
      const conceptGaps: number[] = [];

      for (let i = 1; i < positions.length; i++) {
        conceptGaps.push(positions[i] - positions[i - 1]);
      }

      gaps.push(...conceptGaps);

      // Check if gaps are too varied
      if (conceptGaps.length > 0) {
        const avgGap =
          conceptGaps.reduce((a, b) => a + b, 0) / conceptGaps.length;
        const variance =
          conceptGaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) /
          conceptGaps.length;
        if (variance > avgGap * avgGap) {
          unevenConcepts.push(concept.name);
        }
      }
    });

    const avgGap =
      gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
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

  // NEW: Calculate Optimal Spacing Intervals
  private static calculateOptimalSpacingIntervals(
    _chapter: Chapter,
    concepts: ConceptGraph
  ): {
    alignmentScore: number;
    actualPattern: string;
    optimalPattern: string;
  } {
    // Optimal spacing based on research: immediate, ~10min, ~1 day, ~1 week, ~1 month
    // In text: characters represent time (rough proxy)
    // Optimal gaps: 500 chars (minutes), 2000 chars (hours), 5000 chars (days)

    const optimalGaps = [500, 2000, 5000]; // Short, medium, long
    let totalAlignment = 0;
    let conceptsAnalyzed = 0;

    concepts.hierarchy.core.forEach((concept) => {
      if (concept.mentions.length < 2) return;

      const positions = concept.mentions
        .map((m) => m.position)
        .sort((a, b) => a - b);
      const gaps: number[] = [];

      for (let i = 1; i < positions.length; i++) {
        gaps.push(positions[i] - positions[i - 1]);
      }

      // Score each gap against optimal ranges
      gaps.forEach((gap) => {
        let bestMatch = 0;
        optimalGaps.forEach((optimalGap) => {
          const ratio = Math.min(gap, optimalGap) / Math.max(gap, optimalGap);
          bestMatch = Math.max(bestMatch, ratio);
        });
        totalAlignment += bestMatch;
      });

      conceptsAnalyzed += gaps.length;
    });

    const alignmentScore =
      conceptsAnalyzed > 0 ? totalAlignment / conceptsAnalyzed : 0;
    const avgActualGap =
      conceptsAnalyzed > 0 ? (totalAlignment / conceptsAnalyzed) * 2500 : 0;

    return {
      alignmentScore,
      actualPattern:
        avgActualGap > 0
          ? `~${Math.round(avgActualGap)} chars between revisits`
          : "no pattern",
      optimalPattern: "500 (min), 2000 (hours), 5000+ (days) chars",
    };
  }

  // NEW: Analyze Forgetting Curve Alignment
  private static analyzeForgettingCurve(
    _chapter: Chapter,
    concepts: ConceptGraph
  ): {
    preventionScore: number;
    conceptsAtRisk: number;
  } {
    // Forgetting curve: ~50% forgotten after 1 day, ~70% after 1 week without review
    // Estimate: concepts need revisit within ~3000 chars to prevent forgetting

    const FORGETTING_THRESHOLD = 3000; // chars before significant forgetting
    let conceptsAtRisk = 0;
    let totalGaps = 0;
    let safeGaps = 0;

    concepts.hierarchy.core.forEach((concept) => {
      if (concept.mentions.length < 2) {
        conceptsAtRisk++;
        return;
      }

      const positions = concept.mentions
        .map((m) => m.position)
        .sort((a, b) => a - b);

      for (let i = 1; i < positions.length; i++) {
        const gap = positions[i] - positions[i - 1];
        totalGaps++;

        if (gap <= FORGETTING_THRESHOLD) {
          safeGaps++;
        } else {
          // Long gap = forgetting likely occurred
          conceptsAtRisk++;
        }
      }
    });

    const preventionScore = totalGaps > 0 ? safeGaps / totalGaps : 0;

    return {
      preventionScore,
      conceptsAtRisk,
    };
  }

  // NEW: Detect Massed vs Distributed Practice
  private static detectMassedVsDistributed(
    _chapter: Chapter,
    concepts: ConceptGraph
  ): {
    massedRatio: number;
    distributedRatio: number;
    massedSegments: Array<{ concept: string; length: number }>;
    massedConcepts: string[];
  } {
    // Massed practice: 3+ mentions within 1000 characters
    // Distributed practice: mentions spread > 1000 characters apart

    const MASSED_THRESHOLD = 1000;
    let massedCount = 0;
    let distributedCount = 0;
    const massedSegments: Array<{ concept: string; length: number }> = [];
    const massedConcepts: string[] = [];

    concepts.concepts.forEach((concept) => {
      if (concept.mentions.length < 3) {
        distributedCount += concept.mentions.length;
        return;
      }

      const positions = concept.mentions
        .map((m) => m.position)
        .sort((a, b) => a - b);
      let massedStreak = 1;

      for (let i = 1; i < positions.length; i++) {
        const gap = positions[i] - positions[i - 1];

        if (gap <= MASSED_THRESHOLD) {
          massedStreak++;
        } else {
          if (massedStreak >= 3) {
            massedCount += massedStreak;
            massedSegments.push({
              concept: concept.name,
              length: massedStreak,
            });
            massedConcepts.push(concept.name);
          } else {
            distributedCount += massedStreak;
          }
          massedStreak = 1;
        }
      }

      // Handle final streak
      if (massedStreak >= 3) {
        massedCount += massedStreak;
        massedSegments.push({ concept: concept.name, length: massedStreak });
        if (!massedConcepts.includes(concept.name)) {
          massedConcepts.push(concept.name);
        }
      } else {
        distributedCount += massedStreak;
      }
    });

    const total = massedCount + distributedCount;
    const massedRatio = total > 0 ? massedCount / total : 0;
    const distributedRatio = total > 0 ? distributedCount / total : 1;

    return {
      massedRatio,
      distributedRatio,
      massedSegments,
      massedConcepts,
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

    // NEW: Classify Retrieval Types (Recognition vs Recall)
    const retrievalTypes = this.classifyRetrievalTypes(chapter.content);
    evidence.push({
      type: "metric",
      metric: "recall_vs_recognition_ratio",
      value: retrievalTypes.recallRatio,
      threshold: 0.6,
      quality:
        retrievalTypes.recallRatio >= 0.6
          ? "strong"
          : retrievalTypes.recallRatio >= 0.4
          ? "moderate"
          : "weak",
    });

    if (retrievalTypes.recallRatio < 0.4) {
      findings.push({
        type: "warning",
        message: `Too many recognition tasks (${retrievalTypes.recognition}), not enough recall (${retrievalTypes.recall})`,
        severity: 0.7,
        evidence:
          "Recall is 2-3x more effective than recognition for long-term retention",
      });
    } else if (retrievalTypes.recallRatio >= 0.6) {
      findings.push({
        type: "positive",
        message: `✓ Good balance: ${retrievalTypes.recall} recall vs ${retrievalTypes.recognition} recognition tasks`,
        severity: 0,
        evidence: `${(retrievalTypes.recallRatio * 100).toFixed(
          0
        )}% recall-based retrieval promotes deeper encoding`,
      });
    }

    // NEW: Measure Retrieval Strength by Difficulty
    const retrievalStrength = this.assessRetrievalStrength(chapter.content);
    evidence.push({
      type: "metric",
      metric: "retrieval_difficulty_score",
      value: retrievalStrength.difficultyScore,
      threshold: 0.5,
      quality: retrievalStrength.difficultyScore >= 0.5 ? "strong" : "moderate",
    });

    if (retrievalStrength.difficultyScore < 0.3) {
      findings.push({
        type: "warning",
        message: "Retrieval tasks too easy - insufficient desirable difficulty",
        severity: 0.6,
        evidence: `Only ${retrievalStrength.challengingQuestions} challenging questions found`,
      });
    }

    // NEW: Detect Testing Effect Opportunities
    const testingEffect = this.detectTestingEffectOpportunities(
      chapter,
      concepts
    );
    evidence.push({
      type: "count",
      metric: "testing_effect_opportunities",
      value: testingEffect.count,
      threshold: Math.max(3, chapter.sections.length),
      quality:
        testingEffect.count >= chapter.sections.length ? "strong" : "weak",
    });

    if (testingEffect.count < chapter.sections.length) {
      findings.push({
        type: "warning",
        message: `Limited testing effect opportunities (${testingEffect.count} found, ${chapter.sections.length} recommended)`,
        severity: 0.65,
        evidence:
          "Self-testing produces better retention than repeated studying",
      });
    } else {
      findings.push({
        type: "positive",
        message: `✓ Excellent: ${testingEffect.count} testing opportunities throughout`,
        severity: 0,
        evidence: "Regular self-testing triggers the testing effect",
      });
    }

    // NEW: Low-Stakes Testing Detection
    const lowStakesTesting = this.detectLowStakesTesting(chapter.content);
    evidence.push({
      type: "count",
      metric: "low_stakes_tests",
      value: lowStakesTesting.count,
      threshold: 2,
      quality: lowStakesTesting.count >= 2 ? "strong" : "weak",
    });

    if (lowStakesTesting.count === 0) {
      findings.push({
        type: "warning",
        message: "No low-stakes practice tests or self-checks",
        severity: 0.7,
        evidence: 'Add: "Check your understanding" or "Self-quiz" sections',
      });
    }

    // Check 1: Direct questions (original)
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

    // Calculate score (enhanced with new metrics)
    let score = 20; // Base score

    // Recall vs recognition balance (0-20 points)
    score += retrievalTypes.recallRatio * 20;

    // Retrieval difficulty (0-15 points)
    score += retrievalStrength.difficultyScore * 15;

    // Testing effect opportunities (0-20 points)
    const testingRatio =
      testingEffect.count / Math.max(chapter.sections.length, 1);
    score += Math.min(testingRatio, 1) * 20;

    // Low-stakes testing (0-10 points)
    score += Math.min(lowStakesTesting.count * 3, 10);

    // Original metrics (0-35 points)
    score += directQuestions > 0 ? 20 : 0;
    score += summaryPrompts.count > 0 ? 8 : 0;
    score += applicationPrompts.count > 0 ? 7 : 0;
    score = Math.min(score, 100);

    const suggestions: Suggestion[] = [];

    if (retrievalTypes.recallRatio < 0.4) {
      suggestions.push({
        id: "retrieval-0",
        principle: "retrievalPractice",
        priority: "high",
        title: "Shift from Recognition to Recall",
        description:
          "Replace multiple-choice with free recall questions - recall is 2-3x more effective",
        implementation:
          'Instead of "Which is correct: A, B, C?" use "Explain in your own words..." or "List the three main..."',
        expectedImpact:
          "Forces active memory reconstruction rather than passive recognition",
        relatedConcepts: concepts.hierarchy.core.map((c) => c.id),
        examples: [
          "Recall: What are the key components? (vs. Which component: A, B, C?)",
          "Recall: Explain how X works (vs. Is X true or false?)",
          "Recall: Draw a diagram of Y from memory",
        ],
      });
    }

    if (testingEffect.count < chapter.sections.length) {
      suggestions.push({
        id: "retrieval-0.5",
        principle: "retrievalPractice",
        priority: "high",
        title: "Add More Testing Opportunities",
        description:
          "Insert self-test checkpoints after each major section to trigger the testing effect",
        implementation: `Add ${
          chapter.sections.length - testingEffect.count
        } more "Stop and Test Yourself" moments throughout the chapter`,
        expectedImpact:
          "The act of retrieval itself strengthens memory - testing is learning, not just assessment",
        relatedConcepts: testingEffect.missingConcepts.slice(0, 5),
        examples: [
          "Quick Check: Without looking back, list the three principles we just covered",
          "Self-Test: Explain the difference between X and Y from memory",
          "Practice Recall: What real-world example illustrates this concept?",
        ],
      });
    }

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

  // NEW: Classify Retrieval Types (Recognition vs Recall)
  private static classifyRetrievalTypes(text: string): {
    recognition: number;
    recall: number;
    recallRatio: number;
  } {
    // Recognition patterns (multiple choice, true/false, matching)
    const recognitionPatterns = [
      /(?:a\)|b\)|c\)|d\))/gi, // Multiple choice options
      /true\s+or\s+false/gi,
      /match\s+the\s+following/gi,
      /which\s+of\s+the\s+following/gi,
      /select\s+(?:the|all)/gi,
    ];

    // Recall patterns (free response, explain, describe)
    const recallPatterns = [
      /explain\s+(?:why|how|what)/gi,
      /describe\s+(?:the|how)/gi,
      /what\s+(?:are|is)\s+(?:the)?(?!.*(?:a\)|b\)|c\)))/gi, // What is... but not multiple choice
      /list\s+the/gi,
      /define/gi,
      /in\s+your\s+own\s+words/gi,
    ];

    const recognition = recognitionPatterns.reduce(
      (sum, p) => sum + (text.match(p) || []).length,
      0
    );
    const recall = recallPatterns.reduce(
      (sum, p) => sum + (text.match(p) || []).length,
      0
    );
    const total = recognition + recall;
    const recallRatio = total > 0 ? recall / total : 0;

    return { recognition, recall, recallRatio };
  }

  // NEW: Assess Retrieval Strength by Difficulty
  private static assessRetrievalStrength(text: string): {
    difficultyScore: number;
    challengingQuestions: number;
  } {
    // Easy retrieval (direct, single fact)
    const easyPatterns = [
      /what\s+is\s+the\s+definition/gi,
      /true\s+or\s+false/gi,
    ];

    // Moderate retrieval (application, relationships)
    const moderatePatterns = [
      /how\s+does/gi,
      /explain\s+the\s+relationship/gi,
      /compare/gi,
    ];

    // Challenging retrieval (synthesis, evaluation, creation)
    const challengingPatterns = [
      /why\s+would/gi,
      /design\s+a/gi,
      /evaluate/gi,
      /what\s+if/gi,
      /predict/gi,
    ];

    const easy = easyPatterns.reduce(
      (sum, p) => sum + (text.match(p) || []).length,
      0
    );
    const moderate = moderatePatterns.reduce(
      (sum, p) => sum + (text.match(p) || []).length,
      0
    );
    const challenging = challengingPatterns.reduce(
      (sum, p) => sum + (text.match(p) || []).length,
      0
    );

    const total = easy + moderate + challenging;
    // Weight: easy=0.2, moderate=0.5, challenging=1.0
    const difficultyScore =
      total > 0 ? (easy * 0.2 + moderate * 0.5 + challenging * 1.0) / total : 0;

    return { difficultyScore, challengingQuestions: challenging };
  }

  // NEW: Detect Testing Effect Opportunities
  private static detectTestingEffectOpportunities(
    chapter: Chapter,
    concepts: ConceptGraph
  ): {
    count: number;
    missingConcepts: string[];
  } {
    // Testing effect: retrieval attempts after learning
    // Look for self-test prompts, practice problems, review questions
    const testingPatterns = [
      /(?:self-)?test\s+yourself/gi,
      /practice\s+(?:question|problem)/gi,
      /check\s+your\s+understanding/gi,
      /review\s+question/gi,
      /quiz/gi,
    ];

    let count = testingPatterns.reduce(
      (sum, p) => sum + (chapter.content.match(p) || []).length,
      0
    );

    // Also count sections with questions
    chapter.sections.forEach((section) => {
      const questionCount = (section.content.match(/\?/g) || []).length;
      if (questionCount >= 2) {
        count++;
      }
    });

    // Identify concepts without testing opportunities
    const missingConcepts = concepts.hierarchy.core
      .filter((concept) => {
        const conceptPattern = new RegExp(concept.name, "i");
        return !testingPatterns.some((p) => {
          const testSections =
            chapter.content.match(
              new RegExp(`.{0,200}${p.source}.{0,200}`, "gi")
            ) || [];
          return testSections.some((section) => conceptPattern.test(section));
        });
      })
      .map((c) => c.name);

    return { count, missingConcepts };
  }

  // NEW: Detect Low-Stakes Testing
  private static detectLowStakesTesting(text: string): {
    count: number;
    examples: string[];
  } {
    // Low-stakes = practice without consequences, formative assessment
    const patterns = [
      /practice\s+(?:quiz|test|problem)/gi,
      /self-(?:check|quiz|test|assessment)/gi,
      /formative\s+assessment/gi,
      /(?:not\s+graded|no\s+grade|for\s+practice)/gi,
      /check\s+your\s+(?:understanding|knowledge)/gi,
    ];

    let count = 0;
    const examples: string[] = [];

    patterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      count += matches.length;
      if (matches.length > 0 && matches[0]) {
        examples.push(matches[0]);
      }
    });

    return { count, examples: examples.slice(0, 3) };
  }
}

// ============================================================================
// REMAINING EVALUATORS (Abbreviated for brevity)
// ============================================================================

export class InterleavingEvaluator {
  static evaluate(
    chapter: Chapter,
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

    // NEW: Interleaving Density by Section
    const interleavingDensity = this.calculateInterleavingDensity(
      chapter,
      concepts
    );
    evidence.push({
      type: "metric",
      metric: "interleaving_density_score",
      value: interleavingDensity.densityScore,
      threshold: 0.6,
      quality:
        interleavingDensity.densityScore >= 0.6
          ? "strong"
          : interleavingDensity.densityScore >= 0.4
          ? "moderate"
          : "weak",
    });

    // NEW: Discrimination Practice Opportunities
    const discriminationPractice = this.detectDiscriminationPractice(
      chapter.content,
      concepts
    );
    evidence.push({
      type: "count",
      metric: "discrimination_opportunities",
      value: discriminationPractice.count,
      threshold: Math.max(3, Math.ceil(concepts.hierarchy.core.length / 3)),
      quality: discriminationPractice.count >= 3 ? "strong" : "weak",
    });

    if (discriminationPractice.count === 0) {
      findings.push({
        type: "warning",
        message:
          "No discrimination practice detected - learners may confuse similar concepts",
        severity: 0.7,
        evidence:
          "Comparing/contrasting similar concepts strengthens discrimination ability",
      });
    }

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
          totalPositions / Math.max(blockingSegments.length, 1)
        ).toFixed(1)} concepts`,
      });
    }

    // Enhanced score calculation
    let score = 30; // Base
    score += (1 - blockingRatio) * 35; // Blocking ratio (0-35)
    score += interleavingDensity.densityScore * 20; // Density (0-20)
    score += Math.min(discriminationPractice.count * 3, 15); // Discrimination (0-15)

    const suggestions: any[] = [];
    if (blockingRatio > 0.6) {
      suggestions.push({
        id: "interleaving-1",
        principle: "interleaving",
        priority: "high",
        title: "Reduce Blocking - Mix Topics",
        description:
          "Break up blocked content segments and interleave different concepts",
        implementation: `Redistribute ${blockingSegments.length} blocked segments throughout chapter`,
        expectedImpact:
          "Interleaving produces 40-50% better long-term retention than blocking",
        relatedConcepts: blockingSegments.map((s) => s.topic).slice(0, 5),
        examples: ["Instead of: AAA BBB CCC, Use: ABC ABC ABC"],
      });
    }

    return {
      principle: "interleaving",
      score: Math.min(score, 100),
      weight: 0.85,
      findings,
      suggestions,
      evidence,
    };
  }

  private static identifyBlockingSegments(sequence: string[]) {
    const segments: { topic: string; length: number; start: number }[] = [];
    if (sequence.length === 0) return segments;
    let current: { topic: string; length: number; start: number } = {
      topic: sequence[0],
      length: 1,
      start: 0,
    };

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

    if (current.length > 1) {
      segments.push(current);
    }

    return segments;
  }

  // NEW: Calculate Interleaving Density
  private static calculateInterleavingDensity(
    chapter: Chapter,
    concepts: ConceptGraph
  ): {
    densityScore: number;
    sectionScores: number[];
  } {
    const sectionScores: number[] = [];

    chapter.sections.forEach((section) => {
      const sectionConcepts = new Set<string>();
      const sectionStart = chapter.content.indexOf(section.content);
      const sectionEnd = sectionStart + section.content.length;

      concepts.concepts.forEach((concept) => {
        concept.mentions.forEach((mention) => {
          if (
            mention.position >= sectionStart &&
            mention.position < sectionEnd
          ) {
            sectionConcepts.add(concept.name);
          }
        });
      });

      // Score based on concept diversity in section
      const diversityScore =
        sectionConcepts.size >= 3 ? 1 : sectionConcepts.size / 3;
      sectionScores.push(diversityScore);
    });

    const densityScore =
      sectionScores.length > 0
        ? sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length
        : 0;

    return { densityScore, sectionScores };
  }

  // NEW: Detect Discrimination Practice
  private static detectDiscriminationPractice(
    text: string,
    concepts: ConceptGraph
  ): {
    count: number;
    examples: string[];
  } {
    const patterns = [
      /(?:compare|contrast)\s+(?:and\s+contrast\s+)?/gi,
      /(?:difference|distinguish)\s+between/gi,
      /(?:similar|different)\s+(?:to|from)/gi,
      /(?:unlike|whereas|however)/gi,
    ];

    let count = 0;
    const examples: string[] = [];

    patterns.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      count += matches.length;
    });

    // Check if core concepts are compared
    const coreConcepts = concepts.hierarchy.core.map((c) => c.name);
    for (let i = 0; i < coreConcepts.length - 1; i++) {
      for (let j = i + 1; j < coreConcepts.length; j++) {
        const regex = new RegExp(
          `${coreConcepts[i]}.{0,100}(?:vs|versus|and|compared to).{0,100}${coreConcepts[j]}`,
          "i"
        );
        if (regex.test(text)) {
          examples.push(`${coreConcepts[i]} vs ${coreConcepts[j]}`);
        }
      }
    }

    return { count, examples: examples.slice(0, 3) };
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
