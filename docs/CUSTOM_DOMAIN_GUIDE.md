# Custom Domain Guide

## Overview

Custom Domains allow you to create your own subject-specific concept libraries for specialized topics not covered by the built-in libraries (Chemistry, Math, Finance, etc.).

**Available in**: Premium and Professional tiers

## What Are Custom Domains?

A custom domain is a personalized concept library containing:

- **Domain name** - Your subject area (e.g., "Marine Biology", "Art History")
- **Concepts** - List of key terms/concepts for that domain
- **Importance levels** - Core, supporting, or detail concepts
- **Categories** - Optional organization (e.g., "Renaissance", "Baroque")

When you analyze a document with a custom domain selected, the system:

1. Searches for your concepts in the text
2. Highlights found concepts
3. Checks for prerequisite relationships
4. Evaluates spacing and repetition
5. Suggests missing important concepts

## When to Use Custom Domains

✅ **Good use cases**:

- Specialized academic subjects (Astronomy, Musicology, Anthropology)
- Professional fields (Healthcare, Legal, Real Estate)
- Corporate training (Company-specific terminology)
- Niche technical topics (Quantum Computing, Bioinformatics)
- Language learning (Vocabulary lists by level)

❌ **Not ideal for**:

- General writing (use "None / General Content" instead)
- Topics already covered by built-in libraries
- Very small concept sets (<10 concepts)

## Creating a Custom Domain

### Method 1: Manual Entry (Web Interface)

1. **Access Custom Domains**

   - Click **"Domain"** dropdown in header
   - Select **"+ Create Custom Domain"**

2. **Enter Domain Details**

   ```
   Domain Name: Marine Biology
   Description: Concepts for undergraduate marine biology course
   ```

3. **Add Concepts One by One**

   - Click **"+ Add Concept"**
   - Enter concept name: `Photosynthesis`
   - Set importance: `core`
   - Add category (optional): `Biological Processes`
   - Click "Save"

4. **Build Your Library**

   - Add 20-100 concepts for best results
   - Include mix of core, supporting, and detail concepts
   - Save domain when complete

5. **Use Your Domain**
   - Select from domain dropdown
   - Upload/paste content
   - Run analysis

### Method 2: CSV Upload (Coming Soon)

Prepare a CSV file with this format:

```csv
concept_name,importance,category
Photosynthesis,core,Biological Processes
Coral Reef,core,Ecosystems
Zooplankton,supporting,Organisms
Bioluminescence,supporting,Biological Processes
Salinity,detail,Physical Properties
```

**CSV Requirements**:

- Column headers must be: `concept_name`, `importance`, `category`
- Importance must be: `core`, `supporting`, or `detail`
- Category is optional
- Save as UTF-8 encoding

**Upload Steps**:

1. Click **"+ Create Custom Domain"**
2. Select **"Import from CSV"**
3. Choose your CSV file
4. Review concepts (edit if needed)
5. Save domain

### Method 3: Copy from Existing Course Materials

If you have a glossary or term list in a document:

1. **Extract Terms**

   - Copy terms from glossary
   - One term per line
   - Paste into text editor

2. **Format as Simple List**

   ```
   Photosynthesis
   Coral Reef
   Zooplankton
   ...
   ```

3. **Bulk Add** (If available in UI)
   - Click **"Bulk Import"**
   - Paste list
   - System assigns default importance: `supporting`
   - Review and adjust importance levels
   - Save domain

## Concept Importance Levels

### Core Concepts (20-30% of library)

- Essential foundational ideas
- Must be understood for basic competency
- Should appear early and often
- Examples: "Photosynthesis" (Biology), "Function" (Programming)

### Supporting Concepts (50-60% of library)

- Build on core concepts
- Important but not foundational
- Provide depth and context
- Examples: "Chloroplast" (Biology), "Recursion" (Programming)

### Detail Concepts (10-20% of library)

- Specific terminology
- Nice to know, not essential
- Edge cases or advanced topics
- Examples: "Thylakoid membrane" (Biology), "Tail recursion" (Programming)

## Best Practices

### Choosing Concepts

**DO**:

- ✅ Include key vocabulary specific to your field
- ✅ Add concepts students frequently misunderstand
- ✅ Include prerequisite relationships (e.g., "mitosis" before "meiosis")
- ✅ Use consistent terminology (same terms as your materials)
- ✅ Include 30-100 concepts for comprehensive coverage

**DON'T**:

- ❌ Include generic terms (e.g., "introduction", "summary")
- ❌ Add full sentences as concepts
- ❌ Duplicate concepts with slight variations
- ❌ Include concepts already in cross-domain library (check first)
- ❌ Make every concept "core" - use the full importance range

### Structuring Your Domain

**Small Domain (30-50 concepts)**

- Perfect for: Single course unit, chapter theme
- Distribution: 10 core, 25 supporting, 15 detail

**Medium Domain (50-100 concepts)**

- Perfect for: Full course, semester material
- Distribution: 20 core, 50 supporting, 30 detail

**Large Domain (100+ concepts)**

- Perfect for: Multiple courses, comprehensive subject
- Distribution: 30 core, 100 supporting, 70+ detail

### Testing Your Domain

1. **Start Small**

   - Create domain with 10-20 key concepts
   - Test on sample chapter
   - Verify concepts are detected

2. **Expand Gradually**

   - Add more concepts based on testing
   - Check for false positives (wrong detections)
   - Refine importance levels

3. **Validate Coverage**
   - Test on representative documents
   - Aim for 15-30 concept matches per chapter
   - Too few matches? Add more concepts
   - Too many? Increase specificity

## Managing Custom Domains

### Edit Existing Domain

1. Click **"Domain"** dropdown
2. Select domain to edit
3. Click **"✏️ Edit"** icon
4. Modify concepts or settings
5. Click **"Save Changes"**

### Delete Domain

1. Click **"Domain"** dropdown
2. Select domain to delete
3. Click **"🗑️ Delete"** icon
4. Confirm deletion
5. Domain is permanently removed

**Note**: Saved analyses using this domain will still show results, but you can't run new analyses with it.

### Export Domain

1. Select your custom domain
2. Click **"⬇️ Export"** button
3. Download as JSON file
4. Share with colleagues or backup

### Import Domain

1. Click **"+ Create Custom Domain"**
2. Select **"Import from JSON"**
3. Choose exported JSON file
4. Domain is added to your library

## Example Custom Domains

### Example 1: Music Theory

```csv
concept_name,importance,category
Scale,core,Fundamentals
Chord,core,Fundamentals
Melody,core,Fundamentals
Harmony,core,Fundamentals
Rhythm,core,Fundamentals
Interval,supporting,Theory
Key Signature,supporting,Notation
Time Signature,supporting,Notation
Counterpoint,supporting,Advanced Theory
Modulation,supporting,Advanced Theory
Cadence,detail,Harmony
Figured Bass,detail,Notation
Tritone,detail,Intervals
```

**Usage**: Analyze music textbook chapters, composition guides

### Example 2: Real Estate

```csv
concept_name,importance,category
Mortgage,core,Financing
Appraisal,core,Valuation
Closing Costs,core,Transactions
Escrow,core,Transactions
Down Payment,core,Financing
Title Insurance,supporting,Legal
HOA,supporting,Property Types
PMI,supporting,Financing
Amortization,supporting,Financing
Contingency,supporting,Contracts
Deed,supporting,Legal
Cap Rate,detail,Investment
1031 Exchange,detail,Tax
```

**Usage**: Analyze real estate training materials, agent guides

### Example 3: Company-Specific Training

```csv
concept_name,importance,category
Customer Success,core,Departments
Product Roadmap,core,Strategy
Sprint Planning,core,Agile Process
Retrospective,core,Agile Process
OKR,core,Planning
Tech Debt,supporting,Engineering
Growth Hacking,supporting,Marketing
Churn Rate,supporting,Metrics
User Story,supporting,Agile Process
Burndown Chart,detail,Metrics
A/B Testing,detail,Optimization
```

**Usage**: Onboarding materials, internal documentation

## Troubleshooting

### "Not enough concepts detected"

**Causes**:

- Domain has too few concepts
- Concepts don't match document terminology
- Document is off-topic

**Solutions**:

- Add more concepts (aim for 30+)
- Use synonyms/aliases (if feature available)
- Verify document matches domain

### "Too many false positives"

**Causes**:

- Generic concept names
- Common words mistaken for concepts
- Overly broad categories

**Solutions**:

- Use more specific terminology
- Remove generic terms
- Focus on field-specific vocabulary

### "Concepts not highlighting"

**Causes**:

- Concept spelled differently in document
- Case sensitivity issues
- Special characters in concept names

**Solutions**:

- Match exact spelling from documents
- Check for plural forms
- Avoid special characters

### "Can't save custom domain"

**Causes**:

- Not logged in
- Free tier (custom domains not available)
- Browser localStorage full

**Solutions**:

- Sign in to account
- Upgrade to Premium or Professional
- Clear browser cache/storage

## Storage & Limits

- **Storage**: Custom domains saved to your account (Supabase)
- **Limit**: 10 custom domains per account (Premium/Professional)
- **Size**: Up to 500 concepts per domain
- **Sharing**: Export/import JSON to share with team

## Frequently Asked Questions

**Q: Can I use custom domains with free tier?**
A: No - custom domains require Premium or Professional tier.

**Q: Can I edit built-in domains (Chemistry, Math, etc.)?**
A: No - built-in domains are read-only. Create a custom domain and copy concepts to modify.

**Q: How do I add synonyms/aliases?**
A: Currently not supported. Add each variant as a separate concept.

**Q: Can I merge two custom domains?**
A: Not directly. Export both, manually combine in spreadsheet, re-import.

**Q: Do custom domains work with templates?**
A: Yes! Templates + custom domains work together seamlessly.

**Q: Can multiple people share a custom domain?**
A: Export as JSON and share the file. Each person imports to their account.

**Q: What happens if I downgrade from Premium to Free?**
A: Custom domains are hidden but not deleted. Restore by upgrading again.

## Next Steps

1. ✅ Identify your specialized subject area
2. ✅ Gather 30-100 key concepts
3. ✅ Create custom domain
4. ✅ Test on sample document
5. ✅ Refine based on results
6. ✅ Use for all your content in that domain

## Support

Need help creating effective custom domains?

- Review built-in libraries for inspiration (`src/data/`)
- Check `CONCEPT_LIBRARY_MANIFEST.md` for examples
- Contact support for guidance on complex domains
