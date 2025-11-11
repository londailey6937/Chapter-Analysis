import React, { useState, useRef, useEffect } from "react";
import type { ChapterAnalysis } from "@/types";

interface WriterModeProps {
  extractedText: string;
  analysisResult: ChapterAnalysis | null;
  onTextChange?: (newText: string) => void;
}

export const WriterMode: React.FC<WriterModeProps> = ({
  extractedText,
  analysisResult,
  onTextChange,
}) => {
  const [editableText, setEditableText] = useState(extractedText);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Update editable text when source changes
  useEffect(() => {
    setEditableText(extractedText);
  }, [extractedText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEditableText(newText);
    onTextChange?.(newText);
  };

  // Get recommendations from analysis
  const recommendations = analysisResult?.recommendations || [];
  const concepts = analysisResult?.conceptGraph?.concepts || [];
  const principleScores = analysisResult?.principles || [];

  // Helper to highlight text issues based on principles
  const getTextIssues = () => {
    const issues: Array<{
      type: string;
      message: string;
      category: string;
      priority: "high" | "medium" | "low";
    }> = [];

    // Add recommendations as suggestions
    recommendations.forEach((rec) => {
      issues.push({
        type: "recommendation",
        message: rec.description,
        category: rec.category,
        priority: rec.priority,
      });
    });

    return issues;
  };

  const textIssues = getTextIssues();

  return (
    <div
      className="writer-mode flex flex-col bg-white"
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Writer Mode</h2>
            <p className="text-sm text-gray-600 mt-1">
              Edit your text based on learning principle recommendations
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? "◀ Hide Analysis" : "▶ Show Analysis"}
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                // TODO: Export functionality
                console.log("Export edited text:", editableText);
              }}
            >
              Export Text
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex overflow-hidden"
        style={{ maxWidth: "100%", width: "100%" }}
      >
        {/* Text Editor - Expands to full width when sidebar closed */}
        <div
          className="flex flex-col transition-all duration-300"
          style={{
            width: isSidebarOpen ? "65%" : "100%",
            maxWidth: isSidebarOpen ? "65%" : "100%",
          }}
        >
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-700">Editable Text</h3>
              <p className="text-xs text-gray-500">
                {editableText.length.toLocaleString()} characters •{" "}
                {editableText
                  .split(/\s+/)
                  .filter(Boolean)
                  .length.toLocaleString()}{" "}
                words
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-8">
            <textarea
              ref={textAreaRef}
              value={editableText}
              onChange={handleTextChange}
              className="w-full h-full min-h-full p-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base leading-relaxed shadow-sm"
              style={{
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                fontSize: "17px",
                lineHeight: "1.8",
                maxWidth: isSidebarOpen ? "100%" : "1200px",
                margin: isSidebarOpen ? "0" : "0 auto",
              }}
              placeholder="Your text will appear here..."
              spellCheck={true}
            />
          </div>
        </div>

        {/* Suggestions Panel - Collapsible Right Sidebar */}
        {isSidebarOpen && (
          <div
            className="flex flex-col bg-gray-50 border-l border-gray-200 transition-all duration-300"
            style={{ width: "35%", maxWidth: "35%" }}
          >
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700">
                Suggestions & Analysis
              </h3>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Principle Scores Summary */}
              {principleScores.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-900 mb-3">
                    Learning Principle Scores
                  </h4>
                  <div className="space-y-2">
                    {principleScores.map((ps, idx) => {
                      const roundedScore = Math.round(Number(ps.score));
                      console.log(
                        `[WriterMode] ${ps.principle}: ${ps.score} -> ${roundedScore}`
                      );
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs text-gray-700 font-medium">
                            {ps.principle}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  roundedScore >= 80
                                    ? "bg-green-500"
                                    : roundedScore >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${roundedScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-900 w-8 text-right">
                              {roundedScore}/100
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {textIssues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    Recommendations ({textIssues.length})
                  </h4>
                  {textIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all ${
                        selectedSuggestion === idx
                          ? "bg-blue-50 border-blue-500 shadow-md"
                          : issue.priority === "high"
                          ? "bg-red-50 border-red-500 hover:shadow-md"
                          : issue.priority === "medium"
                          ? "bg-yellow-50 border-yellow-500 hover:shadow-md"
                          : "bg-gray-50 border-gray-300 hover:shadow-md"
                      }`}
                      onClick={() => setSelectedSuggestion(idx)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase">
                          {issue.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            issue.priority === "high"
                              ? "bg-red-200 text-red-800"
                              : issue.priority === "medium"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">{issue.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Concept Summary */}
              {concepts.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-900 mb-3">
                    Concepts Identified ({concepts.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {concepts.slice(0, 15).map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                      >
                        {concept.name}
                      </span>
                    ))}
                    {concepts.length > 15 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{concepts.length - 15} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {textIssues.length === 0 && !analysisResult && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No analysis results yet.</p>
                  <p className="text-xs mt-1">
                    Run analysis to see suggestions here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
