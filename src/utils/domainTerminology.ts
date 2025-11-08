/**
 * Domain-Specific Terminology Utility
 *
 * Maps domains to appropriate terminology since "concepts" works well for STEM
 * but other terms are more natural for humanities/literature
 */

import { Domain } from "@/data/conceptLibraryTypes";

export interface DomainTerminology {
  singular: string; // e.g., "concept", "element", "theme"
  plural: string; // e.g., "concepts", "elements", "themes"
  singularCapitalized: string; // e.g., "Concept", "Element"
  pluralCapitalized: string; // e.g., "Concepts", "Elements"
  gerund: string; // e.g., "Extracting concepts", "Identifying elements"
  coreTerm: string; // e.g., "core concept", "key element"
  corePlural: string; // e.g., "core concepts", "key elements"
}

const DOMAIN_TERMINOLOGY_MAP: Record<Domain, DomainTerminology> = {
  literature: {
    singular: "element",
    plural: "elements",
    singularCapitalized: "Element",
    pluralCapitalized: "Elements",
    gerund: "Identifying literary elements",
    coreTerm: "key element",
    corePlural: "key elements",
  },
  chemistry: {
    singular: "concept",
    plural: "concepts",
    singularCapitalized: "Concept",
    pluralCapitalized: "Concepts",
    gerund: "Extracting concepts",
    coreTerm: "core concept",
    corePlural: "core concepts",
  },
  physics: {
    singular: "concept",
    plural: "concepts",
    singularCapitalized: "Concept",
    pluralCapitalized: "Concepts",
    gerund: "Extracting concepts",
    coreTerm: "core concept",
    corePlural: "core concepts",
  },
  biology: {
    singular: "concept",
    plural: "concepts",
    singularCapitalized: "Concept",
    pluralCapitalized: "Concepts",
    gerund: "Extracting concepts",
    coreTerm: "core concept",
    corePlural: "core concepts",
  },
  mathematics: {
    singular: "concept",
    plural: "concepts",
    singularCapitalized: "Concept",
    pluralCapitalized: "Concepts",
    gerund: "Extracting concepts",
    coreTerm: "core concept",
    corePlural: "core concepts",
  },
  computing: {
    singular: "concept",
    plural: "concepts",
    singularCapitalized: "Concept",
    pluralCapitalized: "Concepts",
    gerund: "Extracting concepts",
    coreTerm: "core concept",
    corePlural: "core concepts",
  },
  "cross-domain": {
    singular: "concept",
    plural: "concepts",
    singularCapitalized: "Concept",
    pluralCapitalized: "Concepts",
    gerund: "Extracting concepts",
    coreTerm: "core concept",
    corePlural: "core concepts",
  },
};

/**
 * Get appropriate terminology for a given domain
 */
export function getDomainTerminology(domain: Domain): DomainTerminology {
  return (
    DOMAIN_TERMINOLOGY_MAP[domain] || DOMAIN_TERMINOLOGY_MAP["cross-domain"]
  );
}

/**
 * Get plural terminology string for use in UI
 * @example "concepts" for STEM, "elements" for literature
 */
export function getPluralTerm(domain: Domain): string {
  return getDomainTerminology(domain).plural;
}

/**
 * Get singular terminology string for use in UI
 * @example "concept" for STEM, "element" for literature
 */
export function getSingularTerm(domain: Domain): string {
  return getDomainTerminology(domain).singular;
}

/**
 * Get capitalized plural terminology for headings
 * @example "Concepts" for STEM, "Elements" for literature
 */
export function getPluralTermCapitalized(domain: Domain): string {
  return getDomainTerminology(domain).pluralCapitalized;
}

/**
 * Get core/key term for important items
 * @example "core concepts" for STEM, "key elements" for literature
 */
export function getCorePluralTerm(domain: Domain): string {
  return getDomainTerminology(domain).corePlural;
}

/**
 * Get gerund phrase for progress messages
 * @example "Extracting concepts..." for STEM, "Identifying literary elements..." for literature
 */
export function getExtractionPhrase(domain: Domain): string {
  return getDomainTerminology(domain).gerund;
}
