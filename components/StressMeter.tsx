
import React from 'react';
import { motion } from 'framer-motion';

interface StressMeterProps {
  conflictCount: number;
}

const StressMeter: React.FC<StressMeterProps> = ({ conflictCount }) => {
  const maxConflicts = 5;
  const percentage = Math.min((conflictCount / maxConflicts) * 100, 100);
  
  let color = 'stroke-teal-400';
  let shadow = 'drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]';
  let status = 'OPTIMAL';
  let pulse = false;

  if (conflictCount >= 3) {
    color = 'stroke-red-500';
    shadow = 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]';
    status = 'CRITICAL';
    pulse = true;
  } else if (conflictCount >= 1) {
    color = 'stroke-yellow-400';
    shadow = 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]';
    status = 'WARNING';
    pulse = true;
  }

  return (
    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 neon-ghost">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            className="stroke-white/10"
            strokeWidth="4"
            fill="transparent"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            className={color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={175}
            animate={{ 
              strokeDashoffset: 175 - (175 * percentage) / 100,
              scale: pulse ? [1, 1.05, 1] : 1
            }}
            transition={{ 
              strokeDashoffset: { duration: 0.5 },
              scale: { repeat: Infinity, duration: 1.5 } 
            }}
            style={{ filter: shadow }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold font-orbitron">{conflictCount}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] text-white/40 font-orbitron tracking-tighter uppercase">Chaos Level</p>
        <p className={`text-sm font-bold font-orbitron ${color.replace('stroke-', 'text-')}`}>
          {status}
        </p>
      </div>
    </div>
  );
};

export default StressMeter;
