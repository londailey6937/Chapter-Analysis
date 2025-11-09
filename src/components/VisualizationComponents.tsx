import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  ChapterAnalysis,
  Concept,
  ConceptNode,
  ConceptLink,
  PrincipleEvaluation,
} from "@/types";
import { ConceptList } from "./ConceptList";

// Friendly display names for principle enum codes to avoid raw concatenation (e.g., "dualCoding") in UI copy
const PRINCIPLE_NAME_MAP: Record<string, string> = {
  deepProcessing: "Deep Processing",
  spacedRepetition: "Spaced Repetition",
  retrievalPractice: "Retrieval Practice",
  interleaving: "Interleaving",
  dualCoding: "Dual Coding",
  generativeLearning: "Generative Learning",
  metacognition: "Metacognition",
  schemaBuilding: "Schema Building",
  cognitiveLoad: "Cognitive Load",
  emotionAndRelevance: "Emotion & Relevance",
};

// Definitions and examples for each learning principle
const PRINCIPLE_DEFINITIONS: Record<
  string,
  { definition: string; example: string }
> = {
  deepProcessing: {
    definition:
      "Engaging with material at a meaningful level through elaboration, connecting to prior knowledge, and asking 'why' questions rather than surface-level memorization.",
    example:
      "Instead of memorizing 'mitochondria = powerhouse of cell,' explain how ATP production enables cellular processes and why certain cells have more mitochondria.",
  },
  spacedRepetition: {
    definition:
      "Distributing practice and review over time with increasing intervals, leveraging the spacing effect to combat forgetting and strengthen long-term retention.",
    example:
      "Review key concepts after 1 day, then 3 days, then 1 week, rather than cramming all practice into a single session.",
  },
  retrievalPractice: {
    definition:
      "Actively recalling information from memory without looking at notes, which strengthens neural pathways and reveals gaps in understanding.",
    example:
      "Close the book and write down everything you remember about photosynthesis, then check for accuracy—don't just re-read highlighted passages.",
  },
  interleaving: {
    definition:
      "Mixing different topics or problem types during practice rather than blocking similar items together, improving discrimination and transfer.",
    example:
      "Practice problems alternating between derivatives, integrals, and limits, rather than doing 20 derivative problems in a row.",
  },
  dualCoding: {
    definition:
      "Combining verbal and visual representations of information to create multiple memory pathways and deepen understanding through complementary formats.",
    example:
      "Pair a written explanation of the water cycle with a diagram showing evaporation, condensation, and precipitation with arrows indicating flow.",
  },
  generativeLearning: {
    definition:
      "Creating new content, making predictions, or explaining concepts in your own words to actively construct understanding rather than passively receiving information.",
    example:
      "Before reading about natural selection, predict how trait frequencies might change in a population, then compare your reasoning to the actual mechanism.",
  },
  metacognition: {
    definition:
      "Thinking about your own thinking—monitoring comprehension, planning learning strategies, evaluating what you know and don't know, and adjusting approaches accordingly.",
    example:
      "After each section, pause to ask: 'What's still confusing? What strategy should I try? Can I explain this concept to someone else?'",
  },
  schemaBuilding: {
    definition:
      "Organizing information into connected mental frameworks that show relationships between concepts, building from foundational ideas to complex applications.",
    example:
      "Create a concept map showing how cell structure, organelles, metabolism, and reproduction all connect to the central theme of maintaining life.",
  },
  cognitiveLoad: {
    definition:
      "Managing the amount of information processed simultaneously, reducing extraneous load from distractions while optimizing germane load for learning-relevant processing.",
    example:
      "Introduce the basic equation first, work through examples, then add special cases—rather than presenting all variations and exceptions simultaneously.",
  },
  emotionAndRelevance: {
    definition:
      "Connecting content to personal experiences, goals, and emotions to increase motivation, attention, and memory formation through meaningful engagement.",
    example:
      "Relate chemical reactions to cooking food you love, or connect economic principles to managing your own budget and financial goals.",
  },
};

// ============================================================================
// CHAPTER OVERVIEW TIMELINE
// ============================================================================

export const ChapterOverviewTimeline: React.FC<{
  analysis: ChapterAnalysis;
}> = ({ analysis }) => {
  const allSections = analysis.visualizations.cognitiveLoadCurve || [];
  const [zoom, setZoom] = useState(1);

  // Filter out TOC and front matter sections
  const sections = allSections.filter((sec: any) => {
    const heading = (sec.heading || sec.sectionId || "").toLowerCase();
    return (
      !heading.includes("table of contents") &&
      !heading.includes("contents") &&
      !heading.match(/^(toc|contents|index)$/i) &&
      !heading.match(/^page \d+$/i)
    ); // Filter out "Page N" sections
  });

  const blockingSegments =
    analysis.visualizations.interleavingPattern.blockingSegments || [];

  // Build section issue severity map
  const sectionIssues: Record<
    string,
    { load: number; hasBlocking: boolean; sectionName: string }
  > = {};

  sections.forEach((sec: any) => {
    sectionIssues[sec.sectionId] = {
      load: sec.load,
      hasBlocking: false,
      sectionName: sec.heading || sec.sectionId,
    };
  });

  // Mark sections with blocking issues
  blockingSegments.forEach((block: any) => {
    if (block.sectionId && sectionIssues[block.sectionId]) {
      sectionIssues[block.sectionId].hasBlocking = true;
    }
  });

  // Determine color for each section based on issues
  const getSectionColor = (load: number, hasBlocking: boolean): string => {
    if (load > 0.8 || hasBlocking) return "var(--danger-600)"; // red: high load or blocking
    if (load > 0.6) return "var(--warn-600)"; // amber: moderate load
    return "var(--success-600)"; // green: good
  };

  const getSectionLabel = (load: number, hasBlocking: boolean): string => {
    if (load > 0.8 && hasBlocking) return "High load + blocking";
    if (load > 0.8) return "High cognitive load";
    if (hasBlocking) return "Blocking detected";
    if (load > 0.6) return "Moderate load";
    return "Well-balanced";
  };

  if (sections.length === 0) return null;

  const isScrollable = sections.length > 60;
  const baseWidth = 26;
  const perWidth = Math.max(8, Math.min(60, Math.round(baseWidth * zoom)));

  return (
    <div className="viz-container chapter-timeline">
      <h3>Chapter Structure Overview</h3>
      <p className="viz-subtitle">
        Color-coded sections show where improvements are needed
      </p>
      <div className={`timeline-bar ${isScrollable ? "scrollable" : ""}`}>
        {isScrollable ? (
          <div
            className="timeline-track"
            style={{ width: `${sections.length * perWidth}px` }}
          >
            {sections.map((sec: any, idx: number) => {
              const issue = sectionIssues[sec.sectionId] || {
                load: 0,
                hasBlocking: false,
                sectionName: sec.heading,
              };
              const color = getSectionColor(issue.load, issue.hasBlocking);
              const label = getSectionLabel(issue.load, issue.hasBlocking);
              return (
                <div
                  key={sec.sectionId || idx}
                  className="timeline-section"
                  style={{ width: `${perWidth}px`, backgroundColor: color }}
                  title={`${issue.sectionName}: ${label}`}
                  onClick={() => {
                    const pos =
                      (sec as any).position ?? (sec as any).startPosition ?? 0;
                    console.log("🖱️ Timeline section clicked:", {
                      sectionName: issue.sectionName,
                      position: pos,
                      sectionIndex: idx,
                      sectionId: sec.sectionId,
                    });
                    window.dispatchEvent(
                      new CustomEvent("jump-to-position", {
                        detail: {
                          position: pos,
                          heading: issue.sectionName,
                          sectionIndex: idx,
                          sectionId: sec.sectionId,
                        },
                      })
                    );
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const pos =
                        (sec as any).position ??
                        (sec as any).startPosition ??
                        0;
                      window.dispatchEvent(
                        new CustomEvent("jump-to-position", {
                          detail: {
                            position: pos,
                            heading: issue.sectionName,
                            sectionIndex: idx,
                            sectionId: sec.sectionId,
                          },
                        })
                      );
                    }
                  }}
                >
                  <span className="section-index">{idx + 1}</span>
                </div>
              );
            })}
          </div>
        ) : (
          sections.map((sec: any, idx: number) => {
            const issue = sectionIssues[sec.sectionId] || {
              load: 0,
              hasBlocking: false,
              sectionName: sec.heading,
            };
            const color = getSectionColor(issue.load, issue.hasBlocking);
            const label = getSectionLabel(issue.load, issue.hasBlocking);
            const width = `${100 / sections.length}%`;
            return (
              <div
                key={sec.sectionId || idx}
                className="timeline-section"
                style={{ width, backgroundColor: color }}
                title={`${issue.sectionName}: ${label}`}
                onClick={() => {
                  const pos =
                    (sec as any).position ?? (sec as any).startPosition ?? 0;
                  window.dispatchEvent(
                    new CustomEvent("jump-to-position", {
                      detail: {
                        position: pos,
                        heading: issue.sectionName,
                        sectionIndex: idx,
                        sectionId: sec.sectionId,
                      },
                    })
                  );
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const pos =
                      (sec as any).position ?? (sec as any).startPosition ?? 0;
                    window.dispatchEvent(
                      new CustomEvent("jump-to-position", {
                        detail: {
                          position: pos,
                          heading: issue.sectionName,
                          sectionIndex: idx,
                          sectionId: sec.sectionId,
                        },
                      })
                    );
                  }
                }}
              >
                <span className="section-index">{idx + 1}</span>
              </div>
            );
          })
        )}
      </div>
      {isScrollable && (
        <div className="timeline-controls">
          <button
            className="zoom-btn"
            onClick={() =>
              setZoom((z) => Math.max(0.4, Number((z - 0.15).toFixed(2))))
            }
          >
            −
          </button>
          <div className="zoom-meter">{Math.round(perWidth)}px</div>
          <button
            className="zoom-btn"
            onClick={() =>
              setZoom((z) => Math.min(3, Number((z + 0.15).toFixed(2))))
            }
          >
            +
          </button>
        </div>
      )}
      <div className="timeline-legend">
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: "var(--success-600)" }}
          />
          Well-balanced
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: "var(--warn-600)" }}
          />
          Moderate load
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: "var(--danger-600)" }}
          />
          High load or blocking
        </div>
      </div>
      <style>{`
        .chapter-timeline {
          margin-bottom: 24px;
        }
        .timeline-bar {
          display: flex;
          height: 40px;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin: 16px 0;
          position: relative;
        }
        .timeline-bar.scrollable { overflow-x: auto; overflow-y: hidden; }
        .timeline-track { display: flex; height: 100%; }
        .timeline-section {
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid rgba(255,255,255,0.3);
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }
        .timeline-section:hover {
          filter: brightness(0.85);
          transform: scaleY(1.15);
          z-index: 1;
        }
        .section-index {
          color: white;
          font-size: 11px;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .timeline-legend {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 12px;
          margin-top: 10px;
        }
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
        }
        .timeline-controls { display:flex; align-items:center; gap:8px; justify-content:flex-end; margin-top:4px; }
        .zoom-btn { border:1px solid var(--border-soft); background:white; border-radius:6px; width:28px; height:28px; cursor:pointer; font-size:16px; line-height:1; }
        .zoom-btn:hover { background:#f3f4f6; }
        .zoom-meter { font-size:12px; color: var(--text-subtle); min-width:48px; text-align:center; }
      `}</style>
    </div>
  );
};

// ============================================================================
// PRINCIPLE SCORES RADAR CHART
// ============================================================================

export const PrincipleScoresRadar: React.FC<{ analysis: ChapterAnalysis }> = ({
  analysis,
}) => {
  const data = analysis.visualizations.principleScores.principles.map((p) => ({
    name: p.name,
    score: p.score,
    fullName: p.displayName,
  }));

  return (
    <div className="viz-container">
      <h3>Learning Principles Coverage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
            formatter={(value: any) => `${value.toFixed(0)}/100`}
            labelFormatter={(label: any) => {
              const item = data.find((d) => d.name === label);
              return item ? item.fullName : label;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="overall-score">
        <strong>Overall Score: {analysis.overallScore.toFixed(1)}/100</strong>
      </div>
      <div className="why-matters-block">
        <strong>Why this matters:</strong> Mapping principle coverage surfaces
        pedagogical strengths and exposes missing strategies so revisions target
        the biggest learning impact.
      </div>
      <div className="recommendation-block">
        <strong>Recommendation:</strong>{" "}
        {analysis.overallScore >= 80
          ? "Excellent principle coverage—maintain this balanced approach in future chapters."
          : analysis.overallScore >= 60
          ? "Good foundation; focus on strengthening the lowest-scoring principles for maximum impact."
          : "Several principles need attention—prioritize adding interleaving, elaboration, and retrieval practice."}
      </div>
    </div>
  );
};

// ============================================================================
// COGNITIVE LOAD CURVE
// ============================================================================

export const CognitiveLoadCurve: React.FC<{ analysis: ChapterAnalysis }> = ({
  analysis,
}) => {
  const points = analysis.visualizations.cognitiveLoadCurve || [];
  const hasData = points.length > 0;
  const data = points.map((point, idx) => ({
    section:
      (point.heading || point.sectionId || `S${idx + 1}`).length > 28
        ? (point.heading || point.sectionId || `S${idx + 1}`).slice(0, 25) + "…"
        : point.heading || point.sectionId || `S${idx + 1}`,
    load: Math.round(point.load * 100),
    novelConcepts: point.factors.novelConcepts,
    complexity: point.factors.sentenceComplexity,
  }));

  return (
    <div className="viz-container">
      <h3>Cognitive Load Distribution</h3>
      <p className="viz-subtitle">
        Lower is better; peaks indicate challenging sections
      </p>
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="section"
              tick={{ fontSize: 10 }}
              interval={(() => {
                const n = data.length;
                if (n > 200) return Math.ceil(n / 20); // show ~20 ticks
                if (n > 100) return Math.ceil(n / 15);
                if (n > 60) return Math.ceil(n / 12);
                if (n > 35) return Math.ceil(n / 10);
                return 0;
              })()}
              tickFormatter={(value: string, index: number) => {
                const n = data.length;
                if (n > 60) return `S${index + 1}`; // compact label
                return value;
              }}
              angle={-35}
              textAnchor="end"
              height={70}
            />
            <YAxis
              label={{ value: "Load %", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
              }}
              formatter={(value: any, name: string) => {
                if (name === "Cognitive Load") return `${value}%`;
                if (name === "New Concepts") return String(value);
                return String(value);
              }}
              labelFormatter={(label: any) => `Heading: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="load"
              stroke="#ff7c7c"
              name="Cognitive Load"
              dot={{ r: 3 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="novelConcepts"
              stroke="#82ca9d"
              name="New Concepts"
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ padding: "30px", textAlign: "center", color: "#666" }}>
          <em>
            No section load data – likely no sections detected or concept
            extraction empty.
          </em>
        </div>
      )}
      <div className="why-matters-block">
        <strong>Why this matters:</strong> Managing peaks prevents overload.
        Balanced cognitive demand keeps working memory free for meaning-making
        instead of survival.
      </div>
      {hasData &&
        (() => {
          const maxLoad = Math.max(...data.map((d) => d.load));
          const avgLoad =
            data.reduce((sum, d) => sum + d.load, 0) / data.length;
          const peakSection = data.find((d) => d.load === maxLoad);
          return (
            <div className="recommendation-block">
              <strong>Recommendation:</strong>{" "}
              {maxLoad > 80
                ? `Peak load at ${maxLoad}% in "${
                    peakSection?.section || "a section"
                  }"—consider breaking dense sections into smaller chunks or adding examples.`
                : maxLoad > 60
                ? `Load is manageable but watch sections above 60%${
                    peakSection ? ` (e.g., "${peakSection.section}")` : ""
                  }—add scaffolding or worked examples if needed.`
                : `Excellent! Cognitive load is well-balanced. Current pacing and concept density are optimal for learner comprehension.`}
            </div>
          );
        })()}
    </div>
  );
};

// ============================================================================
// CONCEPT MENTION FREQUENCY
// ============================================================================

export const ConceptMentionFrequency: React.FC<{
  analysis: ChapterAnalysis;
}> = ({ analysis }) => {
  const reviewPatterns = analysis.conceptAnalysis.reviewPatterns.slice(0, 15);
  const data = reviewPatterns.map((pattern) => ({
    concept: pattern.conceptName || pattern.conceptId.replace("concept-", "C"),
    mentions: pattern.mentions,
    isOptimal: pattern.isOptimal,
  }));

  return (
    <div className="viz-container">
      <h3>Concept Revisit Frequency</h3>
      <p className="viz-subtitle">
        Concept revisit counts (spacing quality indicated by bar color)
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="concept" tick={{ fontSize: 10 }} />
          <YAxis
            label={{ value: "Mentions", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
            formatter={(value: any, _name: any, props: any) => {
              const entry = props.payload as any;
              return [
                value,
                entry.isOptimal ? "Optimal spacing" : "Needs adjustment",
              ];
            }}
          />
          <Bar dataKey="mentions" radius={[6, 6, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={entry.isOptimal ? "#16a34a" : "#dc2626"}
              />
            ))}
          </Bar>
          <Legend
            verticalAlign="bottom"
            height={36}
            content={<RevisitLegend />}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="accessibility-note" aria-hidden="true">
        <small>
          Legend: Green = optimal spaced revisits; Red = revisit pattern may
          need adjustment.
        </small>
      </div>
      <div className="why-matters-block">
        <strong>Why this matters:</strong> Frequency without strategic spacing
        can create illusion of mastery; balanced distributed mentions foster
        durable learning.
      </div>
      <div className="recommendation-block">
        <strong>Recommendation:</strong>{" "}
        {(() => {
          const optimalCount = data.filter((d) => d.isOptimal).length;
          const totalCount = data.length;
          const optimalRatio = totalCount > 0 ? optimalCount / totalCount : 0;
          return optimalRatio >= 0.8
            ? "Excellent spacing patterns—most concepts have optimal revisit distribution."
            : optimalRatio >= 0.5
            ? "Good progress; review red-marked concepts and adjust spacing intervals for better retention."
            : "Many concepts need spacing adjustments—ensure 3-5 spaced revisits per concept with increasing intervals.";
        })()}
      </div>
    </div>
  );
};

// Custom bar shape component for coloring
const BarShape = (props: { isOptimal?: boolean }): any => {
  // Destructure into a prefixed variable to avoid unused parameter lint
  const { isOptimal: _isOptimal } = props;
  return ({ x, y, width, height, fill }: any) => {
    return (
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />
    );
  };
};

// Custom legend for revisit frequency
const RevisitLegend: React.FC<any> = () => {
  return (
    <div style={{ display: "flex", gap: "18px", padding: "6px 0" }}>
      <LegendItem color="#16a34a" label="Optimal spacing" />
      <LegendItem color="#dc2626" label="Needs adjustment" />
    </div>
  );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <span
      style={{
        width: 14,
        height: 14,
        backgroundColor: color,
        borderRadius: 3,
        display: "inline-block",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
      }}
      aria-hidden="true"
    />
    <span style={{ fontSize: 12 }}>{label}</span>
  </div>
);

// ============================================================================
// CONCEPT MAP VISUALIZATION
// ============================================================================

interface ConceptMapProps {
  nodes: ConceptNode[];
  links: ConceptLink[];
}

export const ConceptMapVisualization: React.FC<ConceptMapProps> = ({
  nodes,
  links,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="viz-container">
        <p>No concepts to visualize</p>
      </div>
    );
  }

  // Simple force-directed layout (mock)
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  // Position nodes by importance/angle
  const positioned = nodes.map((node, idx) => {
    const angle = (idx / nodes.length) * Math.PI * 2;
    const radius =
      node.importance === "core"
        ? 80
        : node.importance === "supporting"
        ? 150
        : 220;

    return {
      ...node,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });

  return (
    <div className="viz-container">
      <h3>Concept Relationship Map</h3>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#888" />
          </marker>
        </defs>

        {/* Links */}
        {links.map((link, idx) => {
          const source = positioned.find((n) => n.id === link.source);
          const target = positioned.find((n) => n.id === link.target);

          if (!source || !target) return null;

          const strokeWidth = link.strength * 3;
          const strokeColor =
            link.type === "prerequisite"
              ? "#e74c3c"
              : link.type === "contrasts"
              ? "#e67e22"
              : "#3498db";

          return (
            <line
              key={idx}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={0.6}
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {/* Nodes */}
        {positioned.map((node) => (
          <g
            key={node.id}
            onClick={() => setSelectedNode(node.id)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill={node.color}
              opacity={
                selectedNode === null || selectedNode === node.id ? 1 : 0.3
              }
              stroke={selectedNode === node.id ? "#000" : "#666"}
              strokeWidth={selectedNode === node.id ? 2 : 1}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy="0.3em"
              fontSize="11"
              fontWeight="bold"
              fill="#fff"
              pointerEvents="none"
            >
              {node.label.split(" ").slice(0, 2).join("\n")}
            </text>
          </g>
        ))}
      </svg>

      <div className="concept-map-legend">
        <div className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: "#FF6B6B" }}
          />
          Core Concepts
        </div>
        <div className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: "#4ECDC4" }}
          />
          Supporting
        </div>
        <div className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: "#95E1D3" }}
          />
          Details
        </div>
      </div>
      <div className="why-matters-block">
        <strong>Why this matters:</strong> Explicit structure accelerates schema
        formation and transfer; learners remember networks, not isolated facts.
      </div>
      <div className="recommendation-block">
        <strong>Recommendation:</strong>{" "}
        {(() => {
          const coreCount = nodes.filter((n) => n.importance === "core").length;
          const linkCount = links.length;
          const avgLinks = nodes.length > 0 ? linkCount / nodes.length : 0;
          return coreCount === 0
            ? "No core concepts identified—ensure key foundational ideas are emphasized and connected."
            : avgLinks < 1
            ? "Sparse connections detected—add more explicit relationships between concepts to build mental models."
            : "Good concept structure; consider adding prerequisite links to clarify learning sequence.";
        })()}
      </div>
    </div>
  );
};

// ============================================================================
// BLOCKING ISSUE CARD COMPONENT
// ============================================================================

interface BlockingIssueCardProps {
  conceptName: string;
  longestRun: number;
  occurrences: number;
  lengths: number[];
  sections?: string[];
}

const BlockingIssueCard: React.FC<BlockingIssueCardProps> = ({
  conceptName,
  longestRun,
  occurrences,
  lengths,
  sections = [],
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="blocking-card" onClick={() => setExpanded(!expanded)}>
      <div className="blocking-header">
        <h5 className="blocking-concept-name">{conceptName}</h5>
        <div className="blocking-badge">{longestRun} consecutive</div>
      </div>

      {expanded && (
        <div className="blocking-details">
          <div className="blocking-stats">
            <p>
              <strong>Longest run:</strong> {longestRun} consecutive mentions
            </p>
            {occurrences > 1 && (
              <p>
                <strong>Blocking segments:</strong> {occurrences} total (runs:{" "}
                {lengths.slice(0, 3).join(", ")}
                {lengths.length > 3 ? ", …" : ""})
              </p>
            )}
            {sections.length > 0 && (
              <p className="blocking-location">
                📍 <strong>Found in:</strong> {sections.slice(0, 2).join(", ")}
                {sections.length > 2 && ` (+${sections.length - 2} more)`}
              </p>
            )}
          </div>

          <div className="blocking-why-matters">
            <strong>Why this matters:</strong> Blocked practice (repeating the
            same concept many times in a row) creates an illusion of mastery but
            leads to poor long-term retention and difficulty distinguishing
            between similar concepts.
          </div>

          <div className="blocking-suggestion-box">
            <strong>How to fix:</strong> Break these up with contrasting
            concepts or brief application prompts. For example, after 3-4
            mentions of "{conceptName}", introduce a different but related
            concept, then return to "{conceptName}" later. This interleaving
            strengthens learning.
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// INTERLEAVING PATTERN VISUALIZATION
// ============================================================================

export const InterleavingPattern: React.FC<{ analysis: ChapterAnalysis }> = ({
  analysis,
}) => {
  const pattern = analysis.visualizations.interleavingPattern;
  const sequence = pattern.conceptSequence.slice(0, 50); // Show more for better insight

  // Build ID -> Name map from conceptMap nodes
  const idToName: Record<string, string> = {};
  const nodes = analysis.visualizations.conceptMap.nodes as any[];
  nodes.forEach((n) => (idToName[n.id] = n.label));

  // Calculate transition matrix (which concepts follow which)
  const transitions: Record<string, Record<string, number>> = {};
  for (let i = 1; i < pattern.conceptSequence.length; i++) {
    const from = pattern.conceptSequence[i - 1];
    const to = pattern.conceptSequence[i];
    if (!transitions[from]) transitions[from] = {};
    transitions[from][to] = (transitions[from][to] || 0) + 1;
  }

  // Find top transitions
  const topTransitions: { from: string; to: string; count: number }[] = [];
  Object.keys(transitions).forEach((from) => {
    Object.keys(transitions[from]).forEach((to) => {
      if (from !== to) {
        // Only count switches
        topTransitions.push({ from, to, count: transitions[from][to] });
      }
    });
  });
  topTransitions.sort((a, b) => b.count - a.count);
  const top5Transitions = topTransitions.slice(0, 5);

  // Identify blocking issues
  const blockingSegments = pattern.blockingSegments || [];
  // Group blocking segments by concept to avoid listing multiple separate runs of same concept without context
  const blockingGroups = Object.values(
    blockingSegments.reduce(
      (
        acc: Record<
          string,
          { conceptId: string; lengths: number[]; sections: string[] }
        >,
        seg: any
      ) => {
        if (!acc[seg.conceptId])
          acc[seg.conceptId] = {
            conceptId: seg.conceptId,
            lengths: [],
            sections: [],
          };
        acc[seg.conceptId].lengths.push(seg.length);
        if (
          seg.sectionHeading &&
          !acc[seg.conceptId].sections.includes(seg.sectionHeading)
        ) {
          acc[seg.conceptId].sections.push(seg.sectionHeading);
        }
        return acc;
      },
      {}
    )
  ).map((g) => ({
    conceptId: g.conceptId,
    longest: Math.max(...g.lengths),
    occurrences: g.lengths.length,
    lengths: g.lengths.sort((a, b) => b - a),
    sections: g.sections,
  }));
  const worstBlocks = blockingGroups
    .sort((a, b) => b.longest - a.longest)
    .slice(0, 3);

  // Generate color map with consistent hashing
  const uniqueConcepts = Array.from(new Set(sequence));
  const colorMap: Record<string, string> = {};
  uniqueConcepts.forEach((conceptId, idx) => {
    const hue = (idx / uniqueConcepts.length) * 360;
    colorMap[conceptId] = `hsl(${hue}, 70%, 60%)`;
  });

  // Interleaving quality score
  const interleavingScore = Math.round((1 - pattern.blockingRatio) * 100);
  const scoreColor =
    interleavingScore >= 70
      ? "var(--success-600)"
      : interleavingScore >= 50
      ? "var(--warn-600)"
      : "var(--danger-600)";

  return (
    <div className="viz-container">
      <h3>Topic Interleaving Analysis</h3>
      <p className="viz-subtitle">
        Measures how well concepts are mixed vs. presented in isolated blocks.
        <br />
        <em style={{ fontSize: "12px", color: "var(--text-subtle)" }}>
          Note: Learning Principle score also considers interleaving density and
          discrimination practice.
        </em>
      </p>

      <div className="interleaving-metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Basic Interleaving</div>
          <div className="metric-value" style={{ color: scoreColor }}>
            {interleavingScore}%
          </div>
          <div className="metric-note">(1 - blocking ratio)</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Topic Switches</div>
          <div className="metric-value">{pattern.topicSwitches}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Block Size</div>
          <div className="metric-value">{pattern.avgBlockSize.toFixed(1)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Blocking Ratio</div>
          <div className="metric-value" style={{ color: scoreColor }}>
            {(pattern.blockingRatio * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="section-divider">
        <h4>Concept Sequence (First 50 mentions)</h4>
        <div className="interleaving-sequence">
          {sequence.map((conceptId, idx) => (
            <div
              key={idx}
              className="interleaving-block"
              style={{
                backgroundColor: colorMap[conceptId],
                width: `${100 / sequence.length}%`,
                height: "40px",
              }}
              title={`${idx + 1}. ${idToName[conceptId] || conceptId}`}
            />
          ))}
        </div>
        <div className="interleaving-legend">
          {uniqueConcepts.slice(0, 8).map((conceptId) => (
            <span key={conceptId} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: colorMap[conceptId] }}
              />
              {(idToName[conceptId] || conceptId).substring(0, 20)}
            </span>
          ))}
          {uniqueConcepts.length > 8 && (
            <span className="legend-item">
              +{uniqueConcepts.length - 8} more
            </span>
          )}
        </div>
      </div>

      {worstBlocks.length > 0 && (
        <div className="blocking-section">
          <h4 className="blocking-section-title">
            ⚠️ Blocking Issues Detected
          </h4>
          <p className="blocking-section-subtitle">
            Click each concept to see details and recommendations
          </p>
          {worstBlocks.map((group, idx) => {
            const name = idToName[group.conceptId] || group.conceptId;
            return (
              <BlockingIssueCard
                key={idx}
                conceptName={name}
                longestRun={group.longest}
                occurrences={group.occurrences}
                lengths={group.lengths}
                sections={group.sections}
              />
            );
          })}
        </div>
      )}

      <div className="recommendation-box">
        <strong>Recommendation:</strong> {pattern.recommendation}
      </div>
      <div className="why-matters-block">
        <strong>Why this matters:</strong> Interleaving (mixing topics) improves
        discrimination and long‑term retention compared to blocked sequences.
      </div>

      {top5Transitions.length > 0 && (
        <div className="transitions-section">
          <h4>Common Concept Transitions</h4>
          <p className="transitions-subtitle">
            Shows how concepts connect in your chapter
          </p>
          <div className="transitions-list">
            {top5Transitions.map((trans, idx) => (
              <div key={idx} className="transition-item">
                <span className="transition-from">
                  {(idToName[trans.from] || trans.from).substring(0, 18)}
                </span>
                <span className="transition-arrow">→</span>
                <span className="transition-to">
                  {(idToName[trans.to] || trans.to).substring(0, 18)}
                </span>
                <span className="transition-count">({trans.count}×)</span>
              </div>
            ))}
          </div>
          <div className="transitions-why-matters">
            <strong>Why this matters:</strong> Understanding your concept flow
            patterns helps identify natural connections students make.
            High-frequency transitions reveal your chapter's conceptual
            narrative—use this to reinforce effective bridges between ideas or
            to spot opportunities for more diverse interleaving.
          </div>
        </div>
      )}

      <style>{`
        .interleaving-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin: 20px 0;
        }
        .metric-card {
          background: var(--bg-panel);
          border: 1px solid var(--border-soft);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }
        .metric-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: var(--text-main);
        }
        .metric-note {
          font-size: 10px;
          color: var(--text-subtle);
          margin-top: 4px;
          font-style: italic;
        }
        .section-divider {
          margin: 24px 0;
          padding-top: 16px;
          border-top: 1px solid var(--border-soft);
        }
        .section-divider h4 {
          font-size: 15px;
          margin-bottom: 12px;
          color: var(--text-main);
        }
        .interleaving-sequence {
          display: flex;
          border-radius: 6px;
          overflow: hidden;
          margin: 12px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .interleaving-block {
          transition: all 0.3s ease;
          border-right: 1px solid rgba(255,255,255,0.3);
          cursor: pointer;
        }
        .interleaving-block:hover {
          filter: brightness(0.85);
          transform: scaleY(1.1);
        }
        .interleaving-legend {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 12px;
          margin-top: 8px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .legend-color {
          width: 14px;
          height: 14px;
          border-radius: 3px;
          display: inline-block;
        }
        .blocking-issues {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .blocking-issue-card {
          background: #fff8f0;
          border-left: 4px solid var(--warn-600);
          padding: 10px 14px;
          border-radius: 4px;
        }
        .blocking-concept {
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 4px;
        }
        .blocking-detail {
          font-size: 13px;
          color: var(--text-muted);
        }
        .blocking-location {
          margin-top: 6px;
          padding: 4px 8px;
          background: rgba(14, 165, 233, 0.1);
          border-radius: 4px;
          font-size: 12px;
          color: var(--brand-accent);
          display: inline-block;
        }
        .blocking-suggestion {
          margin-top: 6px;
          font-style: italic;
          color: var(--text-subtle);
        }
        .transitions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .transition-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background: var(--bg-panel);
          border: 1px solid var(--border-soft);
          border-radius: 4px;
          font-size: 13px;
        }
        .transition-from, .transition-to {
          font-weight: 500;
          color: var(--text-main);
        }
        .transition-arrow {
          color: var(--text-subtle);
          font-weight: bold;
        }
        .transition-count {
          margin-left: auto;
          color: var(--text-muted);
          font-size: 12px;
        }
        .recommendation-box {
          margin-top: 20px;
          padding: 12px 16px;
          background: #f0f9ff;
          border-left: 4px solid var(--brand-accent);
          border-radius: 4px;
          font-size: 14px;
          color: var(--text-main);
        }
        /* Blocking Section Styles */
        .blocking-section {
          margin: 30px 0;
        }
        .blocking-section-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--danger-600);
          margin: 0 0 5px 0;
        }
        .blocking-section-subtitle {
          color: var(--text-muted);
          font-size: 13px;
          margin: 0 0 15px 0;
          font-style: italic;
        }
        .blocking-card {
          border: 1px solid #fecaca;
          border-radius: 8px;
          margin: 10px 0;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fef2f2;
        }
        .blocking-card:hover {
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
          border-color: var(--danger-600);
        }
        .blocking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .blocking-concept-name {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--danger-600);
        }
        .blocking-badge {
          padding: 4px 10px;
          border-radius: 12px;
          background: var(--danger-600);
          color: white;
          font-weight: 600;
          font-size: 12px;
        }
        .blocking-details {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #fecaca;
        }
        .blocking-stats p {
          margin: 8px 0;
          font-size: 14px;
          color: var(--text-main);
        }
        .blocking-location {
          margin-top: 8px;
          padding: 6px 10px;
          background: rgba(14, 165, 233, 0.1);
          border-radius: 4px;
          font-size: 13px;
          color: var(--brand-accent);
          display: inline-block;
        }
        .blocking-why-matters {
          margin-top: 12px;
          padding: 10px;
          background: #fffbeb;
          border-left: 3px solid var(--warn-600);
          border-radius: 4px;
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-main);
        }
        .blocking-suggestion-box {
          margin-top: 12px;
          padding: 10px;
          background: #f0f9ff;
          border-left: 3px solid var(--brand-accent);
          border-radius: 4px;
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-main);
        }
        /* Transitions Section Styles */
        .transitions-section {
          margin: 30px 0;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid var(--border-soft);
        }
        .transitions-section h4 {
          margin: 0 0 5px 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-main);
        }
        .transitions-subtitle {
          color: var(--text-muted);
          font-size: 13px;
          margin: 0 0 15px 0;
          font-style: italic;
        }
        .transitions-why-matters {
          margin-top: 15px;
          padding: 12px;
          background: white;
          border-left: 3px solid var(--brand-navy-600);
          border-radius: 4px;
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// REVIEW SCHEDULE TIMELINE
// ============================================================================

export const ReviewScheduleTimeline: React.FC<{
  analysis: ChapterAnalysis;
}> = ({ analysis }) => {
  const schedule = analysis.visualizations.reviewSchedule;
  const [showAll, setShowAll] = useState(false);
  const sortedConcepts = [...schedule.concepts].sort((a, b) => {
    const devA = a.spacing.length
      ? a.spacing.reduce(
          (s, g) => s + Math.abs(g - schedule.optimalSpacing),
          0
        ) / a.spacing.length
      : 0;
    const devB = b.spacing.length
      ? b.spacing.reduce(
          (s, g) => s + Math.abs(g - schedule.optimalSpacing),
          0
        ) / b.spacing.length
      : 0;
    const priorityA = a.isOptimal ? 0 : 1; // non-optimal first
    const priorityB = b.isOptimal ? 0 : 1;
    return priorityB - priorityA || devB - devA || b.mentions - a.mentions;
  });
  const defaultLimit = 15;
  const concepts = showAll
    ? sortedConcepts
    : sortedConcepts.slice(0, defaultLimit);

  // Build ID -> Name map from conceptMap nodes
  const idToName: Record<string, string> = {};
  const nodes = analysis.visualizations.conceptMap.nodes as any[];
  nodes.forEach((n) => (idToName[n.id] = n.label));

  // Find max gap for scaling (use reasonable default if data is skewed)
  const maxGap = Math.max(
    ...concepts.flatMap((c) => c.spacing),
    schedule.optimalSpacing * 2,
    100
  );

  return (
    <div className="viz-container">
      <h3>Concept Review Schedule</h3>
      <p className="viz-subtitle">
        Optimal spacing helps retention through spaced repetition
      </p>
      <div className="review-metrics">
        <div>
          <strong>Optimal Spacing (median):</strong> {schedule.optimalSpacing}{" "}
          words
        </div>
        <div>
          <strong>Current Avg Spacing:</strong> {schedule.currentAvgSpacing}{" "}
          words
        </div>
        <div>
          <strong>Concepts Analyzed:</strong> {schedule.concepts.length}
        </div>
      </div>
      <div className="review-legend">
        <span className="legend-item">
          <span className="legend-color optimal" /> Optimal spacing pattern
        </span>
        <span className="legend-item">
          <span className="legend-color needs-adjustment" /> Needs adjustment
        </span>
      </div>

      <div className="review-timeline">
        {concepts.map((concept) => {
          const conceptName = idToName[concept.conceptId] || concept.conceptId;
          return (
            <div key={concept.conceptId} className="concept-timeline">
              <div className="concept-label" title={conceptName}>
                {conceptName.length > 20
                  ? conceptName.substring(0, 18) + "..."
                  : conceptName}
              </div>
              <div className="mention-bars">
                {concept.spacing.map((gap, idx) => (
                  <div
                    key={idx}
                    className={`gap-bar ${
                      concept.isOptimal ? "optimal" : "needs-adjustment"
                    }`}
                    style={{
                      width: `${Math.min((gap / maxGap) * 100, 100)}%`,
                    }}
                    title={`Gap ${idx + 1}: ${gap} words between mentions`}
                  />
                ))}
              </div>
              <div
                className="mention-count"
                title={`Total mentions of ${conceptName}`}
              >
                {concept.mentions} mentions
              </div>
            </div>
          );
        })}
      </div>

      {!showAll && sortedConcepts.length > defaultLimit && (
        <div className="show-more-container">
          <button className="show-more-btn" onClick={() => setShowAll(true)}>
            Show all {sortedConcepts.length} concepts
          </button>
        </div>
      )}
      <div className="why-matters-block">
        <strong>Why this matters:</strong> Spaced revisits interrupt forgetting
        and strengthen consolidation; uneven or absent reviews waste prior
        exposure.
      </div>
      <div className="recommendation-block">
        <strong>Recommendation:</strong>{" "}
        {(() => {
          const optimalCount = sortedConcepts.filter((c) => c.isOptimal).length;
          const ratio =
            sortedConcepts.length > 0
              ? optimalCount / sortedConcepts.length
              : 0;
          const spacingDiff =
            schedule.currentAvgSpacing - schedule.optimalSpacing;
          return ratio >= 0.7
            ? "Excellent spacing—most concepts follow optimal spaced repetition patterns."
            : spacingDiff > 50
            ? "Gaps too wide—increase concept revisits to maintain activation and prevent forgetting."
            : spacingDiff < -30
            ? "Concepts revisited too frequently—space them out more to leverage forgetting for stronger encoding."
            : "Moderate spacing issues—focus on red-marked concepts and aim for 3-5 strategically spaced revisits.";
        })()}
      </div>

      <style>{`
        .review-timeline {
          margin: 20px 0;
        }
        .review-metrics {
          display: flex;
          gap: 20px;
          font-size: 13px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        .review-legend {
          display: flex;
          gap: 20px;
          margin-top: 10px;
          font-size: 12px;
          flex-wrap: wrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          display: inline-block;
        }
        .legend-color.optimal {
          background: var(--success-600);
        }
        .legend-color.needs-adjustment {
          background: var(--warn-600);
        }
        .concept-timeline {
          display: grid;
          grid-template-columns: 150px 1fr 80px;
          align-items: center;
          margin: 10px 0;
          gap: 15px;
        }
        .concept-label {
          font-weight: bold;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mention-bars {
          flex: 1;
          display: flex;
          gap: 2px;
        }
        .gap-bar {
          height: 20px;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .gap-bar.optimal {
          background: var(--success-600);
        }
        .gap-bar.needs-adjustment {
          background: var(--warn-600);
        }
        .gap-bar:hover {
          filter: brightness(0.8);
        }
        .mention-count {
          text-align: right;
          font-size: 12px;
          color: var(--text-main);
          white-space: nowrap;
        }
        .show-more-container { margin-top: 10px; }
        .show-more-btn {
          background: var(--accent-600);
          color: #fff;
          border: none;
          padding: 8px 14px;
          font-size: 13px;
          border-radius: 4px;
          cursor: pointer;
        }
        .show-more-btn:hover { filter: brightness(0.9); }
      `}</style>
    </div>
  );
};

// ============================================================================
// PRINCIPLE FINDINGS COMPONENT
// ============================================================================

export const PrincipleFindings: React.FC<{
  principle: PrincipleEvaluation;
}> = ({ principle }) => {
  const [expanded, setExpanded] = useState(false);

  const scoreColor =
    principle.score >= 80
      ? "var(--success-600)"
      : principle.score >= 60
      ? "#f59e0b" /* amber-500 */
      : principle.score >= 40
      ? "var(--warn-600)"
      : "var(--danger-600)";

  const principleInfo = PRINCIPLE_DEFINITIONS[principle.principle];

  return (
    <div className="principle-card" onClick={() => setExpanded(!expanded)}>
      <div className="principle-header">
        <h4>{principle.principle.replace(/([A-Z])/g, " $1").trim()}</h4>
        <div className="score-badge" style={{ backgroundColor: scoreColor }}>
          {principle.score.toFixed(0)}
        </div>
      </div>

      {expanded && (
        <div className="principle-details">
          {principleInfo && (
            <div className="principle-definition">
              <h5>What this means:</h5>
              <p className="definition-text">{principleInfo.definition}</p>
              <p className="example-text">
                <strong>Example:</strong> {principleInfo.example}
              </p>
            </div>
          )}

          <div className="findings">
            <h5>Findings:</h5>
            {principle.findings.map((finding, idx) => (
              <p key={idx} className={`finding finding-${finding.type}`}>
                {finding.message}
              </p>
            ))}
          </div>

          <div className="suggestions">
            <h5>Suggestions:</h5>
            {principle.suggestions.length > 0 ? (
              principle.suggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion">
                  <p>
                    <strong>{suggestion.title}</strong> ({suggestion.priority})
                  </p>
                  <p className="suggestion-desc">{suggestion.description}</p>
                </div>
              ))
            ) : (
              <p className="no-suggestions">None</p>
            )}
          </div>

          <div className="evidence">
            <h5>Evidence:</h5>
            {principle.evidence.map((e, idx) => (
              <p key={idx} className="evidence-item">
                {e.metric}:{" "}
                {typeof e.value === "number"
                  ? e.value < 1 && e.value > 0
                    ? e.value.toFixed(2)
                    : e.value < 10
                    ? e.value.toFixed(1)
                    : Math.trunc(e.value)
                  : e.value}{" "}
                {e.threshold !== undefined && typeof e.threshold === "number"
                  ? `(target: ${
                      e.threshold < 1
                        ? e.threshold.toFixed(2)
                        : Math.trunc(e.threshold)
                    })`
                  : e.threshold
                  ? `(target: ${e.threshold})`
                  : ""}
              </p>
            ))}
          </div>
          <div className="why-matters-block">
            <strong>Why this matters:</strong> Principle-aligned edits shift
            material from exposure to learning experience—targeting low scores
            yields disproportionate gains.
          </div>
          <div className="recommendation-block">
            <strong>Recommendation:</strong>{" "}
            {(() => {
              const displayName =
                PRINCIPLE_NAME_MAP[principle.principle] || principle.principle;
              if (principle.score >= 80)
                return `Strong ${displayName} implementation—maintain this approach.`;
              if (principle.score >= 60)
                return `Good ${displayName} foundation—review suggestions to strengthen further.`;
              return `${displayName} needs attention—prioritize the highest-priority suggestions above.`;
            })()}
          </div>
        </div>
      )}

      <style>{`
        .principle-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          margin: 10px 0;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .principle-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .principle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .principle-header h4 {
          margin: 0;
          flex: 1;
        }
        .score-badge {
          padding: 5px 10px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }
        .principle-details {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #f0f0f0;
        }
        .principle-details h5 {
          margin: 10px 0 5px 0;
          color: var(--text-main);
        }
        .finding {
          padding: 5px 0;
          margin: 5px 0;
          font-size: 14px;
        }
        .finding-positive {
          color: var(--success-600);
        }
        .finding-warning {
          color: var(--warn-600);
        }
        .finding-critical {
          color: var(--danger-600);
        }
        .suggestion {
          padding: 8px;
          margin: 8px 0;
          background: #f1f5f9; /* slate-100 */
          border-left: 3px solid var(--brand-accent);
          border-radius: 4px;
        }
        .suggestion p {
          margin: 5px 0;
          font-size: 13px;
        }
        .suggestion-desc {
          color: var(--text-muted);
        }
        .evidence-item {
          font-size: 12px;
          color: var(--text-main);
          margin: 3px 0;
          font-family: monospace;
        }
        .no-suggestions {
          color: var(--success-600);
          font-weight: 600;
          font-size: 14px;
          margin: 5px 0;
        }
        .principle-definition {
          background: #f8fafc;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
          border-left: 3px solid var(--brand-navy-600);
        }
        .definition-text {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-main);
          margin: 5px 0;
        }
        .example-text {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-muted);
          margin: 8px 0 0 0;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export const ChapterAnalysisDashboard: React.FC<{
  analysis: ChapterAnalysis;
  concepts: Concept[];
  onConceptClick: (concept: Concept, mentionIndex: number) => void;
  highlightedConceptId?: string | null;
  currentMentionIndex?: number;
}> = ({
  analysis,
  concepts,
  onConceptClick,
  highlightedConceptId,
  currentMentionIndex = 0,
}) => {
  // Defensive guards in case analysis shape changes or fields are missing
  const safeAnalysis = analysis || ({} as ChapterAnalysis);
  const overallScore = safeAnalysis.overallScore ?? 0;
  const conceptAnalysis = safeAnalysis.conceptAnalysis || {
    totalConceptsIdentified: 0,
    coreConceptCount: 0,
    conceptDensity: 0,
    hierarchyBalance: 0,
  };

  const recommendations = safeAnalysis.recommendations || [];
  const principles = safeAnalysis.principles || [];
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Chapter Analysis Report</h2>
        <div className="overall-score-display">
          <div className="score-circle">
            <span className="score-number">{overallScore.toFixed(1)}</span>
            <span className="score-label">/100</span>
          </div>
        </div>
      </div>

      <ChapterOverviewTimeline analysis={safeAnalysis} />

      <div className="viz-grid">
        <PrincipleScoresRadar analysis={safeAnalysis} />
        <CognitiveLoadCurve analysis={safeAnalysis} />
        <ConceptMentionFrequency analysis={safeAnalysis} />
        <InterleavingPattern analysis={safeAnalysis} />
      </div>

      <div className="principles-section">
        <h3>Learning Principles Evaluation</h3>
        <p className="section-subtitle">
          Click each principle to expand findings and actionable suggestions
        </p>
        {principles.map((principle: any) => (
          <PrincipleFindings key={principle.principle} principle={principle} />
        ))}
      </div>

      <div className="recommendations-section">
        <h3>📋 Recommendations ({recommendations.length})</h3>
        <p className="section-subtitle">
          Prioritized suggestions to enhance learning effectiveness
        </p>
        {recommendations.slice(0, 10).map((rec) => (
          <div key={rec.id} className={`recommendation rec-${rec.priority}`}>
            <h4>{rec.title}</h4>
            <p>{rec.description}</p>
            <div className="rec-meta">
              <span className="rec-priority">{rec.priority}</span>
              <span className="rec-effort">{rec.estimatedEffort}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="concepts-section">
        <h3>📚 Concept Overview</h3>
        <p className="section-subtitle">
          Summary metrics for identified concepts
        </p>
        <div className="concept-stats">
          <div className="stat">
            <strong>{conceptAnalysis.totalConceptsIdentified}</strong>
            <p>Total Concepts</p>
          </div>
          <div className="stat">
            <strong>{conceptAnalysis.coreConceptCount}</strong>
            <p>Core Concepts</p>
            <p className="stat-note">Repeated 3+ times</p>
          </div>
          <div className="stat">
            <strong>{conceptAnalysis.conceptDensity.toFixed(1)}</strong>
            <p>Concepts per 1K words</p>
            <p className="stat-note">Target: 2-4</p>
          </div>
          <div className="stat">
            <strong>
              {(conceptAnalysis.hierarchyBalance * 100).toFixed(0)}%
            </strong>
            <p>Hierarchy Balance</p>
            <p className="stat-note">Target: 60-80%</p>
            <p className="stat-description">
              Ratio of core to supporting concepts
            </p>
          </div>
        </div>
      </div>

      {/* Concept List with click-to-highlight */}
      {(() => {
        console.log("[ChapterAnalysisDashboard] Concepts check:", {
          conceptsExists: !!concepts,
          conceptsLength: concepts?.length || 0,
          willRender: !!(concepts && concepts.length > 0),
        });
        return (
          concepts &&
          concepts.length > 0 && (
            <ConceptList
              concepts={concepts}
              onConceptClick={onConceptClick}
              highlightedConceptId={highlightedConceptId}
              currentMentionIndex={currentMentionIndex}
            />
          )
        );
      })()}

      <style>{`
          .dashboard {
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              sans-serif;
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
          }
          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          .overall-score-display {
            display: flex;
            justify-content: center;
          }
          .score-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--brand-navy-600), var(--brand-navy-700));
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(2,6,23,0.25);
          }
          .score-number {
            font-size: 36px;
          }
          .score-label {
            font-size: 12px;
          }
          .viz-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(500px, 100%), 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .viz-container {
            border: 1px solid var(--border-soft);
            border-radius: 8px;
            padding: 20px;
            background: var(--bg-panel);
            max-width: 100%;
            overflow-x: auto;
          }
          .viz-container h3 {
            margin-top: 0;
          }
          .viz-subtitle {
            color: var(--text-muted);
            font-size: 13px;
            margin: 5px 0 15px 0;
          }
          .section-subtitle {
            color: var(--text-muted);
            font-size: 14px;
            margin: -5px 0 15px 0;
            font-style: italic;
          }
          .principles-section {
            margin: 30px 0;
          }
          .principles-section h3 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 24px;
            font-weight: 600;
            color: var(--text-main);
            margin: 0 0 10px 0;
          }
          .recommendations-section h3,
          .concepts-section h3 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 24px;
            font-weight: 600;
            color: var(--text-main);
            margin: 0 0 10px 0;
          }
          .concept-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          .stat {
            padding: 15px;
            background: #f1f5f9; /* slate-100 */
            border-radius: 8px;
            text-align: center;
            border: 1px solid var(--border-soft);
          }
          .stat strong {
            font-size: 24px;
            color: var(--brand-navy-700);
            display: block;
            font-weight: 600;
          }
          .stat p {
            margin: 5px 0 0 0;
            color: var(--text-muted);
            font-size: 12px;
          }
          .stat-note {
            margin: 2px 0 0 0 !important;
            color: #64748b !important; /* slate-500 */
            font-size: 11px !important;
            font-style: italic;
          }
          .stat-description {
            margin: 4px 0 0 0 !important;
            color: #94a3b8 !important; /* slate-400 */
            font-size: 10px !important;
            line-height: 1.3;
          }
          .recommendation {
            border-left: 4px solid #ccc;
            padding: 15px;
            margin: 10px 0;
            background: #f9f9f9;
            border-radius: 4px;
          }
          .recommendation.rec-high {
            border-left-color: var(--danger-600);
            background: #fef2f2; /* red-50 */
          }
          .recommendation.rec-medium {
            border-left-color: var(--warn-600);
            background: #fffbeb; /* amber-50 */
          }
          .recommendation.rec-low {
            border-left-color: var(--success-600);
            background: #f0fdf4; /* green-50 */
          }
          .recommendation h4 {
            margin: 0 0 5px 0;
          }
          .recommendation p {
            margin: 5px 0;
            color: var(--text-main);
            font-size: 14px;
          }
          .rec-meta {
            display: flex;
            gap: 10px;
            margin-top: 8px;
          }
          .rec-priority,
          .rec-effort {
            display: inline-block;
            padding: 3px 8px;
            background: white;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
          }
        `}</style>
    </div>
  );
};

export default {
  ChapterOverviewTimeline,
  PrincipleScoresRadar,
  CognitiveLoadCurve,
  ConceptMentionFrequency,
  ConceptMapVisualization,
  InterleavingPattern,
  ReviewScheduleTimeline,
  PrincipleFindings,
  ChapterAnalysisDashboard,
};
