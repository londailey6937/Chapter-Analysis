import { ChapterAnalysis } from "@/types";
import OverallScoreCard from "./OverallScoreCard";
import PrincipleScoresGrid from "./PrincipleScoresGrid";
import ConceptAnalysisSection from "./ConceptAnalysisSection";
import RecommendationsSection from "./RecommendationsSection";

/**
 * Props interface for ChapterAnalysisDashboard component
 */
interface ChapterAnalysisDashboardProps {
  /** Complete analysis results */
  analysis: ChapterAnalysis;
  /** Callback to reset and go back to input */
  onReset: () => void;
}

/**
 * ChapterAnalysisDashboard Component
 *
 * Main dashboard displaying comprehensive chapter analysis results.
 * Shows overall score, principle evaluations, visualizations, and recommendations.
 *
 * Parent: App
 * Children: OverallScoreCard, PrincipleScoresGrid, ConceptAnalysisSection, RecommendationsSection
 *
 * @param {ChapterAnalysisDashboardProps} props - Component props from parent
 * @returns {JSX.Element} Full analysis dashboard
 */
function ChapterAnalysisDashboard({
  analysis,
  onReset,
}: ChapterAnalysisDashboardProps): JSX.Element {
  const { overallScore, conceptAnalysis, structureAnalysis, recommendations } =
    analysis;

  return (
    <div className="space-y-8">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gradient">Analysis Results</h1>
        <button onClick={onReset} className="btn-secondary">
          ← New Analysis
        </button>
      </div>

      {/* Overall Score Card */}
      <OverallScoreCard score={overallScore} />

      {/* Principle Scores Grid */}
      <PrincipleScoresGrid principles={analysis.principles} />

      {/* Concept Analysis Section */}
      <ConceptAnalysisSection
        totalConcepts={conceptAnalysis.totalConceptsIdentified}
        coreConcepts={conceptAnalysis.coreConceptCount}
        density={conceptAnalysis.conceptDensity}
        balance={conceptAnalysis.hierarchyBalance}
      />

      {/* Structure Analysis */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold">Chapter Structure</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Layout</h4>
              <p className="text-sm text-gray-700 mb-3">
                <strong>{structureAnalysis.sectionCount}</strong> sections
                identified
              </p>
              <p className="text-sm text-gray-700 mb-3">
                Average section:{" "}
                <strong>{structureAnalysis.avgSectionLength}</strong> words
              </p>
              <p className="text-sm text-gray-700">
                Pacing:{" "}
                <span className="badge-primary">
                  {structureAnalysis.pacing}
                </span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Quality Indicators
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      structureAnalysis.scaffolding.hasIntroduction ? "✓" : "✗"
                    }
                  >
                    {structureAnalysis.scaffolding.hasIntroduction ? "✓" : "✗"}
                  </span>
                  <span className="text-sm">Clear introduction</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      structureAnalysis.scaffolding.hasProgression ? "✓" : "✗"
                    }
                  >
                    {structureAnalysis.scaffolding.hasProgression ? "✓" : "✗"}
                  </span>
                  <span className="text-sm">Logical progression</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      structureAnalysis.scaffolding.hasSummary ? "✓" : "✗"
                    }
                  >
                    {structureAnalysis.scaffolding.hasSummary ? "✓" : "✗"}
                  </span>
                  <span className="text-sm">Summary included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <RecommendationsSection recommendations={recommendations} />

      {/* Export Section */}
      <div className="card">
        <div className="card-body">
          <h3 className="text-xl font-semibold mb-4">Export Results</h3>
          <button
            onClick={() => {
              const dataStr = JSON.stringify(analysis, null, 2);
              const dataBlob = new Blob([dataStr], {
                type: "application/json",
              });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `chapter-analysis-${
                new Date().toISOString().split("T")[0]
              }.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="btn-primary"
          >
            📥 Export as JSON
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Download your complete analysis report as a JSON file.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChapterAnalysisDashboard;
