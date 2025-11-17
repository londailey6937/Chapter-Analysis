/**
 * Computing Concept Library
 *
 * General computer science concepts - theoretical foundations,
 * algorithms, data structures, and universal computing principles.
 * Language-specific concepts belong in dedicated libraries (JavaScript, React, etc.)
 */

import { ConceptDefinition, ConceptLibrary } from "./conceptLibraryTypes";

const CORE_CONCEPTS: ConceptDefinition[] = [
  {
    id: "computing-algorithm",
    name: "algorithm",
    aliases: ["algorithms", "algorithmic"],
    category: "Algorithms",
    subcategory: "Fundamentals",
    importance: "core",
    description:
      "A step-by-step procedure or formula for solving a problem or completing a task.",
  },
  {
    id: "computing-data-structure",
    name: "data structure",
    aliases: ["data structures"],
    category: "Data Structures",
    subcategory: "Fundamentals",
    importance: "core",
    description:
      "A specialized format for organizing, processing, and storing data efficiently.",
  },
  {
    id: "computing-sorting",
    name: "sorting",
    aliases: [
      "sort",
      "quicksort",
      "mergesort",
      "bubble sort",
      "insertion sort",
    ],
    category: "Algorithms",
    subcategory: "Sorting",
    importance: "core",
    description:
      "The process of arranging elements in a specific order (ascending or descending).",
  },
  {
    id: "computing-searching",
    name: "searching",
    aliases: ["search", "binary search", "linear search"],
    category: "Algorithms",
    subcategory: "Searching",
    importance: "core",
    description:
      "The process of finding a specific element within a collection of data.",
  },
  {
    id: "computing-recursion",
    name: "recursion",
    aliases: ["recursive"],
    category: "Algorithms",
    subcategory: "Techniques",
    importance: "core",
    description:
      "A technique where a function calls itself to solve smaller instances of the same problem.",
  },
  {
    id: "computing-traversal",
    name: "traversal",
    aliases: ["traverse", "tree traversal", "graph traversal"],
    category: "Algorithms",
    subcategory: "Techniques",
    importance: "core",
    description:
      "The process of visiting all nodes in a data structure in a systematic way.",
  },
  {
    id: "computing-time-complexity",
    name: "time complexity",
    aliases: ["runtime", "computational complexity"],
    category: "Complexity Analysis",
    subcategory: "Analysis",
    importance: "core",
    description:
      "A measure of the amount of time an algorithm takes to complete as a function of input size.",
  },
  {
    id: "computing-space-complexity",
    name: "space complexity",
    aliases: ["memory complexity"],
    category: "Complexity Analysis",
    subcategory: "Analysis",
    importance: "core",
    description:
      "A measure of the amount of memory an algorithm uses as a function of input size.",
  },
  {
    id: "computing-big-o-notation",
    name: "big O notation",
    aliases: ["Big-O", "asymptotic notation"],
    category: "Complexity Analysis",
    subcategory: "Analysis",
    importance: "core",
    description:
      "A mathematical notation that describes the upper bound of an algorithm's growth rate.",
  },
  {
    id: "computing-linked-list",
    name: "linked list",
    aliases: ["linked lists", "singly linked list", "doubly linked list"],
    category: "Data Structures",
    subcategory: "Linear",
    importance: "core",
    description:
      "A linear data structure where elements are stored in nodes, each pointing to the next node.",
  },
  {
    id: "computing-stack",
    name: "stack",
    aliases: ["stacks", "LIFO"],
    category: "Data Structures",
    subcategory: "Linear",
    importance: "core",
    description:
      "A last-in-first-out (LIFO) data structure where elements are added and removed from the same end.",
  },
  {
    id: "computing-queue",
    name: "queue",
    aliases: ["queues", "FIFO"],
    category: "Data Structures",
    subcategory: "Linear",
    importance: "core",
    description:
      "A first-in-first-out (FIFO) data structure where elements are added at one end and removed from the other.",
  },
  {
    id: "computing-tree",
    name: "tree",
    aliases: ["trees", "binary tree", "tree structure"],
    category: "Data Structures",
    subcategory: "Hierarchical",
    importance: "core",
    description:
      "A hierarchical data structure consisting of nodes connected by edges, with a root node and child nodes.",
  },
  {
    id: "computing-graph",
    name: "graph",
    aliases: ["graphs", "directed graph", "undirected graph"],
    category: "Data Structures",
    subcategory: "Nonlinear",
    importance: "core",
    description:
      "A data structure consisting of vertices (nodes) connected by edges, used to represent networks.",
  },
  {
    id: "computing-hash-table",
    name: "hash table",
    aliases: ["hash map", "hash tables"],
    category: "Data Structures",
    subcategory: "Associative",
    importance: "core",
    description:
      "A data structure that maps keys to values using a hash function for fast lookup.",
  },
  {
    id: "computing-heap",
    name: "heap",
    aliases: ["heaps", "min heap", "max heap", "priority queue"],
    category: "Data Structures",
    subcategory: "Tree-based",
    importance: "core",
    description:
      "A specialized tree-based data structure that satisfies the heap property.",
  },
  {
    id: "computing-object-oriented",
    name: "object-oriented programming",
    aliases: ["OOP", "object oriented"],
    category: "Programming Paradigms",
    subcategory: "Paradigms",
    importance: "core",
    description:
      "A programming paradigm based on the concept of objects that contain data and code.",
  },
  {
    id: "computing-encapsulation",
    name: "encapsulation",
    category: "Programming Paradigms",
    subcategory: "OOP Principles",
    importance: "core",
    description:
      "The bundling of data and methods that operate on that data within a single unit, hiding internal details.",
  },
  {
    id: "computing-inheritance",
    name: "inheritance",
    category: "Programming Paradigms",
    subcategory: "OOP Principles",
    importance: "core",
    description:
      "A mechanism where one class acquires properties and methods from another class.",
  },
  {
    id: "computing-polymorphism",
    name: "polymorphism",
    category: "Programming Paradigms",
    subcategory: "OOP Principles",
    importance: "core",
    description:
      "The ability of objects to take multiple forms or respond differently to the same method call.",
  },
  {
    id: "computing-abstraction",
    name: "abstraction",
    category: "Programming Paradigms",
    subcategory: "OOP Principles",
    importance: "core",
    description:
      "The process of hiding complex implementation details and showing only essential features.",
  },
  {
    id: "computing-functional-programming",
    name: "functional programming",
    aliases: ["functional", "FP"],
    category: "Programming Paradigms",
    subcategory: "Paradigms",
    importance: "core",
    description:
      "A programming paradigm that treats computation as the evaluation of mathematical functions.",
  },
  {
    id: "computing-database",
    name: "database",
    aliases: ["databases", "DB", "DBMS"],
    category: "Databases",
    subcategory: "Fundamentals",
    importance: "core",
    description:
      "An organized collection of structured data stored electronically.",
  },
  {
    id: "computing-relational-database",
    name: "relational database",
    aliases: ["RDBMS", "SQL database"],
    category: "Databases",
    subcategory: "Types",
    importance: "core",
    description:
      "A database that organizes data into tables with rows and columns, using relationships between tables.",
  },
  {
    id: "computing-nosql",
    name: "NoSQL",
    aliases: ["NoSQL database", "non-relational database"],
    category: "Databases",
    subcategory: "Types",
    importance: "core",
    description:
      "A database that provides a mechanism for storage and retrieval of data modeled in ways other than tabular relations.",
  },
  {
    id: "computing-normalization",
    name: "normalization",
    aliases: ["database normalization"],
    category: "Databases",
    subcategory: "Design",
    importance: "core",
    description:
      "The process of organizing database tables to minimize redundancy and dependency.",
  },
  {
    id: "computing-index",
    name: "index",
    aliases: ["database index", "indexing"],
    category: "Databases",
    subcategory: "Optimization",
    importance: "core",
    description:
      "A database structure that improves the speed of data retrieval operations.",
  },
  {
    id: "computing-transaction",
    name: "transaction",
    aliases: ["database transaction", "ACID"],
    category: "Databases",
    subcategory: "Operations",
    importance: "core",
    description:
      "A unit of work performed against a database that must be completed entirely or not at all.",
  },
  {
    id: "computing-operating-system",
    name: "operating system",
    aliases: ["OS", "operating systems"],
    category: "Operating Systems",
    subcategory: "Fundamentals",
    importance: "core",
    description:
      "System software that manages computer hardware and software resources and provides services for programs.",
  },
  {
    id: "computing-process",
    name: "process",
    aliases: ["processes"],
    category: "Operating Systems",
    subcategory: "Process Management",
    importance: "core",
    description:
      "An instance of a running program with its own memory space and system resources.",
  },
  {
    id: "computing-thread",
    name: "thread",
    aliases: ["threads", "multithreading"],
    category: "Operating Systems",
    subcategory: "Concurrency",
    importance: "core",
    description:
      "The smallest unit of execution within a process that can be scheduled by the operating system.",
  },
  {
    id: "computing-memory-management",
    name: "memory management",
    aliases: ["virtual memory", "paging"],
    category: "Operating Systems",
    subcategory: "Resource Management",
    importance: "core",
    description:
      "The process of controlling and coordinating computer memory, allocating and deallocating memory blocks.",
  },
  {
    id: "computing-file-system",
    name: "file system",
    aliases: ["filesystem"],
    category: "Operating Systems",
    subcategory: "Storage",
    importance: "core",
    description:
      "A method for storing and organizing files on storage devices.",
  },
  {
    id: "computing-network",
    name: "network",
    aliases: ["networking", "computer network"],
    category: "Networks",
    subcategory: "Fundamentals",
    importance: "core",
    description:
      "A system of interconnected computers that can share resources and communicate with each other.",
  },
  {
    id: "computing-protocol",
    name: "protocol",
    aliases: ["network protocol", "communication protocol"],
    category: "Networks",
    subcategory: "Communication",
    importance: "core",
    description:
      "A set of rules governing data communication between devices on a network.",
  },
  {
    id: "computing-tcp-ip",
    name: "TCP/IP",
    aliases: ["TCP", "IP", "internet protocol"],
    category: "Networks",
    subcategory: "Protocols",
    importance: "core",
    description: "The fundamental communication protocols of the internet.",
  },
  {
    id: "computing-client-server",
    name: "client-server",
    aliases: ["client server model"],
    category: "Networks",
    subcategory: "Architecture",
    importance: "core",
    description:
      "A distributed application structure that partitions tasks between service providers (servers) and requesters (clients).",
  },
  {
    id: "computing-encryption",
    name: "encryption",
    aliases: ["cryptography", "cipher"],
    category: "Security",
    subcategory: "Cryptography",
    importance: "core",
    description:
      "The process of encoding information so only authorized parties can access it.",
  },
  {
    id: "computing-authentication",
    name: "authentication",
    category: "Security",
    subcategory: "Access Control",
    importance: "core",
    description: "The process of verifying the identity of a user or system.",
  },
  {
    id: "computing-authorization",
    name: "authorization",
    category: "Security",
    subcategory: "Access Control",
    importance: "core",
    description:
      "The process of determining what resources an authenticated user is allowed to access.",
  },
  {
    id: "computing-compiler",
    name: "compiler",
    aliases: ["compilation"],
    category: "Language Processing",
    subcategory: "Translators",
    importance: "core",
    description:
      "A program that translates source code written in a high-level language into machine code.",
  },
  {
    id: "computing-interpreter",
    name: "interpreter",
    aliases: ["interpretation"],
    category: "Language Processing",
    subcategory: "Translators",
    importance: "core",
    description:
      "A program that executes code line-by-line without compiling it into machine code first.",
  },
  {
    id: "computing-machine-learning",
    name: "machine learning",
    aliases: ["ML", "artificial intelligence", "AI"],
    category: "Artificial Intelligence",
    subcategory: "Fundamentals",
    importance: "core",
    description:
      "A field of study that gives computers the ability to learn without being explicitly programmed.",
  },
  {
    id: "computing-neural-network",
    name: "neural network",
    aliases: ["neural networks", "deep learning"],
    category: "Artificial Intelligence",
    subcategory: "Machine Learning",
    importance: "core",
    description:
      "A computing system inspired by biological neural networks that learns to perform tasks by considering examples.",
  },
  {
    id: "computing-concurrent-programming",
    name: "concurrent programming",
    aliases: ["concurrency", "parallel programming"],
    category: "Programming Paradigms",
    subcategory: "Concurrency",
    importance: "core",
    description:
      "Programming where multiple computations are executed during overlapping time periods.",
  },
  {
    id: "computing-distributed-systems",
    name: "distributed systems",
    aliases: ["distributed computing"],
    category: "Systems",
    subcategory: "Architecture",
    importance: "core",
    description:
      "A system whose components are located on different networked computers that communicate and coordinate their actions.",
  },
  {
    id: "computing-cloud-computing",
    name: "cloud computing",
    aliases: ["cloud", "cloud services"],
    category: "Systems",
    subcategory: "Infrastructure",
    importance: "core",
    description:
      "The delivery of computing services over the internet including servers, storage, databases, and software.",
  },
  {
    id: "computing-version-control",
    name: "version control",
    aliases: ["source control", "revision control"],
    category: "Software Engineering",
    subcategory: "Tools",
    importance: "core",
    description:
      "A system for tracking changes to code over time and managing collaboration.",
  },
  {
    id: "computing-agile",
    name: "agile",
    aliases: ["agile methodology", "scrum", "sprint"],
    category: "Software Engineering",
    subcategory: "Methodologies",
    importance: "core",
    description:
      "An iterative approach to software development that prioritizes customer collaboration and adaptability.",
  },
  {
    id: "computing-design-pattern",
    name: "design pattern",
    aliases: ["design patterns", "software pattern"],
    category: "Software Engineering",
    subcategory: "Design",
    importance: "core",
    description:
      "A reusable solution to a commonly occurring problem in software design.",
  },
  {
    id: "computing-refactoring",
    name: "refactoring",
    aliases: ["code refactoring"],
    category: "Software Engineering",
    subcategory: "Maintenance",
    importance: "core",
    description:
      "The process of restructuring existing code without changing its external behavior.",
  },
  {
    id: "computing-technical-debt",
    name: "technical debt",
    category: "Software Engineering",
    subcategory: "Management",
    importance: "core",
    description:
      "The implied cost of additional rework caused by choosing an easy solution now instead of a better approach.",
  },
];

export const COMPUTING_CONCEPTS: ConceptLibrary = {
  domain: "computing",
  version: "2.0.0",
  concepts: CORE_CONCEPTS,
};

export default COMPUTING_CONCEPTS;
