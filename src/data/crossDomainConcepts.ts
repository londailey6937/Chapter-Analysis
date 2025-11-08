/**
 * Cross-Domain Conceptual Frameworks
 *
 * Universal concepts that apply across multiple disciplines:
 * - Logic and reasoning
 * - Mathematics and quantification
 * - Information theory
 * - Systems thinking
 * - Category theory
 * - Cognitive science
 */

import { ConceptLibrary } from "./conceptLibraryTypes";

export const CROSS_DOMAIN_CONCEPTS: ConceptLibrary = {
  domain: "Cross-Domain Frameworks",
  version: "1.0.0",
  concepts: [
    // ========== LOGIC & REASONING ==========
    {
      name: "logic",
      category: "Logic and Reasoning",
      importance: "core",
      description: "System of principles for valid reasoning",
    },
    {
      name: "argument",
      category: "Logic and Reasoning",
      importance: "core",
      description: "Set of premises leading to a conclusion",
    },
    {
      name: "premise",
      category: "Logic and Reasoning",
      importance: "supporting",
      description: "Statement assumed to be true in an argument",
    },
    {
      name: "conclusion",
      category: "Logic and Reasoning",
      importance: "supporting",
      description: "Statement that follows from premises",
    },
    {
      name: "inference",
      category: "Logic and Reasoning",
      importance: "core",
      description: "Drawing conclusions from evidence or premises",
    },
    {
      name: "deduction",
      aliases: ["deductive reasoning"],
      category: "Logic and Reasoning",
      importance: "core",
      description: "Reasoning from general to specific",
    },
    {
      name: "induction",
      aliases: ["inductive reasoning"],
      category: "Logic and Reasoning",
      importance: "core",
      description: "Reasoning from specific to general",
    },
    {
      name: "hypothesis",
      category: "Logic and Reasoning",
      importance: "core",
      description: "Testable proposed explanation",
    },
    {
      name: "theory",
      category: "Logic and Reasoning",
      importance: "core",
      description: "Well-substantiated explanation of phenomena",
    },
    {
      name: "evidence",
      category: "Logic and Reasoning",
      importance: "supporting",
      description: "Information supporting or refuting claims",
    },

    // ========== MATHEMATICS & QUANTIFICATION ==========
    {
      name: "variable",
      category: "Mathematics",
      importance: "core",
      description: "Symbol representing a quantity that can change",
    },
    {
      name: "function",
      category: "Mathematics",
      importance: "core",
      description: "Relation mapping inputs to outputs",
    },
    {
      name: "set",
      category: "Mathematics",
      importance: "core",
      description: "Collection of distinct objects",
    },
    {
      name: "equation",
      category: "Mathematics",
      importance: "core",
      description: "Statement that two expressions are equal",
    },
    {
      name: "ratio",
      category: "Mathematics",
      importance: "supporting",
      description: "Quantitative relation between two amounts",
    },
    {
      name: "proportion",
      category: "Mathematics",
      importance: "supporting",
      description: "Equality of ratios",
    },
    {
      name: "probability",
      category: "Mathematics",
      importance: "core",
      description: "Measure of likelihood of an event",
    },
    {
      name: "statistic",
      aliases: ["statistics"],
      category: "Mathematics",
      importance: "supporting",
      description: "Numerical data or methods of analysis",
    },

    // ========== INFORMATION THEORY ==========
    {
      name: "information",
      category: "Information Theory",
      importance: "core",
      description: "Data that reduces uncertainty",
    },
    {
      name: "entropy",
      category: "Information Theory",
      importance: "core",
      description: "Measure of uncertainty or disorder",
    },
    {
      name: "signal",
      category: "Information Theory",
      importance: "supporting",
      description: "Carrier of information",
    },
    {
      name: "noise",
      category: "Information Theory",
      importance: "supporting",
      description: "Unwanted interference in communication",
    },
    {
      name: "encoding",
      category: "Information Theory",
      importance: "supporting",
      description: "Converting information into a different form",
    },
    {
      name: "decoding",
      category: "Information Theory",
      importance: "supporting",
      description: "Converting encoded information back to original form",
    },

    // ========== SYSTEMS THINKING ==========
    {
      name: "system",
      category: "Systems Thinking",
      importance: "core",
      description: "Set of interconnected components forming a whole",
    },
    {
      name: "component",
      category: "Systems Thinking",
      importance: "supporting",
      description: "Part of a larger system",
    },
    {
      name: "structure",
      category: "Systems Thinking",
      importance: "core",
      description: "Arrangement and organization of parts",
    },
    {
      name: "process",
      category: "Systems Thinking",
      importance: "core",
      description: "Series of actions producing a result",
    },
    {
      name: "feedback",
      category: "Systems Thinking",
      importance: "core",
      description: "Output of a system affecting its input",
    },
    {
      name: "equilibrium",
      category: "Systems Thinking",
      importance: "core",
      description: "State of balance in a system",
    },
    {
      name: "emergence",
      category: "Systems Thinking",
      importance: "core",
      description: "Properties arising from interactions not present in parts",
    },
    {
      name: "hierarchy",
      category: "Systems Thinking",
      importance: "supporting",
      description: "Organization in levels or ranks",
    },

    // ========== CAUSALITY & RELATIONSHIPS ==========
    {
      name: "cause",
      category: "Causality",
      importance: "core",
      description: "That which produces an effect",
    },
    {
      name: "effect",
      category: "Causality",
      importance: "core",
      description: "Result produced by a cause",
    },
    {
      name: "correlation",
      category: "Causality",
      importance: "supporting",
      description: "Mutual relationship between variables",
    },
    {
      name: "mechanism",
      category: "Causality",
      importance: "core",
      description: "Process by which something operates",
    },
    {
      name: "interaction",
      category: "Causality",
      importance: "supporting",
      description: "Reciprocal action between entities",
    },

    // ========== ABSTRACTION & REPRESENTATION ==========
    {
      name: "model",
      category: "Abstraction",
      importance: "core",
      description: "Simplified representation of reality",
    },
    {
      name: "abstraction",
      category: "Abstraction",
      importance: "core",
      description: "Simplification removing specific details",
    },
    {
      name: "representation",
      category: "Abstraction",
      importance: "core",
      description: "Standing for or depicting something else",
    },
    {
      name: "symbol",
      category: "Abstraction",
      importance: "supporting",
      description: "Sign representing an idea or object",
    },
    {
      name: "pattern",
      category: "Abstraction",
      importance: "core",
      description: "Recurring arrangement or sequence",
    },
    {
      name: "category",
      category: "Abstraction",
      importance: "core",
      description: "Class of things sharing common features",
    },

    // ========== METHODOLOGY ==========
    {
      name: "method",
      aliases: ["methodology"],
      category: "Methodology",
      importance: "core",
      description: "Systematic procedure for accomplishing something",
    },
    {
      name: "experiment",
      category: "Methodology",
      importance: "core",
      description: "Procedure to test a hypothesis",
    },
    {
      name: "observation",
      category: "Methodology",
      importance: "supporting",
      description: "Act of noting and recording phenomena",
    },
    {
      name: "measurement",
      category: "Methodology",
      importance: "supporting",
      description: "Quantification of a property",
    },
    {
      name: "analysis",
      category: "Methodology",
      importance: "core",
      description: "Detailed examination of elements or structure",
    },
    {
      name: "synthesis",
      category: "Methodology",
      importance: "core",
      description: "Combination of parts into a whole",
    },
    {
      name: "validation",
      category: "Methodology",
      importance: "supporting",
      description: "Confirmation of accuracy or correctness",
    },
  ],
};
