
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import { Clock, Zap, AlertTriangle, Target, Activity, Flame } from 'lucide-react';

interface TimePathProps {
  tasks: Task[];
}

const TimePath: React.FC<TimePathProps> = ({ tasks }) => {
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

  const MetricBar = ({ value, label, icon: Icon, color }: { value: number, label: string, icon: any, color: string }) => (
    <div className="flex flex-col gap-1 flex-1">
      <div className="flex items-center justify-between text-[8px] font-orbitron text-white/40 uppercase tracking-tighter">
        <span className="flex items-center gap-1"><Icon size={8} className={color} /> {label}</span>
        <span>{value}/5</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  );

  return (
    <div className="relative w-full py-12 px-4 md:px-12 min-h-[600px] overflow-hidden">
      <svg className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 opacity-10 pointer-events-none" preserveAspectRatio="none">
        <path
          d="M 50 0 Q 70 200 30 400 T 50 800 T 70 1200"
          className="stroke-purple-500 fill-none"
          strokeWidth="1"
          strokeDasharray="15 10"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative flex flex-col items-center gap-8">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task, index) => {
            const hasConflict = checkConflict(task);
            const isChaos = task.type === 'Chaos';
            const offset = index % 2 === 0 ? 'md:translate-x-20' : 'md:-translate-x-20';

            return (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`group relative w-full max-w-sm ${offset}`}
              >
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500/50 shadow-[0_0_10px_#a855f7] z-10" />

                <div className={`
                  relative p-5 rounded-2xl backdrop-blur-2xl border transition-all duration-500
                  ${hasConflict ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
                  ${isChaos ? 'ring-1 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}
                `}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isChaos ? 'bg-red-500' : 'bg-white/10'}`}>
                        {isChaos ? <AlertTriangle size={14} /> : <Clock size={14} className="text-white/60" />}
                      </div>
                      <h4 className="font-orbitron font-bold text-xs tracking-tight truncate max-w-[150px]">{task.title}</h4>
                    </div>
                    <span className={`text-[8px] font-orbitron px-1.5 py-0.5 rounded border uppercase ${
                      task.type === 'Work' ? 'border-blue-500/50 text-blue-400' :
                      task.type === 'Health' ? 'border-green-500/50 text-green-400' :
                      task.type === 'Chaos' ? 'border-red-500/50 text-red-400' : 'border-purple-500/50 text-purple-400'
                    }`}>
                      {task.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-white/50 mb-4 font-orbitron">
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded">
                      <Clock size={10} /> {formatTime(task.startTime)}
                    </span>
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded">
                      <Activity size={10} /> {task.duration}h
                    </span>
                  </div>

                  <div className="flex gap-3 mb-2">
                    <MetricBar value={task.urgency} label="Urgency" icon={Flame} color="text-yellow-400" />
                    <MetricBar value={task.importance} label="Impact" icon={Target} color="text-purple-400" />
                    <MetricBar value={task.energyLevel} label="Energy" icon={Zap} color="text-cyan-400" />
                  </div>

                  {hasConflict && (
                    <motion.div 
                      animate={{ opacity: [0.6, 1, 0.6] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-3 flex items-center gap-1 bg-red-500/10 p-1 rounded"
                    >
                      <AlertTriangle size={10} /> Conflict: Shift Recommended
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
