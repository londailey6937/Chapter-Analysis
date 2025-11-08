// Web Worker for offloading chapter analysis to avoid blocking UI
import { AnalysisEngine } from "../components/AnalysisEngine";
import type { Chapter } from "@/types";
import type { Domain, ConceptDefinition } from "@/data/conceptLibraryRegistry";

interface IncomingMessage {
  chapter: Chapter;
  domain?: Domain;
  includeCrossDomain?: boolean;
  customConcepts?: ConceptDefinition[];
}

self.onmessage = async (evt: MessageEvent<IncomingMessage>) => {
  const {
    chapter,
    domain = "chemistry",
    includeCrossDomain = true,
    customConcepts = [],
  } = evt.data;

  // Progress reporting function
  const reportProgress = (step: string, detail?: string) => {
    console.log(
      `[Worker] Reporting progress - Step: ${step}, Detail: ${detail}`
    );
    (self as any).postMessage({ type: "progress", step, detail });
  };

  reportProgress("received", "Chapter received by worker");

  try {
    reportProgress("analysis-start", "Starting analysis pipeline");

    // Yield control to prevent blocking - use real delay for UI updates
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Run analysis with progress callbacks and domain parameters
    const result = await AnalysisEngine.analyzeChapter(
      chapter,
      reportProgress,
      domain,
      includeCrossDomain,
      customConcepts
    );

    reportProgress("analysis-complete", "Analysis complete");
    (self as any).postMessage({ type: "complete", result });
  } catch (err) {
    console.error("[Worker] Analysis error:", err);
    (self as any).postMessage({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

export {}; // ensure this is treated as a module
