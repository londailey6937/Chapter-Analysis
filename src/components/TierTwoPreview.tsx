import React from "react";

interface TierTwoPreviewProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const TierTwoPreview: React.FC<TierTwoPreviewProps> = ({
  onClose,
  onUpgrade,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#f3f4f6",
            color: "#6b7280",
            fontSize: "24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "300",
            lineHeight: "1",
          }}
        >
          ×
        </button>

        {/* Header */}
        <div
          style={{
            padding: "32px 32px 24px",
            borderBottom: "2px solid #f3f4f6",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#f0fdf4",
              padding: "6px 14px",
              borderRadius: "20px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "16px" }}>✨</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#16a34a",
              }}
            >
              Premium Features Preview
            </span>
          </div>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            Tier 2 Full Analysis Suite
          </h2>
          <p style={{ margin: 0, fontSize: "15px", color: "#6b7280" }}>
            See what you'll unlock with Premium access
          </p>
        </div>

        {/* Preview Content */}
        <div style={{ padding: "24px 32px 32px" }}>
          {/* Feature 1: 10-Principle Scoring */}
          <div
            style={{
              marginBottom: "28px",
              padding: "20px",
              backgroundColor: "#f9fafb",
              borderRadius: "16px",
              border: "2px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              📊 10-Principle Learning Analysis
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              {[
                { name: "Prior Knowledge", score: 85, severity: "good" },
                { name: "Concrete Examples", score: 72, severity: "moderate" },
                { name: "Dual Coding", score: 45, severity: "critical" },
                { name: "Spacing", score: 91, severity: "good" },
              ].map((principle) => (
                <div
                  key={principle.name}
                  style={{
                    padding: "12px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginBottom: "4px",
                    }}
                  >
                    {principle.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color:
                          principle.severity === "good"
                            ? "#16a34a"
                            : principle.severity === "moderate"
                            ? "#ea580c"
                            : "#dc2626",
                      }}
                    >
                      {principle.score}
                    </div>
                    <div
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "600",
                        backgroundColor:
                          principle.severity === "good"
                            ? "#dcfce7"
                            : principle.severity === "moderate"
                            ? "#fed7aa"
                            : "#fee2e2",
                        color:
                          principle.severity === "good"
                            ? "#16a34a"
                            : principle.severity === "moderate"
                            ? "#ea580c"
                            : "#dc2626",
                      }}
                    >
                      {principle.severity === "good"
                        ? "STRONG"
                        : principle.severity === "moderate"
                        ? "NEEDS WORK"
                        : "CRITICAL"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
              Get detailed scores across all 10 learning principles with
              evidence and actionable recommendations.
            </p>
          </div>

          {/* Feature 2: Concept Graphs */}
          <div
            style={{
              marginBottom: "28px",
              padding: "20px",
              backgroundColor: "#f9fafb",
              borderRadius: "16px",
              border: "2px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              🔗 Concept Relationship Graphs
            </h3>
            <div
              style={{
                padding: "24px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1.5px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "180px",
                position: "relative",
              }}
            >
              {/* Simple visual representation */}
              <svg
                width="100%"
                height="160"
                viewBox="0 0 400 160"
                style={{ maxWidth: "400px" }}
              >
                {/* Connections */}
                <line
                  x1="80"
                  y1="80"
                  x2="200"
                  y2="40"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <line
                  x1="80"
                  y1="80"
                  x2="200"
                  y2="80"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <line
                  x1="80"
                  y1="80"
                  x2="200"
                  y2="120"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <line
                  x1="200"
                  y1="40"
                  x2="320"
                  y2="80"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <line
                  x1="200"
                  y1="120"
                  x2="320"
                  y2="80"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />

                {/* Nodes */}
                <circle cx="80" cy="80" r="28" fill="#ef8432" />
                <circle cx="200" cy="40" r="24" fill="#60a5fa" />
                <circle cx="200" cy="80" r="24" fill="#60a5fa" />
                <circle cx="200" cy="120" r="24" fill="#60a5fa" />
                <circle cx="320" cy="80" r="28" fill="#34d399" />

                {/* Labels */}
                <text
                  x="80"
                  y="85"
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                >
                  Core
                </text>
                <text
                  x="200"
                  y="44"
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="600"
                >
                  Sub A
                </text>
                <text
                  x="200"
                  y="84"
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="600"
                >
                  Sub B
                </text>
                <text
                  x="200"
                  y="124"
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="600"
                >
                  Sub C
                </text>
                <text
                  x="320"
                  y="85"
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                >
                  Goal
                </text>
              </svg>
            </div>
            <p
              style={{
                margin: "12px 0 0 0",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Visualize how concepts connect, identify coverage gaps, and ensure
              proper prerequisite sequencing.
            </p>
          </div>

          {/* Feature 3: Pattern Analysis */}
          <div
            style={{
              marginBottom: "28px",
              padding: "20px",
              backgroundColor: "#f9fafb",
              borderRadius: "16px",
              border: "2px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              🎯 Advanced Pattern Recognition
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {[
                {
                  pattern: "Prerequisite Violations",
                  count: 3,
                  severity: "high",
                },
                { pattern: "Missing Examples", count: 7, severity: "medium" },
                {
                  pattern: "Concept Overload Sections",
                  count: 2,
                  severity: "high",
                },
                {
                  pattern: "Weak Concept Introduction",
                  count: 5,
                  severity: "medium",
                },
              ].map((item) => (
                <div
                  key={item.pattern}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    {item.pattern}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#6b7280",
                      }}
                    >
                      {item.count} found
                    </span>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          item.severity === "high" ? "#dc2626" : "#ea580c",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                margin: "12px 0 0 0",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Automatically detect learning science issues with precise location
              tracking and severity ratings.
            </p>
          </div>

          {/* Feature 4: Export Options */}
          <div
            style={{
              marginBottom: "28px",
              padding: "20px",
              backgroundColor: "#f9fafb",
              borderRadius: "16px",
              border: "2px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              📥 Professional Export Options
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              {["DOCX Report", "JSON Data", "HTML Dashboard"].map((format) => (
                <div
                  key={format}
                  style={{
                    padding: "16px 12px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    {format.includes("DOCX")
                      ? "📄"
                      : format.includes("JSON")
                      ? "🔧"
                      : "🌐"}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    {format}
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                margin: "12px 0 0 0",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Export comprehensive analysis reports in multiple formats for
              documentation and sharing.
            </p>
          </div>

          {/* CTA Section */}
          <div
            style={{
              marginTop: "32px",
              padding: "24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "16px",
              color: "white",
              textAlign: "center",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Ready to unlock these features?
            </h4>
            <p
              style={{ margin: "0 0 20px 0", fontSize: "14px", opacity: 0.95 }}
            >
              Upgrade to Premium and get access to the full 10-principle
              analyzer, concept graphs, and professional export tools.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={onUpgrade}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "white",
                  color: "#667eea",
                  border: "none",
                  borderRadius: "24px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
              >
                Upgrade to Premium - $9.99/mo
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1.5px solid white",
                  borderRadius: "24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
