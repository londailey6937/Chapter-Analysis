/**
 * Missing Concept Suggestions Component
 * Professional Tier Feature - Suggests concepts from library that are missing from writer's text
 */

import React, { useState, useMemo } from "react";
import type { Concept } from "@/types";
import type { ConceptDefinition } from "@/data/conceptLibraryRegistry";

interface MissingConceptSuggestionsProps {
  domain: string;
  libraryConcepts: ConceptDefinition[];
  identifiedConcepts: Concept[];
  chapterText: string;
  onAcceptSuggestion: (
    concept: ConceptDefinition,
    insertionPoint: number
  ) => void;
}

interface MissingConcept {
  concept: ConceptDefinition;
  suggestedLocation: number;
  contextSnippet: string;
  reason: string;
}

export const MissingConceptSuggestions: React.FC<
  MissingConceptSuggestionsProps
> = ({
  domain,
  libraryConcepts,
  identifiedConcepts,
  chapterText,
  onAcceptSuggestion,
}) => {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [rejectedConcepts, setRejectedConcepts] = useState<Set<string>>(
    new Set()
  );

  // Suggest where to insert a missing concept based on related concepts and categories
  const suggestInsertionPoint = (
    concept: ConceptDefinition,
    text: string,
    existing: Concept[]
  ): { location: number; snippet: string; reason: string } | null => {
    // Strategy 1: Find concepts in the same category
    const relatedConcepts = existing.filter(
      (c) =>
        c.definition?.includes(concept.category || "") ||
        concept.relatedConcepts?.includes(c.name)
    );

    if (relatedConcepts.length > 0) {
      // Suggest after the last related concept
      const lastRelated = relatedConcepts[relatedConcepts.length - 1];
      const lastMention = lastRelated.mentions[lastRelated.mentions.length - 1];
      const location = lastMention.position + 200; // After the last mention

      const snippet = text.slice(
        Math.max(0, location - 100),
        Math.min(text.length, location + 100)
      );

      return {
        location,
        snippet: "..." + snippet.trim() + "...",
        reason: `Near related concept: "${lastRelated.name}"`,
      };
    }

    // Strategy 2: Find keywords from the concept's category in the text
    const categoryKeywords = concept.category?.toLowerCase().split(" ") || [];
    for (const keyword of categoryKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      const match = regex.exec(text);
      if (match) {
        const location = match.index;
        const snippet = text.slice(
          Math.max(0, location - 100),
          Math.min(text.length, location + 100)
        );

        return {
          location,
          snippet: "..." + snippet.trim() + "...",
          reason: `Near category keyword: "${keyword}"`,
        };
      }
    }

    // Strategy 3: Suggest in the middle of the document (default)
    const location = Math.floor(text.length / 2);
    const snippet = text.slice(
      Math.max(0, location - 100),
      Math.min(text.length, location + 100)
    );

    return {
      location,
      snippet: "..." + snippet.trim() + "...",
      reason: "General content area",
    };
  };

  // Find concepts that are in the library but not in the writer's text
  const missingConcepts = useMemo(() => {
    const missing: MissingConcept[] = [];
    const identifiedNames = new Set(
      identifiedConcepts.map((c) => c.name.toLowerCase())
    );

    // Only check core and supporting concepts (not detail level)
    const importantConcepts = libraryConcepts.filter(
      (c) => c.importance === "core" || c.importance === "supporting"
    );

    for (const libConcept of importantConcepts) {
      // Check if this concept (or any of its aliases) is already identified
      const isIdentified =
        identifiedNames.has(libConcept.name.toLowerCase()) ||
        (libConcept.aliases &&
          libConcept.aliases.some((alias) =>
            identifiedNames.has(alias.toLowerCase())
          ));

      if (!isIdentified && !rejectedConcepts.has(libConcept.name)) {
        // Find a good place to suggest adding this concept
        const suggestion = suggestInsertionPoint(
          libConcept,
          chapterText,
          identifiedConcepts
        );
        if (suggestion) {
          missing.push({
            concept: libConcept,
            suggestedLocation: suggestion.location,
            contextSnippet: suggestion.snippet,
            reason: suggestion.reason,
          });
        }
      }
    }

    // Sort by importance (core first) and then by suggested location
    return missing.sort((a, b) => {
      if (a.concept.importance === "core" && b.concept.importance !== "core")
        return -1;
      if (a.concept.importance !== "core" && b.concept.importance === "core")
        return 1;
      return a.suggestedLocation - b.suggestedLocation;
    });
  }, [libraryConcepts, identifiedConcepts, chapterText, rejectedConcepts]);

  const handleReject = (conceptName: string) => {
    setRejectedConcepts((prev) => new Set(prev).add(conceptName));
    setExpandedConcept(null);
  };

  const handleAccept = (missing: MissingConcept) => {
    onAcceptSuggestion(missing.concept, missing.suggestedLocation);
    setExpandedConcept(null);
  };

  if (missingConcepts.length === 0) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <span className="text-2xl">✓</span>
          <div>
            <h4 className="font-semibold text-sm">Great Coverage!</h4>
            <p className="text-xs text-green-600 mt-1">
              Your text covers all key concepts from the {domain} library.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Missing Concepts ({missingConcepts.length})
        </h3>
        <span className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded">
          👑 Professional Feature
        </span>
      </div>

      <p className="text-xs text-gray-600">
        These important concepts from the {domain} library are not covered in
        your text. Consider adding them for completeness.
      </p>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {missingConcepts.slice(0, 10).map((missing, index) => (
          <div
            key={missing.concept.name}
            className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
          >
            {/* Collapsed View */}
            <div
              className="p-3 cursor-pointer"
              onClick={() =>
                setExpandedConcept(
                  expandedConcept === missing.concept.name
                    ? null
                    : missing.concept.name
                )
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        missing.concept.importance === "core"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {missing.concept.importance === "core"
                        ? "CORE"
                        : "SUPPORTING"}
                    </span>
                    <h4 className="font-semibold text-sm text-gray-900">
                      {missing.concept.name}
                    </h4>
                  </div>
                  {missing.concept.category && (
                    <p className="text-xs text-gray-500 mt-1">
                      {missing.concept.category}
                      {missing.concept.subcategory &&
                        ` • ${missing.concept.subcategory}`}
                    </p>
                  )}
                </div>
                <span
                  className={`text-gray-400 transition-transform ${
                    expandedConcept === missing.concept.name ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>

            {/* Expanded View */}
            {expandedConcept === missing.concept.name && (
              <div className="px-3 pb-3 space-y-3 border-t border-gray-100 pt-3">
                {/* Description */}
                {missing.concept.description && (
                  <div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {missing.concept.description}
                    </p>
                  </div>
                )}

                {/* Suggested Location */}
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    💡 Suggested location: {missing.reason}
                  </p>
                  <p className="text-xs text-gray-600 italic font-mono bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                    {missing.contextSnippet}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(missing);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    ✓ Show Me Where to Add It
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(missing.concept.name);
                    }}
                    className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 transition-colors"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {missingConcepts.length > 10 && (
        <p className="text-xs text-gray-500 text-center py-2">
          Showing 10 of {missingConcepts.length} missing concepts
        </p>
      )}
    </div>
  );
};
