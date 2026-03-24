import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Volume2, 
  Zap,
  Keyboard,
  Radio,
  ArrowRight
} from 'lucide-react';
import { MORSE_WORDS } from '../constants/words';
import Translator from './Translator';

interface HomeProps {
  wpm: number;
  setWpm: (wpm: number) => void;
  frequency: number;
  setFrequency: (freq: number) => void;
}

export default function Home({ wpm, setWpm, frequency, setFrequency }: HomeProps) {
  return (
    <div className="space-y-12">
      <Translator 
        wpm={wpm} 
        setWpm={setWpm} 
        frequency={frequency} 
        setFrequency={setFrequency} 
      />

      {/* Popular Words Section */}
      <section className="mt-20 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white">Popular Morse Code Phrases</h2>
          <div className="h-px bg-gray-800 flex-grow mx-8 hidden md:block" />
          <Link to="/alphabet" className="text-xs font-mono text-amber-400 hover:text-amber-300 uppercase tracking-widest flex items-center gap-2 transition-colors">
            View Full Alphabet <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {MORSE_WORDS.map((word) => (
            <Link 
              key={word.slug} 
              to={`/words/${word.slug}`}
              className="bg-[#1a1d23] border border-gray-800 p-6 rounded-2xl hover:border-amber-400/50 transition-all text-center group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-400/0 group-hover:bg-amber-400 transition-all" />
              <span className="block font-bold text-white group-hover:text-amber-400 transition-colors text-lg mb-1">{word.word}</span>
              <span className="block text-[10px] font-mono text-gray-400 tracking-widest">{word.morse}</span>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-[10px] text-amber-400 font-bold uppercase">
                Learn More <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Morse Code Chart Section */}
      <section className="mt-20 bg-[#1a1d23] border border-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-display font-bold text-white">International Morse Code Chart</h2>
            <p className="text-gray-400 max-w-xl">A quick reference guide for the most common Morse code characters used worldwide.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-gray-900 rounded-xl border border-gray-800 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-mono text-gray-400">Dot (Dit)</span>
            </div>
            <div className="px-4 py-2 bg-gray-900 rounded-xl border border-gray-800 flex items-center gap-3">
              <div className="w-4 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-mono text-gray-400">Dash (Dah)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { c: 'A', m: '.-' }, { c: 'B', m: '-...' }, { c: 'C', m: '-.-.' }, { c: 'D', m: '-..' },
            { c: 'E', m: '.' }, { c: 'F', m: '..-.' }, { c: 'G', m: '--.' }, { c: 'H', m: '....' },
            { c: 'I', m: '..' }, { c: 'J', m: '.---' }, { c: 'K', m: '-.-' }, { c: 'L', m: '.-..' },
            { c: 'M', m: '--' }, { c: 'N', m: '-.' }, { c: 'O', m: '---' }, { c: 'P', m: '.--.' },
            { c: 'Q', m: '--.-' }, { c: 'R', m: '.-.' }, { c: 'S', m: '...' }, { c: 'T', m: '-' },
            { c: 'U', m: '..-' }, { c: 'V', m: '...-' }, { c: 'W', m: '.--' }, { c: 'X', m: '-..-' },
            { c: 'Y', m: '-.--' }, { c: 'Z', m: '--..' }, { c: '1', m: '.----' }, { c: '2', m: '..---' },
            { c: '3', m: '...--' }, { c: '4', m: '....-' }, { c: '5', m: '.....' }, { c: '6', m: '-....' },
            { c: '7', m: '--...' }, { c: '8', m: '---..' }, { c: '9', m: '----.' }, { c: '0', m: '-----' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800/50 hover:border-amber-400/30 transition-colors">
              <span className="text-xl font-bold text-white">{item.c}</span>
              <span className="text-sm font-mono text-amber-400">{item.m}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-display font-bold text-white">Advanced Morse Code Translator Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Our morse code translator online tool provides professional features for hobbyists, students, and professionals alike.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Real-time Translation", desc: "Instantly translate morse code to english or english to morse code as you type.", icon: <Zap className="w-6 h-6 text-amber-400" /> },
            { title: "Professional Audio", desc: "High-quality morse code translator audio with adjustable WPM and frequency settings.", icon: <Volume2 className="w-6 h-6 text-amber-400" /> },
            { title: "Visual Signals", desc: "Visual flash indicator synchronized with audio for immersive signal training.", icon: <Radio className="w-6 h-6 text-amber-400" /> },
            { title: "Telegraph Key", desc: "Manual input mode using a virtual telegraph key or keyboard spacebar.", icon: <Keyboard className="w-6 h-6 text-amber-400" /> }
          ].map((feature, i) => (
            <div key={i} className="bg-[#1a1d23] border border-gray-800 p-6 rounded-2xl hover:border-amber-400/50 transition-colors group">
              <div className="mb-4 p-3 bg-gray-900 rounded-xl w-fit group-hover:bg-amber-400/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-20 bg-[#1a1d23] border border-gray-800 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-display font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { q: "How do I translate morse code to english?", a: "Simply switch to the 'Morse Code to English' tab and enter your dots (.) and dashes (-). The translator will decode it in real-time." },
            { q: "Is this morse code translator online free?", a: "Yes, our morse code translator website is completely free to use for all your translation and learning needs." },
            { q: "Can I hear the morse code audio?", a: "Absolutely. Click the 'Play Audio' button to hear your translation. You can adjust the speed and pitch in the settings." },
            { q: "What is the ITU standard?", a: "The International Telecommunication Union (ITU) standard is the globally recognized version of Morse code used today." },
            { q: "How can I practice manual keying?", a: "Use our virtual telegraph key or press the Spacebar on your keyboard to manually input signals." },
            { q: "Does this work on mobile devices?", a: "Yes, our english to morse code translator is fully responsive and optimized for mobile browsers." }
          ].map((faq, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-lg font-bold text-amber-400 flex items-start gap-3">
                <span className="text-gray-400">Q:</span> {faq.q}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content Section */}
      <article className="mt-20 prose prose-invert max-w-none border-t border-gray-800 pt-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">The History of Morse Code</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Morse code was developed in the 1830s and 1840s by Samuel Morse and other inventors. It revolutionized long-distance communication by allowing messages to be sent over telegraph wires using electrical pulses. The original code was later refined into what we now call <strong>International Morse Code</strong>, which is the standard used by our <strong>morse code translator online</strong>.
            </p>
            <h3 className="text-xl font-bold text-white">How Morse Code Works</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Morse code represents each letter of the alphabet and each numeral as a unique sequence of short and long signals. These are commonly referred to as "dots" (or "dits") and "dashes" (or "dahs").
            </p>
            <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
              <li>A <strong>dot</strong> is the basic unit of time.</li>
              <li>A <strong>dash</strong> is equal to three dots.</li>
              <li>The <strong>space between parts</strong> of the same letter is one dot.</li>
              <li>The <strong>space between letters</strong> is three dots.</li>
              <li>The <strong>space between words</strong> is seven dots.</li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">Why Learn Morse Code Today?</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              While digital communication has largely replaced the telegraph, Morse code remains popular among amateur radio enthusiasts (Ham radio), aviation professionals, and survivalists. It is a reliable method of communication that can be transmitted via sound, light, or even physical touch.
            </p>
            <h3 className="text-xl font-bold text-white">Learning Tips</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Learning Morse code is like learning a new language. Here are some effective methods:
            </p>
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <h4 className="font-bold text-amber-400 text-sm mb-1">The Koch Method</h4>
                <p className="text-xs text-gray-400">Learning at full speed (20+ WPM) from the start to build muscle memory and avoid "counting" dots and dashes.</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <h4 className="font-bold text-amber-400 text-sm mb-1">Farnsworth Timing</h4>
                <p className="text-xs text-gray-400">Characters are sent at high speed, but the spacing between them is increased to give you time to process.</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
