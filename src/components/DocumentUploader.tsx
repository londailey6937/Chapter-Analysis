import React, { useRef } from "react";
import mammoth from "mammoth";
import { wmfToPng, getPlaceholderSvg } from "../utils/wmfUtils";
import { AccessLevel, ACCESS_TIERS } from "../../types";

// Helper to detect magic numbers
function detectMimeType(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const headerBytes = bytes.subarray(0, 4);
  const header = Array.from(headerBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  switch (header) {
    case "89504e47":
      return "image/png";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
      return "image/jpeg";
    case "47494638":
      return "image/gif";
    case "52494646":
      return "image/webp"; // RIFF
    case "49492a00":
      return "image/tiff"; // Little-endian
    case "4d4d002a":
      return "image/tiff"; // Big-endian
    case "d7cdc69a":
      return "image/x-wmf"; // WMF
    case "01000900":
      return "image/x-wmf"; // WMF (Standard)
    case "02000900":
      return "image/x-wmf"; // WMF (Standard)
    case "01000000": {
      // Possible EMF (Record Type 1). Check for " EMF" signature at offset 40
      if (bytes.length >= 44) {
        const signature = String.fromCharCode(...bytes.subarray(40, 44));
        if (signature === " EMF") {
          return "image/x-emf";
        }
      }
      return "";
    }
    default:
      if (header.startsWith("424d")) return "image/bmp";
      return ""; // Unknown, rely on extension
  }
}

function base64ToArrayBuffer(base64: string) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export interface UploadedDocumentPayload {
  fileName: string;
  fileType: string;
  format: "html" | "text";
  content: string;
  plainText: string;
  imageCount: number;
}

interface DocumentUploaderProps {
  onDocumentLoad: (payload: UploadedDocumentPayload) => void;
  disabled?: boolean;
  accessLevel?: AccessLevel;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentLoad,
  disabled = false,
  accessLevel = "free",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileType = file.name.split(".").pop()?.toLowerCase() || "";

    try {
      if (fileType === "docx") {
        const sourceBuffer = await file.arrayBuffer();
        const htmlBuffer = sourceBuffer.slice(0);
        const textBuffer = sourceBuffer.slice(0);

        let imageCount = 0;
        const htmlResult = await mammoth.convertToHtml(
          { arrayBuffer: htmlBuffer },
          {
            convertImage: mammoth.images.imgElement((image) => {
              imageCount += 1;
              return image.read("base64").then((base64String) => {
                const buffer = base64ToArrayBuffer(base64String);
                const detectedType = detectMimeType(buffer);

                // Only log for non-WMF images to reduce console noise
                const isWmfType =
                  detectedType === "image/x-wmf" ||
                  detectedType === "image/x-emf" ||
                  image.contentType?.includes("wmf") ||
                  image.contentType?.includes("emf");

                if (!isWmfType) {
                  console.log(
                    `📸 Extracted image ${imageCount}: Declared=${image.contentType}, Detected=${detectedType}, Size=${buffer.byteLength}`
                  );
                }

                // 1. If it's a known web-safe format, render it directly.
                if (
                  [
                    "image/png",
                    "image/jpeg",
                    "image/gif",
                    "image/webp",
                  ].includes(detectedType)
                ) {
                  return {
                    src: `data:${detectedType};base64,${base64String}`,
                    alt: `Embedded image ${imageCount} (${detectedType})`,
                    class: "mammoth-image",
                  };
                }

                // 2. If it's WMF/EMF (detected or declared) OR unknown (likely raw WMF), try conversion.
                const isExplicitWmf =
                  detectedType === "image/x-wmf" ||
                  detectedType === "image/x-emf" ||
                  image.contentType?.includes("wmf") ||
                  image.contentType?.includes("emf");

                // If we don't know what it is, it's often a WMF in disguise (Word does this).
                if (isExplicitWmf || !detectedType) {
                  try {
                    const convertedSrc = wmfToPng(buffer);
                    if (convertedSrc) {
                      return {
                        src: convertedSrc,
                        alt: `Embedded Equation/Image ${imageCount} (Converted)`,
                        class: "mammoth-image wmf-converted",
                      };
                    }
                  } catch (err) {
                    // Silently handle WMF conversion errors (known issue with MathType equations)
                  }

                  // If conversion failed AND it was explicitly WMF, show the error placeholder.
                  // If it was just "unknown", we fall through to the generic handler just in case it's something else.
                  if (isExplicitWmf) {
                    return {
                      src: getPlaceholderSvg("WMF/EMF"),
                      alt: `Embedded Equation/Image ${imageCount} (Conversion Failed)`,
                      class: "mammoth-image wmf-failed",
                    };
                  }
                }

                // 3. Fallback: Trust the declared type or default to PNG.
                // This handles cases where detection failed but the browser might still understand it,
                // or if it's a format we don't have a magic number for yet.
                const finalMime = image.contentType || "image/png";
                return {
                  src: `data:${finalMime};base64,${base64String}`,
                  alt: `Embedded image ${imageCount} (${finalMime})`,
                  class: "mammoth-image",
                };
              });
            }),
          }
        );

        const textResult = await mammoth.extractRawText({
          arrayBuffer: textBuffer,
        });
        const rawHtml = htmlResult.value?.trim() ?? "";
        const plainText = textResult.value?.trim() ?? "";

        // Estimate page count (approximately 350 words per page for textbooks)
        const wordCount = plainText
          .split(/\s+/)
          .filter((w) => w.length > 0).length;
        const estimatedPages = Math.ceil(wordCount / 350);
        const maxPages = ACCESS_TIERS[accessLevel].maxPages;

        // Check page limit
        if (estimatedPages > maxPages) {
          const tierName =
            accessLevel === "free"
              ? "Free (Single Chapter)"
              : accessLevel === "premium"
              ? "Premium (Full Textbook)"
              : "Professional";
          alert(
            `Document too large: ~${estimatedPages} pages detected.\n\n` +
              `Your ${tierName} tier allows up to ${maxPages} pages.\n\n` +
              (accessLevel === "free"
                ? "Free tier: Up to 80 pages (1 generous textbook chapter)\n" +
                  "Premium tier: Up to 600 pages (full textbooks)\n" +
                  "Professional tier: Up to 1,000 pages (multiple books)\n\n" +
                  "Please upgrade or split your document into smaller chapters."
                : accessLevel === "premium"
                ? "Premium tier: Up to 600 pages (typical undergraduate textbook)\n" +
                  "Professional tier: Up to 1,000 pages (reference books, handbooks)\n\n" +
                  "Please upgrade or split your document."
                : "Please split your document into smaller sections.")
          );
          return;
        }

        const fallbackPlainText = rawHtml
          ? rawHtml
              .replace(
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                ""
              )
              .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
              .replace(/<[^>]+>/g, " ")
              .replace(/&nbsp;/g, " ")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&amp;/g, "&")
              .replace(/\s+/g, " ")
              .trim()
          : "";

        if (!rawHtml && !plainText && !fallbackPlainText) {
          throw new Error("No content extracted from DOCX");
        }

        const payload: UploadedDocumentPayload = {
          fileName,
          fileType,
          format: rawHtml ? "html" : "text",
          content: rawHtml || plainText,
          plainText: plainText || fallbackPlainText,
          imageCount,
        };

        console.log(
          `✅ DOCX extracted: ${plainText.length} characters, ${imageCount} image(s)`
        );
        if (imageCount > 0) {
          console.log("📸 HTML content includes images (base64 encoded)");
          // Log first 500 chars of HTML to verify images are embedded
          console.log("HTML preview:", rawHtml.substring(0, 500));
        }
        onDocumentLoad(payload);
      } else if (fileType === "obt") {
        const textContent = await file.text();

        if (!textContent.trim()) {
          alert(
            "Could not extract text from the document. Please try a different file."
          );
          return;
        }

        // Estimate page count (approximately 350 words per page for textbooks)
        const wordCount = textContent
          .split(/\s+/)
          .filter((w) => w.length > 0).length;
        const estimatedPages = Math.ceil(wordCount / 350);
        const maxPages = ACCESS_TIERS[accessLevel].maxPages;

        // Check page limit
        if (estimatedPages > maxPages) {
          const tierName =
            accessLevel === "free"
              ? "Free (Single Chapter)"
              : accessLevel === "premium"
              ? "Premium (Full Textbook)"
              : "Professional";
          alert(
            `Document too large: ~${estimatedPages} pages detected.\n\n` +
              `Your ${tierName} tier allows up to ${maxPages} pages.\n\n` +
              (accessLevel === "free"
                ? "Free tier: Up to 80 pages (1 generous textbook chapter)\n" +
                  "Premium tier: Up to 600 pages (full textbooks)\n" +
                  "Professional tier: Up to 1,000 pages (multiple books)\n\n" +
                  "Please upgrade or split your document into smaller chapters."
                : accessLevel === "premium"
                ? "Premium tier: Up to 600 pages (typical undergraduate textbook)\n" +
                  "Professional tier: Up to 1,000 pages (comprehensive texts)\n\n" +
                  "Please upgrade or split your document."
                : "Please split your document into smaller sections.")
          );
          return;
        }

        const payload: UploadedDocumentPayload = {
          fileName,
          fileType,
          format: "text",
          content: textContent,
          plainText: textContent,
          imageCount: 0,
        };

        console.log(
          `✅ Extracted ${textContent.length} characters from ${fileName}`
        );
        onDocumentLoad(payload);
      } else {
        alert("Please upload a .docx or .obt file");
        return;
      }
    } catch (error) {
      console.error("❌ Error reading document:", error);
      alert("Error reading document. Please try again.");
    }

    // Reset input so the same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.obt"
        onChange={handleFileChange}
        disabled={disabled}
        style={{ display: "none" }}
        id="document-upload-input"
      />
      <label
        htmlFor="document-upload-input"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "white",
          color: disabled ? "#9ca3af" : "#c16659",
          border: disabled ? "1.5px solid #d1d5db" : "1.5px solid #c16659",
          borderRadius: "20px",
          cursor: disabled ? "not-allowed" : "pointer",
          fontWeight: "600",
          fontSize: "14px",
          transition: "all 0.2s",
          opacity: disabled ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "#a54d43";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "#c16659";
          }
        }}
      >
        📄 Upload Document
      </label>
      <div
        style={{
          marginTop: "8px",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        Supported: Word documents (.docx) and Open Library Text (.obt)
      </div>
    </div>
  );
};
