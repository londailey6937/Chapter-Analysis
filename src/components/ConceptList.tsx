/**
 * ConceptList Component
 * Displays all identified concepts with click-to-highlight functionality
 */

import React, { useState } from "react";
import type { Concept } from "@/types";
import { ConceptPill } from "./ConceptPill";

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

  const buildNavigableMentionIndices = (concept?: Concept): number[] => {
    if (!concept?.mentions || concept.mentions.length === 0) {
      return [];
    }
    const hasCanonical = concept.mentions.some(
      (mention) => mention && mention.isAlias !== true
    );
    return concept.mentions.reduce<number[]>((acc, mention, index) => {
      if (!mention) {
        return acc;
      }
      if (mention.isAlias !== true || !hasCanonical) {
        acc.push(index);
      }
      return acc;
    }, []);
  };

  const getPrimaryMentionIndex = (concept: Concept): number => {
    const navigable = buildNavigableMentionIndices(concept);
    return navigable.length ? navigable[0] : 0;
  };

  // Sort concepts alphabetically (all are core concepts now)
  const sortedConcepts = [...concepts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const navigableIndices = buildNavigableMentionIndices(highlightedConcept);
  const currentNavigablePosition = navigableIndices.findIndex(
    (index) => index === currentMentionIndex
  );
  const resolveAdjacentMentionIndex = (direction: 1 | -1): number | null => {
    if (!highlightedConcept || navigableIndices.length === 0) {
      return null;
    }
    const baselinePosition =
      currentNavigablePosition === -1
        ? direction === 1
          ? -1
          : navigableIndices.length
        : currentNavigablePosition;
    const nextPosition = baselinePosition + direction;
    if (nextPosition < 0 || nextPosition >= navigableIndices.length) {
      return null;
    }
    return navigableIndices[nextPosition];
  };

  const previousMentionIndex = resolveAdjacentMentionIndex(-1);
  const nextMentionIndex = resolveAdjacentMentionIndex(1);

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
          <h3 className="section-header">📚 Core Concepts Identified</h3>
          <p className="section-subtitle">
            Fundamental programming concepts covered - Click to highlight in
            document
          </p>
        </div>
        <div className="card-body">
          {sortedConcepts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sortedConcepts.map((concept) => (
                <ConceptPill
                  key={concept.id}
                  id={concept.id}
                  label={concept.name}
                  count={concept.mentions.length}
                  color="#3b82f6"
                  isHighlighted={highlightedConceptId === concept.id}
                  onClick={() =>
                    onConceptClick(concept, getPrimaryMentionIndex(concept))
                  }
                  title={`${concept.name} - ${concept.mentions.length} mentions`}
                />
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
      {highlightedConcept && navigableIndices.length > 1 && (
        <div className="floating-nav">
          <div className="floating-nav-content">
            <div className="floating-nav-label">
              <strong>{highlightedConcept.name}</strong>
              <span className="mention-counter">
                {Math.max(currentNavigablePosition, 0) + 1} /{" "}
                {navigableIndices.length}
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

        .nav-button {
          flex: 1;
          padding: 8px 16px;
          border-radius: 6px;
          background: white;
          border: 2px solid #ef8432;
          color: #2c3e50;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-button:hover:not(:disabled) {
          background: #f7e6d0;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(239, 132, 50, 0.3);
        }

        .nav-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          border-color: #d1d5db;
          color: #9ca3af;
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
};
