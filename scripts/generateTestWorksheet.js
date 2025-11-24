import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  VerticalAlign,
  WidthType,
  convertInchesToTwip,
} from "docx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Brand colors
const TOME_ORANGE = "EF8432";
const TOME_NAVY = "2C3E50";

function createTestWorksheet() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "Tome IQ Testing Worksheet",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "Tome IQ Testing Worksheet",
                bold: true,
                size: 32,
                color: TOME_NAVY,
              }),
            ],
          }),

          // Subtitle
          new Paragraph({
            text: "Comprehensive Feature Evaluation Guide",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: "Comprehensive Feature Evaluation Guide",
                size: 24,
                color: "666666",
                italics: true,
              }),
            ],
          }),

          // Introduction
          new Paragraph({
            text: "Purpose",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            text: "This worksheet provides a systematic approach to testing all features of the Tome IQ application. Use this document to verify functionality, identify bugs, and ensure quality across all tiers and workflows.",
            spacing: { after: 300 },
          }),

          // Tester Information Section
          new Paragraph({
            text: "Tester Information",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          ...createInfoFields([
            "Tester Name: _______________________________",
            "Date: _______________________________",
            "App Version/Build: _______________________________",
            "Browser: _______________________________",
            "Operating System: _______________________________",
          ]),

          // Section 1: Initial Setup & UI
          new Paragraph({
            text: "Section 1: Initial Setup & User Interface",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 1: Initial Setup & User Interface",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "1.1 Application Launch",
              tests: [
                "Application loads without errors",
                "All fonts load correctly (Inter font family)",
                "Brand colors display correctly (Tome Orange #EF8432, Navy #2C3E50)",
                "No console errors in browser developer tools",
                "Page is responsive and looks good on different screen sizes",
              ],
            },
            {
              category: "1.2 Navigation & Header",
              tests: [
                "Header displays with Tome IQ logo/title",
                "Navigation menu button opens and closes smoothly",
                "Help button (?) opens help modal",
                "Reference Library button opens documentation",
                "All modal overlays display correctly",
                "Modals close when clicking outside or on close button",
              ],
            },
            {
              category: "1.3 Color Palette Consistency",
              tests: [
                "Main cards use cream background (#FEF5E7)",
                "Hover states use tan (#F7E6D0)",
                "Primary borders use tan (#E0C392)",
                "Primary CTAs use Tome Orange (#EF8432)",
                "Text is readable with proper contrast ratios",
              ],
            },
          ]),

          // Section 2: Document Upload
          new Paragraph({
            text: "Section 2: Document Upload & Input",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 2: Document Upload & Input",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "2.1 File Upload",
              tests: [
                "DOCX files upload successfully",
                "OBT files upload successfully",
                "File content extracts correctly with formatting preserved",
                "Images from DOCX are handled appropriately",
                "Tables and lists format correctly",
                "Error message displays for unsupported file types",
                "Large files (>5000 words for free tier) trigger appropriate messages",
              ],
            },
            {
              category: "2.2 Text Input",
              tests: [
                "Text can be pasted into textarea",
                "Word counter updates in real-time",
                "Word counter shows correct status (red if <200 words)",
                "Character formatting is preserved when pasting",
                "Clear button removes all text",
              ],
            },
            {
              category: "2.3 Domain Selection",
              tests: [
                "Domain dropdown displays all available domains",
                "Auto-detection works for sample content",
                "'None / General Content' option is available",
                "Selected domain persists during analysis",
                "Domain can be manually changed before analysis",
              ],
            },
          ]),

          // Section 3: Analysis Features
          new Paragraph({
            text: "Section 3: Analysis Features",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 3: Analysis Features",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "3.1 Free Tier Analysis",
              tests: [
                "Spacing & Pacing analysis runs successfully",
                "Dual-Coding suggestions generate correctly",
                "Color-coded pills appear in document",
                "Sidebar displays analysis cards",
                "Paragraph-by-paragraph breakdown is accurate",
                "Compact/Balanced/Extended paragraphs are identified",
                "Visual opportunity suggestions (diagrams, flowcharts) make sense",
              ],
            },
            {
              category: "3.2 Premium Features (if unlocked)",
              tests: [
                "All 10 learning principles are evaluated",
                "Overall pedagogical score displays (0-100)",
                "Each principle shows individual score and findings",
                "Concept extraction identifies key terms",
                "Concept relationships display correctly",
                "Cognitive load analysis provides insights",
                "Recommendations are specific and actionable",
              ],
            },
            {
              category: "3.3 Analysis Accuracy",
              tests: [
                "Domain detection is accurate (requires 40+ concept matches)",
                "False positives are minimized",
                "Spacing indicators match paragraph length appropriately",
                "Dual-coding suggestions are relevant to content",
                "Analysis completes within reasonable time (<30 seconds)",
              ],
            },
          ]),

          // Section 4: Writer Mode
          new Paragraph({
            text: "Section 4: Writer Mode (Professional Tier)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 4: Writer Mode (Professional Tier)",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "4.1 Editor Functionality",
              tests: [
                "Rich text formatting works (bold, italic, underline)",
                "Headings (H1, H2, H3) format correctly",
                "Lists (bullet and numbered) create properly",
                "Links can be inserted and edited",
                "Images can be uploaded and pasted",
                "Tables can be created and edited",
                "Keyboard shortcuts work (Cmd/Ctrl+B, I, U, K, F, Z)",
              ],
            },
            {
              category: "4.2 Live Analysis Indicators",
              tests: [
                "Spacing indicators appear inline as you type",
                "Dual-coding callouts display in correct positions",
                "Indicators update dynamically with edits",
                "Focus mode hides indicators correctly",
                "Indicators don't interfere with editing",
              ],
            },
            {
              category: "4.3 AI Template Generation",
              tests: [
                "[WRITER] prompts generate structured templates",
                "[CLAUDE] prompts provide AI-powered content suggestions",
                "[VISUAL] prompts suggest appropriate visualizations",
                "Generated templates format correctly in editor",
                "Templates can be edited after generation",
              ],
            },
            {
              category: "4.4 Auto-Save System",
              tests: [
                "Document saves automatically on every edit",
                "Auto-save status indicator updates",
                "Content restores on page reload",
                "'Auto-save info' button displays save status",
                "No data loss during editing sessions",
              ],
            },
          ]),

          // Section 5: Export Features
          new Paragraph({
            text: "Section 5: Export Features (Premium/Professional)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 5: Export Features (Premium/Professional)",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "5.1 HTML Export",
              tests: [
                "Export HTML button downloads file successfully",
                "HTML file opens in browser correctly",
                "All formatting is preserved",
                "Analysis indicators appear in exported HTML",
                "Styling matches application appearance",
                "Images export correctly",
              ],
            },
            {
              category: "5.2 DOCX Export",
              tests: [
                "Export DOCX button downloads file successfully",
                "DOCX opens in Microsoft Word/Google Docs",
                "Text formatting is preserved",
                "Analysis indicators convert to appropriate DOCX elements",
                "Images export with document",
                "Tables and lists format correctly",
              ],
            },
            {
              category: "5.3 JSON Export",
              tests: [
                "Export JSON downloads valid JSON file",
                "JSON contains all analysis data",
                "Data structure is complete and accurate",
                "File can be parsed without errors",
              ],
            },
          ]),

          // Section 6: Concept Library & Custom Domains
          new Paragraph({
            text: "Section 6: Concept Library & Custom Domains",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 6: Concept Library & Custom Domains",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "6.1 Reference Library",
              tests: [
                "Reference Library modal opens from navigation",
                "All built-in domains display with concept counts",
                "Domain categories are organized logically",
                "Tier information displays correctly (Free/Premium/Professional)",
                "Links and documentation are accessible",
              ],
            },
            {
              category: "6.2 Custom Domains (Professional Tier)",
              tests: [
                "Custom domain creation interface is accessible",
                "New domains can be added with concepts",
                "Custom domains appear in domain selector",
                "Custom domain concepts are used in analysis",
                "Custom domains can be edited and deleted",
              ],
            },
            {
              category: "6.3 General Content Handling",
              tests: [
                "General Concept Generator works for 'None' domain",
                "Extracts Themes, Entities, Actions, Qualities",
                "Click-to-navigate works for general concepts",
                "Frequency counts are accurate",
                "Works for meditation, creative writing, essays",
              ],
            },
          ]),

          // Section 7: User Experience
          new Paragraph({
            text: "Section 7: User Experience & Performance",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 7: User Experience & Performance",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "7.1 Performance",
              tests: [
                "Application loads quickly (<3 seconds)",
                "Analysis completes in reasonable time",
                "No lag when typing in editor",
                "Smooth scrolling throughout application",
                "Large documents (20+ pages) don't cause crashes",
              ],
            },
            {
              category: "7.2 Accessibility",
              tests: [
                "Keyboard navigation works throughout app",
                "Tab order is logical",
                "Focus indicators are visible",
                "Color contrast meets WCAG standards",
                "Screen reader compatibility (if applicable)",
              ],
            },
            {
              category: "7.3 Error Handling",
              tests: [
                "Clear error messages for invalid inputs",
                "Network errors are handled gracefully",
                "File upload errors provide helpful feedback",
                "Analysis errors don't crash the application",
                "User can recover from errors without reloading",
              ],
            },
            {
              category: "7.4 Responsive Design",
              tests: [
                "Works on desktop (1920x1080+)",
                "Works on laptop (1366x768)",
                "Works on tablet (768x1024)",
                "Layout adapts appropriately to screen size",
                "Touch interactions work on mobile devices (if supported)",
              ],
            },
          ]),

          // Section 8: Authentication & Tiers
          new Paragraph({
            text: "Section 8: Authentication & Tier Management",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 8: Authentication & Tier Management",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "8.1 User Authentication (if enabled)",
              tests: [
                "Sign up process works correctly",
                "Login process works correctly",
                "Logout works and clears session",
                "Password reset email is sent",
                "User profile displays correctly",
              ],
            },
            {
              category: "8.2 Tier Restrictions",
              tests: [
                "Free tier shows correct feature limitations",
                "Premium tier unlocks appropriate features",
                "Professional tier unlocks all features",
                "Upgrade prompts display for locked features",
                "Tier badge displays correctly in UI",
              ],
            },
            {
              category: "8.3 Payment Integration (if enabled)",
              tests: [
                "Stripe checkout loads correctly",
                "Payment processing completes successfully",
                "Tier upgrades immediately after payment",
                "Receipt email is sent",
                "Subscription management works",
              ],
            },
          ]),

          // Section 9: Edge Cases & Stress Testing
          new Paragraph({
            text: "Section 9: Edge Cases & Stress Testing",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 9: Edge Cases & Stress Testing",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "9.1 Edge Cases",
              tests: [
                "Very short text (<100 words) handles appropriately",
                "Very long text (50,000+ words) doesn't crash",
                "Special characters and unicode display correctly",
                "Empty document upload shows appropriate message",
                "Corrupted file upload handles gracefully",
                "Multiple rapid clicks don't cause issues",
              ],
            },
            {
              category: "9.2 Browser Compatibility",
              tests: [
                "Works in Chrome (latest)",
                "Works in Firefox (latest)",
                "Works in Safari (latest)",
                "Works in Edge (latest)",
                "Graceful degradation in older browsers",
              ],
            },
            {
              category: "9.3 Data Persistence",
              tests: [
                "Analysis results persist during session",
                "Auto-saved content survives browser refresh",
                "User preferences are remembered",
                "No data loss on network interruption",
              ],
            },
          ]),

          // Section 10: Documentation & Help
          new Paragraph({
            text: "Section 10: Documentation & Help Resources",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Section 10: Documentation & Help Resources",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createTestItems([
            {
              category: "10.1 In-App Help",
              tests: [
                "Help modal opens and displays correctly",
                "Quick Start Guide is clear and accurate",
                "Feature descriptions match actual functionality",
                "Examples are helpful and relevant",
                "Troubleshooting section addresses common issues",
              ],
            },
            {
              category: "10.2 External Documentation",
              tests: [
                "README.md is comprehensive and up-to-date",
                "Technical documentation is accurate",
                "API references are complete (if applicable)",
                "Setup instructions work as written",
              ],
            },
          ]),

          // Bug Report Section
          new Paragraph({
            text: "Bug Report Template",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Bug Report Template",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          new Paragraph({
            text: "Use this template to document any bugs found during testing:",
            spacing: { after: 200 },
          }),

          ...createBugReportTemplate(),

          // Overall Assessment
          new Paragraph({
            text: "Overall Assessment",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Overall Assessment",
                bold: true,
                color: TOME_ORANGE,
              }),
            ],
          }),

          ...createAssessmentSection(),

          // Footer
          new Paragraph({
            text: "End of Testing Worksheet",
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            children: [
              new TextRun({
                text: "End of Testing Worksheet",
                italics: true,
                color: "999999",
              }),
            ],
          }),

          new Paragraph({
            text: "Thank you for your thorough testing!",
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "Thank you for your thorough testing!",
                italics: true,
                color: "999999",
              }),
            ],
          }),
        ],
      },
    ],
  });

  return doc;
}

function createInfoFields(fields) {
  return fields.map(
    (field) =>
      new Paragraph({
        text: field,
        spacing: { after: 100 },
      })
  );
}

function createTestItems(sections) {
  const paragraphs = [];

  sections.forEach((section) => {
    // Category heading
    paragraphs.push(
      new Paragraph({
        text: section.category,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: section.category,
            bold: true,
            size: 22,
          }),
        ],
      })
    );

    // Test items with checkboxes
    section.tests.forEach((test) => {
      paragraphs.push(
        new Paragraph({
          text: `☐ ${test}`,
          spacing: { after: 100 },
          bullet: {
            level: 0,
          },
        })
      );
    });
  });

  return paragraphs;
}

function createBugReportTemplate() {
  const fields = [
    "Bug ID/Number: _______________________________",
    "",
    "Bug Title: _______________________________",
    "",
    "Severity: ☐ Critical  ☐ High  ☐ Medium  ☐ Low",
    "",
    "Steps to Reproduce:",
    "1. _______________________________",
    "2. _______________________________",
    "3. _______________________________",
    "",
    "Expected Result: _______________________________",
    "",
    "Actual Result: _______________________________",
    "",
    "Screenshots/Videos: _______________________________",
    "",
    "Additional Notes: _______________________________",
    "",
    "Status: ☐ Open  ☐ In Progress  ☐ Resolved  ☐ Closed",
    "",
    "─────────────────────────────────────────────────",
    "",
  ];

  return fields.map(
    (field) =>
      new Paragraph({
        text: field,
        spacing: { after: field === "" ? 50 : 100 },
      })
  );
}

function createAssessmentSection() {
  return [
    new Paragraph({
      text: "Overall Quality Rating:",
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Overall Quality Rating:",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      text: "☐ Excellent  ☐ Good  ☐ Fair  ☐ Needs Improvement",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Strengths:",
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Strengths:",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Areas for Improvement:",
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Areas for Improvement:",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Critical Issues:",
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Critical Issues:",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Recommendations:",
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Recommendations:",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "_________________________________________________________________",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Ready for Production: ☐ Yes  ☐ No  ☐ With Fixes",
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Tester Signature: _______________________________   Date: ______________",
      spacing: { after: 100 },
    }),
  ];
}

// Generate and save the document
async function main() {
  const doc = createTestWorksheet();

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(
    __dirname,
    "..",
    "docs",
    "Testing_Worksheet.docx"
  );

  fs.writeFileSync(outputPath, buffer);
  console.log("✅ Testing worksheet created successfully!");
  console.log(`📄 Location: ${outputPath}`);
}

main().catch((error) => {
  console.error("Error creating worksheet:", error);
  process.exit(1);
});
