const fs = require('fs');

const file = fs.readFileSync('src/data/chemistryConceptLibrary.ts', 'utf8');

// Core concepts - fundamental to chemistry
const coreConcepts = [
  'matter', 'atom', 'molecule', 'element', 'compound', 'mixture',
  'chemical reaction', 'electron', 'proton', 'neutron',
  'periodic table', 'chemical bond', 'ion', 'oxidation', 'reduction',
  'acid', 'base', 'pH', 'mole', 'molarity', 'equilibrium',
  'energy', 'enthalpy', 'entropy', 'catalyst', 'solvent', 'solute',
  'solution', 'concentration', 'reaction rate', 'chemical equation',
  'stoichiometry', 'atomic number', 'mass number', 'isotope',
  'covalent bond', 'ionic bond', 'metallic bond',
  'oxidation state', 'electronegativity', 'ionization energy',
  'valence electrons', 'Lewis structure', 'molecular orbital',
  'hybridization', 'polarity', 'intermolecular forces',
  'gas laws', 'ideal gas law', 'thermodynamics', 'kinetics',
  'Le Chatelier\\'s principle', 'Hess\\'s law', 'Avogadro\\'s number'
];

// Supporting concepts - important but build on core
const supportingConcepts = [
  'physical properties', 'chemical properties', 'states of matter',
  'phase transition', 'density', 'temperature', 'pressure', 'volume',
  'significant figures', 'scientific notation', 'conversion factors',
  'pure substance', 'heterogeneous mixture', 'homogeneous mixture',
  'suspension', 'colloid', 'alloy', 'electron configuration',
  'quantum numbers', 'orbital', 'subshell', 'shell',
  'periodic trends', 'atomic radius', 'electron affinity',
  'metal', 'nonmetal', 'metalloid', 'transition metal',
  'alkali metal', 'alkaline earth metal', 'halogen', 'noble gas',
  'hydrogen bond', 'dipole', 'London dispersion forces',
  'van der Waals forces', 'VSEPR theory', 'molecular geometry',
  'resonance', 'formal charge', 'bond energy', 'bond length',
  'reaction mechanism', 'activation energy', 'rate constant',
  'rate law', 'order of reaction', 'half-life',
  'buffer', 'titration', 'indicator', 'neutralization',
  'strong acid', 'weak acid', 'strong base', 'weak base',
  'conjugate acid', 'conjugate base', 'Ka', 'Kb', 'pKa', 'pKb',
  'solubility', 'Ksp', 'precipitation', 'supersaturated',
  'colligative properties', 'vapor pressure', 'boiling point elevation',
  'freezing point depression', 'osmotic pressure',
  'endothermic', 'exothermic', 'Gibbs free energy',
  'spontaneous process', 'standard state', 'standard enthalpy',
  'standard entropy', 'equilibrium constant', 'reaction quotient',
  'redox reaction', 'oxidizing agent', 'reducing agent',
  'half-reaction', 'electrochemical cell', 'galvanic cell',
  'electrolytic cell', 'standard reduction potential'
];

// Everything else gets detail

let result = file;
const lines = file.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if this is a concept definition (has name: field)
  if (line.trim().match(/^name: "(.+)",$/)) {
    const conceptName = line.match(/name: "(.+)",$/)[1];
    
    // Check if next few lines have importance field
    let hasImportance = false;
    for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
      if (lines[j].includes('importance:')) {
        hasImportance = true;
        break;
      }
      if (lines[j].trim() === '},') break;
    }
    
    if (!hasImportance) {
      // Find the closing brace
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === '},') {
          // Determine importance
          let importance = 'detail';
          if (coreConcepts.includes(conceptName)) {
            importance = 'core';
          } else if (supportingConcepts.includes(conceptName)) {
            importance = 'supporting';
          }
          
          // Add importance before the closing brace
          const indent = lines[j].match(/^(\s*)/)[1];
          lines[j] = `${indent}importance: "${importance}",\n${lines[j]}`;
          modified = true;
          break;
        }
      }
    }
  }
}

if (modified) {
  fs.writeFileSync('src/data/chemistryConceptLibrary.ts', lines.join('\n'));
  console.log('Added importance fields to chemistry concepts');
} else {
  console.log('No changes needed');
}
