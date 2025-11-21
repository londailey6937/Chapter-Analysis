/**
 * Mathematics Concept Library
 *
 * Comprehensive library covering algebra, trigonometry, calculus, and advanced mathematics.
 * Organized by major topic areas for efficient concept identification.
 */

import { ConceptLibrary } from "./conceptLibraryTypes";

export const MATHEMATICS_CONCEPTS: ConceptLibrary = {
  domain: "Mathematics",
  version: "2.0.0",
  concepts: [
    // ========== ALGEBRA FUNDAMENTALS ==========
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
      name: "term",
      category: "Algebra Fundamentals",
      importance: "core",
    },
    {
      name: "like terms",
      category: "Algebra Fundamentals",
      importance: "supporting",
      aliases: ["similar terms"],
    },

    // ========== POLYNOMIALS ==========
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
      name: "leading coefficient",
      category: "Polynomials",
      importance: "supporting",
    },
    {
      name: "factoring",
      category: "Polynomials",
      importance: "core",
      aliases: ["factorization", "factor"],
    },
    {
      name: "greatest common factor",
      category: "Polynomials",
      importance: "supporting",
      aliases: ["GCF", "greatest common divisor"],
    },
    {
      name: "difference of squares",
      category: "Polynomials",
      importance: "supporting",
    },
    {
      name: "perfect square trinomial",
      category: "Polynomials",
      importance: "supporting",
    },

    // ========== EQUATIONS ==========
    {
      name: "linear equation",
      category: "Equations",
      importance: "core",
      aliases: ["linear"],
    },
    {
      name: "quadratic equation",
      category: "Equations",
      importance: "core",
      aliases: ["quadratic"],
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
      name: "absolute value equation",
      category: "Equations",
      importance: "supporting",
    },
    {
      name: "radical equation",
      category: "Equations",
      importance: "supporting",
    },
    {
      name: "rational equation",
      category: "Equations",
      importance: "supporting",
    },
    {
      name: "exponential equation",
      category: "Equations",
      importance: "supporting",
    },
    {
      name: "logarithmic equation",
      category: "Equations",
      importance: "supporting",
    },

    // ========== FUNCTIONS ==========
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
      name: "onto function",
      category: "Functions",
      importance: "supporting",
      aliases: ["surjective", "surjection"],
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
    {
      name: "absolute value function",
      category: "Functions",
      importance: "core",
      aliases: ["absolute value"],
    },
    {
      name: "polynomial function",
      category: "Functions",
      importance: "core",
    },

    // ========== GRAPHING ==========
    {
      name: "coordinate plane",
      category: "Graphing",
      importance: "core",
      aliases: ["Cartesian plane", "xy-plane"],
    },
    {
      name: "ordered pair",
      category: "Graphing",
      importance: "core",
      aliases: ["coordinates", "point"],
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
      name: "axis of symmetry",
      category: "Graphing",
      importance: "supporting",
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
      aliases: ["symmetric"],
    },
    {
      name: "transformation",
      category: "Graphing",
      importance: "core",
      aliases: ["translation", "shift", "stretch", "reflection"],
    },
    {
      name: "dilation",
      category: "Graphing",
      importance: "supporting",
      aliases: ["scaling", "vertical stretch", "horizontal stretch"],
    },

    // ========== TRIGONOMETRY FUNDAMENTALS ==========
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
      name: "reference angle",
      category: "Trigonometry Fundamentals",
      importance: "supporting",
    },
    {
      name: "coterminal angles",
      category: "Trigonometry Fundamentals",
      importance: "supporting",
    },
    {
      name: "arc length",
      category: "Trigonometry Fundamentals",
      importance: "supporting",
    },
    {
      name: "sector area",
      category: "Trigonometry Fundamentals",
      importance: "supporting",
    },

    // ========== TRIGONOMETRIC FUNCTIONS ==========
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
      name: "inverse sine",
      category: "Trigonometric Functions",
      importance: "supporting",
      aliases: ["arcsine", "arcsin"],
    },
    {
      name: "inverse cosine",
      category: "Trigonometric Functions",
      importance: "supporting",
      aliases: ["arccosine", "arccos"],
    },
    {
      name: "inverse tangent",
      category: "Trigonometric Functions",
      importance: "supporting",
      aliases: ["arctangent", "arctan"],
    },

    // ========== TRIGONOMETRIC IDENTITIES ==========
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
      name: "reciprocal identity",
      category: "Trigonometric Identities",
      importance: "supporting",
    },
    {
      name: "quotient identity",
      category: "Trigonometric Identities",
      importance: "supporting",
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
    {
      name: "product-to-sum formula",
      category: "Trigonometric Identities",
      importance: "detail",
    },
    {
      name: "sum-to-product formula",
      category: "Trigonometric Identities",
      importance: "detail",
    },

    // ========== TRIANGLES ==========
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
    {
      name: "oblique triangle",
      category: "Triangles",
      importance: "supporting",
    },
    {
      name: "angle of elevation",
      category: "Triangles",
      importance: "supporting",
    },
    {
      name: "angle of depression",
      category: "Triangles",
      importance: "supporting",
    },

    // ========== COMPLEX NUMBERS ==========
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
      name: "modulus",
      category: "Complex Numbers",
      importance: "supporting",
      aliases: ["absolute value", "magnitude"],
    },
    {
      name: "argument",
      category: "Complex Numbers",
      importance: "supporting",
      aliases: ["angle", "phase"],
    },
    {
      name: "De Moivre's theorem",
      category: "Complex Numbers",
      importance: "detail",
    },

    // ========== SEQUENCES AND SERIES ==========
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
      name: "recursive formula",
      category: "Sequences and Series",
      importance: "supporting",
    },
    {
      name: "explicit formula",
      category: "Sequences and Series",
      importance: "supporting",
    },
    {
      name: "summation notation",
      category: "Sequences and Series",
      importance: "supporting",
      aliases: ["sigma notation"],
    },
    {
      name: "convergence",
      category: "Sequences and Series",
      importance: "supporting",
      aliases: ["convergent series"],
    },
    {
      name: "divergence",
      category: "Sequences and Series",
      importance: "supporting",
      aliases: ["divergent series"],
    },

    // ========== MATRICES ==========
    {
      name: "matrix",
      category: "Matrices",
      importance: "core",
      aliases: ["matrices"],
    },
    {
      name: "element",
      category: "Matrices",
      importance: "supporting",
      aliases: ["entry", "component"],
    },
    {
      name: "dimension",
      category: "Matrices",
      importance: "supporting",
      aliases: ["order", "size"],
    },
    {
      name: "square matrix",
      category: "Matrices",
      importance: "supporting",
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
      name: "transpose",
      category: "Matrices",
      importance: "supporting",
      aliases: ["matrix transpose"],
    },
    {
      name: "matrix multiplication",
      category: "Matrices",
      importance: "core",
    },
    {
      name: "row echelon form",
      category: "Matrices",
      importance: "detail",
      aliases: ["REF"],
    },
    {
      name: "reduced row echelon form",
      category: "Matrices",
      importance: "detail",
      aliases: ["RREF"],
    },

    // ========== VECTORS ==========
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
      name: "direction",
      category: "Vectors",
      importance: "supporting",
    },
    {
      name: "unit vector",
      category: "Vectors",
      importance: "supporting",
    },
    {
      name: "dot product",
      category: "Vectors",
      importance: "supporting",
      aliases: ["scalar product", "inner product"],
    },
    {
      name: "cross product",
      category: "Vectors",
      importance: "detail",
      aliases: ["vector product"],
    },
    {
      name: "scalar multiplication",
      category: "Vectors",
      importance: "supporting",
    },
    {
      name: "vector addition",
      category: "Vectors",
      importance: "core",
    },

    // ========== PROBLEM SOLVING METHODS ==========
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
    {
      name: "verification",
      category: "Problem Solving",
      importance: "supporting",
      aliases: ["check", "verify"],
    },

    // ========== CALCULUS FUNDAMENTALS ==========
    {
      name: "limit",
      category: "Calculus Fundamentals",
      importance: "core",
      aliases: ["limit of a function", "lim", "limits"],
    },
    {
      name: "continuity",
      category: "Calculus Fundamentals",
      importance: "core",
      aliases: ["continuous function", "continuous"],
    },
    {
      name: "discontinuity",
      category: "Calculus Fundamentals",
      importance: "supporting",
      aliases: ["discontinuous"],
    },
    {
      name: "one-sided limit",
      category: "Calculus Fundamentals",
      importance: "supporting",
      aliases: ["left-hand limit", "right-hand limit"],
    },
    {
      name: "infinite limit",
      category: "Calculus Fundamentals",
      importance: "supporting",
    },
    {
      name: "limit at infinity",
      category: "Calculus Fundamentals",
      importance: "supporting",
    },

    // ========== DIFFERENTIAL CALCULUS ==========
    {
      name: "derivative",
      category: "Differential Calculus",
      importance: "core",
      aliases: ["differentiation", "f'(x)", "dy/dx", "derivatives"],
    },
    {
      name: "tangent line",
      category: "Differential Calculus",
      importance: "core",
      aliases: ["slope of tangent", "tangent lines"],
    },
    {
      name: "secant line",
      category: "Differential Calculus",
      importance: "supporting",
      aliases: ["secant lines"],
    },
    {
      name: "rate of change",
      category: "Differential Calculus",
      importance: "core",
      aliases: ["instantaneous rate of change", "rates of change"],
    },
    {
      name: "chain rule",
      category: "Differential Calculus",
      importance: "core",
    },
    {
      name: "product rule",
      category: "Differential Calculus",
      importance: "core",
    },
    {
      name: "quotient rule",
      category: "Differential Calculus",
      importance: "core",
    },
    {
      name: "power rule",
      category: "Differential Calculus",
      importance: "core",
    },
    {
      name: "implicit differentiation",
      category: "Differential Calculus",
      importance: "supporting",
    },
    {
      name: "related rates",
      category: "Differential Calculus",
      importance: "supporting",
    },
    {
      name: "critical point",
      category: "Differential Calculus",
      importance: "supporting",
      aliases: ["critical value", "stationary point"],
    },
    {
      name: "local maximum",
      category: "Differential Calculus",
      importance: "supporting",
      aliases: ["relative maximum", "local max"],
    },
    {
      name: "local minimum",
      category: "Differential Calculus",
      importance: "supporting",
      aliases: ["relative minimum", "local min"],
    },
    {
      name: "inflection point",
      category: "Differential Calculus",
      importance: "supporting",
    },
    {
      name: "concavity",
      category: "Differential Calculus",
      importance: "supporting",
      aliases: ["concave up", "concave down"],
    },
    {
      name: "second derivative",
      category: "Differential Calculus",
      importance: "supporting",
      aliases: ["f''(x)", "d²y/dx²"],
    },

    // ========== INTEGRAL CALCULUS ==========
    {
      name: "integral",
      category: "Integral Calculus",
      importance: "core",
      aliases: [
        "integration",
        "antiderivative",
        "integrals",
        "antiderivatives",
      ],
    },
    {
      name: "definite integral",
      category: "Integral Calculus",
      importance: "core",
      aliases: ["area under curve", "definite integrals"],
    },
    {
      name: "indefinite integral",
      category: "Integral Calculus",
      importance: "core",
      aliases: ["indefinite integrals"],
    },
    {
      name: "fundamental theorem of calculus",
      category: "Integral Calculus",
      importance: "core",
      aliases: ["FTC"],
    },
    {
      name: "Riemann sum",
      category: "Integral Calculus",
      importance: "supporting",
    },
    {
      name: "substitution method",
      category: "Integral Calculus",
      importance: "core",
      aliases: ["u-substitution"],
    },
    {
      name: "integration by parts",
      category: "Integral Calculus",
      importance: "supporting",
    },
    {
      name: "partial fractions",
      category: "Integral Calculus",
      importance: "supporting",
    },
    {
      name: "trigonometric substitution",
      category: "Integral Calculus",
      importance: "detail",
    },
    {
      name: "improper integral",
      category: "Integral Calculus",
      importance: "supporting",
    },

    // ========== DIFFERENTIAL EQUATIONS ==========
    {
      name: "differential equation",
      category: "Differential Equations",
      importance: "core",
      aliases: ["diff eq", "ODE", "differential equations", "ODEs"],
    },
    {
      name: "ordinary differential equation",
      category: "Differential Equations",
      importance: "core",
      aliases: ["ODE"],
    },
    {
      name: "partial differential equation",
      category: "Differential Equations",
      importance: "detail",
      aliases: ["PDE"],
    },
    {
      name: "initial condition",
      category: "Differential Equations",
      importance: "supporting",
    },
    {
      name: "boundary condition",
      category: "Differential Equations",
      importance: "supporting",
    },
    {
      name: "separable equation",
      category: "Differential Equations",
      importance: "supporting",
    },
    {
      name: "linear differential equation",
      category: "Differential Equations",
      importance: "supporting",
    },

    // ========== NUMBER THEORY ==========
    {
      name: "integer",
      category: "Number Theory",
      importance: "core",
    },
    {
      name: "rational number",
      category: "Number Theory",
      importance: "core",
    },
    {
      name: "irrational number",
      category: "Number Theory",
      importance: "core",
    },
    {
      name: "real number",
      category: "Number Theory",
      importance: "core",
    },
    {
      name: "prime number",
      category: "Number Theory",
      importance: "core",
      aliases: ["prime"],
    },
    {
      name: "composite number",
      category: "Number Theory",
      importance: "supporting",
    },
    {
      name: "factor",
      category: "Number Theory",
      importance: "core",
      aliases: ["divisor"],
    },
    {
      name: "multiple",
      category: "Number Theory",
      importance: "core",
    },
    {
      name: "least common multiple",
      category: "Number Theory",
      importance: "supporting",
      aliases: ["LCM"],
    },
    {
      name: "greatest common divisor",
      category: "Number Theory",
      importance: "supporting",
      aliases: ["GCD", "greatest common factor"],
    },

    // ========== PROBABILITY AND STATISTICS ==========
    {
      name: "probability",
      category: "Probability and Statistics",
      importance: "core",
    },
    {
      name: "sample space",
      category: "Probability and Statistics",
      importance: "core",
    },
    {
      name: "event",
      category: "Probability and Statistics",
      importance: "core",
    },
    {
      name: "independent events",
      category: "Probability and Statistics",
      importance: "supporting",
    },
    {
      name: "dependent events",
      category: "Probability and Statistics",
      importance: "supporting",
    },
    {
      name: "conditional probability",
      category: "Probability and Statistics",
      importance: "supporting",
    },
    {
      name: "permutation",
      category: "Probability and Statistics",
      importance: "core",
    },
    {
      name: "combination",
      category: "Probability and Statistics",
      importance: "core",
    },
    {
      name: "mean",
      category: "Probability and Statistics",
      importance: "core",
      aliases: ["average", "arithmetic mean"],
    },
    {
      name: "median",
      category: "Probability and Statistics",
      importance: "core",
    },
    {
      name: "mode",
      category: "Probability and Statistics",
      importance: "core",
    },
    {
      name: "standard deviation",
      category: "Probability and Statistics",
      importance: "supporting",
    },
    {
      name: "variance",
      category: "Probability and Statistics",
      importance: "supporting",
    },
    {
      name: "normal distribution",
      category: "Probability and Statistics",
      importance: "supporting",
      aliases: ["Gaussian distribution", "bell curve"],
    },

    // ========== SET THEORY ==========
    {
      name: "set",
      category: "Set Theory",
      importance: "core",
    },
    {
      name: "element",
      category: "Set Theory",
      importance: "core",
      aliases: ["member"],
    },
    {
      name: "subset",
      category: "Set Theory",
      importance: "supporting",
    },
    {
      name: "union",
      category: "Set Theory",
      importance: "supporting",
    },
    {
      name: "intersection",
      category: "Set Theory",
      importance: "supporting",
    },
    {
      name: "complement",
      category: "Set Theory",
      importance: "supporting",
    },
    {
      name: "empty set",
      category: "Set Theory",
      importance: "supporting",
      aliases: ["null set"],
    },
    {
      name: "universal set",
      category: "Set Theory",
      importance: "supporting",
    },

    // ========== LOGIC ==========
    {
      name: "proof",
      category: "Logic",
      importance: "core",
    },
    {
      name: "theorem",
      category: "Logic",
      importance: "core",
    },
    {
      name: "lemma",
      category: "Logic",
      importance: "detail",
    },
    {
      name: "corollary",
      category: "Logic",
      importance: "detail",
    },
    {
      name: "axiom",
      category: "Logic",
      importance: "supporting",
      aliases: ["postulate"],
    },
    {
      name: "conjecture",
      category: "Logic",
      importance: "detail",
    },
    {
      name: "induction",
      category: "Logic",
      importance: "supporting",
      aliases: ["mathematical induction"],
    },
    {
      name: "contradiction",
      category: "Logic",
      importance: "supporting",
      aliases: ["proof by contradiction"],
    },
  ],
};
