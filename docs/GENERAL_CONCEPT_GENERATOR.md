# General Concept Generator

**Feature Status:** ✅ Implemented (December 2024)

## Overview

The General Concept Generator automatically extracts key themes and concepts from content when no domain is selected (domain = "none"). This provides value for general content like meditation guides, creative writing, essays, blog posts, and employee manuals that don't fit into academic domains.

## Location

- **UI Position:** Bottom of Analysis Panel
- **Visibility:** Only shown when `selectedDomain === "none"` AND concepts are extracted
- **Component:** `GeneralConceptGenerator.tsx`
- **Utility:** `generalConceptExtractor.ts`

## How It Works

### 1. Concept Extraction

When analysis completes with domain "none", the system:

1. Extracts the plain text from the document
2. Applies NLP pattern matching to identify:
   - **Themes** 💡: Noun phrases (2-4 words)
   - **Entities** 🏷️: Capitalized terms, proper nouns
   - **Actions** ⚡: Key verbs (develop, create, manage, etc.)
   - **Qualities** ✨: Important descriptors (essential, critical, effective, etc.)
3. Filters out stop words and common phrases
4. Tracks frequency and positions in text
5. Returns top 20 concepts (minimum 2 occurrences)

### 2. Display

Concepts are displayed in category groups:

```tsx
📝 Key Themes & Concepts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 THEMES (5)
[meditation practice 3×] [mindful breathing 2×] ...

🏷️ ENTITIES (3)
[buddhist tradition 2×] [zen philosophy 4×] ...

⚡ ACTIONS (4)
[develop 3×] [create 2×] [practice 5×] ...

✨ QUALITIES (2)
[essential 2×] [effective 3×] ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
20 key concepts identified
💡 Tip: Add a domain for deeper analysis
```

### 3. Preview Navigation

Each concept is a clickable button:

- **Click** → Scrolls to first occurrence in document
- **Hover** → Shows frequency and tooltip
- **Color-coded** by category
- **Badge** shows occurrence count (e.g., "3×")

## Code Structure

### Files Created

1. **`src/utils/generalConceptExtractor.ts`** (~180 lines)

   - `extractGeneralConcepts(text)` - Main extraction function
   - `GeneralConcept` interface
   - Category helpers and filtering logic

2. **`src/components/GeneralConceptGenerator.tsx`** (~180 lines)
   - UI component for displaying concepts
   - Category grouping and color coding
   - Click handlers for navigation

### Integration Points

**ChapterCheckerV2.tsx:**

```typescript
// Import
import {
  extractGeneralConcepts,
  type GeneralConcept,
} from "@/utils/generalConceptExtractor";
import { GeneralConceptGenerator } from "./GeneralConceptGenerator";

// State
const [generalConcepts, setGeneralConcepts] = useState<GeneralConcept[]>([]);

// Extract on analysis complete
worker.onmessage = (e) => {
  if (e.data.type === "complete") {
    setAnalysis(e.data.result);

    if (selectedDomain === "none") {
      const textToAnalyze =
        chapterData?.plainText ?? chapterData?.originalPlainText ?? "";
      const extracted = extractGeneralConcepts(textToAnalyze);
      setGeneralConcepts(extracted);
    }
  }
};

// Render (after ChapterAnalysisDashboard)
{
  selectedDomain === "none" && generalConcepts.length > 0 && (
    <GeneralConceptGenerator
      concepts={generalConcepts}
      onConceptClick={(position) => {
        setHighlightPosition(position);
        setSearchWord(null);
        setSearchOccurrence(0);
      }}
    />
  );
}
```

## Extraction Patterns

### Noun Phrases (Themes)

- Pattern: `\b([a-z]+(?:\s+[a-z]+){1,3})\b`
- Examples: "meditation practice", "mindful breathing", "stress reduction"
- Minimum length: 3 characters
- Filtered: Stop words, numbers, single-word

### Capitalized Terms (Entities)

- Pattern: `\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b`
- Examples: "Buddhist Tradition", "Zen Philosophy"
- Converted to lowercase for tracking
- Multi-word support (up to 3 words)

### Action Verbs

- Pattern: Explicit list of key verbs
- Examples: develop, create, implement, manage, analyze, design
- Includes variations (developing, created, implements)
- Case-insensitive matching

### Descriptors (Qualities)

- Pattern: Explicit list of quality adjectives
- Examples: important, critical, essential, effective, innovative
- Focus on impactful/significant descriptors
- Case-insensitive matching

## Testing

### Test Cases

1. **Meditation Document:**

   ```
   Upload: meditation-guide.obt
   Domain: "None / General Content"
   Expected: Extract "meditation practice", "mindful breathing", etc.
   Verify: Click concepts → Navigate to document position
   ```

2. **Employee Manual:**

   ```
   Upload: employee-handbook.docx
   Domain: "None / General Content"
   Expected: Extract "company policy", "work environment", "professional development"
   Verify: Category grouping (themes, actions, qualities)
   ```

3. **Creative Writing:**

   ```
   Upload: short-story.obt
   Domain: "None / General Content"
   Expected: Extract character names, themes, actions
   Verify: Frequency counts accurate
   ```

4. **Domain Selected:**
   ```
   Upload: chemistry-chapter.obt
   Domain: "Chemistry"
   Expected: GeneralConceptGenerator NOT shown (hasDomain=true)
   Verify: Only domain-specific concepts displayed
   ```

## UI/UX Details

### Visual Design

- **Container:** Light gray background (#f8fafc), rounded corners
- **Header:** "📝 Key Themes & Concepts" with description
- **Categories:** Icon + label + count
- **Concept Pills:**
  - White background
  - Category-colored border (20% opacity)
  - Hover: Fill with category color (10% opacity)
  - Badge: Frequency count with category color
- **Footer:** Stats + tip to add domain

### Interaction

- **Hover State:**
  - Background color change
  - Border color intensifies
  - Slight lift (translateY -1px)
  - Box shadow appears
- **Tooltip:** "Found X times. Click to view in document."
- **Click:** Immediate scroll to position in preview

### Accessibility

- Semantic button elements
- Keyboard navigation support
- Color-coded with sufficient contrast
- Tooltip text for screen readers

## Performance

### Optimization

- Extraction runs once after analysis (not on every render)
- Top 20 concepts only (prevents UI clutter)
- Minimum 2 occurrences (filters noise)
- Stop word filtering (reduces false positives)
- Efficient regex patterns (single pass per pattern type)

### Memory

- Concepts stored in state (~2-5 KB)
- Positions array per concept (~50-200 bytes)
- Total overhead: < 10 KB for typical document

## Future Enhancements

### Potential Improvements

1. **ML-based extraction:** Use NLP library (compromise.js, natural.js) for better accuracy
2. **Concept relationships:** Show how concepts connect (co-occurrence)
3. **Category filtering:** Toggle categories on/off
4. **Export concepts:** Download as JSON/CSV
5. **Concept tagging:** User-defined categories
6. **Sentiment analysis:** Positive/negative/neutral indicators
7. **Trend detection:** Identify concept evolution through document sections

### Advanced Features

- **Concept hierarchy:** Parent-child relationships
- **Synonym grouping:** "meditation" + "mindfulness" → combined
- **Context snippets:** Show where concept appears with more context
- **Heat map:** Visual density of concept occurrence
- **Time-based analysis:** For versioned documents

## Integration with Other Features

### Works With

- ✅ **Domain Detection:** Only shows when domain = "none"
- ✅ **Preview Panel:** Highlights position on click
- ✅ **Analysis Dashboard:** Appears at bottom, non-intrusive
- ✅ **Writer Mode:** Compatible (analysis view only)
- ✅ **Access Tiers:** Available to all tiers

### Complements

- **Template Library:** General Content template + concept generator = complete workflow
- **Cognitive Load Analysis:** Still runs even without domain
- **Writing Suggestions:** Recommendations work alongside concepts
- **Export Features:** Concepts included in analysis summary

## Troubleshooting

### Concepts Not Showing

- **Check domain:** Must be "none" (not null, not selected domain)
- **Check analysis:** Must be complete (not analyzing)
- **Check extraction:** Minimum 2 occurrences required
- **Check text:** Document must have content

### Navigation Not Working

- **Check highlightPosition:** Should be set on click
- **Check DocumentEditor:** Must support highlightPosition prop
- **Check preview panel:** Must be visible
- **Check scroll:** Panel must be scrollable

### Low Quality Concepts

- **Too generic:** Adjust stop word list
- **Too few:** Lower minimum occurrence (currently 2)
- **Wrong category:** Update extraction patterns
- **Missing important terms:** Add to action/descriptor lists

## Related Documentation

- `DOMAIN_SPECIFIC_GUIDE.md` - Domain selection and detection
- `ANALYSIS_RESULTS_GUIDE.md` - Understanding analysis output
- `TECHNICAL_ARCHITECTURE.md` - System architecture
- `RECENT_CHANGES.md` - Latest feature updates

## Version History

- **v1.0** (December 2024): Initial implementation
  - Basic NLP extraction (noun phrases, entities, actions, descriptors)
  - Category grouping and UI display
  - Preview navigation integration
  - 4 concept categories with color coding
