import { useState } from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * HelpModal Component - In-app documentation for analysis results
 *
 * Displays comprehensive guide to interpreting analysis results,
 * learning principles, scores, and recommendations.
 */
export function HelpModal({
  isOpen,
  onClose,
}: HelpModalProps): JSX.Element | null {
  const [activeSection, setActiveSection] = useState<string>("overview");

  if (!isOpen) return null;

  const sections = {
    overview: "Overview",
    overallScore: "Overall Score",
    concepts: "Concept Analysis",
    relationships: "Concept Relationships",
    patterns: "Pattern Recognition",
    principles: "Learning Principles",
    recommendations: "Recommendations",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <img
              src="/TomeIQ.png"
              alt="TomeIQ Logo"
              style={{ height: "32px", width: "auto" }}
            />
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              TomeIQ Analysis Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
            }
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar Navigation */}
          <div
            style={{
              width: "200px",
              borderRight: "1px solid #e5e7eb",
              padding: "1rem",
              overflowY: "auto",
              background: "#f9fafb",
            }}
          >
            {Object.entries(sections).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem",
                  marginBottom: "0.5rem",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: activeSection === key ? "600" : "normal",
                  backgroundColor:
                    activeSection === key ? "#667eea" : "transparent",
                  color: activeSection === key ? "white" : "#374151",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== key) {
                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== key) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              padding: "2rem",
              overflowY: "auto",
            }}
          >
            {activeSection === "overview" && <OverviewSection />}
            {activeSection === "overallScore" && <OverallScoreSection />}
            {activeSection === "concepts" && <ConceptsSection />}
            {activeSection === "relationships" && <RelationshipsSection />}
            {activeSection === "patterns" && <PatternsSection />}
            {activeSection === "principles" && <PrinciplesSection />}
            {activeSection === "recommendations" && <RecommendationsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Components

function OverviewSection() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>📖 Overview</h3>
      <p>
        This guide explains every section of the analysis results, what the
        metrics mean, and how to interpret the findings for improving
        educational materials.
      </p>

      <h4>What Gets Analyzed</h4>
      <ul>
        <li>
          <strong>Content Quality:</strong> 10 evidence-based learning
          principles
        </li>
        <li>
          <strong>Concepts:</strong> Key ideas identified and their
          relationships
        </li>
        <li>
          <strong>Patterns:</strong> Universal and domain-specific learning
          patterns
        </li>
        <li>
          <strong>Structure:</strong> How content is organized and connected
        </li>
      </ul>

      <h4>How to Use This Guide</h4>
      <p>Navigate through sections using the sidebar to learn about:</p>
      <ul>
        <li>What each score means</li>
        <li>How metrics are calculated</li>
        <li>Common findings and what they indicate</li>
        <li>Actionable recommendations for improvement</li>
      </ul>
    </div>
  );
}

function OverallScoreSection() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>🎯 Overall Score</h3>

      <h4>What It Shows</h4>
      <p>
        The Overall Score displays a weighted average of all 10 learning
        principle scores, providing a single quality metric for the chapter.
      </p>

      <h4>Score Interpretation</h4>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "1rem",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              Score Range
            </th>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              Quality Level
            </th>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              Interpretation
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              90-100
            </td>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              <strong>Excellent</strong>
            </td>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              Exemplifies evidence-based learning design
            </td>
          </tr>
          <tr>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              80-89
            </td>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              <strong>Good</strong>
            </td>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              Strong foundation, minor improvements possible
            </td>
          </tr>
          <tr>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              70-79
            </td>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              <strong>Adequate</strong>
            </td>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              Meets basic standards but has clear gaps
            </td>
          </tr>
          <tr>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              60-69
            </td>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              <strong>Needs Improvement</strong>
            </td>
            <td
              style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}
            >
              Missing multiple key principles
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.75rem" }}>Below 60</td>
            <td style={{ padding: "0.75rem" }}>
              <strong>Critical</strong>
            </td>
            <td style={{ padding: "0.75rem" }}>
              Significant pedagogical redesign needed
            </td>
          </tr>
        </tbody>
      </table>

      <h4>How It's Calculated</h4>
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "1rem",
          borderRadius: "6px",
          marginBottom: "1rem",
        }}
      >
        <code>Overall Score = Σ(Principle Score × Weight) / Σ(Weights)</code>
      </div>

      <h4>Principle Weights</h4>
      <ul>
        <li>
          <strong>Deep Processing:</strong> 0.95 (highest - fundamental to
          learning)
        </li>
        <li>
          <strong>Retrieval Practice:</strong> 0.90 (critical for retention)
        </li>
        <li>
          <strong>Schema Building:</strong> 0.90 (essential for organized
          knowledge)
        </li>
        <li>
          <strong>Dual Coding:</strong> 0.85 (important for comprehension)
        </li>
        <li>
          <strong>Generative Learning:</strong> 0.85 (promotes engagement)
        </li>
        <li>
          <strong>Spaced Repetition:</strong> 0.80 (time-dependent)
        </li>
        <li>
          <strong>Interleaving:</strong> 0.75 (context-specific)
        </li>
        <li>
          <strong>Worked Examples:</strong> 0.70 (procedural domains)
        </li>
        <li>
          <strong>Self-Explanation:</strong> 0.65 (metacognitive skill)
        </li>
        <li>
          <strong>Elaboration:</strong> 0.60 (supports other principles)
        </li>
      </ul>
    </div>
  );
}

function ConceptsSection() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>💡 Concept Analysis</h3>

      <h4>What It Shows</h4>
      <p>
        Identifies and categorizes the key concepts (ideas, terms, theories)
        present in the chapter. Concepts are color-coded by importance level.
      </p>

      <h4>Importance Levels</h4>
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            padding: "0.5rem",
            marginBottom: "0.5rem",
            backgroundColor: "#fef3c7",
            borderLeft: "4px solid #f59e0b",
            borderRadius: "4px",
          }}
        >
          <strong>🔥 High:</strong> Core concepts essential to understanding the
          chapter
        </div>
        <div
          style={{
            padding: "0.5rem",
            marginBottom: "0.5rem",
            backgroundColor: "#dbeafe",
            borderLeft: "4px solid #3b82f6",
            borderRadius: "4px",
          }}
        >
          <strong>⭐ Medium:</strong> Supporting concepts that enhance
          understanding
        </div>
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "#f3f4f6",
            borderLeft: "4px solid #6b7280",
            borderRadius: "4px",
          }}
        >
          <strong>ℹ️ Low:</strong> Supplementary concepts or terminology
        </div>
      </div>

      <h4>How Importance Is Determined</h4>
      <ul>
        <li>
          <strong>Frequency:</strong> How often the concept appears
        </li>
        <li>
          <strong>Context:</strong> Where it appears (headings, definitions,
          examples)
        </li>
        <li>
          <strong>Relationships:</strong> How many other concepts it connects to
        </li>
        <li>
          <strong>Patterns:</strong> Involvement in learning patterns
        </li>
      </ul>

      <h4>Domain-Specific Concepts</h4>
      <p>
        For specialized domains like chemistry, concepts may include additional
        metadata:
      </p>
      <ul>
        <li>Reaction types (synthesis, decomposition, etc.)</li>
        <li>Physical states (solid, liquid, gas)</li>
        <li>Compound classifications (acid, base, salt)</li>
        <li>Difficulty ratings</li>
      </ul>
    </div>
  );
}

function RelationshipsSection() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>🔗 Concept Relationships</h3>

      <h4>What It Shows</h4>
      <p>
        Maps how concepts connect to each other, revealing the knowledge
        structure of the chapter.
      </p>

      <h4>Relationship Types</h4>

      <div style={{ marginBottom: "1.5rem" }}>
        <h5 style={{ color: "#2563eb" }}>🔵 Prerequisites (requires)</h5>
        <p>
          <strong>Meaning:</strong> Concept A must be understood before Concept
          B
        </p>
        <p>
          <strong>Example:</strong> "atomic structure" → "chemical bonding"
        </p>
        <p>
          <strong>Why It Matters:</strong> Shows logical learning sequence
        </p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h5 style={{ color: "#059669" }}>🟢 Related (relates-to)</h5>
        <p>
          <strong>Meaning:</strong> Concepts share common features or appear
          together
        </p>
        <p>
          <strong>Example:</strong> "acids" ↔ "bases" (opposite but related)
        </p>
        <p>
          <strong>Why It Matters:</strong> Identifies conceptual clusters
        </p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h5 style={{ color: "#7c3aed" }}>🟣 Examples (example-of)</h5>
        <p>
          <strong>Meaning:</strong> Concrete instance of an abstract concept
        </p>
        <p>
          <strong>Example:</strong> "HCl" → example of → "acid"
        </p>
        <p>
          <strong>Why It Matters:</strong> Shows concrete-to-abstract
          connections
        </p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h5 style={{ color: "#dc2626" }}>🔴 Contrasts (contrasts-with)</h5>
        <p>
          <strong>Meaning:</strong> Concepts are compared or contrasted
        </p>
        <p>
          <strong>Example:</strong> "ionic bonds" vs "covalent bonds"
        </p>
        <p>
          <strong>Why It Matters:</strong> Highlights distinctions and
          comparisons
        </p>
      </div>

      <h4>What Strong Relationships Indicate</h4>
      <ul>
        <li>✅ Well-integrated content with clear connections</li>
        <li>✅ Logical concept progression</li>
        <li>✅ Rich conceptual networks for schema building</li>
      </ul>

      <h4>What Weak Relationships Indicate</h4>
      <ul>
        <li>⚠️ Isolated concepts that may confuse learners</li>
        <li>⚠️ Missing prerequisite explanations</li>
        <li>⚠️ Opportunities to add examples or contrasts</li>
      </ul>
    </div>
  );
}

function PatternsSection() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>🔍 Pattern Recognition</h3>

      <h4>What It Shows</h4>
      <p>
        Detects specific pedagogical patterns that enhance learning
        effectiveness. Patterns are divided into universal (all domains) and
        domain-specific.
      </p>

      <h4>Universal Patterns</h4>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#f0f9ff",
          borderRadius: "6px",
        }}
      >
        <strong>📝 Definition-Example Pattern</strong>
        <p style={{ marginBottom: 0, marginTop: "0.5rem" }}>
          Concept defined, then illustrated with examples
        </p>
      </div>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#f0fdf4",
          borderRadius: "6px",
        }}
      >
        <strong>🔄 Compare-Contrast Pattern</strong>
        <p style={{ marginBottom: 0, marginTop: "0.5rem" }}>
          Two+ concepts explicitly compared
        </p>
      </div>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#fef3c7",
          borderRadius: "6px",
        }}
      >
        <strong>📊 Problem-Solution Pattern</strong>
        <p style={{ marginBottom: 0, marginTop: "0.5rem" }}>
          Problem posed, solution demonstrated
        </p>
      </div>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#fce7f3",
          borderRadius: "6px",
        }}
      >
        <strong>📚 Elaboration Pattern</strong>
        <p style={{ marginBottom: 0, marginTop: "0.5rem" }}>
          Concept explained in increasing detail
        </p>
      </div>

      <h4>Chemistry-Specific Patterns</h4>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#ede9fe",
          borderRadius: "6px",
        }}
      >
        <strong>⚗️ Reaction Mechanism</strong>
        <p style={{ marginBottom: 0, marginTop: "0.5rem" }}>
          Step-by-step chemical reactions with equations
        </p>
      </div>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#dbeafe",
          borderRadius: "6px",
        }}
      >
        <strong>🔬 Lab Procedure</strong>
        <p style={{ marginBottom: 0, marginTop: "0.5rem" }}>
          Experimental methods with safety and materials
        </p>
      </div>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#fed7aa",
          borderRadius: "6px",
        }}
      >
        <strong>🧮 Stoichiometry Problem</strong>
        <p style={{ marginBottom: 0, marginTop: "0.5rem" }}>
          Quantitative calculations with units
        </p>
      </div>

      <h4>Why Patterns Matter</h4>
      <ul>
        <li>Provide structure and predictability</li>
        <li>Support schema development</li>
        <li>Make content easier to process and remember</li>
        <li>Signal important pedagogical moves</li>
      </ul>
    </div>
  );
}

function PrinciplesSection() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>🎓 Learning Principles</h3>

      <p>
        The analysis evaluates 10 evidence-based learning principles from
        cognitive science research. Each principle is scored 0-100 based on
        presence and quality in the content.
      </p>

      <h4>The 10 Principles</h4>

      {principlesData.map((principle, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "2rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h5 style={{ color: "#667eea", marginBottom: "0.5rem" }}>
            {principle.name}
          </h5>
          <p style={{ fontStyle: "italic", color: "#6b7280" }}>
            {principle.definition}
          </p>

          <p>
            <strong>Why It Matters:</strong> {principle.why}
          </p>

          <p>
            <strong>What's Evaluated:</strong>
          </p>
          <ul>
            {principle.evaluated.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <p>
            <strong>Score Ranges:</strong>
          </p>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            <li>
              🟢 <strong>80-100:</strong> {principle.ranges.high}
            </li>
            <li>
              🟡 <strong>50-79:</strong> {principle.ranges.medium}
            </li>
            <li>
              🔴 <strong>0-49:</strong> {principle.ranges.low}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

function RecommendationsSection() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>💡 Recommendations</h3>

      <h4>What They Are</h4>
      <p>
        Based on the analysis results, the system generates specific, actionable
        suggestions for improving the chapter's learning effectiveness.
      </p>

      <h4>Recommendation Priorities</h4>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#fee2e2",
          borderLeft: "4px solid #dc2626",
          borderRadius: "4px",
        }}
      >
        <strong>🔴 High Priority:</strong> Critical improvements - principles
        scoring below 50
      </div>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#fef3c7",
          borderLeft: "4px solid #f59e0b",
          borderRadius: "4px",
        }}
      >
        <strong>🟡 Medium Priority:</strong> Meaningful enhancements -
        principles scoring 50-79
      </div>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#dbeafe",
          borderLeft: "4px solid #3b82f6",
          borderRadius: "4px",
        }}
      >
        <strong>🔵 Low Priority:</strong> Fine-tuning - principles scoring 80-89
      </div>

      <h4>Types of Recommendations</h4>

      <div style={{ marginBottom: "1.5rem" }}>
        <h5>📝 Content Additions</h5>
        <p>Suggests specific elements to add:</p>
        <ul>
          <li>Practice questions for retrieval</li>
          <li>Visual diagrams for dual coding</li>
          <li>Worked examples for problem-solving</li>
          <li>Review sections for spaced repetition</li>
        </ul>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h5>🔄 Structural Changes</h5>
        <p>Recommends reorganization:</p>
        <ul>
          <li>Interleaving related concepts</li>
          <li>Adding prerequisite explanations</li>
          <li>Breaking down complex ideas</li>
          <li>Creating concept maps</li>
        </ul>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <h5>🎯 Pedagogical Techniques</h5>
        <p>Suggests instructional strategies:</p>
        <ul>
          <li>Prompts for self-explanation</li>
          <li>Elaboration questions</li>
          <li>Comparative analysis activities</li>
          <li>Generative exercises</li>
        </ul>
      </div>

      <h4>How to Use Recommendations</h4>
      <ol>
        <li>
          <strong>Start with high-priority items</strong> - biggest impact
        </li>
        <li>
          <strong>Consider your context</strong> - adapt to your teaching
          situation
        </li>
        <li>
          <strong>Implement incrementally</strong> - don't try everything at
          once
        </li>
        <li>
          <strong>Re-analyze after changes</strong> - verify improvements
        </li>
      </ol>
    </div>
  );
}

// Principles data
const principlesData = [
  {
    name: "1. Deep Processing",
    definition:
      "Engaging with material at a meaningful level through analysis, synthesis, and critical thinking",
    why: "Surface-level reading leads to poor retention. Deep processing creates stronger, more durable memories",
    evaluated: [
      "Questions requiring analysis/synthesis",
      "Critical thinking prompts",
      "Application to new contexts",
      "Conceptual explanations beyond facts",
    ],
    ranges: {
      high: "Excellent deep processing opportunities throughout",
      medium: "Some deep processing, could be enhanced",
      low: "Primarily surface-level content, needs depth",
    },
  },
  {
    name: "2. Dual Coding",
    definition:
      "Combining verbal and visual information to create multiple memory pathways",
    why: "Visual + verbal encoding creates redundant memory traces, improving recall",
    evaluated: [
      "Presence of diagrams, charts, illustrations",
      "Visual representations of abstract concepts",
      "Integration of text and images",
      "Spatial arrangements that aid understanding",
    ],
    ranges: {
      high: "Rich multimodal content throughout",
      medium: "Some visuals, could use more integration",
      low: "Text-heavy, needs visual support",
    },
  },
  {
    name: "3. Retrieval Practice",
    definition: "Testing yourself to strengthen memory through active recall",
    why: "Testing effect - recalling information is more powerful than re-reading",
    evaluated: [
      "Practice questions and exercises",
      "Self-assessment opportunities",
      "Prompts to recall prior learning",
      "Variety of question types",
    ],
    ranges: {
      high: "Abundant retrieval opportunities",
      medium: "Some practice, could expand",
      low: "Minimal testing/practice",
    },
  },
  {
    name: "4. Spaced Repetition",
    definition: "Reviewing material at increasing intervals over time",
    why: "Distributed practice leads to better long-term retention than cramming",
    evaluated: [
      "Built-in review sections",
      "Callbacks to earlier concepts",
      "Cumulative exercises",
      "Suggestions for future review",
    ],
    ranges: {
      high: "Clear spaced review structure",
      medium: "Some review, could be more systematic",
      low: "Limited review opportunities",
    },
  },
  {
    name: "5. Interleaving",
    definition:
      "Mixing different types of problems or concepts rather than blocking them",
    why: "Strengthens discrimination between concepts and improves transfer",
    evaluated: [
      "Mixed practice problems",
      "Alternating between related concepts",
      "Varied question formats",
      "Cross-concept integration",
    ],
    ranges: {
      high: "Well-interleaved content and practice",
      medium: "Some mixing, mostly blocked",
      low: "Heavily blocked organization",
    },
  },
  {
    name: "6. Elaboration",
    definition:
      "Explaining and describing ideas with many details and connections",
    why: "Rich elaboration creates more retrieval cues and deeper understanding",
    evaluated: [
      "Detailed explanations",
      "Multiple examples per concept",
      "Connections to prior knowledge",
      "Real-world applications",
    ],
    ranges: {
      high: "Thorough elaboration throughout",
      medium: "Adequate detail, could expand",
      low: "Sparse, superficial treatment",
    },
  },
  {
    name: "7. Worked Examples",
    definition: "Step-by-step demonstrations of problem-solving procedures",
    why: "Reduces cognitive load and provides clear procedural models",
    evaluated: [
      "Presence of worked examples",
      "Step-by-step solutions",
      "Explanations of reasoning",
      "Gradual fading to independence",
    ],
    ranges: {
      high: "Comprehensive worked examples",
      medium: "Some examples, could be more detailed",
      low: "Few or no worked examples",
    },
  },
  {
    name: "8. Self-Explanation",
    definition: "Prompting learners to explain concepts to themselves",
    why: "Reveals gaps in understanding and promotes active sense-making",
    evaluated: [
      "Prompts to explain reasoning",
      "'Why' and 'How' questions",
      "Opportunities to justify answers",
      "Reflection activities",
    ],
    ranges: {
      high: "Frequent self-explanation prompts",
      medium: "Some prompts, could be more frequent",
      low: "Rare self-explanation opportunities",
    },
  },
  {
    name: "9. Generative Learning",
    definition: "Creating new content or products from learned material",
    why: "Active generation leads to deeper processing and better transfer",
    evaluated: [
      "Creative application tasks",
      "Synthesis activities",
      "Open-ended questions",
      "Project-based learning",
    ],
    ranges: {
      high: "Strong emphasis on generation",
      medium: "Some generative activities",
      low: "Mostly receptive learning",
    },
  },
  {
    name: "10. Schema Building",
    definition: "Organizing knowledge into coherent mental structures",
    why: "Schemas facilitate expert-like thinking and efficient retrieval",
    evaluated: [
      "Explicit organization and structure",
      "Concept maps or frameworks",
      "Hierarchical relationships",
      "Integration of new with existing knowledge",
    ],
    ranges: {
      high: "Clear schema development",
      medium: "Some structure, could be clearer",
      low: "Disconnected information",
    },
  },
];
