
import { GoogleGenAI, Type } from "@google/genai";
import { Task, PriorityRule } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const resolveConflicts = async (tasks: Task[], rule: PriorityRule): Promise<Task[]> => {
  let strategyDescription = "";

  switch (rule) {
    case 'urgency':
      strategyDescription = "Focus on URGENCY: Preserve original start times as much as possible for high-priority tasks, moving others only when absolutely necessary.";
      break;
    case 'importance':
      strategyDescription = "Focus on IMPORTANCE: Strictly prioritize tasks with higher 'priority' values (4-5). Low priority tasks (1-2) should be moved to the end of the day if there is a conflict.";
      break;
    case 'energy':
      strategyDescription = "Focus on ENERGY FLOW: Balance 'manaCost'. Avoid back-to-back high mana cost tasks. Insert gaps or 'Personal' tasks between heavy 'Work' blocks to optimize the user's energy.";
      break;
    default:
      strategyDescription = "Standard balance between work and life.";
  }

  const prompt = `
    You are ZENO, an advanced AI Time Bender. 
    Below is a list of tasks with scheduling conflicts.
    Your job is to re-schedule them to eliminate all overlaps using this strategy: ${strategyDescription}
    
    General Rules:
    1. Chaos events are top priority and must stay close to their original conflict point.
    2. Keep task durations EXACTLY the same.
    3. Start times must be between 08:00 and 22:00.
    4. Return a valid JSON list of ALL tasks with their new startTime values.

    Current Tasks: ${JSON.stringify(tasks)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              startTime: { type: Type.NUMBER },
              duration: { type: Type.NUMBER },
              type: { type: Type.STRING },
              manaCost: { type: Type.NUMBER },
              priority: { type: Type.NUMBER },
            },
            required: ["id", "title", "startTime", "duration", "type", "manaCost", "priority"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return tasks;
  } catch (error) {
    console.error("Gemini Resolution Error:", error);
    return fallbackResolver(tasks);
  }
};

function fallbackResolver(tasks: Task[]): Task[] {
  const sorted = [...tasks].sort((a, b) => b.priority - a.priority || a.startTime - b.startTime);
  const resolved: Task[] = [];

  let currentEnd = 8;
  sorted.forEach(task => {
    const newStart = Math.max(8, currentEnd);
    resolved.push({ ...task, startTime: newStart });
    currentEnd = newStart + task.duration;
  });

  return resolved;
}
