import React from 'react';
import { motion } from 'framer-motion';

interface UmiSphereProps {
  onClick?: () => void;
  isRecording?: boolean;
}

export const UmiSphere: React.FC<UmiSphereProps> = ({ onClick, isRecording }) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Glow/Rings */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-[-40px] border rounded-full border-dashed transition-colors duration-500 ${isRecording ? 'border-red-500/30' : 'border-indigo-500/10 dark:border-indigo-400/10'}`}
      />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-[-20px] border rounded-full transition-colors duration-500 ${isRecording ? 'border-red-500/20' : 'border-indigo-500/5 dark:border-indigo-400/5'}`}
      />
      
      {/* Glow effect background */}
      <div className={`absolute inset-4 rounded-full blur-[60px] animate-pulse-slow transition-colors duration-500 ${isRecording ? 'bg-red-500/40' : 'bg-indigo-500/30'}`} />

      {/* The Sphere */}
      <motion.div
        onClick={onClick}
        animate={{ 
          y: [-5, 5, -5],
          scale: isRecording ? [1, 1.05, 1] : [1, 1.02, 1]
        }}
        transition={{ 
          duration: isRecording ? 2 : 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={`umi-sphere w-full h-full rounded-full relative z-10 flex items-center justify-center overflow-hidden cursor-pointer group transition-shadow duration-500 ${isRecording ? 'shadow-[0_0_50px_rgba(239,68,68,0.6)]' : ''}`}
      >
        <div className="absolute top-12 left-12 w-24 h-12 bg-white/20 rounded-full blur-xl -rotate-45 opacity-60" />
        <span className="font-display text-white text-5xl font-extralight tracking-[0.4em] opacity-90 drop-shadow-lg group-hover:scale-110 transition-transform duration-700 select-none">
          {isRecording ? 'REC' : 'UMI'}
        </span>
      </motion.div>
    </div>
  );
};