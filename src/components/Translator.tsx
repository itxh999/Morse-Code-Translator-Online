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
  Zap,
  Keyboard,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { textToMorse, morseToText } from '../services/morseUtils';
import { useMorseAudio } from '../hooks/useMorseAudio';

interface TranslatorProps {
  initialText?: string;
  initialMorse?: string;
  wpm: number;
  setWpm: (wpm: number) => void;
  frequency: number;
  setFrequency: (freq: number) => void;
}

export default function Translator({ initialText = '', initialMorse = '', wpm, setWpm, frequency, setFrequency }: TranslatorProps) {
  const [text, setText] = useState(initialText);
  const [morse, setMorse] = useState(initialMorse || textToMorse(initialText));
  const [isFlashing, setIsFlashing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');
  const [lastSymbol, setLastSymbol] = useState<string | null>(null);
  const [silenceProgress, setSilenceProgress] = useState(0); // 0 to 100
  const [isTelegraphFocused, setIsTelegraphFocused] = useState(false);
  
  const { playMorse, stopAudio, isPlaying, currentIndex } = useMorseAudio();
  const silenceTimeoutRef = useRef<any>(null);
  const wordSilenceTimeoutRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      setMorse(textToMorse(initialText));
    } else if (initialMorse) {
      setMorse(initialMorse);
      setText(morseToText(initialMorse));
    }
  }, [initialText, initialMorse]);

  // Auto-scroll effect
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [morse, text]);

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
    
    const manualThreshold = Math.max(dotDuration * 2.2, 200); 
    const symbol = duration < manualThreshold ? '.' : '-';
    
    setLastSymbol(symbol);
    setTimeout(() => setLastSymbol(null), 200);

    if (activeTab !== 'morse-to-text') {
      setActiveTab('morse-to-text');
    }

    setMorse(prev => {
      const newMorse = prev + symbol;
      setText(morseToText(newMorse));
      return newMorse;
    });

    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (wordSilenceTimeoutRef.current) clearTimeout(wordSilenceTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    const charSilenceTime = dotDuration * 20; 
    const wordSilenceTime = dotDuration * 45; 
    const startTime = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / wordSilenceTime) * 100, 100);
      setSilenceProgress(progress);
      if (progress >= 100) clearInterval(progressIntervalRef.current);
    }, 50);

    silenceTimeoutRef.current = setTimeout(() => {
      setMorse(prev => {
        if (prev.endsWith(' ') || prev.endsWith('/') || prev === '') return prev;
        setLastSymbol('␣');
        setTimeout(() => setLastSymbol(null), 400);
        const newMorse = prev + ' ';
        setText(morseToText(newMorse));
        return newMorse;
      });
      
      wordSilenceTimeoutRef.current = setTimeout(() => {
        setMorse(prev => {
          if (prev.endsWith('/') || prev === '') return prev;
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
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable;

      if (e.code === 'Space') {
        if (isInput) return;
        if (activeTab === 'morse-to-text' && isTelegraphFocused) {
          e.preventDefault();
          if (!e.repeat) {
            handleKeyDown(e);
          }
        }
      }
    };
    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        const isInput = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable;
        if (isInput) return;
        if (activeTab === 'morse-to-text' && isTelegraphFocused) {
          e.preventDefault();
          handleKeyUp();
        }
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const telegraphContainer = document.getElementById('telegraph-station');
      if (telegraphContainer?.contains(target)) {
        setIsTelegraphFocused(true);
      } else {
        setIsTelegraphFocused(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [handleKeyDown, handleKeyUp, activeTab, isTelegraphFocused]);

  return (
    <>
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
            <div className="flex items-center gap-3">
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
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={clearAll} 
                className="p-3 text-gray-500 hover:text-red-400 transition-colors" 
                title="Clear All"
                aria-label="Clear all input and output"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative group">
            <label htmlFor="morse-input" className="sr-only">
              {activeTab === 'text-to-morse' ? 'English text to translate' : 'Morse code to translate'}
            </label>
            <textarea
              id="morse-input"
              ref={inputRef}
              value={activeTab === 'text-to-morse' ? text : morse}
              onChange={activeTab === 'text-to-morse' ? handleTextChange : handleMorseChange}
              onFocus={() => setIsTelegraphFocused(false)}
              placeholder={activeTab === 'text-to-morse' ? "English to morse code translator..." : "Translate morse code to english..."}
              className="w-full h-64 bg-[#1a1d23] border border-gray-800 rounded-2xl p-6 font-mono text-lg focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 outline-none transition-all resize-none placeholder:text-gray-600 overflow-y-auto"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={() => copyToClipboard(activeTab === 'text-to-morse' ? text : morse)}
                className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all border border-gray-700/50"
                aria-label="Copy input text"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Output Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-mono uppercase tracking-widest text-gray-400">Translation Output</h2>
            <div className="flex gap-2">
              <button 
                onClick={handlePlay}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${isPlaying ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-amber-400 text-black hover:bg-amber-300'}`}
                aria-label={isPlaying ? 'Stop Audio' : 'Play Morse Code Audio'}
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
                    <span className="text-gray-500">Translate morse code results...</span>
                  )
                ) : (
                  text || <span className="text-gray-500">Morse code translater results...</span>
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
                className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all border border-gray-700/50"
                aria-label="Copy translation output"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Manual Key & Controls */}
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        <div 
          id="telegraph-station"
          className={`md:col-span-2 bg-[#1a1d23] border-2 rounded-2xl p-8 flex flex-col items-center justify-center gap-10 overflow-hidden relative transition-all duration-300 ${isTelegraphFocused ? 'border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.1)] ring-1 ring-amber-400/20' : 'border-gray-800'}`}
        >
          {/* Focus Indicator */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isTelegraphFocused ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-gray-700'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-widest ${isTelegraphFocused ? 'text-emerald-500' : 'text-gray-600'}`}>
                {isTelegraphFocused ? 'Telegraph Active' : 'Station Standby'}
              </span>
            </div>
            {isTelegraphFocused && <div className="h-3 w-[1px] bg-gray-800" />}
            {isTelegraphFocused && <span className="text-[9px] text-gray-500 font-mono italic animate-pulse">[Spacebar to Transmit]</span>}
          </div>

          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="text-center space-y-2 relative z-10">
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 flex items-center justify-center gap-2">
              <Radio className="w-4 h-4" /> Telegraph Station
            </h3>
            <p className="text-xs text-gray-600 italic">"The world at your fingertips"</p>
          </div>
          
          <div className="relative flex flex-col items-center">
            <div className="w-64 h-12 bg-stone-900 rounded-lg shadow-[0_10px_0_0_#0c0d0e,0_20px_30px_rgba(0,0,0,0.5)] border-t border-white/5 relative">
              <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-stone-700 shadow-inner" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-stone-700 shadow-inner" />
              <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-stone-700 shadow-inner" />
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-stone-700 shadow-inner" />
              <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-12 h-8 bg-stone-800 rounded-t-md border-x border-t border-white/10 shadow-lg">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-2 bg-amber-600/80 rounded-full shadow-sm" />
              </div>
            </div>

            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 origin-[50%_20px]"
              style={{ top: '-4px' }}
              animate={{ rotateX: isKeyDown ? 3 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <div className="w-4 h-40 bg-gradient-to-b from-stone-700 to-stone-800 rounded-full border-x border-white/5 shadow-xl relative">
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-4 bg-amber-600 rounded-sm shadow-md border-t border-white/20" />
                <button
                  onMouseDown={handleKeyDown}
                  onMouseUp={handleKeyUp}
                  onMouseLeave={handleKeyUp}
                  onTouchStart={handleKeyDown}
                  onTouchEnd={handleKeyUp}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-stone-950 shadow-[0_8px_0_0_#000,0_15px_25px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-[0_4px_0_0_#000,0_10px_15px_rgba(0,0,0,0.6)] transition-all flex items-center justify-center group z-20 overflow-hidden"
                  aria-label="Telegraph key - press to transmit morse code"
                >
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

            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none">
              <svg className="w-full h-full -rotate-90 opacity-20" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-600" />
                <motion.circle
                  cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="301.59"
                  animate={{ strokeDashoffset: 301.59 - (301.59 * silenceProgress) / 100 }}
                  className="text-amber-400"
                />
              </svg>
            </div>
          </div>
          
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
              <div className="absolute left-[44%] top-0 bottom-0 w-px bg-white/10 z-10" />
              <motion.div className="h-full bg-gradient-to-r from-amber-600 to-amber-400" animate={{ width: `${silenceProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1d23] border border-gray-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Signal Settings
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="speed-range" className="text-xs text-gray-400">Speed (WPM)</label>
                <span className="text-xs font-mono text-amber-400">{wpm}</span>
              </div>
              <input 
                id="speed-range"
                type="range" min="5" max="50" value={wpm} 
                onChange={(e) => setWpm(parseInt(e.target.value))}
                className="w-full accent-amber-400 bg-gray-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="freq-range" className="text-xs text-gray-400">Frequency (Hz)</label>
                <span className="text-xs font-mono text-amber-400">{frequency}</span>
              </div>
              <input 
                id="freq-range"
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
    </>
  );
}
