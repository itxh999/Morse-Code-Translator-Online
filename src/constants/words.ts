export interface MorseWord {
  slug: string;
  word: string;
  morse: string;
  description: string;
  history: string;
  usage: string;
}

export const MORSE_WORDS: MorseWord[] = [
  {
    slug: 'sos',
    word: 'SOS',
    morse: '... --- ...',
    description: 'The most famous Morse code signal, used internationally as a distress signal.',
    history: 'The SOS signal was first adopted by the German government in 1905 and became the worldwide standard under the second International Radiotelegraphic Convention in 1906.',
    usage: 'In Morse code, SOS is sent as a single continuous sequence of three dots, three dashes, and three dots, without spaces between the letters.'
  },
  {
    slug: 'i-love-you',
    word: 'I Love You',
    morse: '.. / .-.. --- ...- . / -.-- --- ..-',
    description: 'A common phrase translated into Morse code, often used in jewelry and gifts.',
    history: 'While not a formal signal, "I Love You" in Morse code has become a popular way to send secret messages in romantic contexts.',
    usage: 'Used in modern culture, often engraved on bracelets or necklaces as a subtle way to express affection.'
  },
  {
    slug: 'hello',
    word: 'Hello',
    morse: '.... . .-.. .-.. ---',
    description: 'A standard greeting in Morse code.',
    history: 'Greetings like "Hello" were common in early telegraphy to establish a connection between operators.',
    usage: 'Used as a basic exercise for beginners learning Morse code to practice common letters like H, E, L, and O.'
  },
  {
    slug: 'help',
    word: 'Help',
    morse: '.... . .-.. .--.',
    description: 'A clear request for assistance in Morse code.',
    history: 'Before SOS became the standard, various signals were used to call for help, but "HELP" remains a clear and direct message.',
    usage: 'Can be used in emergency situations where a specific distress signal like SOS might not be known by the receiver.'
  },
  {
    slug: '73',
    word: '73',
    morse: '--... ...--',
    description: 'A traditional Morse code sign-off meaning "Best Regards".',
    history: 'The number 73 has been used since the early days of telegraphy. In the "92 Code" adopted in 1859, 73 was defined as "Accept my compliments" or "Best Regards".',
    usage: 'Extremely common among amateur radio (Ham radio) operators as a friendly way to end a conversation.'
  },
  {
    slug: '88',
    word: '88',
    morse: '---.. ---..',
    description: 'A Morse code sign-off meaning "Love and Kisses".',
    history: 'Similar to 73, 88 originated in the early telegraph era as a warm and affectionate closing to a message.',
    usage: 'Often used between close friends or family members in the amateur radio community.'
  },
  {
    slug: 'cq',
    word: 'CQ',
    morse: '-.-. --.-',
    description: 'A general call to any station, meaning "Seek You".',
    history: 'Originating in the early 20th century, CQ was used by telegraphers to indicate they were looking for a conversation with anyone listening.',
    usage: 'Still widely used by amateur radio operators to initiate a contact on a frequency.'
  },
  {
    slug: 'goodbye',
    word: 'Goodbye',
    morse: '--. --- --- -.. -... -.-- .',
    description: 'A standard farewell in Morse code.',
    history: 'While operators often used codes like 73, spelling out "Goodbye" was also common for more formal or personal closings.',
    usage: 'A great practice word for learning Morse code, as it uses a variety of common letters.'
  },
  {
    slug: 'ok',
    word: 'OK',
    morse: '--- -.-',
    description: 'A universal affirmation in Morse code.',
    history: 'The term "OK" has been used in telegraphy since the mid-19th century as a quick way to confirm receipt or agreement.',
    usage: 'One of the most frequently used abbreviations in all forms of Morse code communication.'
  }
];
