/**
 * Category Hierarchy for Prerequisite Ordering
 *
 * Defines the natural learning progression for mathematics categories.
 * Lower-level categories should be taught before higher-level ones.
 * Used by PrerequisiteOrderCard to detect out-of-sequence concepts.
 */

export interface CategoryLevel {
  level: number;
  categories: string[];
  description: string;
}

/**
 * Mathematics Category Hierarchy
 *
 * Level structure:
 * 0. Elementary - Basic arithmetic, counting, fractions, decimals
 * 1. Fundamentals - Basic algebra, arithmetic, geometry basics
 * 2. Intermediate - Advanced algebra, geometry, trigonometry
 * 3. Advanced - Calculus prerequisites, discrete math, linear algebra intro
 * 4. Calculus - Differential and integral calculus
 * 5. Advanced Topics - Multivariable calculus, differential equations, advanced linear algebra
 */
export const MATHEMATICS_CATEGORY_HIERARCHY: CategoryLevel[] = [
  {
    level: 0,
    categories: [
      "Arithmetic Fundamentals",
      "Basic Operations",
      "Fractions",
      "Decimals",
      "Percentages",
      "Ratios and Proportions",
      "Order of Operations",
    ],
    description:
      "Elementary mathematics - counting, arithmetic, fractions, decimals",
  },
  {
    level: 1,
    categories: [
      "Algebra Fundamentals",
      "Equations",
      "Polynomials",
      "Basic Elements", // Geometry basics
      "Angles",
      "Number Theory",
    ],
    description: "Foundation concepts - required for all higher mathematics",
  },
  {
    level: 2,
    categories: [
      "Functions",
      "Graphing",
      "Geometry", // General geometry
      "Triangles",
      "Quadrilaterals",
      "Circles",
      "Coordinate Geometry",
      "Transformations",
      "Complex Numbers",
      "Sequences and Series",
      "Trigonometry Fundamentals",
      "Problem Solving",
    ],
    description: "Intermediate algebra and geometry - builds on fundamentals",
  },
  {
    level: 3,
    categories: [
      "Trigonometric Functions",
      "Trigonometric Identities",
      "Hyperbolic Functions",
      "Spherical Trigonometry",
      "Matrices",
      "Matrix Algebra",
      "Vectors",
      "3D Shapes",
      "Analytic Geometry",
      "Linear Algebra",
      "Discrete Mathematics",
      "Graph Theory",
      "Combinatorics",
      "Algorithms",
      "Boolean Algebra",
      "Logic",
      "Set Theory",
      "Probability and Statistics",
    ],
    description: "Advanced pre-calculus topics and discrete mathematics",
  },
  {
    level: 4,
    categories: [
      "Calculus Fundamentals",
      "Differential Calculus",
      "Integral Calculus",
    ],
    description:
      "Core calculus - requires algebra, trigonometry, and functions",
  },
  {
    level: 5,
    categories: [
      "Multivariable Calculus",
      "Differential Equations",
      "Numerical Methods",
      "Optimization",
      "Abstract Algebra",
    ],
    description: "Advanced calculus and applied mathematics",
  },
];

/**
 * Get the hierarchy level for a given category
 */
export function getCategoryLevel(category: string): number {
  for (const level of MATHEMATICS_CATEGORY_HIERARCHY) {
    if (level.categories.includes(category)) {
      return level.level;
    }
  }
  // Default to level 3 (advanced) if not found
  return 3;
}

/**
 * Check if category A should come before category B in natural learning sequence
 */
export function shouldPrecedeCategory(
  categoryA: string,
  categoryB: string
): boolean {
  const levelA = getCategoryLevel(categoryA);
  const levelB = getCategoryLevel(categoryB);
  return levelA < levelB;
}

/**
 * Get category hierarchy for a domain
 * Currently only mathematics has a defined hierarchy
 */
export function getCategoryHierarchy(domain: string): CategoryLevel[] | null {
  if (domain === "mathematics") {
    return MATHEMATICS_CATEGORY_HIERARCHY;
  }
  return null;
}

/**
 * Category ordering rules as simple prerequisite map
 * Useful for quick lookups
 *
 * Note: Basic progressions (Arithmetic → Algebra, Algebra → Advanced topics)
 * are handled by level hierarchy and don't need explicit prerequisites here.
 * Only list non-obvious or specific relationships.
 */
export const CATEGORY_PREREQUISITES: Record<string, string[]> = {
  // Trigonometry requires algebra
  "Trigonometry Fundamentals": ["Functions", "Equations"],
  "Trigonometric Functions": ["Trigonometry Fundamentals", "Functions"],
  "Trigonometric Identities": ["Trigonometric Functions"],
  "Hyperbolic Functions": ["Trigonometric Functions"],
  "Spherical Trigonometry": [
    "Trigonometric Functions",
    "Trigonometry Fundamentals",
  ],

  // Calculus requires algebra, functions, trigonometry
  "Calculus Fundamentals": ["Functions", "Graphing", "Trigonometric Functions"],
  "Differential Calculus": ["Calculus Fundamentals"],
  "Integral Calculus": ["Differential Calculus"],
  "Multivariable Calculus": [
    "Differential Calculus",
    "Integral Calculus",
    "Vectors",
  ],
  "Differential Equations": ["Differential Calculus", "Integral Calculus"],

  // Linear Algebra requires basic algebra and matrices
  "Linear Algebra": ["Matrices", "Vectors"],

  // Advanced geometry requires basics
  "Coordinate Geometry": ["Graphing", "Geometry"],
  "Analytic Geometry": ["Coordinate Geometry", "Vectors"],
  "3D Shapes": ["Geometry", "Triangles", "Circles"],

  // Discrete math foundations
  "Graph Theory": ["Discrete Mathematics", "Set Theory"],
  Combinatorics: ["Discrete Mathematics"],
  Algorithms: ["Discrete Mathematics", "Logic"],
  "Boolean Algebra": ["Logic", "Set Theory"],

  // Statistics requires basic algebra
  "Probability and Statistics": ["Functions", "Sequences and Series"],

  // Optimization requires calculus
  Optimization: ["Differential Calculus", "Linear Algebra"],
  "Numerical Methods": ["Calculus Fundamentals", "Matrices"],
};

/**
 * Get prerequisite categories for a given category
 */
export function getCategoryPrerequisites(category: string): string[] {
  return CATEGORY_PREREQUISITES[category] || [];
}
