import React, { useState, useRef, useEffect } from 'react';
import { X, Download, RefreshCw, Palette, Layout, Check, Share2, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';

interface ImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  morse: string;
}

type Theme = 'classic' | 'neon' | 'paper' | 'blueprint' | 'minimal';

interface ThemeConfig {
  name: string;
  bg: string;
  accent: string;
  text: string;
  secondary: string;
  fontMain: string;
  fontMorse: string;
  qrColor: string;
  qrBg: string;
}

const THEMES: Record<Theme, ThemeConfig> = {
  classic: {
    name: 'Classic Telegraph',
    bg: '#0f172a', // slate-900
    accent: '#fbbf24', // amber-400
    text: '#fbbf24',
    secondary: 'rgba(255, 255, 255, 0.3)',
    fontMain: 'bold 120px "Inter", sans-serif',
    fontMorse: '600 80px "Courier New", monospace',
    qrColor: '#fbbf24',
    qrBg: 'transparent'
  },
  neon: {
    name: 'Midnight Neon',
    bg: '#000000',
    accent: '#ff00ff', // fuchsia
    text: '#00ffff', // cyan
    secondary: 'rgba(255, 0, 255, 0.4)',
    fontMain: 'bold 130px "Inter", sans-serif',
    fontMorse: 'bold 85px "Courier New", monospace',
    qrColor: '#00ffff',
    qrBg: 'transparent'
  },
  paper: {
    name: 'Vintage Paper',
    bg: '#f5f5dc', // beige
    accent: '#4a3728', // dark brown
    text: '#2c1e12',
    secondary: 'rgba(74, 55, 40, 0.4)',
    fontMain: 'italic bold 110px "Georgia", serif',
    fontMorse: '700 75px "Courier New", monospace',
    qrColor: '#4a3728',
    qrBg: 'transparent'
  },
  blueprint: {
    name: 'Technical Blueprint',
    bg: '#003366', // navy
    accent: '#ffffff',
    text: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.2)',
    fontMain: 'bold 115px "monospace"',
    fontMorse: '500 80px "monospace"',
    qrColor: '#ffffff',
    qrBg: 'transparent'
  },
  minimal: {
    name: 'Modern Minimal',
    bg: '#ffffff',
    accent: '#000000',
    text: '#000000',
    secondary: 'rgba(0, 0, 0, 0.1)',
    fontMain: '300 140px "Inter", sans-serif',
    fontMorse: '400 70px "Inter", sans-serif',
    qrColor: '#000000',
    qrBg: 'transparent'
  }
};

export default function ImageGenerator({ isOpen, onClose, text, morse }: ImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>('classic');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = THEMES[currentTheme];

    // Set high resolution
    const width = 1200;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    // 1. Background
    if (currentTheme === 'classic') {
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, theme.bg);
      ctx.fillStyle = gradient;
    } else if (currentTheme === 'paper') {
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);
      // Add paper texture
      for (let i = 0; i < 5000; i++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.02})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
      }
    } else {
      ctx.fillStyle = theme.bg;
    }
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Elements based on theme
    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 1;

    if (currentTheme === 'blueprint') {
      // Grid lines for blueprint
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }
    } else if (currentTheme === 'neon') {
      // Glowing circles
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 300 + i * 50, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 / i})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else if (currentTheme !== 'minimal') {
      // Standard grid
      for (let i = 0; i < width; i += 80) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }
    }

    // 3. Main Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = theme.fontMain;
    ctx.fillStyle = theme.text;
    
    if (currentTheme === 'neon') {
      ctx.shadowBlur = 30;
      ctx.shadowColor = theme.text;
    } else if (currentTheme === 'classic') {
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
    }
    
    ctx.fillText(text.toUpperCase(), width / 2, height / 2 - 60);
    ctx.shadowBlur = 0;

    // 4. Morse Code
    ctx.font = theme.fontMorse;
    ctx.fillStyle = currentTheme === 'minimal' ? theme.accent : theme.text;
    if (currentTheme === 'paper') ctx.fillStyle = theme.accent;
    
    const maxMorseWidth = 1000;
    const morseLines = [];
    let currentLine = "";
    const symbols = morse.split(' ');
    
    symbols.forEach(symbol => {
      const testLine = currentLine + (currentLine ? "   " : "") + symbol;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxMorseWidth && currentLine) {
        morseLines.push(currentLine);
        currentLine = symbol;
      } else {
        currentLine = testLine;
      }
    });
    morseLines.push(currentLine);

    const startY = height / 2 + 120;
    morseLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + (index * 110));
    });

    // 5. Branding & QR Code
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillStyle = theme.secondary;
    ctx.letterSpacing = '8px';
    ctx.textAlign = 'left';
    ctx.fillText('ENCODED MESSAGE • ' + theme.name.toUpperCase(), 100, height - 80);
    
    // Generate and Draw QR Code
    try {
      const qrDataUrl = await QRCode.toDataURL(window.location.href, {
        margin: 1,
        width: 120,
        color: {
          dark: theme.qrColor,
          light: theme.qrBg === 'transparent' ? '#00000000' : theme.qrBg
        }
      });
      
      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      await new Promise((resolve) => {
        qrImg.onload = () => {
          ctx.drawImage(qrImg, width - 220, height - 200, 120, 120);
          resolve(null);
        };
      });
      
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.fillStyle = theme.secondary;
      ctx.letterSpacing = '2px';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN TO DECODE', width - 160, height - 60);
    } catch (err) {
      console.error('QR Code generation failed', err);
    }
    
    // 6. Corner Accents
    if (currentTheme !== 'minimal') {
      const padding = 50;
      const lineLen = 60;
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 5;
      
      const drawCorner = (x: number, y: number, dx: number, dy: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y + dy);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx, y);
        ctx.stroke();
      };

      drawCorner(padding, padding, lineLen, lineLen);
      drawCorner(width - padding, padding, -lineLen, lineLen);
      drawCorner(padding, height - padding, lineLen, -lineLen);
      drawCorner(width - padding, height - padding, -lineLen, -lineLen);
    }

    setImageUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(generateImage, 100);
    }
  }, [isOpen, text, morse, currentTheme]);

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `morse-${currentTheme}-${text.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    
    try {
      // Convert data URL to blob for sharing
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'morse-art.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Morse Code Art',
          text: `Check out this Morse Code visual for "${text}"!`,
          url: window.location.href
        });
      } else {
        // Fallback: Copy link
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Sharing failed', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#1a1d23] border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
        >
          {/* Preview Side */}
          <div className="flex-1 p-6 sm:p-10 bg-black/40 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-800">
            <div className="w-full aspect-square max-w-[450px] relative">
              <canvas ref={canvasRef} className="hidden" />
              <AnimatePresence mode="wait">
                {imageUrl ? (
                  <motion.img 
                    key={currentTheme}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    src={imageUrl} 
                    alt="Morse Art Preview" 
                    className="w-full h-full object-contain rounded-xl shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-900 rounded-xl">
                    <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
                    <p className="text-sm text-gray-500 font-mono">RENDERING...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls Side */}
          <div className="w-full lg:w-[380px] p-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-400/10 rounded-lg">
                  <Palette className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Visual Styles</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Layout className="w-3 h-3" /> Select Theme
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(THEMES) as Theme[]).map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() => setCurrentTheme(themeKey)}
                      className={`group flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        currentTheme === themeKey 
                          ? 'border-amber-400 bg-amber-400/5 text-white' 
                          : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/10" 
                          style={{ backgroundColor: THEMES[themeKey].bg }}
                        />
                        <span className="text-sm font-medium">{THEMES[themeKey].name}</span>
                      </div>
                      {currentTheme === themeKey && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800 flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  onClick={downloadImage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-2xl transition-all shadow-lg shadow-amber-400/20 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  SAVE
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl transition-all border border-gray-700 active:scale-95"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                  {copied ? 'COPIED' : 'SHARE'}
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-600 uppercase tracking-[0.2em] font-mono">
                1200x1200px • PNG Format
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
