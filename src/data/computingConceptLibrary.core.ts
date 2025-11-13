/**
 * Computing Core Concept Library - SIMPLIFIED VERSION
 *
 * Contains ONLY the 15 most fundamental programming concepts.
 * All concepts are marked as "core" importance.
 * Designed for maximum reliability and minimal false positives.
 */

import { ConceptLibrary, ConceptDefinition } from "./conceptLibraryTypes";

export const COMPUTING_CORE_CONCEPTS: ConceptLibrary = {
  domain: "computing",
  version: "2.0.0-core",
  concepts: [
    // ========================================================================
    // CORE PROGRAMMING CONCEPTS (15 total)
    // ========================================================================

    {
      name: "variable",
      aliases: ["variables"],
      category: "Programming Fundamentals",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A named storage location that holds a value which can change during program execution.",
    },
    {
      name: "function",
      aliases: ["functions", "method", "methods"],
      category: "Programming Fundamentals",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A reusable block of code that performs a specific task and can accept inputs and return outputs.",
    },
    {
      name: "loop",
      aliases: ["loops", "iteration", "for loop", "while loop"],
      category: "Programming Fundamentals",
      subcategory: "Control Flow",
      importance: "core",
      description:
        "A control structure that repeats a block of code multiple times until a condition is met.",
    },
    {
      name: "conditional",
      aliases: ["conditionals", "if statement", "if-else"],
      category: "Programming Fundamentals",
      subcategory: "Control Flow",
      importance: "core",
      description:
        "A programming construct that executes different code blocks based on whether a condition is true or false.",
    },
    {
      name: "array",
      aliases: ["arrays", "list", "lists"],
      category: "Data Structures",
      subcategory: "Collections",
      importance: "core",
      description:
        "An ordered collection of elements that can be accessed by their index position.",
    },
    {
      name: "object",
      aliases: ["objects", "dictionary", "hash map"],
      category: "Data Structures",
      subcategory: "Collections",
      importance: "core",
      description:
        "A collection of key-value pairs that represents an entity with properties and behaviors.",
    },
    {
      name: "string",
      aliases: ["strings", "text", "character string"],
      category: "Data Types",
      subcategory: "Primitives",
      importance: "core",
      description:
        "A sequence of characters used to represent text in a program.",
    },
    {
      name: "number",
      aliases: ["numbers", "integer", "float", "numeric"],
      category: "Data Types",
      subcategory: "Primitives",
      importance: "core",
      description:
        "A numeric value used for mathematical operations and counting.",
    },
    {
      name: "boolean",
      aliases: ["booleans", "true", "false", "bool"],
      category: "Data Types",
      subcategory: "Primitives",
      importance: "core",
      description:
        "A data type with only two possible values: true or false, used for logical operations.",
    },
    {
      name: "class",
      aliases: ["classes", "object class"],
      category: "Object-Oriented Programming",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A blueprint or template for creating objects with specific properties and methods.",
    },
    {
      name: "event",
      aliases: ["events", "event handler", "event listener"],
      category: "Programming Patterns",
      subcategory: "Interactions",
      importance: "core",
      description:
        "An action or occurrence detected by a program, such as a user click or key press.",
    },
    {
      name: "parameter",
      aliases: ["parameters", "argument", "arguments"],
      category: "Programming Fundamentals",
      subcategory: "Functions",
      importance: "core",
      description:
        "A value passed to a function to customize its behavior or provide input data.",
    },
    {
      name: "return value",
      aliases: ["return", "returned value", "function return"],
      category: "Programming Fundamentals",
      subcategory: "Functions",
      importance: "core",
      description:
        "The value that a function sends back to the code that called it.",
    },
    {
      name: "property",
      aliases: ["properties", "attribute", "attributes"],
      category: "Object-Oriented Programming",
      subcategory: "Core Concepts",
      importance: "core",
      description:
        "A characteristic or data value belonging to an object or class.",
    },
    {
      name: "scope",
      aliases: ["variable scope", "lexical scope", "scoping"],
      category: "Programming Fundamentals",
      subcategory: "Variables",
      importance: "core",
      description:
        "The region of code where a variable can be accessed or referenced.",
    },
  ],
};
