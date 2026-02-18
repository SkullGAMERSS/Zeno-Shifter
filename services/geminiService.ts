
import { GoogleGenAI, Type } from "@google/genai";
import { Task, PriorityRule } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const resolveConflicts = async (tasks: Task[], globalRule: PriorityRule): Promise<Task[]> => {
  let strategyDescription = "";
  
  switch(globalRule) {
    case 'urgency':
      strategyDescription = "GLOBAL STRATEGY: URGENCY. Tasks with the highest individual 'urgency' ratings must be prioritized and kept as close to their original start times as possible. Move low-urgency tasks to fill gaps.";
      break;
    case 'importance':
      strategyDescription = "GLOBAL STRATEGY: STRATEGIC IMPACT. Re-organize the day so that tasks with high 'importance' ratings occupy the most focused slots. Lower importance tasks can be shifted or grouped late in the day.";
      break;
    case 'energy':
      strategyDescription = "GLOBAL STRATEGY: ENERGY FLOW. Use the 'energyLevel' metric to prevent burnout. Ensure high-energy tasks are not back-to-back. Use low-energy tasks or health tasks as recovery periods.";
      break;
    default:
      strategyDescription = "Balanced optimization across all metrics.";
  }

  const prompt = `
    You are ZENO, an advanced AI Time Bender in a sci-fi universe.
    You have a list of tasks with scheduling conflicts (overlaps).
    
    ${strategyDescription}
    
    General Rules:
    1. Resolve all overlaps. No two tasks can happen at the same time.
    2. Respect the individual Task Metrics (Urgency, Importance, Energy Level).
    3. Keep durations EXACTLY the same.
    4. Valid time window: 07:00 to 23:00.
    5. Return a valid JSON array of ALL tasks with updated 'startTime' values.

    Task Pool: ${JSON.stringify(tasks)}
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
              urgency: { type: Type.NUMBER },
              importance: { type: Type.NUMBER },
              energyLevel: { type: Type.NUMBER },
              manaCost: { type: Type.NUMBER },
              priority: { type: Type.NUMBER },
            },
            required: ["id", "title", "startTime", "duration", "type", "urgency", "importance", "energyLevel", "manaCost", "priority"]
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
  const sorted = [...tasks].sort((a, b) => (b.urgency + b.importance) - (a.urgency + a.importance));
  const resolved: Task[] = [];
  let currentEnd = 8;
  sorted.forEach(task => {
    const newStart = Math.max(8, currentEnd);
    resolved.push({ ...task, startTime: newStart });
    currentEnd = newStart + task.duration;
  });
  return resolved;
}
