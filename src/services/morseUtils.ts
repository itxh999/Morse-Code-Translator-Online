export const MORSE_CODE_DICT: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
};

export const REVERSE_MORSE_CODE_DICT: Record<string, string> = Object.entries(MORSE_CODE_DICT).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

export const textToMorse = (text: string): string => {
  return text
    .toUpperCase()
    .split('')
    .map(char => MORSE_CODE_DICT[char] || '')
    .filter(code => code !== '')
    .join(' ');
};

export const morseToText = (morse: string): string => {
  return morse
    .trim()
    .split(' ')
    .map(code => REVERSE_MORSE_CODE_DICT[code] || '')
    .join('')
    .replace(/\//g, ' ');
};
