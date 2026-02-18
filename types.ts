
export type TaskType = 'Work' | 'Personal' | 'Health' | 'Chaos';

export type PriorityRule = 'urgency' | 'importance' | 'energy';

export interface Task {
  id: string;
  title: string;
  startTime: number; // Hour in 24h format
  duration: number;  // Hours
  type: TaskType;
  manaCost: number;
  priority: number; // 1-5
}

export interface PlayerStats {
  focus: number;
  agility: number;
  consistency: number;
  zen: number;
  mana: number;
  xp: number;
  level: number;
}
