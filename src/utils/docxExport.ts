import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
} from "docx";
import { saveAs } from "file-saver";
import { ChapterAnalysis, Recommendation } from "@/types";

interface ExportDocxOptions {
  text: string;
  fileName?: string;
  analysis?: ChapterAnalysis | null;
  includeHighlights?: boolean;
}

export const exportToDocx = async ({
  text,
  fileName = "edited-chapter",
  analysis,
  includeHighlights = true,
}: ExportDocxOptions) => {
  const paragraphs: Paragraph[] = [];

  // Add title
  paragraphs.push(
    new Paragraph({
      text: fileName.replace(/\.[^/.]+$/, ""), // Remove extension
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Add analysis summary if available
  if (analysis && includeHighlights) {
    paragraphs.push(
      new Paragraph({
        text: "Analysis Summary",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Overall Score: ${analysis.overallScore}/100`,
            bold: true,
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    // Add high-priority recommendations
    const highPriorityRecs = analysis.recommendations
      ?.filter((rec: Recommendation) => rec.priority === "high")
      .slice(0, 3);

    if (highPriorityRecs && highPriorityRecs.length > 0) {
      paragraphs.push(
        new Paragraph({
          text: "Key Recommendations:",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      highPriorityRecs.forEach((rec: Recommendation) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${rec.title}: `,
                bold: true,
              }),
              new TextRun(rec.description),
            ],
            spacing: { after: 100 },
          })
        );
      });
    }

    paragraphs.push(
      new Paragraph({
        text: "─".repeat(50),
        spacing: { before: 400, after: 400 },
      })
    );

    paragraphs.push(
      new Paragraph({
        text: "Edited Chapter Text",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );
  }

  // Split text into paragraphs and detect spacing issues
  const textParagraphs = text.split(/\n\n+/);

  textParagraphs.forEach((para, index) => {
    const trimmedPara = para.trim();
    if (!trimmedPara) return;

    const nextPara = textParagraphs[index + 1]?.trim();
    const currentLength = trimmedPara.length;
    const needsMoreSpacing =
      nextPara &&
      ((currentLength > 500 && nextPara.length > 500) ||
        (currentLength < 100 && nextPara.length > 200) ||
        (/[.!?]$/.test(trimmedPara) && nextPara.match(/^[A-Z]/)));

    // Add the paragraph
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: trimmedPara,
            size: 24, // 12pt
          }),
        ],
        spacing: {
          after: needsMoreSpacing ? 400 : 200, // More space if needed
          line: 360, // 1.5 line spacing
        },
      })
    );

    // Add spacing recommendation comment if needed
    if (needsMoreSpacing && includeHighlights) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "⚠️ Consider adding more spacing here (topic/section break detected)",
              color: "F59E0B",
              italics: true,
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }
  });

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  // Generate and download
  const blob = await Packager.toBlob(doc);
  saveAs(blob, `${fileName}.docx`);
};

// For importing Packager
import { Packer as Packager } from "docx";
