/**
 * ConceptList Component
 * Displays all identified concepts with click-to-highlight functionality
 */

import React from "react";
import type { Concept } from "@/types";

interface ConceptListProps {
  concepts: Concept[];
  onConceptClick: (concept: Concept) => void;
  highlightedConceptId?: string | null;
}

export const ConceptList: React.FC<ConceptListProps> = ({
  concepts,
  onConceptClick,
  highlightedConceptId,
}) => {
  // Group concepts by importance
  const groupedConcepts = {
    core: concepts.filter((c) => c.importance === "core"),
    supporting: concepts.filter((c) => c.importance === "supporting"),
    detail: concepts.filter((c) => c.importance === "detail"),
  };

  const renderConceptGroup = (
    title: string,
    groupConcepts: Concept[],
    colorClass: string
  ) => {
    if (groupConcepts.length === 0) return null;

    return (
      <div className="concept-group mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {groupConcepts.map((concept) => (
            <button
              key={concept.id}
              onClick={() => onConceptClick(concept)}
              className={`concept-badge ${colorClass} ${
                highlightedConceptId === concept.id
                  ? "ring-2 ring-offset-2 ring-blue-500 font-bold"
                  : ""
              }`}
              title={`${concept.name} - ${concept.mentions.length} mentions`}
            >
              {concept.name}
              <span className="ml-1 text-xs opacity-75">
                ({concept.mentions.length})
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="concept-list">
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-bold">📚 Identified Concepts</h3>
          <p className="text-sm text-gray-600 mt-1">
            Click a concept to highlight it in the PDF
          </p>
        </div>
        <div className="card-body">
          {renderConceptGroup(
            "Core Concepts",
            groupedConcepts.core,
            "concept-badge-core"
          )}
          {renderConceptGroup(
            "Supporting Concepts",
            groupedConcepts.supporting,
            "concept-badge-supporting"
          )}
          {renderConceptGroup(
            "Details",
            groupedConcepts.detail,
            "concept-badge-detail"
          )}
          {concepts.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No concepts identified yet
            </p>
          )}
        </div>
      </div>

      <style>{`
        .concept-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .concept-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .concept-badge-core {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .concept-badge-core:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }

        .concept-badge-supporting {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
        }

        .concept-badge-supporting:hover {
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
        }

        .concept-badge-detail {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        }

        .concept-badge-detail:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        }
      `}</style>
    </div>
  );
};
