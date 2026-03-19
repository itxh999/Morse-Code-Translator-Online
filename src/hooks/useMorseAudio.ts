import { useState, useRef, useCallback } from 'react';

export const useMorseAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timeoutRefs = useRef<number[]>([]);

  const stopAudio = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
    setCurrentIndex(null);
  }, []);

  const playMorse = useCallback((morse: string, wpm: number, frequency: number, onFlash?: (active: boolean) => void) => {
    stopAudio();
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const dotDuration = 1.2 / wpm; // Standard formula: dot = 1.2 / WPM seconds
    const dashDuration = dotDuration * 3;
    const intraCharSpace = dotDuration;
    const interCharSpace = dotDuration * 3;
    const wordSpace = dotDuration * 7;

    setIsPlaying(true);
    let currentTime = 0;

    const playTone = (duration: number, startTime: number, index: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + startTime + 0.005);
      gain.gain.setValueAtTime(1, ctx.currentTime + startTime + duration - 0.005);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);

      const startTimeout = window.setTimeout(() => {
        if (onFlash) onFlash(true);
        setCurrentIndex(index);
      }, startTime * 1000);
      
      const endTimeout = window.setTimeout(() => {
        if (onFlash) onFlash(false);
      }, (startTime + duration) * 1000);
      
      timeoutRefs.current.push(startTimeout, endTimeout);
    };

    const parts = morse.split('');
    parts.forEach((char, index) => {
      if (char === '.') {
        playTone(dotDuration, currentTime, index);
        currentTime += dotDuration + intraCharSpace;
      } else if (char === '-') {
        playTone(dashDuration, currentTime, index);
        currentTime += dashDuration + intraCharSpace;
      } else if (char === ' ') {
        const spaceTimeout = window.setTimeout(() => setCurrentIndex(index), currentTime * 1000);
        timeoutRefs.current.push(spaceTimeout);
        currentTime += interCharSpace - intraCharSpace;
      } else if (char === '/') {
        const wordTimeout = window.setTimeout(() => setCurrentIndex(index), currentTime * 1000);
        timeoutRefs.current.push(wordTimeout);
        currentTime += wordSpace - interCharSpace;
      }
    });

    const endTimeout = window.setTimeout(() => {
      setIsPlaying(false);
      setCurrentIndex(null);
    }, currentTime * 1000);
    timeoutRefs.current.push(endTimeout);
  }, [stopAudio]);

  return { playMorse, stopAudio, isPlaying, currentIndex };
};
