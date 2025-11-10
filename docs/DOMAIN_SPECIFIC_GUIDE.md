# Domain-Specific Features Guide

## Overview

This guide explains how the Chapter Analysis Tool adapts its analysis for different academic disciplines, with detailed coverage of the implemented chemistry domain and blueprints for future domains.

---

## Table of Contents

1. [Domain-Specific Architecture](#domain-specific-architecture)
2. [Chemistry Domain (Implemented)](#chemistry-domain-implemented)
3. [Future Domains (Planned)](#future-domains-planned)
4. [Creating New Domains](#creating-new-domains)
5. [Domain Detection](#domain-detection)

---

## Domain-Specific Architecture

### Why Domain-Specific Intelligence?

Educational content varies dramatically across disciplines:

| Discipline       | Key Characteristics                              | Generic Analysis Limitations       |
| ---------------- | ------------------------------------------------ | ---------------------------------- |
| Chemistry        | Chemical equations, lab procedures, nomenclature | Misses molecular-level patterns    |
| Finance          | Financial models, cash flows, valuation formulas | Misses quantitative relationships  |
| Biology          | Diagrams, classification, processes              | Misses visual/taxonomic structures |
| Computer Science | Code examples, algorithms, complexity            | Misses implementation patterns     |

**Solution**: Layered architecture

- **Universal Layer**: Works for all disciplines (6 pattern types)
- **Domain Layer**: Specialized detectors for specific subjects

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Universal Pattern Detection                │
│  (Worked examples, practice problems, definitions, etc) │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Domain Parameter    │
        │    (chemistry?)       │
        └───────────┬───────────┘
                    │
        ┌───────────┴───────────┬───────────────┬──────────────┐
        │                       │               │              │
        ▼                       ▼               ▼              ▼
┌───────────────┐    ┌──────────────┐  ┌────────────┐  ┌────────────┐
│   Chemistry   │    │   Finance    │  │  Biology   │  │  CS/Other  │
│   Patterns    │    │   Patterns   │  │  Patterns  │  │  Patterns  │
│ (Implemented) │    │   (Planned)  │  │ (Planned)  │  │ (Planned)  │
└───────────────┘    └──────────────┘  └────────────┘  └────────────┘
```

### How It Works

**Step 1**: Universal analysis (always runs)

```typescript
// PatternRecognizer.ts
const patterns = [
  ...detectWorkedExamples(chapter),
  ...detectPracticeProblems(chapter),
  ...detectDefinitionExamples(chapter),
  ...detectFormulas(chapter),
  ...detectProcedures(chapter),
  ...detectComparisons(chapter),
];
```

**Step 2**: Domain-specific enhancement (conditional)

```typescript
if (domain === "chemistry") {
  const chemPatterns = ChemistryPatterns.detectAll(chapter);
  patterns.push(...chemPatterns);
}
// Future: if (domain === "finance") { ... }
```

**Step 3**: Pattern-aware evaluation

```typescript
// Evaluators use both universal and domain patterns
if (patternAnalysis) {
  // Universal pattern bonus
  const workedExamples = patterns.filter((p) => p.type === "workedExample");

  // Domain-specific bonus
  const chemEquations = patterns.filter((p) => p.title === "Chemical Equation");
}
```

---

## Chemistry Domain (Implemented)

### Overview

The chemistry domain detector identifies **6 chemistry-specific pedagogical structures** that are critical for learning chemistry but would be missed by generic analysis.

### 6 Chemistry Pattern Types

#### 1. Chemical Equations

**What It Detects**:

- Symbolic representations of chemical reactions
- Format: `Reactants → Products` or `Reactants ⇌ Products`
- With or without stoichiometric coefficients
- With or without state symbols (s, l, g, aq)

**Example Detection**:

```
2H₂ + O₂ → 2H₂O
CH₄ + 2O₂ → CO₂ + 2H₂O
N₂(g) + 3H₂(g) ⇌ 2NH₃(g)
```

**Regex Pattern**:

```typescript
/[A-Z][a-z]?\d*(?:\([a-z]\))?\s*(?:\+\s*\d*[A-Z][a-z]?\d*)*\s*[→⇌]\s*[A-Z][a-z]?\d*(?:\([a-z]\))?\s*(?:\+\s*\d*[A-Z][a-z]?\d*)*/g;
```

**Metadata Captured**:

- `isBalanced`: Heuristic check (counts atoms on both sides)
- `difficulty`: easy/medium/hard based on complexity
  - **Easy**: Simple, few coefficients (e.g., `H₂ + O₂ → H₂O`)
  - **Medium**: Multiple compounds, some coefficients
  - **Hard**: Complex polyatomic ions, many coefficients, equilibrium
- `isWorkedExample`: Is equation shown in solution context?

**Scoring Impact**:

- ✓ DeepProcessingEvaluator: +bonus for balanced equations as worked examples
- ✓ DualCodingEvaluator: +bonus for equations as visual/symbolic representations
- ✓ EmotionAndRelevanceEvaluator: +bonus for many reactions (real-world tangibility)

**Why It Matters**:

- Core representation language of chemistry
- Shows molecular-level transformations
- Foundation for stoichiometry
- Dual coding (symbolic + conceptual)

---

#### 2. Stoichiometry Problems

**What It Detects**:

- Quantitative problems involving mole relationships
- Mass-to-mass, mole-to-mole, limiting reactant calculations
- Percent yield, theoretical yield problems

**Example Detection**:

```
Calculate the mass of CO₂ produced from 10.0 g of CH₄.

How many moles of H₂O form from 2.5 moles of O₂?

Determine the limiting reactant when 5.0g Na reacts with 10.0g Cl₂.
```

**Detection Keywords**:

- "calculate mass", "calculate moles"
- "limiting reactant", "excess reactant"
- "percent yield", "theoretical yield"
- "grams", "moles" near chemical formulas
- Stoichiometric ratios

**Metadata Captured**:

- `problemType`: "stoichiometry"
- `difficulty`: Based on complexity
  - **Easy**: Single-step conversion
  - **Medium**: Multi-step, limiting reactant
  - **Hard**: Percent yield, multiple reactions
- `hasAnswer`: Boolean (solution provided?)

**Scoring Impact**:

- ✓ RetrievalPracticeEvaluator: +bonus for stoichiometry (core quantitative skill)
- ✓ SpacedRepetitionEvaluator: +bonus for distributed stoich problems

**Why It Matters**:

- Central quantitative skill in chemistry
- Tests mole concept understanding
- Real-world applications (industry, medicine)
- Bridges symbolic and quantitative thinking

---

#### 3. Lewis Structures

**What It Detects**:

- Electron dot diagrams
- Problems asking students to draw structures
- Visual representations of bonding

**Example Detection**:

```
Draw the Lewis structure for CO₂.

Show the electron dot diagram for NH₃.

Determine the Lewis structure for SO₄²⁻.
```

**Detection Keywords**:

- "Lewis structure"
- "electron dot diagram"
- "valence electrons"
- "draw structure"
- "bonding electrons", "lone pairs"

**Metadata Captured**:

- `problemType`: "lewis-structure"
- `difficulty`: "medium" (requires spatial reasoning)

**Scoring Impact**:

- ✓ DualCodingEvaluator: +bonus (visual representation of bonding)
- ✓ RetrievalPracticeEvaluator: +bonus (visual retrieval practice)

**Why It Matters**:

- Visual representation of invisible electron distribution
- Foundation for VSEPR, molecular geometry, polarity
- Bridges particulate and macroscopic levels
- Develops spatial reasoning

---

#### 4. Lab Procedures

**What It Detects**:

- Experimental procedures with numbered steps
- Safety precautions and equipment mentions
- Laboratory technique descriptions

**Example Detection**:

```
Laboratory Procedure: Titration

Safety: Wear goggles and gloves. Handle acids carefully.

Steps:
1. Rinse burette with titrant solution
2. Fill burette to 0.00 mL mark
3. Add 25.0 mL analyte using pipette
4. Add 2-3 drops indicator
5. Titrate slowly until color change
6. Record final burette reading
7. Calculate molarity
```

**Detection Keywords**:

- "laboratory procedure", "experimental method"
- "safety precautions", "wear goggles"
- Equipment: "beaker", "burette", "pipette", "flask"
- Numbered procedural steps
- "heat", "stir", "add dropwise"

**Metadata Captured**:

- `procedureType`: "laboratory"
- `steps`: Number of procedural steps
- Safety emphasis detected

**Scoring Impact**:

- ✓ SpacedRepetitionEvaluator: +bonus (hands-on spaced practice)
- ✓ MetacognitionEvaluator: +bonus (requires safety awareness, self-monitoring)
- ✓ EmotionAndRelevanceEvaluator: +bonus (tangible, sensory experience)

**Why It Matters**:

- Connects theory to practice
- Develops laboratory skills
- Safety consciousness
- Emotional engagement through hands-on work
- Authentic science experience

---

#### 5. Nomenclature Practice

**What It Detects**:

- Chemical naming exercises
- IUPAC systematic nomenclature
- Formula-to-name or name-to-formula problems

**Example Detection**:

```
Name the following compound: CH₃CH₂CH₂CH₃
Answer: butane

Write the formula for 2-methylpropane.

Give the IUPAC name: CH₃CH(OH)CH₃
```

**Detection Keywords**:

- "name the following", "name the compound"
- "IUPAC name", "systematic name"
- "write the formula"
- "nomenclature", "naming"

**Metadata Captured**:

- `problemType`: "nomenclature"
- `difficulty`: "easy" (typically rule-based, not conceptual)

**Scoring Impact**:

- ✓ RetrievalPracticeEvaluator: +bonus (automatic recall practice)
- ✓ SchemaBuildingEvaluator: +bonus (builds taxonomic classification schemas)

**Why It Matters**:

- Essential communication in chemistry
- Builds systematic classification understanding
- Pattern recognition skill
- Foundation for organic chemistry
- Develops hierarchical thinking (alkane → butane → 2-methylbutane)

---

#### 6. Reaction Mechanisms

**What It Detects**:

- Step-by-step electron movement in reactions
- Elementary steps in reaction pathways
- Transition states, intermediates
- Rate-determining steps

**Example Detection**:

```
SN2 Mechanism:
1. Nucleophile approaches carbon from backside
2. Transition state forms: Nu---C---LG
3. Bond to leaving group breaks
4. Inversion of configuration occurs

Rate = k[substrate][nucleophile]
```

**Detection Keywords**:

- "reaction mechanism", "mechanism"
- "elementary step", "rate-determining step"
- "transition state", "intermediate"
- "electron movement", "arrow pushing"
- "SN1", "SN2", "E1", "E2" (specific mechanisms)

**Metadata Captured**:

- `procedureType`: "mechanism"
- `steps`: Number of elementary steps
- `difficulty`: "hard" (requires deep understanding)

**Scoring Impact**:

- ✓ DeepProcessingEvaluator: +bonus (deep molecular-level understanding)
- ✓ InterleavingEvaluator: +bonus when multiple mechanisms present (comparison)
- ✓ CognitiveLoadEvaluator: Warning if too many complex mechanisms (overload risk)

**Why It Matters**:

- Deepest level of understanding reactions
- Explains why reactions occur
- Predicts products and conditions
- Foundation for organic chemistry
- Develops mechanistic reasoning

---

### Chemistry Concept Library

**File**: `src/data/chemistryConceptLibrary.ts`

**Purpose**: Pre-defined list of chemistry concepts with metadata

**Structure**:

```typescript
export const chemistryConceptLibrary = {
  subject: "Chemistry",
  version: "1.0",
  concepts: [
    {
      term: "atom",
      importance: "core",
      category: "matter_structure",
      relatedConcepts: ["element", "molecule", "ion"],
      commonMisconceptions: [
        "Atoms are indivisible",
        "Atoms are solid spheres",
      ],
    },
    // ... 376 more concepts
  ],
};
```

**Importance Levels**:

- `"core"`: Foundational concepts (47 marked core)
- `undefined`: Supporting or detail concepts

**Uses**:

1. **Concept extraction**: Recognizes domain-specific terms
2. **Hierarchy building**: Core concepts automatically prioritized
3. **Relationship hints**: Pre-defined related concepts guide detection
4. **Misconception awareness**: Educational metadata for instructors

**Core Concepts in Library** (47 total):

- atom, element, compound, molecule, ion
- chemical bond, covalent bond, ionic bond
- periodic table, electron, proton, neutron
- stoichiometry, mole, Avogadro's number
- chemical equation, reaction, equilibrium
- acid, base, pH, buffer
- oxidation, reduction, redox
- enthalpy, entropy, Gibbs free energy
- etc.

---

### Chemistry-Specific UI

**Pattern Analysis Section**:

- Chemistry patterns show alongside universal patterns
- Chemistry-specific metadata badges:
  - 🧪 **Problem Type**: stoichiometry, nomenclature, lewis-structure (blue badges)
  - ⚖️ **Balanced**: For chemical equations (green checkmark or warning)
  - 🔬 **Procedure Type**: Laboratory or Mechanism (green badges)

**Example UI Display**:

```
Chemical Equation
  2H₂ + O₂ → 2H₂O

  Confidence: 95%  |  Difficulty: easy  |  ⚖️ Balanced  |  ✅ Worked Example
```

```
Stoichiometry Problem
  Calculate mass of CO₂ from 10g CH₄...

  Confidence: 90%  |  Difficulty: medium  |  🧪 stoichiometry  |  ✅ Answer provided
```

```
Lab Procedure
  Titration procedure for determining acid concentration...

  Steps: 8  |  🔬 Lab  |  Confidence: 88%
```

---

## Future Domains (Planned)

### Finance Domain (Blueprint)

**6 Proposed Pattern Types**:

#### 1. Financial Equations

**Examples**: NPV, IRR, WACC, CAPM formulas

```
NPV = Σ(CFₜ / (1+r)ᵗ) - Initial Investment
IRR: NPV = 0
WACC = (E/V)×Rₑ + (D/V)×Rₐ×(1-Tᶜ)
```

**Metadata**:

- `formulaType`: "npv" | "irr" | "capm" | "wacc" | "dcf"
- `difficulty`: Based on multi-period vs. single-period

**Scoring Impact**:

- DeepProcessing: Formula understanding
- DualCoding: Symbolic + verbal representation

#### 2. Cash Flow Analysis

**Examples**: Cash flow tables, DCF models

```
Year 0: -$1,000,000 (initial investment)
Year 1: +$300,000
Year 2: +$400,000
Year 3: +$500,000
NPV @ 10%: $185,579
```

**Metadata**:

- `timeHorizon`: Number of periods
- `includesTerminalValue`: Boolean

**Scoring Impact**:

- DeepProcessing: Multi-period thinking
- CognitiveLoad: Manage complexity

#### 3. Valuation Problems

**Examples**: Stock valuation, business valuation

```
Value Company X using:
- P/E multiple approach
- DCF analysis
- Comparable company analysis
```

**Metadata**:

- `valuationMethod`: "pe" | "dcf" | "comps"
- `problemType`: "valuation"

**Scoring Impact**:

- RetrievalPractice: Apply valuation methods
- Interleaving: Multiple methods compared

#### 4. Financial Statements

**Examples**: Balance sheet, income statement, cash flow statement

```
Balance Sheet ($ millions)
Assets:
  Cash: $500
  Inventory: $200
  PP&E: $1,000
Total Assets: $1,700

Liabilities & Equity:
  Debt: $600
  Equity: $1,100
Total: $1,700
```

**Metadata**:

- `statementType`: "balance" | "income" | "cashflow"
- `includesRatios`: Boolean

**Scoring Impact**:

- SchemaBuilding: Financial statement structure
- DualCoding: Tabular visual format

#### 5. Case Studies

**Examples**: Investment decisions, M&A analysis

```
Case: Should Company A acquire Company B?

Background: [detailed scenario]
Financial data: [tables]
Questions:
1. Calculate synergies
2. Determine maximum price
3. Recommend deal structure
```

**Metadata**:

- `caseType`: "acquisition" | "investment" | "strategy"
- `complexity`: Number of variables

**Scoring Impact**:

- EmotionAndRelevance: Real-world scenarios
- GenerativeLearning: Open-ended analysis

#### 6. Portfolio Problems

**Examples**: Portfolio optimization, risk/return analysis

```
Construct optimal portfolio:
- Expected returns: A=10%, B=15%, C=8%
- Standard deviations: A=5%, B=20%, C=3%
- Correlations: [matrix]
- Risk tolerance: moderate
```

**Metadata**:

- `problemType`: "portfolio-optimization"
- `includesCorrelations`: Boolean

**Scoring Impact**:

- CognitiveLoad: Managing multiple variables
- RetrievalPractice: Applying portfolio theory

---

### Biology Domain (Blueprint)

**6 Proposed Pattern Types**:

#### 1. Biological Diagrams

**Examples**: Cell structures, organ systems, phylogenetic trees

**Detection**:

- References to figures showing anatomy
- Labels and annotations
- "Refer to Figure X showing..."

**Metadata**:

- `diagramType`: "cell" | "organ-system" | "phylogenetic" | "molecular"
- `labelCount`: Number of labeled parts

**Scoring Impact**:

- DualCoding: Visual + verbal integration
- SchemaBuilding: Hierarchical organization

#### 2. Classification Practice

**Examples**: Taxonomy, dichotomous keys

```
Classify: Kingdom → Phylum → Class → Order → Family → Genus → Species

Example: Human
Kingdom: Animalia
Phylum: Chordata
Class: Mammalia
Order: Primates
Family: Hominidae
Genus: Homo
Species: sapiens
```

**Metadata**:

- `taxonomicLevel`: Depth of classification
- `includesDichotomousKey`: Boolean

**Scoring Impact**:

- SchemaBuilding: Hierarchical taxonomic thinking
- RetrievalPractice: Classification recall

#### 3. Biological Processes

**Examples**: Cellular respiration, photosynthesis, mitosis

```
Cellular Respiration:
1. Glycolysis (cytoplasm)
2. Krebs cycle (mitochondrial matrix)
3. Electron transport chain (inner mitochondrial membrane)

Net: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 36-38 ATP
```

**Metadata**:

- `processType`: "metabolic" | "reproductive" | "developmental"
- `steps`: Number of stages

**Scoring Impact**:

- DeepProcessing: Process understanding
- Procedure detection: Step-by-step nature

#### 4. Genetics Problems

**Examples**: Punnett squares, inheritance patterns

```
Problem: Cross AaBb × AaBb. What ratio of offspring?

Solution:
[Punnett square diagram]
Phenotypic ratio: 9:3:3:1
```

**Metadata**:

- `problemType`: "genetics"
- `inheritancePattern`: "mendelian" | "linked" | "polygenic"

**Scoring Impact**:

- RetrievalPractice: Problem-solving
- DualCoding: Visual squares + calculations

#### 5. Ecological Relationships

**Examples**: Food webs, energy pyramids, population dynamics

```
Food Web:
Producers → Primary Consumers → Secondary Consumers → Tertiary Consumers

Energy transfer: ~10% per trophic level
```

**Metadata**:

- `ecologyType`: "food-web" | "population" | "community"
- `trophicLevels`: Number of levels

**Scoring Impact**:

- SchemaBuilding: Ecological organization
- InterestingVisualization: Network structure

#### 6. Lab Procedures

**Examples**: Dissections, microscopy, DNA extraction

```
Microscopy Procedure:
1. Place specimen on slide
2. Add drop of stain
3. Lower coverslip at 45° angle
4. Start at 4× objective
5. Center specimen
6. Switch to 10× objective
7. Focus using fine adjustment
```

**Metadata**:

- `procedureType`: "laboratory"
- `steps`: Number of steps
- Safety considerations

**Scoring Impact**:

- Similar to chemistry lab procedures
- Hands-on learning emphasis

---

### Computer Science Domain (Blueprint)

**6 Proposed Pattern Types**:

#### 1. Code Examples

**Examples**: Function implementations, class definitions

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

**Metadata**:

- `language`: Programming language
- `concept`: "algorithm" | "data-structure" | "pattern"
- `isWorkedExample`: Complete implementation vs. skeleton

**Scoring Impact**:

- DeepProcessing: Commented, explained code
- RetrievalPractice: Coding problems

#### 2. Algorithm Analysis

**Examples**: Time complexity, space complexity

```
Bubble Sort:
Time Complexity:
  Best case: O(n) [already sorted]
  Average case: O(n²)
  Worst case: O(n²)
Space Complexity: O(1)
```

**Metadata**:

- `algorithmName`: Specific algorithm
- `complexityType`: "time" | "space" | "both"

**Scoring Impact**:

- DeepProcessing: Understanding efficiency
- Comparison: Different algorithms

#### 3. Pseudocode

**Examples**: Algorithm descriptions without language syntax

```
Pseudocode: Merge Sort
1. If array length ≤ 1, return array
2. Divide array into two halves
3. Recursively sort left half
4. Recursively sort right half
5. Merge sorted halves
```

**Metadata**:

- `procedureType`: "algorithm"
- `recursionDepth`: Estimated recursion levels

**Scoring Impact**:

- CognitiveLoad: Abstraction vs. implementation
- Procedure: Step-by-step logic

#### 4. Data Structure Diagrams

**Examples**: Trees, graphs, linked lists

```
Binary Search Tree:
       50
      /  \
    30    70
   /  \   /  \
  20  40 60  80
```

**Metadata**:

- `dataStructure`: "tree" | "graph" | "list" | "hash"
- `visualType`: ASCII art, diagram reference

**Scoring Impact**:

- DualCoding: Visual structure representation
- SchemaBuilding: Hierarchical thinking

#### 5. Design Patterns

**Examples**: Singleton, Factory, Observer

```
Singleton Pattern:
- Ensures only one instance exists
- Provides global access point
- Lazy initialization

Implementation:
[code example]
```

**Metadata**:

- `patternType`: Specific design pattern
- `category`: "creational" | "structural" | "behavioral"

**Scoring Impact**:

- SchemaBuilding: Pattern taxonomy
- Interleaving: Compare multiple patterns

#### 6. Debugging Exercises

**Examples**: Find and fix bugs

```
Bug Hunt:
The following code has 3 bugs. Find and fix them:

def factorial(n):
    if n = 1:  # Bug 1
        return 1
    return n * factorial(n)  # Bug 2
```

**Metadata**:

- `problemType`: "debugging"
- `bugCount`: Number of bugs

**Scoring Impact**:

- GenerativeLearning: Active problem-solving
- Metacognition: Error awareness

---

## Creating New Domains

### Step-by-Step Guide

#### Step 1: Define Domain Patterns

**Template**: `src/utils/YourDomainPatterns.ts`

```typescript
import { Chapter, PatternMatch } from "../types/index";

export class YourDomainPatterns {
  /**
   * Main entry point: detects all domain-specific patterns
   */
  static detectAll(chapter: Chapter): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    patterns.push(...this.detectPattern1(chapter));
    patterns.push(...this.detectPattern2(chapter));
    patterns.push(...this.detectPattern3(chapter));
    // ... up to 6 pattern types recommended

    return patterns;
  }

  /**
   * Pattern 1: [Your pattern type]
   */
  private static detectPattern1(chapter: Chapter): PatternMatch[] {
    const matches: PatternMatch[] = [];

    // Your detection logic here
    // Examples:
    // - Regex matching
    // - Keyword detection
    // - Structural analysis

    // For each match found:
    matches.push({
      type: "workedExample", // or appropriate universal type
      title: "Your Pattern Name",
      context: matchedText.substring(0, 300),
      confidence: 0.85, // 0.0 to 1.0
      location: {
        section: chapter.sections[i].title,
        startIndex: startIdx,
        endIndex: endIdx,
      },
      metadata: {
        // Domain-specific metadata
        yourField1: value1,
        yourField2: value2,
        difficulty: "medium", // if applicable
        // ... more custom fields
      },
    });

    return matches;
  }

  // Implement detectPattern2, detectPattern3, etc.

  /**
   * Helper methods (optional)
   */
  private static helperMethod(text: string): boolean {
    // Utility functions for detection
    return /* some boolean check */;
  }
}
```

#### Step 2: Extend Type System

**File**: `types.ts`

```typescript
// Add domain-specific metadata fields
export interface PatternMatch {
  type: PatternType;
  title: string;
  context: string;
  confidence: number;
  location: {
    /* ... */
  };
  metadata?: {
    // Universal
    steps?: number;
    concepts?: string[];
    difficulty?: "easy" | "medium" | "hard";
    hasAnswer?: boolean;

    // Chemistry
    isBalanced?: boolean;
    problemType?: "stoichiometry" | "nomenclature" | "lewis-structure";
    procedureType?: "laboratory" | "mechanism";

    // YOUR DOMAIN: Add your fields
    yourDomainField1?: string;
    yourDomainField2?: number;
    yourDomainField3?: boolean;
    // ...
  };
}
```

#### Step 3: Integrate in PatternRecognizer

**File**: `src/utils/PatternRecognizer.ts`

```typescript
import { YourDomainPatterns } from "./YourDomainPatterns";

export class PatternRecognizer {
  static analyzePatterns(chapter: Chapter, domain?: string): PatternAnalysis {
    const patterns: PatternMatch[] = [];

    // Universal patterns (always)
    patterns.push(...this.detectWorkedExamples(chapter));
    // ... other universal patterns ...

    // Domain-specific patterns (conditional)
    if (domain === "chemistry") {
      const chemPatterns = ChemistryPatterns.detectAll(chapter);
      patterns.push(...chemPatterns);
    }

    // ADD YOUR DOMAIN:
    if (domain === "yourDomain") {
      const yourPatterns = YourDomainPatterns.detectAll(chapter);
      patterns.push(...yourPatterns);
    }

    return {
      totalPatterns: patterns.length,
      patterns: patterns,
      byType: this.groupByType(patterns),
      coverage: this.calculateCoverage(patterns, chapter),
    };
  }
}
```

#### Step 4: Enhance Evaluators

For each principle where your domain patterns are relevant:

**Example**: DeepProcessingEvaluator with your domain

```typescript
export class DeepProcessingEvaluator {
  static evaluate(
    chapter: Chapter,
    concepts: ConceptGraph,
    patternAnalysis?: any
  ): PrincipleEvaluation {
    // ... existing logic ...

    if (patternAnalysis) {
      // ... existing pattern checks ...

      // YOUR DOMAIN: Add domain-specific bonus
      const yourDomainPatterns = patternAnalysis.patterns.filter(
        (p: any) => p.metadata?.yourDomainField1 === "someValue"
      );

      if (yourDomainPatterns.length > threshold) {
        findings.push({
          type: "positive",
          message: `✓ YourDomain: ${yourDomainPatterns.length} patterns show deep understanding`,
          severity: 0,
          evidence: "Explain why this pattern indicates deep processing",
        });
      }
    }

    return {
      /* ... */
    };
  }
}
```

**Recommended Evaluators to Enhance**:

- DeepProcessingEvaluator (always relevant)
- RetrievalPracticeEvaluator (if you have practice problems)
- DualCodingEvaluator (if you have visual patterns)
- Others as appropriate for your domain

#### Step 5: Add UI Badges

**File**: `src/components/PatternAnalysisSection.tsx`

```typescript
// In the pattern display section (around line 280-320)

{
  /* Existing chemistry badges */
}
{
  pattern.metadata?.problemType && (
    <span
      style={
        {
          /* chemistry badge styles */
        }
      }
    >
      🧪 {pattern.metadata.problemType}
    </span>
  );
}

{
  /* ADD YOUR DOMAIN BADGES: */
}
{
  pattern.metadata?.yourDomainField1 && (
    <span
      style={{
        backgroundColor: "#your-color",
        padding: "2px 8px",
        borderRadius: "4px",
        color: "#your-text-color",
        fontWeight: 600,
      }}
    >
      [emoji] {pattern.metadata.yourDomainField1}
    </span>
  );
}
```

**Badge Color Recommendations**:

- Blue (#dbeafe / #1e40af): Quantitative problems
- Green (#dcfce7 / #166534): Procedures/processes
- Purple (#f3e8ff / #6b21a8): Concepts/definitions
- Orange (#fed7aa / #c2410c): Comparisons/contrasts
- Red (#fee2e2 / #991b1b): Errors/warnings

#### Step 6: Create Concept Library (Optional)

**File**: `src/data/yourDomainConceptLibrary.ts`

```typescript
export const yourDomainConceptLibrary = {
  subject: "YourDomain",
  version: "1.0",
  concepts: [
    {
      term: "fundamental concept 1",
      importance: "core",
      category: "foundation",
      relatedConcepts: ["related1", "related2"],
      commonMisconceptions: ["Misconception 1", "Misconception 2"],
    },
    {
      term: "supporting concept 1",
      importance: undefined,
      category: "application",
      relatedConcepts: ["fundamental concept 1"],
      commonMisconceptions: [],
    },
    // ... add 100-500 concepts for comprehensive coverage
  ],
};
```

**Importance Guidelines**:

- Mark ~20% as `"core"` (foundational, must-know)
- Leave ~80% as `undefined` (supporting, detail)

**Category Suggestions**:

- Group concepts logically (e.g., chemistry: "matter_structure", "reactions", "thermodynamics")
- Helps with automatic hierarchy building

#### Step 7: Register in ConceptExtractor

**File**: `src/components/ConceptExtractorLibrary.ts`

```typescript
import { yourDomainConceptLibrary } from "../data/yourDomainConceptLibrary";

// In identifyCandidatesFromLibrary method:
let library;
switch (domain?.toLowerCase()) {
  case "chemistry":
    library = chemistryConceptLibrary;
    break;
  case "yourDomain": // ADD
    library = yourDomainConceptLibrary;
    break;
  default:
    library = crossDomainConcepts;
}
```

#### Step 8: Test Your Domain

**Test Checklist**:

- [ ] Patterns detected correctly
- [ ] Metadata captured accurately
- [ ] Confidence scores reasonable (0.7-0.95)
- [ ] No false positives
- [ ] Evaluator bonuses triggering
- [ ] UI badges displaying
- [ ] Concept library loading
- [ ] Overall scores improving for domain content

**Test Content**:

- Use actual textbook chapters from your domain
- Start with clear, well-structured examples
- Test edge cases (ambiguous patterns, missing metadata)

---

## Domain Detection

### Automatic Domain Inference (Future)

Currently, domain is specified manually. Future implementation could infer domain from content:

```typescript
function inferDomain(chapter: Chapter): string {
  const domainSignals = {
    chemistry: [
      /chemical equation/gi,
      /stoichiometry/gi,
      /\b[A-Z][a-z]?\d*\s*→/g, // Chemical formulas with arrow
      /periodic table/gi,
      /mole/gi,
    ],
    finance: [
      /NPV|IRR|WACC/gi,
      /cash flow/gi,
      /valuation/gi,
      /\$/g, // Dollar signs frequent
      /portfolio/gi,
    ],
    biology: [
      /cell/gi,
      /organism/gi,
      /phylogenetic/gi,
      /taxonomy/gi,
      /mitochondria|chloroplast/gi,
    ],
    // ... more domains
  };

  const scores: Record<string, number> = {};

  for (const [domain, patterns] of Object.entries(domainSignals)) {
    scores[domain] = patterns.reduce((sum, pattern) => {
      return sum + (chapter.content.match(pattern) || []).length;
    }, 0);
  }

  // Return domain with highest score
  return Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
}
```

### Manual Domain Selection (Current)

Users currently select domain via:

1. **Dropdown in UI** (future feature)
2. **Automatic detection from file metadata** (future)
3. **Default**: Universal analysis (no domain-specific patterns)

---

## Best Practices for Domain Development

### 1. Start Simple

- Implement 2-3 pattern types first
- Test thoroughly
- Add more patterns incrementally

### 2. Focus on Unique Patterns

- Don't duplicate universal patterns
- Target domain-specific pedagogical structures
- Ask: "What would a generic tool miss?"

### 3. Balance Precision and Recall

- **High precision** (few false positives) > **High recall** (catch everything)
- Better to miss some patterns than incorrectly identify them
- Use confidence scores to indicate uncertainty

### 4. Test with Real Content

- Use actual textbooks, not synthetic examples
- Test across multiple chapters
- Verify with domain experts

### 5. Document Your Patterns

- Explain what each pattern represents
- Provide example text that matches
- Document regex patterns clearly

### 6. Provide Metadata

- Rich metadata helps evaluators use patterns intelligently
- Think about what instructors would want to know
- Consider difficulty, type, completeness

### 7. Integrate Thoughtfully

- Not every evaluator needs every pattern
- Match patterns to relevant principles
- Explain _why_ a pattern matters for a principle

---

## Conclusion

Domain-specific intelligence transforms generic analysis into **expert-level discipline-aware evaluation**. The architecture supports:

✅ **Universal patterns** (always valuable)
✅ **Domain-specific patterns** (high-value specialization)
✅ **Extensible design** (easy to add new domains)
✅ **Rich metadata** (context-aware scoring)
✅ **Clear UI presentation** (visible to users)

**Current Status**:

- ✅ Chemistry: Fully implemented (6 patterns, concept library, evaluator integration, UI)
- 📋 Finance: Planned (blueprint complete)
- 📋 Biology: Planned (blueprint complete)
- 📋 Computer Science: Planned (blueprint complete)

**Getting Started with New Domain**:

1. Study the ChemistryPatterns implementation
2. Follow the step-by-step guide above
3. Test thoroughly with real content
4. Iterate based on false positives/negatives

The system is designed to grow. Each new domain makes the tool more valuable for educators across disciplines.
