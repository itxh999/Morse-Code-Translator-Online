import React, { useState } from 'react';
import { Radio, Settings, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
}

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

export default function Layout({ children }: LayoutProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100 font-sans selection:bg-amber-400/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#15181e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Radio className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">Morse Code Translator Online</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Professional Morse Code Website</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              title="Morse Code Reference"
              aria-label="Open Morse Code Reference"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Modal Container */}
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-4 w-96 max-h-[80vh] overflow-auto bg-[#1a1d23] border border-gray-800 rounded-2xl shadow-2xl p-6 z-50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 sticky top-0 bg-[#1a1d23] z-10">
                <h3 className="font-bold flex items-center gap-2"><Info className="w-4 h-4" /> Morse Reference Guide</h3>
                <button onClick={() => setShowInfo(false)} className="text-gray-500 hover:text-white text-xl" aria-label="Close Reference Guide">
                  <X className="w-5 h-5" />
                </button>
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
        {children}
      </main>

      <footer className="mt-20 border-t border-gray-800 py-8 bg-[#0a0c10]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">© 2026 Morse Code Translator Website. Professional Signal Tools.</p>
          <div className="flex gap-6">
            <Link to="/" className="text-gray-400 hover:text-amber-400 text-xs transition-colors">Home</Link>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-xs transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
