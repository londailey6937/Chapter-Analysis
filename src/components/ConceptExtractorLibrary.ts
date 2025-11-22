/**
 * Simple Concept Extraction Engine
 * Scans chapter text for known concept phrases sourced from domain libraries.
 */

import type {
  Concept,
  ConceptMention,
  ConceptGraph,
  ConceptRelationship,
  Section,
} from "../../types";

import type { Domain, ConceptDefinition } from "../data/conceptLibraryRegistry";
import { getLibraryByDomain } from "../data/conceptLibraryRegistry";

type ExtractionMatch = {
  definition: ConceptDefinition;
  mentions: MentionOccurrence[];
};

type MentionOccurrence = {
  start: number;
  end: number;
  matchedText: string;
  isAlias: boolean;
};

const CONTEXT_WINDOW = 100;

export class ConceptExtractor {
  private domain: Domain;
  private includeCrossDomain: boolean;
  private customConcepts: ConceptDefinition[];
  private library: ConceptDefinition[];
  private issuedIds: Set<string>;

  constructor(
    domain: Domain = "chemistry",
    includeCrossDomain: boolean = true,
    customConcepts: ConceptDefinition[] = []
  ) {
    this.domain = domain;
    this.includeCrossDomain = includeCrossDomain;
    this.customConcepts = customConcepts;
    this.issuedIds = new Set();
    this.library = this.buildLibrary();
  }

  static async extractConceptsFromChapter(
    chapter: string,
    sections: Section[],
    onProgress?: (step: string, detail?: string) => void,
    domain: Domain = "chemistry",
    includeCrossDomain: boolean = true,
    customConcepts: ConceptDefinition[] = []
  ): Promise<ConceptGraph> {
    const extractor = new ConceptExtractor(
      domain,
      includeCrossDomain,
      customConcepts
    );
    return extractor.extractGraph(chapter, sections, onProgress);
  }

  private extractGraph(
    text: string,
    _sections: Section[],
    onProgress?: (step: string, detail?: string) => void
  ): ConceptGraph {
    this.issuedIds.clear();
    this.library = this.buildLibrary();

    onProgress?.("concept-load", "Preparing concept library");
    const matches = this.scanForConcepts(text);

    onProgress?.("concept-build", `Building ${matches.length} concept entries`);
    const concepts = matches.map((match) => this.createConcept(match, text));

    const hierarchy = this.buildHierarchy(concepts);
    const sequence = this.buildSequence(concepts);

    const relationships: ConceptRelationship[] = [];

    return {
      concepts,
      relationships,
      hierarchy,
      sequence,
    };
  }

  private buildLibrary(): ConceptDefinition[] {
    const domainLibrary = getLibraryByDomain(this.domain)?.concepts ?? [];
    const crossDomainLibrary = this.includeCrossDomain
      ? getLibraryByDomain("cross-domain")?.concepts ?? []
      : [];

    const combined = [
      ...domainLibrary,
      ...crossDomainLibrary,
      ...this.customConcepts,
    ];

    const uniqueByKey = new Map<string, ConceptDefinition>();

    for (const definition of combined) {
      const key = this.getDeduplicationKey(definition);
      if (!key) {
        continue;
      }

      const existing = uniqueByKey.get(key);
      if (!existing) {
        uniqueByKey.set(key, definition);
        continue;
      }

      const existingDescription = existing.description?.length ?? 0;
      const incomingDescription = definition.description?.length ?? 0;
      const preferIncoming =
        (!!definition.id && !existing.id) ||
        incomingDescription > existingDescription;

      if (preferIncoming) {
        uniqueByKey.set(key, definition);
      }
    }

    return Array.from(uniqueByKey.values());
  }

  private scanForConcepts(text: string): ExtractionMatch[] {
    const matches: ExtractionMatch[] = [];
    let totalMentions = 0;
    const MAX_MENTIONS = 5000; // Safety limit to prevent OOM on large docs

    for (const definition of this.library) {
      if (totalMentions > MAX_MENTIONS) {
        console.warn(
          "[ConceptExtractor] Max mentions limit reached, stopping extraction."
        );
        break;
      }

      const mentionMap = new Map<number, MentionOccurrence>();

      const recordMatch = (match: MentionOccurrence) => {
        const existing = mentionMap.get(match.start);
        if (!existing) {
          mentionMap.set(match.start, match);
          return;
        }

        if (existing.isAlias && !match.isAlias) {
          mentionMap.set(match.start, match);
          return;
        }

        if (match.matchedText.length > existing.matchedText.length) {
          mentionMap.set(match.start, match);
        }
      };

      const collect = (term: string | undefined, isAlias: boolean) => {
        const trimmed = term?.trim();
        if (!trimmed) {
          return;
        }

        const regex = this.createFlexibleRegex(
          trimmed,
          this.shouldUseCaseSensitiveMatching(trimmed)
        );
        let execResult: RegExpExecArray | null;

        while ((execResult = regex.exec(text)) !== null) {
          const matched = execResult[0];
          const start = execResult.index;
          const end = start + matched.length;

          recordMatch({
            start,
            end,
            matchedText: matched,
            isAlias,
          });

          if (regex.lastIndex === start) {
            regex.lastIndex += 1;
          }
        }
      };

      collect(definition.name, false);
      definition.aliases?.forEach((alias) => collect(alias, true));

      const mentions = Array.from(mentionMap.values()).sort(
        (a, b) => a.start - b.start
      );

      if (mentions.length > 0) {
        matches.push({ definition, mentions });
        totalMentions += mentions.length;
      }
    }

    matches.sort((a, b) => {
      const aPosition = a.mentions[0]?.start ?? Number.MAX_SAFE_INTEGER;
      const bPosition = b.mentions[0]?.start ?? Number.MAX_SAFE_INTEGER;
      return aPosition - bPosition;
    });

    return matches;
  }

  private createConcept(match: ExtractionMatch, text: string): Concept {
    const { definition, mentions } = match;
    const id = this.resolveConceptId(definition);
    const importance = this.normalizeImportance(definition.importance);

    const depthForMention =
      importance === "core"
        ? "deep"
        : importance === "detail"
        ? "shallow"
        : "moderate";

    const conceptMentions: ConceptMention[] = mentions.map((mention) => ({
      position: mention.start,
      matchedText: mention.matchedText,
      context: this.extractContext(text, mention.start, mention.end),
      depth: depthForMention,
      isRevisit: false,
      associatedConcepts: [],
      isAlias: mention.isAlias,
    }));

    const firstMention = conceptMentions[0];

    return {
      id,
      name: definition.name,
      definition: this.buildDefinitionText(definition),
      importance,
      firstMentionPosition: firstMention?.position ?? 0,
      mentions: conceptMentions,
      relatedConcepts: definition.relatedConcepts
        ? Array.from(new Set(definition.relatedConcepts))
        : [],
      prerequisites: [],
      applications: [],
      commonMisconceptions: definition.misconceptions
        ? Array.from(new Set(definition.misconceptions))
        : [],
    } satisfies Concept;
  }

  private buildHierarchy(concepts: Concept[]) {
    return {
      core: concepts.filter((concept) => concept.importance === "core"),
      supporting: concepts.filter(
        (concept) => concept.importance === "supporting"
      ),
      detail: concepts.filter((concept) => concept.importance === "detail"),
    };
  }

  private buildSequence(concepts: Concept[]): string[] {
    return concepts
      .slice()
      .sort((a, b) => a.firstMentionPosition - b.firstMentionPosition)
      .map((concept) => concept.id);
  }

  private extractContext(text: string, start: number, end: number): string {
    const safeStart = Math.max(0, start - CONTEXT_WINDOW);
    const safeEnd = Math.min(text.length, end + CONTEXT_WINDOW);

    let context = text.slice(safeStart, safeEnd).trim();
    if (safeStart > 0) {
      context = `...${context}`;
    }
    if (safeEnd < text.length) {
      context = `${context}...`;
    }
    return context;
  }

  private buildDefinitionText(definition: ConceptDefinition): string {
    const trimmed = definition.description?.trim();
    if (trimmed && trimmed.length > 0) {
      return trimmed;
    }

    const pieces = [definition.category, definition.subcategory]
      .filter((value) => Boolean(value && value.trim().length > 0))
      .map((value) => value!.trim());

    return pieces.join(" - ") || definition.name;
  }

  private normalizeImportance(
    value?: ConceptDefinition["importance"]
  ): "core" | "supporting" | "detail" {
    if (value === "core" || value === "detail") {
      return value;
    }
    return "supporting";
  }

  private resolveConceptId(definition: ConceptDefinition): string {
    const providedId = definition.id?.trim();
    if (providedId) {
      return this.ensureUniqueId(this.slugify(providedId));
    }

    const nameId = this.slugify(definition.name);
    const domainSlug = this.slugify(this.domain);
    const base = domainSlug ? `${domainSlug}-${nameId}` : nameId;

    return this.ensureUniqueId(base.length > 0 ? base : "concept");
  }

  private ensureUniqueId(candidate: string): string {
    const base = candidate.length > 0 ? candidate : "concept";
    if (!this.issuedIds.has(base)) {
      this.issuedIds.add(base);
      return base;
    }

    let counter = 2;
    while (this.issuedIds.has(`${base}-${counter}`)) {
      counter += 1;
    }

    const unique = `${base}-${counter}`;
    this.issuedIds.add(unique);
    return unique;
  }

  private getDeduplicationKey(definition: ConceptDefinition): string {
    const idKey = definition.id?.trim().toLowerCase();
    if (idKey && idKey.length > 0) {
      return idKey;
    }

    const nameKey = definition.name?.trim().toLowerCase();
    if (nameKey && nameKey.length > 0) {
      return `${this.domain}:${nameKey}`;
    }

    return "";
  }

  private slugify(value?: string | null): string {
    if (!value) {
      return "";
    }
    return value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’`]/g, "")
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  private createFlexibleRegex(term: string, caseSensitive: boolean): RegExp {
    const escapedParts = term
      .trim()
      .split(/\s+/)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    const pattern = escapedParts.join("[\\s\\-]+");
    const flags = caseSensitive ? "g" : "gi";
    return new RegExp(`\\b${pattern}\\b`, flags);
  }

  private shouldUseCaseSensitiveMatching(term: string): boolean {
    const lettersOnly = term.replace(/[^A-Za-z]/g, "");
    if (lettersOnly.length < 2) {
      return false;
    }

    const hasLetters = /[A-Za-z]/.test(lettersOnly);
    if (!hasLetters) {
      return false;
    }

    const isAllUppercase = lettersOnly === lettersOnly.toUpperCase();
    return isAllUppercase;
  }
}

export default ConceptExtractor;
