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
}

interface MissingConcept {
  concept: ConceptDefinition;
}

export const MissingConceptSuggestions: React.FC<
  MissingConceptSuggestionsProps
> = ({ domain, libraryConcepts, identifiedConcepts, chapterText }) => {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [rejectedConcepts, setRejectedConcepts] = useState<Set<string>>(
    new Set()
  );
  const [showAll, setShowAll] = useState(false);

  // Find concepts that are in the library but not in the writer's text
  const missingConcepts = useMemo(() => {
    const missing: MissingConcept[] = [];
    const identifiedNames = new Set(
      identifiedConcepts.map((c) => c.name.toLowerCase())
    );

    // All library concepts are core concepts now
    const importantConcepts = libraryConcepts.filter(
      (c) => c.importance === "core"
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
        missing.push({
          concept: libConcept,
        });
      }
    }

    // Sort alphabetically by name
    return missing.sort((a, b) => a.concept.name.localeCompare(b.concept.name));
  }, [libraryConcepts, identifiedConcepts, rejectedConcepts]);

  const handleReject = (conceptName: string) => {
    setRejectedConcepts((prev) => new Set(prev).add(conceptName));
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

      <div className="space-y-2">
        {missingConcepts
          .slice(0, showAll ? missingConcepts.length : 10)
          .map((missing, index) => (
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
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${"bg-red-100 text-red-700"}`}
                      >
                        CORE
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
                      expandedConcept === missing.concept.name
                        ? "rotate-180"
                        : ""
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

                  {/* Dismiss Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(missing.concept.name);
                      }}
                      className="px-3 py-1.5 text-xs rounded transition-colors"
                      style={{
                        backgroundColor: "white",
                        color: "#6b7280",
                        border: "1px solid #e5e7eb",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f7e6d0";
                        e.currentTarget.style.borderColor = "#ef8432";
                        e.currentTarget.style.color = "#2c3e50";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.color = "#6b7280";
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {missingConcepts.length > 10 && !showAll && (
        <div className="text-center py-2">
          <button
            onClick={() => setShowAll(true)}
            className="text-xs font-medium px-4 py-2 rounded transition-colors"
            style={{
              backgroundColor: "white",
              color: "#2c3e50",
              border: "1px solid #ef8432",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f7e6d0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            Show All {missingConcepts.length} Missing Concepts
          </button>
        </div>
      )}
      {showAll && missingConcepts.length > 10 && (
        <div className="text-center py-2">
          <button
            onClick={() => setShowAll(false)}
            className="text-xs font-medium px-4 py-2 rounded transition-colors"
            style={{
              backgroundColor: "white",
              color: "#2c3e50",
              border: "1px solid #ef8432",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f7e6d0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            Show Less (First 10 Only)
          </button>
        </div>
      )}
    </div>
  );
};
