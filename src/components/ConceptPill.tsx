/**
 * ConceptPill Component
 * Reusable pill button for displaying concepts with consistent styling
 */

import React from "react";

interface ConceptPillProps {
  id: string;
  label: string;
  count: number;
  color: string;
  isHighlighted?: boolean;
  onClick: () => void;
  title?: string;
}

export const ConceptPill: React.FC<ConceptPillProps> = ({
  id,
  label,
  count,
  color,
  isHighlighted = false,
  onClick,
  title,
}) => {
  return (
    <button
      key={id}
      onClick={onClick}
      className={`concept-pill ${isHighlighted ? "highlighted" : ""}`}
      style={{
        padding: "6px 12px",
        backgroundColor: isHighlighted ? "#eff6ff" : "#ffffff",
        border: isHighlighted ? "2px solid #3b82f6" : "1.5px solid #cbd5e1",
        borderRadius: "8px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s ease",
        fontSize: "13px",
        fontWeight: isHighlighted ? "600" : "500",
        color: "#334155",
      }}
      onMouseEnter={(e) => {
        if (!isHighlighted) {
          e.currentTarget.style.backgroundColor = "#f8fafc";
          e.currentTarget.style.borderColor = "#3b82f6";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow =
            "0 2px 8px rgba(59, 130, 246, 0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isHighlighted) {
          e.currentTarget.style.backgroundColor = "#ffffff";
          e.currentTarget.style.borderColor = "#cbd5e1";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
      title={title || `${label} - ${count} mentions`}
    >
      <span style={{ textTransform: "capitalize" }}>{label}</span>
      <span className="concept-pill-count">{count}×</span>
    </button>
  );
};
