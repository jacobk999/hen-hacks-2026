import type { GameState } from ".";
import { updateStats } from "./stats";

export type SubwayStation =
  | "West End Junction"
  | "Wild Hen Stadium"
  | "Leo's Landing"
  | "Eastside"
  | "Three Stop"
  | "Riverside Terminal"
  | "Central Station"
  | "North Plaza"
  | "Old Town Square";

const allSubwayStations: SubwayStation[] = [
  "West End Junction",
  "Wild Hen Stadium",
  "Leo's Landing",
  "Eastside",
  "Riverside Terminal",
  "Central Station",
  "North Plaza",
  "Old Town Square",
  "Three Stop",
];

export type Location = SubwayStation;

export type Choice = {
  id: string;
  label: string;
  onSelect: (state: GameState) => Partial<GameState> | void;
};

export type EventOccurence = {
  id: Event["id"];
  day: number;
  choice: Event["choices"][number]["id"];
  location: Location;
};

export type Event = {
  // Marker coordinate at a given point. Consistent/pre-designated.
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  locations: Location[];
  repeatable: boolean;
  weight: number;
  criteria: (state: GameState) => boolean;
};

export type CurrentEvent = Omit<Event, "locations" | "weight" | "criteria"> & {
  location: Location;
};

export const events: Event[] = [
  {
    id: "lostdog",
    title: "Lost Dog",
    description: "A lost dog appears at the subway station.",
    choices: [
      {
        id: "takedog",
        label: "Take the dog",
        onSelect: () => {},
      },
      {
        id: "donttakedog",
        label: "Let the dog go",
        onSelect: () => {},
      },
    ],
    locations: ["Leo's Landing"],
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "powersurge",
    title: "Flickering Lights",
    description:
      "The transformers at this station are humming loudly and smoking. An immediate overhaul is expensive, but a blowout would be worse, not to mention possible effects on the environment if left unattended.",
    choices: [
      {
        id: "replacetransformers",
        label: "Replace Transformers",
        onSelect: (state) =>
          updateStats(state, {
            money: -(Math.floor(Math.random() * 700) + 800),
            customerSatisfaction: 0.2,
            safety: 0.2,
            environment: 0.2,
          }),
      },
      {
        id: "patchwiring",
        label: "Patch The Wiring",
        onSelect: (state) =>
          updateStats(state, {
            // Generates a random cost between 300 and 599
            money: -(Math.floor(Math.random() * 300) + 300),
            customerSatisfaction: 0.1,
            safety: -0.2,
            environment: -0.1,
          }),
      },
    ],
    locations: [
      "West End Junction",
      "Wild Hen Stadium",
      "Leo's Landing",
      "Eastside",
      "Riverside Terminal",
      "Central Station",
      "North Plaza",
      "Old Town Square",
    ],
    repeatable: true,
    weight: 3,
    criteria: () => true,
  },
  {
    id: "HomelessPisser",
    title: "Public Bathroom",
    description:
      "A homeless person is urinating on the ground, and it aims it at you, how do you proceed?",
    choices: [
      {
        id: "clean",
        label: "Clean up",
        onSelect: (state) => {
          updateStats(state, {
            money: -1000,
            customerSatisfaction: 0.1,
            employeeWellbeing: -0.05,
            environment: -0.1,
          });
        },
      },
      {
        id: "ignore",
        label: "Ignore",
        onSelect: (state) => {
          updateStats(state, {
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.3,
            environment: -0.1,
          });
        },
      },
      {
        id: "join",
        label: "Join Him",
        onSelect: (state) => {
          updateStats(state, {
            customerSatisfaction: -1,
            employeeWellbeing: -1,
            environment: -0.2,
          });
        },
      },
      {
        id: "fight",
        label: "Fight",
        onSelect: (state) => {
          updateStats(state, {
            customerSatisfaction: 0.02,
            employeeWellbeing: 0.05,
            environment: -0.2,
          });
        },
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "SubwaySmashBros",
    title: "Subway Smash",
    description: "Someone pushes a man onto the tracks, how do you proceed",
    choices: [
      {
        id: "help",
        label: "Help the man up",
        onSelect: (state) => {
          updateStats(state, {
            customerSatisfaction: 0.05,
            employeeWellbeing: 0.05,
            safety: -0.1,
          });
        },
      },
      {
        id: "watchParty",
        label: "Watch morbidly from a distance",
        onSelect: (state) => {
          updateStats(state, {
            customerSatisfaction: -0.05,
            employeeWellbeing: -0.05,
            safety: -0.5,
          });
        },
      },
      {
        id: "Laughter",
        label: "Laugh at man with group",
        onSelect: (state) => {
          updateStats(state, {
            customerSatisfaction: -0.2,
            employeeWellbeing: -0.2,
            safety: -1,
          });
        },
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "EmployeeFire",
    title: "Conduct Layoffs",
    description:
      "Revenue is down. Reducing the workforce will save money on daily expenses, but service quality and morale will plummet.",
    choices: [
      {
        id: "layoff",
        label: "Mass Layoffs",
        onSelect: (state) => {
          // Randomize laying off employees from 40% to 60%
          const layoffPercent = (Math.floor(Math.random() * 21) + 40) / 100;

          // Check how many employees are being layed off
          const employeesToRemove = -Math.floor(
            state.stats.employees * layoffPercent,
          );

          // Get severance pay
          // Example: $5,000 flat + $2,000 per employee removed
          const moneyGained = 5000 + Math.abs(employeesToRemove) * 2000;

          return updateStats(state, {
            money: moneyGained,
            employees: employeesToRemove,
            employeeWellbeing: -0.5,
            customerSatisfaction: -0.2,
            safety: -0.2,
          });
        },
      },
      {
        id: "fireone",
        label: "Fire the 'Bad Apple'",
        onSelect: (state) => {
          return updateStats(state, {
            money: 2000,
            employees: -1,
            employeeWellbeing: 0.1,
          });
        },
      },
      {
        id: "firenone",
        label: "Keep Everyone",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            employeeWellbeing: Math.min(5, state.stats.employeeWellbeing + 0.1),
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.money < 50000, // Only triggers when "business doesn't look good"
  },
  {
    id: "Duncan_1",
    title: "Duncan, the Donut loving Cop",
    description:
      "A police officer wants to buy a donut, but is short on funds, what will you do?",
    choices: [
      {
        id: "YesDonut",
        label: "Pay for donut",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 500,
          },
        }),
      },
      {
        id: "NoDonut",
        label: "Turn away from Duncan",
        onSelect: () => {},
      },
    ],
    locations: ["Leo's Landing"],
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "Duncan_2a",
    title: "The return of Duncan, the Donut loving Cop",
    description:
      "Duncan is happy you got him his donut, and sees someone suspicous get on a subway, even though his shift just ended, he is determined to pay you back, so he follows him, and stops a robbery",
    choices: [
      {
        id: "RobberStopped",
        label: "Continue",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: 0.3,
            employeeWellbeing: 0.2,
          },
        }),
      },
    ],
    locations: ["Leo's Landing"],
    repeatable: false,
    weight: 1,
    criteria: (s) =>
      s.eventOccurences.some(
        (occurence) =>
          occurence.id === "Duncan_1" && occurence.choice === "YesDonut",
      ),
  },
  {
    id: "Duncan_2b",
    title: "The return of Duncan, the Donut loving Cop",
    description:
      "Duncan, sad about not eating a donut, got early, and left as soon as his shift ended, leading a robber to succsesfully mug someone",
    choices: [
      {
        id: "StopRobberFail",
        label: "Continue",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: -0.5,
            employeeWellbeing: -0.3,
          },
        }),
      },
    ],
    locations: ["Leo's Landing"],
    repeatable: false,
    weight: 1,
    criteria: (s) =>
      s.eventOccurences.some(
        (occurence) =>
          occurence.id === "Duncan_1" && occurence.choice === "NoDonut",
      ),
  },
  {
    id: "Math_1",
    title: "The Arabic Mathmetician",
    description:
      "A man who self identifies himself as Big J spots a strange man writing strange characters on a piece of paper, and believes it to be work of a Terrorist, what will you do",
    choices: [
      {
        id: "Arrest",
        label: "Apprehend Suspect",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: 0.1,
            employeeWellbeing: -0.05,
            customerSatisfaction: -0.15,
          },
        }),
      },
      {
        id: "DontArrest",
        label: "Ignore",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: -0.1,
            employeeWellbeing: 0.1,
            customerSatisfaction: 0.2,
          },
        }),
      },
    ],
    locations: ["Eastside"],
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "Math_2a",
    title: "The return of the Arabic Mathmetician",
    description: "The mathematician wants to thank you for not being racist",
    choices: [
      {
        id: "FreeMoney",
        label: "Continue",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: 15000,
          },
        }),
      },
    ],
    locations: ["Eastside"],
    repeatable: false,
    weight: 1,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) =>
          occurence.id === "Math_1" && occurence.choice === "DontArrest",
      ),
  },
  {
    id: "Math_2b",
    title: "The return of the Arabic Mathmetician",
    description: "The mathemetician disregards you for apprehending him",
    choices: [
      {
        id: "NoFreeMoney",
        label: "Continue",
        onSelect: () => {},
      },
    ],
    locations: ["Eastside"],
    repeatable: false,
    weight: 1,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) =>
          occurence.id === "Math_1" && occurence.choice === "Arrest",
      ),
  },
  {
    id: "SwitchFuel",
    title: "New Fuel Opprotunity",
    description:
      "Your company is presetned with a new, eco friendlier fuel, that emits approximatley 10% less CO2, but for 1.5x the cost",
    choices: [
      {
        id: "NewFuel",
        label: "New Fuel",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 15000,
            environment: state.stats.environment + 0.85,
          },
        }),
      },
      {
        id: "OldFuel",
        label: "Old Fuel",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 6000,
            environment: state.stats.environment - 0.45,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 100,
    criteria: () => true,
  },
  {
    id: "",
    title: "Is smoking allowed",
    description:
      "You currently have no rule on smoking, which negatively affects the enviroment, by polluting the air, and contributing to deforestation, what stance will you take?",
    choices: [
      {
        id: "SmokerN",
        label: "Stop the Smoking",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction + 0.1,
            environment: state.stats.environment + 0.05,
          },
        }),
      },
      {
        id: "SmokerY",
        label: "Allow Smoking",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.1,
            environment: state.stats.environment - 0.15,
            money: state.stats.money + 10000,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 100,
    criteria: () => true,
  },
  {
    id: "NoisePollution",
    title: "Noise Pollution",
    description:
      "Your Subway trains have been causing noise pollution, which can significgantly hurt local wildlife, and cause a complete shift in an ecosystem. It is possible to build new sound barriers, but they are costly",
    choices: [
      {
        id: "PurchaseSoundBarriers",
        label: "Purchase Sound Barriers",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 12500,
            environment: state.stats.environment + 0.35,
          },
        }),
      },
      {
        id: "DoNothing",
        label: "Do Nothing",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            environment: state.stats.environment - 0.35,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 100,
    criteria: () => true,
  },
  {
    id: "LawsuitNoise",
    title: "NOTICE! LAWSUIT",
    description:
      "Due to your knowledge, and lack of action against noise pollution, the EPA has levied a $5000 fine against you",
    choices: [
      {
        id: "Continue",
        label: "Continue",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 5000,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) =>
          occurence.id === "NoisePollution" && occurence.choice === "DoNothing",
      ),
  },
  {
    id: "EnviromentalProtest",
    title: "Enviromental Protest",
    description:
      "There is a group of protesters blocking theentrance to a subway, demanding you switch to more efficent fuel, what do you do?",
    choices: [
      {
        id: "AllowP",
        label: "Allow Protests to continue",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.3,
            security: state.stats.security - 0.2,
          },
        }),
      },
      {
        id: "CallPolice",
        label: "Call Police",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 5000,
            security: state.stats.security + 0.1,
            customerSatisfaction: state.stats.customerSatisfaction + 0.1,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) =>
          occurence.id === "NoisePollution" && occurence.choice === "DoNothing",
      ),
  },
  {
    id: "EnviromentalProtest",
    title: "Enviromental Protest",
    description:
      "There is a group of protesters blocking the entrance to a subway, demanding you switch to more efficient fuel, what do you do?",
    choices: [
      {
        id: "AllowP",
        label: "Allow Protests to continue",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.3,
            security: state.stats.security - 0.2,
          },
        }),
      },
      {
        id: "CallPolice",
        label: "Call Police",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 5000,
            security: state.stats.security + 0.1,
            customerSatisfaction: state.stats.customerSatisfaction + 0.1,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) =>
          occurence.id === "NoisePollution" && occurence.choice === "DoNothing",
      ),
  },
  {
    id: "NigerianPrince",
    title: "Nigerian Prince",
    description:
      "An Email Came into Your Inbox, You Are the Sole Heir to a Nigerian Prince's Fortune, but need to Pay $5000 to receive it. What Do You Wish To Do",
    choices: [
      {
        id: "PayPrince",
        label: "Pay the Prince",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 5000,
            security: state.stats.security - 0.2,
          },
        }),
      },
      {
        id: "Ignore",
        label: "Ignore",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: () => true,
  },
  {
    id: "WeddingRing1",
    title: "A Lost Ring",
    description:
      "A man lost his wedding ring riding your subway, and tells you to call 302-457-9891 if it is found",
    choices: [
      {
        id: "Continue",
        label: "Continue",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 5000,
            security: state.stats.security - 0.2,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: () => true,
  },
];
