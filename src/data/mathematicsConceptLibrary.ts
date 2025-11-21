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

    // ========== HYPERBOLIC FUNCTIONS ==========
    {
      name: "hyperbolic sine",
      category: "Hyperbolic Functions",
      importance: "detail",
      aliases: ["sinh"],
    },
    {
      name: "hyperbolic cosine",
      category: "Hyperbolic Functions",
      importance: "detail",
      aliases: ["cosh"],
    },
    {
      name: "hyperbolic tangent",
      category: "Hyperbolic Functions",
      importance: "detail",
      aliases: ["tanh"],
    },
    {
      name: "hyperbolic cosecant",
      category: "Hyperbolic Functions",
      importance: "detail",
      aliases: ["csch"],
    },
    {
      name: "hyperbolic secant",
      category: "Hyperbolic Functions",
      importance: "detail",
      aliases: ["sech"],
    },
    {
      name: "hyperbolic cotangent",
      category: "Hyperbolic Functions",
      importance: "detail",
      aliases: ["coth"],
    },
    {
      name: "inverse hyperbolic sine",
      category: "Hyperbolic Functions",
      importance: "detail",
      aliases: ["arcsinh", "arsinh"],
    },
    {
      name: "inverse hyperbolic cosine",
      category: "Hyperbolic Functions",
      importance: "detail",
      aliases: ["arccosh", "arcosh"],
    },
    {
      name: "inverse hyperbolic tangent",
      category: "Hyperbolic Functions",
      importance: "detail",
      aliases: ["arctanh", "artanh"],
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

    // ========== SPHERICAL TRIGONOMETRY ==========
    {
      name: "spherical trigonometry",
      category: "Spherical Trigonometry",
      importance: "detail",
    },
    {
      name: "great circle",
      category: "Spherical Trigonometry",
      importance: "detail",
    },
    {
      name: "spherical triangle",
      category: "Spherical Trigonometry",
      importance: "detail",
    },
    {
      name: "spherical excess",
      category: "Spherical Trigonometry",
      importance: "detail",
    },
    {
      name: "spherical law of sines",
      category: "Spherical Trigonometry",
      importance: "detail",
    },
    {
      name: "spherical law of cosines",
      category: "Spherical Trigonometry",
      importance: "detail",
    },
    {
      name: "haversine formula",
      category: "Spherical Trigonometry",
      importance: "detail",
    },
    {
      name: "geodesic",
      category: "Spherical Trigonometry",
      importance: "detail",
      aliases: ["geodesic curve"],
    },

    // ========== ANALYTIC GEOMETRY ==========
    {
      name: "analytic geometry",
      category: "Analytic Geometry",
      importance: "core",
      aliases: ["coordinate geometry", "Cartesian geometry"],
    },
    {
      name: "distance formula",
      category: "Analytic Geometry",
      importance: "core",
    },
    {
      name: "midpoint formula",
      category: "Analytic Geometry",
      importance: "core",
    },
    {
      name: "conic section",
      category: "Analytic Geometry",
      importance: "core",
      aliases: ["conic"],
    },
    {
      name: "circle",
      category: "Analytic Geometry",
      importance: "core",
    },
    {
      name: "ellipse",
      category: "Analytic Geometry",
      importance: "core",
    },
    {
      name: "parabola",
      category: "Analytic Geometry",
      importance: "core",
    },
    {
      name: "hyperbola",
      category: "Analytic Geometry",
      importance: "core",
    },
    {
      name: "focus",
      category: "Analytic Geometry",
      importance: "supporting",
      aliases: ["foci"],
    },
    {
      name: "directrix",
      category: "Analytic Geometry",
      importance: "supporting",
    },
    {
      name: "eccentricity",
      category: "Analytic Geometry",
      importance: "supporting",
    },
    {
      name: "latus rectum",
      category: "Analytic Geometry",
      importance: "detail",
    },
    {
      name: "polar coordinates",
      category: "Analytic Geometry",
      importance: "core",
    },
    {
      name: "parametric equation",
      category: "Analytic Geometry",
      importance: "core",
      aliases: ["parametric equations"],
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
    {
      name: "linear combination",
      category: "Vectors",
      importance: "supporting",
    },
    {
      name: "orthogonal vectors",
      category: "Vectors",
      importance: "supporting",
      aliases: ["perpendicular vectors"],
    },

    // ========== LINEAR ALGEBRA ==========
    {
      name: "linear algebra",
      category: "Linear Algebra",
      importance: "core",
    },
    {
      name: "vector space",
      category: "Linear Algebra",
      importance: "core",
      aliases: ["linear space"],
    },
    {
      name: "subspace",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["linear subspace"],
    },
    {
      name: "span",
      category: "Linear Algebra",
      importance: "core",
      aliases: ["linear span"],
    },
    {
      name: "linear independence",
      category: "Linear Algebra",
      importance: "core",
      aliases: ["linearly independent"],
    },
    {
      name: "linear dependence",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["linearly dependent"],
    },
    {
      name: "basis",
      category: "Linear Algebra",
      importance: "core",
      aliases: ["basis vectors"],
    },
    {
      name: "dimension",
      category: "Linear Algebra",
      importance: "core",
      aliases: ["dimensionality"],
    },
    {
      name: "rank",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["matrix rank"],
    },
    {
      name: "nullity",
      category: "Linear Algebra",
      importance: "supporting",
    },
    {
      name: "null space",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["kernel"],
    },
    {
      name: "column space",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["range", "image"],
    },
    {
      name: "row space",
      category: "Linear Algebra",
      importance: "supporting",
    },
    {
      name: "eigenvalue",
      category: "Linear Algebra",
      importance: "core",
      aliases: ["characteristic value"],
    },
    {
      name: "eigenvector",
      category: "Linear Algebra",
      importance: "core",
      aliases: ["characteristic vector"],
    },
    {
      name: "characteristic polynomial",
      category: "Linear Algebra",
      importance: "supporting",
    },
    {
      name: "characteristic equation",
      category: "Linear Algebra",
      importance: "supporting",
    },
    {
      name: "diagonalization",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["matrix diagonalization"],
    },
    {
      name: "linear transformation",
      category: "Linear Algebra",
      importance: "core",
      aliases: ["linear map", "linear operator"],
    },
    {
      name: "kernel",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["null space"],
    },
    {
      name: "range",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["image"],
    },
    {
      name: "orthogonality",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["orthogonal"],
    },
    {
      name: "orthonormal basis",
      category: "Linear Algebra",
      importance: "supporting",
    },
    {
      name: "Gram-Schmidt process",
      category: "Linear Algebra",
      importance: "detail",
      aliases: ["Gram-Schmidt orthogonalization"],
    },
    {
      name: "inner product",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["dot product", "scalar product"],
    },
    {
      name: "norm",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["magnitude", "length"],
    },
    {
      name: "projection",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["orthogonal projection"],
    },
    {
      name: "least squares",
      category: "Linear Algebra",
      importance: "supporting",
      aliases: ["least squares approximation"],
    },

    // ========== MATRIX ALGEBRA ==========
    {
      name: "matrix algebra",
      category: "Matrix Algebra",
      importance: "core",
    },
    {
      name: "matrix addition",
      category: "Matrix Algebra",
      importance: "core",
    },
    {
      name: "matrix subtraction",
      category: "Matrix Algebra",
      importance: "core",
    },
    {
      name: "scalar multiplication",
      category: "Matrix Algebra",
      importance: "core",
    },
    {
      name: "matrix product",
      category: "Matrix Algebra",
      importance: "core",
      aliases: ["matrix multiplication"],
    },
    {
      name: "trace",
      category: "Matrix Algebra",
      importance: "supporting",
      aliases: ["trace of a matrix"],
    },
    {
      name: "symmetric matrix",
      category: "Matrix Algebra",
      importance: "supporting",
    },
    {
      name: "skew-symmetric matrix",
      category: "Matrix Algebra",
      importance: "detail",
      aliases: ["antisymmetric matrix"],
    },
    {
      name: "diagonal matrix",
      category: "Matrix Algebra",
      importance: "supporting",
    },
    {
      name: "upper triangular matrix",
      category: "Matrix Algebra",
      importance: "supporting",
    },
    {
      name: "lower triangular matrix",
      category: "Matrix Algebra",
      importance: "supporting",
    },
    {
      name: "orthogonal matrix",
      category: "Matrix Algebra",
      importance: "supporting",
    },
    {
      name: "singular matrix",
      category: "Matrix Algebra",
      importance: "supporting",
      aliases: ["non-invertible matrix"],
    },
    {
      name: "nonsingular matrix",
      category: "Matrix Algebra",
      importance: "supporting",
      aliases: ["invertible matrix"],
    },
    {
      name: "augmented matrix",
      category: "Matrix Algebra",
      importance: "supporting",
    },
    {
      name: "coefficient matrix",
      category: "Matrix Algebra",
      importance: "supporting",
    },
    {
      name: "Gaussian elimination",
      category: "Matrix Algebra",
      importance: "core",
      aliases: ["row reduction"],
    },
    {
      name: "Gauss-Jordan elimination",
      category: "Matrix Algebra",
      importance: "supporting",
    },
    {
      name: "elementary row operations",
      category: "Matrix Algebra",
      importance: "supporting",
      aliases: ["row operations"],
    },
    {
      name: "pivot",
      category: "Matrix Algebra",
      importance: "supporting",
      aliases: ["pivot element", "leading entry"],
    },
    {
      name: "Cramer's rule",
      category: "Matrix Algebra",
      importance: "detail",
    },
    {
      name: "matrix inversion",
      category: "Matrix Algebra",
      importance: "core",
      aliases: ["finding inverse"],
    },
    {
      name: "cofactor",
      category: "Matrix Algebra",
      importance: "supporting",
    },
    {
      name: "minor",
      category: "Matrix Algebra",
      importance: "supporting",
      aliases: ["matrix minor"],
    },
    {
      name: "adjugate",
      category: "Matrix Algebra",
      importance: "detail",
      aliases: ["adjoint matrix", "classical adjoint"],
    },

    // ========== DISCRETE MATHEMATICS ==========
    {
      name: "discrete mathematics",
      category: "Discrete Mathematics",
      importance: "core",
    },
    {
      name: "graph theory",
      category: "Discrete Mathematics",
      importance: "core",
    },
    {
      name: "graph",
      category: "Discrete Mathematics",
      importance: "core",
      aliases: ["network"],
    },
    {
      name: "vertex",
      category: "Discrete Mathematics",
      importance: "core",
      aliases: ["node", "vertices"],
    },
    {
      name: "edge",
      category: "Discrete Mathematics",
      importance: "core",
      aliases: ["arc", "link"],
    },
    {
      name: "directed graph",
      category: "Discrete Mathematics",
      importance: "supporting",
      aliases: ["digraph"],
    },
    {
      name: "undirected graph",
      category: "Discrete Mathematics",
      importance: "supporting",
    },
    {
      name: "weighted graph",
      category: "Discrete Mathematics",
      importance: "supporting",
    },
    {
      name: "path",
      category: "Discrete Mathematics",
      importance: "supporting",
    },
    {
      name: "cycle",
      category: "Discrete Mathematics",
      importance: "supporting",
      aliases: ["circuit"],
    },
    {
      name: "tree",
      category: "Discrete Mathematics",
      importance: "supporting",
    },
    {
      name: "binary tree",
      category: "Discrete Mathematics",
      importance: "supporting",
    },
    {
      name: "spanning tree",
      category: "Discrete Mathematics",
      importance: "detail",
    },
    {
      name: "adjacency matrix",
      category: "Discrete Mathematics",
      importance: "supporting",
    },
    {
      name: "degree",
      category: "Discrete Mathematics",
      importance: "supporting",
      aliases: ["vertex degree"],
    },
    {
      name: "Euler path",
      category: "Discrete Mathematics",
      importance: "detail",
      aliases: ["Eulerian path"],
    },
    {
      name: "Hamiltonian path",
      category: "Discrete Mathematics",
      importance: "detail",
    },
    {
      name: "combinatorics",
      category: "Discrete Mathematics",
      importance: "core",
    },
    {
      name: "recurrence relation",
      category: "Discrete Mathematics",
      importance: "supporting",
      aliases: ["difference equation"],
    },
    {
      name: "algorithm",
      category: "Discrete Mathematics",
      importance: "core",
    },

    // ========== ABSTRACT ALGEBRA ==========
    {
      name: "abstract algebra",
      category: "Abstract Algebra",
      importance: "core",
    },
    {
      name: "group",
      category: "Abstract Algebra",
      importance: "core",
    },
    {
      name: "ring",
      category: "Abstract Algebra",
      importance: "core",
    },
    {
      name: "field",
      category: "Abstract Algebra",
      importance: "core",
    },
    {
      name: "subgroup",
      category: "Abstract Algebra",
      importance: "supporting",
    },
    {
      name: "abelian group",
      category: "Abstract Algebra",
      importance: "supporting",
      aliases: ["commutative group"],
    },
    {
      name: "homomorphism",
      category: "Abstract Algebra",
      importance: "supporting",
    },
    {
      name: "isomorphism",
      category: "Abstract Algebra",
      importance: "supporting",
    },
    {
      name: "binary operation",
      category: "Abstract Algebra",
      importance: "supporting",
    },
    {
      name: "identity element",
      category: "Abstract Algebra",
      importance: "supporting",
    },
    {
      name: "inverse element",
      category: "Abstract Algebra",
      importance: "supporting",
    },
    {
      name: "closure",
      category: "Abstract Algebra",
      importance: "supporting",
    },
    {
      name: "associativity",
      category: "Abstract Algebra",
      importance: "supporting",
      aliases: ["associative property"],
    },
    {
      name: "commutativity",
      category: "Abstract Algebra",
      importance: "supporting",
      aliases: ["commutative property"],
    },

    // ========== MULTIVARIABLE CALCULUS ==========
    {
      name: "multivariable calculus",
      category: "Multivariable Calculus",
      importance: "core",
    },
    {
      name: "partial derivative",
      category: "Multivariable Calculus",
      importance: "core",
      aliases: ["partial differentiation"],
    },
    {
      name: "gradient",
      category: "Multivariable Calculus",
      importance: "core",
    },
    {
      name: "directional derivative",
      category: "Multivariable Calculus",
      importance: "supporting",
    },
    {
      name: "double integral",
      category: "Multivariable Calculus",
      importance: "core",
    },
    {
      name: "triple integral",
      category: "Multivariable Calculus",
      importance: "supporting",
    },
    {
      name: "line integral",
      category: "Multivariable Calculus",
      importance: "supporting",
    },
    {
      name: "surface integral",
      category: "Multivariable Calculus",
      importance: "supporting",
    },
    {
      name: "curl",
      category: "Multivariable Calculus",
      importance: "supporting",
    },
    {
      name: "divergence",
      category: "Multivariable Calculus",
      importance: "supporting",
    },
    {
      name: "Green's theorem",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "Stokes' theorem",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "divergence theorem",
      category: "Multivariable Calculus",
      importance: "detail",
      aliases: ["Gauss's theorem"],
    },
    {
      name: "Jacobian",
      category: "Multivariable Calculus",
      importance: "supporting",
    },
    {
      name: "chain rule",
      category: "Multivariable Calculus",
      importance: "core",
      aliases: ["multivariable chain rule"],
    },
    {
      name: "Lagrange multipliers",
      category: "Multivariable Calculus",
      importance: "supporting",
    },

    // ========== GEOMETRY ==========
    {
      name: "geometry",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "Euclidean geometry",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "point",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "line",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "plane",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "parallel",
      category: "Geometry",
      importance: "core",
      aliases: ["parallel lines"],
    },
    {
      name: "perpendicular",
      category: "Geometry",
      importance: "core",
      aliases: ["perpendicular lines"],
    },
    {
      name: "congruent",
      category: "Geometry",
      importance: "core",
      aliases: ["congruence"],
    },
    {
      name: "similar",
      category: "Geometry",
      importance: "core",
      aliases: ["similarity"],
    },
    {
      name: "circle",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "radius",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "diameter",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "circumference",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "area",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "perimeter",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "volume",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "surface area",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "polygon",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "triangle",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "quadrilateral",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "rectangle",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "square",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "parallelogram",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "trapezoid",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "rhombus",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "pentagon",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "hexagon",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "sphere",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "cylinder",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "cone",
      category: "Geometry",
      importance: "core",
    },
    {
      name: "prism",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "pyramid",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "ellipse",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "parabola",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "hyperbola",
      category: "Geometry",
      importance: "supporting",
    },
    {
      name: "conic section",
      category: "Geometry",
      importance: "supporting",
      aliases: ["conic sections"],
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

    // ========== DISCRETE MATHEMATICS ==========
    {
      name: "discrete mathematics",
      category: "Discrete Mathematics",
      importance: "core",
    },
    {
      name: "graph theory",
      category: "Discrete Mathematics",
      importance: "core",
    },
    {
      name: "graph",
      category: "Discrete Mathematics",
      importance: "core",
      aliases: ["network"],
    },
    {
      name: "vertex",
      category: "Discrete Mathematics",
      importance: "core",
      aliases: ["node", "vertices"],
    },
    {
      name: "edge",
      category: "Discrete Mathematics",
      importance: "core",
      aliases: ["arc", "link"],
    },
    {
      name: "directed graph",
      category: "Discrete Mathematics",
      importance: "supporting",
      aliases: ["digraph"],
    },
    {
      name: "tree",
      category: "Discrete Mathematics",
      importance: "supporting",
      aliases: ["tree structure"],
    },
    {
      name: "binary tree",
      category: "Discrete Mathematics",
      importance: "detail",
    },
    {
      name: "algorithm",
      category: "Discrete Mathematics",
      importance: "core",
    },
    {
      name: "recursion",
      category: "Discrete Mathematics",
      importance: "supporting",
      aliases: ["recursive algorithm"],
    },
    {
      name: "combinatorics",
      category: "Discrete Mathematics",
      importance: "core",
    },
    {
      name: "counting principle",
      category: "Discrete Mathematics",
      importance: "supporting",
      aliases: ["fundamental counting principle"],
    },
    {
      name: "pigeonhole principle",
      category: "Discrete Mathematics",
      importance: "detail",
    },
    {
      name: "binomial coefficient",
      category: "Discrete Mathematics",
      importance: "supporting",
      aliases: ["binomial coefficients"],
    },
    {
      name: "Pascal's triangle",
      category: "Discrete Mathematics",
      importance: "supporting",
    },

    // ========== MULTIVARIABLE CALCULUS ==========
    {
      name: "multivariable calculus",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "partial derivative",
      category: "Multivariable Calculus",
      importance: "detail",
      aliases: ["partial derivatives"],
    },
    {
      name: "gradient",
      category: "Multivariable Calculus",
      importance: "detail",
      aliases: ["gradient vector"],
    },
    {
      name: "directional derivative",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "double integral",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "triple integral",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "line integral",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "surface integral",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "curl",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "divergence",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "Green's theorem",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "Stokes' theorem",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "divergence theorem",
      category: "Multivariable Calculus",
      importance: "detail",
      aliases: ["Gauss's theorem"],
    },
    {
      name: "Jacobian",
      category: "Multivariable Calculus",
      importance: "detail",
    },
    {
      name: "Lagrange multiplier",
      category: "Multivariable Calculus",
      importance: "detail",
      aliases: ["Lagrange multipliers"],
    },

    // ========== NUMERICAL METHODS ==========
    {
      name: "numerical analysis",
      category: "Numerical Methods",
      importance: "detail",
    },
    {
      name: "numerical integration",
      category: "Numerical Methods",
      importance: "detail",
    },
    {
      name: "trapezoidal rule",
      category: "Numerical Methods",
      importance: "detail",
    },
    {
      name: "Simpson's rule",
      category: "Numerical Methods",
      importance: "detail",
    },
    {
      name: "Newton's method",
      category: "Numerical Methods",
      importance: "detail",
      aliases: ["Newton-Raphson method"],
    },
    {
      name: "Euler's method",
      category: "Numerical Methods",
      importance: "detail",
    },
    {
      name: "finite difference",
      category: "Numerical Methods",
      importance: "detail",
    },
    {
      name: "interpolation",
      category: "Numerical Methods",
      importance: "detail",
    },
    {
      name: "extrapolation",
      category: "Numerical Methods",
      importance: "detail",
    },

    // ========== OPTIMIZATION ==========
    {
      name: "optimization",
      category: "Optimization",
      importance: "supporting",
    },
    {
      name: "linear programming",
      category: "Optimization",
      importance: "detail",
    },
    {
      name: "objective function",
      category: "Optimization",
      importance: "detail",
    },
    {
      name: "constraint",
      category: "Optimization",
      importance: "detail",
      aliases: ["constraints"],
    },
    {
      name: "feasible region",
      category: "Optimization",
      importance: "detail",
    },
    {
      name: "simplex method",
      category: "Optimization",
      importance: "detail",
    },
    {
      name: "gradient descent",
      category: "Optimization",
      importance: "detail",
    },
  ],
};
