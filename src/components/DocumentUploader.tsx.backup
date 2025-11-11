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
        // Extract text from DOCX with embedded images
        const arrayBuffer = await file.arrayBuffer();

        // Get HTML with embedded base64 images
        let imageCount = 0;
        const htmlResult = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            convertImage: mammoth.images.imgElement((image) => {
              imageCount++;
              console.log(`📷 Processing image ${imageCount}`);
              return image.read("base64").then((imageBuffer) => {
                // Embed actual base64 image
                const dataUrl = `data:${image.contentType};base64,${imageBuffer}`;
                return {
                  src: dataUrl,
                  alt: `Image ${imageCount}`,
                };
              });
            }),
          }
        );

        // Use the HTML directly with embedded images
        extractedText = htmlResult.value;

        console.log(`✅ Extracted ${imageCount} images with base64 data`);
        console.log(`� HTML length: ${extractedText.length} characters`);
        console.log(`� Contains img tags: ${extractedText.includes("<img")}`);

        if (extractedText.trim()) {
          onDocumentLoad(extractedText, file.name, "docx");
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
        📄 Upload Document (.docx, .md, .txt, .html, .obt)
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
