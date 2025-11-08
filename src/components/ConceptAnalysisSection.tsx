import { Domain } from "@/data/conceptLibraryRegistry";
import {
  getPluralTermCapitalized,
  getCorePluralTerm,
  getSingularTerm,
} from "@/utils/domainTerminology";

/**
 * Props interface for ConceptAnalysisSection component
 */
interface ConceptAnalysisSectionProps {
  /** Total number of concepts identified */
  totalConcepts: number;
  /** Number of core concepts */
  coreConcepts: number;
  /** Concept density per 1000 words */
  density: number;
  /** Hierarchy balance score (0-1) */
  balance: number;
  /** Domain being analyzed (for terminology) */
  domain: Domain;
}

/**
 * ConceptAnalysisSection Component
 *
 * Displays concept extraction and hierarchy analysis results.
 * Shows key metrics about identified concepts and their organization.
 *
 * Parent: ChapterAnalysisDashboard
 *
 * @param {ConceptAnalysisSectionProps} props - Component props from parent
 * @returns {JSX.Element} Concept analysis section card
 */
function ConceptAnalysisSection({
  totalConcepts,
  coreConcepts,
  density,
  balance,
  domain,
}: ConceptAnalysisSectionProps): JSX.Element {
  const pluralTerm = getPluralTermCapitalized(domain);
  const singularTerm = getSingularTerm(domain);
  const corePluralTerm = getCorePluralTerm(domain);

  /**
   * Gets interpretation text for concept metrics
   */
  const getDensityInterpretation = (densityValue: number): string => {
    if (densityValue >= 4)
      return `High ${singularTerm} density - may need simplification`;
    if (densityValue >= 3) return `Optimal ${singularTerm} density`;
    if (densityValue >= 2) return `Moderate ${singularTerm} density`;
    return `Low ${singularTerm} density - consider adding more ${singularTerm}s`;
  };

  /**
   * Gets balance interpretation
   */
  const getBalanceInterpretation = (balanceValue: number): string => {
    if (balanceValue >= 0.8) return "Well-balanced hierarchy";
    if (balanceValue >= 0.6) return "Good hierarchy balance";
    return `Consider reorganizing ${singularTerm}s for better balance`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-2xl font-bold">{pluralTerm} Analysis</h2>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Concepts */}
          <div className="text-center">
            <div className="bg-primary-50 rounded-lg p-6 mb-3">
              <p className="text-4xl font-bold text-primary-600">
                {totalConcepts}
              </p>
            </div>
            <h4 className="font-semibold text-gray-900">Total {pluralTerm}</h4>
            <p className="text-sm text-gray-600 mt-1">
              Unique {singularTerm}s identified
            </p>
          </div>

          {/* Core Concepts */}
          <div className="text-center">
            <div className="bg-secondary-50 rounded-lg p-6 mb-3">
              <p className="text-4xl font-bold text-secondary-600">
                {coreConcepts}
              </p>
            </div>
            <h4 className="font-semibold text-gray-900 capitalize">
              {corePluralTerm}
            </h4>
            <p className="text-sm text-gray-600 mt-1">Foundation-level ideas</p>
          </div>

          {/* Concept Density */}
          <div className="text-center">
            <div className="bg-blue-50 rounded-lg p-6 mb-3">
              <p className="text-4xl font-bold text-blue-600">
                {density.toFixed(1)}
              </p>
              <p className="text-xs text-blue-600">per 1K words</p>
            </div>
            <h4 className="font-semibold text-gray-900">Density</h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {getDensityInterpretation(density)}
            </p>
          </div>

          {/* Hierarchy Balance */}
          <div className="text-center">
            <div className="bg-emerald-50 rounded-lg p-6 mb-3">
              <p className="text-4xl font-bold text-emerald-600">
                {(balance * 100).toFixed(0)}%
              </p>
            </div>
            <h4 className="font-semibold text-gray-900">Balance</h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {getBalanceInterpretation(balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConceptAnalysisSection;
