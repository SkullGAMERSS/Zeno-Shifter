
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Sparkles, 
  Settings, 
  Terminal, 
  ChevronRight,
  Plus,
  Target,
  Clock,
  BatteryCharging,
  X,
  PlusCircle,
  Dna,
  RefreshCcw,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { INITIAL_TASKS, CHAOS_EVENTS } from './constants';
import { Task, PlayerStats, PriorityRule, TaskType } from './types';
import { resolveConflicts } from './services/geminiService';
import StressMeter from './components/StressMeter';
import SidePanel from './components/SidePanel';
import TimePath from './components/TimePath';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedRule, setSelectedRule] = useState<PriorityRule>('urgency');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const [newTask, setNewTask] = useState({
    title: '',
    startTime: 9,
    duration: 1,
    type: 'Work' as TaskType,
    urgency: 3,
    importance: 3,
    energyLevel: 3
  });

  const addToast = (msg: string, xp: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, msg, xp }]);
    setStats(prev => ({ 
      ...prev, 
      xp: prev.xp + xp,
      level: Math.floor((prev.xp + xp) / 1000) + 1 
    }));
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

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      ...newTask,
      manaCost: newTask.energyLevel * 10,
      priority: Math.round((newTask.importance + newTask.urgency) / 2)
    };

    setTasks(prev => [...prev, task]);
    setIsAddingTask(false);
    setNewTask({ title: '', startTime: 9, duration: 1, type: 'Work', urgency: 3, importance: 3, energyLevel: 3 });
    addToast("New Timeline Node Anchored", 50);
  };

  const injectChaos = () => {
    const randomEvent = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
    const targetTime = tasks.length > 0 ? tasks[Math.floor(Math.random() * tasks.length)].startTime : 10;
    
    const chaosTask: Task = {
      id: `chaos-${Date.now()}`,
      ...randomEvent,
      startTime: targetTime,
    };

    setTasks(prev => [...prev, chaosTask]);
    addToast("Anomalous Signal Injected", 75);
  };

  const handleResolve = async () => {
    if (isResolving) return;
    if (stats.mana < 20) {
      addToast("Insufficient Mana! Meditate to recover.", 0);
      return;
    }
    
    setIsResolving(true);
    
    try {
      const resolved = await resolveConflicts(tasks, selectedRule);
      setTasks(resolved);
      addToast(`${selectedRule.toUpperCase()} Optimization Complete`, 250);
      setStats(prev => ({
        ...prev,
        zen: Math.min(prev.zen + 10, 100),
        mana: Math.max(prev.mana - 20, 0),
        agility: Math.min(prev.agility + 12, 100),
        focus: Math.min(prev.focus + 5, 100)
      }));
    } catch (err) {
      addToast("Resolution Matrix Failure", 0);
    } finally {
      setIsResolving(false);
    }
  };

  const handleRecharge = () => {
    if (stats.mana >= 100) {
      addToast("Energy Pool at Maximum", 0);
      return;
    }
    setStats(prev => ({
      ...prev,
      mana: Math.min(prev.mana + 30, 100),
      zen: Math.min(prev.zen + 5, 100)
    }));
    addToast("Meditating... Mana Restored", 25);
  };

  const handleClearTimeline = () => {
    setTasks([]);
    setIsSettingsOpen(false);
    addToast("Temporal Buffer Cleared", 0);
  };

  return (
    <div className="min-h-screen relative selection:bg-purple-500/30">
      <div className="mesh-gradient" />
      <CustomCursor />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.4)] rotate-3">
              <Dna className="text-white -rotate-3" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-black tracking-tighter text-white">ZENO</h1>
              <p className="text-[10px] font-orbitron text-purple-400 tracking-[0.3em] uppercase opacity-70">Temporal OS v4.1</p>
            </div>
          </div>

          <StressMeter conflictCount={getConflictCount()} />

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[10px] font-orbitron text-white/40 uppercase tracking-widest">Neural Link</span>
              <span className="text-xs font-orbitron text-green-400 font-bold">SYNCHRONIZED</span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white"
            >
              <Settings size={22} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-36 pb-40 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-3 order-2 lg:order-1">
            <SidePanel stats={stats} onRecharge={handleRecharge} />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="flex items-center justify-between mb-10 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <h2 className="text-sm font-orbitron font-bold flex items-center gap-3 uppercase tracking-widest text-white/80">
                <Sparkles size={18} className="text-purple-400 animate-pulse" />
                Stream View
              </h2>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingTask(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 rounded-xl font-orbitron text-[10px] font-black uppercase shadow-[0_0_20px_rgba(147,51,234,0.5)] border border-white/20"
              >
                <PlusCircle size={14} /> New Node
              </motion.button>
            </div>
            
            <TimePath tasks={tasks} />
          </div>

          <div className="lg:col-span-3 order-3">
            <div className="sticky top-36 space-y-8">
              <div className="bg-white/5 backdrop-blur-3xl p-7 rounded-[2.5rem] border border-white/10 neon-ghost relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] rounded-full -mr-16 -mt-16" />
                
                <h3 className="text-[11px] font-orbitron text-white/50 mb-8 uppercase tracking-[0.2em] font-bold">Priority Protocols</h3>
                
                <div className="space-y-3">
                  {[
                    { id: 'urgency', label: 'Urgency Matrix', icon: Clock, color: 'text-yellow-400', desc: 'Favors immediate deadlines' },
                    { id: 'importance', label: 'Impact Scaling', icon: Target, color: 'text-red-400', desc: 'Prioritizes high-value goals' },
                    { id: 'energy', label: 'Energy Balancing', icon: BatteryCharging, color: 'text-cyan-400', desc: 'Optimizes for focus & rest' }
                  ].map((rule) => (
                    <motion.button
                      key={rule.id}
                      whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.08)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRule(rule.id as PriorityRule)}
                      className={`w-full flex flex-col gap-1 p-4 rounded-2xl border transition-all text-left ${
                        selectedRule === rule.id 
                          ? 'bg-purple-600/20 border-purple-500/50 ring-1 ring-purple-500/20' 
                          : 'bg-white/5 border-transparent opacity-50 grayscale'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <rule.icon size={18} className={selectedRule === rule.id ? rule.color : 'text-white'} />
                        <span className={`font-orbitron text-[11px] font-black uppercase tracking-wider ${selectedRule === rule.id ? 'text-white' : 'text-white/40'}`}>
                          {rule.label}
                        </span>
                      </div>
                      <span className="text-[9px] text-white/30 ml-7 font-space-grotesk">{rule.desc}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="h-px bg-white/10 my-8" />

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={injectChaos}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 group"
                  >
                    <div className="flex items-center gap-3">
                      <Flame className="group-hover:animate-bounce" size={18} />
                      <span className="font-orbitron text-[10px] font-black uppercase tracking-widest">Chaos Injection</span>
                    </div>
                    <ChevronRight size={14} />
                  </motion.button>

                  <motion.button
                    whileHover={stats.mana >= 20 ? { scale: 1.02, y: -2 } : {}}
                    whileTap={stats.mana >= 20 ? { scale: 0.98 } : {}}
                    onClick={handleResolve}
                    disabled={isResolving || stats.mana < 20}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border font-orbitron text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-700
                      ${isResolving 
                        ? 'bg-purple-900/40 border-purple-500/30 cursor-wait text-white/50' 
                        : stats.mana < 20 
                        ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 border-white/20 text-white shadow-[0_15px_30px_rgba(147,51,234,0.3)]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className={isResolving ? 'animate-spin' : 'animate-pulse'} size={20} />
                      <span>{isResolving ? 'Rewriting Reality...' : stats.mana < 20 ? 'Insufficient Mana' : 'Execute Sync'}</span>
                    </div>
                    {stats.mana >= 20 && <Sparkles size={16} />}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingTask(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="relative w-full max-w-xl bg-[#080808] border border-white/10 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setIsAddingTask(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-white transition-colors border border-white/10">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/50">
                  <Plus size={24} className="text-purple-400" />
                </div>
                <h2 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter">
                  New Sequence
                </h2>
              </div>

              <form onSubmit={handleAddTask} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron text-white/40 uppercase tracking-[0.2em] font-black">Node Identifier</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter operation title..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-space-grotesk text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron text-white/40 uppercase tracking-[0.2em] font-black">Start Vector (H)</label>
                    <input
                      type="number"
                      min="7"
                      max="22"
                      value={newTask.startTime}
                      onChange={(e) => setNewTask({ ...newTask, startTime: parseFloat(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-orbitron text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-orbitron text-white/40 uppercase tracking-[0.2em] font-black">Duration (H)</label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ ...newTask, duration: parseFloat(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-orbitron text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-orbitron text-white/30 uppercase tracking-[0.2em] font-black mb-4">Metric Configuration</p>
                  {[
                    { key: 'urgency', label: 'Urgency Vector', icon: Flame, color: 'text-yellow-400' },
                    { key: 'importance', label: 'Strategic Impact', icon: Target, color: 'text-red-500' },
                    { key: 'energyLevel', label: 'Metabolic Load', icon: Zap, color: 'text-cyan-400' },
                  ].map((metric) => (
                    <div key={metric.key} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-orbitron text-white/60 uppercase tracking-widest font-bold flex items-center gap-3">
                          <metric.icon size={16} className={metric.color} /> {metric.label}
                        </label>
                        <span className="text-xs font-orbitron text-white font-black">{newTask[metric.key as keyof typeof newTask]}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={newTask[metric.key as keyof typeof newTask]}
                        onChange={(e) => setNewTask({ ...newTask, [metric.key]: parseInt(e.target.value) })}
                        className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-orbitron text-sm font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(147,51,234,0.4)] border border-white/20"
                >
                  Confirm Sequence
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}

        {isSettingsOpen && (
          <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-end p-0 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-full md:w-[400px] h-full md:h-auto bg-[#0a0a0a] border-l md:border border-white/10 p-8 md:rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-orbitron font-black text-white uppercase flex items-center gap-3">
                  <Settings className="text-purple-400" />
                  Control Matrix
                </h2>
                <button onClick={() => setIsSettingsOpen(false)} className="text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h3 className="text-[10px] font-orbitron text-white/60 mb-4 uppercase tracking-widest font-bold">System Maintenance</h3>
                  <button 
                    onClick={handleClearTimeline}
                    className="w-full flex items-center gap-4 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all font-orbitron text-[10px] font-bold uppercase tracking-widest"
                  >
                    <Trash2 size={16} />
                    Purge All Timeline Nodes
                  </button>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h3 className="text-[10px] font-orbitron text-white/60 mb-4 uppercase tracking-widest font-bold">Protocol Info</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="p-2 bg-cyan-500/20 rounded-lg"><BatteryCharging size={14} className="text-cyan-400" /></div>
                      <div>
                        <p className="text-[10px] text-white font-bold uppercase font-orbitron">Mana System</p>
                        <p className="text-[9px] text-white/40 leading-relaxed">AI Sync requires computational energy. Use meditation to replenish reserves.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="p-2 bg-purple-500/20 rounded-lg"><RefreshCcw size={14} className="text-purple-400" /></div>
                      <div>
                        <p className="text-[10px] text-white font-bold uppercase font-orbitron">Temporal Sync</p>
                        <p className="text-[9px] text-white/40 leading-relaxed">Resolves overlaps based on selected global priority matrix.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[8px] font-orbitron text-white/20 text-center uppercase tracking-[0.5em]">ZENO CORE VERSION 4.1.0-ALPHA</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <div className="fixed bottom-10 right-10 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="bg-black/80 backdrop-blur-3xl border border-white/20 p-5 rounded-[1.5rem] shadow-2xl flex items-center gap-5 min-w-[320px] neon-ghost"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/40 text-purple-400">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-tight font-orbitron">{toast.msg}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      className="h-full bg-purple-500" 
                    />
                  </div>
                  <p className="text-[10px] text-purple-400 font-black font-orbitron">+{toast.xp} XP</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[10%] left-[-15%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default App;
