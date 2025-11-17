/**
 * Concept Library Registry
 *
 * Central access point for all domain-specific and cross-domain concept libraries
 */

import {
  Domain,
  ConceptLibrary,
  ConceptDefinition,
  AVAILABLE_DOMAINS,
} from "./conceptLibraryTypes";
import { CHEMISTRY_CONCEPTS } from "./chemistryConceptLibrary";
import { CROSS_DOMAIN_CONCEPTS } from "./crossDomainConcepts";
import { ALGEBRA_TRIG_CONCEPTS } from "./algebraTrigConceptLibrary";
import { financeConceptLibrary } from "./financeConceptLibrary";
import { COMPUTING_CONCEPTS } from "./computingConceptLibrary";
import { REACT_CONCEPTS } from "./reactConceptLibrary";
import { JAVASCRIPT_CONCEPTS } from "./javascriptConceptLibrary";

// Re-export types for convenience
export type {
  Domain,
  ConceptLibrary,
  ConceptDefinition,
} from "./conceptLibraryTypes";

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
};

const ensureConceptIds = (
  library: ConceptLibrary,
  domainKey: Domain
): ConceptLibrary => {
  const domainPrefix = slugify(domainKey);
  const usedIds = new Set<string>();

  const withId = (concept: ConceptDefinition, index: number) => {
    const rawExisting = concept.id?.trim();
    if (rawExisting && !usedIds.has(rawExisting)) {
      usedIds.add(rawExisting);
      return concept;
    }

    const nameSlug = slugify(concept.name) || `concept-${index + 1}`;
    let candidate = `${domainPrefix}-${nameSlug}`;
    let counter = 2;
    while (usedIds.has(candidate)) {
      candidate = `${domainPrefix}-${nameSlug}-${counter}`;
      counter += 1;
    }
    usedIds.add(candidate);

    return {
      ...concept,
      id: candidate,
    };
  };

  return {
    ...library,
    concepts: library.concepts.map(withId),
  };
};

/**
 * Registry of all available concept libraries
 */
/**
 * The central registry of concept libraries by domain.
 */
const RAW_CONCEPT_LIBRARIES: Record<Domain, ConceptLibrary> = {
  chemistry: CHEMISTRY_CONCEPTS,
  finance: {
    domain: "finance",
    version: "1.0.0",
    concepts: financeConceptLibrary.map((c) => ({
      id: c.id,
      name: c.name,
      aliases: [],
      category: "Finance",
      importance: c.importance,
      description: c.definition,
      misconceptions: c.commonMisconceptions,
    })),
  },
  physics: {
    domain: "physics",
    version: "1.0.0",
    concepts: [
      // Mechanics
      {
        name: "force",
        aliases: ["forces", "net force"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "motion",
        aliases: ["movement", "kinematics"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "velocity",
        aliases: ["speed", "rate of change"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "acceleration",
        aliases: ["accelerate", "rate of change of velocity"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "mass",
        aliases: ["inertia", "matter"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "momentum",
        aliases: ["linear momentum", "p = mv"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "Newton's laws",
        aliases: [
          "Newton's first law",
          "Newton's second law",
          "Newton's third law",
          "law of motion",
        ],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "friction",
        aliases: ["frictional force", "static friction", "kinetic friction"],
        category: "Mechanics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "gravity",
        aliases: ["gravitational force", "weight", "gravitational field"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "work",
        aliases: ["mechanical work", "W = Fd"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "energy",
        aliases: ["mechanical energy", "total energy"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "kinetic energy",
        aliases: ["KE", "energy of motion"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "potential energy",
        aliases: ["PE", "stored energy", "gravitational potential energy"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "power",
        aliases: ["rate of work", "watt"],
        category: "Mechanics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "torque",
        aliases: ["moment", "rotational force"],
        category: "Mechanics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "angular momentum",
        aliases: ["rotational momentum", "L"],
        category: "Mechanics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "centripetal force",
        aliases: ["centripetal acceleration", "circular motion"],
        category: "Mechanics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "projectile motion",
        aliases: ["trajectory", "ballistic motion"],
        category: "Mechanics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "conservation of energy",
        aliases: ["energy conservation", "first law of thermodynamics"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "conservation of momentum",
        aliases: ["momentum conservation"],
        category: "Mechanics",
        subcategory: "Core Concepts",
        importance: "core",
      },

      // Thermodynamics
      {
        name: "temperature",
        aliases: ["thermal energy", "heat level", "degrees"],
        category: "Thermodynamics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "heat",
        aliases: ["thermal energy transfer", "heat transfer"],
        category: "Thermodynamics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "entropy",
        aliases: ["disorder", "second law of thermodynamics"],
        category: "Thermodynamics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "thermodynamic system",
        aliases: ["system", "closed system", "open system", "isolated system"],
        category: "Thermodynamics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "ideal gas law",
        aliases: ["gas law", "PV = nRT"],
        category: "Thermodynamics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "pressure",
        aliases: ["force per area", "atmospheric pressure"],
        category: "Thermodynamics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "volume",
        aliases: ["space", "V"],
        category: "Thermodynamics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "specific heat",
        aliases: ["heat capacity", "thermal capacity"],
        category: "Thermodynamics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "phase transition",
        aliases: [
          "phase change",
          "melting",
          "freezing",
          "evaporation",
          "condensation",
        ],
        category: "Thermodynamics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "thermal equilibrium",
        aliases: ["equilibrium", "zeroth law"],
        category: "Thermodynamics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },

      // Electromagnetism
      {
        name: "electric charge",
        aliases: [
          "charge",
          "positive charge",
          "negative charge",
          "electron charge",
        ],
        category: "Electromagnetism",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "electric field",
        aliases: ["E-field", "electric force field"],
        category: "Electromagnetism",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "electric potential",
        aliases: ["voltage", "potential difference", "V"],
        category: "Electromagnetism",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "electric current",
        aliases: ["current", "flow of charge", "I", "ampere"],
        category: "Electromagnetism",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "resistance",
        aliases: ["electrical resistance", "resistor", "ohm"],
        category: "Electromagnetism",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "Ohm's law",
        aliases: ["V = IR"],
        category: "Electromagnetism",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "magnetic field",
        aliases: ["B-field", "magnetism", "magnetic force"],
        category: "Electromagnetism",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "electromagnetic induction",
        aliases: ["Faraday's law", "induced EMF", "induction"],
        category: "Electromagnetism",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "Maxwell's equations",
        aliases: ["electromagnetic equations", "Maxwell equations"],
        category: "Electromagnetism",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "capacitor",
        aliases: ["capacitance", "capacitors"],
        category: "Electromagnetism",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "inductor",
        aliases: ["inductance", "inductors", "coil"],
        category: "Electromagnetism",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "circuit",
        aliases: [
          "electrical circuit",
          "electric circuit",
          "series circuit",
          "parallel circuit",
        ],
        category: "Electromagnetism",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "Coulomb's law",
        aliases: ["electrostatic force"],
        category: "Electromagnetism",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "Lorentz force",
        aliases: ["magnetic force on charge"],
        category: "Electromagnetism",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },

      // Waves and Optics
      {
        name: "wave",
        aliases: ["waves", "wave motion"],
        category: "Waves and Optics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "wavelength",
        aliases: ["lambda", "λ"],
        category: "Waves and Optics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "frequency",
        aliases: ["hertz", "Hz", "oscillation"],
        category: "Waves and Optics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "amplitude",
        aliases: ["wave amplitude", "magnitude"],
        category: "Waves and Optics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "interference",
        aliases: [
          "constructive interference",
          "destructive interference",
          "superposition",
        ],
        category: "Waves and Optics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "diffraction",
        aliases: ["wave diffraction", "bending of waves"],
        category: "Waves and Optics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "reflection",
        aliases: ["law of reflection", "mirror"],
        category: "Waves and Optics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "refraction",
        aliases: ["Snell's law", "bending of light"],
        category: "Waves and Optics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "light",
        aliases: ["electromagnetic radiation", "visible light", "photon"],
        category: "Waves and Optics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "lens",
        aliases: ["lenses", "convex lens", "concave lens", "optical lens"],
        category: "Waves and Optics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "polarization",
        aliases: ["polarized light", "polarizer"],
        category: "Waves and Optics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "Doppler effect",
        aliases: ["Doppler shift", "frequency shift"],
        category: "Waves and Optics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "electromagnetic spectrum",
        aliases: ["EM spectrum", "spectrum"],
        category: "Waves and Optics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },

      // Modern Physics
      {
        name: "quantum mechanics",
        aliases: ["quantum physics", "quantum theory"],
        category: "Modern Physics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "photon",
        aliases: ["light quantum", "quantum of light"],
        category: "Modern Physics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "wave-particle duality",
        aliases: ["duality", "wave-particle"],
        category: "Modern Physics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "uncertainty principle",
        aliases: ["Heisenberg uncertainty", "quantum uncertainty"],
        category: "Modern Physics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "quantum state",
        aliases: ["state", "quantum system", "wavefunction"],
        category: "Modern Physics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "relativity",
        aliases: [
          "theory of relativity",
          "special relativity",
          "general relativity",
        ],
        category: "Modern Physics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "spacetime",
        aliases: ["space-time", "space and time"],
        category: "Modern Physics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "speed of light",
        aliases: ["c", "light speed", "constant c"],
        category: "Modern Physics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "mass-energy equivalence",
        aliases: ["E=mc²", "E equals mc squared"],
        category: "Modern Physics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "atomic structure",
        aliases: ["atom", "nucleus", "electron shell"],
        category: "Modern Physics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "radioactivity",
        aliases: ["radioactive decay", "nuclear decay", "radiation"],
        category: "Modern Physics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "half-life",
        aliases: ["decay constant", "radioactive half-life"],
        category: "Modern Physics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "nuclear fission",
        aliases: ["fission", "nuclear splitting"],
        category: "Modern Physics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "nuclear fusion",
        aliases: ["fusion", "nuclear combining"],
        category: "Modern Physics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "Planck constant",
        aliases: ["h", "Planck's constant"],
        category: "Modern Physics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
    ],
  },
  biology: {
    domain: "biology",
    version: "1.0.0",
    concepts: [
      // Cell Biology
      {
        name: "cell",
        aliases: ["cells", "cellular"],
        category: "Cell Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "cell membrane",
        aliases: ["plasma membrane", "phospholipid bilayer"],
        category: "Cell Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "nucleus",
        aliases: ["cell nucleus", "nuclear envelope"],
        category: "Cell Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "mitochondria",
        aliases: ["mitochondrion", "powerhouse of the cell"],
        category: "Cell Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "ribosome",
        aliases: ["ribosomes", "protein synthesis machinery"],
        category: "Cell Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "endoplasmic reticulum",
        aliases: ["ER", "rough ER", "smooth ER"],
        category: "Cell Biology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "Golgi apparatus",
        aliases: ["Golgi body", "Golgi complex"],
        category: "Cell Biology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "lysosome",
        aliases: ["lysosomes", "digestive organelle"],
        category: "Cell Biology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "chloroplast",
        aliases: ["chloroplasts", "photosynthetic organelle"],
        category: "Cell Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "cytoplasm",
        aliases: ["cytosol", "cell interior"],
        category: "Cell Biology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "organelle",
        aliases: ["organelles", "cellular organelle"],
        category: "Cell Biology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "prokaryote",
        aliases: ["prokaryotic cell", "bacteria"],
        category: "Cell Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "eukaryote",
        aliases: ["eukaryotic cell"],
        category: "Cell Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },

      // Genetics
      {
        name: "DNA",
        aliases: ["deoxyribonucleic acid", "genetic material", "double helix"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "RNA",
        aliases: ["ribonucleic acid", "mRNA", "tRNA", "rRNA"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "gene",
        aliases: ["genes", "genetic unit"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "chromosome",
        aliases: ["chromosomes", "chromatin"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "allele",
        aliases: ["alleles", "gene variant"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "genotype",
        aliases: ["genetic makeup"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "phenotype",
        aliases: ["observable traits", "physical characteristics"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "mutation",
        aliases: ["mutations", "genetic mutation", "DNA mutation"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "transcription",
        aliases: ["DNA transcription", "gene transcription"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "translation",
        aliases: ["protein translation", "mRNA translation"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "replication",
        aliases: ["DNA replication", "genetic replication"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "Mendelian genetics",
        aliases: ["Mendel's laws", "inheritance patterns"],
        category: "Genetics",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "dominant",
        aliases: ["dominant allele", "dominance"],
        category: "Genetics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "recessive",
        aliases: ["recessive allele"],
        category: "Genetics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "genetic code",
        aliases: ["codon", "codons", "triplet code"],
        category: "Genetics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "genome",
        aliases: ["genetic code", "complete DNA"],
        category: "Genetics",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },

      // Evolution
      {
        name: "evolution",
        aliases: ["evolutionary change", "biological evolution"],
        category: "Evolution",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "natural selection",
        aliases: ["survival of the fittest", "Darwinian selection"],
        category: "Evolution",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "adaptation",
        aliases: ["adaptations", "evolutionary adaptation"],
        category: "Evolution",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "speciation",
        aliases: ["species formation", "new species"],
        category: "Evolution",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "fitness",
        aliases: ["reproductive fitness", "biological fitness"],
        category: "Evolution",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "genetic drift",
        aliases: ["random drift", "genetic variation"],
        category: "Evolution",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "gene flow",
        aliases: ["migration", "genetic migration"],
        category: "Evolution",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "common ancestor",
        aliases: ["ancestral species", "phylogeny"],
        category: "Evolution",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "fossil record",
        aliases: ["fossils", "paleontology"],
        category: "Evolution",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },

      // Ecology
      {
        name: "ecosystem",
        aliases: ["ecosystems", "ecological system"],
        category: "Ecology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "population",
        aliases: ["populations", "species population"],
        category: "Ecology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "community",
        aliases: ["biological community", "ecological community"],
        category: "Ecology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "food chain",
        aliases: ["food web", "trophic levels"],
        category: "Ecology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "producer",
        aliases: ["producers", "autotroph", "primary producer"],
        category: "Ecology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "consumer",
        aliases: [
          "consumers",
          "heterotroph",
          "herbivore",
          "carnivore",
          "omnivore",
        ],
        category: "Ecology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "decomposer",
        aliases: ["decomposers", "detritivore", "saprophyte"],
        category: "Ecology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "niche",
        aliases: ["ecological niche", "habitat role"],
        category: "Ecology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "habitat",
        aliases: ["habitats", "living environment"],
        category: "Ecology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "biodiversity",
        aliases: ["biological diversity", "species diversity"],
        category: "Ecology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "symbiosis",
        aliases: ["mutualism", "commensalism", "parasitism"],
        category: "Ecology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "predation",
        aliases: ["predator-prey", "predator", "prey"],
        category: "Ecology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "competition",
        aliases: ["ecological competition", "resource competition"],
        category: "Ecology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },

      // Physiology
      {
        name: "homeostasis",
        aliases: ["internal balance", "physiological balance"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "metabolism",
        aliases: ["metabolic process", "cellular metabolism"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "photosynthesis",
        aliases: ["light synthesis", "carbon fixation"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "cellular respiration",
        aliases: ["respiration", "ATP production", "glycolysis", "Krebs cycle"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "ATP",
        aliases: ["adenosine triphosphate", "energy currency"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "enzyme",
        aliases: ["enzymes", "biological catalyst", "protein catalyst"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "hormone",
        aliases: ["hormones", "endocrine signal", "chemical messenger"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "nervous system",
        aliases: ["neural system", "CNS", "PNS"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "neuron",
        aliases: ["neurons", "nerve cell"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "circulatory system",
        aliases: ["cardiovascular system", "blood circulation"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "respiratory system",
        aliases: ["breathing system", "lungs"],
        category: "Physiology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "digestive system",
        aliases: ["digestion", "gastrointestinal system"],
        category: "Physiology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "immune system",
        aliases: ["immunity", "immune response"],
        category: "Physiology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "antibody",
        aliases: ["antibodies", "immunoglobulin"],
        category: "Physiology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "antigen",
        aliases: ["antigens", "foreign substance"],
        category: "Physiology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },

      // Molecular Biology
      {
        name: "protein",
        aliases: ["proteins", "polypeptide", "amino acid chain"],
        category: "Molecular Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "amino acid",
        aliases: ["amino acids", "protein building block"],
        category: "Molecular Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "carbohydrate",
        aliases: ["carbohydrates", "sugar", "glucose", "starch"],
        category: "Molecular Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "lipid",
        aliases: ["lipids", "fat", "fatty acid", "phospholipid"],
        category: "Molecular Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "nucleotide",
        aliases: ["nucleotides", "DNA building block"],
        category: "Molecular Biology",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "macromolecule",
        aliases: ["macromolecules", "biological polymer"],
        category: "Molecular Biology",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },

      // Cell Division
      {
        name: "mitosis",
        aliases: ["cell division", "mitotic division"],
        category: "Cell Division",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "meiosis",
        aliases: ["meiotic division", "gamete formation"],
        category: "Cell Division",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "cell cycle",
        aliases: [
          "interphase",
          "prophase",
          "metaphase",
          "anaphase",
          "telophase",
        ],
        category: "Cell Division",
        subcategory: "Core Concepts",
        importance: "core",
      },
      {
        name: "gamete",
        aliases: ["gametes", "sex cell", "sperm", "egg"],
        category: "Cell Division",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
      {
        name: "zygote",
        aliases: ["fertilized egg"],
        category: "Cell Division",
        subcategory: "Supporting Concepts",
        importance: "supporting",
      },
    ],
  },
  computing: COMPUTING_CONCEPTS,
  react: REACT_CONCEPTS,
  javascript: JAVASCRIPT_CONCEPTS,
  mathematics: ALGEBRA_TRIG_CONCEPTS,
  custom: {
    domain: "custom",
    version: "1.0.0",
    concepts: [],
  },
  "cross-domain": CROSS_DOMAIN_CONCEPTS,
};

export const CONCEPT_LIBRARIES: Record<Domain, ConceptLibrary> = (
  Object.keys(RAW_CONCEPT_LIBRARIES) as Domain[]
).reduce((acc, domain) => {
  const baseLibrary = RAW_CONCEPT_LIBRARIES[domain];
  acc[domain] = ensureConceptIds(baseLibrary, domain);
  return acc;
}, {} as Record<Domain, ConceptLibrary>);

/**
 * Get a concept library by domain
 */
export function getLibraryByDomain(domain: Domain): ConceptLibrary | undefined {
  return CONCEPT_LIBRARIES[domain];
}

/**
 * Get all available domains
 */
export function getAvailableDomains() {
  return AVAILABLE_DOMAINS;
}

/**
 * Check if a domain has a comprehensive library (vs placeholder)
 */
export function hasComprehensiveLibrary(domain: Domain): boolean {
  const comprehensive: Domain[] = ["chemistry", "mathematics", "cross-domain"];
  return comprehensive.includes(domain);
}
