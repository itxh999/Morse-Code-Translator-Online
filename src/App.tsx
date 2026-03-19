import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Download, 
  Copy, 
  Trash2, 
  Settings, 
  Info,
  Zap,
  Keyboard,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { textToMorse, morseToText } from './services/morseUtils';
import { useMorseAudio } from './hooks/useMorseAudio';

export default function App() {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');
  
  const { playMorse, stopAudio, isPlaying, currentIndex } = useMorseAudio();
  const flashRef = useRef<HTMLDivElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setMorse(textToMorse(val));
  };

  const handleMorseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    // Only allow . - / and space
    const sanitized = val.replace(/[^.\-\/ ]/g, '');
    setMorse(sanitized);
    setText(morseToText(sanitized));
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could add a toast here
  };

  const clearAll = () => {
    setText('');
    setMorse('');
    stopAudio();
  };

  const handlePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playMorse(morse, wpm, frequency, (active) => setIsFlashing(active));
    }
  };

  // Virtual Key Logic
  const [isKeyDown, setIsKeyDown] = useState(false);
  const keyStartTime = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startTone = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    oscRef.current = ctx.createOscillator();
    gainRef.current = ctx.createGain();
    oscRef.current.type = 'sine';
    oscRef.current.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainRef.current.gain.setValueAtTime(0, ctx.currentTime);
    gainRef.current.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.005);
    
    oscRef.current.connect(gainRef.current);
    gainRef.current.connect(ctx.destination);
    oscRef.current.start();
    setIsFlashing(true);
  };

  const stopTone = () => {
    if (oscRef.current && gainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.005);
      oscRef.current.stop(ctx.currentTime + 0.01);
      oscRef.current = null;
    }
    setIsFlashing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (isKeyDown) return;
    setIsKeyDown(true);
    keyStartTime.current = Date.now();
    startTone();
  };

  const handleKeyUp = useCallback(() => {
    if (!isKeyDown) return;
    setIsKeyDown(false);
    stopTone();
    const duration = Date.now() - keyStartTime.current;
    const dotThreshold = 1.2 / wpm * 1000 * 1.5; // Heuristic for manual keying
    const symbol = duration < dotThreshold ? '.' : '-';
    
    if (activeTab === 'morse-to-text') {
      setMorse(prev => {
        const newMorse = prev + symbol;
        setText(morseToText(newMorse));
        return newMorse;
      });
    }
  }, [isKeyDown, activeTab, wpm]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handleKeyDown(e as any);
      }
    };
    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleKeyUp();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100 font-sans selection:bg-amber-400/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#15181e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Radio className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">Morse Code Translator Online</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Professional Morse Code Website</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Flash Indicator */}
        <div className="mb-8 flex justify-center">
          <div 
            className={`w-full max-w-2xl h-2 rounded-full transition-all duration-75 ${isFlashing ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'bg-gray-800'}`}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800">
                <button 
                  onClick={() => setActiveTab('text-to-morse')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'text-to-morse' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  English to Morse Code
                </button>
                <button 
                  onClick={() => setActiveTab('morse-to-text')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'morse-to-text' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Morse Code to English
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={clearAll} className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Clear All">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={activeTab === 'text-to-morse' ? text : morse}
                onChange={activeTab === 'text-to-morse' ? handleTextChange : handleMorseChange}
                placeholder={activeTab === 'text-to-morse' ? "English to morse code translator..." : "Translate morse code to english..."}
                className="w-full h-64 bg-[#1a1d23] border border-gray-800 rounded-2xl p-6 font-mono text-lg focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 outline-none transition-all resize-none placeholder:text-gray-600"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={() => copyToClipboard(activeTab === 'text-to-morse' ? text : morse)}
                  className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all border border-gray-700/50"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Output Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-mono uppercase tracking-widest text-gray-500">Translation Output</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handlePlay}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium transition-all ${isPlaying ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-amber-400 text-black hover:bg-amber-300'}`}
                >
                  {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  {isPlaying ? 'Stop Audio' : 'Morse Code Translator Audio'}
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="w-full h-64 bg-[#1a1d23]/50 border border-gray-800 rounded-2xl p-6 font-mono text-lg overflow-auto break-all text-amber-400/90 leading-relaxed">
                {activeTab === 'text-to-morse' ? (
                  morse ? (
                    morse.split('').map((char, idx) => (
                      <span 
                        key={idx} 
                        className={`transition-colors duration-75 ${currentIndex === idx ? 'bg-amber-400 text-black px-0.5 rounded shadow-[0_0_10px_rgba(251,191,36,0.5)]' : ''}`}
                      >
                        {char}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-700">Translate morse code results...</span>
                  )
                ) : (
                  text || <span className="text-gray-700">Morse code translater results...</span>
                )}
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={() => copyToClipboard(activeTab === 'text-to-morse' ? morse : text)}
                  className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all border border-gray-700/50"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Manual Key & Controls */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-[#1a1d23] border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-6">
            <div className="text-center space-y-2">
              <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 flex items-center justify-center gap-2">
                <Keyboard className="w-4 h-4" /> Morse Code Translater Key
              </h3>
              <p className="text-xs text-gray-600">Manual input for english to morse code translator</p>
            </div>
            
            <button
              onMouseDown={handleKeyDown}
              onMouseUp={handleKeyUp}
              onMouseLeave={handleKeyUp}
              onTouchStart={handleKeyDown}
              onTouchEnd={handleKeyUp}
              className={`w-32 h-32 rounded-full border-4 transition-all flex items-center justify-center group ${isKeyDown ? 'bg-amber-400 border-amber-300 scale-95 shadow-[0_0_30px_rgba(251,191,36,0.4)]' : 'bg-gray-800 border-gray-700 hover:border-gray-600 active:scale-95'}`}
            >
              <Zap className={`w-12 h-12 transition-colors ${isKeyDown ? 'text-black' : 'text-gray-600 group-hover:text-gray-400'}`} />
            </button>
          </div>

          <div className="bg-[#1a1d23] border border-gray-800 rounded-2xl p-8 space-y-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Signal Settings
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs text-gray-400">Speed (WPM)</label>
                  <span className="text-xs font-mono text-amber-400">{wpm}</span>
                </div>
                <input 
                  type="range" min="5" max="50" value={wpm} 
                  onChange={(e) => setWpm(parseInt(e.target.value))}
                  className="w-full accent-amber-400 bg-gray-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs text-gray-400">Frequency (Hz)</label>
                  <span className="text-xs font-mono text-amber-400">{frequency}</span>
                </div>
                <input 
                  type="range" min="300" max="1200" step="10" value={frequency} 
                  onChange={(e) => setFrequency(parseInt(e.target.value))}
                  className="w-full accent-amber-400 bg-gray-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex flex-col gap-2">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors text-gray-300">
                <Download className="w-4 h-4" /> Export as Audio
              </button>
            </div>
          </div>
        </div>

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
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
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
                  <span className="text-gray-600">Q:</span> {faq.q}
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
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold text-white">What is Morse Code?</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Morse code is a method used in telecommunication to encode text characters as standardized sequences of two different signal durations, called dots and dashes. Named after Samuel Morse, an inventor of the telegraph. Our <strong>morse code translater</strong> follows the ITU standards.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold text-white">ITU Standard</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                The International Morse Code encodes the 26 Latin letters A through Z, one non-Latin letter, the Arabic numerals and a small set of punctuation and procedural signals (prosigns). This <strong>morse code translator online</strong> tool is perfect for learning these standards.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold text-white">How to Use</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Type your message in the text area to see the real-time Morse translation. Use the "Play Audio" button to hear the signal, or use the telegraph key to manually input code. Our <strong>english to morse code translator</strong> makes it easy to <strong>translate morse code</strong>.
              </p>
            </div>
          </div>
        </article>
      </main>

      <footer className="mt-20 border-t border-gray-800 py-8 bg-[#0a0c10]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© 2026 Morse Code Translator Website. Professional Signal Tools.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-amber-400 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-amber-400 text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-amber-400 text-xs transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
