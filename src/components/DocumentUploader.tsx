import React, { useRef } from "react";
import mammoth from "mammoth";

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
              return image.read("base64").then((imageBuffer) => ({
                src: `data:${image.contentType};base64,${imageBuffer}`,
                alt: `Embedded image ${imageCount}`,
              }));
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
          backgroundColor: disabled ? "#9ca3af" : "#3b82f6",
          color: "white",
          borderRadius: "8px",
          cursor: disabled ? "not-allowed" : "pointer",
          fontWeight: "600",
          fontSize: "14px",
          transition: "all 0.2s",
          opacity: disabled ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = "#3b82f6";
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
