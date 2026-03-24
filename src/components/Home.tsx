import { Link } from 'react-router-dom';
import { 
  Zap,
  Radio,
  ArrowRight,
  Anchor,
  Plane,
  School,
  Download,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Info,
  List,
  ShieldCheck
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

      {/* Overview Section */}
      <section className="mt-20 space-y-8">
        <div className="flex items-center gap-3 text-amber-400">
          <Info className="w-6 h-6" />
          <h2 className="text-3xl font-display font-bold text-white">Morse Code Translator Overview</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 leading-relaxed text-lg">
              Our <strong>Morse Code Translator</strong> is a professional-grade digital tool designed to bridge the gap between historical telegraphy and modern communication. It provides an instantaneous way to convert English text into International Morse Code signals and decode complex Morse sequences back into readable text. Whether you are a hobbyist, a student of history, or a professional operator, this tool offers the precision and reliability needed for high-quality signal processing.
            </p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 leading-relaxed text-lg">
              Beyond simple text conversion, our platform features high-fidelity audio synthesis and synchronized visual flashing, mimicking real-world telegraph stations. With customizable settings for <strong>Words Per Minute (WPM)</strong> and audio frequency, it serves as a comprehensive training environment. It is built on the ITU standard, ensuring that your translations are globally recognized and technically accurate for any professional scenario.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-display font-bold text-white">Common Use Cases</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Morse code remains a vital skill in various specialized fields and creative endeavors.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { title: "Amateur Radio", icon: <Radio className="w-6 h-6" />, desc: "CW operations for Ham radio enthusiasts." },
            { title: "Aviation", icon: <Plane className="w-6 h-6" />, desc: "Identifying navigational beacons and signals." },
            { title: "Maritime", icon: <Anchor className="w-6 h-6" />, desc: "Emergency signaling and ship-to-shore comms." },
            { title: "Education", icon: <School className="w-6 h-6" />, desc: "STEM learning and historical studies." },
            { title: "Emergency", icon: <ShieldCheck className="w-6 h-6" />, desc: "Survival signaling when networks fail." }
          ].map((item, i) => (
            <div key={i} className="bg-[#1a1d23] border border-gray-800 p-6 rounded-2xl text-center space-y-4 hover:border-amber-400/30 transition-colors">
              <div className="mx-auto w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-amber-400">
                {item.icon}
              </div>
              <h3 className="font-bold text-white">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Installation & Quick Access */}
      <section className="mt-20 bg-gradient-to-br from-[#1a1d23] to-[#0f1115] border border-gray-800 rounded-3xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 rounded-full border border-amber-400/20 text-amber-400 text-xs font-mono uppercase tracking-widest">
              <Download className="w-3 h-3" /> Quick Access
            </div>
            <h2 className="text-3xl font-display font-bold text-white">How to Install & Use as a Tool</h2>
            <p className="text-gray-400">Access the Morse Code Translator instantly on any device without traditional app store downloads.</p>
            <div className="space-y-4">
              {[
                "Visit this website in your preferred browser.",
                "Tap the 'Share' or 'Menu' icon in your browser.",
                "Select 'Add to Home Screen' for a PWA experience.",
                "Launch the tool anytime from your app drawer."
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-sm text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-xs font-mono text-gray-500 uppercase">Developer Access</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('https://morse-code-translator.wwkejishe.top/');
                }}
                className="text-[10px] font-mono text-amber-400 hover:underline active:opacity-50 transition-opacity"
              >
                Copy URL
              </button>
            </div>
            <code className="block text-sm text-amber-400 font-mono bg-black/30 p-4 rounded-lg break-all">
              https://morse-code-translator.wwkejishe.top/
            </code>
            <p className="text-[10px] text-gray-500 italic">Tip: Bookmark this URL for instant offline-capable access in supported browsers.</p>
          </div>
        </div>
      </section>

      {/* Usage Guide Section */}
      <section className="mt-20 space-y-12">
        <div className="flex items-center gap-3 text-amber-400">
          <PlayCircle className="w-6 h-6" />
          <h2 className="text-3xl font-display font-bold text-white">Usage Guide & Examples</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-white">1. Text to Morse</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Type any English sentence into the input box. The translator will automatically generate the corresponding dots and dashes in real-time.</p>
          </div>
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-white">2. Morse to Text</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Switch to Morse mode and use your keyboard or the on-screen telegraph key to input signals. Use spaces to separate letters and '/' for words.</p>
          </div>
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-white">3. Audio Playback</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Click the 'Play' button to hear the translation. Adjust the WPM (Words Per Minute) to practice at different speeds.</p>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Common Examples</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { text: "SOS", morse: "... --- ..." },
              { text: "Hello", morse: ".... . .-.. .-.. ---" },
              { text: "73", morse: "--... ...--" },
              { text: "88", morse: "---.. ---.." }
            ].map((ex, i) => (
              <div key={i} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div className="text-xs text-gray-500 mb-1 uppercase font-mono">{ex.text}</div>
                <div className="text-amber-400 font-mono font-bold">{ex.morse}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips & Best Practices */}
      <section className="mt-20 space-y-8">
        <div className="flex items-center gap-3 text-amber-400">
          <Zap className="w-6 h-6" />
          <h2 className="text-3xl font-display font-bold text-white">Tips & Best Practices</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-6 bg-[#1a1d23] border border-gray-800 rounded-2xl">
            <div className="shrink-0 w-10 h-10 bg-amber-400/10 rounded-lg flex items-center justify-center text-amber-400">
              <List className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-white">Focus on Rhythm</h3>
              <p className="text-sm text-gray-400">Don't count dots and dashes. Instead, try to memorize the "sound" or rhythm of each character. Think of 'A' as "di-dah" rather than "dot-dash".</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 bg-[#1a1d23] border border-gray-800 rounded-2xl">
            <div className="shrink-0 w-10 h-10 bg-amber-400/10 rounded-lg flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-white">Use Farnsworth Timing</h3>
              <p className="text-sm text-gray-400">Set the character speed high (20+ WPM) but increase the space between characters. This prevents your brain from translating and forces it to recognize sounds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pros & Cons Section */}
      <section className="mt-20 space-y-8">
        <h2 className="text-3xl font-display font-bold text-white text-center">Pros & Cons of Online Translators</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" /> Advantages
            </h3>
            <ul className="space-y-4">
              {[
                "Instant and accurate translation for all ITU characters.",
                "Real-time audio feedback helps with rhythm training.",
                "Completely free and accessible from any web browser.",
                "No software installation or account required.",
                "Visual flash indicator aids learning in noisy environments."
              ].map((pro, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
              <XCircle className="w-6 h-6" /> Disadvantages
            </h3>
            <ul className="space-y-4">
              {[
                "Requires an internet connection for initial access.",
                "May have slight audio latency on older browsers.",
                "Manual keying has a learning curve for beginners.",
                "Does not replace the tactile feel of a physical straight key.",
                "Limited support for non-standard prosigns."
              ].map((con, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
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
    </div>
  );
}
