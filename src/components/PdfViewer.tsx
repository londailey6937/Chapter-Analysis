import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  ScrollMode,
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PdfViewerProps {
  fileBuffer: ArrayBuffer;
  currentPage?: number; // 1-based
  onPageChange?: (page: number) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  fileBuffer,
  currentPage,
}) => {
  // Create plugins
  const pageNavigationPluginInstance = useRef(pageNavigationPlugin());
  const defaultLayoutPluginInstance = useRef(defaultLayoutPlugin());

  // Memoize plugins array to prevent re-creating on every render
  const plugins = useMemo(
    () => [
      pageNavigationPluginInstance.current,
      defaultLayoutPluginInstance.current,
    ],
    []
  );

  // Manage blobUrl with useState/useEffect for cleanup
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!fileBuffer) {
      setBlobUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(
      new Blob([fileBuffer], { type: "application/pdf" })
    );
    setBlobUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [fileBuffer]);

  // Track when PDF is loaded
  const [pdfLoaded, setPdfLoaded] = useState(false);

  // Store pending page to jump to after document loads
  const pendingPageRef = useRef<number | null>(null);

  // Ref to the viewer container for manual scrolling
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Only jump to page when PDF is loaded and currentPage changes
  useEffect(() => {
    console.log(
      "🔄 [PdfViewer useEffect] currentPage:",
      currentPage,
      "pdfLoaded:",
      pdfLoaded
    );
    if (typeof currentPage === "number" && currentPage > 0 && pdfLoaded) {
      console.log("✈️ [PdfViewer] Jumping to page:", currentPage);

      // Small delay to ensure PDF is fully rendered
      const timer = setTimeout(() => {
        const plugin = pageNavigationPluginInstance.current;
        if (plugin?.jumpToPage) {
          console.log(
            "🚀 [PdfViewer] Calling jumpToPage with:",
            currentPage - 1
          );
          plugin.jumpToPage(currentPage - 1);
          console.log("✅ [PdfViewer] jumpToPage called");
        } else {
          console.error("❌ [PdfViewer] jumpToPage not available");
        }
      }, 100);

      return () => clearTimeout(timer);
    } else if (typeof currentPage === "number" && currentPage > 0) {
      // Store the page to jump to once loaded
      console.log("⏳ [PdfViewer] Storing pending page:", currentPage);
      pendingPageRef.current = currentPage;
    }
  }, [currentPage, pdfLoaded]);

  if (!blobUrl) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        No PDF loaded.
      </div>
    );
  }

  return (
    <div ref={viewerContainerRef} style={{ height: "80vh", width: "100%" }}>
      <Worker workerUrl="/pdf.worker.js">
        <Viewer
          fileUrl={blobUrl}
          defaultScale={SpecialZoomLevel.PageFit}
          scrollMode={ScrollMode.Vertical}
          plugins={plugins}
          onDocumentLoad={() => {
            setPdfLoaded(true);
            console.log(
              "📖 [PdfViewer] Document loaded, current page:",
              currentPage
            );
          }}
        />
      </Worker>
    </div>
  );
};
