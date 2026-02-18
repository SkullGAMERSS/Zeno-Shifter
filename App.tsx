
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Sparkles, 
  Settings, 
  Terminal, 
  ShieldCheck,
  ChevronRight,
  Plus,
  Target,
  Clock,
  BatteryCharging
} from 'lucide-react';
import { INITIAL_TASKS, CHAOS_EVENTS } from './constants';
import { Task, PlayerStats, PriorityRule } from './types';
import { resolveConflicts } from './services/geminiService';
import StressMeter from './components/StressMeter';
import SidePanel from './components/SidePanel';
import TimePath from './components/TimePath';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedRule, setSelectedRule] = useState<PriorityRule>('urgency');
  const [stats, setStats] = useState<PlayerStats>({
    focus: 65,
    agility: 40,
    consistency: 80,
    zen: 50,
    mana: 80,
    xp: 250,
    level: 1,
  });
  const [isResolving, setIsResolving] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; msg: string; xp: number }[]>([]);

  const addToast = (msg: string, xp: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, msg, xp }]);
    setStats(prev => ({ ...prev, xp: prev.xp + xp }));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const getConflictCount = useCallback(() => {
    let count = 0;
    const sorted = [...tasks].sort((a, b) => a.startTime - b.startTime);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i];
        const b = sorted[j];
        if (a.startTime + a.duration > b.startTime) {
          count++;
          break;
        }
      }
    }
    return count;
  }, [tasks]);

  const injectChaos = () => {
    const randomEvent = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
    // Find the first task and overlap it
    const targetTime = tasks.length > 0 ? tasks[0].startTime : 9;
    
    const newTask: Task = {
      id: `chaos-${Date.now()}`,
      title: randomEvent.title,
      startTime: targetTime,
      duration: randomEvent.duration,
      type: 'Chaos',
      priority: randomEvent.priority,
      manaCost: randomEvent.manaCost,
    };

    setTasks(prev => [...prev, newTask]);
    addToast("Temporal Rift Detected!", 50);
  };

  const handleResolve = async () => {
    if (isResolving) return;
    setIsResolving(true);
    
    try {
      const resolved = await resolveConflicts(tasks, selectedRule);
      setTasks(resolved);
      addToast(`${selectedRule.toUpperCase()} Algorithm Applied!`, 200);
      setStats(prev => ({
        ...prev,
        zen: Math.min(prev.zen + 15, 100),
        mana: Math.max(prev.mana - 10, 0),
        agility: Math.min(prev.agility + 8, 100)
      }));
    } catch (err) {
      addToast("Temporal Matrix Unstable", 0);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="min-h-screen relative selection:bg-purple-500/30">
      <div className="mesh-gradient" />
      <CustomCursor />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_#9333ea] rotate-12">
              <Terminal className="text-white -rotate-12" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-black tracking-tighter text-white">ZENO</h1>
              <p className="text-[9px] font-orbitron text-purple-400 tracking-[0.2em] uppercase">Temporal OS v3.2</p>
            </div>
          </div>

          <StressMeter conflictCount={getConflictCount()} />

          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/5 border border-white/10"
            >
              <Settings size={20} className="text-white/60" />
            </motion.button>
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-orbitron text-white/60 uppercase">Link Stable</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-32 pb-40 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Stats & Skills */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <SidePanel stats={stats} />
          </div>

          {/* Center: The Time Path */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-orbitron flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                Active Timeline
              </h2>
              <div className="text-[10px] font-orbitron text-white/40 tracking-widest uppercase">
                {tasks.length} Sync Points
              </div>
            </div>
            
            <TimePath tasks={tasks} />
          </div>

          {/* Right Side: Command Center */}
          <div className="lg:col-span-3 order-3">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 neon-ghost">
                <h3 className="text-xs font-orbitron text-white/60 mb-6 uppercase tracking-widest">Protocol Deck</h3>
                
                {/* Rule Selector */}
                <div className="mb-8 space-y-3">
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Resolution Engine</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'urgency', label: 'Urgency', icon: Clock, color: 'text-yellow-400' },
                      { id: 'importance', label: 'Importance', icon: Target, color: 'text-red-400' },
                      { id: 'energy', label: 'Energy Flow', icon: BatteryCharging, color: 'text-cyan-400' }
                    ].map((rule) => (
                      <motion.button
                        key={rule.id}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRule(rule.id as PriorityRule)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          selectedRule === rule.id 
                            ? 'bg-white/10 border-white/30 ring-1 ring-white/20' 
                            : 'bg-white/5 border-transparent opacity-60 grayscale'
                        }`}
                      >
                        <rule.icon size={16} className={selectedRule === rule.id ? rule.color : 'text-white'} />
                        <span className={`font-orbitron text-[10px] font-bold uppercase ${selectedRule === rule.id ? 'text-white' : 'text-white/40'}`}>
                          {rule.label}
                        </span>
                        {selectedRule === rule.id && (
                          <motion.div layoutId="active-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/10 my-6" />

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={injectChaos}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 group"
                  >
                    <div className="flex items-center gap-3">
                      <Flame className="group-hover:animate-bounce" size={18} />
                      <span className="font-orbitron text-xs font-bold uppercase tracking-tighter">Inject Chaos</span>
                    </div>
                    <ChevronRight size={14} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResolve}
                    disabled={isResolving}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border font-orbitron text-xs font-bold uppercase tracking-tighter transition-all duration-500
                      ${isResolving 
                        ? 'bg-purple-500/50 border-purple-500/50 cursor-not-allowed text-white' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 border-white/20 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className={isResolving ? 'animate-spin' : 'animate-pulse'} size={18} />
                      <span>{isResolving ? 'Rewriting Time...' : 'Execute Resolve'}</span>
                    </div>
                    <Sparkles size={14} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.5 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.8 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[280px] neon-ghost"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50 text-purple-400">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{toast.msg}</p>
                <p className="text-xs text-purple-400 font-orbitron">Temporal Sync: +{toast.xp} XP</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-900/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
};

export default App;
