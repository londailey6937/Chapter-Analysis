# Syncfusion DocumentEditor Integration Guide

## Overview

The Chapter Analysis app uses Syncfusion's DocumentEditor component to provide a rich text editing experience with document import/export capabilities. This guide explains how it's integrated, its limitations, and best practices.

## Architecture

### Components Structure

```
DocumentEditor.tsx (Wrapper)
  └── SyncfusionEditor.tsx (Core Integration)
        └── DocumentEditorContainerComponent (Syncfusion Component)
```

### Key Features

1. **Rich Text Editing**: Full-featured document editor with formatting toolbar
2. **Analysis Sidebar**: Real-time spacing and dual-coding insights
3. **Document Import**: Supports DOCX and OBT files via DocumentUploader component
4. **Export Options**: Export to DOCX, SFDT, or TXT formats

## Document Upload Workflow

### ✅ Correct Upload Method

Use the **DocumentUploader** component, which is integrated into the ChapterCheckerV2 interface:

```tsx
<DocumentUploader
  onDocumentLoad={handleDocumentLoad}
  disabled={isLoading}
  accessLevel={accessLevel}
/>
```

This component:

- Properly extracts text and HTML from DOCX files
- Preserves images (embedded as base64)
- Handles WMF/EMF equation conversion
- Applies access tier page limits
- Passes structured data to the editor

### ❌ "Open" Toolbar Button Disabled

The built-in "Open" button in Syncfusion's toolbar is **disabled** because:

- It bypasses our document processing pipeline
- Doesn't apply access controls
- Doesn't extract images properly
- Doesn't preserve HTML formatting

## Content Formatting

### HTML Content Preservation

When DOCX files are uploaded:

1. **Mammoth.js** extracts HTML with images
2. **SyncfusionEditor** parses the HTML to extract paragraph structure
3. **Plain text is inserted** into the editor (Syncfusion limitation)
4. **Original HTML is preserved** for export features

### Why Not Full HTML Rendering?

Syncfusion DocumentEditor in **client-side mode** has limitations:

- Cannot import HTML directly
- Requires server-side processing for full HTML import
- Images can't be inserted programmatically in client-mode

### Solution: Dual Storage

```typescript
chapterData = {
  html: originalHtmlContent, // For exports
  plainText: extractedText, // For editor
  isHybridDocx: true, // Flag for export logic
  imageCount: 5, // Metadata
  editorHtml: currentEditorHtml, // Editor state
};
```

## Analysis Features

### Spacing Analysis

Analyzes paragraph lengths and provides feedback on cognitive load:

- **Compact** (< 50 words): Blue indicator
- **Balanced** (50-150 words): Green indicator
- **Extended** (> 150 words): Orange indicator

### Dual-Coding Analysis

Identifies paragraphs that would benefit from visual aids:

- Detects spatial/process descriptions
- Identifies technical/abstract concepts
- Suggests diagram types (flowchart, timeline, concept map, etc.)

### Display Location

Analysis insights are shown in the **right sidebar**, not as inline highlights, because:

- Client-side mode doesn't support paragraph background colors
- Syncfusion's styling API requires server-side processing
- Sidebar provides clearer, organized insights

## Configuration

### Toolbar Items

Current toolbar configuration (see `SyncfusionEditor.tsx`):

```typescript
// Toolbar is enabled with default items
// "Open" button is hidden via CSS on component creation
enableToolbar={true}
restrictEditing={!isEditable}
```

To customize toolbar items, you would need to add the `toolbarItems` prop with valid Syncfusion toolbar item names.

### Services Injected

```typescript
<Inject
  services={[
    Toolbar, // Toolbar UI
    WordExport, // Export to DOCX
    SfdtExport, // Export to SFDT (Syncfusion format)
    TextExport, // Export to TXT
    Selection, // Text selection
    Search, // Find functionality
    Editor, // Core editing
    ContextMenu, // Right-click menu
    OptionsPane, // Options panel
  ]}
/>
```

## Best Practices

### For Document Upload

1. Always use `DocumentUploader` component
2. Never rely on the built-in "Open" button
3. Verify `isHybridDocx` flag for proper export handling

### For Editing

1. Let users edit in the Syncfusion editor
2. Track changes via `onUpdate` callback
3. Preserve both `plainText` and `html` in state

### For Export

1. Use the original HTML if available (`isHybridDocx === true`)
2. Fall back to editor's plain text for pure text documents
3. Include images from original HTML in exports

## Limitations

### Client-Side Mode Constraints

❌ Cannot directly import HTML with images
❌ Cannot apply paragraph background colors programmatically
❌ Cannot insert images via API
❌ Limited styling options

✅ Can insert and format text
✅ Can export to multiple formats
✅ Rich toolbar for user formatting
✅ Search and navigation features work

### Workarounds

1. **Images**: Store in HTML, show in exports
2. **Formatting**: Parse HTML to extract structure
3. **Analysis**: Display in sidebar instead of inline
4. **Styling**: Let users apply formatting via toolbar

## Troubleshooting

### Issue: Uploaded document loses formatting

**Cause**: Syncfusion client-mode limitation
**Solution**: Formatting is preserved in HTML export, editor shows editable plain text

### Issue: Images don't appear in editor

**Cause**: Client-side API doesn't support image insertion
**Solution**: Images are preserved in `chapterData.html` and included in exports

### Issue: "Open" button doesn't work

**Cause**: Intentionally disabled
**Solution**: Use DocumentUploader component instead

### Issue: Spacing colors don't show in document

**Cause**: Client-side styling limitations
**Solution**: Insights shown in sidebar with color-coded cards

## Future Enhancements

Potential improvements with server-side Syncfusion setup:

1. Full HTML import with images
2. Inline paragraph highlighting
3. Custom formatting preservation
4. Advanced import/export options

## Code References

- **Main Integration**: `src/components/SyncfusionEditor.tsx`
- **Wrapper Component**: `src/components/DocumentEditor.tsx`
- **Upload Handler**: `src/components/DocumentUploader.tsx`
- **Parent Container**: `src/components/ChapterCheckerV2.tsx`
- **License Registration**: `src/syncfusion/registerLicense.ts`

## License

The app uses Syncfusion Community License. Ensure you have a valid license key set in your environment variables or `registerLicense.ts`.
