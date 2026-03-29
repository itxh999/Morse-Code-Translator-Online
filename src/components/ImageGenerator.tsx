import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Share2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  morse: string;
}

export default function ImageGenerator({ isOpen, onClose, text, morse }: ImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution for the image
    const width = 1200;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    // 1. Background - Deep Charcoal Gradient
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
    gradient.addColorStop(0, '#1e293b'); // slate-800
    gradient.addColorStop(1, '#0f172a'); // slate-900
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Grid/Pattern
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.05)'; // amber-400 with very low opacity
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // 3. Central Decorative Circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 450, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4. Main Text (The Word)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Use a bold, clean font
    ctx.font = 'bold 120px "Inter", sans-serif';
    ctx.fillStyle = '#fbbf24'; // amber-400
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
    ctx.fillText(text.toUpperCase(), width / 2, height / 2 - 40);
    ctx.shadowBlur = 0;

    // 5. Morse Code
    ctx.font = '600 80px "Courier New", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    // Wrap morse code if it's too long
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

    const startY = height / 2 + 100;
    morseLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + (index * 100));
    });

    // 6. Branding / Footer
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.letterSpacing = '10px';
    ctx.fillText('MORSE CODE TRANSMISSION', width / 2, height - 100);
    
    // 7. Technical Accents (Corner brackets)
    const padding = 60;
    const lineLen = 40;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    
    // Top Left
    ctx.beginPath();
    ctx.moveTo(padding, padding + lineLen);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding + lineLen, padding);
    ctx.stroke();
    
    // Top Right
    ctx.beginPath();
    ctx.moveTo(width - padding - lineLen, padding);
    ctx.lineTo(width - padding, padding);
    ctx.lineTo(width - padding, padding + lineLen);
    ctx.stroke();
    
    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - lineLen);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(padding + lineLen, height - padding);
    ctx.stroke();
    
    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(width - padding - lineLen, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(width - padding, height - padding - lineLen);
    ctx.stroke();

    // Convert to data URL
    setImageUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure canvas is ready
      setTimeout(generateImage, 100);
    }
  }, [isOpen, text, morse]);

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `morse-image-${text.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#1a1d23] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-400/10 rounded-lg">
                <ImageIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Morse Image Generator</h3>
                <p className="text-xs text-gray-500">Instant visual encoding for "{text}"</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col items-center gap-8">
            <div className="w-full aspect-square max-w-[400px] bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center relative overflow-hidden group shadow-inner">
              <canvas ref={canvasRef} className="hidden" />
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Generated Morse Image" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
                  <p className="text-sm text-gray-500 font-mono">ENCODING VISUALS...</p>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadImage}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-400/20"
              >
                <Download className="w-5 h-5" />
                DOWNLOAD IMAGE
              </button>
              <button
                onClick={generateImage}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all border border-gray-700"
              >
                <RefreshCw className="w-5 h-5" />
                REGENERATE
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-black/20 border-t border-gray-800 text-center">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">
              High-Resolution Visual Encoding • 1200x1200px PNG
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
