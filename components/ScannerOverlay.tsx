
import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './Icons';

interface Props {
  step: 'mapping' | 'face' | 'pigmentation' | 'analyzing';
}

const FACE_STRUCTURES = [
  { name: 'Oval', path: 'M12 21c-4.418 0-8-4.03-8-9s3.582-9 8-9 8 4.03 8 9-3.582 9-8 9z' },
  { name: 'Round', path: 'M12 21a9 9 0 100-18 9 9 0 000 18z' },
  { name: 'Square', path: 'M5 5h14v14H5z' },
  { name: 'Heart', path: 'M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z' },
  { name: 'Diamond', path: 'M12 2L2 12l10 10 10-10L12 2z' },
  { name: 'Oblong', path: 'M12 22c-3.314 0-6-4.477-6-10s2.686-10 6-10 6 4.477 6 10-2.686 10-6 10z' }
];

export const ScannerOverlay: React.FC<Props> = ({ step }) => {
  const [activeFaceIndex, setActiveFaceIndex] = useState(0);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const [pigmentStep, setPigmentStep] = useState(0); // 0: Hair, 1: Eye, 2: Skin

  useEffect(() => {
    if (step === 'face') {
      setSelectedFaceIndex(null);
      let count = 0;
      const totalSteps = 15;
      const interval = setInterval(() => {
        setActiveFaceIndex(prev => (prev + 1) % FACE_STRUCTURES.length);
        count++;
        if (count >= totalSteps) {
          clearInterval(interval);
          // Pick the "Detected" one (index 0 for demo purposes)
          setSelectedFaceIndex(0);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'pigmentation') {
      setPigmentStep(0);
      const timer1 = setTimeout(() => setPigmentStep(1), 1000);
      const timer2 = setTimeout(() => setPigmentStep(2), 2000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [step]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px] z-20">
      {/* Moving Scan Line */}
      {(step === 'mapping' || step === 'analyzing' || step === 'pigmentation') && (
        <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)] animate-scan opacity-100 z-30" />
      )}

      {/* Face Structure Step */}
      {step === 'face' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
          <h4 className="text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8">AI Structural Analysis</h4>
          <div className="w-full grid grid-cols-3 gap-4 mb-10">
            {FACE_STRUCTURES.map((face, idx) => (
              <div 
                key={idx} 
                className={`aspect-square glass-card rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border-2 ${
                  selectedFaceIndex === idx 
                    ? 'border-cyan-400 scale-110 bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                    : activeFaceIndex === idx 
                      ? 'border-white/40 scale-105 bg-white/5' 
                      : 'border-white/5 opacity-30'
                }`}
              >
                <svg className={`w-10 h-10 transition-colors ${selectedFaceIndex === idx ? 'text-cyan-400' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={face.path} />
                </svg>
                <span className={`text-[8px] font-black uppercase tracking-widest ${selectedFaceIndex === idx ? 'text-cyan-400' : 'text-white/50'}`}>{face.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${selectedFaceIndex !== null ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]' : 'bg-cyan-400 animate-pulse'}`} />
            <span className={`text-xs font-black tracking-widest uppercase ${selectedFaceIndex !== null ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {selectedFaceIndex !== null ? 'Face Structure Detected: OVAL' : 'Detecting Structure...'}
            </span>
          </div>
        </div>
      )}

      {/* Pigmentation Step */}
      {step === 'pigmentation' && (
        <div className="absolute inset-0 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          
          {/* Sequential Scanning Reticles */}
          {pigmentStep >= 0 && (
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-14 h-14 border-2 border-cyan-400 rounded-full animate-pulse-fast flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
               <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
               <span className="absolute -bottom-8 text-[9px] font-black text-cyan-400 uppercase tracking-widest whitespace-nowrap bg-black/40 px-2 py-1 rounded">Scanning Hair Color</span>
            </div>
          )}
          
          {pigmentStep >= 1 && (
            <div className="absolute top-[35%] left-[30%] w-10 h-10 border-2 border-rose-400 rounded-full animate-pulse flex items-center justify-center shadow-[0_0_15px_rgba(251,113,133,0.5)]">
               <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
               <span className="absolute -bottom-8 text-[9px] font-black text-rose-400 uppercase tracking-widest whitespace-nowrap bg-black/40 px-2 py-1 rounded">Scanning Eye Color</span>
            </div>
          )}

          {pigmentStep >= 2 && (
            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-20 h-20 border-2 border-emerald-400 rounded-full animate-pulse-fast flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)]">
               <div className="w-2 h-2 bg-emerald-400 rounded-full" />
               <span className="absolute -bottom-8 text-[9px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap bg-black/40 px-2 py-1 rounded">Analyzing Skin Tone</span>
            </div>
          )}

          {/* Floating Data Readouts */}
          <div className="absolute right-6 top-1/3 space-y-3 opacity-80">
            {pigmentStep >= 0 && <div className="text-[10px] font-mono text-cyan-300 bg-black/60 px-3 py-1.5 rounded-lg border border-cyan-400/30 animate-in slide-in-from-right-2">HAIR_VAL: DARK_BROWN</div>}
            {pigmentStep >= 1 && <div className="text-[10px] font-mono text-rose-300 bg-black/60 px-3 py-1.5 rounded-lg border border-rose-400/30 animate-in slide-in-from-right-2">EYE_HEX: #2B1B17</div>}
            {pigmentStep >= 2 && <div className="text-[10px] font-mono text-emerald-300 bg-black/60 px-3 py-1.5 rounded-lg border border-emerald-400/30 animate-in slide-in-from-right-2">SKIN_TYPE: NEUTRAL_III</div>}
          </div>
        </div>
      )}

      {/* Analyzing Step (Final) */}
      {step === 'analyzing' && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[8px]">
           <div className="text-center">
             <div className="relative mb-10">
               <div className="w-20 h-20 border-4 border-cyan-400/20 rounded-full mx-auto" />
               <div className="absolute inset-0 w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
               <SparklesIcon className="absolute inset-0 m-auto w-10 h-10 text-cyan-400 animate-pulse" />
             </div>
             <p className="text-white font-black tracking-[0.4em] uppercase text-xs mb-2">Curating Personal Style</p>
             <p className="text-cyan-400/60 text-[8px] font-bold uppercase tracking-widest">Applying Fashion Intelligence...</p>
           </div>
        </div>
      )}

      {/* Futuristic Corner Brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-cyan-400 animate-pulse" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-cyan-400 animate-pulse" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-cyan-400 animate-pulse" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-cyan-400 animate-pulse" />
    </div>
  );
};
