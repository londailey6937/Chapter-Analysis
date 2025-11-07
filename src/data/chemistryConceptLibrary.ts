/**
 * Chemistry Concept Library
 *
 * Comprehensive library of general chemistry concepts organized by topic.
 * Used to identify actual domain concepts vs common words.
 */

export interface ConceptDefinition {
  name: string;
  aliases?: string[]; // Alternative names/spellings
  category: string;
  subcategory?: string;
  relatedConcepts?: string[];
}

export const CHEMISTRY_CONCEPTS: ConceptDefinition[] = [
  // ========== UNIT 1: MATTER AND MEASUREMENT ==========
  {
    name: "matter",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "physical properties",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "chemical properties",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "intensive properties",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "extensive properties",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "states of matter",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "solid",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "liquid",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "gas",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "plasma",
    category: "Matter and Measurement",
    subcategory: "Properties of Matter",
  },
  {
    name: "melting",
    category: "Matter and Measurement",
    subcategory: "Changes of State",
  },
  {
    name: "freezing",
    category: "Matter and Measurement",
    subcategory: "Changes of State",
  },
  {
    name: "vaporization",
    category: "Matter and Measurement",
    subcategory: "Changes of State",
  },
  {
    name: "condensation",
    category: "Matter and Measurement",
    subcategory: "Changes of State",
  },
  {
    name: "sublimation",
    category: "Matter and Measurement",
    subcategory: "Changes of State",
  },

  {
    name: "SI units",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "meter",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "kilogram",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "second",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "mole",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "kelvin",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "ampere",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "candela",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "volume",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "density",
    category: "Matter and Measurement",
    subcategory: "Density",
  },
  {
    name: "pressure",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "temperature",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "significant figures",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "scientific notation",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "dimensional analysis",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "accuracy",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },
  {
    name: "precision",
    category: "Matter and Measurement",
    subcategory: "Measurement",
  },

  {
    name: "specific gravity",
    category: "Matter and Measurement",
    subcategory: "Density",
  },
  {
    name: "celsius",
    category: "Matter and Measurement",
    subcategory: "Temperature",
  },
  {
    name: "fahrenheit",
    category: "Matter and Measurement",
    subcategory: "Temperature",
  },
  {
    name: "absolute zero",
    category: "Matter and Measurement",
    subcategory: "Temperature",
  },
  {
    name: "kinetic energy",
    category: "Matter and Measurement",
    subcategory: "Temperature",
  },

  // ========== UNIT 2: ATOMIC STRUCTURE ==========
  { name: "atom", category: "Atomic Structure", subcategory: "The Atom" },
  {
    name: "subatomic particles",
    category: "Atomic Structure",
    subcategory: "The Atom",
  },
  {
    name: "protons",
    category: "Atomic Structure",
    subcategory: "Subatomic Particles",
  },
  {
    name: "neutrons",
    category: "Atomic Structure",
    subcategory: "Subatomic Particles",
  },
  {
    name: "electrons",
    category: "Atomic Structure",
    subcategory: "Subatomic Particles",
  },
  { name: "nucleus", category: "Atomic Structure", subcategory: "The Atom" },
  {
    name: "atomic number",
    category: "Atomic Structure",
    subcategory: "The Atom",
  },
  {
    name: "mass number",
    category: "Atomic Structure",
    subcategory: "The Atom",
  },
  { name: "isotopes", category: "Atomic Structure", subcategory: "The Atom" },
  {
    name: "isotopic notation",
    category: "Atomic Structure",
    subcategory: "The Atom",
  },

  {
    name: "electron configuration",
    category: "Atomic Structure",
    subcategory: "Electron Configuration",
  },
  {
    name: "orbitals",
    category: "Atomic Structure",
    subcategory: "Electron Configuration",
  },
  {
    name: "energy levels",
    category: "Atomic Structure",
    subcategory: "Electron Configuration",
  },
  {
    name: "subshells",
    category: "Atomic Structure",
    subcategory: "Electron Configuration",
  },
  {
    name: "s orbital",
    category: "Atomic Structure",
    subcategory: "Orbitals",
    aliases: ["s subshell"],
  },
  {
    name: "p orbital",
    category: "Atomic Structure",
    subcategory: "Orbitals",
    aliases: ["p subshell"],
  },
  {
    name: "d orbital",
    category: "Atomic Structure",
    subcategory: "Orbitals",
    aliases: ["d subshell"],
  },
  {
    name: "f orbital",
    category: "Atomic Structure",
    subcategory: "Orbitals",
    aliases: ["f subshell"],
  },
  {
    name: "aufbau principle",
    category: "Atomic Structure",
    subcategory: "Electron Configuration",
  },
  {
    name: "pauli exclusion principle",
    category: "Atomic Structure",
    subcategory: "Electron Configuration",
  },
  {
    name: "hund's rule",
    category: "Atomic Structure",
    subcategory: "Electron Configuration",
  },
  {
    name: "orbital diagrams",
    category: "Atomic Structure",
    subcategory: "Electron Configuration",
  },

  {
    name: "periodic table",
    category: "Atomic Structure",
    subcategory: "Periodic Table",
  },
  {
    name: "period",
    category: "Atomic Structure",
    subcategory: "Periodic Table",
  },
  {
    name: "group",
    category: "Atomic Structure",
    subcategory: "Periodic Table",
  },
  {
    name: "metal",
    category: "Atomic Structure",
    subcategory: "Periodic Table",
  },
  {
    name: "nonmetal",
    category: "Atomic Structure",
    subcategory: "Periodic Table",
  },
  {
    name: "metalloid",
    category: "Atomic Structure",
    subcategory: "Periodic Table",
  },
  {
    name: "representative elements",
    category: "Atomic Structure",
    subcategory: "Periodic Table",
  },
  {
    name: "transition metals",
    category: "Atomic Structure",
    subcategory: "Periodic Table",
  },

  { name: "ions", category: "Atomic Structure", subcategory: "Ions" },
  { name: "cations", category: "Atomic Structure", subcategory: "Ions" },
  { name: "anions", category: "Atomic Structure", subcategory: "Ions" },
  { name: "ionic notation", category: "Atomic Structure", subcategory: "Ions" },
  { name: "monatomic ions", category: "Atomic Structure", subcategory: "Ions" },
  {
    name: "polyatomic ions",
    category: "Atomic Structure",
    subcategory: "Ions",
  },
  {
    name: "isoelectronic species",
    category: "Atomic Structure",
    subcategory: "Ions",
  },

  // ========== UNIT 3: BONDING ==========
  { name: "chemical bonding", category: "Bonding", subcategory: "General" },
  { name: "ionic bonding", category: "Bonding", subcategory: "Ionic Bonding" },
  {
    name: "electron transfer",
    category: "Bonding",
    subcategory: "Ionic Bonding",
  },
  {
    name: "octet rule",
    category: "Bonding",
    subcategory: "Bonding Principles",
  },
  {
    name: "ionic compounds",
    category: "Bonding",
    subcategory: "Ionic Bonding",
  },

  {
    name: "covalent bonding",
    category: "Bonding",
    subcategory: "Covalent Bonding",
  },
  {
    name: "electron sharing",
    category: "Bonding",
    subcategory: "Covalent Bonding",
  },
  {
    name: "nonpolar covalent bonds",
    category: "Bonding",
    subcategory: "Covalent Bonding",
  },
  {
    name: "polar covalent bonds",
    category: "Bonding",
    subcategory: "Covalent Bonding",
  },
  {
    name: "electronegativity",
    category: "Bonding",
    subcategory: "Bond Polarity",
  },
  { name: "bond polarity", category: "Bonding", subcategory: "Bond Polarity" },
  {
    name: "lewis structures",
    category: "Bonding",
    subcategory: "Lewis Structures",
    aliases: ["electron dot structures", "lewis notation"],
  },
  { name: "single bond", category: "Bonding", subcategory: "Bond Types" },
  { name: "double bond", category: "Bonding", subcategory: "Bond Types" },
  { name: "triple bond", category: "Bonding", subcategory: "Bond Types" },

  {
    name: "metallic bonding",
    category: "Bonding",
    subcategory: "Metallic Bonding",
  },
  {
    name: "electron sea model",
    category: "Bonding",
    subcategory: "Metallic Bonding",
  },

  {
    name: "coordinate covalent bonds",
    category: "Bonding",
    subcategory: "Advanced Bonding",
    aliases: ["dative bonds"],
  },
  {
    name: "hydrogen bonding",
    category: "Bonding",
    subcategory: "Intermolecular Forces",
  },
  {
    name: "intermolecular forces",
    category: "Bonding",
    subcategory: "Intermolecular Forces",
  },
  {
    name: "intramolecular forces",
    category: "Bonding",
    subcategory: "Bonding",
  },

  // ========== UNIT 4: MOLECULAR GEOMETRY ==========
  {
    name: "vsepr theory",
    category: "Molecular Geometry",
    subcategory: "VSEPR",
    aliases: ["valence shell electron pair repulsion"],
  },
  {
    name: "electron geometry",
    category: "Molecular Geometry",
    subcategory: "VSEPR",
  },
  {
    name: "molecular geometry",
    category: "Molecular Geometry",
    subcategory: "VSEPR",
  },
  {
    name: "steric number",
    category: "Molecular Geometry",
    subcategory: "VSEPR",
  },
  {
    name: "linear geometry",
    category: "Molecular Geometry",
    subcategory: "Shapes",
  },
  {
    name: "trigonal planar",
    category: "Molecular Geometry",
    subcategory: "Shapes",
  },
  {
    name: "tetrahedral",
    category: "Molecular Geometry",
    subcategory: "Shapes",
  },
  {
    name: "trigonal bipyramidal",
    category: "Molecular Geometry",
    subcategory: "Shapes",
  },
  { name: "octahedral", category: "Molecular Geometry", subcategory: "Shapes" },

  {
    name: "hybridization",
    category: "Molecular Geometry",
    subcategory: "Hybridization",
  },
  {
    name: "sp hybridization",
    category: "Molecular Geometry",
    subcategory: "Hybridization",
  },
  {
    name: "sp2 hybridization",
    category: "Molecular Geometry",
    subcategory: "Hybridization",
  },
  {
    name: "sp3 hybridization",
    category: "Molecular Geometry",
    subcategory: "Hybridization",
  },

  {
    name: "molecular polarity",
    category: "Molecular Geometry",
    subcategory: "Polarity",
  },
  {
    name: "dipole moments",
    category: "Molecular Geometry",
    subcategory: "Polarity",
  },
  {
    name: "polar molecules",
    category: "Molecular Geometry",
    subcategory: "Polarity",
  },
  {
    name: "nonpolar molecules",
    category: "Molecular Geometry",
    subcategory: "Polarity",
  },

  {
    name: "resonance structures",
    category: "Molecular Geometry",
    subcategory: "Resonance",
  },
  {
    name: "resonance hybrid",
    category: "Molecular Geometry",
    subcategory: "Resonance",
  },

  // ========== UNIT 5: NOMENCLATURE ==========
  {
    name: "chemical nomenclature",
    category: "Nomenclature",
    subcategory: "General",
  },
  {
    name: "binary ionic compounds",
    category: "Nomenclature",
    subcategory: "Ionic Compounds",
  },
  {
    name: "stock system",
    category: "Nomenclature",
    subcategory: "Ionic Compounds",
  },
  {
    name: "binary covalent compounds",
    category: "Nomenclature",
    subcategory: "Covalent Compounds",
  },
  {
    name: "functional groups",
    category: "Nomenclature",
    subcategory: "Organic",
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
  },
  { name: "esters", category: "Nomenclature", subcategory: "Organic" },

  // ========== UNIT 6: CHEMICAL REACTIONS ==========
  {
    name: "chemical equations",
    category: "Chemical Reactions",
    subcategory: "Equations",
  },
  {
    name: "reactants",
    category: "Chemical Reactions",
    subcategory: "Equations",
  },
  {
    name: "products",
    category: "Chemical Reactions",
    subcategory: "Equations",
  },
  {
    name: "balanced equations",
    category: "Chemical Reactions",
    subcategory: "Equations",
  },
  {
    name: "coefficients",
    category: "Chemical Reactions",
    subcategory: "Equations",
  },
  {
    name: "subscripts",
    category: "Chemical Reactions",
    subcategory: "Equations",
  },

  {
    name: "synthesis reactions",
    category: "Chemical Reactions",
    subcategory: "Reaction Types",
    aliases: ["combination reactions"],
  },
  {
    name: "decomposition reactions",
    category: "Chemical Reactions",
    subcategory: "Reaction Types",
  },
  {
    name: "single displacement",
    category: "Chemical Reactions",
    subcategory: "Reaction Types",
    aliases: ["single replacement"],
  },
  {
    name: "double displacement",
    category: "Chemical Reactions",
    subcategory: "Reaction Types",
    aliases: ["double replacement"],
  },
  {
    name: "combustion reactions",
    category: "Chemical Reactions",
    subcategory: "Reaction Types",
  },
  {
    name: "redox reactions",
    category: "Chemical Reactions",
    subcategory: "Reaction Types",
  },

  {
    name: "aqueous solutions",
    category: "Chemical Reactions",
    subcategory: "Solutions",
  },
  {
    name: "solubility rules",
    category: "Chemical Reactions",
    subcategory: "Precipitation",
  },
  {
    name: "spectator ions",
    category: "Chemical Reactions",
    subcategory: "Precipitation",
  },
  {
    name: "net ionic equations",
    category: "Chemical Reactions",
    subcategory: "Precipitation",
  },
  {
    name: "precipitate",
    category: "Chemical Reactions",
    subcategory: "Precipitation",
  },

  {
    name: "acids",
    category: "Chemical Reactions",
    subcategory: "Acids and Bases",
  },
  {
    name: "bases",
    category: "Chemical Reactions",
    subcategory: "Acids and Bases",
  },
  {
    name: "strong acids",
    category: "Chemical Reactions",
    subcategory: "Acids and Bases",
  },
  {
    name: "weak acids",
    category: "Chemical Reactions",
    subcategory: "Acids and Bases",
  },
  {
    name: "strong bases",
    category: "Chemical Reactions",
    subcategory: "Acids and Bases",
  },
  {
    name: "weak bases",
    category: "Chemical Reactions",
    subcategory: "Acids and Bases",
  },
  {
    name: "neutralization reactions",
    category: "Chemical Reactions",
    subcategory: "Acids and Bases",
  },
  {
    name: "salts",
    category: "Chemical Reactions",
    subcategory: "Acids and Bases",
  },

  {
    name: "oxidation states",
    category: "Chemical Reactions",
    subcategory: "Redox",
    aliases: ["oxidation number"],
  },
  { name: "oxidation", category: "Chemical Reactions", subcategory: "Redox" },
  { name: "reduction", category: "Chemical Reactions", subcategory: "Redox" },
  {
    name: "oxidizing agent",
    category: "Chemical Reactions",
    subcategory: "Redox",
  },
  {
    name: "reducing agent",
    category: "Chemical Reactions",
    subcategory: "Redox",
  },

  // ========== UNIT 7: STOICHIOMETRY ==========
  { name: "stoichiometry", category: "Stoichiometry", subcategory: "General" },
  {
    name: "avogadro's number",
    category: "Stoichiometry",
    subcategory: "Mole Concept",
  },
  {
    name: "molar mass",
    category: "Stoichiometry",
    subcategory: "Mole Concept",
  },
  {
    name: "mole calculations",
    category: "Stoichiometry",
    subcategory: "Mole Concept",
  },
  {
    name: "limiting reactant",
    category: "Stoichiometry",
    subcategory: "Calculations",
    aliases: ["limiting reagent"],
  },
  {
    name: "theoretical yield",
    category: "Stoichiometry",
    subcategory: "Calculations",
  },
  {
    name: "percent yield",
    category: "Stoichiometry",
    subcategory: "Calculations",
  },
  {
    name: "excess reactant",
    category: "Stoichiometry",
    subcategory: "Calculations",
  },
  {
    name: "empirical formula",
    category: "Stoichiometry",
    subcategory: "Formulas",
  },
  {
    name: "molecular formula",
    category: "Stoichiometry",
    subcategory: "Formulas",
  },
  {
    name: "percent composition",
    category: "Stoichiometry",
    subcategory: "Formulas",
  },

  // ========== UNIT 8: SOLUTIONS ==========
  { name: "solutions", category: "Solutions", subcategory: "General" },
  { name: "solute", category: "Solutions", subcategory: "Components" },
  { name: "solvent", category: "Solutions", subcategory: "Components" },
  { name: "solubility", category: "Solutions", subcategory: "Solubility" },
  { name: "saturated", category: "Solutions", subcategory: "Solubility" },
  { name: "unsaturated", category: "Solutions", subcategory: "Solubility" },
  { name: "supersaturated", category: "Solutions", subcategory: "Solubility" },

  { name: "molarity", category: "Solutions", subcategory: "Concentration" },
  { name: "molality", category: "Solutions", subcategory: "Concentration" },
  {
    name: "parts per million",
    category: "Solutions",
    subcategory: "Concentration",
    aliases: ["ppm"],
  },
  { name: "dilution", category: "Solutions", subcategory: "Concentration" },

  {
    name: "colligative properties",
    category: "Solutions",
    subcategory: "Colligative Properties",
  },
  {
    name: "vapor pressure lowering",
    category: "Solutions",
    subcategory: "Colligative Properties",
  },
  {
    name: "boiling point elevation",
    category: "Solutions",
    subcategory: "Colligative Properties",
  },
  {
    name: "freezing point depression",
    category: "Solutions",
    subcategory: "Colligative Properties",
  },
  {
    name: "osmotic pressure",
    category: "Solutions",
    subcategory: "Colligative Properties",
  },

  // ========== UNIT 9: ACIDS AND BASES ==========
  {
    name: "arrhenius definition",
    category: "Acids and Bases",
    subcategory: "Definitions",
  },
  {
    name: "bronsted-lowry definition",
    category: "Acids and Bases",
    subcategory: "Definitions",
  },
  {
    name: "amphoteric species",
    category: "Acids and Bases",
    subcategory: "Definitions",
  },
  {
    name: "conjugate acid-base pairs",
    category: "Acids and Bases",
    subcategory: "Definitions",
  },

  { name: "ph", category: "Acids and Bases", subcategory: "pH" },
  { name: "poh", category: "Acids and Bases", subcategory: "pH" },
  { name: "ph scale", category: "Acids and Bases", subcategory: "pH" },
  {
    name: "hydrogen ion concentration",
    category: "Acids and Bases",
    subcategory: "pH",
  },
  { name: "hydroxide ion", category: "Acids and Bases", subcategory: "pH" },

  {
    name: "ionization constant",
    category: "Acids and Bases",
    subcategory: "Equilibrium",
    aliases: ["ka", "kb"],
  },
  {
    name: "percent ionization",
    category: "Acids and Bases",
    subcategory: "Equilibrium",
  },

  { name: "buffers", category: "Acids and Bases", subcategory: "Buffers" },
  {
    name: "buffer capacity",
    category: "Acids and Bases",
    subcategory: "Buffers",
  },
  {
    name: "henderson-hasselbalch equation",
    category: "Acids and Bases",
    subcategory: "Buffers",
  },

  // ========== UNIT 10: GAS LAWS ==========
  { name: "gas laws", category: "Gas Laws", subcategory: "General" },
  {
    name: "compressibility",
    category: "Gas Laws",
    subcategory: "Gas Properties",
  },
  { name: "diffusion", category: "Gas Laws", subcategory: "Gas Properties" },
  { name: "effusion", category: "Gas Laws", subcategory: "Gas Properties" },
  { name: "gas pressure", category: "Gas Laws", subcategory: "Gas Properties" },

  { name: "boyle's law", category: "Gas Laws", subcategory: "Individual Laws" },
  {
    name: "charles's law",
    category: "Gas Laws",
    subcategory: "Individual Laws",
  },
  {
    name: "gay-lussac's law",
    category: "Gas Laws",
    subcategory: "Individual Laws",
  },
  {
    name: "combined gas law",
    category: "Gas Laws",
    subcategory: "Combined Laws",
  },
  { name: "ideal gas law", category: "Gas Laws", subcategory: "Ideal Gas" },
  { name: "gas constant", category: "Gas Laws", subcategory: "Ideal Gas" },
  {
    name: "stp",
    category: "Gas Laws",
    subcategory: "Ideal Gas",
    aliases: ["standard temperature and pressure"],
  },
  { name: "molar volume", category: "Gas Laws", subcategory: "Ideal Gas" },
  { name: "dalton's law", category: "Gas Laws", subcategory: "Gas Mixtures" },
  {
    name: "partial pressure",
    category: "Gas Laws",
    subcategory: "Gas Mixtures",
  },
  { name: "mole fraction", category: "Gas Laws", subcategory: "Gas Mixtures" },
  { name: "graham's law", category: "Gas Laws", subcategory: "Effusion" },

  // ========== UNIT 11: THERMOCHEMISTRY ==========
  {
    name: "thermochemistry",
    category: "Thermochemistry",
    subcategory: "General",
  },
  { name: "heat", category: "Thermochemistry", subcategory: "Energy" },
  {
    name: "specific heat capacity",
    category: "Thermochemistry",
    subcategory: "Energy",
  },
  { name: "calorimetry", category: "Thermochemistry", subcategory: "Energy" },

  { name: "enthalpy", category: "Thermochemistry", subcategory: "Enthalpy" },
  {
    name: "exothermic reactions",
    category: "Thermochemistry",
    subcategory: "Enthalpy",
  },
  {
    name: "endothermic reactions",
    category: "Thermochemistry",
    subcategory: "Enthalpy",
  },
  {
    name: "standard enthalpy of formation",
    category: "Thermochemistry",
    subcategory: "Enthalpy",
  },
  { name: "hess's law", category: "Thermochemistry", subcategory: "Enthalpy" },

  { name: "entropy", category: "Thermochemistry", subcategory: "Entropy" },
  { name: "disorder", category: "Thermochemistry", subcategory: "Entropy" },

  {
    name: "gibbs free energy",
    category: "Thermochemistry",
    subcategory: "Free Energy",
  },
  {
    name: "spontaneous reactions",
    category: "Thermochemistry",
    subcategory: "Free Energy",
  },
  {
    name: "nonspontaneous reactions",
    category: "Thermochemistry",
    subcategory: "Free Energy",
  },

  // ========== UNIT 12: KINETICS ==========
  { name: "chemical kinetics", category: "Kinetics", subcategory: "General" },
  { name: "reaction rate", category: "Kinetics", subcategory: "Rate" },
  { name: "rate laws", category: "Kinetics", subcategory: "Rate Laws" },
  { name: "rate constant", category: "Kinetics", subcategory: "Rate Laws" },
  { name: "order of reaction", category: "Kinetics", subcategory: "Rate Laws" },
  {
    name: "zeroth order",
    category: "Kinetics",
    subcategory: "Reaction Orders",
  },
  { name: "first order", category: "Kinetics", subcategory: "Reaction Orders" },
  {
    name: "second order",
    category: "Kinetics",
    subcategory: "Reaction Orders",
  },
  {
    name: "integrated rate laws",
    category: "Kinetics",
    subcategory: "Rate Laws",
  },

  { name: "collision theory", category: "Kinetics", subcategory: "Theory" },
  { name: "activation energy", category: "Kinetics", subcategory: "Energy" },

  { name: "catalysts", category: "Kinetics", subcategory: "Catalysis" },
  { name: "enzyme catalysis", category: "Kinetics", subcategory: "Catalysis" },

  // ========== UNIT 13: EQUILIBRIUM ==========
  {
    name: "chemical equilibrium",
    category: "Equilibrium",
    subcategory: "General",
  },
  {
    name: "dynamic equilibrium",
    category: "Equilibrium",
    subcategory: "General",
  },
  {
    name: "reversible reactions",
    category: "Equilibrium",
    subcategory: "General",
  },
  {
    name: "equilibrium constant",
    category: "Equilibrium",
    subcategory: "Constants",
  },
  {
    name: "reaction quotient",
    category: "Equilibrium",
    subcategory: "Constants",
  },
  { name: "ice tables", category: "Equilibrium", subcategory: "Calculations" },
  {
    name: "le chatelier's principle",
    category: "Equilibrium",
    subcategory: "Principles",
  },

  // ========== UNIT 16: SOLUBILITY ==========
  {
    name: "solubility product constant",
    category: "Solubility Equilibria",
    subcategory: "Ksp",
    aliases: ["ksp"],
  },
  {
    name: "common ion effect",
    category: "Solubility Equilibria",
    subcategory: "Effects",
  },
  {
    name: "complex ions",
    category: "Solubility Equilibria",
    subcategory: "Complex Ions",
  },

  // ========== UNIT 17: COORDINATION CHEMISTRY ==========
  {
    name: "coordination compounds",
    category: "Coordination Chemistry",
    subcategory: "General",
  },
  {
    name: "coordination number",
    category: "Coordination Chemistry",
    subcategory: "Structure",
  },
  {
    name: "ligands",
    category: "Coordination Chemistry",
    subcategory: "Ligands",
  },
  {
    name: "monodentate",
    category: "Coordination Chemistry",
    subcategory: "Ligands",
  },
  {
    name: "polydentate",
    category: "Coordination Chemistry",
    subcategory: "Ligands",
  },
  {
    name: "chelation",
    category: "Coordination Chemistry",
    subcategory: "Ligands",
  },
  {
    name: "crystal field theory",
    category: "Coordination Chemistry",
    subcategory: "Theory",
  },

  // ========== UNIT 18: PERIODIC PROPERTIES ==========
  {
    name: "periodic trends",
    category: "Periodic Properties",
    subcategory: "Trends",
  },
  {
    name: "atomic radius",
    category: "Periodic Properties",
    subcategory: "Trends",
  },
  {
    name: "ionic radius",
    category: "Periodic Properties",
    subcategory: "Trends",
  },
  {
    name: "ionization energy",
    category: "Periodic Properties",
    subcategory: "Trends",
  },
  {
    name: "electron affinity",
    category: "Periodic Properties",
    subcategory: "Trends",
  },
  {
    name: "metallic character",
    category: "Periodic Properties",
    subcategory: "Trends",
  },
  {
    name: "alkali metals",
    category: "Periodic Properties",
    subcategory: "Groups",
  },
  {
    name: "alkaline earth metals",
    category: "Periodic Properties",
    subcategory: "Groups",
  },
  { name: "halogens", category: "Periodic Properties", subcategory: "Groups" },
  {
    name: "noble gases",
    category: "Periodic Properties",
    subcategory: "Groups",
  },

  // ========== UNIT 19: NUCLEAR CHEMISTRY ==========
  {
    name: "nuclear chemistry",
    category: "Nuclear Chemistry",
    subcategory: "General",
  },
  {
    name: "radioactivity",
    category: "Nuclear Chemistry",
    subcategory: "Radioactivity",
  },
  {
    name: "alpha decay",
    category: "Nuclear Chemistry",
    subcategory: "Decay Types",
  },
  {
    name: "beta decay",
    category: "Nuclear Chemistry",
    subcategory: "Decay Types",
  },
  {
    name: "gamma emission",
    category: "Nuclear Chemistry",
    subcategory: "Decay Types",
  },
  { name: "half-life", category: "Nuclear Chemistry", subcategory: "Kinetics" },
  {
    name: "nuclear fission",
    category: "Nuclear Chemistry",
    subcategory: "Reactions",
  },
  {
    name: "nuclear fusion",
    category: "Nuclear Chemistry",
    subcategory: "Reactions",
  },

  // ========== UNIT 23: ELECTROCHEMISTRY ==========
  {
    name: "electrochemistry",
    category: "Electrochemistry",
    subcategory: "General",
  },
  {
    name: "electrochemical cells",
    category: "Electrochemistry",
    subcategory: "Cells",
  },
  {
    name: "galvanic cells",
    category: "Electrochemistry",
    subcategory: "Cells",
    aliases: ["voltaic cells"],
  },
  {
    name: "electrolytic cells",
    category: "Electrochemistry",
    subcategory: "Cells",
  },
  { name: "anode", category: "Electrochemistry", subcategory: "Electrodes" },
  { name: "cathode", category: "Electrochemistry", subcategory: "Electrodes" },
  {
    name: "cell potential",
    category: "Electrochemistry",
    subcategory: "Potential",
  },
  {
    name: "nernst equation",
    category: "Electrochemistry",
    subcategory: "Equations",
  },
  {
    name: "electrolysis",
    category: "Electrochemistry",
    subcategory: "Electrolysis",
  },
  {
    name: "faraday's laws",
    category: "Electrochemistry",
    subcategory: "Electrolysis",
  },
  {
    name: "corrosion",
    category: "Electrochemistry",
    subcategory: "Applications",
  },

  // ========== UNIT 24: ORGANIC CHEMISTRY ==========
  {
    name: "organic chemistry",
    category: "Organic Chemistry",
    subcategory: "General",
  },
  {
    name: "iupac naming",
    category: "Organic Chemistry",
    subcategory: "Nomenclature",
  },
  {
    name: "structural isomers",
    category: "Organic Chemistry",
    subcategory: "Isomers",
  },
  {
    name: "stereoisomers",
    category: "Organic Chemistry",
    subcategory: "Isomers",
  },
  {
    name: "enantiomers",
    category: "Organic Chemistry",
    subcategory: "Stereochemistry",
  },
  {
    name: "chirality",
    category: "Organic Chemistry",
    subcategory: "Stereochemistry",
  },
  {
    name: "optical activity",
    category: "Organic Chemistry",
    subcategory: "Stereochemistry",
  },

  // ========== UNIT 25: QUANTUM CHEMISTRY ==========
  {
    name: "quantum chemistry",
    category: "Quantum Chemistry",
    subcategory: "General",
  },
  {
    name: "wave function",
    category: "Quantum Chemistry",
    subcategory: "Theory",
  },
  {
    name: "schrodinger equation",
    category: "Quantum Chemistry",
    subcategory: "Theory",
  },
  {
    name: "quantum numbers",
    category: "Quantum Chemistry",
    subcategory: "Theory",
  },
  {
    name: "molecular orbital theory",
    category: "Quantum Chemistry",
    subcategory: "MO Theory",
  },
  {
    name: "bonding orbitals",
    category: "Quantum Chemistry",
    subcategory: "MO Theory",
  },
  {
    name: "antibonding orbitals",
    category: "Quantum Chemistry",
    subcategory: "MO Theory",
  },
  {
    name: "bond order",
    category: "Quantum Chemistry",
    subcategory: "MO Theory",
  },
  {
    name: "valence bond theory",
    category: "Quantum Chemistry",
    subcategory: "VB Theory",
  },
  {
    name: "sigma bonds",
    category: "Quantum Chemistry",
    subcategory: "Bond Types",
  },
  {
    name: "pi bonds",
    category: "Quantum Chemistry",
    subcategory: "Bond Types",
  },
  {
    name: "spectroscopy",
    category: "Quantum Chemistry",
    subcategory: "Spectroscopy",
  },

  // ========== ELEMENTS AND COMMON COMPOUNDS ==========
  { name: "hydrogen", category: "Elements", subcategory: "Nonmetals" },
  { name: "oxygen", category: "Elements", subcategory: "Nonmetals" },
  { name: "nitrogen", category: "Elements", subcategory: "Nonmetals" },
  { name: "carbon", category: "Elements", subcategory: "Nonmetals" },
  { name: "fluorine", category: "Elements", subcategory: "Halogens" },
  { name: "chlorine", category: "Elements", subcategory: "Halogens" },
  { name: "bromine", category: "Elements", subcategory: "Halogens" },
  { name: "iodine", category: "Elements", subcategory: "Halogens" },
  { name: "sodium", category: "Elements", subcategory: "Alkali Metals" },
  { name: "potassium", category: "Elements", subcategory: "Alkali Metals" },
  { name: "lithium", category: "Elements", subcategory: "Alkali Metals" },
  { name: "magnesium", category: "Elements", subcategory: "Alkaline Earth" },
  { name: "calcium", category: "Elements", subcategory: "Alkaline Earth" },
  { name: "aluminum", category: "Elements", subcategory: "Metals" },
  { name: "silicon", category: "Elements", subcategory: "Metalloids" },
  { name: "phosphorus", category: "Elements", subcategory: "Nonmetals" },
  { name: "sulfur", category: "Elements", subcategory: "Nonmetals" },
  { name: "iron", category: "Elements", subcategory: "Transition Metals" },
  { name: "copper", category: "Elements", subcategory: "Transition Metals" },
  { name: "silver", category: "Elements", subcategory: "Transition Metals" },
  { name: "gold", category: "Elements", subcategory: "Transition Metals" },
  { name: "mercury", category: "Elements", subcategory: "Transition Metals" },
  { name: "helium", category: "Elements", subcategory: "Noble Gases" },
  { name: "neon", category: "Elements", subcategory: "Noble Gases" },
  { name: "argon", category: "Elements", subcategory: "Noble Gases" },

  // Common compounds
  { name: "water", category: "Compounds", subcategory: "Common" },
  {
    name: "sodium chloride",
    category: "Compounds",
    subcategory: "Ionic",
    aliases: ["table salt", "salt"],
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
  },
  {
    name: "core electrons",
    category: "Atomic Structure",
    subcategory: "Electron Configuration",
  },
  { name: "bond energy", category: "Bonding", subcategory: "Energetics" },
  { name: "lattice energy", category: "Bonding", subcategory: "Ionic Bonding" },
  { name: "dipole", category: "Bonding", subcategory: "Polarity" },
  { name: "polar solvents", category: "Solutions", subcategory: "Solvents" },
  { name: "nonpolar solvents", category: "Solutions", subcategory: "Solvents" },
  { name: "electrolyte", category: "Solutions", subcategory: "Types" },
  { name: "titration", category: "Acids and Bases", subcategory: "Techniques" },
  { name: "indicator", category: "Acids and Bases", subcategory: "Techniques" },
  {
    name: "equivalence point",
    category: "Acids and Bases",
    subcategory: "Titrations",
  },
];

/**
 * Create a lookup map for fast concept matching
 */
export function createConceptLookup(): Map<string, ConceptDefinition> {
  const lookup = new Map<string, ConceptDefinition>();

  for (const concept of CHEMISTRY_CONCEPTS) {
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
  return CHEMISTRY_CONCEPTS.filter((c) => c.category === category);
}

/**
 * Get all concepts in a subcategory
 */
export function getConceptsBySubcategory(
  subcategory: string
): ConceptDefinition[] {
  return CHEMISTRY_CONCEPTS.filter((c) => c.subcategory === subcategory);
}
