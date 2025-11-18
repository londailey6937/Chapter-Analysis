import React, { useRef } from "react";
import mammoth from "mammoth";
import { wmfToPng, getPlaceholderSvg } from "../utils/wmfUtils";

// Helper to detect magic numbers
function detectMimeType(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer).subarray(0, 4);
  const header = Array.from(bytes)
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
      return "image/x-wmf"; // WMF (another variant)
    default:
      return ""; // Unknown, rely on extension
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
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
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentLoad,
  disabled = false,
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
              return image.read("arraybuffer").then((buffer) => {
                const detectedType = detectMimeType(buffer);
                const contentType =
                  detectedType || image.contentType || "image/png";

                console.log(
                  `📸 Extracted image ${imageCount}: Declared=${image.contentType}, Detected=${detectedType}, Final=${contentType}, Size=${buffer.byteLength}`
                );

                // Handle WMF/EMF (Windows Metafiles - common for equations)
                if (
                  contentType === "image/x-wmf" ||
                  contentType === "image/x-emf" ||
                  contentType.includes("wmf") ||
                  contentType.includes("emf")
                ) {
                  const convertedSrc = wmfToPng(buffer);
                  if (convertedSrc) {
                    console.log(`✅ Converted WMF image ${imageCount} to PNG`);
                    return {
                      src: convertedSrc,
                      alt: `Embedded Equation/Image ${imageCount} (Converted from WMF)`,
                      class: "mammoth-image wmf-converted",
                    };
                  } else {
                    console.warn(
                      `⚠️ Failed to convert WMF image ${imageCount}`
                    );
                    return {
                      src: getPlaceholderSvg("WMF/EMF"),
                      alt: `Embedded Equation/Image ${imageCount} (WMF - Conversion Failed)`,
                      class: "mammoth-image wmf-failed",
                    };
                  }
                }

                // Standard handling for supported images
                const base64 = arrayBufferToBase64(buffer);
                return {
                  src: `data:${contentType};base64,${base64}`,
                  alt: `Embedded image ${imageCount} (${contentType})`,
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
