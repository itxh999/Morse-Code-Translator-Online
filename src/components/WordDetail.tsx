import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MORSE_WORDS } from '../constants/words';
import Translator from './Translator';
import { ArrowLeft, BookOpen, History, Info, PenTool, Volume2, HelpCircle, ChevronRight, Table, Zap } from 'lucide-react';

interface WordDetailProps {
  wpm: number;
  setWpm: (wpm: number) => void;
  frequency: number;
  setFrequency: (freq: number) => void;
}

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': '/'
};

export default function WordDetail({ wpm, setWpm, frequency, setFrequency }: WordDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const wordData = MORSE_WORDS.find(w => w.slug === slug);

  if (!wordData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Word not found</h2>
        <Link to="/" className="text-amber-400 hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  // Helper to generate "How to say" text
  const getHowToSay = (morse: string) => {
    return morse.split(' ').map(char => {
      if (char === '/') return '(space)';
      return char.split('').map(symbol => {
        if (symbol === '.') return 'dit';
        if (symbol === '-') return 'dah';
        return '';
      }).filter(Boolean).join('-');
    }).filter(Boolean).join(' ');
  };

  React.useEffect(() => {
    if (wordData) {
      document.title = `${wordData.word} in Morse Code - Morse Translator`;
    }
    return () => {
      document.title = 'Morse Code Translator - English to Morse Code Online';
    };
  }, [wordData]);

  const wordChars = wordData.word.toUpperCase().split('');

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-400">Words</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-amber-400">{wordData.word}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-display font-bold text-white leading-tight">
              {wordData.word} in Morse Code
            </h1>
            <p className="text-amber-400 font-mono text-lg tracking-[0.3em] mt-2">{wordData.morse}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-gray-800 rounded-full text-[10px] font-mono text-gray-400 uppercase tracking-widest border border-gray-700">
            Popular Phrase
          </span>
          <span className="px-3 py-1 bg-amber-400/10 rounded-full text-[10px] font-mono text-amber-400 uppercase tracking-widest border border-amber-400/20">
            SEO Optimized
          </span>
        </div>
      </div>

      <section className="space-y-6">
        <div className="bg-[#1a1d23] border border-gray-800 rounded-3xl p-1 overflow-hidden">
          <Translator 
            initialText={wordData.word} 
            wpm={wpm} 
            setWpm={setWpm} 
            frequency={frequency} 
            setFrequency={setFrequency} 
          />
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {/* What is Section */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <HelpCircle className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">What is {wordData.word} in Morse Code?</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed text-lg">
                In Morse code, <strong>{wordData.word}</strong> is represented by the sequence <code>{wordData.morse}</code>. This specific combination of signals is one of the most recognized patterns in the <strong>morse code translator</strong> database. {wordData.description}
              </p>
              <p className="text-gray-400 leading-relaxed">
                Whether you are a hobbyist or a professional, understanding how to transmit <strong>{wordData.word} in morse code</strong> is a fundamental skill. Using a <strong>morse code translator online</strong> allows you to verify the timing and rhythm of this phrase, ensuring it is technically accurate according to ITU standards.
              </p>
            </div>
          </article>

          {/* Technical Timing Section */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <Zap className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">Technical Timing Analysis of "{wordData.word}"</h2>
            </div>
            <div className="bg-[#1a1d23] border border-gray-800 rounded-3xl p-8 space-y-6">
              <p className="text-sm text-gray-400 leading-relaxed">
                To perfectly transmit <strong>{wordData.word} in morse code</strong>, one must follow the standard 1:3 timing ratio. Here is the mathematical breakdown of the sequence <code>{wordData.morse}</code>:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <span className="text-xs font-mono text-gray-500 block mb-1">Total Units</span>
                  <span className="text-xl font-bold text-white">
                    {wordData.morse.split('').reduce((acc, char) => {
                      if (char === '.') return acc + 2; // 1 for dot, 1 for gap
                      if (char === '-') return acc + 4; // 3 for dash, 1 for gap
                      if (char === ' ') return acc + 2; // 3 total for letter gap (already added 1)
                      return acc;
                    }, 0)} Units
                  </span>
                </div>
                <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <span className="text-xs font-mono text-gray-500 block mb-1">Duration at 20 WPM</span>
                  <span className="text-xl font-bold text-white">
                    {(wordData.morse.split('').reduce((acc, char) => {
                      if (char === '.') return acc + 2;
                      if (char === '-') return acc + 4;
                      if (char === ' ') return acc + 2;
                      return acc;
                    }, 0) * 60).toFixed(0)} ms
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">
                *Calculated using the PARIS standard where 1 unit = 60ms at 20 WPM. Our <strong>morse code translator</strong> handles this precision automatically.
              </p>
            </div>
          </article>

          {/* Character Breakdown Table */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <Table className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">Character Breakdown for {wordData.word}</h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/30">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Character</th>
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Morse Code</th>
                    <th className="p-4 text-xs font-mono uppercase tracking-widest text-gray-400 border-b border-gray-800">Phonetic</th>
                  </tr>
                </thead>
                <tbody>
                  {wordChars.map((char, i) => (
                    <tr key={i} className="hover:bg-gray-800/20 transition-colors">
                      <td className="p-4 text-xl font-bold text-white border-b border-gray-800/50">{char}</td>
                      <td className="p-4 font-mono text-amber-400 text-lg border-b border-gray-800/50">{MORSE_MAP[char] || ''}</td>
                      <td className="p-4 text-sm text-gray-400 italic border-b border-gray-800/50">{char === ' ' ? '(Space)' : getHowToSay(MORSE_MAP[char] || '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {/* How to Write Section */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <PenTool className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">How to write {wordData.word} in Morse Code?</h2>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-6">
              <div className="text-6xl font-mono text-white tracking-[0.5em]">{wordData.morse}</div>
              <div className="h-px w-full bg-gray-800" />
              <p className="text-gray-400 text-center max-w-md">
                To write "{wordData.word}" in Morse code, you use a series of dots and dashes. 
                A dot is a short signal, and a dash is a long signal (three times the length of a dot).
              </p>
            </div>
          </article>

          {/* How to Say Section */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <Volume2 className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">How to say {wordData.word} in Morse Code?</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed">
                When speaking Morse code, dots are often pronounced as "dit" and dashes as "dah". 
                For <strong>{wordData.word}</strong>, the phonetic pronunciation would be:
              </p>
              <div className="bg-amber-400/5 border border-amber-400/20 p-6 rounded-xl font-mono text-amber-400 text-xl text-center italic">
                "{getHowToSay(wordData.morse)}"
              </div>
            </div>
          </article>

          {/* History Section */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <History className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">History of {wordData.word} in Morse Code</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed">
                {wordData.history}
              </p>
            </div>
          </article>

          {/* Usage Section */}
          <article className="space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">Examples & Cultural Context of {wordData.word}</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 leading-relaxed">
                {wordData.usage}
              </p>
              <p className="text-gray-400 leading-relaxed">
                The phrase <strong>{wordData.word} in morse code</strong> has appeared in numerous historical documents and modern media. Its distinct rhythm makes it a favorite for sound designers and radio operators alike. By using our <strong>morse code translator online</strong>, you can explore how this phrase sounds at different speeds and frequencies.
              </p>
            </div>
          </article>

          {/* Word Specific FAQ */}
          <article className="space-y-8">
            <div className="flex items-center gap-3 text-amber-400">
              <HelpCircle className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold text-white">FAQ: {wordData.word} in Morse Code</h2>
            </div>
            <div className="space-y-6">
              {[
                { q: `How do I write ${wordData.word} in morse code?`, a: `To write <strong>${wordData.word}</strong>, use the sequence <code>${wordData.morse}</code>. Ensure you leave a space (3 units) between each letter for clarity.` },
                { q: `What does ${wordData.word} sound like in Morse?`, a: `It sounds like <em>"${getHowToSay(wordData.morse)}"</em>. You can hear the actual audio by using the 'Play' button on our <strong>morse code translator</strong> above.` },
                { q: `Is ${wordData.word} a common Morse code phrase?`, a: `Yes, it is one of the most frequently searched and used phrases in the <strong>morse code translator</strong> community due to its historical and practical significance.` }
              ].map((faq, i) => (
                <div key={i} className="space-y-2 border-b border-gray-800 pb-6 last:border-0">
                  <h3 className="text-lg font-bold text-white">Q: {faq.q}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }} />
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="bg-[#1a1d23] border border-gray-800 rounded-3xl p-8 sticky top-24">
            <h3 className="text-xl font-display font-bold text-white mb-6">Popular Morse Words</h3>
            <div className="space-y-4">
              {MORSE_WORDS.filter(w => w.slug !== slug).map(word => (
                <Link 
                  key={word.slug} 
                  to={`/words/${word.slug}`}
                  className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-amber-400/50 transition-all group"
                >
                  <div>
                    <span className="block font-bold text-white group-hover:text-amber-400 transition-colors">{word.word}</span>
                    <span className="block text-[10px] font-mono text-gray-400 mt-1">{word.morse}</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-amber-400 rotate-180 transition-all" />
                </Link>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800">
              <h4 className="text-sm font-bold text-white mb-4">Need a custom translation?</h4>
              <Link to="/" className="w-full py-3 bg-amber-400 text-black rounded-xl font-bold text-center block hover:bg-amber-300 transition-colors">
                Back to Main Translator
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
