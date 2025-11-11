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
      aliases: ["libraries", "module", "package", "import"],
      category: "Programming Fundamentals",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description:
        "A collection of pre-written code that provides reusable functionality for common tasks.",
    },

    // Data Structures
    {
      name: "array",
      aliases: ["arrays", "list", "lists"],
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
      aliases: ["sets", "hash set"],
      category: "Data Structures",
      subcategory: "Supporting Concepts",
      importance: "supporting",
      description: "A collection of unique elements with no duplicates.",
    },
    {
      name: "map",
      aliases: ["maps", "mapping"],
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
      aliases: ["debug", "debugger", "troubleshooting"],
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
      aliases: ["git", "source control", "revision control"],
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
      aliases: ["application programming interface", "REST API", "web API"],
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
      aliases: ["threads", "threading", "multithreading"],
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
  ],
};
