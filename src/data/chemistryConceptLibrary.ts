/**
 * Chemistry Concept Library
 *
 * Comprehensive library of general chemistry concepts organized by topic.
 * Used to identify actual domain concepts vs common words.
 */

import { ConceptLibrary, ConceptDefinition } from "./conceptLibraryTypes";

export const CHEMISTRY_CONCEPTS: ConceptLibrary = {
  domain: "Chemistry",
  version: "1.0.0",
  concepts: [
    // ========== UNIT 1: MATTER AND MEASUREMENT ==========
    {
      name: "matter",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "core",
    },
    {
      name: "physical properties",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "supporting",
    },
    {
      name: "chemical properties",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "supporting",
    },
    {
      name: "intensive properties",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "detail",
    },
    {
      name: "extensive properties",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "detail",
    },
    {
      name: "states of matter",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "supporting",
    },
    {
      name: "solid",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "detail",
    },
    {
      name: "liquid",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "detail",
    },
    {
      name: "gas",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "detail",
    },
    {
      name: "plasma",
      category: "Matter and Measurement",
      subcategory: "Properties of Matter",
      importance: "detail",
    },
    {
      name: "melting",
      category: "Matter and Measurement",
      subcategory: "Changes of State",
      importance: "detail",
    },
    {
      name: "freezing",
      category: "Matter and Measurement",
      subcategory: "Changes of State",
      importance: "detail",
    },
    {
      name: "vaporization",
      category: "Matter and Measurement",
      subcategory: "Changes of State",
      importance: "detail",
    },
    {
      name: "condensation",
      category: "Matter and Measurement",
      subcategory: "Changes of State",
      importance: "detail",
    },
    {
      name: "sublimation",
      category: "Matter and Measurement",
      subcategory: "Changes of State",
      importance: "detail",
    },

    {
      name: "SI units",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },
    {
      name: "meter",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },
    {
      name: "kilogram",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },
    {
      name: "second",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },
    {
      name: "mole",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "core",
    },
    {
      name: "kelvin",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },
    {
      name: "ampere",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },
    {
      name: "candela",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },
    {
      name: "volume",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "supporting",
    },
    {
      name: "density",
      category: "Matter and Measurement",
      subcategory: "Density",
      importance: "supporting",
    },
    {
      name: "pressure",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "supporting",
    },
    {
      name: "temperature",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "supporting",
    },
    {
      name: "significant figures",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "supporting",
    },
    {
      name: "scientific notation",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "supporting",
    },
    {
      name: "dimensional analysis",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },
    {
      name: "accuracy",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },
    {
      name: "precision",
      category: "Matter and Measurement",
      subcategory: "Measurement",
      importance: "detail",
    },

    {
      name: "specific gravity",
      category: "Matter and Measurement",
      subcategory: "Density",
      importance: "detail",
    },
    {
      name: "celsius",
      category: "Matter and Measurement",
      subcategory: "Temperature",
      importance: "detail",
    },
    {
      name: "fahrenheit",
      category: "Matter and Measurement",
      subcategory: "Temperature",
      importance: "detail",
    },
    {
      name: "absolute zero",
      category: "Matter and Measurement",
      subcategory: "Temperature",
      importance: "detail",
    },
    {
      name: "kinetic energy",
      category: "Matter and Measurement",
      subcategory: "Temperature",
      importance: "detail",
    },

    // ========== UNIT 2: ATOMIC STRUCTURE ==========
    { name: "atom", category: "Atomic Structure", subcategory: "The Atom" },
    {
      name: "subatomic particles",
      category: "Atomic Structure",
      subcategory: "The Atom",
      importance: "detail",
    },
    {
      name: "protons",
      category: "Atomic Structure",
      subcategory: "Subatomic Particles",
      importance: "detail",
    },
    {
      name: "neutrons",
      category: "Atomic Structure",
      subcategory: "Subatomic Particles",
      importance: "detail",
    },
    {
      name: "electrons",
      category: "Atomic Structure",
      subcategory: "Subatomic Particles",
      importance: "detail",
    },
    { name: "nucleus", category: "Atomic Structure", subcategory: "The Atom" },
    {
      name: "atomic number",
      category: "Atomic Structure",
      subcategory: "The Atom",
      importance: "core",
    },
    {
      name: "mass number",
      category: "Atomic Structure",
      subcategory: "The Atom",
      importance: "core",
    },
    { name: "isotopes", category: "Atomic Structure", subcategory: "The Atom" },
    {
      name: "isotopic notation",
      category: "Atomic Structure",
      subcategory: "The Atom",
      importance: "detail",
    },

    {
      name: "electron configuration",
      category: "Atomic Structure",
      subcategory: "Electron Configuration",
      importance: "supporting",
    },
    {
      name: "orbitals",
      category: "Atomic Structure",
      subcategory: "Electron Configuration",
      importance: "detail",
    },
    {
      name: "energy levels",
      category: "Atomic Structure",
      subcategory: "Electron Configuration",
      importance: "detail",
    },
    {
      name: "subshells",
      category: "Atomic Structure",
      subcategory: "Electron Configuration",
      importance: "detail",
    },
    {
      name: "s orbital",
      category: "Atomic Structure",
      subcategory: "Orbitals",
      aliases: ["s subshell"],
      importance: "detail",
    },
    {
      name: "p orbital",
      category: "Atomic Structure",
      subcategory: "Orbitals",
      aliases: ["p subshell"],
      importance: "detail",
    },
    {
      name: "d orbital",
      category: "Atomic Structure",
      subcategory: "Orbitals",
      aliases: ["d subshell"],
      importance: "detail",
    },
    {
      name: "f orbital",
      category: "Atomic Structure",
      subcategory: "Orbitals",
      aliases: ["f subshell"],
      importance: "detail",
    },
    {
      name: "aufbau principle",
      category: "Atomic Structure",
      subcategory: "Electron Configuration",
      importance: "detail",
    },
    {
      name: "pauli exclusion principle",
      category: "Atomic Structure",
      subcategory: "Electron Configuration",
      importance: "detail",
    },
    {
      name: "hund's rule",
      category: "Atomic Structure",
      subcategory: "Electron Configuration",
      importance: "detail",
    },
    {
      name: "orbital diagrams",
      category: "Atomic Structure",
      subcategory: "Electron Configuration",
      importance: "detail",
    },

    {
      name: "periodic table",
      category: "Atomic Structure",
      subcategory: "Periodic Table",
      importance: "core",
    },
    {
      name: "period",
      category: "Atomic Structure",
      subcategory: "Periodic Table",
      importance: "detail",
    },
    {
      name: "group",
      category: "Atomic Structure",
      subcategory: "Periodic Table",
      importance: "detail",
    },
    {
      name: "metal",
      category: "Atomic Structure",
      subcategory: "Periodic Table",
      importance: "supporting",
    },
    {
      name: "nonmetal",
      category: "Atomic Structure",
      subcategory: "Periodic Table",
      importance: "supporting",
    },
    {
      name: "metalloid",
      category: "Atomic Structure",
      subcategory: "Periodic Table",
      importance: "supporting",
    },
    {
      name: "representative elements",
      category: "Atomic Structure",
      subcategory: "Periodic Table",
      importance: "detail",
    },
    {
      name: "transition metals",
      category: "Atomic Structure",
      subcategory: "Periodic Table",
      importance: "detail",
    },

    { name: "ions", category: "Atomic Structure", subcategory: "Ions" },
    { name: "cations", category: "Atomic Structure", subcategory: "Ions" },
    { name: "anions", category: "Atomic Structure", subcategory: "Ions" },
    {
      name: "ionic notation",
      category: "Atomic Structure",
      subcategory: "Ions",
      importance: "detail",
    },
    {
      name: "monatomic ions",
      category: "Atomic Structure",
      subcategory: "Ions",
      importance: "detail",
    },
    {
      name: "polyatomic ions",
      category: "Atomic Structure",
      subcategory: "Ions",
      importance: "detail",
    },
    {
      name: "isoelectronic species",
      category: "Atomic Structure",
      subcategory: "Ions",
      importance: "detail",
    },

    // ========== UNIT 3: BONDING ==========
    { name: "chemical bonding", category: "Bonding", subcategory: "General" },
    {
      name: "ionic bonding",
      category: "Bonding",
      subcategory: "Ionic Bonding",
      importance: "detail",
    },
    {
      name: "electron transfer",
      category: "Bonding",
      subcategory: "Ionic Bonding",
      importance: "detail",
    },
    {
      name: "octet rule",
      category: "Bonding",
      subcategory: "Bonding Principles",
      importance: "detail",
    },
    {
      name: "ionic compounds",
      category: "Bonding",
      subcategory: "Ionic Bonding",
      importance: "detail",
    },

    {
      name: "covalent bonding",
      category: "Bonding",
      subcategory: "Covalent Bonding",
      importance: "detail",
    },
    {
      name: "electron sharing",
      category: "Bonding",
      subcategory: "Covalent Bonding",
      importance: "detail",
    },
    {
      name: "nonpolar covalent bonds",
      category: "Bonding",
      subcategory: "Covalent Bonding",
      importance: "detail",
    },
    {
      name: "polar covalent bonds",
      category: "Bonding",
      subcategory: "Covalent Bonding",
      importance: "detail",
    },
    {
      name: "electronegativity",
      category: "Bonding",
      subcategory: "Bond Polarity",
      importance: "core",
    },
    {
      name: "bond polarity",
      category: "Bonding",
      subcategory: "Bond Polarity",
      importance: "detail",
    },
    {
      name: "lewis structures",
      category: "Bonding",
      subcategory: "Lewis Structures",
      aliases: ["electron dot structures", "lewis notation"],
      importance: "detail",
    },
    { name: "single bond", category: "Bonding", subcategory: "Bond Types" },
    { name: "double bond", category: "Bonding", subcategory: "Bond Types" },
    { name: "triple bond", category: "Bonding", subcategory: "Bond Types" },

    {
      name: "metallic bonding",
      category: "Bonding",
      subcategory: "Metallic Bonding",
      importance: "detail",
    },
    {
      name: "electron sea model",
      category: "Bonding",
      subcategory: "Metallic Bonding",
      importance: "detail",
    },

    {
      name: "coordinate covalent bonds",
      category: "Bonding",
      subcategory: "Advanced Bonding",
      aliases: ["dative bonds"],
      importance: "detail",
    },
    {
      name: "hydrogen bonding",
      category: "Bonding",
      subcategory: "Intermolecular Forces",
      importance: "detail",
    },
    {
      name: "intermolecular forces",
      category: "Bonding",
      subcategory: "Intermolecular Forces",
      importance: "core",
    },
    {
      name: "intramolecular forces",
      category: "Bonding",
      subcategory: "Bonding",
      importance: "detail",
    },

    // ========== UNIT 4: MOLECULAR GEOMETRY ==========
    {
      name: "vsepr theory",
      category: "Molecular Geometry",
      subcategory: "VSEPR",
      aliases: ["valence shell electron pair repulsion"],
      importance: "detail",
    },
    {
      name: "electron geometry",
      category: "Molecular Geometry",
      subcategory: "VSEPR",
      importance: "detail",
    },
    {
      name: "molecular geometry",
      category: "Molecular Geometry",
      subcategory: "VSEPR",
      importance: "supporting",
    },
    {
      name: "steric number",
      category: "Molecular Geometry",
      subcategory: "VSEPR",
      importance: "detail",
    },
    {
      name: "linear geometry",
      category: "Molecular Geometry",
      subcategory: "Shapes",
      importance: "detail",
    },
    {
      name: "trigonal planar",
      category: "Molecular Geometry",
      subcategory: "Shapes",
      importance: "detail",
    },
    {
      name: "tetrahedral",
      category: "Molecular Geometry",
      subcategory: "Shapes",
      importance: "detail",
    },
    {
      name: "trigonal bipyramidal",
      category: "Molecular Geometry",
      subcategory: "Shapes",
      importance: "detail",
    },
    {
      name: "octahedral",
      category: "Molecular Geometry",
      subcategory: "Shapes",
      importance: "detail",
    },

    {
      name: "hybridization",
      category: "Molecular Geometry",
      subcategory: "Hybridization",
      importance: "core",
    },
    {
      name: "sp hybridization",
      category: "Molecular Geometry",
      subcategory: "Hybridization",
      importance: "detail",
    },
    {
      name: "sp2 hybridization",
      category: "Molecular Geometry",
      subcategory: "Hybridization",
      importance: "detail",
    },
    {
      name: "sp3 hybridization",
      category: "Molecular Geometry",
      subcategory: "Hybridization",
      importance: "detail",
    },

    {
      name: "molecular polarity",
      category: "Molecular Geometry",
      subcategory: "Polarity",
      importance: "detail",
    },
    {
      name: "dipole moments",
      category: "Molecular Geometry",
      subcategory: "Polarity",
      importance: "detail",
    },
    {
      name: "polar molecules",
      category: "Molecular Geometry",
      subcategory: "Polarity",
      importance: "detail",
    },
    {
      name: "nonpolar molecules",
      category: "Molecular Geometry",
      subcategory: "Polarity",
      importance: "detail",
    },

    {
      name: "resonance structures",
      category: "Molecular Geometry",
      subcategory: "Resonance",
      importance: "detail",
    },
    {
      name: "resonance hybrid",
      category: "Molecular Geometry",
      subcategory: "Resonance",
      importance: "detail",
    },

    // ========== UNIT 5: NOMENCLATURE ==========
    {
      name: "chemical nomenclature",
      category: "Nomenclature",
      subcategory: "General",
      importance: "detail",
    },
    {
      name: "binary ionic compounds",
      category: "Nomenclature",
      subcategory: "Ionic Compounds",
      importance: "detail",
    },
    {
      name: "stock system",
      category: "Nomenclature",
      subcategory: "Ionic Compounds",
      importance: "detail",
    },
    {
      name: "binary covalent compounds",
      category: "Nomenclature",
      subcategory: "Covalent Compounds",
      importance: "detail",
    },
    {
      name: "functional groups",
      category: "Nomenclature",
      subcategory: "Organic",
      importance: "detail",
    },
    { name: "alkanes", category: "Nomenclature", subcategory: "Organic" },
    { name: "alkenes", category: "Nomenclature", subcategory: "Organic" },
    { name: "alkynes", category: "Nomenclature", subcategory: "Organic" },
    { name: "alcohols", category: "Nomenclature", subcategory: "Organic" },
    { name: "ethers", category: "Nomenclature", subcategory: "Organic" },
    { name: "aldehydes", category: "Nomenclature", subcategory: "Organic" },
    { name: "ketones", category: "Nomenclature", subcategory: "Organic" },
    {
      name: "carboxylic acids",
      category: "Nomenclature",
      subcategory: "Organic",
      importance: "detail",
    },
    { name: "esters", category: "Nomenclature", subcategory: "Organic" },

    // ========== UNIT 6: CHEMICAL REACTIONS ==========
    {
      name: "chemical equations",
      category: "Chemical Reactions",
      subcategory: "Equations",
      importance: "detail",
    },
    {
      name: "reactants",
      category: "Chemical Reactions",
      subcategory: "Equations",
      importance: "detail",
    },
    {
      name: "products",
      category: "Chemical Reactions",
      subcategory: "Equations",
      importance: "detail",
    },
    {
      name: "balanced equations",
      category: "Chemical Reactions",
      subcategory: "Equations",
      importance: "detail",
    },
    {
      name: "coefficients",
      category: "Chemical Reactions",
      subcategory: "Equations",
      importance: "detail",
    },
    {
      name: "subscripts",
      category: "Chemical Reactions",
      subcategory: "Equations",
      importance: "detail",
    },

    {
      name: "synthesis reactions",
      category: "Chemical Reactions",
      subcategory: "Reaction Types",
      aliases: ["combination reactions"],
      importance: "detail",
    },
    {
      name: "decomposition reactions",
      category: "Chemical Reactions",
      subcategory: "Reaction Types",
      importance: "detail",
    },
    {
      name: "single displacement",
      category: "Chemical Reactions",
      subcategory: "Reaction Types",
      aliases: ["single replacement"],
      importance: "detail",
    },
    {
      name: "double displacement",
      category: "Chemical Reactions",
      subcategory: "Reaction Types",
      aliases: ["double replacement"],
      importance: "detail",
    },
    {
      name: "combustion reactions",
      category: "Chemical Reactions",
      subcategory: "Reaction Types",
      importance: "detail",
    },
    {
      name: "redox reactions",
      category: "Chemical Reactions",
      subcategory: "Reaction Types",
      importance: "detail",
    },

    {
      name: "aqueous solutions",
      category: "Chemical Reactions",
      subcategory: "Solutions",
      importance: "detail",
    },
    {
      name: "solubility rules",
      category: "Chemical Reactions",
      subcategory: "Precipitation",
      importance: "detail",
    },
    {
      name: "spectator ions",
      category: "Chemical Reactions",
      subcategory: "Precipitation",
      importance: "detail",
    },
    {
      name: "net ionic equations",
      category: "Chemical Reactions",
      subcategory: "Precipitation",
      importance: "detail",
    },
    {
      name: "precipitate",
      category: "Chemical Reactions",
      subcategory: "Precipitation",
      importance: "detail",
    },

    {
      name: "acids",
      category: "Chemical Reactions",
      subcategory: "Acids and Bases",
      importance: "detail",
    },
    {
      name: "bases",
      category: "Chemical Reactions",
      subcategory: "Acids and Bases",
      importance: "detail",
    },
    {
      name: "strong acids",
      category: "Chemical Reactions",
      subcategory: "Acids and Bases",
      importance: "detail",
    },
    {
      name: "weak acids",
      category: "Chemical Reactions",
      subcategory: "Acids and Bases",
      importance: "detail",
    },
    {
      name: "strong bases",
      category: "Chemical Reactions",
      subcategory: "Acids and Bases",
      importance: "detail",
    },
    {
      name: "weak bases",
      category: "Chemical Reactions",
      subcategory: "Acids and Bases",
      importance: "detail",
    },
    {
      name: "neutralization reactions",
      category: "Chemical Reactions",
      subcategory: "Acids and Bases",
      importance: "detail",
    },
    {
      name: "salts",
      category: "Chemical Reactions",
      subcategory: "Acids and Bases",
      importance: "detail",
    },

    {
      name: "oxidation states",
      category: "Chemical Reactions",
      subcategory: "Redox",
      aliases: ["oxidation number"],
      importance: "detail",
    },
    { name: "oxidation", category: "Chemical Reactions", subcategory: "Redox" },
    { name: "reduction", category: "Chemical Reactions", subcategory: "Redox" },
    {
      name: "oxidizing agent",
      category: "Chemical Reactions",
      subcategory: "Redox",
      importance: "supporting",
    },
    {
      name: "reducing agent",
      category: "Chemical Reactions",
      subcategory: "Redox",
      importance: "supporting",
    },

    // ========== UNIT 7: STOICHIOMETRY ==========
    {
      name: "stoichiometry",
      category: "Stoichiometry",
      subcategory: "General",
      importance: "core",
    },
    {
      name: "avogadro's number",
      category: "Stoichiometry",
      subcategory: "Mole Concept",
      importance: "detail",
    },
    {
      name: "molar mass",
      category: "Stoichiometry",
      subcategory: "Mole Concept",
      importance: "detail",
    },
    {
      name: "mole calculations",
      category: "Stoichiometry",
      subcategory: "Mole Concept",
      importance: "detail",
    },
    {
      name: "limiting reactant",
      category: "Stoichiometry",
      subcategory: "Calculations",
      aliases: ["limiting reagent"],
      importance: "detail",
    },
    {
      name: "theoretical yield",
      category: "Stoichiometry",
      subcategory: "Calculations",
      importance: "detail",
    },
    {
      name: "percent yield",
      category: "Stoichiometry",
      subcategory: "Calculations",
      importance: "detail",
    },
    {
      name: "excess reactant",
      category: "Stoichiometry",
      subcategory: "Calculations",
      importance: "detail",
    },
    {
      name: "empirical formula",
      category: "Stoichiometry",
      subcategory: "Formulas",
      importance: "detail",
    },
    {
      name: "molecular formula",
      category: "Stoichiometry",
      subcategory: "Formulas",
      importance: "detail",
    },
    {
      name: "percent composition",
      category: "Stoichiometry",
      subcategory: "Formulas",
      importance: "detail",
    },

    // ========== UNIT 8: SOLUTIONS ==========
    { name: "solutions", category: "Solutions", subcategory: "General" },
    { name: "solute", category: "Solutions", subcategory: "Components" },
    { name: "solvent", category: "Solutions", subcategory: "Components" },
    { name: "solubility", category: "Solutions", subcategory: "Solubility" },
    { name: "saturated", category: "Solutions", subcategory: "Solubility" },
    { name: "unsaturated", category: "Solutions", subcategory: "Solubility" },
    {
      name: "supersaturated",
      category: "Solutions",
      subcategory: "Solubility",
      importance: "supporting",
    },

    { name: "molarity", category: "Solutions", subcategory: "Concentration" },
    { name: "molality", category: "Solutions", subcategory: "Concentration" },
    {
      name: "parts per million",
      category: "Solutions",
      subcategory: "Concentration",
      aliases: ["ppm"],
      importance: "detail",
    },
    { name: "dilution", category: "Solutions", subcategory: "Concentration" },

    {
      name: "colligative properties",
      category: "Solutions",
      subcategory: "Colligative Properties",
      importance: "supporting",
    },
    {
      name: "vapor pressure lowering",
      category: "Solutions",
      subcategory: "Colligative Properties",
      importance: "detail",
    },
    {
      name: "boiling point elevation",
      category: "Solutions",
      subcategory: "Colligative Properties",
      importance: "supporting",
    },
    {
      name: "freezing point depression",
      category: "Solutions",
      subcategory: "Colligative Properties",
      importance: "supporting",
    },
    {
      name: "osmotic pressure",
      category: "Solutions",
      subcategory: "Colligative Properties",
      importance: "supporting",
    },

    // ========== UNIT 9: ACIDS AND BASES ==========
    {
      name: "arrhenius definition",
      category: "Acids and Bases",
      subcategory: "Definitions",
      importance: "detail",
    },
    {
      name: "bronsted-lowry definition",
      category: "Acids and Bases",
      subcategory: "Definitions",
      importance: "detail",
    },
    {
      name: "amphoteric species",
      category: "Acids and Bases",
      subcategory: "Definitions",
      importance: "detail",
    },
    {
      name: "conjugate acid-base pairs",
      category: "Acids and Bases",
      subcategory: "Definitions",
      importance: "detail",
    },

    { name: "ph", category: "Acids and Bases", subcategory: "pH" },
    { name: "poh", category: "Acids and Bases", subcategory: "pH" },
    { name: "ph scale", category: "Acids and Bases", subcategory: "pH" },
    {
      name: "hydrogen ion concentration",
      category: "Acids and Bases",
      subcategory: "pH",
      importance: "detail",
    },
    { name: "hydroxide ion", category: "Acids and Bases", subcategory: "pH" },

    {
      name: "ionization constant",
      category: "Acids and Bases",
      subcategory: "Equilibrium",
      aliases: ["ka", "kb"],
      importance: "detail",
    },
    {
      name: "percent ionization",
      category: "Acids and Bases",
      subcategory: "Equilibrium",
      importance: "detail",
    },

    { name: "buffers", category: "Acids and Bases", subcategory: "Buffers" },
    {
      name: "buffer capacity",
      category: "Acids and Bases",
      subcategory: "Buffers",
      importance: "detail",
    },
    {
      name: "henderson-hasselbalch equation",
      category: "Acids and Bases",
      subcategory: "Buffers",
      importance: "detail",
    },

    // ========== UNIT 10: GAS LAWS ==========
    { name: "gas laws", category: "Gas Laws", subcategory: "General" },
    {
      name: "compressibility",
      category: "Gas Laws",
      subcategory: "Gas Properties",
      importance: "detail",
    },
    { name: "diffusion", category: "Gas Laws", subcategory: "Gas Properties" },
    { name: "effusion", category: "Gas Laws", subcategory: "Gas Properties" },
    {
      name: "gas pressure",
      category: "Gas Laws",
      subcategory: "Gas Properties",
      importance: "detail",
    },

    {
      name: "boyle's law",
      category: "Gas Laws",
      subcategory: "Individual Laws",
      importance: "detail",
    },
    {
      name: "charles's law",
      category: "Gas Laws",
      subcategory: "Individual Laws",
      importance: "detail",
    },
    {
      name: "gay-lussac's law",
      category: "Gas Laws",
      subcategory: "Individual Laws",
      importance: "detail",
    },
    {
      name: "combined gas law",
      category: "Gas Laws",
      subcategory: "Combined Laws",
      importance: "detail",
    },
    { name: "ideal gas law", category: "Gas Laws", subcategory: "Ideal Gas" },
    { name: "gas constant", category: "Gas Laws", subcategory: "Ideal Gas" },
    {
      name: "stp",
      category: "Gas Laws",
      subcategory: "Ideal Gas",
      aliases: ["standard temperature and pressure"],
      importance: "detail",
    },
    { name: "molar volume", category: "Gas Laws", subcategory: "Ideal Gas" },
    { name: "dalton's law", category: "Gas Laws", subcategory: "Gas Mixtures" },
    {
      name: "partial pressure",
      category: "Gas Laws",
      subcategory: "Gas Mixtures",
      importance: "detail",
    },
    {
      name: "mole fraction",
      category: "Gas Laws",
      subcategory: "Gas Mixtures",
      importance: "detail",
    },
    { name: "graham's law", category: "Gas Laws", subcategory: "Effusion" },

    // ========== UNIT 11: THERMOCHEMISTRY ==========
    {
      name: "thermochemistry",
      category: "Thermochemistry",
      subcategory: "General",
      importance: "detail",
    },
    { name: "heat", category: "Thermochemistry", subcategory: "Energy" },
    {
      name: "specific heat capacity",
      category: "Thermochemistry",
      subcategory: "Energy",
      importance: "detail",
    },
    { name: "calorimetry", category: "Thermochemistry", subcategory: "Energy" },

    { name: "enthalpy", category: "Thermochemistry", subcategory: "Enthalpy" },
    {
      name: "exothermic reactions",
      category: "Thermochemistry",
      subcategory: "Enthalpy",
      importance: "detail",
    },
    {
      name: "endothermic reactions",
      category: "Thermochemistry",
      subcategory: "Enthalpy",
      importance: "detail",
    },
    {
      name: "standard enthalpy of formation",
      category: "Thermochemistry",
      subcategory: "Enthalpy",
      importance: "detail",
    },
    {
      name: "hess's law",
      category: "Thermochemistry",
      subcategory: "Enthalpy",
      importance: "detail",
    },

    { name: "entropy", category: "Thermochemistry", subcategory: "Entropy" },
    { name: "disorder", category: "Thermochemistry", subcategory: "Entropy" },

    {
      name: "gibbs free energy",
      category: "Thermochemistry",
      subcategory: "Free Energy",
      importance: "detail",
    },
    {
      name: "spontaneous reactions",
      category: "Thermochemistry",
      subcategory: "Free Energy",
      importance: "detail",
    },
    {
      name: "nonspontaneous reactions",
      category: "Thermochemistry",
      subcategory: "Free Energy",
      importance: "detail",
    },

    // ========== UNIT 12: KINETICS ==========
    { name: "chemical kinetics", category: "Kinetics", subcategory: "General" },
    { name: "reaction rate", category: "Kinetics", subcategory: "Rate" },
    { name: "rate laws", category: "Kinetics", subcategory: "Rate Laws" },
    { name: "rate constant", category: "Kinetics", subcategory: "Rate Laws" },
    {
      name: "order of reaction",
      category: "Kinetics",
      subcategory: "Rate Laws",
      importance: "supporting",
    },
    {
      name: "zeroth order",
      category: "Kinetics",
      subcategory: "Reaction Orders",
      importance: "detail",
    },
    {
      name: "first order",
      category: "Kinetics",
      subcategory: "Reaction Orders",
      importance: "detail",
    },
    {
      name: "second order",
      category: "Kinetics",
      subcategory: "Reaction Orders",
      importance: "detail",
    },
    {
      name: "integrated rate laws",
      category: "Kinetics",
      subcategory: "Rate Laws",
      importance: "detail",
    },

    { name: "collision theory", category: "Kinetics", subcategory: "Theory" },
    { name: "activation energy", category: "Kinetics", subcategory: "Energy" },

    { name: "catalysts", category: "Kinetics", subcategory: "Catalysis" },
    {
      name: "enzyme catalysis",
      category: "Kinetics",
      subcategory: "Catalysis",
      importance: "detail",
    },

    // ========== UNIT 13: EQUILIBRIUM ==========
    {
      name: "chemical equilibrium",
      category: "Equilibrium",
      subcategory: "General",
      importance: "detail",
    },
    {
      name: "dynamic equilibrium",
      category: "Equilibrium",
      subcategory: "General",
      importance: "detail",
    },
    {
      name: "reversible reactions",
      category: "Equilibrium",
      subcategory: "General",
      importance: "detail",
    },
    {
      name: "equilibrium constant",
      category: "Equilibrium",
      subcategory: "Constants",
      importance: "supporting",
    },
    {
      name: "reaction quotient",
      category: "Equilibrium",
      subcategory: "Constants",
      importance: "supporting",
    },
    {
      name: "ice tables",
      category: "Equilibrium",
      subcategory: "Calculations",
      importance: "detail",
    },
    {
      name: "le chatelier's principle",
      category: "Equilibrium",
      subcategory: "Principles",
      importance: "detail",
    },

    // ========== UNIT 16: SOLUBILITY ==========
    {
      name: "solubility product constant",
      category: "Solubility Equilibria",
      subcategory: "Ksp",
      aliases: ["ksp"],
      importance: "detail",
    },
    {
      name: "common ion effect",
      category: "Solubility Equilibria",
      subcategory: "Effects",
      importance: "detail",
    },
    {
      name: "complex ions",
      category: "Solubility Equilibria",
      subcategory: "Complex Ions",
      importance: "detail",
    },

    // ========== UNIT 17: COORDINATION CHEMISTRY ==========
    {
      name: "coordination compounds",
      category: "Coordination Chemistry",
      subcategory: "General",
      importance: "detail",
    },
    {
      name: "coordination number",
      category: "Coordination Chemistry",
      subcategory: "Structure",
      importance: "detail",
    },
    {
      name: "ligands",
      category: "Coordination Chemistry",
      subcategory: "Ligands",
      importance: "detail",
    },
    {
      name: "monodentate",
      category: "Coordination Chemistry",
      subcategory: "Ligands",
      importance: "detail",
    },
    {
      name: "polydentate",
      category: "Coordination Chemistry",
      subcategory: "Ligands",
      importance: "detail",
    },
    {
      name: "chelation",
      category: "Coordination Chemistry",
      subcategory: "Ligands",
      importance: "detail",
    },
    {
      name: "crystal field theory",
      category: "Coordination Chemistry",
      subcategory: "Theory",
      importance: "detail",
    },

    // ========== UNIT 18: PERIODIC PROPERTIES ==========
    {
      name: "periodic trends",
      category: "Periodic Properties",
      subcategory: "Trends",
      importance: "supporting",
    },
    {
      name: "atomic radius",
      category: "Periodic Properties",
      subcategory: "Trends",
      importance: "supporting",
    },
    {
      name: "ionic radius",
      category: "Periodic Properties",
      subcategory: "Trends",
      importance: "detail",
    },
    {
      name: "ionization energy",
      category: "Periodic Properties",
      subcategory: "Trends",
      importance: "core",
    },
    {
      name: "electron affinity",
      category: "Periodic Properties",
      subcategory: "Trends",
      importance: "supporting",
    },
    {
      name: "metallic character",
      category: "Periodic Properties",
      subcategory: "Trends",
      importance: "detail",
    },
    {
      name: "alkali metals",
      category: "Periodic Properties",
      subcategory: "Groups",
      importance: "detail",
    },
    {
      name: "alkaline earth metals",
      category: "Periodic Properties",
      subcategory: "Groups",
      importance: "detail",
    },
    {
      name: "halogens",
      category: "Periodic Properties",
      subcategory: "Groups",
      importance: "detail",
    },
    {
      name: "noble gases",
      category: "Periodic Properties",
      subcategory: "Groups",
      importance: "detail",
    },

    // ========== UNIT 19: NUCLEAR CHEMISTRY ==========
    {
      name: "nuclear chemistry",
      category: "Nuclear Chemistry",
      subcategory: "General",
      importance: "detail",
    },
    {
      name: "radioactivity",
      category: "Nuclear Chemistry",
      subcategory: "Radioactivity",
      importance: "detail",
    },
    {
      name: "alpha decay",
      category: "Nuclear Chemistry",
      subcategory: "Decay Types",
      importance: "detail",
    },
    {
      name: "beta decay",
      category: "Nuclear Chemistry",
      subcategory: "Decay Types",
      importance: "detail",
    },
    {
      name: "gamma emission",
      category: "Nuclear Chemistry",
      subcategory: "Decay Types",
      importance: "detail",
    },
    {
      name: "half-life",
      category: "Nuclear Chemistry",
      subcategory: "Kinetics",
      importance: "supporting",
    },
    {
      name: "nuclear fission",
      category: "Nuclear Chemistry",
      subcategory: "Reactions",
      importance: "detail",
    },
    {
      name: "nuclear fusion",
      category: "Nuclear Chemistry",
      subcategory: "Reactions",
      importance: "detail",
    },

    // ========== UNIT 23: ELECTROCHEMISTRY ==========
    {
      name: "electrochemistry",
      category: "Electrochemistry",
      subcategory: "General",
      importance: "detail",
    },
    {
      name: "electrochemical cells",
      category: "Electrochemistry",
      subcategory: "Cells",
      importance: "detail",
    },
    {
      name: "galvanic cells",
      category: "Electrochemistry",
      subcategory: "Cells",
      aliases: ["voltaic cells"],
      importance: "detail",
    },
    {
      name: "electrolytic cells",
      category: "Electrochemistry",
      subcategory: "Cells",
      importance: "detail",
    },
    { name: "anode", category: "Electrochemistry", subcategory: "Electrodes" },
    {
      name: "cathode",
      category: "Electrochemistry",
      subcategory: "Electrodes",
      importance: "detail",
    },
    {
      name: "cell potential",
      category: "Electrochemistry",
      subcategory: "Potential",
      importance: "detail",
    },
    {
      name: "nernst equation",
      category: "Electrochemistry",
      subcategory: "Equations",
      importance: "detail",
    },
    {
      name: "electrolysis",
      category: "Electrochemistry",
      subcategory: "Electrolysis",
      importance: "detail",
    },
    {
      name: "faraday's laws",
      category: "Electrochemistry",
      subcategory: "Electrolysis",
      importance: "detail",
    },
    {
      name: "corrosion",
      category: "Electrochemistry",
      subcategory: "Applications",
      importance: "detail",
    },

    // ========== UNIT 24: ORGANIC CHEMISTRY ==========
    {
      name: "organic chemistry",
      category: "Organic Chemistry",
      subcategory: "General",
      importance: "detail",
    },
    {
      name: "iupac naming",
      category: "Organic Chemistry",
      subcategory: "Nomenclature",
      importance: "detail",
    },
    {
      name: "structural isomers",
      category: "Organic Chemistry",
      subcategory: "Isomers",
      importance: "detail",
    },
    {
      name: "stereoisomers",
      category: "Organic Chemistry",
      subcategory: "Isomers",
      importance: "detail",
    },
    {
      name: "enantiomers",
      category: "Organic Chemistry",
      subcategory: "Stereochemistry",
      importance: "detail",
    },
    {
      name: "chirality",
      category: "Organic Chemistry",
      subcategory: "Stereochemistry",
      importance: "detail",
    },
    {
      name: "optical activity",
      category: "Organic Chemistry",
      subcategory: "Stereochemistry",
      importance: "detail",
    },

    // ========== UNIT 25: QUANTUM CHEMISTRY ==========
    {
      name: "quantum chemistry",
      category: "Quantum Chemistry",
      subcategory: "General",
      importance: "detail",
    },
    {
      name: "wave function",
      category: "Quantum Chemistry",
      subcategory: "Theory",
      importance: "detail",
    },
    {
      name: "schrodinger equation",
      category: "Quantum Chemistry",
      subcategory: "Theory",
      importance: "detail",
    },
    {
      name: "quantum numbers",
      category: "Quantum Chemistry",
      subcategory: "Theory",
      importance: "supporting",
    },
    {
      name: "molecular orbital theory",
      category: "Quantum Chemistry",
      subcategory: "MO Theory",
      importance: "detail",
    },
    {
      name: "bonding orbitals",
      category: "Quantum Chemistry",
      subcategory: "MO Theory",
      importance: "detail",
    },
    {
      name: "antibonding orbitals",
      category: "Quantum Chemistry",
      subcategory: "MO Theory",
      importance: "detail",
    },
    {
      name: "bond order",
      category: "Quantum Chemistry",
      subcategory: "MO Theory",
      importance: "detail",
    },
    {
      name: "valence bond theory",
      category: "Quantum Chemistry",
      subcategory: "VB Theory",
      importance: "detail",
    },
    {
      name: "sigma bonds",
      category: "Quantum Chemistry",
      subcategory: "Bond Types",
      importance: "detail",
    },
    {
      name: "pi bonds",
      category: "Quantum Chemistry",
      subcategory: "Bond Types",
      importance: "detail",
    },
    {
      name: "spectroscopy",
      category: "Quantum Chemistry",
      subcategory: "Spectroscopy",
      importance: "detail",
    },

    // ========== ELEMENTS ==========
    // Elements covered in general chemistry - fundamental building blocks
    // Organized alphabetically for easy lookup
    {
      name: "aluminum",
      category: "Elements",
      subcategory: "Metals",
      importance: "core",
    },
    {
      name: "argon",
      category: "Elements",
      subcategory: "Noble Gases",
      importance: "core",
    },
    {
      name: "arsenic",
      category: "Elements",
      subcategory: "Metalloids",
      importance: "core",
    },
    {
      name: "barium",
      category: "Elements",
      subcategory: "Alkaline Earth",
      importance: "core",
    },
    {
      name: "beryllium",
      category: "Elements",
      subcategory: "Alkaline Earth",
      importance: "core",
    },
    {
      name: "boron",
      category: "Elements",
      subcategory: "Metalloids",
      importance: "core",
    },
    {
      name: "bromine",
      category: "Elements",
      subcategory: "Halogens",
      importance: "core",
    },
    {
      name: "cadmium",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "calcium",
      category: "Elements",
      subcategory: "Alkaline Earth",
      importance: "core",
    },
    {
      name: "carbon",
      category: "Elements",
      subcategory: "Nonmetals",
      importance: "core",
    },
    {
      name: "chlorine",
      category: "Elements",
      subcategory: "Halogens",
      importance: "core",
    },
    {
      name: "chromium",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "cobalt",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "copper",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "fluorine",
      category: "Elements",
      subcategory: "Halogens",
      importance: "core",
    },
    {
      name: "germanium",
      category: "Elements",
      subcategory: "Metalloids",
      importance: "core",
    },
    {
      name: "gold",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "helium",
      category: "Elements",
      subcategory: "Noble Gases",
      importance: "core",
    },
    {
      name: "hydrogen",
      category: "Elements",
      subcategory: "Nonmetals",
      importance: "core",
    },
    {
      name: "iodine",
      category: "Elements",
      subcategory: "Halogens",
      importance: "core",
    },
    {
      name: "iron",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "krypton",
      category: "Elements",
      subcategory: "Noble Gases",
      importance: "core",
    },
    {
      name: "lead",
      category: "Elements",
      subcategory: "Metals",
      importance: "core",
    },
    {
      name: "lithium",
      category: "Elements",
      subcategory: "Alkali Metals",
      importance: "core",
    },
    {
      name: "magnesium",
      category: "Elements",
      subcategory: "Alkaline Earth",
      importance: "core",
    },
    {
      name: "manganese",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "mercury",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "neon",
      category: "Elements",
      subcategory: "Noble Gases",
      importance: "core",
    },
    {
      name: "nickel",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "nitrogen",
      category: "Elements",
      subcategory: "Nonmetals",
      importance: "core",
    },
    {
      name: "oxygen",
      category: "Elements",
      subcategory: "Nonmetals",
      importance: "core",
    },
    {
      name: "phosphorus",
      category: "Elements",
      subcategory: "Nonmetals",
      importance: "core",
    },
    {
      name: "platinum",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "potassium",
      category: "Elements",
      subcategory: "Alkali Metals",
      importance: "core",
    },
    {
      name: "radon",
      category: "Elements",
      subcategory: "Noble Gases",
      importance: "core",
    },
    {
      name: "rubidium",
      category: "Elements",
      subcategory: "Alkali Metals",
      importance: "core",
    },
    {
      name: "selenium",
      category: "Elements",
      subcategory: "Nonmetals",
      importance: "core",
    },
    {
      name: "silicon",
      category: "Elements",
      subcategory: "Metalloids",
      importance: "core",
    },
    {
      name: "silver",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "sodium",
      category: "Elements",
      subcategory: "Alkali Metals",
      importance: "core",
    },
    {
      name: "strontium",
      category: "Elements",
      subcategory: "Alkaline Earth",
      importance: "core",
    },
    {
      name: "sulfur",
      category: "Elements",
      subcategory: "Nonmetals",
      importance: "core",
    },
    {
      name: "tin",
      category: "Elements",
      subcategory: "Metals",
      importance: "core",
    },
    {
      name: "titanium",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },
    {
      name: "uranium",
      category: "Elements",
      subcategory: "Actinides",
      importance: "core",
    },
    {
      name: "xenon",
      category: "Elements",
      subcategory: "Noble Gases",
      importance: "core",
    },
    {
      name: "zinc",
      category: "Elements",
      subcategory: "Transition Metals",
      importance: "core",
    },

    // ========== COMMON COMPOUNDS ==========

    // Common compounds
    { name: "water", category: "Compounds", subcategory: "Common" },
    {
      name: "sodium chloride",
      category: "Compounds",
      subcategory: "Ionic",
      aliases: ["table salt", "salt"],
      importance: "detail",
    },
    { name: "carbon dioxide", category: "Compounds", subcategory: "Covalent" },
    { name: "ammonia", category: "Compounds", subcategory: "Covalent" },
    { name: "methane", category: "Compounds", subcategory: "Organic" },
    { name: "ethanol", category: "Compounds", subcategory: "Organic" },
    { name: "glucose", category: "Compounds", subcategory: "Organic" },
    { name: "sulfuric acid", category: "Compounds", subcategory: "Acids" },
    { name: "hydrochloric acid", category: "Compounds", subcategory: "Acids" },
    { name: "nitric acid", category: "Compounds", subcategory: "Acids" },
    { name: "sodium hydroxide", category: "Compounds", subcategory: "Bases" },

    // Special terms
    {
      name: "valence electrons",
      category: "Bonding",
      subcategory: "Electron Configuration",
      importance: "core",
    },
    {
      name: "core electrons",
      category: "Atomic Structure",
      subcategory: "Electron Configuration",
      importance: "detail",
    },
    { name: "bond energy", category: "Bonding", subcategory: "Energetics" },
    {
      name: "lattice energy",
      category: "Bonding",
      subcategory: "Ionic Bonding",
      importance: "detail",
    },
    { name: "dipole", category: "Bonding", subcategory: "Polarity" },
    { name: "polar solvents", category: "Solutions", subcategory: "Solvents" },
    {
      name: "nonpolar solvents",
      category: "Solutions",
      subcategory: "Solvents",
      importance: "detail",
    },
    { name: "electrolyte", category: "Solutions", subcategory: "Types" },
    {
      name: "titration",
      category: "Acids and Bases",
      subcategory: "Techniques",
      importance: "supporting",
    },
    {
      name: "indicator",
      category: "Acids and Bases",
      subcategory: "Techniques",
      importance: "supporting",
    },
    {
      name: "equivalence point",
      category: "Acids and Bases",
      subcategory: "Titrations",
      importance: "detail",
    },
  ],
};

/**
 * Create a lookup map for fast concept matching
 */
export function createConceptLookup(): Map<string, ConceptDefinition> {
  const lookup = new Map<string, ConceptDefinition>();

  for (const concept of CHEMISTRY_CONCEPTS.concepts) {
    // Add main name
    lookup.set(concept.name.toLowerCase(), concept);

    // Add aliases
    if (concept.aliases) {
      for (const alias of concept.aliases) {
        lookup.set(alias.toLowerCase(), concept);
      }
    }
  }

  return lookup;
}

/**
 * Check if a term is a known chemistry concept
 */
export function isChemistryConcept(term: string): boolean {
  const lookup = createConceptLookup();
  return lookup.has(term.toLowerCase());
}

/**
 * Get concept definition by name or alias
 */
export function getConceptDefinition(
  term: string
): ConceptDefinition | undefined {
  const lookup = createConceptLookup();
  return lookup.get(term.toLowerCase());
}

/**
 * Get all concepts in a category
 */
export function getConceptsByCategory(category: string): ConceptDefinition[] {
  return CHEMISTRY_CONCEPTS.concepts.filter((c) => c.category === category);
}

/**
 * Get all concepts in a subcategory
 */
export function getConceptsBySubcategory(
  subcategory: string
): ConceptDefinition[] {
  return CHEMISTRY_CONCEPTS.concepts.filter(
    (c) => c.subcategory === subcategory
  );
}
