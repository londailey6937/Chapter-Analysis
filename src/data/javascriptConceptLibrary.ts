/**
 * JavaScript Concept Library
 *
 * Comprehensive library of core JavaScript concepts, ES6+ features,
 * DOM APIs, and modern JavaScript patterns.
 */

import { ConceptLibrary, ConceptDefinition } from "./conceptLibraryTypes";

export const JAVASCRIPT_CONCEPTS: ConceptLibrary = {
  domain: "javascript",
  version: "1.0.0",
  concepts: [
    // ============================================
    // CORE JAVASCRIPT CONCEPTS
    // ============================================
    {
      name: "JavaScript",
      aliases: ["JS", "ECMAScript", "ES6", "ES2015", "ES2020", "ESNext"],
      category: "Language",
      subcategory: "Core",
      importance: "core",
      description:
        "A high-level, dynamic programming language for web development.",
    },
    {
      name: "function",
      aliases: [
        "functions",
        "function declaration",
        "function expression",
        "method",
      ],
      category: "Core Concepts",
      subcategory: "Functions",
      importance: "core",
      description: "A reusable block of code that performs a specific task.",
    },
    {
      name: "variable",
      aliases: ["var", "let", "const", "variables", "declaration"],
      category: "Core Concepts",
      subcategory: "Variables",
      importance: "core",
      description: "A named container for storing data values.",
    },
    {
      name: "arrow function",
      aliases: ["arrow functions", "fat arrow", "lambda", "=>", "arrow syntax"],
      category: "ES6+ Features",
      subcategory: "Functions",
      importance: "core",
      description:
        "A concise syntax for writing function expressions using =>.",
    },
    {
      name: "callback",
      aliases: ["callback function", "callbacks", "callback hell"],
      category: "Core Concepts",
      subcategory: "Functions",
      importance: "core",
      description:
        "A function passed as an argument to another function to be executed later.",
    },
    {
      name: "closure",
      aliases: ["closures", "lexical closure", "lexical scope"],
      category: "Core Concepts",
      subcategory: "Scope",
      importance: "core",
      description:
        "A function that has access to variables from its outer scope even after the outer function has returned.",
    },
    {
      name: "this keyword",
      aliases: ["this", "context", "execution context"],
      category: "Core Concepts",
      subcategory: "Scope",
      importance: "core",
      description:
        "A keyword that refers to the object that is executing the current function.",
    },
    {
      name: "prototype",
      aliases: [
        "prototypes",
        "prototype chain",
        "prototypal inheritance",
        "__proto__",
      ],
      category: "Core Concepts",
      subcategory: "Object Model",
      importance: "core",
      description:
        "The mechanism by which JavaScript objects inherit features from one another.",
    },
    {
      name: "hoisting",
      aliases: ["variable hoisting", "function hoisting", "temporal dead zone"],
      category: "Core Concepts",
      subcategory: "Execution",
      importance: "core",
      description:
        "JavaScript's behavior of moving declarations to the top of their scope during compilation.",
    },

    // ============================================
    // ASYNCHRONOUS JAVASCRIPT
    // ============================================
    {
      name: "promise",
      aliases: ["promises", "Promise object", "then", "catch"],
      category: "Asynchronous",
      subcategory: "Core",
      importance: "core",
      description:
        "An object representing the eventual completion or failure of an asynchronous operation.",
    },
    {
      name: "async/await",
      aliases: ["async", "await", "async function", "asynchronous"],
      category: "Asynchronous",
      subcategory: "Modern Syntax",
      importance: "core",
      description:
        "Modern syntax for handling asynchronous operations that makes async code look synchronous.",
    },
    {
      name: "event loop",
      aliases: ["call stack", "event queue", "message queue", "microtasks"],
      category: "Asynchronous",
      subcategory: "Runtime",
      importance: "core",
      description:
        "The mechanism that handles asynchronous callbacks in JavaScript's runtime.",
    },
    {
      name: "setTimeout",
      aliases: ["setInterval", "clearTimeout", "clearInterval", "timer"],
      category: "Asynchronous",
      subcategory: "Timers",
      importance: "core",
      description: "Functions for executing code after a specified delay.",
    },

    // ============================================
    // ES6+ FEATURES
    // ============================================
    {
      name: "destructuring",
      aliases: [
        "destructuring assignment",
        "object destructuring",
        "array destructuring",
      ],
      category: "ES6+ Features",
      subcategory: "Syntax",
      importance: "core",
      description:
        "A syntax for extracting values from arrays or objects into distinct variables.",
    },
    {
      name: "spread operator",
      aliases: ["spread syntax", "...", "spread", "three dots"],
      category: "ES6+ Features",
      subcategory: "Syntax",
      importance: "core",
      description: "Syntax that expands iterables into individual elements.",
    },
    {
      name: "rest parameters",
      aliases: ["rest parameter", "rest syntax", "rest operator"],
      category: "ES6+ Features",
      subcategory: "Syntax",
      importance: "core",
      description:
        "Syntax that collects multiple function arguments into an array.",
    },
    {
      name: "template literals",
      aliases: [
        "template strings",
        "string interpolation",
        "backticks",
        "template literal",
      ],
      category: "ES6+ Features",
      subcategory: "Strings",
      importance: "core",
      description:
        "String literals that allow embedded expressions and multi-line strings using backticks.",
    },
    {
      name: "class",
      aliases: ["classes", "class declaration", "ES6 class", "constructor"],
      category: "ES6+ Features",
      subcategory: "OOP",
      importance: "core",
      description:
        "A template for creating objects with shared properties and methods.",
    },
    {
      name: "module",
      aliases: ["modules", "ES6 modules", "import", "export", "import/export"],
      category: "ES6+ Features",
      subcategory: "Organization",
      importance: "core",
      description:
        "A self-contained unit of code that can be imported and exported between files.",
    },
    {
      name: "default parameters",
      aliases: ["default parameter", "default values", "parameter defaults"],
      category: "ES6+ Features",
      subcategory: "Functions",
      importance: "core",
      description:
        "Function parameters with default values if no argument is provided.",
    },

    // ============================================
    // ARRAYS AND ITERATION
    // ============================================
    {
      name: "array",
      aliases: ["arrays", "Array object", "array literal"],
      category: "Data Structures",
      subcategory: "Arrays",
      importance: "core",
      description: "An ordered collection of values that can be of any type.",
    },
    {
      name: "map",
      aliases: ["Array.map", "map method", "mapping"],
      category: "Arrays",
      subcategory: "Higher-Order Functions",
      importance: "core",
      description:
        "Creates a new array by applying a function to each element.",
    },
    {
      name: "filter",
      aliases: ["Array.filter", "filter method", "filtering"],
      category: "Arrays",
      subcategory: "Higher-Order Functions",
      importance: "core",
      description:
        "Creates a new array with elements that pass a test condition.",
    },
    {
      name: "reduce",
      aliases: ["Array.reduce", "reduce method", "reducer"],
      category: "Arrays",
      subcategory: "Higher-Order Functions",
      importance: "core",
      description:
        "Reduces an array to a single value by applying a function to each element.",
    },
    {
      name: "forEach",
      aliases: ["Array.forEach", "forEach method", "for each"],
      category: "Arrays",
      subcategory: "Iteration",
      importance: "core",
      description: "Executes a function for each array element.",
    },
    {
      name: "find",
      aliases: ["Array.find", "find method", "findIndex"],
      category: "Arrays",
      subcategory: "Search",
      importance: "core",
      description: "Returns the first element that satisfies a test condition.",
    },
    {
      name: "Array.some",
      aliases: ["some method", "Array.every", "every method"],
      category: "Arrays",
      subcategory: "Testing",
      importance: "core",
      description: "Tests whether at least one element passes a condition.",
    },

    // ============================================
    // OBJECTS
    // ============================================
    {
      name: "object",
      aliases: [
        "objects",
        "Object literal",
        "object notation",
        "key-value pair",
      ],
      category: "Data Structures",
      subcategory: "Objects",
      importance: "core",
      description:
        "A collection of key-value pairs that represent properties and methods.",
    },
    {
      name: "Object.keys",
      aliases: ["Object.values", "Object.entries", "object keys"],
      category: "Objects",
      subcategory: "Methods",
      importance: "core",
      description:
        "Methods for getting arrays of object keys, values, or entries.",
    },
    {
      name: "Object.assign",
      aliases: ["object merge", "object copy", "assign"],
      category: "Objects",
      subcategory: "Methods",
      importance: "core",
      description: "Copies properties from source objects to a target object.",
    },
    {
      name: "JSON",
      aliases: ["JSON.parse", "JSON.stringify", "JavaScript Object Notation"],
      category: "Data Formats",
      subcategory: "JSON",
      importance: "core",
      description:
        "A lightweight data-interchange format and methods for parsing and serializing it.",
    },

    // ============================================
    // DOM MANIPULATION
    // ============================================
    {
      name: "DOM",
      aliases: [
        "Document Object Model",
        "DOM manipulation",
        "DOM API",
        "document",
      ],
      category: "Browser APIs",
      subcategory: "DOM",
      importance: "core",
      description:
        "A programming interface for HTML documents that represents the page structure.",
    },
    {
      name: "querySelector",
      aliases: ["document.querySelector", "querySelectorAll", "DOM selection"],
      category: "DOM",
      subcategory: "Selection",
      importance: "core",
      description: "Methods for selecting DOM elements using CSS selectors.",
    },
    {
      name: "getElementById",
      aliases: [
        "getElementById",
        "getElementsByClassName",
        "getElementsByTagName",
      ],
      category: "DOM",
      subcategory: "Selection",
      importance: "core",
      description:
        "Methods for selecting DOM elements by ID, class, or tag name.",
    },
    {
      name: "addEventListener",
      aliases: ["event listener", "event handler", "removeEventListener"],
      category: "DOM",
      subcategory: "Events",
      importance: "core",
      description:
        "Registers an event handler to be called when a specific event occurs.",
    },
    {
      name: "event",
      aliases: [
        "event object",
        "event delegation",
        "event bubbling",
        "event capturing",
      ],
      category: "DOM",
      subcategory: "Events",
      importance: "core",
      description:
        "Objects that represent interactions or occurrences in the browser.",
    },
    {
      name: "createElement",
      aliases: ["document.createElement", "create element", "appendChild"],
      category: "DOM",
      subcategory: "Manipulation",
      importance: "core",
      description:
        "Creates a new HTML element that can be added to the document.",
    },
    {
      name: "innerHTML",
      aliases: ["textContent", "innerText", "element content"],
      category: "DOM",
      subcategory: "Content",
      importance: "core",
      description:
        "Properties for getting or setting the HTML or text content of elements.",
    },

    // ============================================
    // WEB APIs
    // ============================================
    {
      name: "fetch",
      aliases: [
        "fetch API",
        "fetch method",
        "HTTP request",
        "AJAX",
        "XMLHttpRequest",
      ],
      category: "Web APIs",
      subcategory: "HTTP",
      importance: "core",
      description: "A modern interface for making HTTP requests in JavaScript.",
    },
    {
      name: "localStorage",
      aliases: [
        "local storage",
        "sessionStorage",
        "session storage",
        "web storage",
      ],
      category: "Web APIs",
      subcategory: "Storage",
      importance: "core",
      description:
        "A web storage API for storing key-value pairs in the browser.",
    },
    {
      name: "console",
      aliases: [
        "console.log",
        "console.error",
        "console.warn",
        "debugging console",
      ],
      category: "Web APIs",
      subcategory: "Debugging",
      importance: "core",
      description:
        "An object providing access to the browser's debugging console.",
    },

    // ============================================
    // ERROR HANDLING
    // ============================================
    {
      name: "try/catch",
      aliases: ["try catch", "try-catch", "finally", "error handling"],
      category: "Error Handling",
      subcategory: "Core",
      importance: "core",
      description:
        "Statements for handling exceptions and errors in JavaScript.",
    },
    {
      name: "throw",
      aliases: ["throw error", "throw statement", "throwing exceptions"],
      category: "Error Handling",
      subcategory: "Core",
      importance: "core",
      description: "A statement for throwing custom exceptions.",
    },
    {
      name: "Error",
      aliases: ["Error object", "TypeError", "ReferenceError", "SyntaxError"],
      category: "Error Handling",
      subcategory: "Error Types",
      importance: "core",
      description: "Built-in error objects for different types of errors.",
    },

    // ============================================
    // MODERN JAVASCRIPT PATTERNS
    // ============================================
    {
      name: "callback pattern",
      aliases: ["callback design pattern", "observer pattern"],
      category: "Patterns",
      subcategory: "Asynchronous",
      importance: "core",
      description:
        "A design pattern for handling asynchronous operations using callbacks.",
    },
    {
      name: "module pattern",
      aliases: ["revealing module pattern", "IIFE", "immediately invoked"],
      category: "Patterns",
      subcategory: "Organization",
      importance: "core",
      description:
        "A pattern for creating private and public members in JavaScript.",
    },
    {
      name: "debouncing",
      aliases: ["debounce", "throttling", "throttle", "rate limiting"],
      category: "Patterns",
      subcategory: "Performance",
      importance: "core",
      description:
        "Techniques for limiting the rate at which a function is called.",
    },

    // ============================================
    // NODE.JS CONCEPTS
    // ============================================
    {
      name: "Node.js",
      aliases: ["node", "nodejs", "Node", "runtime"],
      category: "Runtime",
      subcategory: "Node.js",
      importance: "core",
      description:
        "A JavaScript runtime built on Chrome's V8 engine for server-side development.",
    },
    {
      name: "npm",
      aliases: [
        "node package manager",
        "package.json",
        "npm install",
        "yarn",
        "pnpm",
      ],
      category: "Tools",
      subcategory: "Package Management",
      importance: "core",
      description: "The package manager for JavaScript and Node.js.",
    },
    {
      name: "require",
      aliases: ["require function", "module.exports", "CommonJS"],
      category: "Node.js",
      subcategory: "Modules",
      importance: "core",
      description: "CommonJS syntax for importing modules in Node.js.",
    },
    {
      name: "Express",
      aliases: ["Express.js", "expressjs", "Express framework"],
      category: "Frameworks",
      subcategory: "Backend",
      importance: "core",
      description: "A minimal web application framework for Node.js.",
    },

    // ============================================
    // TESTING & TOOLING
    // ============================================
    {
      name: "Jest",
      aliases: ["Jest testing", "unit testing", "test runner"],
      category: "Testing",
      subcategory: "Frameworks",
      importance: "core",
      description: "A JavaScript testing framework with a focus on simplicity.",
    },
    {
      name: "Webpack",
      aliases: ["webpack", "module bundler", "bundler", "build tool"],
      category: "Tools",
      subcategory: "Build Tools",
      importance: "core",
      description:
        "A module bundler that packages JavaScript files and assets.",
    },
    {
      name: "Babel",
      aliases: ["babel", "transpiler", "transpilation"],
      category: "Tools",
      subcategory: "Compilers",
      importance: "core",
      description:
        "A JavaScript compiler that converts modern JavaScript into backwards-compatible versions.",
    },
    {
      name: "ESLint",
      aliases: ["eslint", "linter", "linting", "code quality"],
      category: "Tools",
      subcategory: "Code Quality",
      importance: "core",
      description:
        "A tool for identifying and fixing problems in JavaScript code.",
    },

    // ============================================
    // TYPE SYSTEMS
    // ============================================
    {
      name: "TypeScript",
      aliases: ["TS", "typescript", "type annotations", "static typing"],
      category: "Languages",
      subcategory: "Supersets",
      importance: "core",
      description:
        "A typed superset of JavaScript that compiles to plain JavaScript.",
    },
    {
      name: "type checking",
      aliases: ["type system", "type safety", "static types", "type inference"],
      category: "Type Systems",
      subcategory: "Core",
      importance: "core",
      description:
        "The process of verifying and enforcing type constraints in code.",
    },
  ],
};

export default JAVASCRIPT_CONCEPTS;
