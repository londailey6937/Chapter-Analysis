/**
 * Algebra and Trigonometry Concept Library
 *
 * Comprehensive list of core, supporting, and advanced concepts
 * commonly found in algebra and trigonometry textbooks
 */

import { ConceptLibrary } from "./conceptLibraryTypes";

export const ALGEBRA_TRIG_CONCEPTS: ConceptLibrary = {
  domain: "Algebra & Trigonometry",
  version: "1.0.0",
  concepts: [
    // ========== CORE ALGEBRA CONCEPTS ==========
    {
      name: "variable",
      category: "Algebra Fundamentals",
      importance: "core",
      aliases: ["unknown", "placeholder"],
    },
    {
      name: "equation",
      category: "Algebra Fundamentals",
      importance: "core",
      aliases: ["algebraic equation"],
    },
    {
      name: "expression",
      category: "Algebra Fundamentals",
      importance: "core",
      aliases: ["algebraic expression", "polynomial expression"],
    },
    {
      name: "coefficient",
      category: "Algebra Fundamentals",
      importance: "core",
    },
    {
      name: "constant",
      category: "Algebra Fundamentals",
      importance: "core",
      aliases: ["constant term"],
    },
    {
      name: "exponent",
      category: "Algebra Fundamentals",
      importance: "core",
      aliases: ["power", "index"],
    },
    {
      name: "polynomial",
      category: "Polynomials",
      importance: "core",
      aliases: ["polynomial expression"],
    },
    {
      name: "monomial",
      category: "Polynomials",
      importance: "supporting",
    },
    {
      name: "binomial",
      category: "Polynomials",
      importance: "supporting",
    },
    {
      name: "trinomial",
      category: "Polynomials",
      importance: "supporting",
    },
    {
      name: "degree",
      category: "Polynomials",
      importance: "core",
      aliases: ["degree of polynomial"],
    },
    {
      name: "factoring",
      category: "Polynomials",
      importance: "core",
      aliases: ["factorization", "factor"],
    },
    {
      name: "quadratic equation",
      category: "Equations",
      importance: "core",
      aliases: ["quadratic"],
    },
    {
      name: "linear equation",
      category: "Equations",
      importance: "core",
      aliases: ["linear"],
    },
    {
      name: "system of equations",
      category: "Equations",
      importance: "core",
      aliases: ["simultaneous equations"],
    },
    {
      name: "inequality",
      category: "Equations",
      importance: "core",
      aliases: ["inequalities"],
    },
    {
      name: "absolute value",
      category: "Functions",
      importance: "core",
    },

    // ========== FUNCTION CONCEPTS ==========
    {
      name: "function",
      category: "Functions",
      importance: "core",
    },
    {
      name: "domain",
      category: "Functions",
      importance: "core",
      aliases: ["domain of function"],
    },
    {
      name: "range",
      category: "Functions",
      importance: "core",
      aliases: ["range of function", "codomain"],
    },
    {
      name: "inverse function",
      category: "Functions",
      importance: "core",
      aliases: ["inverse"],
    },
    {
      name: "composition",
      category: "Functions",
      importance: "supporting",
      aliases: ["function composition", "composite function"],
    },
    {
      name: "one-to-one function",
      category: "Functions",
      importance: "supporting",
      aliases: ["injective", "injection"],
    },
    {
      name: "linear function",
      category: "Functions",
      importance: "core",
    },
    {
      name: "quadratic function",
      category: "Functions",
      importance: "core",
      aliases: ["parabola", "parabolic function"],
    },
    {
      name: "exponential function",
      category: "Functions",
      importance: "core",
      aliases: ["exponential growth", "exponential decay"],
    },
    {
      name: "logarithmic function",
      category: "Functions",
      importance: "core",
      aliases: ["logarithm", "log function"],
    },
    {
      name: "rational function",
      category: "Functions",
      importance: "core",
    },
    {
      name: "piecewise function",
      category: "Functions",
      importance: "supporting",
      aliases: ["piecewise-defined function"],
    },

    // ========== GRAPHING CONCEPTS ==========
    {
      name: "coordinate plane",
      category: "Graphing",
      importance: "core",
      aliases: ["Cartesian plane", "xy-plane"],
    },
    {
      name: "slope",
      category: "Graphing",
      importance: "core",
      aliases: ["gradient", "rate of change"],
    },
    {
      name: "y-intercept",
      category: "Graphing",
      importance: "core",
      aliases: ["intercept"],
    },
    {
      name: "x-intercept",
      category: "Graphing",
      importance: "core",
      aliases: ["root", "zero"],
    },
    {
      name: "vertex",
      category: "Graphing",
      importance: "core",
      aliases: ["turning point"],
    },
    {
      name: "asymptote",
      category: "Graphing",
      importance: "core",
      aliases: ["vertical asymptote", "horizontal asymptote"],
    },
    {
      name: "symmetry",
      category: "Graphing",
      importance: "supporting",
      aliases: ["symmetric", "axis of symmetry"],
    },
    {
      name: "transformation",
      category: "Graphing",
      importance: "core",
      aliases: ["translation", "shift", "stretch", "reflection"],
    },

    // ========== CORE TRIGONOMETRY CONCEPTS ==========
    {
      name: "angle",
      category: "Trigonometry Fundamentals",
      importance: "core",
    },
    {
      name: "radian",
      category: "Trigonometry Fundamentals",
      importance: "core",
      aliases: ["radian measure"],
    },
    {
      name: "degree",
      category: "Trigonometry Fundamentals",
      importance: "core",
      aliases: ["degree measure"],
    },
    {
      name: "unit circle",
      category: "Trigonometry Fundamentals",
      importance: "core",
    },
    {
      name: "sine",
      category: "Trigonometric Functions",
      importance: "core",
      aliases: ["sin"],
    },
    {
      name: "cosine",
      category: "Trigonometric Functions",
      importance: "core",
      aliases: ["cos"],
    },
    {
      name: "tangent",
      category: "Trigonometric Functions",
      importance: "core",
      aliases: ["tan"],
    },
    {
      name: "cosecant",
      category: "Trigonometric Functions",
      importance: "supporting",
      aliases: ["csc"],
    },
    {
      name: "secant",
      category: "Trigonometric Functions",
      importance: "supporting",
      aliases: ["sec"],
    },
    {
      name: "cotangent",
      category: "Trigonometric Functions",
      importance: "supporting",
      aliases: ["cot"],
    },
    {
      name: "trigonometric identity",
      category: "Trigonometric Identities",
      importance: "core",
      aliases: ["trig identity"],
    },
    {
      name: "Pythagorean identity",
      category: "Trigonometric Identities",
      importance: "core",
    },
    {
      name: "sum and difference formula",
      category: "Trigonometric Identities",
      importance: "supporting",
      aliases: ["angle sum", "angle difference"],
    },
    {
      name: "double angle formula",
      category: "Trigonometric Identities",
      importance: "supporting",
      aliases: ["double angle identity"],
    },
    {
      name: "half angle formula",
      category: "Trigonometric Identities",
      importance: "supporting",
      aliases: ["half angle identity"],
    },

    // ========== TRIANGLE CONCEPTS ==========
    {
      name: "right triangle",
      category: "Triangles",
      importance: "core",
      aliases: ["right-angled triangle"],
    },
    {
      name: "hypotenuse",
      category: "Triangles",
      importance: "core",
    },
    {
      name: "opposite side",
      category: "Triangles",
      importance: "supporting",
      aliases: ["opposite"],
    },
    {
      name: "adjacent side",
      category: "Triangles",
      importance: "supporting",
      aliases: ["adjacent"],
    },
    {
      name: "Pythagorean theorem",
      category: "Triangles",
      importance: "core",
      aliases: ["Pythagoras theorem"],
    },
    {
      name: "law of sines",
      category: "Triangles",
      importance: "core",
      aliases: ["sine rule", "sine law"],
    },
    {
      name: "law of cosines",
      category: "Triangles",
      importance: "core",
      aliases: ["cosine rule", "cosine law"],
    },

    // ========== ADVANCED CONCEPTS ==========
    {
      name: "complex number",
      category: "Complex Numbers",
      importance: "core",
      aliases: ["imaginary number"],
    },
    {
      name: "imaginary unit",
      category: "Complex Numbers",
      importance: "core",
      aliases: ["i", "imaginary i"],
    },
    {
      name: "real part",
      category: "Complex Numbers",
      importance: "supporting",
    },
    {
      name: "imaginary part",
      category: "Complex Numbers",
      importance: "supporting",
    },
    {
      name: "conjugate",
      category: "Complex Numbers",
      importance: "supporting",
      aliases: ["complex conjugate"],
    },
    {
      name: "polar form",
      category: "Complex Numbers",
      importance: "supporting",
      aliases: ["polar representation"],
    },
    {
      name: "sequence",
      category: "Sequences and Series",
      importance: "core",
    },
    {
      name: "series",
      category: "Sequences and Series",
      importance: "core",
    },
    {
      name: "arithmetic sequence",
      category: "Sequences and Series",
      importance: "core",
      aliases: ["arithmetic progression"],
    },
    {
      name: "geometric sequence",
      category: "Sequences and Series",
      importance: "core",
      aliases: ["geometric progression"],
    },
    {
      name: "common difference",
      category: "Sequences and Series",
      importance: "supporting",
    },
    {
      name: "common ratio",
      category: "Sequences and Series",
      importance: "supporting",
    },
    {
      name: "matrix",
      category: "Matrices",
      importance: "core",
      aliases: ["matrices"],
    },
    {
      name: "determinant",
      category: "Matrices",
      importance: "supporting",
    },
    {
      name: "identity matrix",
      category: "Matrices",
      importance: "supporting",
    },
    {
      name: "inverse matrix",
      category: "Matrices",
      importance: "supporting",
      aliases: ["matrix inverse"],
    },
    {
      name: "vector",
      category: "Vectors",
      importance: "core",
    },
    {
      name: "magnitude",
      category: "Vectors",
      importance: "supporting",
      aliases: ["length", "norm"],
    },
    {
      name: "dot product",
      category: "Vectors",
      importance: "supporting",
      aliases: ["scalar product"],
    },
    {
      name: "cross product",
      category: "Vectors",
      importance: "detail",
      aliases: ["vector product"],
    },

    // ========== PROBLEM SOLVING CONCEPTS ==========
    {
      name: "solution",
      category: "Problem Solving",
      importance: "core",
      aliases: ["solve", "solving"],
    },
    {
      name: "substitution",
      category: "Problem Solving",
      importance: "supporting",
      aliases: ["substitution method"],
    },
    {
      name: "elimination",
      category: "Problem Solving",
      importance: "supporting",
      aliases: ["elimination method"],
    },
    {
      name: "completing the square",
      category: "Problem Solving",
      importance: "supporting",
    },
    {
      name: "quadratic formula",
      category: "Problem Solving",
      importance: "core",
    },
    {
      name: "discriminant",
      category: "Problem Solving",
      importance: "supporting",
    },
    {
      name: "factorization",
      category: "Problem Solving",
      importance: "core",
      aliases: ["factor form"],
    },
    {
      name: "simplification",
      category: "Problem Solving",
      importance: "supporting",
      aliases: ["simplify", "reduce"],
    },
    {
      name: "rationalization",
      category: "Problem Solving",
      importance: "supporting",
      aliases: ["rationalize"],
    },
  ],
};
