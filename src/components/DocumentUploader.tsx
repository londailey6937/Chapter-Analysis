import React, { useRef } from "react";
import mammoth from "mammoth";

interface DocumentUploaderProps {
  onDocumentLoad: (text: string, fileName: string, fileType: string) => void;
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
      let extractedText = "";

      if (fileType === "docx") {
        // Extract ONLY plain text - no HTML at all
        const arrayBuffer = await file.arrayBuffer();

        // Use mammoth to get plain text directly
        const textResult = await mammoth.extractRawText({ arrayBuffer });
        const plainText = textResult.value;

        console.log(
          `✅ Extracted from DOCX: ${plainText.length} chars plain text`
        );
        console.log("  Plain text preview:", plainText.substring(0, 200));

        if (plainText.trim()) {
          // Just pass plain text - no JSON, no HTML
          onDocumentLoad(plainText, file.name, "docx");
        } else {
          throw new Error("No content extracted from DOCX");
        }
        return;
      } else if (
        fileType === "md" ||
        fileType === "txt" ||
        fileType === "html" ||
        fileType === "htm" ||
        fileType === "obt"
      ) {
        // Read plain text/markdown/HTML/OBT
        extractedText = await file.text();
      } else {
        alert("Please upload a .docx, .md, .txt, .html, or .obt file");
        return;
      }

      if (!extractedText.trim()) {
        alert(
          "Could not extract text from the document. Please try a different file."
        );
        return;
      }

      console.log(
        `✅ Extracted ${extractedText.length} characters from ${fileName}`
      );
      onDocumentLoad(extractedText, fileName, fileType);
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
        accept=".docx,.md,.txt,.html,.htm,.obt"
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
        Supported: Word documents, Markdown, Plain text, HTML, Open Library Text
      </div>
    </div>
  );
};
