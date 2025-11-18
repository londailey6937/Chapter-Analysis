import * as WMFModule from "wmf";

// Handle different import styles (CommonJS vs ESM)
const WMF = (WMFModule as any).default || WMFModule;

export function wmfToPng(buffer: ArrayBuffer): string | null {
  try {
    if (typeof window === "undefined") {
      return null; // Server-side not supported for canvas
    }

    console.log("WMF Module:", WMF);

    if (!WMF || !WMF.image_size || !WMF.draw_canvas) {
      console.error("WMF library not loaded correctly", WMF);
      return null;
    }

    const data = new Uint8Array(buffer);
    const size = WMF.image_size(data);

    if (!size || size.length < 2) {
      console.warn("Could not determine WMF size");
      return null;
    }

    const width = size[0];
    const height = size[1];

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    WMF.draw_canvas(data, canvas);

    return canvas.toDataURL("image/png");
  } catch (e) {
    console.error("WMF conversion error:", e);
    return null;
  }
}

export function getPlaceholderSvg(type: string): string {
  const width = 300;
  const height = 50;
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#fff4e5" stroke="#c16659" stroke-width="1"/>
  <text x="50%" y="50%" font-family="sans-serif" font-size="12" fill="#c16659" text-anchor="middle" dy=".3em">
    ⚠️ ${type} format (Conversion Failed)
  </text>
</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
