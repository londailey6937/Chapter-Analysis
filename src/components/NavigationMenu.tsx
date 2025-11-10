import { useState } from "react";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
}

/**
 * NavigationMenu Component - Modern sliding navigation with feature showcase
 *
 * Features:
 * - Slide-in animation from left
 * - Expandable feature sections
 * - Links to documentation and help
 * - Feature highlights with icons
 * - Smooth transitions and modern design
 */
export function NavigationMenu({
  isOpen,
  onClose,
  onOpenHelp,
}: NavigationMenuProps): JSX.Element | null {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={onClose}
      />

      {/* Navigation Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "white",
          zIndex: 1000,
          overflowY: "auto",
          boxShadow: "4px 0 24px rgba(0, 0, 0, 0.15)",
          animation: "slideInLeft 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              🧠 Chapter Checker
            </h2>
            <p
              style={{
                margin: "0.25rem 0 0 0",
                fontSize: "0.875rem",
                opacity: 0.9,
              }}
            >
              AI-Powered Learning Science Analysis
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
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

        {/* Quick Actions */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
          <h3
            style={{
              margin: "0 0 1rem 0",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Quick Actions
          </h3>
          <button
            onClick={() => {
              onOpenHelp();
              onClose();
            }}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(102, 126, 234, 0.3)";
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>📚</span>
            <span>View Analysis Guide</span>
          </button>
        </div>

        {/* Features Section */}
        <div style={{ padding: "1.5rem" }}>
          <h3
            style={{
              margin: "0 0 1rem 0",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Features
          </h3>

          {/* Core Analysis */}
          <FeatureSection
            title="🎓 Core Analysis"
            icon="🎯"
            isExpanded={expandedSection === "core"}
            onToggle={() => toggleSection("core")}
            features={[
              {
                icon: "📊",
                title: "10 Learning Principles",
                desc: "Evidence-based cognitive science evaluation",
              },
              {
                icon: "🎯",
                title: "Weighted Scoring",
                desc: "0-100 quality metrics with detailed breakdowns",
              },
              {
                icon: "💡",
                title: "Actionable Insights",
                desc: "Priority-ranked improvement recommendations",
              },
              {
                icon: "📈",
                title: "Real-Time Analysis",
                desc: "Web Worker processing for instant results",
              },
            ]}
          />

          {/* Domain Intelligence */}
          <FeatureSection
            title="🧪 Domain Intelligence"
            icon="🔬"
            isExpanded={expandedSection === "domain"}
            onToggle={() => toggleSection("domain")}
            badge="NEW!"
            features={[
              {
                icon: "⚗️",
                title: "Chemical Equations",
                desc: "Reaction detection with difficulty assessment",
              },
              {
                icon: "🧮",
                title: "Stoichiometry",
                desc: "Mole/mass calculation recognition",
              },
              {
                icon: "⚛️",
                title: "Lewis Structures",
                desc: "Molecular diagram identification",
              },
              {
                icon: "🔬",
                title: "Lab Procedures",
                desc: "Experimental method analysis",
              },
              {
                icon: "🏷️",
                title: "Nomenclature",
                desc: "IUPAC naming exercise detection",
              },
              {
                icon: "🔄",
                title: "Mechanisms",
                desc: "Multi-step reaction pathway tracking",
              },
            ]}
          />

          {/* Pattern Recognition */}
          <FeatureSection
            title="🔍 Pattern Recognition"
            icon="🎨"
            isExpanded={expandedSection === "patterns"}
            onToggle={() => toggleSection("patterns")}
            features={[
              {
                icon: "📝",
                title: "Definition-Example",
                desc: "Concept introduction patterns",
              },
              {
                icon: "🔄",
                title: "Compare-Contrast",
                desc: "Side-by-side analysis detection",
              },
              {
                icon: "📊",
                title: "Problem-Solution",
                desc: "Challenge/resolution structures",
              },
              {
                icon: "📚",
                title: "Elaboration",
                desc: "Progressive detail expansion",
              },
            ]}
          />

          {/* Concept Analysis */}
          <FeatureSection
            title="💡 Concept Analysis"
            icon="🗺️"
            isExpanded={expandedSection === "concepts"}
            onToggle={() => toggleSection("concepts")}
            features={[
              {
                icon: "🔥",
                title: "Importance Ranking",
                desc: "High/Medium/Low classification",
              },
              {
                icon: "🔗",
                title: "Relationship Mapping",
                desc: "4 types: Prerequisites, Related, Examples, Contrasts",
              },
              {
                icon: "🏷️",
                title: "Domain Metadata",
                desc: "Chemistry-specific tags and classifications",
              },
              {
                icon: "🌐",
                title: "Visual Network",
                desc: "Interactive concept connection graphs",
              },
            ]}
          />

          {/* PDF & Visualization */}
          <FeatureSection
            title="📄 PDF & Visualization"
            icon="🎨"
            isExpanded={expandedSection === "visual"}
            onToggle={() => toggleSection("visual")}
            features={[
              {
                icon: "📤",
                title: "Drag & Drop Upload",
                desc: "Instant PDF text extraction",
              },
              {
                icon: "👀",
                title: "Side-by-Side Viewer",
                desc: "View PDF while analyzing",
              },
              {
                icon: "🎯",
                title: "Concept Highlighting",
                desc: "Click concepts to highlight in PDF",
              },
              {
                icon: "📊",
                title: "Interactive Charts",
                desc: "Rich data visualizations",
              },
              {
                icon: "🎨",
                title: "Color-Coded Scores",
                desc: "Visual principle performance",
              },
            ]}
          />

          {/* Data & Export */}
          <FeatureSection
            title="💾 Data Management"
            icon="💼"
            isExpanded={expandedSection === "data"}
            onToggle={() => toggleSection("data")}
            features={[
              {
                icon: "💾",
                title: "Export Analysis",
                desc: "Save results as JSON",
              },
              {
                icon: "📂",
                title: "Load Previous",
                desc: "Review past evaluations",
              },
              {
                icon: "⚙️",
                title: "Custom Concepts",
                desc: "Add domain vocabulary",
              },
              {
                icon: "🎛️",
                title: "Configurable",
                desc: "Section hints & TOC management",
              },
            ]}
          />
        </div>

        {/* Coming Soon */}
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            🔮 Coming Soon
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <ComingSoonItem
              icon="🧬"
              title="Biology Domain"
              desc="DNA, cells, genetics patterns"
            />
            <ComingSoonItem
              icon="💰"
              title="Finance Domain"
              desc="Calculations, case studies"
            />
            <ComingSoonItem
              icon="💻"
              title="Computer Science"
              desc="Algorithms, code examples"
            />
            <ComingSoonItem
              icon="📄"
              title="PDF Reports"
              desc="Professional formatted exports"
            />
            <ComingSoonItem
              icon="📈"
              title="Comparative Analysis"
              desc="Compare multiple chapters"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
            Built with ⚛️ React • TypeScript • Tailwind CSS
          </p>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              fontSize: "0.75rem",
              color: "#9ca3af",
            }}
          >
            Evidence-based learning science at your fingertips
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

// Feature Section Component
interface FeatureSectionProps {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  badge?: string;
  features: Array<{ icon: string; title: string; desc: string }>;
}

function FeatureSection({
  title,
  icon,
  isExpanded,
  onToggle,
  badge,
  features,
}: FeatureSectionProps) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          backgroundColor: isExpanded ? "#f3f4f6" : "white",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.2s",
          fontSize: "0.95rem",
          fontWeight: "600",
          color: "#1f2937",
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = "white";
          }
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.25rem" }}>{icon}</span>
          <span>{title}</span>
          {badge && (
            <span
              style={{
                padding: "0.125rem 0.5rem",
                backgroundColor: "#10b981",
                color: "white",
                fontSize: "0.625rem",
                fontWeight: "700",
                borderRadius: "9999px",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: "1rem",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            animation: "expandIn 0.2s ease-out",
          }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                padding: "0.75rem",
                marginBottom: idx < features.length - 1 ? "0.5rem" : 0,
                backgroundColor: "white",
                borderRadius: "6px",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: "1.25rem", marginTop: "0.125rem" }}>
                {feature.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    color: "#1f2937",
                    marginBottom: "0.25rem",
                  }}
                >
                  {feature.title}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    lineHeight: "1.4",
                  }}
                >
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes expandIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Coming Soon Item Component
interface ComingSoonItemProps {
  icon: string;
  title: string;
  desc: string;
}

function ComingSoonItem({ icon, title, desc }: ComingSoonItemProps) {
  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        backgroundColor: "white",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <span style={{ fontSize: "1.25rem" }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div
          style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1f2937" }}
        >
          {title}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{desc}</div>
      </div>
      <span
        style={{ fontSize: "0.625rem", color: "#9ca3af", fontWeight: "600" }}
      >
        SOON
      </span>
    </div>
  );
}
