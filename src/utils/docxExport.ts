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

    // Add Spacing and Dual Coding principle details
    const principleScores = (analysis as any).principleScores || [];
    const principles = analysis.principles || [];

    const spacingPrinciple =
      principleScores.find(
        (p: any) =>
          p.principleId === "spacing" ||
          p.principle?.toLowerCase().includes("spacing")
      ) || principles.find((p) => p.principle === "spacedRepetition");
    const dualCodingPrinciple =
      principleScores.find(
        (p: any) =>
          p.principleId === "dualCoding" ||
          p.principle?.toLowerCase().includes("dual coding")
      ) || principles.find((p) => p.principle === "dualCoding");

    if (spacingPrinciple) {
      paragraphs.push(
        new Paragraph({
          text: "Spacing Analysis",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Score: ${spacingPrinciple.score}/100`,
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        })
      );

      // Handle both PrincipleScore (details) and PrincipleEvaluation (findings) types
      const details =
        (spacingPrinciple as any).details ||
        (spacingPrinciple as any).findings?.map((f: any) => f.message) ||
        [];

      if (details.length > 0) {
        details.forEach((detail: string) => {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${detail}`,
                }),
              ],
              spacing: { after: 80 },
            })
          );
        });
      }

      const suggestions = (spacingPrinciple as any).suggestions || [];

      if (suggestions.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Suggestions:",
                bold: true,
                italics: true,
              }),
            ],
            spacing: { before: 100, after: 80 },
          })
        );

        suggestions.forEach((suggestion: any) => {
          const suggestionText =
            typeof suggestion === "string"
              ? suggestion
              : suggestion.text || suggestion.message || "";
          if (suggestionText) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `  → ${suggestionText}`,
                    color: "2563EB",
                  }),
                ],
                spacing: { after: 80 },
              })
            );
          }
        });
      }
    }

    if (dualCodingPrinciple) {
      paragraphs.push(
        new Paragraph({
          text: "Dual Coding Analysis",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Score: ${dualCodingPrinciple.score}/100`,
              bold: true,
            }),
          ],
          spacing: { after: 100 },
        })
      );

      // Handle both PrincipleScore (details) and PrincipleEvaluation (findings) types
      const dcDetails =
        (dualCodingPrinciple as any).details ||
        (dualCodingPrinciple as any).findings?.map((f: any) => f.message) ||
        [];

      if (dcDetails.length > 0) {
        dcDetails.forEach((detail: string) => {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${detail}`,
                }),
              ],
              spacing: { after: 80 },
            })
          );
        });
      }

      const dcSuggestions = (dualCodingPrinciple as any).suggestions || [];

      if (dcSuggestions.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Suggestions:",
                bold: true,
                italics: true,
              }),
            ],
            spacing: { before: 100, after: 80 },
          })
        );

        dcSuggestions.forEach((suggestion: any) => {
          const suggestionText =
            typeof suggestion === "string"
              ? suggestion
              : suggestion.text || suggestion.message || "";
          if (suggestionText) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `  → ${suggestionText}`,
                    color: "2563EB",
                  }),
                ],
                spacing: { after: 80 },
              })
            );
          }
        });
      }
    }

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
