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
  onReport?: () => void;
  title?: string;
}

export const ConceptPill: React.FC<ConceptPillProps> = ({
  id,
  label,
  count,
  color,
  isHighlighted = false,
  onClick,
  onReport,
  title,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="concept-pill-wrapper"
      style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          position: "relative",
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
      {onReport && isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReport();
          }}
          title="Report False Positive"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
        </button>
      )}
    </div>
  );
};
