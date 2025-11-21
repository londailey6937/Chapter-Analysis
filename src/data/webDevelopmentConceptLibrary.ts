/**
 * Web Development Concept Library
 *
 * Comprehensive library combining JavaScript and React concepts.
 * Covers core JavaScript, ES6+, DOM APIs, React, hooks, and modern web development patterns.
 *
 * Combining these allows better concept detection in tutorials that mix both technologies,
 * since React applications naturally use JavaScript concepts throughout.
 */

import { ConceptLibrary } from "./conceptLibraryTypes";

export const WEB_DEVELOPMENT_CONCEPTS: ConceptLibrary = {
  domain: "webdevelopment",
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
      prerequisites: ["function"],
    },
    {
      name: "callback",
      aliases: ["callback function", "callbacks", "callback hell"],
      category: "Core Concepts",
      subcategory: "Functions",
      importance: "core",
      description:
        "A function passed as an argument to another function to be executed later.",
      prerequisites: ["function"],
    },
    {
      name: "closure",
      aliases: ["closures", "lexical closure", "lexical scope"],
      category: "Core Concepts",
      subcategory: "Scope",
      importance: "core",
      description:
        "A function that has access to variables from its outer scope even after the outer function has returned.",
      prerequisites: ["function", "variable"],
    },
    {
      name: "this keyword",
      aliases: ["this", "context", "execution context"],
      category: "Core Concepts",
      subcategory: "Scope",
      importance: "core",
      description:
        "A keyword that refers to the object that is executing the current function.",
      prerequisites: ["function", "object"],
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
      prerequisites: ["object", "function"],
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
      prerequisites: ["callback", "function"],
    },
    {
      name: "async/await",
      aliases: ["async", "await", "async function", "asynchronous"],
      category: "Asynchronous",
      subcategory: "Modern Syntax",
      importance: "core",
      description:
        "Modern syntax for handling asynchronous operations that makes async code look synchronous.",
      prerequisites: ["promise", "function"],
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

    // ============================================
    // REACT - CORE CONCEPTS
    // ============================================
    {
      name: "React",
      aliases: ["React.js", "ReactJS", "React library"],
      category: "React",
      subcategory: "Core",
      importance: "core",
      description:
        "A JavaScript library for building user interfaces with reusable components.",
    },
    {
      name: "component",
      aliases: [
        "components",
        "React component",
        "functional component",
        "class component",
      ],
      category: "React",
      subcategory: "Components",
      importance: "core",
      description:
        "Independent, reusable pieces of UI that can be composed together to build complex interfaces.",
    },
    {
      name: "JSX",
      aliases: [
        "JavaScript XML",
        "JSX syntax",
        "JSX element",
        "JSX expression",
      ],
      category: "React",
      subcategory: "Syntax",
      importance: "core",
      description:
        "A syntax extension for JavaScript that allows writing HTML-like code in JavaScript files.",
    },
    {
      name: "props",
      aliases: [
        "properties",
        "component props",
        "prop drilling",
        "prop passing",
      ],
      category: "React",
      subcategory: "Components",
      importance: "core",
      description:
        "Arguments passed to React components, similar to function parameters, used to pass data from parent to child.",
    },
    {
      name: "state",
      aliases: [
        "component state",
        "local state",
        "state management",
        "stateful component",
      ],
      category: "React",
      subcategory: "State Management",
      importance: "core",
      description:
        "Data that changes over time and triggers re-renders when updated.",
    },

    // ============================================
    // REACT HOOKS
    // ============================================
    {
      name: "useState",
      aliases: ["use state", "state hook", "useState hook"],
      category: "React Hooks",
      subcategory: "State Hooks",
      importance: "core",
      description: "A Hook that lets you add state to functional components.",
    },
    {
      name: "useEffect",
      aliases: ["use effect", "effect hook", "useEffect hook", "side effect"],
      category: "React Hooks",
      subcategory: "Effect Hooks",
      importance: "core",
      description:
        "A Hook that lets you perform side effects in functional components (data fetching, subscriptions, DOM manipulation).",
    },
    {
      name: "useContext",
      aliases: ["use context", "context hook", "useContext hook"],
      category: "React Hooks",
      subcategory: "Context Hooks",
      importance: "core",
      description:
        "A Hook that lets you subscribe to React context without nesting.",
    },
    {
      name: "useReducer",
      aliases: ["use reducer", "reducer hook", "useReducer hook"],
      category: "React Hooks",
      subcategory: "State Hooks",
      importance: "supporting",
      description:
        "A Hook for managing complex state logic, similar to Redux reducers.",
    },
    {
      name: "useRef",
      aliases: ["use ref", "ref hook", "useRef hook", "ref"],
      category: "React Hooks",
      subcategory: "Ref Hooks",
      importance: "supporting",
      description:
        "A Hook that lets you persist values across renders without causing re-renders.",
    },
    {
      name: "useMemo",
      aliases: ["use memo", "memo hook", "useMemo hook", "memoization"],
      category: "React Hooks",
      subcategory: "Performance Hooks",
      importance: "supporting",
      description:
        "A Hook that memoizes expensive calculations to optimize performance.",
    },
    {
      name: "useCallback",
      aliases: ["use callback", "callback hook", "useCallback hook"],
      category: "React Hooks",
      subcategory: "Performance Hooks",
      importance: "supporting",
      description:
        "A Hook that memoizes callback functions to prevent unnecessary re-renders.",
    },
    {
      name: "custom hook",
      aliases: [
        "custom hooks",
        "custom React hook",
        "hook composition",
        "reusable hook",
      ],
      category: "React Hooks",
      subcategory: "Custom Hooks",
      importance: "supporting",
      description:
        "User-defined hooks that encapsulate reusable stateful logic.",
    },

    // ============================================
    // REACT LIFECYCLE
    // ============================================
    {
      name: "mounting",
      aliases: [
        "component mounting",
        "mount",
        "componentDidMount",
        "mount phase",
      ],
      category: "React Lifecycle",
      subcategory: "Phases",
      importance: "supporting",
      description:
        "The phase when a component is being created and inserted into the DOM.",
    },
    {
      name: "updating",
      aliases: [
        "component updating",
        "update",
        "componentDidUpdate",
        "update phase",
      ],
      category: "React Lifecycle",
      subcategory: "Phases",
      importance: "supporting",
      description:
        "The phase when a component is re-rendering due to changes in props or state.",
    },
    {
      name: "unmounting",
      aliases: [
        "component unmounting",
        "unmount",
        "componentWillUnmount",
        "cleanup",
      ],
      category: "React Lifecycle",
      subcategory: "Phases",
      importance: "supporting",
      description: "The phase when a component is being removed from the DOM.",
    },

    // ============================================
    // REACT RENDERING
    // ============================================
    {
      name: "virtual DOM",
      aliases: ["VDOM", "virtual dom", "React virtual DOM"],
      category: "React Rendering",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A lightweight copy of the actual DOM that React uses to optimize updates.",
    },
    {
      name: "reconciliation",
      aliases: [
        "React reconciliation",
        "diffing algorithm",
        "diff",
        "React diff",
      ],
      category: "React Rendering",
      subcategory: "Performance",
      importance: "supporting",
      description:
        "The process React uses to compare the virtual DOM with the previous version and update only what changed.",
    },
    {
      name: "render",
      aliases: ["rendering", "re-render", "component render", "render method"],
      category: "React Rendering",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of converting React components into DOM elements.",
    },
    {
      name: "key prop",
      aliases: ["key", "keys", "React key", "list key"],
      category: "React Rendering",
      subcategory: "Lists",
      importance: "core",
      description:
        "A special prop used to help React identify which items in a list have changed.",
    },

    // ============================================
    // REACT CONTEXT & STATE MANAGEMENT
    // ============================================
    {
      name: "Context API",
      aliases: [
        "React Context",
        "context",
        "createContext",
        "Context Provider",
      ],
      category: "React State Management",
      subcategory: "Context",
      importance: "core",
      description:
        "A way to pass data through the component tree without prop drilling.",
    },
    {
      name: "provider",
      aliases: ["Context Provider", "provider component", "context provider"],
      category: "React State Management",
      subcategory: "Context",
      importance: "supporting",
      description:
        "A component that makes context values available to child components.",
    },
    {
      name: "consumer",
      aliases: ["Context Consumer", "consumer component", "context consumer"],
      category: "React State Management",
      subcategory: "Context",
      importance: "supporting",
      description:
        "A component that subscribes to context changes (legacy pattern, mostly replaced by useContext).",
    },

    // ============================================
    // REACT EVENTS & FORMS
    // ============================================
    {
      name: "event handler",
      aliases: [
        "event handlers",
        "onClick",
        "onChange",
        "onSubmit",
        "event handling",
      ],
      category: "React Events",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "Functions that handle user interactions and browser events in React.",
    },
    {
      name: "synthetic event",
      aliases: [
        "synthetic events",
        "SyntheticEvent",
        "React event",
        "event wrapper",
      ],
      category: "React Events",
      subcategory: "Browser APIs",
      importance: "supporting",
      description:
        "React's cross-browser wrapper around the browser's native event.",
    },
    {
      name: "controlled component",
      aliases: ["controlled components", "controlled input", "controlled form"],
      category: "React Forms",
      subcategory: "Input Patterns",
      importance: "core",
      description: "A form element whose value is controlled by React state.",
    },
    {
      name: "uncontrolled component",
      aliases: [
        "uncontrolled components",
        "uncontrolled input",
        "uncontrolled form",
      ],
      category: "React Forms",
      subcategory: "Input Patterns",
      importance: "supporting",
      description:
        "A form element that maintains its own internal state, accessed via refs.",
    },

    // ============================================
    // REACT PERFORMANCE
    // ============================================
    {
      name: "React.memo",
      aliases: ["memo", "memoization", "component memoization"],
      category: "React Performance",
      subcategory: "Optimization",
      importance: "supporting",
      description:
        "A higher-order component that prevents re-renders when props haven't changed.",
    },
    {
      name: "lazy loading",
      aliases: [
        "React.lazy",
        "lazy",
        "code splitting",
        "dynamic import",
        "lazy component",
      ],
      category: "React Performance",
      subcategory: "Code Splitting",
      importance: "supporting",
      description:
        "Loading components only when they're needed to reduce initial bundle size.",
    },
    {
      name: "Suspense",
      aliases: ["React Suspense", "Suspense boundary", "Suspense component"],
      category: "React Performance",
      subcategory: "Code Splitting",
      importance: "supporting",
      description:
        "A component that lets you display a fallback while waiting for lazy-loaded components.",
    },

    // ============================================
    // REACT PATTERNS
    // ============================================
    {
      name: "higher-order component",
      aliases: ["HOC", "HOCs", "higher order component", "component wrapper"],
      category: "React Patterns",
      subcategory: "Component Composition",
      importance: "supporting",
      description:
        "A function that takes a component and returns a new component with additional props or behavior.",
    },
    {
      name: "render props",
      aliases: [
        "render prop",
        "render prop pattern",
        "function as child",
        "children as function",
      ],
      category: "React Patterns",
      subcategory: "Component Composition",
      importance: "supporting",
      description:
        "A pattern where a component receives a function as a prop to determine what to render.",
    },
    {
      name: "compound components",
      aliases: [
        "compound component",
        "compound component pattern",
        "composite components",
      ],
      category: "React Patterns",
      subcategory: "Component Composition",
      importance: "supporting",
      description:
        "A pattern where components work together to form a cohesive UI element.",
    },

    // ============================================
    // REACT ECOSYSTEM
    // ============================================
    {
      name: "React Router",
      aliases: ["react-router", "router", "routing", "client-side routing"],
      category: "React Ecosystem",
      subcategory: "Routing",
      importance: "supporting",
      description:
        "A library for handling navigation and routing in React applications.",
    },
    {
      name: "Route",
      aliases: ["route component", "Route component", "routing path"],
      category: "React Ecosystem",
      subcategory: "Routing",
      importance: "supporting",
      description: "A component that renders UI when the URL matches its path.",
    },
    {
      name: "Link",
      aliases: ["Link component", "navigation link", "router link"],
      category: "React Ecosystem",
      subcategory: "Routing",
      importance: "supporting",
      description:
        "A component for declarative navigation without page reloads.",
    },
    {
      name: "React Testing Library",
      aliases: [
        "RTL",
        "testing library",
        "@testing-library/react",
        "component testing",
      ],
      category: "React Testing",
      subcategory: "Tools",
      importance: "supporting",
      description:
        "A library for testing React components by focusing on user behavior.",
    },
    {
      name: "Create React App",
      aliases: ["CRA", "create-react-app", "React starter"],
      category: "React Tooling",
      subcategory: "Setup",
      importance: "supporting",
      description:
        "An officially supported tool to create single-page React applications with zero configuration.",
    },
    {
      name: "Vite",
      aliases: ["vite", "Vite build tool", "vite dev server"],
      category: "React Tooling",
      subcategory: "Build Tools",
      importance: "supporting",
      description:
        "A modern build tool that provides fast development and optimized production builds for React.",
    },

    // ============================================
    // REACT FRAMEWORKS
    // ============================================
    {
      name: "Next.js",
      aliases: ["Next", "nextjs", "Next.js framework"],
      category: "React Frameworks",
      subcategory: "Full-Stack",
      importance: "supporting",
      description:
        "A React framework for building server-side rendered and statically generated applications.",
    },
    {
      name: "server-side rendering",
      aliases: ["SSR", "server rendering", "server-side render"],
      category: "React Frameworks",
      subcategory: "Rendering Strategies",
      importance: "supporting",
      description:
        "Rendering React components on the server and sending HTML to the client.",
    },
    {
      name: "static site generation",
      aliases: ["SSG", "static generation", "pre-rendering"],
      category: "React Frameworks",
      subcategory: "Rendering Strategies",
      importance: "supporting",
      description:
        "Generating HTML at build time for better performance and SEO.",
    },

    // ============================================
    // MODERN REACT FEATURES
    // ============================================
    {
      name: "Concurrent Mode",
      aliases: [
        "concurrent React",
        "concurrent rendering",
        "concurrent features",
      ],
      category: "React Modern Features",
      subcategory: "Concurrency",
      importance: "supporting",
      description:
        "A set of features that help React apps stay responsive by rendering component trees without blocking the main thread.",
    },
    {
      name: "Server Components",
      aliases: [
        "React Server Components",
        "RSC",
        "server component",
        "server-side components",
      ],
      category: "React Modern Features",
      subcategory: "Architecture",
      importance: "supporting",
      description:
        "Components that run only on the server, reducing JavaScript sent to the client.",
    },
    {
      name: "fragment",
      aliases: [
        "React Fragment",
        "Fragment",
        "<>",
        "empty tag",
        "fragment shorthand",
      ],
      category: "React",
      subcategory: "JSX",
      importance: "supporting",
      description:
        "A component that groups multiple elements without adding extra DOM nodes.",
    },
    {
      name: "portal",
      aliases: ["React portal", "createPortal", "ReactDOM.createPortal"],
      category: "React Advanced",
      subcategory: "DOM Manipulation",
      importance: "supporting",
      description:
        "A way to render children into a DOM node outside the parent component's hierarchy.",
    },
    {
      name: "StrictMode",
      aliases: [
        "React.StrictMode",
        "strict mode",
        "development mode",
        "StrictMode component",
      ],
      category: "React Development",
      subcategory: "Debugging",
      importance: "supporting",
      description:
        "A tool for highlighting potential problems in an application during development.",
    },
  ],
};

export default WEB_DEVELOPMENT_CONCEPTS;
