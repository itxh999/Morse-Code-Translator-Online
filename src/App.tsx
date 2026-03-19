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
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');
  const [lastSymbol, setLastSymbol] = useState<string | null>(null);
  const [silenceProgress, setSilenceProgress] = useState(0); // 0 to 100
  
  const { playMorse, stopAudio, isPlaying, currentIndex } = useMorseAudio();
  const flashRef = useRef<HTMLDivElement>(null);
  const silenceTimeoutRef = useRef<any>(null);
  const wordSilenceTimeoutRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [morse, text]);

  const MORSE_REFERENCE = [
    { char: 'A', code: '.-', type: 'letter' }, { char: 'B', code: '-...', type: 'letter' }, { char: 'C', code: '-.-.', type: 'letter' },
    { char: 'D', code: '-..', type: 'letter' }, { char: 'E', code: '.', type: 'letter' }, { char: 'F', code: '..-.', type: 'letter' },
    { char: 'G', code: '--.', type: 'letter' }, { char: 'H', code: '....', type: 'letter' }, { char: 'I', code: '..', type: 'letter' },
    { char: 'J', code: '.---', type: 'letter' }, { char: 'K', code: '-.-', type: 'letter' }, { char: 'L', code: '.-..', type: 'letter' },
    { char: 'M', code: '--', type: 'letter' }, { char: 'N', code: '-.', type: 'letter' }, { char: 'O', code: '---', type: 'letter' },
    { char: 'P', code: '.--.', type: 'letter' }, { char: 'Q', code: '--.-', type: 'letter' }, { char: 'R', code: '.-.', type: 'letter' },
    { char: 'S', code: '...', type: 'letter' }, { char: 'T', code: '-', type: 'letter' }, { char: 'U', code: '..-', type: 'letter' },
    { char: 'V', code: '...-', type: 'letter' }, { char: 'W', code: '.--', type: 'letter' }, { char: 'X', code: '-..-', type: 'letter' },
    { char: 'Y', code: '-.--', type: 'letter' }, { char: 'Z', code: '--..', type: 'letter' },
    { char: '1', code: '.----', type: 'number' }, { char: '2', code: '..---', type: 'number' }, { char: '3', code: '...--', type: 'number' },
    { char: '4', code: '....-', type: 'number' }, { char: '5', code: '.....', type: 'number' }, { char: '6', code: '-....', type: 'number' },
    { char: '7', code: '--...', type: 'number' }, { char: '8', code: '---..', type: 'number' }, { char: '9', code: '----.', type: 'number' },
    { char: '0', code: '-----', type: 'number' },
    { char: '.', code: '.-.-.-', type: 'punctuation' }, { char: ',', code: '--..--', type: 'punctuation' }, { char: '?', code: '..--..', type: 'punctuation' },
    { char: "'", code: '.----.', type: 'punctuation' }, { char: '!', code: '-.-.--', type: 'punctuation' }, { char: '/', code: '-..-.', type: 'punctuation' },
    { char: '(', code: '-.--.', type: 'punctuation' }, { char: ')', code: '-.--.-', type: 'punctuation' }, { char: '&', code: '.-...', type: 'punctuation' },
    { char: ':', code: '---...', type: 'punctuation' }, { char: ';', code: '-.-.-.', type: 'punctuation' }, { char: '=', code: '-...-', type: 'punctuation' },
    { char: '+', code: '.-.-.', type: 'punctuation' }, { char: '-', code: '-....-', type: 'punctuation' }, { char: '_', code: '..--.-', type: 'punctuation' },
    { char: '"', code: '.-..-.', type: 'punctuation' }, { char: '$', code: '...-..-', type: 'punctuation' }, { char: '@', code: '.--.-.', type: 'punctuation' }
  ];

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

  const handleKeyDown = useCallback((e?: React.KeyboardEvent | React.MouseEvent | KeyboardEvent) => {
    if (isKeyDown) return;
    
    // Clear silence timeouts and progress immediately
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (wordSilenceTimeoutRef.current) clearTimeout(wordSilenceTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setSilenceProgress(0);
    
    setIsKeyDown(true);
    keyStartTime.current = Date.now();
    startTone();
  }, [isKeyDown, frequency]);

  const handleKeyUp = useCallback(() => {
    if (!isKeyDown) return;
    setIsKeyDown(false);
    stopTone();
    
    const duration = Date.now() - keyStartTime.current;
    const dotDuration = (1.2 / wpm) * 1000;
    
    // Manual keying threshold: humans are slower than machines.
    // We use a more generous threshold (at least 200ms) to prevent accidental dashes.
    const manualThreshold = Math.max(dotDuration * 2.2, 200); 
    const symbol = duration < manualThreshold ? '.' : '-';
    
    setLastSymbol(symbol);
    setTimeout(() => setLastSymbol(null), 200);

    // Auto-switch to morse-to-text if using the key
    if (activeTab !== 'morse-to-text') {
      setActiveTab('morse-to-text');
    }

    setMorse(prev => {
      const newMorse = prev + symbol;
      setText(morseToText(newMorse));
      return newMorse;
    });

    // Handle silence for auto-spacing with much more generous "human" timing
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (wordSilenceTimeoutRef.current) clearTimeout(wordSilenceTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    const charSilenceTime = dotDuration * 20; // 20 dots for character space (approx 1.2s at 20wpm)
    const wordSilenceTime = dotDuration * 45; // 45 dots for word space (approx 2.7s at 20wpm)
    const startTime = Date.now();

    // Visual progress update
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / wordSilenceTime) * 100, 100);
      setSilenceProgress(progress);
      if (progress >= 100) clearInterval(progressIntervalRef.current);
    }, 50);

    silenceTimeoutRef.current = setTimeout(() => {
      setMorse(prev => {
        if (prev.endsWith(' ') || prev.endsWith('/') || prev === '') return prev;
        // Visual feedback for space
        setLastSymbol('␣');
        setTimeout(() => setLastSymbol(null), 400);
        const newMorse = prev + ' ';
        setText(morseToText(newMorse));
        return newMorse;
      });
      
      wordSilenceTimeoutRef.current = setTimeout(() => {
        setMorse(prev => {
          if (prev.endsWith('/') || prev === '') return prev;
          // Visual feedback for word break
          setLastSymbol('/');
          setTimeout(() => setLastSymbol(null), 400);
          const newMorse = prev.trimEnd() + ' / ';
          setText(morseToText(newMorse));
          return newMorse;
        });
      }, wordSilenceTime - charSilenceTime);
    }, charSilenceTime);

  }, [isKeyDown, activeTab, wpm]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        // If we're in text-to-morse mode and typing in an input, let the spacebar work normally
        if (activeTab === 'text-to-morse' && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
          return;
        }
        
        // ALWAYS prevent default for spacebar to stop scrolling, even during repeat
        e.preventDefault();
        
        // Only trigger the telegraph key if it's the initial press
        if (!e.repeat) {
          handleKeyDown(e);
        }
      }
    };
    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        // Match the logic in KeyDown
        if (activeTab === 'text-to-morse' && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
          return;
        }
        e.preventDefault();
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
              onClick={() => { setShowSettings(!showSettings); setShowInfo(false); }}
              className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setShowInfo(!showInfo); setShowSettings(false); }}
              className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              title="Morse Code Reference"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modals Container */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-4 w-72 bg-[#1a1d23] border border-gray-800 rounded-2xl shadow-2xl p-6 z-50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="font-bold flex items-center gap-2"><Settings className="w-4 h-4" /> Quick Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white">×</button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Speed (WPM)</span>
                    <span className="text-amber-400">{wpm}</span>
                  </div>
                  <input type="range" min="5" max="50" value={wpm} onChange={(e) => setWpm(parseInt(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Frequency (Hz)</span>
                    <span className="text-amber-400">{frequency}</span>
                  </div>
                  <input type="range" min="300" max="1200" step="10" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} className="w-full accent-amber-400" />
                </div>
              </div>
            </motion.div>
          )}

          {showInfo && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-4 w-96 max-h-[80vh] overflow-auto bg-[#1a1d23] border border-gray-800 rounded-2xl shadow-2xl p-6 z-50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 sticky top-0 bg-[#1a1d23] z-10">
                <h3 className="font-bold flex items-center gap-2"><Info className="w-4 h-4" /> Morse Reference Guide</h3>
                <button onClick={() => setShowInfo(false)} className="text-gray-500 hover:text-white">×</button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Letters</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {MORSE_REFERENCE.filter(i => i.type === 'letter').map((item) => (
                      <div key={item.char} className="flex flex-col items-center p-2 bg-gray-900/50 rounded-lg border border-gray-800">
                        <span className="font-bold text-white text-lg">{item.char}</span>
                        <span className="font-mono text-amber-400 text-[10px]">{item.code}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Numbers</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {MORSE_REFERENCE.filter(i => i.type === 'number').map((item) => (
                      <div key={item.char} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg border border-gray-800">
                        <span className="font-bold text-white">{item.char}</span>
                        <span className="font-mono text-amber-400 text-xs">{item.code}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Punctuation</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {MORSE_REFERENCE.filter(i => i.type === 'punctuation').map((item) => (
                      <div key={item.char} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg border border-gray-800">
                        <span className="font-bold text-white">{item.char}</span>
                        <span className="font-mono text-amber-400 text-[10px]">{item.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                ref={inputRef}
                value={activeTab === 'text-to-morse' ? text : morse}
                onChange={activeTab === 'text-to-morse' ? handleTextChange : handleMorseChange}
                placeholder={activeTab === 'text-to-morse' ? "English to morse code translator..." : "Translate morse code to english..."}
                className="w-full h-64 bg-[#1a1d23] border border-gray-800 rounded-2xl p-6 font-mono text-lg focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 outline-none transition-all resize-none placeholder:text-gray-600 overflow-y-auto"
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
              <div 
                ref={outputRef}
                className="w-full h-64 bg-[#1a1d23]/50 border border-gray-800 rounded-2xl p-6 font-mono text-lg overflow-auto break-all text-amber-400/90 leading-relaxed relative"
              >
                <div className="relative z-10 whitespace-pre-wrap">
                  {activeTab === 'text-to-morse' ? (
                    morse ? (
                      morse.split('').map((char, idx) => (
                        <span 
                          key={idx} 
                          className={`transition-colors duration-75 ${currentIndex === idx ? 'bg-amber-400 text-black px-0.5 rounded shadow-[0_0_10px_rgba(251,191,36,0.5)]' : ''} ${char === ' ' ? 'inline-block w-2' : ''}`}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-700">Translate morse code results...</span>
                    )
                  ) : (
                    text || <span className="text-gray-700">Morse code translater results...</span>
                  )}
                  {/* Blinking Cursor */}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2.5 h-5 bg-amber-400 ml-1 align-middle"
                  />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2 z-20">
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
          <div className="md:col-span-2 bg-[#1a1d23] border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-10 overflow-hidden relative">
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="text-center space-y-2 relative z-10">
              <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 flex items-center justify-center gap-2">
                <Radio className="w-4 h-4" /> Telegraph Station
              </h3>
              <p className="text-xs text-gray-600 italic">"The world at your fingertips"</p>
            </div>
            
            {/* Mechanical Telegraph Key Visual */}
            <div className="relative flex flex-col items-center">
              {/* The Base Plate */}
              <div className="w-64 h-12 bg-stone-900 rounded-lg shadow-[0_10px_0_0_#0c0d0e,0_20px_30px_rgba(0,0,0,0.5)] border-t border-white/5 relative">
                {/* Screws on base */}
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-stone-700 shadow-inner" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-stone-700 shadow-inner" />
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-stone-700 shadow-inner" />
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-stone-700 shadow-inner" />
                
                {/* Pivot Support */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-12 h-8 bg-stone-800 rounded-t-md border-x border-t border-white/10 shadow-lg">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-2 bg-amber-600/80 rounded-full shadow-sm" /> {/* Brass pivot pin */}
                </div>
              </div>

              {/* The Lever Arm */}
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 origin-[50%_20px]"
                style={{ top: '-4px' }}
                animate={{ rotateX: isKeyDown ? 3 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {/* Arm Body */}
                <div className="w-4 h-40 bg-gradient-to-b from-stone-700 to-stone-800 rounded-full border-x border-white/5 shadow-xl relative">
                  {/* Brass weight/adjuster */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-4 bg-amber-600 rounded-sm shadow-md border-t border-white/20" />
                  
                  {/* The Knob (The actual button) */}
                  <button
                    onMouseDown={handleKeyDown}
                    onMouseUp={handleKeyUp}
                    onMouseLeave={handleKeyUp}
                    onTouchStart={handleKeyDown}
                    onTouchEnd={handleKeyUp}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-stone-950 shadow-[0_8px_0_0_#000,0_15px_25px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-[0_4px_0_0_#000,0_10px_15px_rgba(0,0,0,0.6)] transition-all flex items-center justify-center group z-20 overflow-hidden"
                  >
                    {/* Knob Texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
                    <Zap className={`w-8 h-8 transition-colors ${isKeyDown ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-stone-700 group-hover:text-stone-500'}`} />
                    
                    <AnimatePresence>
                      {lastSymbol && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1.2 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute inset-0 flex items-center justify-center font-mono font-bold text-amber-400 text-4xl pointer-events-none bg-black/40 backdrop-blur-[1px]"
                        >
                          {lastSymbol}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>

              {/* Progress Ring around the knob area */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none">
                <svg className="w-full h-full -rotate-90 opacity-20" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-600"
                  />
                  <motion.circle
                    cx="50" cy="50" r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="301.59"
                    animate={{ strokeDashoffset: 301.59 - (301.59 * silenceProgress) / 100 }}
                    className="text-amber-400"
                  />
                </svg>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="w-full max-w-xs space-y-3 relative z-10 mt-16">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block">Signal Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-75 ${isKeyDown ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)]' : 'bg-stone-800'}`} />
                    <span className={`text-[10px] font-mono ${isKeyDown ? 'text-amber-400' : 'text-gray-600'}`}>
                      {isKeyDown ? 'TRANSMITTING' : 'IDLE'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-gray-500">
                  {silenceProgress < 44 ? 'WAITING...' : silenceProgress < 100 ? 'CHAR BREAK' : 'WORD BREAK'}
                </span>
              </div>
              <div className="h-1 bg-stone-900 rounded-full overflow-hidden border border-white/5 relative">
                {/* Visual markers for thresholds */}
                <div className="absolute left-[44%] top-0 bottom-0 w-px bg-white/10 z-10" />
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                  animate={{ width: `${silenceProgress}%` }}
                />
              </div>
            </div>
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
                  <p className="text-xs text-gray-500">Learning at full speed (20+ WPM) from the start to build muscle memory and avoid "counting" dots and dashes.</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                  <h4 className="font-bold text-amber-400 text-sm mb-1">Farnsworth Timing</h4>
                  <p className="text-xs text-gray-500">Characters are sent at high speed, but the spacing between them is increased to give you time to process.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-[#1a1d23] p-6 rounded-2xl border border-gray-800">
              <h3 className="font-bold text-white mb-3">ITU Standard</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Our <strong>morse code translater</strong> follows the International Telecommunication Union (ITU) standard, ensuring compatibility with global signal protocols.
              </p>
            </div>
            <div className="bg-[#1a1d23] p-6 rounded-2xl border border-gray-800">
              <h3 className="font-bold text-white mb-3">SOS Signal</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                The most famous Morse code signal is SOS (<code>... --- ...</code>). It is a prosign used as a distress signal, chosen for its simplicity and distinctiveness.
              </p>
            </div>
            <div className="bg-[#1a1d23] p-6 rounded-2xl border border-gray-800">
              <h3 className="font-bold text-white mb-3">Real-time Audio</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Use our <strong>morse code translator audio</strong> feature to hear how each character sounds, which is essential for developing "ear copy" skills.
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
