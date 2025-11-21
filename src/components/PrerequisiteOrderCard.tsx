import React, { useMemo } from "react";
import type { Concept, ConceptRelationship } from "@/types";
import { CONCEPT_LIBRARIES } from "@/data/conceptLibraryRegistry";
import type { Domain } from "@/data/conceptLibraryTypes";
import {
  getCategoryPrerequisites,
  shouldPrecedeCategory,
} from "@/data/categoryHierarchy";

interface PrerequisiteOrderCardProps {
  concepts?: Concept[];
  conceptSequence?: string[];
  maxItems?: number;
  domainSelected?: boolean;
  activeDomain?: string | null;
  relationships?: ConceptRelationship[];
}

interface PrerequisiteOrderIssue {
  concept: Concept;
  prerequisite: Concept;
  orderLead: number;
  charLead: number;
}

interface MissingPrerequisite {
  concept: Concept;
  prerequisiteId: string;
}

const isDomainKey = (value: string | null | undefined): value is Domain => {
  if (!value || value === "none") return false;
  return Object.prototype.hasOwnProperty.call(CONCEPT_LIBRARIES, value);
};

export const PrerequisiteOrderCard: React.FC<PrerequisiteOrderCardProps> = ({
  concepts = [],
  conceptSequence,
  maxItems = 5,
  domainSelected = true,
  activeDomain = null,
  relationships = [],
}) => {
  const conceptMap = useMemo(() => {
    return new Map(concepts.map((concept) => [concept.id, concept]));
  }, [concepts]);

  const domainLibrary = useMemo(() => {
    if (!activeDomain) return null;
    if (!isDomainKey(activeDomain)) return null;
    return CONCEPT_LIBRARIES[activeDomain];
  }, [activeDomain]);

  const libraryPrerequisites = useMemo(() => {
    if (!domainLibrary) return null;
    const map = new Map<string, string[]>();
    domainLibrary.concepts.forEach((concept) => {
      if (concept.name && concept.prerequisites?.length) {
        // Map by name (lowercase) since detected concepts have different IDs
        map.set(concept.name.toLowerCase(), concept.prerequisites);
      }
    });
    return map;
  }, [domainLibrary]);

  const libraryConceptMap = useMemo(() => {
    if (!domainLibrary) return null;
    const map = new Map<string, any>();
    domainLibrary.concepts.forEach((concept) => {
      if (concept.name) {
        // Map by name (lowercase) for easy lookup
        map.set(concept.name.toLowerCase(), concept);
      }
    });
    return map;
  }, [domainLibrary]);

  const relationshipPrerequisites = useMemo(() => {
    const map = new Map<string, string[]>();
    relationships.forEach((rel) => {
      if (rel.type !== "prerequisite") return;
      const current = map.get(rel.target) || [];
      current.push(rel.source);
      map.set(rel.target, current);
    });
    return map;
  }, [relationships]);

  const resolvePrerequisites = (concept: Concept): string[] => {
    const set = new Set<string>();
    // Add from concept's own prerequisites
    (concept.prerequisites || []).forEach((id) => set.add(id));

    // Add from library prerequisites (match by name)
    const libraryPrereqNames = libraryPrerequisites?.get(
      concept.name.toLowerCase()
    );
    if (libraryPrereqNames) {
      libraryPrereqNames.forEach((prereqName) => {
        // Find the detected concept with this name
        const matchingConcept = concepts.find(
          (c) => c.name.toLowerCase() === prereqName.toLowerCase()
        );
        if (matchingConcept) {
          set.add(matchingConcept.id);
        }
      });
    }

    // Add category-based prerequisites (for mathematics domain)
    if (activeDomain === "mathematics" && concept.category) {
      const categoryPrereqs = getCategoryPrerequisites(concept.category);
      if (categoryPrereqs.length > 0) {
        // Find any concepts in the document that belong to prerequisite categories
        concepts.forEach((c) => {
          if (c.category && categoryPrereqs.includes(c.category)) {
            set.add(c.id);
          }
        });
      }
    }

    // Add from relationship prerequisites
    relationshipPrerequisites.get(concept.id)?.forEach((id) => set.add(id));
    return Array.from(set);
  };

  const getConceptLabel = (conceptId: string): string => {
    const detectedConcept = conceptMap.get(conceptId);
    if (detectedConcept) return detectedConcept.name;

    // Try to find in library by searching all concepts
    if (libraryConceptMap) {
      for (const [name, libConcept] of libraryConceptMap.entries()) {
        if (libConcept.id === conceptId) return libConcept.name;
      }
    }

    return conceptId;
  };

  const orderedConceptIds = useMemo(() => {
    if (conceptSequence && conceptSequence.length > 0) {
      return conceptSequence;
    }
    return [...concepts]
      .sort((a, b) => a.firstMentionPosition - b.firstMentionPosition)
      .map((c) => c.id);
  }, [conceptSequence, concepts]);

  const orderIndex = useMemo(() => {
    const index = new Map<string, number>();
    orderedConceptIds.forEach((id, idx) => {
      if (!index.has(id)) {
        index.set(id, idx);
      }
    });
    return index;
  }, [orderedConceptIds]);

  const {
    totalTracked,
    displayedIssues,
    totalOutOfOrder,
    missingPrereqs,
    inSequenceCount,
  } = useMemo(() => {
    let total = 0;
    const issues: PrerequisiteOrderIssue[] = [];
    const missing: MissingPrerequisite[] = [];

    // Debug logging
    console.log("🔍 Prerequisite Order Check Debug:");
    console.log("  Total concepts:", concepts.length);
    console.log("  Domain library:", domainLibrary ? "loaded" : "none");
    console.log(
      "  Library prerequisites map size:",
      libraryPrerequisites?.size || 0
    );
    console.log(
      "  Relationship prerequisites map size:",
      relationshipPrerequisites.size
    );

    concepts.forEach((concept, idx) => {
      const prereqIds = resolvePrerequisites(concept);

      if (idx < 3) {
        console.log(
          `  Concept "${concept.name}":`,
          prereqIds.length,
          "prerequisites"
        );
      }

      if (!prereqIds || prereqIds.length === 0) {
        return;
      }

      prereqIds.forEach((prereqId) => {
        total += 1;
        const prerequisite = conceptMap.get(prereqId);

        if (!prerequisite) {
          missing.push({ concept, prerequisiteId: prereqId });
          return;
        }

        const conceptIdx = orderIndex.get(concept.id);
        const prereqIdx = orderIndex.get(prerequisite.id);

        if (
          typeof conceptIdx === "number" &&
          typeof prereqIdx === "number" &&
          conceptIdx < prereqIdx
        ) {
          issues.push({
            concept,
            prerequisite,
            orderLead: prereqIdx - conceptIdx,
            charLead: Math.max(
              0,
              prerequisite.firstMentionPosition - concept.firstMentionPosition
            ),
          });
        }
      });
    });

    const sortedIssues = issues.sort((a, b) => {
      if (b.orderLead === a.orderLead) {
        return b.charLead - a.charLead;
      }
      return b.orderLead - a.orderLead;
    });

    const trimmedIssues = sortedIssues.slice(0, maxItems);
    const resolved = Math.max(total - issues.length - missing.length, 0);

    console.log("  Total tracked:", total);
    console.log("  Out of order:", issues.length);
    console.log("  Missing:", missing.length);
    console.log("  In sequence:", resolved);

    return {
      totalTracked: total,
      displayedIssues: trimmedIssues,
      totalOutOfOrder: issues.length,
      missingPrereqs: missing,
      inSequenceCount: resolved,
    };
  }, [concepts, conceptMap, orderIndex, maxItems]);

  const hasRelationshipData = relationshipPrerequisites.size > 0;
  const effectiveDomainSelected =
    domainSelected || isDomainKey(activeDomain) || hasRelationshipData;
  const hasConcepts = concepts && concepts.length > 0;

  if (!effectiveDomainSelected || !hasConcepts) {
    const message = !effectiveDomainSelected
      ? "Select a subject domain (e.g., Chemistry or Computer Science) and rerun the analysis to unlock prerequisite relationships and sequencing alerts."
      : "No concepts detected yet. Run a full analysis or add more domain-specific language to enable prerequisite comparisons.";

    return (
      <div className="card prereq-order-card">
        <div className="card-header">
          <h3 className="text-xl font-semibold text-gray-900">
            Prerequisite Order Check
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Highlights when dependent concepts outrun their foundations.
          </p>
        </div>
        <div className="card-body">
          <p className="summary-text">{message}</p>
        </div>
      </div>
    );
  }

  // Removed the blocking message for missing prerequisites
  // as we can rely on explicit relationships instead.

  const issueSummary = (() => {
    if (totalTracked === 0) {
      return "No prerequisite relationships detected for this chapter.";
    }
    if (totalOutOfOrder === 0 && missingPrereqs.length === 0) {
      return "All prerequisite concepts appear before dependent ideas - sequencing looks solid.";
    }
    if (totalOutOfOrder > 0 && missingPrereqs.length > 0) {
      return "Some prerequisites are missing entirely and others appear after the concepts that rely on them.";
    }
    if (totalOutOfOrder > 0) {
      return "Some advanced concepts are introduced before their prerequisites.";
    }
    return "Some prerequisites are referenced but never introduced.";
  })();

  const severityForGap = (orderLead: number): "low" | "medium" | "high" => {
    if (orderLead >= 4) return "high";
    if (orderLead >= 2) return "medium";
    return "low";
  };

  const formatOrderLead = (lead: number) =>
    lead === 1 ? "1 concept earlier" : `${lead} concepts earlier`;

  const formatWordGap = (charLead: number) => {
    if (charLead <= 0) return "right before";
    const approxWords = Math.max(1, Math.round(charLead / 6));

    if (approxWords > 800) {
      const pages = Math.round(approxWords / 400);
      return `${pages} page${pages === 1 ? "" : "s"} earlier`;
    }

    if (approxWords > 80) {
      const paragraphs = Math.round(approxWords / 80);
      return `${paragraphs} paragraph${paragraphs === 1 ? "" : "s"} earlier`;
    }

    return `${approxWords} word${approxWords === 1 ? "" : "s"} earlier`;
  };

  return (
    <div className="card prereq-order-card">
      <div className="card-header">
        <h3 className="text-xl font-semibold text-gray-900">
          Prerequisite Order Check
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Highlights when dependent concepts outrun their foundations.
        </p>
      </div>
      <div className="card-body">
        <div className="prereq-summary-grid">
          <div>
            <div className="summary-value">{totalTracked}</div>
            <div className="summary-label">Tracked prerequisites</div>
          </div>
          <div>
            <div className="summary-value warn">
              {totalOutOfOrder + missingPrereqs.length}
            </div>
            <div className="summary-label">
              Conflicts{missingPrereqs.length > 0 ? " / missing" : ""}
            </div>
          </div>
          <div>
            <div className="summary-value success">{inSequenceCount}</div>
            <div className="summary-label">In sequence</div>
          </div>
        </div>

        <p className="summary-text">{issueSummary}</p>

        <div className="prereq-why-matters">
          <strong>Why this matters:</strong> When a chapter introduces complex
          ideas before their building blocks, readers have to reverse-engineer
          the logic instead of learning it. Catching these sequencing gaps early
          keeps scaffolding intact and prevents cognitive overload.
        </div>

        {displayedIssues.length > 0 && (
          <div className="prereq-issue-list">
            {displayedIssues.map((issue) => {
              const severity = severityForGap(issue.orderLead);
              return (
                <div
                  key={`${issue.concept.id}-${issue.prerequisite.id}`}
                  className="prereq-issue"
                >
                  <div>
                    <p className="concept-name">{issue.concept.name}</p>
                    <p className="issue-detail">
                      Appears {formatOrderLead(issue.orderLead)} than{" "}
                      <span className="prereq-name">
                        {issue.prerequisite.name}
                      </span>{" "}
                      ({formatWordGap(issue.charLead)})
                    </p>
                  </div>
                  <span className={`severity-tag severity-${severity}`}>
                    {severity}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {missingPrereqs.length > 0 && (
          <div className="missing-prereq">
            <p className="missing-title">
              Missing prerequisites ({missingPrereqs.length})
            </p>
            <ul>
              {missingPrereqs.slice(0, maxItems).map((item) => (
                <li key={`${item.concept.id}-${item.prerequisiteId}`}>
                  {item.concept.name} expects{" "}
                  <span className="prereq-name">
                    {getConceptLabel(item.prerequisiteId)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        .prereq-order-card {
          margin-top: 20px;
        }
        .prereq-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 12px;
        }
        .summary-value {
          font-size: 24px;
          font-weight: 600;
          color: var(--brand-navy-700);
        }
        .summary-value.warn {
          color: var(--warn-600);
        }
        .summary-value.success {
          color: var(--success-600);
        }
        .summary-label {
          font-size: 12px;
          color: var(--text-muted);
        }
        .summary-text {
          font-size: 14px;
          color: var(--text-main);
          margin: 8px 0 14px;
        }
        .prereq-issue-list {
          border-top: 1px solid var(--border-soft);
          padding-top: 12px;
          margin-top: 8px;
        }
        .prereq-issue {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .prereq-issue:last-child {
          border-bottom: none;
        }
        .concept-name {
          font-weight: 600;
          margin: 0 0 4px 0;
          color: var(--text-main);
        }
        .issue-detail {
          margin: 0;
          font-size: 13px;
          color: var(--text-muted);
        }
        .prereq-name {
          font-weight: 600;
          color: var(--brand-navy-600);
        }
        .severity-tag {
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 700;
          border-radius: 999px;
          padding: 4px 10px;
          background: #f1f5f9;
        }
        .severity-low {
          color: var(--brand-navy-700);
        }
        .severity-medium {
          color: var(--warn-600);
        }
        .severity-high {
          color: var(--danger-600);
        }
        .missing-prereq {
          margin-top: 16px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px dashed var(--border-soft);
        }
        .missing-title {
          margin: 0 0 6px 0;
          font-weight: 600;
          font-size: 13px;
          color: var(--text-main);
        }
        .missing-prereq ul {
          margin: 0;
          padding-left: 16px;
          color: var(--text-muted);
          font-size: 13px;
        }
        .missing-prereq li {
          margin: 3px 0;
        }
        .prereq-why-matters {
          padding: 12px;
          border-radius: 8px;
          background: #f8fafc;
          border-left: 3px solid var(--brand-navy-600);
          font-size: 13px;
          color: var(--text-main);
          margin-bottom: 12px;
        }
        @media (max-width: 640px) {
          .prereq-issue {
            flex-direction: column;
            align-items: flex-start;
          }
          .severity-tag {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default PrerequisiteOrderCard;
