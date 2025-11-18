import React from "react";
import type { GeneralConcept } from "../utils/generalConceptExtractor";
import { getConceptCategoryInfo } from "../utils/generalConceptExtractor";
import { ConceptPill } from "./ConceptPill";

interface GeneralConceptGeneratorProps {
  concepts: GeneralConcept[];
  onConceptClick: (position: number, term: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * General Concept Generator
 * Displays extracted concepts from general content (when no domain is selected)
 * Shows at bottom of Analysis panel with preview navigation
 */
export const GeneralConceptGenerator: React.FC<
  GeneralConceptGeneratorProps
> = ({ concepts, onConceptClick, className, style }) => {
  if (!concepts || concepts.length === 0) {
    return null;
  }

  // Group concepts by category
  const groupedConcepts = concepts.reduce((acc, concept) => {
    if (!acc[concept.category]) {
      acc[concept.category] = [];
    }
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<string, GeneralConcept[]>);

  const combinedClassName = ["card", className].filter(Boolean).join(" ");
  const combinedStyle: React.CSSProperties = {
    marginTop: "24px",
    width: "100%",
    ...style,
  };

  return (
    <div className={combinedClassName} style={combinedStyle}>
      <div className="card-header">
        <h3 className="section-header">📝 Key Themes & Concepts</h3>
        <p className="section-subtitle">
          Automatically extracted from your content. Click any concept to view
          in document.
        </p>
      </div>

      {/* Concept Groups */}
      <div className="card-body">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {Object.entries(groupedConcepts).map(([category, conceptList]) => {
            const categoryInfo = getConceptCategoryInfo(
              category as GeneralConcept["category"]
            );

            return (
              <div key={category}>
                {/* Category Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{categoryInfo.icon}</span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {categoryInfo.label}s
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: "500",
                    }}
                  >
                    ({conceptList.length})
                  </span>
                </div>

                {/* Concept Pills */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {conceptList.map((concept) => (
                    <ConceptPill
                      key={concept.id}
                      id={concept.id}
                      label={concept.term}
                      count={concept.frequency}
                      color={categoryInfo.color}
                      onClick={() =>
                        onConceptClick(concept.positions[0], concept.term)
                      }
                      title={`Found ${concept.frequency} times. Click to view in document.`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            <strong style={{ color: "#334155" }}>{concepts.length}</strong> key
            concepts identified
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              fontStyle: "italic",
            }}
          >
            💡 Tip: Add a domain for deeper analysis
          </div>
        </div>
      </div>
    </div>
  );
};
