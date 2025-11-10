/**
 * ConceptRelationshipsSection Component
 * Displays concept relationships and prerequisites detected in the chapter
 */

import React, { useState } from "react";
import type { Concept, ConceptRelationship } from "@/types";

interface ConceptRelationshipsSectionProps {
  concepts: Concept[];
  relationships: ConceptRelationship[];
}

export const ConceptRelationshipsSection: React.FC<
  ConceptRelationshipsSectionProps
> = ({ concepts, relationships }) => {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  // Create a map for quick concept lookup
  const conceptMap = new Map(concepts.map((c) => [c.id, c]));

  // Group relationships by type
  const relationshipsByType = {
    prerequisite: relationships.filter((r) => r.type === "prerequisite"),
    contrasts: relationships.filter((r) => r.type === "contrasts"),
    example: relationships.filter((r) => r.type === "example"),
    related: relationships.filter((r) => r.type === "related"),
  };

  // Find concepts with prerequisites
  const conceptsWithPrerequisites = concepts.filter(
    (c) => c.prerequisites && c.prerequisites.length > 0
  );

  // Get relationship type icon and color
  const getRelationshipStyle = (
    type: string
  ): { icon: string; color: string; label: string } => {
    switch (type) {
      case "prerequisite":
        return { icon: "→", color: "#3b82f6", label: "Prerequisite" };
      case "contrasts":
        return { icon: "↔", color: "#ef4444", label: "Contrasts with" };
      case "example":
        return { icon: "○", color: "#10b981", label: "Example of" };
      default:
        return { icon: "~", color: "#6b7280", label: "Related to" };
    }
  };

  // Get relationships for a specific concept
  const getConceptRelationships = (conceptId: string) => {
    return relationships.filter(
      (r) => r.source === conceptId || r.target === conceptId
    );
  };

  if (relationships.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold">🔗 Concept Relationships</h2>
        </div>
        <div className="card-body">
          <p className="text-gray-600">
            No significant concept relationships detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-2xl font-bold">🔗 Concept Relationships</h2>
        <p className="text-sm text-gray-600 mt-2">
          Detected {relationships.length} relationships between{" "}
          {concepts.length} concepts
        </p>
      </div>
      <div className="card-body">
        {/* Relationship Type Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {relationshipsByType.prerequisite.length}
            </p>
            <p className="text-sm text-gray-700 mt-1">Prerequisites</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-600">
              {relationshipsByType.contrasts.length}
            </p>
            <p className="text-sm text-gray-700 mt-1">Contrasts</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {relationshipsByType.example.length}
            </p>
            <p className="text-sm text-gray-700 mt-1">Examples</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gray-600">
              {relationshipsByType.related.length}
            </p>
            <p className="text-sm text-gray-700 mt-1">Related</p>
          </div>
        </div>

        {/* Prerequisites Section */}
        {conceptsWithPrerequisites.length > 0 && (
          <details className="mb-4" open>
            <summary className="cursor-pointer font-semibold text-lg text-gray-900 mb-3">
              📚 Concepts with Prerequisites ({conceptsWithPrerequisites.length}
              )
            </summary>
            <div className="space-y-3 pl-4">
              {conceptsWithPrerequisites.slice(0, 10).map((concept) => (
                <div
                  key={concept.id}
                  className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded"
                >
                  <p className="font-semibold text-gray-900">{concept.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Requires:{" "}
                    {concept.prerequisites
                      .map((pid) => conceptMap.get(pid)?.name || pid)
                      .join(", ")}
                  </p>
                </div>
              ))}
              {conceptsWithPrerequisites.length > 10 && (
                <p className="text-sm text-gray-500 italic">
                  ...and {conceptsWithPrerequisites.length - 10} more
                </p>
              )}
            </div>
          </details>
        )}

        {/* Top Relationships by Type */}
        {Object.entries(relationshipsByType).map(
          ([type, rels]) =>
            rels.length > 0 && (
              <details key={type} className="mb-4">
                <summary className="cursor-pointer font-semibold text-lg text-gray-900 mb-3">
                  {getRelationshipStyle(type).icon}{" "}
                  {getRelationshipStyle(type).label} ({rels.length})
                </summary>
                <div className="space-y-2 pl-4">
                  {rels.slice(0, 15).map((rel, idx) => {
                    const source = conceptMap.get(rel.source);
                    const target = conceptMap.get(rel.target);
                    const style = getRelationshipStyle(rel.type);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium text-gray-900">
                          {source?.name || "Unknown"}
                        </span>
                        <span
                          className="px-2 py-1 rounded text-white font-bold"
                          style={{ backgroundColor: style.color }}
                        >
                          {style.icon}
                        </span>
                        <span className="font-medium text-gray-900">
                          {target?.name || "Unknown"}
                        </span>
                        <span className="ml-auto text-xs text-gray-500">
                          {(rel.strength * 100).toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                  {rels.length > 15 && (
                    <p className="text-sm text-gray-500 italic">
                      ...and {rels.length - 15} more {type} relationships
                    </p>
                  )}
                </div>
              </details>
            )
        )}

        {/* Explore Individual Concepts */}
        <details className="mb-4">
          <summary className="cursor-pointer font-semibold text-lg text-gray-900 mb-3">
            🔍 Explore Concept Relationships
          </summary>
          <div className="pl-4">
            <p className="text-sm text-gray-600 mb-3">
              Select a concept to see all its relationships:
            </p>
            <select
              className="w-full p-2 border border-gray-300 rounded mb-3"
              value={expandedConcept || ""}
              onChange={(e) => setExpandedConcept(e.target.value || null)}
            >
              <option value="">-- Select a concept --</option>
              {concepts
                .filter((c) => getConceptRelationships(c.id).length > 0)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({getConceptRelationships(c.id).length}{" "}
                    relationships)
                  </option>
                ))}
            </select>

            {expandedConcept && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">
                  {conceptMap.get(expandedConcept)?.name}
                </h4>
                <div className="space-y-2">
                  {getConceptRelationships(expandedConcept).map((rel, idx) => {
                    const isSource = rel.source === expandedConcept;
                    const otherConceptId = isSource ? rel.target : rel.source;
                    const otherConcept = conceptMap.get(otherConceptId);
                    const style = getRelationshipStyle(rel.type);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <span
                          className="px-2 py-1 rounded text-white text-xs font-bold"
                          style={{ backgroundColor: style.color }}
                        >
                          {style.label}
                        </span>
                        <span className="font-medium text-gray-900">
                          {otherConcept?.name || "Unknown"}
                        </span>
                        <span className="ml-auto text-xs text-gray-500">
                          Strength: {(rel.strength * 100).toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
};

export default ConceptRelationshipsSection;
