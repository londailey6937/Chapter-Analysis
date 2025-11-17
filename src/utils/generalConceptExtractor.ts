/**
 * General Concept Extractor
 * Extracts key themes and concepts from general content (non-academic)
 * Used when domain is "none" - no domain library required
 */

export interface GeneralConcept {
  id: string;
  term: string;
  frequency: number;
  positions: number[]; // Character positions in text
  context: string; // Surrounding text snippet
  category: "theme" | "entity" | "action" | "descriptor";
}

/**
 * Extract concepts from general content using NLP patterns
 */
export function extractGeneralConcepts(text: string): GeneralConcept[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const concepts: Map<string, GeneralConcept> = new Map();

  // Remove markdown and special characters for processing
  const cleanText = text
    .replace(/[#*_`]/g, "") // Remove markdown
    .replace(/\[WRITER\]|\[CLAUDE\]|\[VISUAL\]/gi, "") // Remove prompt markers
    .toLowerCase();

  // 1. Extract Noun Phrases (2-4 words)
  const nounPhrasePattern = /\b([a-z]+(?:\s+[a-z]+){1,3})\b/g;
  const phrases = cleanText.matchAll(nounPhrasePattern);

  for (const match of phrases) {
    const phrase = match[1];
    const position = match.index || 0;

    // Filter out common phrases and stop words
    if (isSignificantPhrase(phrase)) {
      trackConcept(concepts, phrase, position, text, "theme");
    }
  }

  // 2. Extract Capitalized Terms (proper nouns, entities)
  const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g;
  const entities = text.matchAll(capitalizedPattern);

  for (const match of entities) {
    const entity = match[1].toLowerCase();
    const position = match.index || 0;

    if (isSignificantPhrase(entity)) {
      trackConcept(concepts, entity, position, text, "entity");
    }
  }

  // 3. Extract Action Verbs (key processes)
  const actionPattern =
    /\b(develop|create|implement|manage|analyze|design|build|improve|optimize|enhance|transform|integrate|establish|evaluate|measure|monitor|control|coordinate|facilitate|achieve|maintain|ensure|provide|deliver|execute|plan|organize|lead|support|enable|drive|generate|produce|demonstrate)\w*\b/gi;
  const actions = text.matchAll(actionPattern);

  for (const match of actions) {
    const action = match[0].toLowerCase();
    const position = match.index || 0;
    trackConcept(concepts, action, position, text, "action");
  }

  // 4. Extract Descriptors (key qualities/attributes)
  const descriptorPattern =
    /\b(important|critical|essential|key|primary|fundamental|core|central|vital|crucial|significant|major|principal|main|basic|necessary|effective|efficient|strategic|comprehensive|systematic|sustainable|scalable|innovative|creative|collaborative|integrated|holistic)\b/gi;
  const descriptors = text.matchAll(descriptorPattern);

  for (const match of descriptors) {
    const descriptor = match[0].toLowerCase();
    const position = match.index || 0;
    trackConcept(concepts, descriptor, position, text, "descriptor");
  }

  // Convert to array and sort by frequency
  const conceptArray = Array.from(concepts.values())
    .filter((c) => c.frequency >= 2) // Minimum 2 occurrences
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20); // Top 20 concepts

  return conceptArray;
}

/**
 * Track concept occurrence
 */
function trackConcept(
  concepts: Map<string, GeneralConcept>,
  term: string,
  position: number,
  fullText: string,
  category: GeneralConcept["category"]
): void {
  const key = term.toLowerCase().trim();

  if (concepts.has(key)) {
    const concept = concepts.get(key)!;
    concept.frequency++;
    concept.positions.push(position);
  } else {
    const context = extractContext(fullText, position, term.length);
    concepts.set(key, {
      id: `general-${key.replace(/\s+/g, "-")}`,
      term: key,
      frequency: 1,
      positions: [position],
      context,
      category,
    });
  }
}

/**
 * Extract surrounding context for a concept
 */
function extractContext(
  text: string,
  position: number,
  termLength: number
): string {
  const start = Math.max(0, position - 50);
  const end = Math.min(text.length, position + termLength + 50);
  const snippet = text.substring(start, end);

  return snippet.trim();
}

/**
 * Check if phrase is significant (not a stop phrase)
 */
function isSignificantPhrase(phrase: string): boolean {
  const stopPhrases = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "what",
    "which",
    "who",
    "when",
    "where",
    "why",
    "how",
    "all",
    "each",
    "every",
    "some",
    "any",
    "many",
    "more",
    "most",
    "other",
    "such",
    "no",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "one",
    "two",
    "three",
    "first",
    "last",
    "long",
    "great",
    "little",
    "good",
    "new",
    "old",
    "right",
    "big",
    "high",
    "small",
    "large",
    "next",
    "early",
    "young",
    "few",
    "public",
    "bad",
    "sure",
    "clear",
  ]);

  const words = phrase.toLowerCase().split(/\s+/);

  // Reject if all words are stop words
  if (words.every((w) => stopPhrases.has(w))) {
    return false;
  }

  // Reject very short phrases
  if (phrase.length < 3) {
    return false;
  }

  // Reject if mostly numbers
  if (
    /\d/.test(phrase) &&
    phrase.replace(/[^0-9]/g, "").length > phrase.length / 2
  ) {
    return false;
  }

  return true;
}

/**
 * Get category display info
 */
export function getConceptCategoryInfo(category: GeneralConcept["category"]): {
  icon: string;
  label: string;
  color: string;
} {
  const info = {
    theme: { icon: "💡", label: "Theme", color: "#3b82f6" },
    entity: { icon: "🏷️", label: "Entity", color: "#8b5cf6" },
    action: { icon: "⚡", label: "Action", color: "#f59e0b" },
    descriptor: { icon: "✨", label: "Quality", color: "#10b981" },
  };

  return info[category];
}
