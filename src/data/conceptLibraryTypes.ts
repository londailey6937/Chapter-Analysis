/**
 * Concept Library Type Definitions
 *
 * Defines the structure for domain-specific and cross-domain concept libraries
 * used for analyzing textbook chapters.
 */

export interface ConceptDefinition {
  id?: string;
  name: string;
  aliases?: string[]; // Alternative names/spellings (e.g., "energy" -> ["kinetic energy", "potential energy"])
  category: string;
  subcategory?: string;
  relatedConcepts?: string[]; // Concepts that frequently co-occur
  importance?: "core" | "supporting" | "detail"; // Expected importance level
  description?: string; // Optional explanation for the concept
  misconceptions?: string[]; // Common misconceptions about this concept

  // Enhanced learning fields
  prerequisites?: string[]; // Concept IDs that should be understood first
  complexity?: "beginner" | "intermediate" | "advanced"; // Difficulty level
  keyTerms?: Record<string, string>; // Important terminology with definitions
  learningPath?: string[]; // Suggested sequence of concept IDs for learning
  commonMisconceptions?: string[]; // Common misconceptions about this concept
  mnemonicAid?: string; // Memory aid or mnemonic device
  practicalApplications?: string[]; // Real-world uses of the concept
}

export interface ConceptLibrary {
  domain: string; // e.g., "Chemistry", "Physics", "Literature"
  version: string; // Library version for tracking updates
  concepts: ConceptDefinition[];
}

/**
 * Available domains for concept analysis
 */
export type Domain =
  | "chemistry"
  | "physics"
  | "biology"
  | "computing"
  | "react"
  | "javascript"
  | "mathematics"
  | "finance"
  | "custom"
  | "cross-domain";

export interface DomainInfo {
  id: Domain;
  label: string;
  description: string;
  icon: string;
}

export const AVAILABLE_DOMAINS: DomainInfo[] = [
  {
    id: "finance",
    label: "Finance",
    description: "Finance concepts (interest, NPV, ROI, diversification, etc.)",
    icon: "💵",
  },
  {
    id: "biology",
    label: "Biology",
    description: "Biology concepts (cells, genes, evolution, ecology, etc.)",
    icon: "🧬",
  },
  {
    id: "chemistry",
    label: "Chemistry",
    description:
      "General chemistry concepts (matter, reactions, bonding, etc.)",
    icon: "⚗️",
  },
  {
    id: "computing",
    label: "Computer Science",
    description:
      "Computer science concepts (algorithm, function, data structure, etc.)",
    icon: "💻",
  },
  {
    id: "react",
    label: "React",
    description:
      "React.js concepts (components, hooks, JSX, state, props, etc.)",
    icon: "⚛️",
  },
  {
    id: "javascript",
    label: "JavaScript",
    description:
      "JavaScript concepts (closures, promises, async/await, DOM, etc.)",
    icon: "🟨",
  },
  {
    id: "custom",
    label: "Custom Domain",
    description: "Define your own domain-specific concepts",
    icon: "✏️",
  },
  {
    id: "mathematics",
    label: "Mathematics",
    description:
      "Algebra & Trigonometry concepts (equations, functions, trig identities, etc.)",
    icon: "🔢",
  },
  {
    id: "physics",
    label: "Physics",
    description: "Physics concepts (force, energy, motion, waves, etc.)",
    icon: "⚛️",
  },
  {
    id: "cross-domain",
    label: "Cross-Domain Frameworks",
    description:
      "Universal concepts (logic, systems, information theory, etc.)",
    icon: "🔗",
  },
];
