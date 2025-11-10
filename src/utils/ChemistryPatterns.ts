/**
 * ChemistryPatterns - Domain-specific pattern detection for chemistry content
 *
 * Detects chemistry-specific pedagogical structures:
 * - Chemical equations (balanced reactions)
 * - Stoichiometry problems (mole calculations)
 * - Lewis structures (electron dot diagrams)
 * - Lab procedures (safety, experimental methods)
 * - Nomenclature practice (naming compounds)
 * - Reaction mechanisms (step-by-step reaction pathways)
 */

import type { PatternMatch } from "../../types";

export class ChemistryPatterns {
  /**
   * Detect all chemistry-specific patterns in text
   */
  static detectAll(text: string): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    patterns.push(...this.detectChemicalEquations(text));
    patterns.push(...this.detectStoichiometryProblems(text));
    patterns.push(...this.detectLewisStructures(text));
    patterns.push(...this.detectLabProcedures(text));
    patterns.push(...this.detectNomenclaturePractice(text));
    patterns.push(...this.detectReactionMechanisms(text));

    return patterns;
  }

  /**
   * Detect chemical equations (e.g., "2H₂ + O₂ → 2H₂O")
   */
  private static detectChemicalEquations(text: string): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    // Pattern: Chemical formulas with arrow notation
    // Matches: H2O, CH3COOH, Ca(OH)2, etc. with → or ⇌
    const equationPattern =
      /\b[A-Z][a-z]?\d*(?:\([A-Z][a-z]?\d*\))*(?:\s*\+\s*[A-Z][a-z]?\d*(?:\([A-Z][a-z]?\d*\))*)*\s*[→⇌⟶]\s*[A-Z][a-z]?\d*(?:\([A-Z][a-z]?\d*\))*(?:\s*\+\s*[A-Z][a-z]?\d*(?:\([A-Z][a-z]?\d*\))*)*/g;

    let match;
    while ((match = equationPattern.exec(text)) !== null) {
      const startPos = match.index;
      const endPos = startPos + match[0].length;

      // Get surrounding context
      const contextStart = Math.max(0, startPos - 150);
      const contextEnd = Math.min(text.length, endPos + 150);
      const context = text.substring(contextStart, contextEnd);

      // Check if it's part of a worked example
      const isWorkedExample = /example|solution|step|calculate|balance/i.test(
        text.substring(Math.max(0, startPos - 200), startPos)
      );

      patterns.push({
        type: "formula", // Using existing type, but marking as chemistry-specific
        confidence: 0.9,
        startPosition: startPos,
        endPosition: endPos,
        context: context.trim(),
        title: "Chemical Equation",
        metadata: {
          concepts: ["chemical reactions", "stoichiometry"],
          difficulty: this.assessEquationDifficulty(match[0]),
          isBalanced: this.checkIfBalanced(match[0]),
          isWorkedExample,
        },
      });
    }

    return patterns;
  }

  /**
   * Detect stoichiometry calculation problems
   */
  private static detectStoichiometryProblems(text: string): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    // Keywords indicating stoichiometry problems
    const stoichKeywords = [
      /calculate\s+(?:the\s+)?(?:mass|moles?|volume|grams?|liters?)/gi,
      /how\s+many\s+(?:moles?|grams?|liters?|molecules?)/gi,
      /determine\s+(?:the\s+)?(?:limiting\s+reactant|excess\s+reagent)/gi,
      /percent\s+yield/gi,
      /theoretical\s+yield/gi,
      /molar\s+mass/gi,
    ];

    stoichKeywords.forEach((pattern) => {
      let match;
      const regex = new RegExp(pattern);

      while ((match = regex.exec(text)) !== null) {
        const startPos = match.index;

        // Look ahead for the problem extent (up to 800 chars or next problem)
        const lookAhead = text.substring(startPos, startPos + 800);
        const endMatch = lookAhead.search(/\n\n[A-Z]|Problem\s+\d+/i);
        const endPos =
          startPos +
          (endMatch > 0 ? endMatch : Math.min(600, lookAhead.length));

        const context = text.substring(
          startPos,
          Math.min(startPos + 300, endPos)
        );

        // Check if answer is provided
        const hasAnswer = /answer\s*:?|solution\s*:?/gi.test(lookAhead);

        patterns.push({
          type: hasAnswer ? "workedExample" : "practiceProblem",
          confidence: 0.85,
          startPosition: startPos,
          endPosition: endPos,
          context: context.trim(),
          title: "Stoichiometry Problem",
          metadata: {
            concepts: ["stoichiometry", "mole calculations"],
            hasAnswer,
            difficulty: "medium",
            problemType: "stoichiometry",
          },
        });
      }
    });

    return patterns;
  }

  /**
   * Detect Lewis structure references and problems
   */
  private static detectLewisStructures(text: string): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    const lewisPatterns = [
      /draw\s+(?:the\s+)?lewis\s+structure/gi,
      /lewis\s+(?:dot\s+)?diagram/gi,
      /electron\s+dot\s+structure/gi,
      /show\s+(?:the\s+)?bonding/gi,
    ];

    lewisPatterns.forEach((pattern) => {
      let match;
      const regex = new RegExp(pattern);

      while ((match = regex.exec(text)) !== null) {
        const startPos = match.index;
        const lookAhead = text.substring(startPos, startPos + 500);
        const endPos = startPos + Math.min(400, lookAhead.length);

        const context = text.substring(
          startPos,
          Math.min(startPos + 250, endPos)
        );

        patterns.push({
          type: "practiceProblem",
          confidence: 0.8,
          startPosition: startPos,
          endPosition: endPos,
          context: context.trim(),
          title: "Lewis Structure Problem",
          metadata: {
            concepts: ["chemical bonding", "valence electrons"],
            difficulty: "medium",
            problemType: "lewis-structure",
          },
        });
      }
    });

    return patterns;
  }

  /**
   * Detect lab procedures and safety instructions
   */
  private static detectLabProcedures(text: string): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    const labMarkers = [
      /laboratory\s+procedure/gi,
      /experimental\s+(?:procedure|method)/gi,
      /safety\s+(?:precautions?|warning|guidelines?)/gi,
      /materials?\s+(?:needed|required)\s*:/gi,
      /apparatus/gi,
    ];

    labMarkers.forEach((pattern) => {
      let match;
      const regex = new RegExp(pattern);

      while ((match = regex.exec(text)) !== null) {
        const startPos = match.index;
        const lookAhead = text.substring(startPos, startPos + 1500);

        // Look for numbered steps
        const stepCount = (lookAhead.match(/^\s*\d+\.\s+/gm) || []).length;

        if (stepCount >= 2) {
          const endMatch = lookAhead.search(/\n\n[A-Z][^a-z]/);
          const endPos =
            startPos +
            (endMatch > 0 ? endMatch : Math.min(1200, lookAhead.length));

          const context = text.substring(
            startPos,
            Math.min(startPos + 300, endPos)
          );

          patterns.push({
            type: "procedure",
            confidence: 0.9,
            startPosition: startPos,
            endPosition: endPos,
            context: context.trim(),
            title: "Lab Procedure",
            metadata: {
              steps: stepCount,
              concepts: ["laboratory techniques", "experimental methods"],
              difficulty: "medium",
              procedureType: "laboratory",
            },
          });
        }
      }
    });

    return patterns;
  }

  /**
   * Detect nomenclature practice (naming compounds)
   */
  private static detectNomenclaturePractice(text: string): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    const nomenclaturePatterns = [
      /name\s+the\s+following\s+compound/gi,
      /give\s+the\s+(?:IUPAC\s+)?name/gi,
      /write\s+the\s+formula\s+for/gi,
      /nomenclature\s+practice/gi,
    ];

    nomenclaturePatterns.forEach((pattern) => {
      let match;
      const regex = new RegExp(pattern);

      while ((match = regex.exec(text)) !== null) {
        const startPos = match.index;
        const lookAhead = text.substring(startPos, startPos + 400);
        const endPos = startPos + Math.min(300, lookAhead.length);

        const context = text.substring(
          startPos,
          Math.min(startPos + 200, endPos)
        );

        patterns.push({
          type: "practiceProblem",
          confidence: 0.85,
          startPosition: startPos,
          endPosition: endPos,
          context: context.trim(),
          title: "Nomenclature Practice",
          metadata: {
            concepts: ["chemical nomenclature", "IUPAC naming"],
            difficulty: "easy",
            problemType: "nomenclature",
          },
        });
      }
    });

    return patterns;
  }

  /**
   * Detect reaction mechanisms (step-by-step reaction pathways)
   */
  private static detectReactionMechanisms(text: string): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    const mechanismMarkers = [
      /reaction\s+mechanism/gi,
      /mechanism\s+(?:of|for)\s+(?:the\s+)?reaction/gi,
      /step-by-step\s+reaction/gi,
      /elementary\s+steps?/gi,
      /rate-determining\s+step/gi,
    ];

    mechanismMarkers.forEach((pattern) => {
      let match;
      const regex = new RegExp(pattern);

      while ((match = regex.exec(text)) !== null) {
        const startPos = match.index;
        const lookAhead = text.substring(startPos, startPos + 1000);

        // Count step indicators
        const stepCount = (lookAhead.match(/step\s+\d+/gi) || []).length;

        if (stepCount >= 2) {
          const endMatch = lookAhead.search(/\n\n[A-Z]/);
          const endPos =
            startPos +
            (endMatch > 0 ? endMatch : Math.min(800, lookAhead.length));

          const context = text.substring(
            startPos,
            Math.min(startPos + 300, endPos)
          );

          patterns.push({
            type: "procedure",
            confidence: 0.9,
            startPosition: startPos,
            endPosition: endPos,
            context: context.trim(),
            title: "Reaction Mechanism",
            metadata: {
              steps: stepCount,
              concepts: ["reaction mechanisms", "kinetics"],
              difficulty: "hard",
              procedureType: "mechanism",
            },
          });
        }
      }
    });

    return patterns;
  }

  /**
   * Helper: Assess chemical equation difficulty
   */
  private static assessEquationDifficulty(
    equation: string
  ): "easy" | "medium" | "hard" {
    // Count molecules on each side
    const plusCount = (equation.match(/\+/g) || []).length;

    // Check for coefficients > 1
    const hasCoefficients = /\d+[A-Z]/.test(equation);

    // Check for complex ions/polyatomic
    const hasParentheses = /\(/.test(equation);

    if (hasParentheses || plusCount >= 4) return "hard";
    if (hasCoefficients || plusCount >= 2) return "medium";
    return "easy";
  }

  /**
   * Helper: Check if equation appears balanced (heuristic)
   */
  private static checkIfBalanced(equation: string): boolean {
    // Simple heuristic: if it has coefficients (numbers before formulas), likely balanced
    return /^\d+[A-Z]/.test(equation) || /\s+\d+[A-Z]/.test(equation);
  }
}
