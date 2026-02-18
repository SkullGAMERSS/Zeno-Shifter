
import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { PlayerStats } from '../types';

interface SidePanelProps {
  stats: PlayerStats;
}

const SidePanel: React.FC<SidePanelProps> = ({ stats }) => {
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
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 neon-ghost">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-xs font-orbitron text-yellow-500 font-bold uppercase tracking-widest">
            Level {stats.level}: Time Bender
          </h3>
          <span className="text-[10px] text-white/40">{stats.xp} / 1000 XP</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.xp / 1000) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats Radar */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 neon-ghost aspect-square">
        <h3 className="text-xs font-orbitron text-white/60 mb-4 uppercase tracking-widest text-center">Neural Signature</h3>
        <div className="w-full h-full max-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#ffffff22" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff66', fontSize: 10, fontFamily: 'Orbitron' }} />
              <Radar
                name="Pilot"
                dataKey="A"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mana Bar */}
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 neon-ghost">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-xs font-orbitron text-cyan-400 font-bold uppercase tracking-widest">
            Mana Reserve
          </h3>
          <span className="text-[10px] text-white/40">{stats.mana} MP</span>
        </div>
        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-cyan-500/20">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            animate={{ width: `${stats.mana}%` }}
            transition={{ type: 'spring', damping: 15 }}
          />
        </div>
        <p className="text-[9px] text-white/30 mt-2 text-center italic">Deep Work depletes Mana. Rest to recharge.</p>
      </div>
    </div>
  );
};

export default SidePanel;
