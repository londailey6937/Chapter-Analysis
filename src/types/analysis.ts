export * from "../../types";

export interface BlockingSegment {
  startPosition: number;
  endPosition: number;
  conceptId: string;
  length: number;
  issue: string;
}

export interface ConceptPattern {
  conceptId: string;
  mentions: number[];
  spacing: number[];
  averageSpacing: number;
  isWellSpaced: boolean;
}

export interface ReviewPattern {
  conceptId: string;
  reviewPoints: number[];
  idealSpacing: number[];
  score: number;
}
