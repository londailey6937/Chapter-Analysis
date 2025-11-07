/**
 * React Visualization Components for Chapter Analysis
 * Uses Recharts for charts and custom SVG for graph visualizations
 */

import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  // ScatterChart, // unused
  // Scatter, // unused
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
  ConceptNode,
  ConceptLink,
  PrincipleEvaluation,
} from "@/types";

// ============================================================================
// PRINCIPLE SCORES RADAR CHART
// ============================================================================

export const PrincipleScoresRadar: React.FC<{ analysis: ChapterAnalysis }> = ({
  analysis,
}) => {
  const data = analysis.visualizations.principleScores.principles.map((p) => ({
    name: p.displayName.substring(0, 8),
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
    </div>
  );
};

// ============================================================================
// COGNITIVE LOAD CURVE
// ============================================================================

export const CognitiveLoadCurve: React.FC<{ analysis: ChapterAnalysis }> = ({
  analysis,
}) => {
  const data = analysis.visualizations.cognitiveLoadCurve.map((point) => ({
    section: point.sectionId,
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
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="section" tick={{ fontSize: 10 }} />
          <YAxis
            label={{ value: "Load %", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
            formatter={(value: any) => `${value}%`}
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
    concept: pattern.conceptId.replace("concept-", "C"),
    mentions: pattern.mentions,
    isOptimal: pattern.isOptimal,
  }));

  return (
    <div className="viz-container">
      <h3>Concept Revisit Frequency</h3>
      <p className="viz-subtitle">
        Green = optimal spacing, Red = needs adjustment
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
          />
          <Bar
            dataKey="mentions"
            fill="#8884d8"
            radius={[8, 8, 0, 0]}
            shape={<BarShape isOptimal />}
          />
        </BarChart>
      </ResponsiveContainer>
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
  const sequence = pattern.conceptSequence.slice(0, 30);

  const colorMap: Record<string, string> = {};
  sequence.forEach((conceptId, idx) => {
    const hue = (idx / sequence.length) * 360;
    colorMap[conceptId] = `hsl(${hue}, 70%, 60%)`;
  });

  return (
    <div className="viz-container">
      <h3>Topic Interleaving Pattern</h3>
      <p className="viz-subtitle">
        Blocking Ratio: {(pattern.blockingRatio * 100).toFixed(0)}% (lower is
        better)
      </p>

      <div className="interleaving-sequence">
        {sequence.map((conceptId, idx) => (
          <div
            key={idx}
            className="interleaving-block"
            style={{
              backgroundColor: colorMap[conceptId],
              width: `${100 / sequence.length}%`,
              height: "30px",
            }}
            title={`Concept ${conceptId}`}
          />
        ))}
      </div>

      <div className="interleaving-stats">
        <p>
          <strong>Topic Switches:</strong> {pattern.topicSwitches}
        </p>
        <p>
          <strong>Avg Block Size:</strong> {pattern.avgBlockSize.toFixed(1)}{" "}
          mentions
        </p>
        <p>
          <strong>Recommendation:</strong> {pattern.recommendation}
        </p>
      </div>

      <style>{`
        .interleaving-sequence {
          display: flex;
          border-radius: 4px;
          overflow: hidden;
          margin: 20px 0;
        }
        .interleaving-block {
          transition: all 0.3s ease;
          border-right: 1px solid rgba(255,255,255,0.5);
        }
        .interleaving-block:hover {
          filter: brightness(0.8);
        }
        .interleaving-stats {
          padding: 15px;
          background: #f5f5f5;
          border-radius: 4px;
          margin-top: 10px;
        }
        .interleaving-stats p {
          margin: 5px 0;
          font-size: 14px;
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
  const concepts = schedule.concepts.slice(0, 10);

  return (
    <div className="viz-container">
      <h3>Concept Review Schedule</h3>
      <p className="viz-subtitle">
        Optimal spacing helps retention through spaced repetition
      </p>

      <div className="review-timeline">
        {concepts.map((concept) => (
          <div key={concept.conceptId} className="concept-timeline">
            <div className="concept-label">
              {concept.conceptId.replace("concept-", "C")}
            </div>
            <div className="mention-bars">
              {concept.spacing.map((gap, idx) => (
                <div
                  key={idx}
                  className={`gap-bar ${
                    concept.isOptimal ? "optimal" : "needs-adjustment"
                  }`}
                  style={{
                    width: `${Math.min((gap / 10000) * 100, 100)}%`,
                  }}
                  title={`Gap: ${gap} characters`}
                />
              ))}
            </div>
            <div className="mention-count">{concept.mentions} mentions</div>
          </div>
        ))}
      </div>

      <style>{`
        .review-timeline {
          margin: 20px 0;
        }
        .concept-timeline {
          display: flex;
          align-items: center;
          margin: 10px 0;
          gap: 10px;
        }
        .concept-label {
          font-weight: bold;
          width: 40px;
          text-align: center;
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
          background: #4caf50;
        }
        .gap-bar.needs-adjustment {
          background: #ff9800;
        }
        .gap-bar:hover {
          filter: brightness(0.8);
        }
        .mention-count {
          width: 50px;
          text-align: right;
          font-size: 12px;
          color: #666;
        }
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
      ? "#4caf50"
      : principle.score >= 60
      ? "#ffc107"
      : principle.score >= 40
      ? "#ff9800"
      : "#f44336";

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
            {principle.suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion">
                <p>
                  <strong>{suggestion.title}</strong> ({suggestion.priority})
                </p>
                <p className="suggestion-desc">{suggestion.description}</p>
              </div>
            ))}
          </div>

          <div className="evidence">
            <h5>Evidence:</h5>
            {principle.evidence.map((e, idx) => (
              <p key={idx} className="evidence-item">
                {e.metric}: {e.value}{" "}
                {e.threshold && `(target: ${e.threshold})`}
              </p>
            ))}
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
          color: #333;
        }
        .finding {
          padding: 5px 0;
          margin: 5px 0;
          font-size: 14px;
        }
        .finding-positive {
          color: #4caf50;
        }
        .finding-warning {
          color: #ff9800;
        }
        .finding-critical {
          color: #f44336;
        }
        .suggestion {
          padding: 8px;
          margin: 8px 0;
          background: #f9f9f9;
          border-left: 3px solid #2196f3;
          border-radius: 4px;
        }
        .suggestion p {
          margin: 5px 0;
          font-size: 13px;
        }
        .suggestion-desc {
          color: #666;
        }
        .evidence-item {
          font-size: 12px;
          color: #666;
          margin: 3px 0;
          font-family: monospace;
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
}> = ({ analysis }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Chapter Analysis Report</h2>
        <div className="overall-score-display">
          <div className="score-circle">
            <span className="score-number">
              {analysis.overallScore.toFixed(1)}
            </span>
            <span className="score-label">/100</span>
          </div>
        </div>
      </div>

      <div className="viz-grid">
        <PrincipleScoresRadar analysis={analysis} />
        <CognitiveLoadCurve analysis={analysis} />
        <ConceptMentionFrequency analysis={analysis} />
        <InterleavingPattern analysis={analysis} />
        <ReviewScheduleTimeline analysis={analysis} />
      </div>

      <div className="concepts-section">
        <h3>Concept Analysis</h3>
        <div className="concept-stats">
          <div className="stat">
            <strong>{analysis.conceptAnalysis.totalConceptsIdentified}</strong>
            <p>Total Concepts</p>
          </div>
          <div className="stat">
            <strong>{analysis.conceptAnalysis.coreConceptCount}</strong>
            <p>Core Concepts</p>
          </div>
          <div className="stat">
            <strong>
              {analysis.conceptAnalysis.conceptDensity.toFixed(1)}
            </strong>
            <p>Concepts per 1K words</p>
          </div>
          <div className="stat">
            <strong>
              {(analysis.conceptAnalysis.hierarchyBalance * 100).toFixed(0)}%
            </strong>
            <p>Hierarchy Balance</p>
          </div>
        </div>
      </div>

      <div className="principles-section">
        <h3>Learning Principles Evaluation</h3>
        {analysis.principles.map((principle) => (
          <PrincipleFindings key={principle.principle} principle={principle} />
        ))}
      </div>

      <div className="recommendations-section">
        <h3>Recommendations ({analysis.recommendations.length})</h3>
        {analysis.recommendations.slice(0, 10).map((rec) => (
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

      <style>{`
          .dashboard {
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              sans-serif;
            max-width: 1400px;
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
          }
          .score-number {
            font-size: 36px;
          }
          .score-label {
            font-size: 12px;
          }
          .viz-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .viz-container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            background: white;
          }
          .viz-container h3 {
            margin-top: 0;
          }
          .viz-subtitle {
            color: #666;
            font-size: 13px;
            margin: 5px 0 15px 0;
          }
          .concept-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          .stat {
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
            text-align: center;
          }
          .stat strong {
            font-size: 24px;
            color: #2196f3;
            display: block;
          }
          .stat p {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 12px;
          }
          .recommendation {
            border-left: 4px solid #ccc;
            padding: 15px;
            margin: 10px 0;
            background: #f9f9f9;
            border-radius: 4px;
          }
          .recommendation.rec-high {
            border-left-color: #f44336;
            background: #ffebee;
          }
          .recommendation.rec-medium {
            border-left-color: #ff9800;
            background: #fff3e0;
          }
          .recommendation.rec-low {
            border-left-color: #4caf50;
            background: #f1f8e9;
          }
          .recommendation h4 {
            margin: 0 0 5px 0;
          }
          .recommendation p {
            margin: 5px 0;
            color: #666;
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
  PrincipleScoresRadar,
  CognitiveLoadCurve,
  ConceptMentionFrequency,
  ConceptMapVisualization,
  InterleavingPattern,
  ReviewScheduleTimeline,
  PrincipleFindings,
  ChapterAnalysisDashboard,
};
