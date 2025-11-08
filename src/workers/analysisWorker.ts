// Web Worker for offloading chapter analysis to avoid blocking UI
import { AnalysisEngine } from "../components/AnalysisEngine";
import type { Chapter } from "@/types";

interface IncomingMessage {
  chapter: Chapter;
}

self.onmessage = async (evt: MessageEvent<IncomingMessage>) => {
  const { chapter } = evt.data;
  // Basic staged progress notifications
  (self as any).postMessage({ type: "progress", step: "received", detail: "Chapter received by worker" });
  try {
    (self as any).postMessage({ type: "progress", step: "analysis-start", detail: "Starting analysis pipeline" });
    const result = await AnalysisEngine.analyzeChapter(chapter);
    (self as any).postMessage({ type: "progress", step: "analysis-complete", detail: "Analysis complete" });
    (self as any).postMessage({ type: "complete", result });
  } catch (err) {
    (self as any).postMessage({ type: "error", message: err instanceof Error ? err.message : String(err) });
  }
};

export {}; // ensure this is treated as a module