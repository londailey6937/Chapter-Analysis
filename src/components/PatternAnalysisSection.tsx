/**
 * PatternAnalysisSection - Visualizes detected learning patterns
 *
 * Displays counts and examples of pedagogical structures found in the chapter:
 * - Worked Examples
 * - Practice Problems
 * - Definition-Example Pairs
 * - Formulas & Equations
 * - Procedures/Algorithms
 * - Comparisons
 */

import React, { useState } from "react";
import type { PatternAnalysis, PatternType, PatternMatch } from "../../types";

interface PatternAnalysisSectionProps {
  patternAnalysis: PatternAnalysis;
}

const PatternAnalysisSection: React.FC<PatternAnalysisSectionProps> = ({
  patternAnalysis,
}) => {
  const [expandedType, setExpandedType] = useState<PatternType | null>(null);

  // Pattern type metadata for display
  const patternMetadata: Record<
    PatternType,
    { icon: string; label: string; color: string; description: string }
  > = {
    workedExample: {
      icon: "📝",
      label: "Worked Examples",
      color: "#3b82f6", // blue
      description:
        "Step-by-step solutions showing how to solve problems and apply concepts",
    },
    practiceProblem: {
      icon: "✏️",
      label: "Practice Problems",
      color: "#6b7280", // gray
      description:
        "Exercises for students to solve independently and test understanding",
    },
    definitionExample: {
      icon: "💡",
      label: "Definition-Example Pairs",
      color: "#f59e0b", // amber
      description:
        "Concepts defined with concrete examples to illustrate meaning",
    },
    formula: {
      icon: "🔢",
      label: "Formulas & Equations",
      color: "#10b981", // green
      description:
        "Mathematical relationships and equations expressing concept relationships",
    },
    procedure: {
      icon: "🔄",
      label: "Procedures & Algorithms",
      color: "#06b6d4", // cyan
      description: "Step-by-step methods and processes for solving problems",
    },
    comparison: {
      icon: "⚖️",
      label: "Comparisons",
      color: "#ec4899", // pink
      description: "Side-by-side analysis contrasting related concepts",
    },
  };

  // Get patterns for a specific type
  const getPatternsByType = (type: PatternType): PatternMatch[] => {
    return patternAnalysis.patterns.filter((p) => p.type === type);
  };

  const toggleExpanded = (type: PatternType) => {
    setExpandedType(expandedType === type ? null : type);
  };

  const totalPatterns = patternAnalysis.totalPatterns;
  const coveragePercent = (patternAnalysis.coverage * 100).toFixed(1);

  if (totalPatterns === 0) {
    return null; // Don't show section if no patterns detected
  }

  return (
    <div style={{ marginTop: "40px", marginBottom: "40px" }}>
      <h3 className="section-header">📚 Learning Patterns Detected</h3>
      <p className="section-subtitle">
        Pedagogical structures that support effective learning ({totalPatterns}{" "}
        patterns found, {coveragePercent}% chapter coverage)
      </p>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {(Object.keys(patternMetadata) as PatternType[]).map((type) => {
          const count = patternAnalysis.patternCounts[type];
          if (count === 0) return null;

          const meta = patternMetadata[type];

          return (
            <div
              key={type}
              onClick={() => toggleExpanded(type)}
              className={`pattern-card ${
                expandedType === type ? "expanded" : ""
              }`}
              style={{}}
              onMouseEnter={(e) => {
                if (expandedType !== type) {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(59, 130, 246, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (expandedType !== type) {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "32px" }}>{meta.icon}</span>
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: 700,
                    color: meta.color,
                  }}
                >
                  {count}
                </span>
              </div>
              <div
                style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}
              >
                {meta.label}
              </div>
              <div
                style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}
              >
                Click to {expandedType === type ? "collapse" : "see examples"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Pattern Details */}
      {expandedType && (
        <div
          style={{
            border: `2px solid ${patternMetadata[expandedType].color}`,
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: `${patternMetadata[expandedType].color}05`,
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "28px" }}>
              {patternMetadata[expandedType].icon}
            </span>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
                {patternMetadata[expandedType].label}
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: "4px 0 0 0",
                }}
              >
                {patternMetadata[expandedType].description}
              </p>
            </div>
          </div>

          {/* Pattern Examples */}
          <div style={{ marginTop: "16px" }}>
            <h5
              style={{
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "12px",
                color: "#475569",
              }}
            >
              Examples Found ({patternAnalysis.patternCounts[expandedType]}):
            </h5>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {getPatternsByType(expandedType)
                .slice(0, 10) // Show first 10
                .map((pattern, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "12px",
                    }}
                  >
                    {pattern.title && (
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#1e293b",
                          marginBottom: "6px",
                        }}
                      >
                        {pattern.title}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#475569",
                        lineHeight: "1.5",
                        fontFamily: "monospace",
                        backgroundColor: "#f8fafc",
                        padding: "8px",
                        borderRadius: "4px",
                        maxHeight: "100px",
                        overflow: "auto",
                      }}
                    >
                      {pattern.context.length > 300
                        ? pattern.context.substring(0, 300) + "..."
                        : pattern.context}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#64748b",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>
                        Confidence: {(pattern.confidence * 100).toFixed(0)}%
                      </span>
                      {pattern.metadata?.difficulty && (
                        <span>Difficulty: {pattern.metadata.difficulty}</span>
                      )}
                      {pattern.metadata?.steps && (
                        <span>Steps: {pattern.metadata.steps}</span>
                      )}
                      {pattern.metadata?.hasAnswer !== undefined && (
                        <span>
                          {pattern.metadata.hasAnswer
                            ? "✅ Answer provided"
                            : "❌ No answer"}
                        </span>
                      )}
                      {/* Chemistry-specific metadata */}
                      {pattern.metadata?.problemType && (
                        <span
                          style={{
                            backgroundColor: "#dbeafe",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            color: "#1e40af",
                            fontWeight: 600,
                          }}
                        >
                          🧪 {pattern.metadata.problemType}
                        </span>
                      )}
                      {pattern.metadata?.isBalanced !== undefined && (
                        <span>
                          {pattern.metadata.isBalanced
                            ? "⚖️ Balanced"
                            : "⚠️ Unbalanced"}
                        </span>
                      )}
                      {pattern.metadata?.procedureType && (
                        <span
                          style={{
                            backgroundColor: "#dcfce7",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            color: "#166534",
                            fontWeight: 600,
                          }}
                        >
                          {pattern.metadata.procedureType === "laboratory"
                            ? "🔬 Lab"
                            : "⚗️ Mechanism"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              {patternAnalysis.patternCounts[expandedType] > 10 && (
                <div
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  ... and {patternAnalysis.patternCounts[expandedType] - 10}{" "}
                  more
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pattern Insights */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "16px",
          marginTop: "20px",
        }}
      >
        <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
          📊 Pattern Insights
        </h4>
        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            fontSize: "13px",
            color: "#475569",
          }}
        >
          {patternAnalysis.patternCounts.workedExample > 0 && (
            <li>
              <strong>
                {patternAnalysis.patternCounts.workedExample} worked examples
              </strong>{" "}
              demonstrate problem-solving approaches
            </li>
          )}
          {patternAnalysis.patternCounts.practiceProblem > 0 && (
            <li>
              <strong>
                {patternAnalysis.patternCounts.practiceProblem} practice
                problems
              </strong>{" "}
              support retrieval practice and active learning
            </li>
          )}
          {patternAnalysis.patternCounts.definitionExample > 0 && (
            <li>
              <strong>
                {patternAnalysis.patternCounts.definitionExample}{" "}
                definition-example pairs
              </strong>{" "}
              aid conceptual understanding
            </li>
          )}
          {patternAnalysis.patternCounts.formula > 0 && (
            <li>
              <strong>{patternAnalysis.patternCounts.formula} formulas</strong>{" "}
              express quantitative relationships
            </li>
          )}
          {patternAnalysis.patternCounts.procedure > 0 && (
            <li>
              <strong>
                {patternAnalysis.patternCounts.procedure} procedures
              </strong>{" "}
              guide systematic problem-solving
            </li>
          )}
          {patternAnalysis.patternCounts.comparison > 0 && (
            <li>
              <strong>
                {patternAnalysis.patternCounts.comparison} comparisons
              </strong>{" "}
              clarify differences and relationships
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PatternAnalysisSection;
