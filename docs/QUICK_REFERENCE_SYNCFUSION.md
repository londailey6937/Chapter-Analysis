# Quick Reference: Working with Documents & Analysis

## 📤 Uploading Documents

### ✅ Correct Way: Use the Upload Button

1. Click **"📄 Upload Document"** button in the main interface
2. Select a `.docx` or `.obt` file
3. Wait for processing
4. Document loads in editor with analysis in sidebar

### ❌ Don't Use: Toolbar "Open" Button

- The toolbar's built-in "Open" is **disabled**
- Always use the dedicated Upload Document button
- This ensures proper formatting and image preservation

---

## 📝 Understanding What You See

### In the Editor

- **Editable text content** with proper paragraph spacing
- **Inline analysis labels** in color before each paragraph:
  - `[Compact - 35 words]` in **blue** (short paragraphs)
  - `[Balanced - 95 words]` in **green** (ideal length)
  - `[Extended - 180 words]` in **orange** (long paragraphs)
  - `[💡 Visual: Diagram]` in **gold** (needs visuals)
- **Formatting toolbar** for bold, italic, lists, etc.
- **Search functionality** to find specific terms
- **Images are NOT visible** (client-side limitation, preserved for export)

### In the Right Sidebar

- **📏 Spacing & Pacing**: Detailed color-coded cards with full analysis

  - 🔵 Blue = Compact (< 50 words) - may fragment information
  - 🟢 Green = Balanced (50-150 words) - optimal for learning
  - 🟠 Orange = Extended (> 150 words) - may cause cognitive overload

- **🎨 Visual Opportunities**: Yellow cards with complete suggestions
  - Shows visualization type (flowchart, diagram, concept map)
  - Explains why a visual would help
  - Marks high-priority suggestions
  - Provides paragraph context

### Image Banner (When Present)

```
📸 5 images detected - Images are preserved in HTML exports.
Editor shows text structure with spacing/dual-coding analysis.
```

- Shows when your document has embedded images
- Images **will appear** in HTML and DOCX exports
- Images **won't appear** in the editor (technical limitation)

---

## 🎨 Analysis Features

### Spacing Analysis

**What it does**: Analyzes paragraph lengths for optimal learning

**Why it matters**:

- Too short = fragmented information
- Too long = cognitive overload
- Balanced = optimal comprehension

**How to use**:

1. Check sidebar for color-coded feedback
2. Edit paragraphs that are too long or too short
3. Watch cards update in real-time

### Dual-Coding Analysis

**What it does**: Identifies text that needs visual support

**Why it matters**:

- Spatial descriptions benefit from diagrams
- Process explanations need flowcharts
- Abstract concepts require concept maps

**How to use**:

1. Look for yellow cards in sidebar
2. Read the visualization suggestion
3. Add appropriate images or diagrams
4. High-priority items need attention first

---

## 💾 Exporting Your Work

### Export Options

1. **HTML Export**: Includes all images and formatting
2. **DOCX Export**: Microsoft Word format with images
3. **JSON Export**: Raw analysis data

### What Gets Preserved

- ✅ All text edits from the editor
- ✅ Original images from uploaded DOCX
- ✅ HTML formatting and structure
- ✅ Analysis results and insights

---

## 🔧 Troubleshooting

### "Where are my images?"

- **In editor**: Not visible (client-side limitation)
- **In exports**: Fully preserved and visible
- **Banner shows**: Number of images detected

### "Why no inline highlighting?"

- **Reason**: Syncfusion client-mode doesn't support it
- **Solution**: All insights shown in enhanced sidebar
- **Benefit**: Cleaner editor, organized feedback

### "Open button doesn't work"

- **Reason**: Intentionally disabled
- **Solution**: Use the "Upload Document" button
- **Why**: Ensures proper processing and formatting

### "Lost my formatting"

- **In editor**: Shows structured text (paragraphs)
- **In storage**: Original HTML preserved
- **In exports**: Full formatting restored

---

## 🎯 Best Practices

### Uploading

1. Use DOCX format for formatted documents
2. Use OBT for plain text
3. Check image banner if images expected
4. Verify document structure loads correctly

### Editing

1. Use toolbar for formatting (bold, lists, etc.)
2. Keep paragraphs balanced (50-150 words)
3. Check sidebar for real-time feedback
4. Save frequently (auto-save enabled)

### Analysis

1. Review all spacing cards (blue/green/orange)
2. Address yellow visual opportunity cards
3. Prioritize "High Priority" suggestions
4. Re-analyze after major edits

### Exporting

1. Choose HTML for web sharing
2. Choose DOCX for Word editing
3. Choose JSON for data analysis
4. Verify images appear in exports

---

## 📚 More Information

- **Integration Details**: See `docs/SYNCFUSION_INTEGRATION.md`
- **Recent Fixes**: See `docs/SYNCFUSION_FIXES.md`
- **Full Summary**: See `SYNCFUSION_IMPROVEMENTS_SUMMARY.md`
- **Project Docs**: See `docs/` folder for complete guides

---

## 🆘 Quick Help

### My document won't upload

- Check file size (< 200MB)
- Verify format (.docx or .obt)
- Check access tier page limits

### Analysis not showing

- Ensure text is loaded in editor
- Check sidebar is visible
- Verify content is substantial (> 200 chars)

### Can't edit text

- Check if in read-only mode
- Verify access tier permissions
- Look for upgrade prompts

### Export doesn't include images

- Verify images were in original DOCX
- Check console for image detection logs
- Try HTML export first (most reliable)

---

**Need more help?** Check the comprehensive documentation in the `docs/` folder.
