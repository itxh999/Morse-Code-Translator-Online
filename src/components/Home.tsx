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
  ShieldCheck,
  Globe
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
          <h2 className="text-3xl font-display font-bold text-white">What is a Morse Code Translator?</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 leading-relaxed text-lg">
              A <strong>Morse Code Translator</strong> is an essential digital tool for anyone looking to convert text into the rhythmic language of dots and dashes. Our professional-grade <strong>morse code translator</strong> bridges the gap between 19th-century telegraphy and modern digital communication. Whether you're looking to send an SOS signal or simply curious about how "Hello" looks in code, this <strong>morse code translator</strong> provides instantaneous, accurate results for both encoding and decoding tasks.
            </p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 leading-relaxed text-lg">
              Our platform is more than just a basic <strong>morse code translator online</strong>; it's a comprehensive learning environment. By integrating high-fidelity audio synthesis and synchronized visual indicators, this <strong>morse code translator</strong> helps users master the timing and rhythm required for professional operation. Built strictly on the International Telecommunication Union (ITU) standards, our <strong>morse code translator</strong> ensures your messages are technically correct and globally recognized.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Our Tool */}
      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-display font-bold text-white">Why Use Our Morse Code Translator?</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">We've built the most reliable <strong>morse code translator</strong> on the web, focusing on precision, speed, and educational value.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "ITU Standard Accuracy", 
              desc: "Every translation performed by our <strong>morse code translator</strong> follows the strict ITU guidelines for timing and character representation.",
              icon: <ShieldCheck className="w-6 h-6" />
            },
            { 
              title: "Real-Time Audio & Visuals", 
              desc: "Hear the 'dits' and 'dahs' as you type. Our <strong>morse code translator</strong> provides multi-sensory feedback for better learning.",
              icon: <PlayCircle className="w-6 h-6" />
            },
            { 
              title: "Offline PWA Support", 
              desc: "Install this <strong>morse code translator</strong> on your device and use it even without an active internet connection.",
              icon: <Download className="w-6 h-6" />
            }
          ].map((feature, i) => (
            <div key={i} className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4 hover:border-amber-400/20 transition-all">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white" dangerouslySetInnerHTML={{ __html: feature.title }} />
              <p className="text-gray-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: feature.desc }} />
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-display font-bold text-white">Popular Use Cases for a Morse Code Translator</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">From hobbyists to professionals, a <strong>morse code translator</strong> serves a wide variety of practical and creative purposes.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { title: "Amateur Radio", icon: <Radio className="w-6 h-6" />, desc: "Essential for CW operations and Ham radio licensing." },
            { title: "Aviation", icon: <Plane className="w-6 h-6" />, desc: "Decoding navigational beacons and identification signals." },
            { title: "Maritime", icon: <Anchor className="w-6 h-6" />, desc: "Traditional ship-to-shore emergency communication." },
            { title: "Education", icon: <School className="w-6 h-6" />, desc: "Teaching STEM concepts and historical communication." },
            { title: "Emergency", icon: <ShieldCheck className="w-6 h-6" />, desc: "A reliable backup when modern networks fail." }
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
            <h2 className="text-3xl font-display font-bold text-white">How to Install This Morse Code Translator</h2>
            <p className="text-gray-400">You can use our <strong>morse code translator</strong> as a standalone app on your mobile or desktop for faster access.</p>
            <div className="space-y-4">
              {[
                "Open this <strong>morse code translator</strong> in your browser.",
                "Click the 'Add to Home Screen' or 'Install' prompt.",
                "The <strong>morse code translator</strong> will appear in your app list.",
                "Launch it anytime to translate text to morse code instantly."
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: step }} />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <span className="text-xs font-mono text-gray-500 uppercase">Direct Access URL</span>
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
            <p className="text-[10px] text-gray-500 italic">Bookmark our <strong>morse code translator</strong> for quick access during your practice sessions.</p>
          </div>
        </div>
      </section>

      {/* Usage Guide Section */}
      <section className="mt-20 space-y-12">
        <div className="flex items-center gap-3 text-amber-400">
          <PlayCircle className="w-6 h-6" />
          <h2 className="text-3xl font-display font-bold text-white">How to Use the Morse Code Translator</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-white">1. English to Morse</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Simply type your English text into the input field. Our <strong>morse code translator</strong> will convert it into dots and dashes in real-time as you type.</p>
          </div>
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-white">2. Morse to English</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Switch the mode and enter Morse code signals. The <strong>morse code translator</strong> will decode them into readable English text instantly.</p>
          </div>
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-white">3. Audio Practice</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Use the 'Play' button on our <strong>morse code translator</strong> to hear the rhythm. Adjust the WPM to match your current skill level.</p>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Morse Code Translator Examples</h3>
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

      {/* History Section */}
      <section className="mt-20 space-y-8">
        <div className="flex items-center gap-3 text-amber-400">
          <Info className="w-6 h-6" />
          <h2 className="text-3xl font-display font-bold text-white">The Comprehensive History of Morse Code</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 leading-relaxed">
              The story of Morse code is a saga of innovation that fundamentally changed how humanity communicates. While Samuel Morse is the name most associated with the invention, it was his partner <strong>Alfred Vail</strong> who developed the modern alphabetical system and the refined telegraph key. In the 1830s, the challenge wasn't just sending electricity through a wire, but creating a language that could survive the "noise" of long-distance transmission.
            </p>
            <p className="text-gray-400 leading-relaxed">
              The first official message, "What hath God wrought," sent in 1844, marked the beginning of the telecommunications age. Before the invention of a <strong>morse code translator</strong> like the one you see here, operators spent years mastering the "fist"—the unique rhythmic signature of a manual sender. This tool honors that legacy by providing a digital <strong>morse code translator</strong> that maintains the same timing principles used over a century ago.
            </p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 leading-relaxed">
              One of the most enduring myths is the origin of <strong>SOS</strong>. Contrary to popular belief, it does not stand for "Save Our Souls" or "Save Our Ship." It was chosen as the universal distress signal in 1906 because its rhythmic pattern (... --- ...) is unmistakable and easy to transmit even under heavy interference. The Titanic's use of SOS (alongside the older CQD signal) cemented its place in history.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Today, while digital satellites and fiber optics dominate, Morse code remains the only communication mode that can be understood by a human ear even when the signal is weaker than the background noise. This <strong>morse code translator online</strong> ensures that this vital skill remains accessible to a new generation of digital explorers.
            </p>
          </div>
        </div>
      </section>

      {/* The Science of Morse Code Timing */}
      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-display font-bold text-white">The Science of Morse Code Timing & Standards</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Understanding the mathematical precision behind a <strong>morse code translator</strong> is key to mastering the language.</p>
        </div>
        <div className="bg-[#1a1d23] border border-gray-800 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-amber-400 font-bold uppercase tracking-wider text-sm">The Unit System</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Everything in Morse code is based on the duration of a single <strong>Dot</strong>. 
                A <strong>Dash</strong> is exactly 3 units. The space between parts of a letter is 1 unit. 
                The space between letters is 3 units, and the space between words is 7 units. 
                Our <strong>morse code translator</strong> calculates these intervals with millisecond precision.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-amber-400 font-bold uppercase tracking-wider text-sm">The PARIS Standard</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                How do we measure WPM (Words Per Minute)? The industry standard uses the word <strong>"PARIS"</strong> as a benchmark. 
                Because "PARIS" is exactly 50 units long, a speed of 20 WPM means the <strong>morse code translator</strong> is sending 1,000 units per minute. 
                This ensures consistent speed regardless of the text complexity.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-amber-400 font-bold uppercase tracking-wider text-sm">ITU vs. American Morse</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                While there were once multiple versions, the <strong>International Morse Code (ITU)</strong> is the global standard used today. 
                Our <strong>morse code translator online</strong> uses the ITU-R M.1677-1 recommendation, ensuring your practice 
                is valid for modern Ham radio and maritime operations.
              </p>
            </div>
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

      {/* Learning Methods Section */}
      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-display font-bold text-white">Advanced Morse Code Learning Methodologies</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Don't just use a <strong>morse code translator</strong>—become the translator yourself using these proven techniques.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                <School className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">The Koch Method</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Developed by German psychologist Ludwig Koch, this method suggests learning at full speed (20+ WPM) from day one. 
              You start with just two characters (K and M) and only add a new one once you achieve 90% accuracy. 
              This prevents the "plateau" effect where learners get stuck at slow speeds. 
              Our <strong>morse code translator</strong> is perfect for verifying your progress as you add characters.
            </p>
          </div>
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">The Farnsworth Technique</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              This technique keeps the individual characters at a high speed but increases the spacing between them. 
              This forces your brain to recognize the "melody" of the letter rather than counting dots and dashes. 
              You can simulate this in our <strong>morse code translator</strong> by setting a high WPM and manually 
              pausing between words to give your mind time to process the signal.
            </p>
          </div>
        </div>
      </section>

      {/* Morse Code in Modern Technology */}
      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-display font-bold text-white">Morse Code in Modern Technology</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Despite the digital revolution, the <strong>morse code translator</strong> remains a vital tool in specialized fields.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Aviation Navigation</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Pilots use a <strong>morse code translator</strong> logic to identify VOR (VHF Omnidirectional Range) and NDB (Non-Directional Beacon) stations. 
              Each station transmits a unique 3-letter identifier in Morse code, allowing pilots to verify they are tuned to the correct frequency.
            </p>
          </div>
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400">
              <Anchor className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Maritime Safety</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              While GMDSS has replaced Morse for primary distress calls, signal lamps (Aldis lamps) are still used for ship-to-ship communication 
              when radio silence is required or during electronic interference. A <strong>morse code translator</strong> helps sailors maintain this skill.
            </p>
          </div>
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Assistive Technology</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              For individuals with severe motor disabilities, a <strong>morse code translator</strong> can be a life-changing communication tool. 
              By using simple switches or eye-tracking, users can input Morse code to generate speech or control computers.
            </p>
          </div>
        </div>
      </section>

      {/* Punctuation & Special Characters */}
      <section className="mt-20 space-y-8">
        <div className="flex items-center gap-3 text-amber-400">
          <List className="w-6 h-6" />
          <h2 className="text-3xl font-display font-bold text-white">Morse Code Punctuation & Prosigns</h2>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Common Punctuation</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { char: "Period (.)", code: ".-.-.-" },
                  { char: "Comma (,)", code: "--..--" },
                  { char: "Question (?)", code: "..--.." },
                  { char: "Slash (/)", code: "-..-." },
                  { char: "At (@)", code: ".--.-." },
                  { char: "Equal (=)", code: "-...-" }
                ].map((p, i) => (
                  <div key={i} className="flex justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <span className="text-gray-400 text-sm">{p.char}</span>
                    <span className="text-amber-400 font-mono font-bold">{p.code}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Essential Prosigns</h3>
              <p className="text-sm text-gray-400">Prosigns are special signals used to manage a conversation. Our <strong>morse code translator</strong> supports these common procedural signals:</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Over (K)", code: "-.-", desc: "Invitation to transmit" },
                  { name: "End of Msg (AR)", code: ".-.-.", desc: "Message complete" },
                  { name: "Wait (AS)", code: ".-...", desc: "Please stand by" },
                  { name: "Error (........)", code: "........", desc: "Correction follows" },
                  { name: "Roger (R)", code: ".-.", desc: "Received OK" },
                  { name: "End of Contact (SK)", code: "...-.-", desc: "Final sign-off" }
                ].map((p, i) => (
                  <div key={i} className="flex flex-col p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-xs font-bold">{p.name}</span>
                      <span className="text-amber-400 font-mono font-bold">{p.code}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Practice at Home */}
      <section className="mt-20 space-y-8">
        <div className="flex items-center gap-3 text-amber-400">
          <Zap className="w-6 h-6" />
          <h2 className="text-3xl font-display font-bold text-white">How to Practice Morse Code at Home</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 leading-relaxed">
              Learning Morse code is like learning a musical instrument. It requires consistent, short practice sessions. 
              Instead of one long session, try practicing for 15 minutes twice a day. 
              Use our <strong>morse code translator</strong> to generate random words and try to decode them by ear before looking at the screen.
            </p>
            <ul className="text-gray-400 space-y-2">
              <li><strong>Listen First</strong>: Don't look at a chart. Use our <strong>morse code translator</strong> audio to build a mental map of sounds.</li>
              <li><strong>Copy in Your Head</strong>: Try to recognize characters without writing them down immediately.</li>
              <li><strong>Say it Out Loud</strong>: Use "dit" and "dah" to vocalize the patterns.</li>
              <li><strong>Find a Buddy</strong>: Practice sending and receiving with a friend using our <strong>morse code translator online</strong>.</li>
            </ul>
          </div>
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6">Daily Practice Routine</h3>
            <div className="space-y-4">
              {[
                { time: "5 Mins", activity: "Review 5 new characters using the <strong>morse code translator</strong>." },
                { time: "5 Mins", activity: "Listen to a 15 WPM stream and try to catch familiar letters." },
                { time: "5 Mins", activity: "Practice sending common phrases like 'Hello' or '73'." }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <div className="text-amber-400 font-bold font-mono text-sm shrink-0">{item.time}</div>
                  <p className="text-xs text-gray-400" dangerouslySetInnerHTML={{ __html: item.activity }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-20 space-y-8">
        <div className="flex items-center gap-3 text-amber-400">
          <Globe className="w-6 h-6" />
          <h2 className="text-3xl font-display font-bold text-white">Morse Code in Popular Culture</h2>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 leading-relaxed text-lg">
            Morse code has a unique place in movies and music, often used as a hidden "Easter egg" for those who know the language. 
            From the rhythmic opening of <strong>Rush's "YYZ"</strong> (which spells out the airport code for Toronto in Morse) 
            to the critical plot point in <strong>Interstellar</strong>, where a watch transmits data across time, 
            the language of dots and dashes adds a layer of mystery and technical realism. 
            Even the original Nokia SMS tone was actually the Morse code for "S-M-S". 
            Using a <strong>morse code translator</strong>, fans often decode these hidden messages to find secrets left by creators.
          </p>
        </div>
      </section>
      <section className="mt-20 space-y-8">
        <h2 className="text-3xl font-display font-bold text-white text-center">Pros & Cons of Using a Morse Code Translator Online</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" /> Why Use a Morse Code Translator?
            </h3>
            <ul className="space-y-4">
              {[
                "Instant and accurate translation for all ITU characters.",
                "Real-time audio feedback from our <strong>morse code translator</strong> helps with rhythm.",
                "Completely free <strong>morse code translator online</strong> with no hidden costs.",
                "No software installation required to use this <strong>morse code translator</strong>.",
                "Visual flash indicator in our <strong>morse code translator</strong> aids learning."
              ].map((pro, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: pro }} />
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
              <XCircle className="w-6 h-6" /> Limitations of a Morse Code Translator
            </h3>
            <ul className="space-y-4">
              {[
                "Requires an internet connection for the initial <strong>morse code translator</strong> load.",
                "Audio latency might occur on very old devices using a <strong>morse code translator</strong>.",
                "Manual keying in a <strong>morse code translator</strong> has a learning curve.",
                "A digital <strong>morse code translator</strong> lacks the tactile feel of a physical key.",
                "Limited support for obscure non-standard prosigns in most <strong>morse code translators</strong>."
              ].map((con, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: con }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-20 bg-[#1a1d23] border border-gray-800 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-display font-bold text-white mb-12 text-center">Morse Code Translator FAQ: Everything You Need to Know</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { 
              q: "How do I translate morse code to english?", 
              a: "Simply switch to the 'Morse Code to English' tab on our <strong>morse code translator</strong> and enter your dots (.) and dashes (-). Use a single space between letters and a forward slash (/) or double space between words. The tool will decode it in real-time." 
            },
            { 
              q: "Is this morse code translator online free?", 
              a: "Yes, our <strong>morse code translator</strong> website is 100% free to use. We believe in keeping this historical communication method accessible to everyone for educational and hobbyist purposes." 
            },
            { 
              q: "What is the best way to learn Morse code?", 
              a: "Most experts recommend the <strong>Koch Method</strong> combined with <strong>Farnsworth timing</strong>. Start by listening to characters at high speeds (20 WPM) so you learn the sound patterns rather than counting dots. Use our <strong>morse code translator</strong> to check your accuracy." 
            },
            { 
              q: "Does SOS stand for Save Our Souls?", 
              a: "No, SOS is a 'prosign' chosen because its Morse pattern (... --- ...) is unique and easy to recognize. It was never intended to be an acronym, though 'Save Our Souls' became a popular backronym later." 
            },
            { 
              q: "Can I use a morse code translator for Ham radio?", 
              a: "While a <strong>morse code translator</strong> is great for learning and verifying, Ham radio operators are encouraged to decode by ear. However, our tool is an excellent way to practice CW (Continuous Wave) reception and sending." 
            },
            { 
              q: "How long does it take to learn Morse code?", 
              a: "With consistent practice using a <strong>morse code translator online</strong>, most people can learn the alphabet in a few days. Achieving a conversational speed of 15-20 WPM typically takes 3 to 6 months of daily practice." 
            },
            { 
              q: "Is Morse code still used today?", 
              a: "Yes! While no longer required for commercial shipping, it is widely used by <strong>Amateur Radio</strong> enthusiasts, in some aviation navigation (NDBs), and as an assistive communication technology for people with disabilities." 
            },
            { 
              q: "What is the difference between a dot and a dash?", 
              a: "In a <strong>morse code translator</strong>, a dot (dit) is the basic unit of time. A dash (dah) is exactly three times longer than a dot. The timing between these elements is what defines the character." 
            },
            { 
              q: "Can I translate Morse code audio with this tool?", 
              a: "Currently, our <strong>morse code translator</strong> converts text to audio and text to Morse. For decoding live audio, you would need a specialized signal processor, but you can manually input the sounds you hear into our decoder." 
            },
            { 
              q: "Is there a Morse code for emojis?", 
              a: "Standard Morse code only covers the Latin alphabet, numbers, and basic punctuation. There are no official ITU codes for emojis, though some hobbyists have proposed unofficial extensions." 
            }
          ].map((faq, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-lg font-bold text-amber-400 flex items-start gap-3">
                <span className="text-gray-400">Q:</span> {faq.q}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed pl-8" dangerouslySetInnerHTML={{ __html: faq.a }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
