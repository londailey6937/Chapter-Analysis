/**
 * ConceptList Component
 * Displays all identified concepts with click-to-highlight functionality
 */

import React, { useState } from "react";
import type { Concept } from "@/types";

interface ConceptListProps {
  concepts: Concept[];
  onConceptClick: (concept: Concept, mentionIndex: number) => void;
  highlightedConceptId?: string | null;
  currentMentionIndex?: number;
}

export const ConceptList: React.FC<ConceptListProps> = ({
  concepts,
  onConceptClick,
  highlightedConceptId,
  currentMentionIndex = 0,
}) => {
  // Find the highlighted concept to show navigation
  const highlightedConcept = concepts.find(
    (c) => c.id === highlightedConceptId
  );
  const totalMentions = highlightedConcept?.mentions.length || 0;

  const getPrimaryMentionIndex = (concept: Concept): number => {
    if (!concept?.mentions || concept.mentions.length === 0) {
      return 0;
    }
    const canonicalIndex = concept.mentions.findIndex(
      (mention) => mention && mention.isAlias !== true
    );
    return canonicalIndex >= 0 ? canonicalIndex : 0;
  };

  const findNextMentionIndex = (
    concept: Concept | undefined,
    startIndex: number,
    direction: 1 | -1
  ): number | null => {
    if (!concept?.mentions || concept.mentions.length === 0) {
      return null;
    }

    const { mentions } = concept;
    const hasCanonical = mentions.some((mention) => mention.isAlias !== true);
    let index = startIndex + direction;

    while (index >= 0 && index < mentions.length) {
      const mention = mentions[index];
      if (!mention) {
        index += direction;
        continue;
      }

      if (mention.isAlias !== true) {
        return index;
      }

      if (!hasCanonical) {
        return index;
      }

      index += direction;
    }

    return null;
  };

  // Sort concepts alphabetically (all are core concepts now)
  const sortedConcepts = [...concepts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const previousMentionIndex = highlightedConcept
    ? findNextMentionIndex(highlightedConcept, currentMentionIndex, -1)
    : null;
  const nextMentionIndex = highlightedConcept
    ? findNextMentionIndex(highlightedConcept, currentMentionIndex, 1)
    : null;

  const handlePrevious = () => {
    if (highlightedConcept && previousMentionIndex !== null) {
      onConceptClick(highlightedConcept, previousMentionIndex);
    }
  };

  const handleNext = () => {
    if (highlightedConcept && nextMentionIndex !== null) {
      onConceptClick(highlightedConcept, nextMentionIndex);
    }
  };

  return (
    <div className="concept-list">
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-bold">📚 Core Concepts Identified</h3>
          <p className="text-sm text-gray-600 mt-1">
            Fundamental programming concepts covered - Click to highlight in
            document
          </p>
        </div>
        <div className="card-body">
          {sortedConcepts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sortedConcepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() =>
                    onConceptClick(concept, getPrimaryMentionIndex(concept))
                  }
                  className={`concept-badge concept-badge-core ${
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
          ) : (
            <p className="text-gray-500 text-center py-4">
              No concepts identified yet
            </p>
          )}
        </div>
      </div>

      {/* Floating Navigation Widget */}
      {highlightedConcept && totalMentions > 1 && (
        <div className="floating-nav">
          <div className="floating-nav-content">
            <div className="floating-nav-label">
              <strong>{highlightedConcept.name}</strong>
              <span className="mention-counter">
                {currentMentionIndex + 1} / {totalMentions}
              </span>
            </div>
            <div className="floating-nav-buttons">
              <button
                onClick={handlePrevious}
                disabled={previousMentionIndex === null}
                className="nav-button"
                title="Previous mention"
              >
                ← Prev
              </button>
              <button
                onClick={handleNext}
                disabled={nextMentionIndex === null}
                className="nav-button"
                title="Next mention"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .floating-nav {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .floating-nav-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          padding: 16px;
          min-width: 280px;
          border: 2px solid #3b82f6;
        }

        .floating-nav-label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .floating-nav-label strong {
          font-size: 15px;
          color: #1f2937;
        }

        .mention-counter {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .floating-nav-buttons {
          display: flex;
          gap: 8px;
        }

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

        .nav-button {
          flex: 1;
          padding: 8px 16px;
          border-radius: 6px;
          background: white;
          border: 2px solid #3b82f6;
          color: #3b82f6;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-button:hover:not(:disabled) {
          background: #3b82f6;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .nav-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          border-color: #d1d5db;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};
