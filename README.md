# Chapter Checker: Learning Science-Based Chapter Analysis Tool

A React application that analyzes chapters against 10 evidence-based learning principles to help educators and writers create more effective learning materials.

## 🎯 Overview

The Chapter Checker evaluates educational content using cognitive science principles to provide actionable insights for improvement. It combines NLP for concept extraction, principle-based evaluation, and interactive visualizations.

## 🧠 The 10 Learning Principles Evaluated

1. **Deep Processing & Elaboration** - Does the content encourage active meaning-making?
2. **Spaced Repetition** - Are concepts revisited at optimal intervals?
3. **Retrieval Practice** - Does it prompt active recall without reference materials?
4. **Interleaving** - Are topics mixed or isolated?
5. **Dual Coding** - Combination of verbal and visual representations
6. **Generative Learning** - Does it prompt creation/prediction?
7. **Metacognition** - Self-assessment and reflection opportunities
8. **Schema Building** - Concept hierarchy and meaningful chunking
9. **Cognitive Load Management** - Appropriate segmentation and pacing
10. **Emotion & Relevance** - Personal connection and narrative elements

## 📁 File Structure

```
├── types.ts                              # TypeScript type definitions
├── ConceptExtractor.ts                   # NLP-based concept extraction engine
├── LearningPrincipleEvaluators.ts        # Evaluators for each principle
├── AnalysisEngine.ts                     # Orchestration and report generation
├── VisualizationComponents.tsx           # React components with Recharts/D3
├── ChapterChecker.tsx                    # Main application component
└── README.md                             # This file
```

## 🚀 Installation & Setup

### Prerequisites

```bash
Node.js >= 14.0
React >= 18.0
Recharts >= 2.0
```

### Installation

```bash
npm install recharts
```

### Usage in Your React App

```tsx
import React from 'react';
import { ChapterChecker } from './ChapterChecker';

function App() {
  return <ChapterChecker />;
}

export default App;
```

## 🏗️ Architecture

### Data Flow

```
User Input (Chapter Text)
    ↓
    ├─→ Section Parsing (identify headings, segments)
    ├─→ Word Count & Reading Level Estimation
    ↓
Concept Extraction Engine
    ├─→ Candidate Identification (NLP patterns)
    ├─→ Scoring & Filtering (TF-IDF, frequency)
    ├─→ Concept Object Creation (with mentions)
    ├─→ Relationship Establishment
    ├─→ Hierarchy Building (core, supporting, detail)
    └─→ Sequence Extraction
    ↓
Learning Principle Evaluation (10 Evaluators)
    ├─→ Deep Processing Analyzer
    ├─→ Spaced Repetition Analyzer
    ├─→ Retrieval Practice Analyzer
    ├─→ Interleaving Analyzer
    ├─→ Dual Coding Analyzer
    ├─→ Generative Learning Analyzer
    ├─→ Metacognition Analyzer
    ├─→ Schema Building Analyzer
    ├─→ Cognitive Load Analyzer
    └─→ Emotion & Relevance Analyzer
    ↓
Analysis Engine
    ├─→ Concept Structure Analysis
    ├─→ Chapter Structure Analysis
    ├─→ Recommendation Generation
    ├─→ Visualization Data Generation
    └─→ Weighted Score Calculation
    ↓
Dashboard Visualization
    ├─→ Principle Scores Radar Chart
    ├─→ Cognitive Load Curve
    ├─→ Concept Mention Frequency
    ├─→ Concept Relationship Map
    ├─→ Interleaving Pattern
    └─→ Review Schedule Timeline
    ↓
User-Friendly Report with Recommendations
```

## 📊 Key Components Explained

### 1. **ConceptExtractor.ts**

Identifies key concepts using:
- **NLP Patterns**: "X is a Y", "X refers to Y"
- **Structural Signals**: Headings, capitalization
- **Frequency Analysis**: TF-IDF scoring
- **Mention Tracking**: Position, context, depth estimation

```typescript
const conceptGraph = await ConceptExtractor.extractConceptsFromChapter(
  chapterText,
  sections
);
```

**Output**: Concept objects with:
- Name, definition, importance
- Mention positions and depth
- Related concepts and prerequisites
- Common misconceptions

### 2. **LearningPrincipleEvaluators.ts**

Each principle has its own evaluator class:

```typescript
const evaluation = DeepProcessingEvaluator.evaluate(chapter, concepts);
// Returns: { principle, score, weight, findings, suggestions, evidence }
```

**Key Features**:
- Evidence-based scoring (0-100)
- Weighted importance (0-1)
- Specific, actionable findings
- Tailored suggestions with implementation guidance
- Supporting evidence and metrics

### 3. **AnalysisEngine.ts**

Orchestrates the entire analysis pipeline:

```typescript
const analysis = await AnalysisEngine.analyzeChapter(chapter, config);
// Returns: ChapterAnalysis with all results, visualizations, recommendations
```

**Analysis Includes**:
- Concept graph analysis
- Chapter structure evaluation
- 10 principle evaluations
- Prioritized recommendations
- Visualization data generation
- Overall weighted score

### 4. **VisualizationComponents.tsx**

Interactive visualizations using React + Recharts:

- **Principle Scores Radar** - Shows strengths/weaknesses
- **Cognitive Load Curve** - Identifies challenging sections
- **Concept Mention Frequency** - Spaced repetition status
- **Concept Map** - Knowledge relationships
- **Interleaving Pattern** - Topic mixing analysis
- **Review Schedule** - Optimal spacing suggestions

### 5. **ChapterChecker.tsx**

Main application component with:
- File upload support
- Real-time analysis with progress
- Error handling
- Export functionality
- Responsive design

## 💡 Usage Examples

### Basic Usage

```tsx
import { ChapterChecker } from './ChapterChecker';

function MyApp() {
  return <ChapterChecker />;
}
```

### Programmatic Analysis

```typescript
import { AnalysisEngine } from './AnalysisEngine';
import ConceptExtractor from './ConceptExtractor';

async function analyzeMyChapter() {
  const chapter: Chapter = {
    id: 'my-chapter',
    title: 'Introduction to Learning',
    content: chapterText,
    wordCount: 2500,
    sections: parsedSections,
    conceptGraph: { /* ... */ },
    metadata: { /* ... */ }
  };

  const config: AnalysisConfig = {
    domain: 'education',
    readingLevel: 'intermediate',
    enableVisualization: true,
    conceptExtractionThreshold: 0.5,
    detailedReport: true
  };

  const analysis = await AnalysisEngine.analyzeChapter(chapter, config);
  
  console.log(`Overall Score: ${analysis.overallScore}/100`);
  console.log(`Concepts Found: ${analysis.conceptAnalysis.totalConceptsIdentified}`);
  
  analysis.principles.forEach(p => {
    console.log(`${p.principle}: ${p.score}/100`);
  });
  
  // Get top recommendations
  analysis.recommendations.forEach(rec => {
    console.log(`[${rec.priority}] ${rec.title}`);
    console.log(`  ${rec.description}`);
    rec.actionItems.forEach(item => console.log(`  - ${item}`));
  });
}
```

### Custom Evaluator

```typescript
import {
  PrincipleEvaluation,
  Finding,
  Chapter,
  ConceptGraph
} from './types';

class CustomPrincipleEvaluator {
  static evaluate(chapter: Chapter, concepts: ConceptGraph): PrincipleEvaluation {
    // Your custom evaluation logic
    return {
      principle: 'customPrinciple' as any,
      score: 75,
      weight: 0.8,
      findings: [/* ... */],
      suggestions: [/* ... */],
      evidence: [/* ... */]
    };
  }
}
```

## 📈 Output Structure

### ChapterAnalysis Object

```typescript
{
  chapterId: string;
  timestamp: Date;
  overallScore: number;              // 0-100
  principles: PrincipleEvaluation[]; // 10 principles
  conceptAnalysis: {
    totalConceptsIdentified: number;
    coreConceptCount: number;
    conceptDensity: number;          // Per 1000 words
    novelConceptsPerSection: number[];
    reviewPatterns: ReviewPattern[];
    hierarchyBalance: number;
    orphanConcepts: string[];
  };
  structureAnalysis: {
    sectionCount: number;
    avgSectionLength: number;
    pacing: 'slow' | 'moderate' | 'fast';
    scaffolding: ScaffoldingAnalysis;
    transitionQuality: number;
  };
  recommendations: Recommendation[];  // Prioritized suggestions
  visualizations: AnalysisVisualization;
}
```

## 🎯 Interpretation Guide

### Overall Score

- **80-100**: Excellent learning design; strong implementation of principles
- **60-79**: Good foundation; some principles need strengthening
- **40-59**: Moderate effectiveness; significant room for improvement
- **0-39**: Needs substantial revision for learning effectiveness

### Individual Principle Scores

Each principle is scored 0-100:
- **80+**: Excellent implementation
- **60-79**: Good, minor improvements possible
- **40-59**: Adequate, but should improve
- **0-39**: Needs significant work

## 🔧 Customization

### Adjust Principle Weights

```typescript
// In AnalysisEngine.ts
private static evaluateAllPrinciples(...) {
  const principles = [...];
  
  // Custom weights
  principles.find(p => p.principle === 'deepProcessing')!.weight = 1.0;
  principles.find(p => p.principle === 'emotionAndRelevance')!.weight = 0.6;
  
  return principles;
}
```

### Add Domain-Specific Analysis

```typescript
// Extend concept extraction for technical domains
private static identifyTechnicalTerms(text: string) {
  // Domain-specific patterns
  return technicalConcepts;
}
```

### Modify Scoring Thresholds

Each evaluator contains configurable thresholds:

```typescript
// In DeepProcessingEvaluator.ts
const hasWhyQuestions = countWhyHowQuestions(chapter.content);
const threshold = Math.ceil(chapter.wordCount / 500); // Adjust as needed
```

## 📝 Integration with Learning Management Systems

```typescript
// Export to LMS format
const exportData = {
  chapterId: analysis.chapterId,
  score: analysis.overallScore,
  timestamp: analysis.timestamp,
  principles: analysis.principles.map(p => ({
    name: p.principle,
    score: p.score,
    recommendations: p.suggestions.map(s => s.description)
  })),
  recommendations: analysis.recommendations.map(r => ({
    id: r.id,
    title: r.title,
    priority: r.priority,
    action: r.actionItems.join('; ')
  }))
};

// Send to LMS API
fetch('/api/chapter-analysis', {
  method: 'POST',
  body: JSON.stringify(exportData)
});
```

## 🚨 Performance Notes

- **Analysis Time**: 2-5 seconds for typical 3000-word chapters
- **Memory Usage**: ~50MB for concept graph with 50+ concepts
- **Optimization**: Cache concept extraction for repeated analyses

```typescript
// Memoize concept extraction
const conceptCache = new Map<string, ConceptGraph>();

async function getConcepts(text: string) {
  const hash = hashContent(text);
  if (conceptCache.has(hash)) {
    return conceptCache.get(hash)!;
  }
  
  const result = await ConceptExtractor.extractConceptsFromChapter(text, sections);
  conceptCache.set(hash, result);
  return result;
}
```

## 🐛 Troubleshooting

**Issue**: Analysis takes too long
- Solution: Reduce section size or disable visualization

**Issue**: Low concept detection
- Solution: Increase `conceptExtractionThreshold` or ensure sections have headings

**Issue**: Unbalanced hierarchy
- Solution: Check if chapter properly introduces concepts before details

## 📚 References

The 10 principles are based on:

1. **Elaboration**: Craik & Lockhart (1972), Craik & Tulving (1975)
2. **Spaced Repetition**: Ebbinghaus (1885), Cepeda et al. (2006)
3. **Retrieval Practice**: Roediger & Karpicke (2006)
4. **Interleaving**: Rohrer & Taylor (2007), Kornell & Bjork (2008)
5. **Dual Coding**: Paivio (1986), Mayer (2009)
6. **Generative Learning**: Slamecka & Graf (1978)
7. **Metacognition**: Flavell (1979), Nelson & Narens (1990)
8. **Schema Building**: Chi (2000), Ericsson & Kintsch (1995)
9. **Cognitive Load**: Sweller (1988)
10. **Emotion & Relevance**: Kensinger & Corkin (2003)

## 📄 License

MIT

## 👨‍💻 Contributing

Contributions welcome! Areas for enhancement:

- [ ] Support for PDF/DOCX uploads
- [ ] Multi-language support
- [ ] Real-time collaborative analysis
- [ ] Integration with reading analytics
- [ ] Machine learning-based concept extraction
- [ ] API endpoints for external integration

---

**Built with React, TypeScript, and Cognitive Science** 🧠✨
