
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import { Clock, Zap, AlertTriangle } from 'lucide-react';

interface TimePathProps {
  tasks: Task[];
}

const TimePath: React.FC<TimePathProps> = ({ tasks }) => {
  // Sort tasks by start time for display
  const sortedTasks = [...tasks].sort((a, b) => a.startTime - b.startTime);

  const checkConflict = (task: Task) => {
    return tasks.some(t => 
      t.id !== task.id && 
      ((task.startTime >= t.startTime && task.startTime < t.startTime + t.duration) ||
      (task.startTime + task.duration > t.startTime && task.startTime + task.duration <= t.startTime + t.duration))
    );
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const mins = Math.round((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full py-12 px-4 md:px-12 min-h-[600px] overflow-hidden">
      {/* The winding path line */}
      <svg className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 opacity-20 pointer-events-none" preserveAspectRatio="none">
        <path
          d="M 50 0 Q 70 200 30 400 T 50 800 T 70 1200"
          className="stroke-purple-500 fill-none"
          strokeWidth="2"
          strokeDasharray="10 5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative flex flex-col items-center gap-8">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task, index) => {
            const hasConflict = checkConflict(task);
            const isChaos = task.type === 'Chaos';
            const offset = index % 2 === 0 ? 'md:translate-x-16' : 'md:-translate-x-16';

            return (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`group relative w-full max-w-md ${offset}`}
              >
                {/* Connector Point */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_#a855f7] z-10" />

                <div className={`
                  relative p-5 rounded-2xl backdrop-blur-xl border transition-all duration-300
                  ${hasConflict ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5'}
                  ${isChaos ? 'neon-ghost ring-1 ring-red-500/50' : ''}
                `}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isChaos ? 'bg-red-500' : 'bg-white/10'}`}>
                        {isChaos ? <AlertTriangle size={16} /> : <Clock size={16} className="text-white/60" />}
                      </div>
                      <h4 className="font-orbitron font-bold text-sm tracking-tight">{task.title}</h4>
                    </div>
                    <span className={`text-[10px] font-orbitron px-2 py-1 rounded border ${
                      task.type === 'Work' ? 'border-blue-500 text-blue-400' :
                      task.type === 'Health' ? 'border-green-500 text-green-400' :
                      task.type === 'Chaos' ? 'border-red-500 text-red-400' : 'border-purple-500 text-purple-400'
                    }`}>
                      {task.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/60 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatTime(task.startTime)} - {formatTime(task.startTime + task.duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={12} className="text-cyan-400" /> {task.manaCost} MP
                    </span>
                    <span className="text-[10px] text-white/30 ml-auto">PRIORITY {task.priority}</span>
                  </div>

                  {hasConflict && (
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }} 
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2 flex items-center gap-1"
                    >
                      <AlertTriangle size={12} /> Conflict Detected
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimePath;
