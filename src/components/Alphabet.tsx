import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Table, Info, Volume2, PenTool, HelpCircle, ChevronRight, BookOpen, History, Zap } from 'lucide-react';
import { MORSE_WORDS } from '../constants/words';

const ALPHABET = [
  { char: 'A', code: '.-' }, { char: 'B', code: '-...' }, { char: 'C', code: '-.-.' }, { char: 'D', code: '-..' },
  { char: 'E', code: '.' }, { char: 'F', code: '..-.' }, { char: 'G', code: '--.' }, { char: 'H', code: '....' },
  { char: 'I', code: '..' }, { char: 'J', code: '.---' }, { char: 'K', code: '-.-' }, { char: 'L', code: '.-..' },
  { char: 'M', code: '--' }, { char: 'N', code: '-.' }, { char: 'O', code: '---' }, { char: 'P', code: '.--.' },
  { char: 'Q', code: '--.-' }, { char: 'R', code: '.-.' }, { char: 'S', code: '...' }, { char: 'T', code: '-' },
  { char: 'U', code: '..-' }, { char: 'V', code: '...-' }, { char: 'W', code: '.--' }, { char: 'X', code: '-..-' },
  { char: 'Y', code: '-.--' }, { char: 'Z', code: '--..' }
];

const NUMBERS = [
  { char: '1', code: '.----' }, { char: '2', code: '..---' }, { char: '3', code: '...--' },
  { char: '4', code: '....-' }, { char: '5', code: '.....' }, { char: '6', code: '-....' },
  { char: '7', code: '--...' }, { char: '8', code: '---..' }, { char: '9', code: '----.' },
  { char: '0', code: '-----' }
];

const PUNCTUATION = [
  { char: '.', code: '.-.-.-' }, { char: ',', code: '--..--' }, { char: '?', code: '..--..' },
  { char: '!', code: '-.-.--' }, { char: ':', code: '---...' }, { char: ';', code: '-.-.-.' },
  { char: '(', code: '-.--.' }, { char: ')', code: '-.--.-' }, { char: '&', code: '.-...' },
  { char: '=', code: '-...-' }, { char: '+', code: '.-.-.' }, { char: '-', code: '-....-' },
  { char: '_', code: '..--.-' }, { char: '"', code: '.-..-.' }, { char: '$', code: '...-..-' },
  { char: '@', code: '.--.-.' }
];

export default function Alphabet() {
  React.useEffect(() => {
    document.title = 'Morse Code Alphabet - Letters, Numbers & Punctuation';
    return () => {
      document.title = 'Morse Code Translator - English to Morse Code Online';
    };
  }, []);

  const getPhonetic = (code: string) => {
    return code.split('').map(s => s === '.' ? 'dit' : 'dah').join('-');
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-amber-400">Morse Code Alphabet</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-display font-bold text-white leading-tight">
              Morse Code Alphabet
            </h1>
            <p className="text-gray-400 font-mono text-sm tracking-widest mt-2 uppercase">International Standard Reference</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {/* Introduction */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <HelpCircle className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">What is the Morse Code Alphabet?</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed text-lg">
                The <strong>Morse code alphabet</strong> is a sophisticated encoding system that translates text into a series of on-off tones, lights, or clicks. Developed in the 1830s, it remains one of the most resilient forms of communication ever devised. Unlike modern binary systems, the <strong>morse code alphabet</strong> was designed to be decoded by humans without the need for a computer, making it an invaluable skill for emergency and amateur radio operations.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Each character in the <strong>morse code alphabet</strong> is a unique combination of "dots" (short signals) and "dashes" (long signals). The length of these signals is not arbitrary; they follow a strict mathematical ratio to ensure clarity across noisy radio frequencies.
              </p>
            </div>
          </article>

          {/* Character Frequency & Design */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <Zap className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">The Logic of Character Frequency</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed">
                Have you ever wondered why 'E' is just a single dot (<code>.</code>) while 'Q' is a complex <code>--.-</code>? The <strong>morse code alphabet</strong> was designed based on English letter frequency. Samuel Morse and Alfred Vail counted the number of type pieces in a local newspaper's printing office to determine which letters were used most often.
              </p>
              <ul className="text-gray-400 space-y-2 list-disc pl-5">
                <li><strong>Efficiency:</strong> The most common letters (E, T, A, I, N) were given the shortest codes to increase the overall speed of transmission.</li>
                <li><strong>Complexity:</strong> Rare letters (Q, Z, J, X) were assigned longer, more distinct patterns to prevent confusion.</li>
              </ul>
            </div>
          </article>

          {/* How it Works Section */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <Zap className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">How the Morse Code Alphabet Works</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed">
                International Morse Code is composed of five elements:
              </p>
              <ul className="text-gray-400 space-y-2 list-disc pl-5">
                <li><strong>Short mark, dot or "dit" (.):</strong> "dot duration" is one unit long.</li>
                <li><strong>Long mark, dash or "dah" (-):</strong> three units long.</li>
                <li><strong>Inter-element gap</strong> between the dots and dashes within a character: one dot duration or one unit long.</li>
                <li><strong>Short gap (between letters):</strong> three units long.</li>
                <li><strong>Medium gap (between words):</strong> seven units long.</li>
              </ul>
            </div>
          </article>

          {/* Letters Table */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <Table className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">Morse Code Letters (A-Z)</h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/30">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Letter</th>
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Morse Code</th>
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Phonetic</th>
                  </tr>
                </thead>
                <tbody>
                  {ALPHABET.map((item) => (
                    <tr key={item.char} className="hover:bg-gray-800/20 transition-colors">
                      <td className="p-4 text-xl font-bold text-white border-b border-gray-800/50">{item.char}</td>
                      <td className="p-4 font-mono text-amber-400 text-lg border-b border-gray-800/50">{item.code}</td>
                      <td className="p-4 text-sm text-gray-400 italic border-b border-gray-800/50">{getPhonetic(item.code)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {/* Numbers Table */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <Table className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">Morse Code Numbers (0-9)</h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/30">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Number</th>
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Morse Code</th>
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Phonetic</th>
                  </tr>
                </thead>
                <tbody>
                  {NUMBERS.map((item) => (
                    <tr key={item.char} className="hover:bg-gray-800/20 transition-colors">
                      <td className="p-4 text-xl font-bold text-white border-b border-gray-800/50">{item.char}</td>
                      <td className="p-4 font-mono text-amber-400 text-lg border-b border-gray-800/50">{item.code}</td>
                      <td className="p-4 text-sm text-gray-400 italic border-b border-gray-800/50">{getPhonetic(item.code)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {/* Punctuation Table */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <Table className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">Morse Code Punctuation</h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/30">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Symbol</th>
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Morse Code</th>
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Phonetic</th>
                  </tr>
                </thead>
                <tbody>
                  {PUNCTUATION.map((item) => (
                    <tr key={item.char} className="hover:bg-gray-800/20 transition-colors">
                      <td className="p-4 text-xl font-bold text-white border-b border-gray-800/50">{item.char}</td>
                      <td className="p-4 font-mono text-amber-400 text-lg border-b border-gray-800/50">{item.code}</td>
                      <td className="p-4 text-sm text-gray-400 italic border-b border-gray-800/50">{getPhonetic(item.code)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {/* History Section */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <History className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">History of the Morse Code Alphabet</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed">
                The Morse code alphabet was developed in the 1830s and 1840s by Samuel Morse and Alfred Vail. It was originally designed for the electric telegraph, which used electrical pulses to transmit messages over long distances. Over time, the code was refined and standardized, leading to the International Morse Code we use today. This standard is essential for phrases like <Link to="/words/73" className="text-amber-400 hover:underline">73</Link> (Best Regards) and <Link to="/words/88" className="text-amber-400 hover:underline">88</Link> (Love and Kisses).
              </p>
            </div>
          </article>

          {/* Mnemonics Section */}
          <article className="space-y-8">
            <div className="flex items-center gap-3 text-amber-400">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">Morse Code Mnemonics: How to Remember the Alphabet</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { letter: "A", code: ".-", mnemonic: "<strong>A</strong>-part (di-dah)" },
                { letter: "B", code: "-...", mnemonic: "<strong>B</strong>ob is a dog (dah-di-di-dit)" },
                { letter: "C", code: "-.-.", mnemonic: "<strong>C</strong>o-ca Co-la (dah-di-dah-dit)" },
                { letter: "D", code: "-..", mnemonic: "<strong>D</strong>og-gy-it (dah-di-dit)" },
                { letter: "S", code: "...", mnemonic: "<strong>S</strong>-S-S (di-di-dit)" },
                { letter: "O", code: "---", mnemonic: "<strong>O</strong>-O-O (dah-dah-dah)" }
              ].map((m, i) => (
                <div key={i} className="p-4 bg-[#1a1d23] border border-gray-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-white">{m.letter}</span>
                    <span className="text-amber-400 font-mono">{m.code}</span>
                  </div>
                  <span className="text-xs text-gray-400" dangerouslySetInnerHTML={{ __html: m.mnemonic }} />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 italic">Using word-association mnemonics is one of the fastest ways to memorize the <strong>morse code alphabet</strong> for beginners.</p>
          </article>

          {/* Standard Comparison */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <History className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">International vs. American Morse Code</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed">
                It's important to note that the <strong>morse code alphabet</strong> we use today is the <strong>International Morse Code</strong>. However, in the 19th century, "American Morse" (also known as Railroad Morse) was the standard in the United States.
              </p>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Key Difference:</span>
                  <span className="text-gray-400 text-xs uppercase font-mono">Technical Detail</span>
                </div>
                <p className="text-sm text-gray-400">
                  American Morse used different spacing within characters and different lengths for dashes. For example, the letter 'C' in American Morse was <code>.. .</code> (two dots, a space, and a dot), whereas in International Morse it is <code>-.-.</code>. Today, International Morse is the only standard recognized globally.
                </p>
              </div>
            </div>
          </article>

          {/* Alphabet FAQ */}
          <article className="space-y-8">
            <div className="flex items-center gap-3 text-amber-400">
              <HelpCircle className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">Morse Code Alphabet FAQ</h2>
            </div>
            <div className="space-y-6">
              {[
                { q: "Is the Morse code alphabet case-sensitive?", a: "No, the <strong>morse code alphabet</strong> does not distinguish between uppercase and lowercase letters. 'A' and 'a' are both transmitted as <code>.-</code>." },
                { q: "Why are some letters longer than others?", a: "The length is based on frequency in the English language. Common letters like 'E' are short (<code>.</code>), while rare letters like 'J' are long (<code>.---</code>) to save time during transmission." },
                { q: "Are there Morse codes for non-English characters?", a: "Yes, there are extensions for accented characters (like 'é' or 'ñ') and other alphabets (Cyrillic, Greek, Arabic), but these are not part of the standard International Morse Code used for English." },
                { q: "What is a 'prosign' in the Morse alphabet?", a: "Prosigns are procedural signals like <code>.-.-.</code> (AR - End of Message) that are written as two letters run together without a space." }
              ].map((faq, i) => (
                <div key={i} className="space-y-2 border-b border-gray-800 pb-6 last:border-0">
                  <h3 className="text-lg font-bold text-white">Q: {faq.q}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }} />
                </div>
              ))}
            </div>
          </article>

          {/* Popular Phrases Section */}
          <article className="space-y-8">
            <h2 className="text-2xl font-display font-bold text-white">Popular Morse Code Phrases</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MORSE_WORDS.slice(0, 6).map((word) => (
                <Link 
                  key={word.slug} 
                  to={`/words/${word.slug}`}
                  className="bg-[#1a1d23] border border-gray-800 p-6 rounded-2xl hover:border-amber-400/50 transition-all text-center group"
                >
                  <span className="block font-bold text-white group-hover:text-amber-400 transition-colors text-lg mb-1">{word.word}</span>
                  <span className="block text-[10px] font-mono text-gray-500 tracking-widest">{word.morse}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="bg-[#1a1d23] border border-gray-800 rounded-3xl p-8 sticky top-24">
            <h3 className="text-xl font-display font-bold text-white mb-6">Learning Resources</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Audio Tips</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Listen to the rhythm of the code rather than counting dots and dashes. This is the key to high-speed proficiency.
                </p>
              </div>
              <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <PenTool className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Writing Tips</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  A dash is three times the length of a dot. The space between parts of the same letter is one dot.
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800">
              <Link to="/" className="w-full py-3 bg-amber-400 text-black rounded-xl font-bold text-center block hover:bg-amber-300 transition-colors">
                Try the Translator
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
