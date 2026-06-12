import React, { useState, useRef, useEffect } from 'react';
import { Radio, Settings, Info, X, Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedLanguage, LANGUAGES, TRANSLATIONS } from '../constants/translations';

interface LayoutProps {
  children: React.ReactNode;
  lang: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
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

export default function Layout({ children, lang, changeLanguage }: LayoutProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  
  const textDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const currentLangConfig = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100 font-sans selection:bg-amber-400/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#15181e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={`/?lang=${lang}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Radio className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm sm:text-xl font-display font-bold tracking-tight">
                {textDict.logoTitle}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                {textDict.logoSub}
              </p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Elegant Language Selector */}
            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-gray-800 hover:border-amber-400/35 rounded-xl text-xs sm:text-sm text-gray-300 font-mono transition-all outline-none"
                aria-label="Select website language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{currentLangConfig.localName}</span>
                <span>{currentLangConfig.flag}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1a1d23] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                  >
                    <div className="p-2 border-b border-gray-800 bg-gray-900/30">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-2">Select Language</span>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      {LANGUAGES.map((item) => (
                        <a
                          key={item.code}
                          href={`?lang=${item.code}`}
                          onClick={(e) => {
                            e.preventDefault();
                            changeLanguage(item.code);
                            setShowLangMenu(false);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 text-xs font-mono rounded-lg transition-colors ${
                            lang === item.code 
                              ? 'bg-amber-400/10 text-white font-bold' 
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{item.flag}</span>
                            <span>{item.localName}</span>
                          </span>
                          <span className="text-[9px] text-gray-600 uppercase">{item.code}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reference Button */}
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              title={textDict.referenceTitle}
              aria-label={textDict.referenceTitle}
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
                <h3 className="font-bold flex items-center gap-2">
                  <Info className="w-4 h-4" /> {textDict.referenceTitle}
                </h3>
                <button onClick={() => setShowInfo(false)} className="text-gray-500 hover:text-white text-xl" aria-label="Close Reference Guide">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
                    {textDict.letters}
                  </h4>
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
                  <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
                    {textDict.numbers}
                  </h4>
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
                  <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
                    {textDict.punctuation}
                  </h4>
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
          <p className="text-gray-400 text-xs">
            © 2026 {textDict.logoTitle}. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link to={`/?lang=${lang}`} className="text-gray-400 hover:text-amber-400 text-xs transition-colors">
              {textDict.home}
            </Link>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-xs transition-colors">{textDict.privacy}</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-xs transition-colors">{textDict.terms}</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 text-xs transition-colors">{textDict.contact}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

