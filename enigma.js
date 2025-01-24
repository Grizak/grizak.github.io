class EnigmaMachine {
  constructor(rotors, reflector, plugboard) {
    this.rotors = rotors; // Array of rotor objects
    this.reflector = reflector; // Reflector mapping
    this.plugboard = plugboard; // Plugboard mappings
  }

  // Plugboard substitution
  plugboardSwap(char) {
    return this.plugboard[char] || char;
  }

  // Pass character through rotors (right to left)
  passThroughRotors(char, reverse = false) {
    const rotorSequence = reverse ? [...this.rotors].reverse() : this.rotors;
    for (let rotor of rotorSequence) {
      char = reverse ? rotor.reverseSubstitute(char) : rotor.substitute(char);
    }
    return char;
  }

  // Encrypt or decrypt a single character
  processChar(char) {
    if (!/[A-Z]/.test(char)) return char; // Ignore non-alphabetic characters

    // Step 1: Plugboard swap
    char = this.plugboardSwap(char);

    // Step 2: Pass through rotors (right to left)
    char = this.passThroughRotors(char);

    // Step 3: Reflector substitution
    char = this.reflector[char] || char;

    // Step 4: Pass back through rotors (left to right)
    char = this.passThroughRotors(char, true);

    // Step 5: Plugboard swap again
    char = this.plugboardSwap(char);

    // Step 6: Rotate rotors
    this.rotateRotors();

    return char;
  }

  // Rotate the rotors after each key press
  rotateRotors() {
    for (let i = 0; i < this.rotors.length; i++) {
      if (!this.rotors[i].rotate()) break;
    }
  }

  processMessage(message) {
    return message
      .toUpperCase()
      .split("")
      .map((char) => {
        console.log(`Processing char: ${char}`);
        const processed = this.processChar(char);
        console.log(`Result: ${processed}`);
        return processed;
      })
      .join("");
  }
  
}

// Example rotor class
class Rotor {
  constructor(mapping, notch, position = 0) {
    this.mapping = mapping;
    this.notch = notch;
    this.position = position;

    this.reverseMapping = this.mapping.map((_, index) => this.mapping.indexOf(index));
  }

  // Substitute a character (forward)
substitute(char) {
  const offsetIndex = (char.charCodeAt(0) - 65 + this.position) % 26;
  const substitutedChar = this.mapping[offsetIndex];
  return String.fromCharCode((substitutedChar - this.position + 26) % 26 + 65);
}

reverseSubstitute(char) {
  const index = (char.charCodeAt(0) - 65 + this.position) % 26;
  const mapped = this.reverseMapping[(index + 26) % 26];
  return String.fromCharCode(((mapped - this.position + 26) % 26) + 65);
}

rotate() {
  this.position = (this.position + 1) % 26;
  return this.position === this.notch; // Triggers the next rotor if the notch is reached
}
}

// Starter machine configuration
const rotor1 = new Rotor([4, 10, 12, 5, 11, 6, 3, 16, 21, 25, 13, 19, 14, 22, 24, 7, 23, 20, 18, 15, 0, 8, 1, 17, 2, 9], 16);
const rotor2 = new Rotor([0, 9, 3, 10, 18, 8, 17, 20, 23, 1, 11, 7, 22, 19, 2, 16, 6, 25, 13, 15, 24, 5, 21, 14, 4, 12], 4);
const rotor3 = new Rotor([1, 3, 5, 7, 9, 11, 2, 15, 17, 19, 23, 21, 25, 13, 24, 4, 8, 22, 6, 0, 10, 12, 20, 18, 16, 14], 21);

console.log(rotor1, rotor2, rotor3);

console.log('Reverse Mapping for rotor 1:', rotor1.reverseMapping);
console.log('Reverse Mapping for rotor 2:', rotor2.reverseMapping);
console.log('Reverse Mapping for rotor 3:', rotor3.reverseMapping);



const reflector = {
  A: "Y", B: "R", C: "U", D: "H", E: "Q", F: "S", G: "L", H: "D",
  I: "P", J: "X", K: "N", L: "G", M: "O", N: "K", O: "M", P: "I",
  Q: "E", R: "B", S: "F", T: "Z", U: "C", V: "W", W: "V", X: "J",
  Y: "A", Z: "T"
};

const plugboard = {
  A: "B", B: "A", C: "D", D: "C", E: "F", F: "E",
  G: "H", H: "G", I: "J", J: "I", K: "L", L: "K"
};

const chars = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]

const enigma = new EnigmaMachine([rotor1, rotor2, rotor3], reflector, plugboard);

for (const char of chars) {
  console.log(`Plugboard in: ${char}, out: ${plugboard[char] || char}`);
  console.log(`Rotor forward in: ${char}, out: ${enigma.passThroughRotors(char)}`);
  console.log(`Rotor reverse in: ${char}, out: ${enigma.passThroughRotors(char, true)}`);
  console.log(`Rotor positions: ${rotor1.position}, ${rotor2.position}, ${rotor3.position}`);
  console.log(`Reflection of ${char}: ${reflector[char] || char}`);
}

// Example usage
const encrypted = enigma.processMessage("HELLO WORLD"); 
console.log("Encrypted:", encrypted);

const enigma1 = new EnigmaMachine([rotor1, rotor2, rotor3], reflector, plugboard);

const decrypted = enigma1.processMessage(encrypted);
console.log("Decrypted:", decrypted);
