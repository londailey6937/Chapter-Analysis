/**
 * Concept Library Registry
 *
 * Central access point for all domain-specific and cross-domain concept libraries
 */

import {
  Domain,
  ConceptLibrary,
  AVAILABLE_DOMAINS,
} from "./conceptLibraryTypes";
import { CHEMISTRY_CONCEPTS } from "./chemistryConceptLibrary";
import { CROSS_DOMAIN_CONCEPTS } from "./crossDomainConcepts";
import { LITERATURE_CONCEPTS } from "./literatureConcepts";

// Re-export types for convenience
export type {
  Domain,
  ConceptLibrary,
  ConceptDefinition,
} from "./conceptLibraryTypes";

/**
 * Registry of all available concept libraries
 */
export const CONCEPT_LIBRARIES: Record<Domain, ConceptLibrary> = {
  chemistry: CHEMISTRY_CONCEPTS,
  literature: LITERATURE_CONCEPTS,
  "cross-domain": CROSS_DOMAIN_CONCEPTS,

  // Placeholder libraries for other domains (to be expanded)
  physics: {
    domain: "Physics",
    version: "1.0.0",
    concepts: [
      { name: "force", category: "Mechanics", importance: "core" },
      { name: "energy", category: "Mechanics", importance: "core" },
      { name: "mass", category: "Mechanics", importance: "core" },
      { name: "velocity", category: "Mechanics", importance: "core" },
      { name: "acceleration", category: "Mechanics", importance: "core" },
      { name: "momentum", category: "Mechanics", importance: "core" },
      { name: "work", category: "Mechanics", importance: "core" },
      { name: "power", category: "Mechanics", importance: "core" },
      { name: "wave", category: "Waves", importance: "core" },
      { name: "frequency", category: "Waves", importance: "supporting" },
      { name: "amplitude", category: "Waves", importance: "supporting" },
      { name: "wavelength", category: "Waves", importance: "supporting" },
    ],
  },

  biology: {
    domain: "Biology",
    version: "1.0.0",
    concepts: [
      { name: "cell", category: "Cell Biology", importance: "core" },
      { name: "DNA", category: "Genetics", importance: "core" },
      { name: "gene", category: "Genetics", importance: "core" },
      { name: "evolution", category: "Evolution", importance: "core" },
      { name: "natural selection", category: "Evolution", importance: "core" },
      { name: "adaptation", category: "Evolution", importance: "core" },
      { name: "species", category: "Taxonomy", importance: "core" },
      { name: "ecosystem", category: "Ecology", importance: "core" },
      { name: "organism", category: "General", importance: "core" },
      { name: "metabolism", category: "Biochemistry", importance: "core" },
    ],
  },

  computing: {
    domain: "Computing",
    version: "1.0.0",
    concepts: [
      { name: "algorithm", category: "Algorithms", importance: "core" },
      { name: "function", category: "Programming", importance: "core" },
      { name: "variable", category: "Programming", importance: "core" },
      {
        name: "data structure",
        category: "Data Structures",
        importance: "core",
      },
      { name: "array", category: "Data Structures", importance: "supporting" },
      { name: "object", category: "Programming", importance: "core" },
      { name: "class", category: "Programming", importance: "core" },
      { name: "recursion", category: "Algorithms", importance: "supporting" },
      { name: "loop", category: "Programming", importance: "supporting" },
      {
        name: "conditional",
        category: "Programming",
        importance: "supporting",
      },
    ],
  },

  mathematics: {
    domain: "Mathematics",
    version: "1.0.0",
    concepts: [
      { name: "function", category: "Functions", importance: "core" },
      { name: "equation", category: "Algebra", importance: "core" },
      { name: "variable", category: "Algebra", importance: "core" },
      { name: "set", category: "Set Theory", importance: "core" },
      { name: "proof", category: "Logic", importance: "core" },
      { name: "theorem", category: "Logic", importance: "core" },
      { name: "limit", category: "Calculus", importance: "core" },
      { name: "derivative", category: "Calculus", importance: "core" },
      { name: "integral", category: "Calculus", importance: "core" },
    ],
  },
};

/**
 * Get a concept library by domain
 */
export function getLibraryByDomain(domain: Domain): ConceptLibrary | undefined {
  return CONCEPT_LIBRARIES[domain];
}

/**
 * Get all available domains
 */
export function getAvailableDomains() {
  return AVAILABLE_DOMAINS;
}

/**
 * Check if a domain has a comprehensive library (vs placeholder)
 */
export function hasComprehensiveLibrary(domain: Domain): boolean {
  const comprehensive: Domain[] = ["chemistry", "literature", "cross-domain"];
  return comprehensive.includes(domain);
}
