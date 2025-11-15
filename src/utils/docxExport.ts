import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import { ChapterAnalysis, Recommendation } from "@/types";

interface ExportDocxOptions {
  text: string;
  html?: string | null;
  fileName?: string;
  analysis?: ChapterAnalysis | null;
  includeHighlights?: boolean;
}

export const exportToDocx = async ({
  text,
  html,
  fileName = "edited-chapter",
  analysis,
  includeHighlights = true,
}: ExportDocxOptions) => {
  const paragraphs: Paragraph[] = [];

  // Add title
  const safeTitle = sanitizeText(fileName.replace(/\.[^/.]+$/, ""));
  paragraphs.push(
    new Paragraph({
      text: safeTitle || "Edited Chapter",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Add analysis summary if available
  if (analysis && includeHighlights) {
    paragraphs.push(
      new Paragraph({
        text: sanitizeText("Analysis Summary"),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: sanitizeText(`Overall Score: ${analysis.overallScore}/100`),
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
          text: sanitizeText("Spacing Analysis"),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: sanitizeText(`Score: ${spacingPrinciple.score}/100`),
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
                  text: sanitizeText(`• ${detail}`),
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
                text: sanitizeText("Suggestions:"),
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
                    text: sanitizeText(`  → ${suggestionText}`),
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
          text: sanitizeText("Dual Coding Analysis"),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: sanitizeText(`Score: ${dualCodingPrinciple.score}/100`),
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
                  text: sanitizeText(`• ${detail}`),
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
                text: sanitizeText("Suggestions:"),
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
                    text: sanitizeText(`  → ${suggestionText}`),
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
          text: sanitizeText("Key Recommendations:"),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      highPriorityRecs.forEach((rec: Recommendation) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: sanitizeText(`• ${rec.title}: `),
                bold: true,
              }),
              new TextRun({ text: sanitizeText(rec.description || "") }),
            ],
            spacing: { after: 100 },
          })
        );
      });
    }

    paragraphs.push(
      new Paragraph({
        text: sanitizeText("─".repeat(50)),
        spacing: { before: 400, after: 400 },
      })
    );

    paragraphs.push(
      new Paragraph({
        text: sanitizeText("Edited Chapter Text"),
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );
  }

  const contentParagraphs = html?.trim()
    ? await convertHtmlToParagraphs(html.trim())
    : buildPlainTextParagraphs(text, includeHighlights);

  paragraphs.push(...contentParagraphs);

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
  const downloadName = normalizeDocxFileName(fileName);
  saveAs(blob, downloadName);
};

// For importing Packager
import { Packer as Packager } from "docx";

function buildPlainTextParagraphs(
  text: string,
  includeHighlights: boolean
): Paragraph[] {
  const results: Paragraph[] = [];
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

    results.push(
      new Paragraph({
        children: [
          new TextRun({
            text: sanitizeText(trimmedPara),
            size: 24,
          }),
        ],
        spacing: {
          after: needsMoreSpacing ? 400 : 200,
          line: 360,
        },
      })
    );

    if (needsMoreSpacing && includeHighlights) {
      results.push(
        new Paragraph({
          children: [
            new TextRun({
              text: sanitizeText(
                "⚠️ Consider adding more spacing here (topic/section break detected)"
              ),
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

  return results;
}

async function convertHtmlToParagraphs(html: string): Promise<Paragraph[]> {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return buildPlainTextParagraphs(html, false);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const nodes = Array.from(doc.body.childNodes);
  const paragraphs: Paragraph[] = [];

  for (const node of nodes) {
    const converted = await convertNodeToParagraphs(node);
    paragraphs.push(...converted);
  }

  return paragraphs.length > 0
    ? paragraphs
    : buildPlainTextParagraphs(doc.body.textContent || "", false);
}

async function convertNodeToParagraphs(node: ChildNode): Promise<Paragraph[]> {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = collapseWhitespace(node.textContent || "");
    return text ? [createTextParagraph(text)] : [];
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();

  if (tag === "img") {
    const imageParagraph = await createImageParagraph(element);
    return imageParagraph ? [imageParagraph] : [];
  }

  if (tag === "br") {
    return [];
  }

  if (tag === "ul" || tag === "ol") {
    const items = Array.from(element.children).filter(
      (child) => child.tagName.toLowerCase() === "li"
    );
    const paragraphs: Paragraph[] = [];
    for (let index = 0; index < items.length; index += 1) {
      const li = items[index] as HTMLElement;
      const text = collapseWhitespace(li.textContent || "");
      if (text) {
        paragraphs.push(
          createTextParagraph(`${tag === "ol" ? `${index + 1}.` : "•"} ${text}`)
        );
      }
      const images = Array.from(li.querySelectorAll("img"));
      for (const img of images) {
        const imageParagraph = await createImageParagraph(img as HTMLElement);
        if (imageParagraph) {
          paragraphs.push(imageParagraph);
        }
      }
    }
    return paragraphs;
  }

  const paragraphs: Paragraph[] = [];
  let buffer = "";

  const flushBuffer = () => {
    const text = collapseWhitespace(buffer);
    if (text) {
      paragraphs.push(createTextParagraph(text));
    }
    buffer = "";
  };

  for (const child of Array.from(element.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      buffer += child.textContent || "";
      continue;
    }

    if (child.nodeType === Node.ELEMENT_NODE) {
      const childElement = child as HTMLElement;
      const childTag = childElement.tagName.toLowerCase();

      if (childTag === "img") {
        flushBuffer();
        const imageParagraph = await createImageParagraph(childElement);
        if (imageParagraph) {
          paragraphs.push(imageParagraph);
        }
        continue;
      }

      if (childTag === "br") {
        buffer += "\n";
        continue;
      }

      if (isBlockElement(childTag)) {
        flushBuffer();
        const nested = await convertNodeToParagraphs(childElement);
        paragraphs.push(...nested);
        continue;
      }

      const inlineText = collapseWhitespace(childElement.textContent || "");
      if (inlineText) {
        buffer += `${inlineText} `;
      }
    }
  }

  flushBuffer();

  if (!paragraphs.length) {
    const fallbackText = collapseWhitespace(element.textContent || "");
    if (fallbackText) {
      paragraphs.push(createTextParagraph(fallbackText));
    }
  }

  return paragraphs;
}

function createTextParagraph(text: string): Paragraph {
  const safeText = sanitizeText(text);
  return new Paragraph({
    children: [
      new TextRun({
        text: safeText,
        size: 24,
      }),
    ],
    spacing: { after: 200, line: 360 },
  });
}

// eslint-disable-next-line no-control-regex -- strip non-printable control characters Word rejects
const CONTROL_CHAR_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function sanitizeText(value: string | null | undefined): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(CONTROL_CHAR_REGEX, "");
}

function collapseWhitespace(value: string): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/\r\n|\r/g, "\n")
    .split("\n")
    .map((segment) => segment.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((segment) => sanitizeText(segment))
    .join("\n");
}

function isBlockElement(tag: string): boolean {
  return (
    tag === "p" ||
    tag === "div" ||
    tag === "section" ||
    tag === "article" ||
    tag === "blockquote" ||
    tag === "header" ||
    tag === "footer" ||
    tag === "figure" ||
    tag === "h1" ||
    tag === "h2" ||
    tag === "h3" ||
    tag === "h4" ||
    tag === "h5" ||
    tag === "h6"
  );
}

async function createImageParagraph(
  element: HTMLElement
): Promise<Paragraph | null> {
  const src = element.getAttribute("src");
  if (!src) {
    return null;
  }

  const payload = await loadImageData(src);
  if (!payload || payload.data.length === 0) {
    return null;
  }
  const { data, mimeType, byteSignature } = payload;

  const dimensions = await getImageDimensions(src);
  const widthAttribute = parseInt(element.getAttribute("width") || "", 10);
  const heightAttribute = parseInt(element.getAttribute("height") || "", 10);
  const maxWidth = 480;
  const maxHeight = 320;

  const inferredWidth = resolveDimension(
    Number.isNaN(widthAttribute) ? undefined : widthAttribute,
    dimensions?.width,
    maxWidth
  );
  const inferredHeight = resolveDimension(
    Number.isNaN(heightAttribute) ? undefined : heightAttribute,
    dimensions?.height,
    maxHeight
  );

  const aspectRatio =
    inferredWidth && inferredHeight
      ? inferredWidth / inferredHeight
      : maxWidth / maxHeight;

  let finalWidth = Math.min(inferredWidth, maxWidth);
  let finalHeight = finalWidth / aspectRatio;

  if (finalHeight > maxHeight) {
    finalHeight = maxHeight;
    finalWidth = finalHeight * aspectRatio;
  }

  finalWidth = resolveDimension(finalWidth, maxWidth, maxWidth);
  finalHeight = resolveDimension(finalHeight, maxHeight, maxHeight);

  const type = determineImageType({ src, mimeType, byteSignature });

  const imageRun = new ImageRun({
    data,
    transformation: {
      width: finalWidth,
      height: finalHeight,
    },
    ...(type ? { type } : {}),
  });

  return new Paragraph({
    children: [imageRun],
    spacing: { after: 200 },
  });
}

type LoadedImageData = {
  data: Uint8Array;
  mimeType?: string | null;
  byteSignature: Uint8Array;
};

async function loadImageData(src: string): Promise<LoadedImageData | null> {
  try {
    if (src.startsWith("data:")) {
      const { bytes, mimeType } = dataUrlToUint8Array(src) ?? {};
      if (!bytes || !bytes.length) {
        return null;
      }
      return {
        data: bytes,
        mimeType,
        byteSignature: bytes.slice(0, 16),
      };
    }

    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (!bytes.length) {
      return null;
    }
    return {
      data: bytes,
      mimeType: response.headers.get("content-type"),
      byteSignature: bytes.slice(0, 16),
    };
  } catch (error) {
    console.warn("Unable to load image for DOCX export", error);
    return null;
  }
}

async function getImageDimensions(
  src: string
): Promise<{ width: number; height: number } | null> {
  if (typeof Image === "undefined") {
    return null;
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function dataUrlToUint8Array(
  dataUrl: string
): { bytes: Uint8Array; mimeType?: string | null } | null {
  const match = dataUrl.match(/^data:([^;,]+)?;base64,(.+)$/i);
  if (!match) {
    return null;
  }
  const [, mimeType, base64Data] = match;
  if (!base64Data || !base64Data.trim()) {
    return null;
  }

  try {
    const sanitizedBase64 = base64Data.replace(/\s+/g, "").trim();
    const binary = atob(sanitizedBase64);
    if (!binary.length) {
      return null;
    }

    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return { bytes, mimeType };
  } catch (error) {
    console.warn("Invalid base64 data for DOCX export", error);
    return null;
  }
}

type SupportedImageType = "png" | "jpg" | "gif" | "bmp";

function determineImageType({
  src,
  mimeType,
  byteSignature,
}: {
  src: string;
  mimeType?: string | null;
  byteSignature?: Uint8Array;
}): SupportedImageType | undefined {
  const normalizedMime = mimeType?.toLowerCase() ?? "";
  if (normalizedMime.includes("png")) return "png";
  if (normalizedMime.includes("jpeg") || normalizedMime.includes("jpg")) {
    return "jpg";
  }
  if (normalizedMime.includes("gif")) return "gif";
  if (normalizedMime.includes("bmp")) return "bmp";

  const lowerSrc = src.toLowerCase();
  if (/\.png(?:[?#]|$)/.test(lowerSrc)) return "png";
  if (/\.(jpe?g)(?:[?#]|$)/.test(lowerSrc)) return "jpg";
  if (/\.gif(?:[?#]|$)/.test(lowerSrc)) return "gif";
  if (/\.bmp(?:[?#]|$)/.test(lowerSrc)) return "bmp";

  if (byteSignature && byteSignature.length >= 4) {
    if (
      byteSignature[0] === 0x89 &&
      byteSignature[1] === 0x50 &&
      byteSignature[2] === 0x4e &&
      byteSignature[3] === 0x47
    ) {
      return "png";
    }
    if (byteSignature[0] === 0xff && byteSignature[1] === 0xd8) {
      return "jpg";
    }
    if (
      byteSignature[0] === 0x47 &&
      byteSignature[1] === 0x49 &&
      byteSignature[2] === 0x46
    ) {
      return "gif";
    }
    if (byteSignature[0] === 0x42 && byteSignature[1] === 0x4d) {
      return "bmp";
    }
  }

  return undefined;
}

function resolveDimension(
  primary: number | null | undefined,
  secondary: number | null | undefined,
  max: number,
  min = 1
): number {
  const clamp = (value?: number | null) => {
    if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
      return null;
    }
    const bounded = Math.min(value, max);
    const rounded = Math.round(bounded);
    return Math.max(rounded, min);
  };

  return clamp(primary) ?? clamp(secondary) ?? Math.max(min, Math.round(max));
}

function normalizeDocxFileName(fileName: string | null | undefined): string {
  const fallback = "edited-chapter.docx";
  if (!fileName || typeof fileName !== "string") {
    return fallback;
  }

  const trimmed = fileName.trim();
  if (!trimmed) {
    return fallback;
  }

  const sanitized = trimmed.replace(/[<>:"/\\|?*]+/g, "-");
  const hasExtension = sanitized.toLowerCase().endsWith(".docx");
  return hasExtension ? sanitized : `${sanitized}.docx`;
}
