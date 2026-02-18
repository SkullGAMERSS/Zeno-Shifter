
import { Task } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Morning Code Audit',
    startTime: 9,
    duration: 2,
    type: 'Work',
    manaCost: 40,
    priority: 4,
  },
  {
    id: '2',
    title: 'Solar Core Workout',
    startTime: 12,
    duration: 1,
    type: 'Health',
    manaCost: 20,
    priority: 3,
  },
  {
    id: '3',
    title: 'Nebula Protocol Lunch',
    startTime: 13.5,
    duration: 1,
    type: 'Personal',
    manaCost: -15, // Restores mana
    priority: 2,
  },
];

export const CHAOS_EVENTS = [
  { title: 'Server Warp Breach', type: 'Work', duration: 1.5, priority: 5, manaCost: 60 },
  { title: 'Emergency AI Council', type: 'Work', duration: 2, priority: 4, manaCost: 50 },
  { title: 'Unexpected Wormhole Call', type: 'Personal', duration: 0.5, priority: 3, manaCost: 25 },
];
