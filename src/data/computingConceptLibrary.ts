/**
 * Computing Concept Library
 *
 * Comprehensive library of computer science and programming concepts.
 * Organized by topic area for precise concept identification.
 */

import { ConceptLibrary, ConceptDefinition } from "./conceptLibraryTypes";

export const COMPUTING_CONCEPTS: ConceptLibrary = {
  domain: "computing",
  version: "1.0.0",
  concepts: [
    // Programming Fundamentals
    {
      name: "algorithm",
      aliases: [
        "algorithms",
        "algorithmic approach",
        "algorithmic solution",
        "algorithmic thinking",
      ],
      category: "Programming Fundamentals",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A step-by-step procedure or formula for solving a problem or completing a task.",
    },
    {
      name: "function",
      aliases: [
        "method",
        "procedure",
        "subroutine",
        "functions",
        "methods",
        "function definition",
        "function call",
      ],
      category: "Programming Fundamentals",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A reusable block of code that performs a specific task and can accept inputs and return outputs.",
    },
    {
      name: "variable",
      aliases: [
        "variables",
        "var",
        "variable declaration",
        "variable assignment",
      ],
      category: "Programming Fundamentals",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A named storage location in memory that holds a value which can change during program execution.",
    },
    {
      name: "loop",
      aliases: [
        "loops",
        "iteration",
        "for loop",
        "while loop",
        "do-while",
        "loop structure",
        "iterating",
      ],
      category: "Programming Fundamentals",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A control structure that repeats a block of code multiple times until a condition is met.",
    },
    {
      name: "conditional statement",
      aliases: [
        "conditional statements",
        "conditionals",
        "if statement",
        "if-else",
        "switch statement",
        "case statement",
        "conditional logic",
        "conditional expression",
      ],
      category: "Programming Fundamentals",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A programming construct that executes different code blocks based on whether a condition is true or false.",
    },
    {
      name: "recursion",
      aliases: [
        "recursive",
        "recursive function",
        "recursive call",
        "recursive algorithm",
      ],
      category: "Programming Fundamentals",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A technique where a function calls itself to solve smaller instances of the same problem.",
    },
    {
      name: "parameter",
      aliases: ["parameters", "argument", "arguments", "parameter passing"],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A variable used in a function definition to accept input values when the function is called.",
    },
    {
      name: "return value",
      aliases: ["return", "return type", "return statement"],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "The output value that a function sends back to the code that called it.",
    },
    {
      name: "scope",
      aliases: [
        "variable scope",
        "function scope",
        "block scope",
        "lexical scope",
      ],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "The region of code where a variable or function is accessible and can be referenced.",
    },
    {
      name: "type",
      aliases: ["data type", "types", "type system", "typing"],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A classification that specifies what kind of value a variable can hold (e.g., integer, string, boolean).",
    },
    {
      name: "expression",
      aliases: ["expressions", "boolean expression", "arithmetic expression"],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A combination of values, variables, and operators that evaluates to a single value.",
    },
    {
      name: "statement",
      aliases: ["statements", "code statement"],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A single instruction or line of code that performs an action in a program.",
    },
    {
      name: "operator",
      aliases: [
        "operators",
        "arithmetic operator",
        "logical operator",
        "comparison operator",
      ],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A symbol that performs operations on values and variables (e.g., +, -, ==, &&).",
    },
    {
      name: "pointer",
      aliases: ["pointers", "memory address", "reference"],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A variable that stores the memory address of another variable.",
    },
    {
      name: "exception",
      aliases: ["exceptions", "error handling", "try-catch", "throw"],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "An error or unexpected event that occurs during program execution and can be handled to prevent crashes.",
    },
    {
      name: "library",
      aliases: [
        "libraries",
        "module",
        "package",
        "import",
        "code library",
        "software library",
        "third-party library",
      ],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A collection of pre-written code that provides reusable functionality for common tasks.",
    },

    // Data Structures
    {
      name: "array",
      aliases: ["Array", "arrays", "list", "lists"],
      category: "Data Structures",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A collection of elements stored in contiguous memory locations, accessed by index.",
    },
    {
      name: "linked list",
      aliases: ["linked lists", "singly linked list", "doubly linked list"],
      category: "Data Structures",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A linear data structure where elements are stored in nodes, each pointing to the next node.",
    },
    {
      name: "stack",
      aliases: ["stacks", "LIFO", "push", "pop"],
      category: "Data Structures",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end.",
    },
    {
      name: "queue",
      aliases: ["queues", "FIFO", "enqueue", "dequeue"],
      category: "Data Structures",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A First-In-First-Out (FIFO) data structure where elements are added at one end and removed from the other.",
    },
    {
      name: "tree",
      aliases: ["trees", "binary tree", "tree structure"],
      category: "Data Structures",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A hierarchical data structure consisting of nodes connected by edges, with a root node at the top.",
    },
    {
      name: "graph",
      aliases: ["graphs", "directed graph", "undirected graph", "network"],
      category: "Data Structures",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A collection of nodes (vertices) connected by edges, used to represent relationships between objects.",
    },
    {
      name: "hash table",
      aliases: ["hash map", "dictionary", "hash tables", "hashtable"],
      category: "Data Structures",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A data structure that maps keys to values using a hash function for fast lookups.",
    },
    {
      name: "heap",
      aliases: ["heaps", "min heap", "max heap", "priority queue"],
      category: "Data Structures",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A tree-based structure where parent nodes have higher (or lower) priority than their children.",
    },
    {
      name: "set",
      aliases: ["Set", "sets", "hash set"],
      category: "Data Structures",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description: "A collection of unique elements with no duplicates.",
    },
    {
      name: "map",
      aliases: ["Map", "maps", "mapping"],
      category: "Data Structures",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A collection of key-value pairs where each key maps to exactly one value.",
    },

    // Algorithms
    {
      name: "sorting",
      aliases: [
        "sort",
        "sorting algorithm",
        "bubble sort",
        "merge sort",
        "quick sort",
        "insertion sort",
      ],
      category: "Algorithms",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of arranging elements in a specific order (ascending or descending).",
    },
    {
      name: "searching",
      aliases: ["search", "search algorithm", "linear search", "binary search"],
      category: "Algorithms",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of finding a specific element within a collection of data.",
    },
    {
      name: "traversal",
      aliases: [
        "tree traversal",
        "graph traversal",
        "DFS",
        "BFS",
        "depth-first",
        "breadth-first",
      ],
      category: "Algorithms",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of visiting all nodes in a data structure in a systematic way.",
    },
    {
      name: "dynamic programming",
      aliases: ["DP", "memoization", "tabulation"],
      category: "Algorithms",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "An optimization technique that solves problems by breaking them into overlapping subproblems and storing results.",
    },
    {
      name: "greedy algorithm",
      aliases: ["greedy", "greedy approach"],
      category: "Algorithms",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "An approach that makes locally optimal choices at each step to find a global optimum.",
    },
    {
      name: "divide and conquer",
      aliases: ["divide-and-conquer"],
      category: "Algorithms",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A strategy that breaks a problem into smaller subproblems, solves them recursively, and combines the results.",
    },

    // Complexity Analysis
    {
      name: "time complexity",
      aliases: ["runtime", "computational complexity", "asymptotic analysis"],
      category: "Complexity Analysis",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A measure of the amount of time an algorithm takes to complete as a function of input size.",
    },
    {
      name: "space complexity",
      aliases: ["memory complexity", "space usage"],
      category: "Complexity Analysis",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A measure of the amount of memory an algorithm uses as a function of input size.",
    },
    {
      name: "big O notation",
      aliases: ["big O", "O notation", "big-O"],
      category: "Complexity Analysis",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A mathematical notation that describes the upper bound of an algorithm's growth rate.",
    },

    // Object-Oriented Programming
    {
      name: "class",
      aliases: ["classes", "object class"],
      category: "Object-Oriented Programming",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A blueprint or template for creating objects that defines properties and methods.",
    },
    {
      name: "object",
      aliases: ["objects", "instance", "instances"],
      category: "Object-Oriented Programming",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A specific instance of a class containing data and methods.",
    },
    {
      name: "inheritance",
      aliases: ["inherit", "extends", "subclass", "superclass"],
      category: "Object-Oriented Programming",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A mechanism where one class acquires properties and methods from another class.",
    },
    {
      name: "encapsulation",
      aliases: ["encapsulate", "data hiding"],
      category: "Object-Oriented Programming",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The bundling of data and methods that operate on that data within a single unit, hiding internal details.",
    },
    {
      name: "polymorphism",
      aliases: ["polymorphic", "overloading", "overriding"],
      category: "Object-Oriented Programming",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The ability of objects to take multiple forms or respond differently to the same method call.",
    },
    {
      name: "abstraction",
      aliases: ["abstract", "abstract class", "interface"],
      category: "Object-Oriented Programming",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of hiding complex implementation details and showing only essential features.",
    },
    {
      name: "constructor",
      aliases: ["constructors", "initialization", "init"],
      category: "Object-Oriented Programming",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A special method that initializes a newly created object of a class.",
    },
    {
      name: "destructor",
      aliases: ["destructors", "finalize", "dispose"],
      category: "Object-Oriented Programming",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A special method that cleans up resources when an object is destroyed.",
    },
    {
      name: "access modifier",
      aliases: ["public", "private", "protected", "access control"],
      category: "Object-Oriented Programming",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "Keywords that set the accessibility of classes, methods, and properties.",
    },

    // Software Engineering
    {
      name: "debugging",
      aliases: [
        "debug",
        "debugger",
        "troubleshooting",
        "debugging tools",
        "breakpoint",
        "breakpoints",
      ],
      category: "Software Engineering",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of finding and fixing errors or bugs in software code.",
    },
    {
      name: "testing",
      aliases: ["test", "unit test", "integration test", "test case"],
      category: "Software Engineering",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of evaluating software to ensure it works correctly and meets requirements.",
    },
    {
      name: "version control",
      aliases: [
        "git",
        "source control",
        "revision control",
        "VCS",
        "version control system",
      ],
      category: "Software Engineering",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A system for tracking changes to code over time and managing collaboration.",
    },
    {
      name: "code review",
      aliases: ["peer review", "review"],
      category: "Software Engineering",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "The systematic examination of source code by peers to find defects and improve quality.",
    },
    {
      name: "refactoring",
      aliases: ["refactor", "code refactoring"],
      category: "Software Engineering",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "The process of restructuring existing code without changing its external behavior to improve readability and maintainability.",
    },
    {
      name: "design pattern",
      aliases: [
        "design patterns",
        "software pattern",
        "singleton",
        "factory",
        "observer",
      ],
      category: "Software Engineering",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "Reusable solutions to commonly occurring problems in software design.",
    },

    // Databases
    {
      name: "database",
      aliases: ["databases", "DB", "data storage"],
      category: "Databases",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "An organized collection of structured data stored electronically.",
    },
    {
      name: "SQL",
      aliases: ["structured query language", "query"],
      category: "Databases",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A standard language for managing and manipulating relational databases.",
    },
    {
      name: "table",
      aliases: ["tables", "database table", "relation"],
      category: "Databases",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A collection of related data organized in rows and columns in a relational database.",
    },
    {
      name: "primary key",
      aliases: ["primary keys", "PK"],
      category: "Databases",
      subcategory: "Core Concepts",
      importance: "core",
      description: "A unique identifier for each record in a database table.",
    },
    {
      name: "foreign key",
      aliases: ["foreign keys", "FK"],
      category: "Databases",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A field in one table that references the primary key in another table, establishing relationships.",
    },
    {
      name: "normalization",
      aliases: ["normalize", "database normalization", "normal form"],
      category: "Databases",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "The process of organizing data to reduce redundancy and improve data integrity.",
    },
    {
      name: "index",
      aliases: ["indexes", "database index", "indexing"],
      category: "Databases",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A data structure that improves the speed of data retrieval operations on a database table.",
    },
    {
      name: "transaction",
      aliases: ["transactions", "ACID"],
      category: "Databases",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A sequence of database operations treated as a single unit that must complete entirely or not at all.",
    },
    {
      name: "join",
      aliases: ["joins", "inner join", "outer join", "left join", "right join"],
      category: "Databases",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "An operation that combines rows from two or more tables based on a related column.",
    },

    // Web Development
    {
      name: "HTML",
      aliases: ["hypertext markup language", "markup"],
      category: "Web Development",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The standard markup language for creating web pages and web applications.",
    },
    {
      name: "CSS",
      aliases: ["cascading style sheets", "stylesheet", "styling"],
      category: "Web Development",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A language used to describe the presentation and styling of HTML documents.",
    },
    {
      name: "JavaScript",
      aliases: ["JS", "ECMAScript"],
      category: "Web Development",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A programming language that enables interactive web pages and dynamic content.",
    },
    {
      name: "HTTP",
      aliases: ["hypertext transfer protocol", "HTTPS"],
      category: "Web Development",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The protocol used for transmitting data over the web between clients and servers.",
    },
    {
      name: "API",
      aliases: [
        "application programming interface",
        "REST API",
        "web API",
        "APIs",
        "API call",
        "API endpoint",
      ],
      category: "Web Development",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A set of rules and protocols that allows different software applications to communicate.",
    },
    {
      name: "client-server",
      aliases: ["client server", "client-side", "server-side"],
      category: "Web Development",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "An architecture where client programs request services from server programs.",
    },
    {
      name: "DOM",
      aliases: ["document object model", "DOM tree"],
      category: "Web Development",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A programming interface that represents HTML documents as a tree structure of objects.",
    },
    {
      name: "AJAX",
      aliases: ["asynchronous JavaScript", "XMLHttpRequest"],
      category: "Web Development",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A technique for creating asynchronous web applications that update content without reloading the page.",
    },

    // Networking
    {
      name: "network",
      aliases: ["networks", "networking", "computer network"],
      category: "Networking",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A system of interconnected computers that can share resources and communicate with each other.",
    },
    {
      name: "protocol",
      aliases: ["protocols", "network protocol"],
      category: "Networking",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A set of rules governing data communication between devices on a network.",
    },
    {
      name: "IP address",
      aliases: ["IP", "internet protocol", "IPv4", "IPv6"],
      category: "Networking",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A unique numerical identifier assigned to each device connected to a network.",
    },
    {
      name: "TCP",
      aliases: ["transmission control protocol", "TCP/IP"],
      category: "Networking",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A reliable, connection-oriented protocol that ensures data is delivered in order and without errors.",
    },
    {
      name: "UDP",
      aliases: ["user datagram protocol"],
      category: "Networking",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A connectionless protocol that sends data quickly without error checking or guaranteed delivery.",
    },
    {
      name: "DNS",
      aliases: ["domain name system", "domain name"],
      category: "Networking",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A system that translates human-readable domain names into IP addresses.",
    },
    {
      name: "router",
      aliases: ["routers", "routing"],
      category: "Networking",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A device that forwards data packets between computer networks.",
    },

    // Operating Systems
    {
      name: "process",
      aliases: ["processes", "process management"],
      category: "Operating Systems",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "An instance of a running program with its own memory space and system resources.",
    },
    {
      name: "thread",
      aliases: [
        "threads",
        "threading",
        "multithreading",
        "thread execution",
        "worker thread",
      ],
      category: "Operating Systems",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The smallest unit of execution within a process that can be scheduled by the operating system.",
    },
    {
      name: "memory management",
      aliases: ["memory", "RAM", "virtual memory"],
      category: "Operating Systems",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of controlling and coordinating computer memory, allocating and deallocating memory blocks.",
    },
    {
      name: "file system",
      aliases: ["filesystem", "file storage"],
      category: "Operating Systems",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A method for storing and organizing files on storage devices.",
    },
    {
      name: "scheduling",
      aliases: ["process scheduling", "CPU scheduling", "scheduler"],
      category: "Operating Systems",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "The method by which an operating system decides which process runs at any given time.",
    },
    {
      name: "deadlock",
      aliases: ["deadlocks", "resource deadlock"],
      category: "Operating Systems",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A situation where processes are unable to proceed because each is waiting for resources held by others.",
    },
    {
      name: "synchronization",
      aliases: ["thread synchronization", "mutex", "semaphore"],
      category: "Operating Systems",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "Mechanisms to control access to shared resources and coordinate execution of concurrent processes.",
    },

    // Security
    {
      name: "encryption",
      aliases: ["encrypt", "cryptography", "cipher"],
      category: "Security",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of encoding information so only authorized parties can access it.",
    },
    {
      name: "authentication",
      aliases: ["auth", "login", "credential"],
      category: "Security",
      subcategory: "Core Concepts",
      importance: "core",
      description: "The process of verifying the identity of a user or system.",
    },
    {
      name: "authorization",
      aliases: ["access control", "permission", "permissions"],
      category: "Security",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "The process of determining what resources an authenticated user is allowed to access.",
    },
    {
      name: "hash function",
      aliases: ["hashing", "hash", "cryptographic hash"],
      category: "Security",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A function that converts input data into a fixed-size string of characters, used for data integrity and security.",
    },
    {
      name: "firewall",
      aliases: ["firewalls", "network security"],
      category: "Security",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A security system that monitors and controls incoming and outgoing network traffic based on security rules.",
    },

    // Language Processing
    {
      name: "compiler",
      aliases: ["compilers", "compilation", "compile"],
      category: "Language Processing",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A program that translates source code written in a high-level language into machine code.",
    },
    {
      name: "interpreter",
      aliases: ["interpreters", "interpretation", "interpret"],
      category: "Language Processing",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A program that executes code line-by-line without compiling it into machine code first.",
    },
    {
      name: "syntax",
      aliases: ["syntax error", "grammar"],
      category: "Language Processing",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "The set of rules that define the structure and format of valid statements in a programming language.",
    },
    {
      name: "semantics",
      aliases: ["semantic", "meaning"],
      category: "Language Processing",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "The meaning and behavior of programming language constructs.",
    },

    // ============================================
    // MODERN WEB DEVELOPMENT & APIs
    // ============================================
    {
      name: "REST",
      aliases: [
        "RESTful",
        "REST API",
        "RESTful API",
        "representational state transfer",
        "RESTful service",
      ],
      category: "Web Development",
      subcategory: "API Design",
      importance: "core",
      description:
        "An architectural style for designing networked applications using stateless HTTP requests and standard methods.",
    },
    {
      name: "endpoint",
      aliases: ["endpoints", "API endpoint", "REST endpoint", "URL endpoint"],
      category: "Web Development",
      subcategory: "API Design",
      importance: "core",
      description:
        "A specific URL or URI where an API can be accessed and performs a specific function.",
    },
    {
      name: "JSON",
      aliases: [
        "JavaScript object notation",
        "JSON format",
        "JSON data",
        "JSON object",
        "JSON response",
      ],
      category: "Web Development",
      subcategory: "Data Formats",
      importance: "core",
      description:
        "A lightweight data-interchange format that is easy for humans to read and write and for machines to parse and generate.",
    },
    {
      name: "HTTP methods",
      aliases: [
        "HTTP verbs",
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "HTTP request methods",
      ],
      category: "Web Development",
      subcategory: "API Design",
      importance: "core",
      description:
        "Standard request methods used in HTTP to indicate the desired action to be performed on a resource.",
    },
    {
      name: "CRUD",
      aliases: [
        "create read update delete",
        "CRUD operations",
        "CRUD application",
      ],
      category: "Web Development",
      subcategory: "API Design",
      importance: "supporting",
      description:
        "The four basic operations for persistent storage: Create, Read, Update, and Delete.",
    },
    {
      name: "middleware",
      aliases: [
        "middleware function",
        "middleware layer",
        "express middleware",
      ],
      category: "Web Development",
      subcategory: "Architecture",
      importance: "supporting",
      description:
        "Software that acts as a bridge between different applications or layers, often processing requests before they reach the main handler.",
    },

    // ============================================
    // ASYNCHRONOUS PROGRAMMING
    // ============================================
    {
      name: "asynchronous programming",
      aliases: [
        "async",
        "asynchronous",
        "async programming",
        "non-blocking",
        "asynchronous execution",
      ],
      category: "Programming Paradigms",
      subcategory: "Concurrency",
      importance: "core",
      description:
        "A programming paradigm that allows operations to run independently without blocking the execution of other code.",
    },
    {
      name: "promise",
      aliases: [
        "Promise",
        "promises",
        "JavaScript promise",
        "promise object",
        "promise chain",
        "promise.then",
      ],
      category: "Programming Paradigms",
      subcategory: "Asynchronous",
      importance: "core",
      description:
        "An object representing the eventual completion or failure of an asynchronous operation and its resulting value.",
    },
    {
      name: "async/await",
      aliases: [
        "async await",
        "await keyword",
        "async function",
        "async syntax",
      ],
      category: "Programming Paradigms",
      subcategory: "Asynchronous",
      importance: "core",
      description:
        "Modern syntax for handling asynchronous operations that makes asynchronous code look and behave more like synchronous code.",
    },
    {
      name: "callback",
      aliases: [
        "callback function",
        "callback pattern",
        "callback hell",
        "callbacks",
      ],
      category: "Programming Paradigms",
      subcategory: "Asynchronous",
      importance: "supporting",
      description:
        "A function passed as an argument to another function to be executed later, often after an asynchronous operation completes.",
    },

    // ============================================
    // FUNCTIONAL PROGRAMMING
    // ============================================
    {
      name: "functional programming",
      aliases: [
        "functional paradigm",
        "functional approach",
        "FP",
        "functional style",
      ],
      category: "Programming Paradigms",
      subcategory: "Core Concepts",
      importance: "supporting",
      description:
        "A programming paradigm that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data.",
    },
    {
      name: "lambda",
      aliases: [
        "lambda function",
        "anonymous function",
        "lambda expression",
        "arrow function",
        "lambda calculus",
      ],
      category: "Programming Paradigms",
      subcategory: "Functional Programming",
      importance: "core",
      description:
        "An anonymous function defined without a name, often used for short, throwaway functions passed as arguments.",
    },
    {
      name: "closure",
      aliases: ["closures", "lexical closure", "function closure"],
      category: "Programming Paradigms",
      subcategory: "Functional Programming",
      importance: "supporting",
      description:
        "A function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.",
    },
    {
      name: "higher-order function",
      aliases: [
        "higher order function",
        "HOF",
        "first-class function",
        "function as argument",
      ],
      category: "Programming Paradigms",
      subcategory: "Functional Programming",
      importance: "supporting",
      description:
        "A function that takes one or more functions as arguments or returns a function as its result.",
    },
    {
      name: "pure function",
      aliases: ["pure functions", "function purity", "side-effect-free"],
      category: "Programming Paradigms",
      subcategory: "Functional Programming",
      importance: "supporting",
      description:
        "A function that always returns the same output for the same inputs and has no side effects.",
    },

    // ============================================
    // TESTING & QUALITY ASSURANCE
    // ============================================
    {
      name: "unit test",
      aliases: [
        "unit testing",
        "unit tests",
        "test case",
        "test suite",
        "unit test case",
      ],
      category: "Software Engineering",
      subcategory: "Testing",
      importance: "core",
      description:
        "A type of testing that validates individual units or components of software in isolation.",
    },
    {
      name: "integration test",
      aliases: [
        "integration testing",
        "integration tests",
        "integration test case",
      ],
      category: "Software Engineering",
      subcategory: "Testing",
      importance: "supporting",
      description:
        "Testing that verifies the interactions between different components or systems work correctly together.",
    },
    {
      name: "test-driven development",
      aliases: ["TDD", "test driven development", "test first"],
      category: "Software Engineering",
      subcategory: "Testing",
      importance: "supporting",
      description:
        "A software development approach where tests are written before the actual code implementation.",
    },
    {
      name: "mock",
      aliases: [
        "mocking",
        "mock object",
        "test mock",
        "mock function",
        "stub",
        "stubbing",
      ],
      category: "Software Engineering",
      subcategory: "Testing",
      importance: "supporting",
      description:
        "A simulated object or function that mimics the behavior of real components for testing purposes.",
    },

    // ============================================
    // DEVELOPMENT TOOLS & PRACTICES
    // ============================================
    {
      name: "git",
      aliases: ["git repository", "git repo", "git workflow"],
      category: "Software Engineering",
      subcategory: "Development Tools",
      importance: "core",
      description:
        "A distributed version control system for tracking changes in source code during software development.",
    },
    {
      name: "repository",
      aliases: [
        "repo",
        "code repository",
        "git repository",
        "source repository",
      ],
      category: "Software Engineering",
      subcategory: "Development Tools",
      importance: "core",
      description:
        "A central location where code and related files are stored and managed, typically using version control.",
    },
    {
      name: "commit",
      aliases: ["commits", "git commit", "commit message", "committing"],
      category: "Software Engineering",
      subcategory: "Version Control",
      importance: "core",
      description:
        "A snapshot of changes to a repository, recording what was changed and why.",
    },
    {
      name: "branch",
      aliases: [
        "branches",
        "git branch",
        "feature branch",
        "branching",
        "branch strategy",
      ],
      category: "Software Engineering",
      subcategory: "Version Control",
      importance: "supporting",
      description:
        "A parallel version of a repository that allows development without affecting the main codebase.",
    },
    {
      name: "merge",
      aliases: ["merging", "git merge", "merge conflict", "merge request"],
      category: "Software Engineering",
      subcategory: "Version Control",
      importance: "supporting",
      description:
        "The process of integrating changes from one branch into another in version control.",
    },

    // ============================================
    // PACKAGE MANAGEMENT & DEPENDENCIES
    // ============================================
    {
      name: "package manager",
      aliases: [
        "package management",
        "dependency manager",
        "package management system",
      ],
      category: "Software Engineering",
      subcategory: "Development Tools",
      importance: "core",
      description:
        "A tool that automates the process of installing, upgrading, configuring, and removing software packages.",
    },
    {
      name: "npm",
      aliases: [
        "node package manager",
        "npm package",
        "npm install",
        "npm registry",
      ],
      category: "Software Engineering",
      subcategory: "Package Managers",
      importance: "supporting",
      description:
        "The default package manager for Node.js, used to install and manage JavaScript libraries and dependencies.",
    },
    {
      name: "dependency",
      aliases: [
        "dependencies",
        "package dependency",
        "external dependency",
        "dependency tree",
      ],
      category: "Software Engineering",
      subcategory: "Package Management",
      importance: "core",
      description:
        "An external library or package that a project requires to function properly.",
    },
    {
      name: "framework",
      aliases: [
        "frameworks",
        "application framework",
        "web framework",
        "software framework",
      ],
      category: "Software Engineering",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A platform providing a foundation and structure for developing software applications, with predefined components and patterns.",
    },

    // ============================================
    // DEVOPS & DEPLOYMENT
    // ============================================
    {
      name: "CI/CD",
      aliases: [
        "continuous integration",
        "continuous deployment",
        "continuous delivery",
        "CI CD",
        "CI pipeline",
      ],
      category: "Software Engineering",
      subcategory: "DevOps",
      importance: "supporting",
      description:
        "Practices that automate the integration, testing, and deployment of code changes to production.",
    },
    {
      name: "Docker",
      aliases: [
        "docker container",
        "docker image",
        "dockerfile",
        "containerization",
      ],
      category: "Software Engineering",
      subcategory: "DevOps",
      importance: "supporting",
      description:
        "A platform for developing, shipping, and running applications in isolated containers.",
    },
    {
      name: "container",
      aliases: [
        "containers",
        "containerized",
        "container image",
        "containerization",
      ],
      category: "Software Engineering",
      subcategory: "DevOps",
      importance: "supporting",
      description:
        "A lightweight, standalone executable package that includes everything needed to run an application.",
    },
    {
      name: "deployment",
      aliases: [
        "deploy",
        "deploying",
        "production deployment",
        "deployment process",
      ],
      category: "Software Engineering",
      subcategory: "DevOps",
      importance: "core",
      description:
        "The process of making software available for use, typically by transferring it to a production environment.",
    },

    // ============================================
    // MODERN LANGUAGE FEATURES
    // ============================================
    {
      name: "decorator",
      aliases: [
        "decorators",
        "annotation",
        "annotations",
        "decorator pattern",
        "@decorator",
      ],
      category: "Programming Fundamentals",
      subcategory: "Language Features",
      importance: "supporting",
      description:
        "A design pattern and language feature that allows adding behavior to objects or functions dynamically.",
    },
    {
      name: "generator",
      aliases: [
        "generators",
        "generator function",
        "yield",
        "generator iterator",
      ],
      category: "Programming Fundamentals",
      subcategory: "Language Features",
      importance: "supporting",
      description:
        "A function that can pause execution and yield multiple values over time, creating an iterator.",
    },
    {
      name: "interface",
      aliases: [
        "interfaces",
        "type interface",
        "interface definition",
        "interface implementation",
      ],
      category: "Object-Oriented Programming",
      subcategory: "Abstraction",
      importance: "core",
      description:
        "A contract that defines a set of methods and properties that a class must implement, without specifying how.",
    },

    // ============================================
    // CLOUD & DISTRIBUTED SYSTEMS
    // ============================================
    {
      name: "cloud computing",
      aliases: [
        "cloud",
        "cloud service",
        "cloud platform",
        "cloud infrastructure",
      ],
      category: "Distributed Systems",
      subcategory: "Core Concepts",
      importance: "supporting",
      description:
        "The delivery of computing services including servers, storage, databases, and software over the internet.",
    },
    {
      name: "microservices",
      aliases: [
        "microservice",
        "microservice architecture",
        "microservices pattern",
        "service-oriented architecture",
      ],
      category: "Distributed Systems",
      subcategory: "Architecture",
      importance: "supporting",
      description:
        "An architectural style that structures an application as a collection of loosely coupled, independently deployable services.",
    },
    {
      name: "scalability",
      aliases: [
        "scalable",
        "scaling",
        "horizontal scaling",
        "vertical scaling",
        "scale",
      ],
      category: "Distributed Systems",
      subcategory: "Performance",
      importance: "supporting",
      description:
        "The ability of a system to handle increased load by adding resources, either by scaling up or scaling out.",
    },

    // ============================================
    // CONCURRENCY & PARALLELISM
    // ============================================
    {
      name: "mutex",
      aliases: [
        "mutual exclusion",
        "lock",
        "locking",
        "mutex lock",
        "synchronization",
      ],
      category: "Operating Systems",
      subcategory: "Concurrency",
      importance: "supporting",
      description:
        "A synchronization mechanism that prevents multiple threads from accessing a shared resource simultaneously.",
    },
    {
      name: "semaphore",
      aliases: ["semaphores", "counting semaphore", "binary semaphore"],
      category: "Operating Systems",
      subcategory: "Concurrency",
      importance: "supporting",
      description:
        "A synchronization primitive that uses a counter to control access to shared resources by multiple processes or threads.",
    },

    // ============================================
    // ERROR HANDLING & DEBUGGING
    // ============================================
    {
      name: "exception handling",
      aliases: [
        "exception",
        "exceptions",
        "error handling",
        "try catch",
        "try-catch-finally",
        "throw exception",
      ],
      category: "Programming Fundamentals",
      subcategory: "Error Handling",
      importance: "core",
      description:
        "A mechanism for handling runtime errors and exceptional conditions in a controlled manner.",
    },
    // ============================================
    // DATA SCIENCE & MACHINE LEARNING (Basic)
    // ============================================
    {
      name: "machine learning",
      aliases: [
        "ML",
        "machine learning model",
        "ML algorithm",
        "supervised learning",
        "unsupervised learning",
      ],
      category: "Data Science",
      subcategory: "Core Concepts",
      importance: "supporting",
      description:
        "A branch of artificial intelligence focused on building systems that learn from data and improve their performance over time.",
    },
    {
      name: "neural network",
      aliases: [
        "neural networks",
        "artificial neural network",
        "ANN",
        "deep learning",
        "deep neural network",
      ],
      category: "Data Science",
      subcategory: "Machine Learning",
      importance: "supporting",
      description:
        "A computing system inspired by biological neural networks, consisting of interconnected nodes that process information.",
    },
    {
      name: "training data",
      aliases: [
        "training set",
        "dataset",
        "training dataset",
        "model training",
      ],
      category: "Data Science",
      subcategory: "Machine Learning",
      importance: "supporting",
      description:
        "A dataset used to train a machine learning model by providing examples from which the model learns patterns.",
    },
  ],
};
