// Web Worker for offloading chapter analysis to avoid blocking UI
import { AnalysisEngine } from "../components/AnalysisEngine";
import type { Chapter } from "@/types";

interface IncomingMessage {
  chapter: Chapter;
}

self.onmessage = async (evt: MessageEvent<IncomingMessage>) => {
  const { chapter } = evt.data;

  // Progress reporting function
  const reportProgress = (step: string, detail?: string) => {
    (self as any).postMessage({ type: "progress", step, detail });
  };

  reportProgress("received", "Chapter received by worker");

  try {
    reportProgress("analysis-start", "Starting analysis pipeline");

    // Yield control to prevent blocking
    await new Promise((resolve) => setTimeout(resolve, 0));

    reportProgress(
      "extracting-concepts",
      "Extracting concepts and relationships"
    );

    // Run analysis with progress callbacks
    const result = await AnalysisEngine.analyzeChapter(chapter, reportProgress);

    reportProgress("analysis-complete", "Analysis complete");
    (self as any).postMessage({ type: "complete", result });
  } catch (err) {
    (self as any).postMessage({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

export {}; // ensure this is treated as a module
