import { GoogleGenerativeAI } from "@google/generative-ai";
import { updateStats, type Stats } from "./stats";
import type { GameState } from ".";

const genAI = new GoogleGenerativeAI("AIzaSyCiOnfKY0lTKEkzT_bBLTKjXm1-S_bddRc");
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function generateDynamicEvent(state: GameState): Promise<any> {
  const { day, stats } = state;
  const prompt = `
    Role: You are an unhinged Dungeon Master for a subway management simulator.

        Context:
        - Current Day: ${day}
        - Current Stats: ${JSON.stringify(stats)} (Ratings are 0-5 stars. Money is not.)
        - Economy: Players earn ~$20,000/day. Balance costs accordingly.

        Geography (The Rail Lines):
        - Red Line: North Plaza, Central Station, Old Town Square, Riverside Terminal.
        - Blue Line: Wild Hen Stadium, Central Station, Leo's Landing, Eastside.
        - Green Line: Old Town Square, West End Junction, Leo's Landing, Three Stop.
        (Note: Some stations are Transfer Hubs where lines cross).

        Escalation Logic:
        1. Days 1-20 (Grounded): Mundane urban issues.
        2. Days 21-49 (Chaotic): Urban legends, sentient grime, cryptids.
        3. Day 50+ (Fantasy): Lovecraftian rifts, asteroid impacts, magic, monsters. Costs and consequences should be much higher.

        Strict Constraints for "delta" values:
        - Star Ratings (safety, cleanliness, etc.): Changes must be SMALL (e.g., -0.1 to +0.3). Never more than 0.5.
        - Money: Use the $20,000/day income as a baseline. Repairs = $500-$5,000. Catastrophes = $10,000-$40,000.
        - Choices: Make the choices phrases up to 7 words with no periods at the end.
        - Geography: If the "description" mentions tracks/rails, ensure it correctly identifies the Line Color based on the location.

        Return ONLY raw JSON matching this schema:
        {
          "id": "unique_string",
          "title": "string",
          "description": "string",
          "locations": ["Valid Location"],
          "choices": [
            {
              "id": "string",
              "label": "string",
              "delta": {
                 "money": number,
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

  // Safety check: Remove markdown formatting if the model ignored the JSON mode instruction
  text = text.replace(/```json|```/gi, "").trim();

  const jsonEvent = JSON.parse(text);

  return {
    ...jsonEvent,
    repeatable: false,
    weight: 1,
    criteria: () => true,
    choices: jsonEvent.choices.map((c: any) => ({
      id: c.id,
      label: c.label,
      onSelect: (state: GameState) => updateStats(state, c.delta),
    })),
  };
}
