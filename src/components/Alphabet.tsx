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
                The <strong>Morse code alphabet</strong> is a system used in telecommunication to encode text characters as standardized sequences of two different signal durations, called dots and dashes. Each letter of the alphabet, number, and punctuation mark has a unique sequence. This system is the foundation for sending messages like <Link to="/words/sos" className="text-amber-400 hover:underline">SOS</Link> or simple greetings like <Link to="/words/hello" className="text-amber-400 hover:underline">Hello</Link>.
              </p>
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

          {/* Learning Section */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">Tips for Learning the Morse Code Alphabet</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed">
                Learning the Morse code alphabet can be a rewarding challenge. Here are some tips to get started:
              </p>
              <ul className="text-gray-400 space-y-2 list-disc pl-5">
                <li><strong>Listen to the sound:</strong> Don't just look at the dots and dashes. Listen to the rhythm of the code.</li>
                <li><strong>Start with common letters:</strong> Focus on the most frequently used letters first.</li>
                <li><strong>Practice regularly:</strong> Consistency is key to building muscle memory.</li>
                <li><strong>Use a translator:</strong> Our <Link to="/" className="text-amber-400 hover:underline">Morse Code Translator</Link> can help you verify your translations.</li>
              </ul>
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
