/**
 * Literature Concept Library
 *
 * Concepts related to literary analysis, narrative theory, and textual interpretation
 */

import { ConceptLibrary } from "./conceptLibraryTypes";

export const LITERATURE_CONCEPTS: ConceptLibrary = {
  domain: "Literature",
  version: "1.0.0",
  concepts: [
    // ========== NARRATIVE ELEMENTS ==========
    {
      name: "narrator",
      category: "Narrative Elements",
      importance: "core",
      description: "Voice telling the story",
    },
    {
      name: "focalization",
      category: "Narrative Elements",
      importance: "core",
      description: "Perspective through which events are perceived",
    },
    {
      name: "point of view",
      aliases: ["POV"],
      category: "Narrative Elements",
      importance: "core",
      description: "Vantage point from which story is told",
    },
    {
      name: "first-person narration",
      category: "Narrative Elements",
      subcategory: "Point of View",
      importance: "supporting",
    },
    {
      name: "third-person narration",
      category: "Narrative Elements",
      subcategory: "Point of View",
      importance: "supporting",
    },
    {
      name: "omniscient narrator",
      category: "Narrative Elements",
      subcategory: "Point of View",
      importance: "supporting",
    },
    {
      name: "unreliable narrator",
      category: "Narrative Elements",
      importance: "supporting",
    },

    // ========== PLOT & STRUCTURE ==========
    {
      name: "plot",
      category: "Plot and Structure",
      importance: "core",
      description: "Sequence of events in a narrative",
    },
    {
      name: "exposition",
      category: "Plot and Structure",
      subcategory: "Plot Elements",
      importance: "supporting",
    },
    {
      name: "rising action",
      category: "Plot and Structure",
      subcategory: "Plot Elements",
      importance: "supporting",
    },
    {
      name: "climax",
      category: "Plot and Structure",
      subcategory: "Plot Elements",
      importance: "supporting",
    },
    {
      name: "falling action",
      category: "Plot and Structure",
      subcategory: "Plot Elements",
      importance: "supporting",
    },
    {
      name: "resolution",
      aliases: ["denouement"],
      category: "Plot and Structure",
      subcategory: "Plot Elements",
      importance: "supporting",
    },
    {
      name: "conflict",
      category: "Plot and Structure",
      importance: "core",
    },
    {
      name: "foreshadowing",
      category: "Plot and Structure",
      importance: "supporting",
    },
    {
      name: "flashback",
      category: "Plot and Structure",
      importance: "supporting",
    },

    // ========== CHARACTERS ==========
    {
      name: "character",
      category: "Characters",
      importance: "core",
      description: "Individual in a narrative",
    },
    {
      name: "protagonist",
      category: "Characters",
      importance: "core",
      description: "Main character driving the story",
    },
    {
      name: "antagonist",
      category: "Characters",
      importance: "core",
      description: "Character or force opposing the protagonist",
    },
    {
      name: "characterization",
      category: "Characters",
      importance: "supporting",
      description: "Methods of revealing character traits",
    },
    {
      name: "round character",
      category: "Characters",
      subcategory: "Character Types",
      importance: "supporting",
    },
    {
      name: "flat character",
      category: "Characters",
      subcategory: "Character Types",
      importance: "supporting",
    },
    {
      name: "dynamic character",
      category: "Characters",
      subcategory: "Character Development",
      importance: "supporting",
    },
    {
      name: "static character",
      category: "Characters",
      subcategory: "Character Development",
      importance: "supporting",
    },
    {
      name: "foil",
      category: "Characters",
      importance: "supporting",
      description: "Character contrasting with another",
    },

    // ========== THEMES & MOTIFS ==========
    {
      name: "theme",
      category: "Themes and Motifs",
      importance: "core",
      description: "Central idea or message in a work",
    },
    {
      name: "motif",
      category: "Themes and Motifs",
      importance: "core",
      description: "Recurring element with symbolic significance",
    },
    {
      name: "symbol",
      category: "Themes and Motifs",
      importance: "core",
      description: "Object representing abstract ideas",
    },
    {
      name: "allegory",
      category: "Themes and Motifs",
      importance: "supporting",
      description: "Narrative with symbolic meaning",
    },
    {
      name: "metaphor",
      category: "Figurative Language",
      importance: "core",
      description: "Comparison without using like or as",
    },
    {
      name: "simile",
      category: "Figurative Language",
      importance: "supporting",
      description: "Comparison using like or as",
    },

    // ========== SETTING ==========
    {
      name: "setting",
      category: "Setting",
      importance: "core",
      description: "Time and place of narrative events",
    },
    {
      name: "atmosphere",
      aliases: ["mood"],
      category: "Setting",
      importance: "supporting",
      description: "Emotional quality of a scene",
    },

    // ========== GENRE ==========
    {
      name: "genre",
      category: "Genre",
      importance: "core",
      description: "Category of literary composition",
    },
    {
      name: "tragedy",
      category: "Genre",
      subcategory: "Drama",
      importance: "supporting",
    },
    {
      name: "comedy",
      category: "Genre",
      subcategory: "Drama",
      importance: "supporting",
    },
    {
      name: "satire",
      category: "Genre",
      importance: "supporting",
    },
    {
      name: "irony",
      category: "Literary Devices",
      importance: "core",
      description: "Contrast between expectation and reality",
    },
    {
      name: "dramatic irony",
      category: "Literary Devices",
      subcategory: "Irony",
      importance: "supporting",
    },
    {
      name: "verbal irony",
      category: "Literary Devices",
      subcategory: "Irony",
      importance: "supporting",
    },
    {
      name: "situational irony",
      category: "Literary Devices",
      subcategory: "Irony",
      importance: "supporting",
    },

    // ========== STYLE & TONE ==========
    {
      name: "tone",
      category: "Style and Tone",
      importance: "core",
      description: "Author's attitude toward subject",
    },
    {
      name: "diction",
      category: "Style and Tone",
      importance: "supporting",
      description: "Word choice",
    },
    {
      name: "syntax",
      category: "Style and Tone",
      importance: "supporting",
      description: "Sentence structure",
    },
    {
      name: "imagery",
      category: "Style and Tone",
      importance: "core",
      description: "Descriptive language appealing to senses",
    },
    {
      name: "allusion",
      category: "Literary Devices",
      importance: "supporting",
      description: "Reference to another work or historical event",
    },
  ],
};
