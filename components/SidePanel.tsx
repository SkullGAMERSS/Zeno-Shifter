
import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { PlayerStats } from '../types';
import { BatteryCharging, Sparkles } from 'lucide-react';

interface SidePanelProps {
  stats: PlayerStats;
  onRecharge: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ stats, onRecharge }) => {
  const radarData = [
    { subject: 'Focus', A: stats.focus, fullMark: 100 },
    { subject: 'Agility', A: stats.agility, fullMark: 100 },
    { subject: 'Zen', A: stats.zen, fullMark: 100 },
    { subject: 'Consistency', A: stats.consistency, fullMark: 100 },
    { subject: 'Speed', A: (stats.agility + stats.focus) / 2, fullMark: 100 },
    { subject: 'Force', A: stats.level * 10, fullMark: 100 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full lg:w-80">
      {/* XP Bar */}
      <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 neon-ghost relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 blur-2xl" />
        <div className="flex justify-between items-end mb-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 font-orbitron uppercase">Class</span>
            <h3 className="text-xs font-orbitron text-yellow-500 font-black uppercase tracking-widest">
              LVL {stats.level} Time Bender
            </h3>
          </div>
          <span className="text-[10px] text-white/40 font-orbitron">{stats.xp} XP</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.xp % 1000 / 1000) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats Radar */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 neon-ghost aspect-square flex flex-col items-center">
        <h3 className="text-[10px] font-orbitron text-white/40 mb-4 uppercase tracking-[0.2em] font-bold">Neural Signature</h3>
        <div className="w-full h-full max-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#ffffff11" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff44', fontSize: 9, fontFamily: 'Orbitron' }} />
              <Radar
                name="Pilot"
                dataKey="A"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mana Bar */}
      <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 neon-ghost group">
        <div className="flex justify-between items-end mb-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 font-orbitron uppercase">Energy Pool</span>
            <h3 className="text-xs font-orbitron text-cyan-400 font-black uppercase tracking-widest flex items-center gap-2">
              Mana Reserve
            </h3>
          </div>
          <span className="text-[10px] text-white/60 font-orbitron">{stats.mana} MP</span>
        </div>
        
        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-cyan-500/20 relative mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            animate={{ width: `${stats.mana}%` }}
            transition={{ type: 'spring', damping: 15 }}
          />
          {stats.mana < 20 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[8px] font-orbitron text-white animate-pulse">LOW ENERGY</span>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRecharge}
          className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 font-orbitron text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
        >
          <BatteryCharging size={12} />
          Initiate Meditation
        </motion.button>
        
        <p className="text-[9px] text-white/20 mt-3 text-center font-space-grotesk italic">AI Sync operations consume 20 Mana.</p>
      </div>
    </div>
  );
};

export default SidePanel;
