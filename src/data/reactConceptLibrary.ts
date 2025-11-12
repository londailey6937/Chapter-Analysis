/**
 * React Concept Library
 *
 * Comprehensive library of React.js concepts, patterns, and APIs.
 * Covers modern React including hooks, JSX, components, and ecosystem.
 */

import { ConceptLibrary, ConceptDefinition } from "./conceptLibraryTypes";

export const REACT_CONCEPTS: ConceptLibrary = {
  domain: "react",
  version: "1.0.0",
  concepts: [
    // ============================================
    // CORE REACT CONCEPTS
    // ============================================
    {
      name: "component",
      aliases: [
        "components",
        "React component",
        "functional component",
        "class component",
      ],
      category: "Core Concepts",
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
      category: "Core Concepts",
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
      category: "Core Concepts",
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
      category: "Core Concepts",
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
      category: "Hooks",
      subcategory: "State Hooks",
      importance: "core",
      description: "A Hook that lets you add state to functional components.",
    },
    {
      name: "useEffect",
      aliases: ["use effect", "effect hook", "useEffect hook", "side effect"],
      category: "Hooks",
      subcategory: "Effect Hooks",
      importance: "core",
      description:
        "A Hook that lets you perform side effects in functional components (data fetching, subscriptions, DOM manipulation).",
    },
    {
      name: "useContext",
      aliases: ["use context", "context hook", "useContext hook"],
      category: "Hooks",
      subcategory: "Context Hooks",
      importance: "core",
      description:
        "A Hook that lets you subscribe to React context without nesting.",
    },
    {
      name: "useReducer",
      aliases: ["use reducer", "reducer hook", "useReducer hook"],
      category: "Hooks",
      subcategory: "State Hooks",
      importance: "supporting",
      description:
        "A Hook for managing complex state logic, similar to Redux reducers.",
    },
    {
      name: "useRef",
      aliases: ["use ref", "ref hook", "useRef hook", "ref"],
      category: "Hooks",
      subcategory: "Ref Hooks",
      importance: "supporting",
      description:
        "A Hook that lets you persist values across renders without causing re-renders.",
    },
    {
      name: "useMemo",
      aliases: ["use memo", "memo hook", "useMemo hook", "memoization"],
      category: "Hooks",
      subcategory: "Performance Hooks",
      importance: "supporting",
      description:
        "A Hook that memoizes expensive calculations to optimize performance.",
    },
    {
      name: "useCallback",
      aliases: ["use callback", "callback hook", "useCallback hook"],
      category: "Hooks",
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
      category: "Hooks",
      subcategory: "Custom Hooks",
      importance: "supporting",
      description:
        "User-defined hooks that encapsulate reusable stateful logic.",
    },

    // ============================================
    // COMPONENT LIFECYCLE
    // ============================================
    {
      name: "mounting",
      aliases: [
        "component mounting",
        "mount",
        "componentDidMount",
        "mount phase",
      ],
      category: "Lifecycle",
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
      category: "Lifecycle",
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
      category: "Lifecycle",
      subcategory: "Phases",
      importance: "supporting",
      description: "The phase when a component is being removed from the DOM.",
    },

    // ============================================
    // RENDERING & VIRTUAL DOM
    // ============================================
    {
      name: "virtual DOM",
      aliases: ["VDOM", "virtual dom", "React virtual DOM"],
      category: "Rendering",
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
      category: "Rendering",
      subcategory: "Performance",
      importance: "supporting",
      description:
        "The process React uses to compare the virtual DOM with the previous version and update only what changed.",
    },
    {
      name: "render",
      aliases: ["rendering", "re-render", "component render", "render method"],
      category: "Rendering",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of converting React components into DOM elements.",
    },
    {
      name: "key prop",
      aliases: ["key", "keys", "React key", "list key"],
      category: "Rendering",
      subcategory: "Lists",
      importance: "core",
      description:
        "A special prop used to help React identify which items in a list have changed.",
    },

    // ============================================
    // CONTEXT & STATE MANAGEMENT
    // ============================================
    {
      name: "Context API",
      aliases: [
        "React Context",
        "context",
        "createContext",
        "Context Provider",
      ],
      category: "State Management",
      subcategory: "Context",
      importance: "core",
      description:
        "A way to pass data through the component tree without prop drilling.",
    },
    {
      name: "provider",
      aliases: ["Context Provider", "provider component", "context provider"],
      category: "State Management",
      subcategory: "Context",
      importance: "supporting",
      description:
        "A component that makes context values available to child components.",
    },
    {
      name: "consumer",
      aliases: ["Context Consumer", "consumer component", "context consumer"],
      category: "State Management",
      subcategory: "Context",
      importance: "supporting",
      description:
        "A component that subscribes to context changes (legacy pattern, mostly replaced by useContext).",
    },

    // ============================================
    // EVENTS & HANDLERS
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
      category: "Events",
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
      category: "Events",
      subcategory: "Browser APIs",
      importance: "supporting",
      description:
        "React's cross-browser wrapper around the browser's native event.",
    },

    // ============================================
    // FORMS & INPUTS
    // ============================================
    {
      name: "controlled component",
      aliases: ["controlled components", "controlled input", "controlled form"],
      category: "Forms",
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
      category: "Forms",
      subcategory: "Input Patterns",
      importance: "supporting",
      description:
        "A form element that maintains its own internal state, accessed via refs.",
    },

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================
    {
      name: "React.memo",
      aliases: ["memo", "memoization", "component memoization"],
      category: "Performance",
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
      category: "Performance",
      subcategory: "Code Splitting",
      importance: "supporting",
      description:
        "Loading components only when they're needed to reduce initial bundle size.",
    },
    {
      name: "Suspense",
      aliases: ["React Suspense", "Suspense boundary", "Suspense component"],
      category: "Performance",
      subcategory: "Code Splitting",
      importance: "supporting",
      description:
        "A component that lets you display a fallback while waiting for lazy-loaded components.",
    },

    // ============================================
    // ADVANCED PATTERNS
    // ============================================
    {
      name: "higher-order component",
      aliases: ["HOC", "HOCs", "higher order component", "component wrapper"],
      category: "Patterns",
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
      category: "Patterns",
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
      category: "Patterns",
      subcategory: "Component Composition",
      importance: "supporting",
      description:
        "A pattern where components work together to form a cohesive UI element.",
    },

    // ============================================
    // REACT ROUTER (ECOSYSTEM)
    // ============================================
    {
      name: "React Router",
      aliases: ["react-router", "router", "routing", "client-side routing"],
      category: "Ecosystem",
      subcategory: "Routing",
      importance: "supporting",
      description:
        "A library for handling navigation and routing in React applications.",
    },
    {
      name: "Route",
      aliases: ["route component", "Route component", "routing path"],
      category: "Ecosystem",
      subcategory: "Routing",
      importance: "supporting",
      description: "A component that renders UI when the URL matches its path.",
    },
    {
      name: "Link",
      aliases: ["Link component", "navigation link", "router link"],
      category: "Ecosystem",
      subcategory: "Routing",
      importance: "supporting",
      description:
        "A component for declarative navigation without page reloads.",
    },

    // ============================================
    // TESTING
    // ============================================
    {
      name: "React Testing Library",
      aliases: [
        "RTL",
        "testing library",
        "@testing-library/react",
        "component testing",
      ],
      category: "Testing",
      subcategory: "Tools",
      importance: "supporting",
      description:
        "A library for testing React components by focusing on user behavior.",
    },
    {
      name: "enzyme",
      aliases: ["Enzyme", "Airbnb enzyme", "shallow rendering"],
      category: "Testing",
      subcategory: "Tools",
      importance: "supporting",
      description:
        "A testing utility for React that allows shallow rendering and DOM manipulation (legacy).",
    },

    // ============================================
    // BUILD & TOOLING
    // ============================================
    {
      name: "Create React App",
      aliases: ["CRA", "create-react-app", "React starter"],
      category: "Tooling",
      subcategory: "Setup",
      importance: "supporting",
      description:
        "An officially supported tool to create single-page React applications with zero configuration.",
    },
    {
      name: "Vite",
      aliases: ["vite", "Vite build tool", "vite dev server"],
      category: "Tooling",
      subcategory: "Build Tools",
      importance: "supporting",
      description:
        "A modern build tool that provides fast development and optimized production builds for React.",
    },

    // ============================================
    // NEXT.JS (REACT FRAMEWORK)
    // ============================================
    {
      name: "Next.js",
      aliases: ["Next", "nextjs", "Next.js framework"],
      category: "Frameworks",
      subcategory: "Full-Stack",
      importance: "supporting",
      description:
        "A React framework for building server-side rendered and statically generated applications.",
    },
    {
      name: "server-side rendering",
      aliases: ["SSR", "server rendering", "server-side render"],
      category: "Frameworks",
      subcategory: "Rendering Strategies",
      importance: "supporting",
      description:
        "Rendering React components on the server and sending HTML to the client.",
    },
    {
      name: "static site generation",
      aliases: ["SSG", "static generation", "pre-rendering"],
      category: "Frameworks",
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
      category: "Modern Features",
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
      category: "Modern Features",
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
      category: "Core Concepts",
      subcategory: "JSX",
      importance: "supporting",
      description:
        "A component that groups multiple elements without adding extra DOM nodes.",
    },
    {
      name: "portal",
      aliases: ["React portal", "createPortal", "ReactDOM.createPortal"],
      category: "Advanced Concepts",
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
      category: "Development",
      subcategory: "Debugging",
      importance: "supporting",
      description:
        "A tool for highlighting potential problems in an application during development.",
    },
  ],
};
