import { GoogleGenerativeAI } from "@google/generative-ai";
import { updateStats } from "./stats";
import type { GameState } from ".";

const genAI = new GoogleGenerativeAI("AIzaSyCiOnfKY0lTKEkzT_bBLTKjXm1-S_bddRc");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // Updated to the stable flash model name
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function generateDynamicEvent({
  day,
  stats,
  lines,
}: Pick<GameState, "day" | "stats" | "lines">): Promise<any> {
  // Identify which lines are active
  const activeLines = Object.entries(lines)
    .filter(([_, status]) => status)
    .map(([line, _]) => `${line} Line`);

  const prompt = `
    Role: You are an unhinged Dungeon Master for a subway management simulator.

    Current Game State:
    - Day: ${day}
    - Stats: ${JSON.stringify(stats)}
    - Operational Lines: ${activeLines.join(", ")}
    - Baseline: Daily Profit is $30,000; Base Wage is $200; Target Staff is 40.

    GEOGRAPHY & LOGISTICS:
    - Red Line: North Plaza, Central Station, Old Town Square, Riverside Terminal.
    - Blue Line: Wild Hen Stadium, Central Station, Leo's Landing, Eastside.
    - Green Line: Three Stop, Leo's Landing, Old Town Square, West End Junction.
    - IMPORTANT: Only describe events at locations served by OPERATIONAL LINES.
    - Junctions (Central, Old Town, Leo's) remain accessible if at least ONE of their lines is active.

    CRITICAL MECHANICS (Logic the player is fighting):
    1. Synergy Multipliers: Safety/Security/Cleanliness/Environment affect growth speed (0.7x to 1.3x).
    2. Vulnerability Logic: If a stat is LOW, negative events HIT HARDER (1.3x damage). If HIGH, they are blunted (0.7x).
    3. The Death Spiral:
       - Resignation: If Employee Wellbeing < 1.75 stars, employees quit daily (up to 20%).
       - Understaffing: Below 30 employees, ALL stats passively decay. Below 10, decay is catastrophic.
    4. Customer Trust (Aggressive): Low Station Quality makes Satisfaction gains 0.1x slower and losses 1.9x faster.

    Escalation Logic:
    - Days 1-20 (Grounded): Labor disputes, rats, graffiti, signal failures.
    - Days 21-49 (Chaotic): Cultists in the vents, cryptid stories, sentient grime.
    - Day 50+ (Fantasy): Cosmic horrors, interdimensional portals, alien invasion, magic wars.

    Strict Constraints for "delta" values:
    - Star Ratings: Small increments (-0.2 to +0.3). Use 0.5 only for massive Day 50+ shifts.
    - Employees: Small shifts (1-5). Disasters can be 10-20.
    - Money: Normal ($1k-$5k), High ($10k-$40k).
    - DailyProfit/Expenses: Modify these for permanent economic shifts.

    Return ONLY raw JSON matching this schema:
    {
      "id": "unique_string",
      "title": "string",
      "description": "string",
      "locations": ["Valid Location"],
      "choices": [
        {
          "id": "string",
          "label": "Phrase under 7 words no periods",
          "delta": {
             "money": number,
             "employees": number,
             "employeeWage": number,
             "dailyProfit": number,
             "dailyExpenses": number,
             "safety": number,
             "customerSatisfaction": number,
             "cleanliness": number,
             "employeeWellbeing": number,
             "security": number,
             "environment": number
          }
        }
      ]
    }
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Remove markdown formatting
  text = text.replace(/```json|```/gi, "").trim();

  const jsonEvent = JSON.parse(text);

  return {
    ...jsonEvent,
    repeatable: false,
    weight: 1,
    criteria: () => true,
    choices: jsonEvent.choices.map((c: any) => ({
      ...c,
      onSelect: (state: GameState) => updateStats(state, c.delta),
    })),
  };
}
