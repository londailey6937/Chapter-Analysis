import React from "react";
import { AccessLevel } from "../../types";

interface UpgradePromptProps {
  currentLevel: AccessLevel;
  targetLevel: "premium" | "professional";
  feature: string;
  onUpgrade?: () => void;
  onDismiss?: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  currentLevel,
  targetLevel,
  feature,
  onUpgrade,
  onDismiss,
}) => {
  const premiumFeatures = [
    "✓ Full 10-Principle Learning Analysis",
    "✓ Complete Concept Graphs & Relationships",
    "✓ Detailed Pattern Recognition",
    "✓ Export Results (DOCX, JSON)",
    "✓ All Visualization Charts",
    "✓ Comprehensive Recommendations",
  ];

  const professionalFeatures = [
    "✓ Everything in Premium, plus:",
    "✓ Writer Mode - Real-time Editing",
    "✓ Live Analysis Updates",
    "✓ Unlimited Document Analyses",
    "✓ Priority Support",
    "✓ Advanced Customization",
  ];

  const features =
    targetLevel === "premium" ? premiumFeatures : professionalFeatures;
  const price = targetLevel === "premium" ? "$9.99/mo" : "$19.99/mo";
  const tierName = targetLevel === "premium" ? "Premium" : "Professional";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upgrade to {tierName}
          </h2>
          <p className="text-gray-600">
            Unlock <strong>{feature}</strong> and more
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-baseline justify-center mb-4">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
          </div>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start text-sm text-gray-700"
              >
                <span className="mr-2">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Upgrade to {tierName}
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="w-full text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Maybe Later
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          7-day free trial • Cancel anytime
        </p>
      </div>
    </div>
  );
};

interface InlineUpgradePromptProps {
  targetLevel: "premium" | "professional";
  feature: string;
  description: string;
  onUpgrade?: () => void;
}

export const InlineUpgradePrompt: React.FC<InlineUpgradePromptProps> = ({
  targetLevel,
  feature,
  description,
  onUpgrade,
}) => {
  const tierName = targetLevel === "premium" ? "Premium" : "Professional";
  const icon = targetLevel === "premium" ? "🔒" : "👑";

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 my-4">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{feature}</h3>
          <p className="text-gray-700 mb-4">{description}</p>
          <button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            Upgrade to {tierName}
          </button>
        </div>
      </div>
    </div>
  );
};
