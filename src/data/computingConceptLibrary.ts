/**
 * Computing Concept Library
 *
 * Core computing concepts modeled with explicit IDs to support
 * ID-based lookups during analysis.
 */

import { ConceptDefinition, ConceptLibrary } from "./conceptLibraryTypes";

const CORE_CONCEPTS: ConceptDefinition[] = [
  {
    id: "computing-algorithm",
    name: "algorithm",
    category: "Programming Fundamentals",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A step-by-step procedure or formula for solving a problem or completing a task.",
  },
  {
    id: "computing-function",
    name: "function",
    category: "Programming Fundamentals",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A reusable block of code that performs a specific task and can accept inputs and return outputs.",
  },
  {
    id: "computing-variable",
    name: "variable",
    category: "Programming Fundamentals",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A named storage location in memory that holds a value which can change during program execution.",
  },
  {
    id: "computing-loop",
    name: "loop",
    category: "Programming Fundamentals",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A control structure that repeats a block of code multiple times until a condition is met.",
  },
  {
    id: "computing-conditional-statement",
    name: "conditional statement",
    category: "Programming Fundamentals",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A programming construct that executes different code blocks based on whether a condition is true or false.",
  },
  {
    id: "computing-recursion",
    name: "recursion",
    category: "Programming Fundamentals",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A technique where a function calls itself to solve smaller instances of the same problem.",
  },
  {
    id: "computing-sorting",
    name: "sorting",
    category: "Algorithms",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The process of arranging elements in a specific order (ascending or descending).",
  },
  {
    id: "computing-searching",
    name: "searching",
    category: "Algorithms",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The process of finding a specific element within a collection of data.",
  },
  {
    id: "computing-traversal",
    name: "traversal",
    category: "Algorithms",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The process of visiting all nodes in a data structure in a systematic way.",
  },
  {
    id: "computing-time-complexity",
    name: "time complexity",
    category: "Complexity Analysis",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A measure of the amount of time an algorithm takes to complete as a function of input size.",
  },
  {
    id: "computing-space-complexity",
    name: "space complexity",
    category: "Complexity Analysis",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A measure of the amount of memory an algorithm uses as a function of input size.",
  },
  {
    id: "computing-big-o-notation",
    name: "big O notation",
    category: "Complexity Analysis",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A mathematical notation that describes the upper bound of an algorithm's growth rate.",
  },
  {
    id: "computing-hot-code",
    name: "hot code",
    category: "Performance Optimization",
    subcategory: "Runtime Behavior",
    importance: "supporting",
    description:
      "A high-frequency execution path or code region that dominates runtime costs and therefore benefits most from profiling and optimization efforts.",
  },
  {
    id: "computing-class",
    name: "class",
    category: "Object-Oriented Programming",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A blueprint or template for creating objects that defines properties and methods.",
  },
  {
    id: "computing-object",
    name: "object",
    category: "Object-Oriented Programming",
    subcategory: "Core Concepts",
    importance: "core",
    description: "A specific instance of a class containing data and methods.",
  },
  {
    id: "computing-inheritance",
    name: "inheritance",
    category: "Object-Oriented Programming",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A mechanism where one class acquires properties and methods from another class.",
  },
  {
    id: "computing-encapsulation",
    name: "encapsulation",
    category: "Object-Oriented Programming",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The bundling of data and methods that operate on that data within a single unit, hiding internal details.",
  },
  {
    id: "computing-polymorphism",
    name: "polymorphism",
    category: "Object-Oriented Programming",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The ability of objects to take multiple forms or respond differently to the same method call.",
  },
  {
    id: "computing-abstraction",
    name: "abstraction",
    category: "Object-Oriented Programming",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The process of hiding complex implementation details and showing only essential features.",
  },
  {
    id: "computing-debugging",
    name: "debugging",
    category: "Software Engineering",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The process of finding and fixing errors or bugs in software code.",
  },
  {
    id: "computing-testing",
    name: "testing",
    category: "Software Engineering",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The process of evaluating software to ensure it works correctly and meets requirements.",
  },
  {
    id: "computing-version-control",
    name: "version control",
    category: "Software Engineering",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A system for tracking changes to code over time and managing collaboration.",
  },
  {
    id: "computing-database",
    name: "database",
    category: "Databases",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "An organized collection of structured data stored electronically.",
  },
  {
    id: "computing-sql",
    name: "SQL",
    category: "Databases",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A standard language for managing and manipulating relational databases.",
  },
  {
    id: "computing-table",
    name: "table",
    category: "Databases",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A collection of related data organized in rows and columns in a relational database.",
  },
  {
    id: "computing-primary-key",
    name: "primary key",
    category: "Databases",
    subcategory: "Core Concepts",
    importance: "core",
    description: "A unique identifier for each record in a database table.",
  },
  {
    id: "computing-foreign-key",
    name: "foreign key",
    category: "Databases",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A field in one table that references the primary key in another table, establishing relationships.",
  },
  {
    id: "computing-html",
    name: "HTML",
    category: "Web Development",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The standard markup language for creating web pages and web applications.",
  },
  {
    id: "computing-css",
    name: "CSS",
    category: "Web Development",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A language used to describe the presentation and styling of HTML documents.",
  },
  {
    id: "computing-javascript",
    name: "JavaScript",
    category: "Web Development",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A programming language that enables interactive web pages and dynamic content.",
  },
  {
    id: "computing-http",
    name: "HTTP",
    category: "Web Development",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The protocol used for transmitting data over the web between clients and servers.",
  },
  {
    id: "computing-api",
    name: "API",
    category: "Web Development",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A set of rules and protocols that allows different software applications to communicate.",
  },
  {
    id: "computing-network",
    name: "network",
    category: "Networking",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A system of interconnected computers that can share resources and communicate with each other.",
  },
  {
    id: "computing-protocol",
    name: "protocol",
    category: "Networking",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A set of rules governing data communication between devices on a network.",
  },
  {
    id: "computing-ip-address",
    name: "IP address",
    category: "Networking",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A unique numerical identifier assigned to each device connected to a network.",
  },
  {
    id: "computing-process",
    name: "process",
    category: "Operating Systems",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "An instance of a running program with its own memory space and system resources.",
  },
  {
    id: "computing-thread",
    name: "thread",
    category: "Operating Systems",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The smallest unit of execution within a process that can be scheduled by the operating system.",
  },
  {
    id: "computing-memory-management",
    name: "memory management",
    category: "Operating Systems",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The process of controlling and coordinating computer memory, allocating and deallocating memory blocks.",
  },
  {
    id: "computing-file-system",
    name: "file system",
    category: "Operating Systems",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A method for storing and organizing files on storage devices.",
  },
  {
    id: "computing-encryption",
    name: "encryption",
    category: "Security",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The process of encoding information so only authorized parties can access it.",
  },
  {
    id: "computing-authentication",
    name: "authentication",
    category: "Security",
    subcategory: "Core Concepts",
    importance: "core",
    description: "The process of verifying the identity of a user or system.",
  },
  {
    id: "computing-authorization",
    name: "authorization",
    category: "Security",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "The process of determining what resources an authenticated user is allowed to access.",
  },
  {
    id: "computing-compiler",
    name: "compiler",
    category: "Language Processing",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A program that translates source code written in a high-level language into machine code.",
  },
  {
    id: "computing-interpreter",
    name: "interpreter",
    category: "Language Processing",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A program that executes code line-by-line without compiling it into machine code first.",
  },
  {
    id: "computing-rest",
    name: "REST",
    category: "Web Development",
    subcategory: "API Design",
    importance: "core",
    description:
      "An architectural style for designing networked applications using stateless HTTP requests and standard methods.",
  },
  {
    id: "computing-endpoint",
    name: "endpoint",
    category: "Web Development",
    subcategory: "API Design",
    importance: "core",
    description:
      "A specific URL or URI where an API can be accessed and performs a specific function.",
  },
  {
    id: "computing-json",
    name: "JSON",
    category: "Web Development",
    subcategory: "Data Formats",
    importance: "core",
    description:
      "A lightweight data-interchange format that is easy for humans to read and write and for machines to parse and generate.",
  },
  {
    id: "computing-http-methods",
    name: "HTTP methods",
    category: "Web Development",
    subcategory: "API Design",
    importance: "core",
    description:
      "Standard request methods used in HTTP to indicate the desired action to be performed on a resource.",
  },
  {
    id: "computing-asynchronous-programming",
    name: "asynchronous programming",
    category: "Programming Paradigms",
    subcategory: "Concurrency",
    importance: "core",
    description:
      "A programming paradigm that allows operations to run independently without blocking the execution of other code.",
  },
  {
    id: "computing-promise",
    name: "promise",
    category: "Programming Paradigms",
    subcategory: "Asynchronous",
    importance: "core",
    description:
      "An object representing the eventual completion or failure of an asynchronous operation and its resulting value.",
  },
  {
    id: "computing-async-await",
    name: "async/await",
    category: "Programming Paradigms",
    subcategory: "Asynchronous",
    importance: "core",
    description:
      "Modern syntax for handling asynchronous operations that makes asynchronous code look and behave more like synchronous code.",
  },
  {
    id: "computing-lambda",
    name: "lambda",
    category: "Programming Paradigms",
    subcategory: "Functional Programming",
    importance: "core",
    description:
      "An anonymous function defined without a name, often used for short, throwaway functions passed as arguments.",
  },
  {
    id: "computing-unit-test",
    name: "unit test",
    category: "Software Engineering",
    subcategory: "Testing",
    importance: "core",
    description:
      "A type of testing that validates individual units or components of software in isolation.",
  },
  {
    id: "computing-git",
    name: "git",
    category: "Software Engineering",
    subcategory: "Development Tools",
    importance: "core",
    description:
      "A distributed version control system for tracking changes in source code during software development.",
  },
  {
    id: "computing-repository",
    name: "repository",
    category: "Software Engineering",
    subcategory: "Development Tools",
    importance: "core",
    description:
      "A central location where code and related files are stored and managed, typically using version control.",
  },
  {
    id: "computing-commit",
    name: "commit",
    category: "Software Engineering",
    subcategory: "Version Control",
    importance: "core",
    description:
      "A snapshot of changes to a repository, recording what was changed and why.",
  },
  {
    id: "computing-package-manager",
    name: "package manager",
    category: "Software Engineering",
    subcategory: "Development Tools",
    importance: "core",
    description:
      "A tool that automates the process of installing, upgrading, configuring, and removing software packages.",
  },
  {
    id: "computing-dependency",
    name: "dependency",
    category: "Software Engineering",
    subcategory: "Package Management",
    importance: "core",
    description:
      "An external library or package that a project requires to function properly.",
  },
  {
    id: "computing-framework",
    name: "framework",
    category: "Software Engineering",
    subcategory: "Core Concepts",
    importance: "core",
    description:
      "A platform providing a foundation and structure for developing software applications, with predefined components and patterns.",
  },
  {
    id: "computing-deployment",
    name: "deployment",
    category: "Software Engineering",
    subcategory: "DevOps",
    importance: "core",
    description:
      "The process of making software available for use, typically by transferring it to a production environment.",
  },
  {
    id: "computing-interface",
    name: "interface",
    category: "Object-Oriented Programming",
    subcategory: "Abstraction",
    importance: "core",
    description:
      "A contract that defines a set of methods and properties that a class must implement, without specifying how.",
  },
  {
    id: "computing-exception-handling",
    name: "exception handling",
    category: "Programming Fundamentals",
    subcategory: "Error Handling",
    importance: "core",
    description:
      "A mechanism for handling runtime errors and exceptional conditions in a controlled manner.",
  },
  {
    id: "computing-agile-methodology",
    name: "agile methodology",
    category: "Software Engineering",
    subcategory: "Methodologies",
    importance: "core",
    description:
      "An iterative approach to software development that prioritizes customer collaboration, adaptability, and incremental delivery.",
  },
  {
    id: "computing-continuous-integration",
    name: "continuous integration",
    category: "Software Engineering",
    subcategory: "Automation",
    importance: "core",
    description:
      "A practice where developers merge code changes frequently and automated builds verify correctness.",
  },
  {
    id: "computing-extract-transform-load",
    name: "extract transform load",
    category: "Data Engineering",
    subcategory: "Pipelines",
    importance: "core",
    description:
      "A process that moves data from source systems into a centralized store through extraction, transformation, and loading.",
  },
  {
    id: "computing-accessibility-compliance",
    name: "accessibility compliance",
    category: "Human-Computer Interaction",
    subcategory: "Inclusive Design",
    importance: "core",
    description:
      "Adhering to standards that ensure software is usable by people with diverse abilities.",
  },
];

export const COMPUTING_CONCEPTS: ConceptLibrary = {
  domain: "computing",
  version: "2.0.0",
  concepts: CORE_CONCEPTS,
};

export default COMPUTING_CONCEPTS;
