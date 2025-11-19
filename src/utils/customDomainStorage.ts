/**
 * Custom Domain Storage Utilities
 * Manages saving and loading custom domains from localStorage
 */

import type { SavedCustomDomain, SavedConceptData } from "../../types";
import type { ConceptDefinition } from "@/data/conceptLibraryRegistry";

const STORAGE_KEY = "tomeiq_custom_domains";

/**
 * Load all saved custom domains from localStorage
 */
export function loadCustomDomains(): SavedCustomDomain[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const domains = JSON.parse(stored);
    return Array.isArray(domains) ? domains : [];
  } catch (error) {
    console.error("Error loading custom domains:", error);
    return [];
  }
}

/**
 * Save a custom domain to localStorage
 */
export function saveCustomDomain(
  name: string,
  concepts: ConceptDefinition[]
): void {
  try {
    const existingDomains = loadCustomDomains();

    // Check if domain with this name already exists
    const existingIndex = existingDomains.findIndex(
      (d) => d.name.toLowerCase() === name.toLowerCase()
    );

    const newDomain: SavedCustomDomain = {
      name,
      concepts: concepts.map(
        (c): SavedConceptData => ({
          name: c.name,
          category: c.category,
          importance: c.importance,
        })
      ),
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing domain
      existingDomains[existingIndex] = newDomain;
    } else {
      // Add new domain
      existingDomains.push(newDomain);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingDomains));
  } catch (error) {
    console.error("Error saving custom domain:", error);
    throw new Error("Failed to save custom domain");
  }
}

/**
 * Delete a custom domain from localStorage
 */
export function deleteCustomDomain(name: string): void {
  try {
    const existingDomains = loadCustomDomains();
    const filtered = existingDomains.filter(
      (d) => d.name.toLowerCase() !== name.toLowerCase()
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting custom domain:", error);
  }
}

/**
 * Get a specific custom domain by name
 */
export function getCustomDomain(name: string): SavedCustomDomain | null {
  const domains = loadCustomDomains();
  return (
    domains.find((d) => d.name.toLowerCase() === name.toLowerCase()) || null
  );
}

/**
 * Convert saved domain concepts back to ConceptDefinition format
 */
export function convertToConceptDefinitions(
  domain: SavedCustomDomain
): ConceptDefinition[] {
  return domain.concepts.map((c) => ({
    name: c.name,
    category: c.category || "Custom",
    subcategory: "User-Defined",
    importance: (c.importance as "core" | "supporting" | "detail") || "core",
  }));
}
