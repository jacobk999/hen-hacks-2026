import type { ComponentType, ReactElement } from "react";
import { updateStats } from "./stats";
import type { GameState } from ".";

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

export type SubwayLine = "red" | "blue" | "green";

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
  choice: string;
  location: Location;
};

export type EventLog = {
  id: Event["id"];
  title: string;
  subtitle: Location;
};

type BaseEvent = {
  id: string;
  locations: Location[];
  repeatable: boolean;
  weight: number;
  primaryCharacter?: string;
  charImage?: string;
  criteria: (state: GameState) => boolean;
};

export type CustomDialogEvent = BaseEvent & {
  dialog: ComponentType<{ children: ReactElement }>;
};

export type MultipleChoiceEvent = BaseEvent & {
  title: string;
  description: string;
  choices: Choice[];
};

export type Event = MultipleChoiceEvent | CustomDialogEvent;

export type Current<T extends Event> = Omit<T, "locations" | "weight" | "criteria"> & {
  location: Location;
};

export type CurrentEvent = Current<Event>;

export const eventLog: string[] = [];

export const events: Event[] = [
  {
    id: "lostdog",
    title: "Lost Dog",
    description: "A lost dog appears at the subway station. What should we do?",
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
    weight: 1,
    criteria: () => true,
  },
  {
    id: "HomelessPisser",
    title: "Public Bathroom",
    description:
      "A homeless person is urinating on the ground, and aims it at you. What should we do?",
    choices: [
      {
        id: "clean",
        label: "Clean up",
        onSelect: (state) =>
          updateStats(state, {
            money: -1000,
            customerSatisfaction: 0.1,
            employeeWellbeing: -0.05,
            environment: -0.1,
          }),
      },
      {
        id: "ignore",
        label: "Ignore",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.3,
            environment: -0.1,
          }),
      },
      {
        id: "join",
        label: "Join Him",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -1,
            employeeWellbeing: -1,
            environment: -0.2,
          }),
      },
      {
        id: "fight",
        label: "Fight",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.02,
            employeeWellbeing: 0.05,
            environment: -0.2,
          }),
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
    description: "Someone pushes a man onto the tracks. How do you proceed?",
    choices: [
      {
        id: "help",
        label: "Help the man up",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.05,
            employeeWellbeing: 0.05,
            safety: -0.1,
          }),
      },
      {
        id: "watchParty",
        label: "Watch morbidly from a distance",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.05,
            employeeWellbeing: -0.05,
            safety: -0.5,
          }),
      },
      {
        id: "Laughter",
        label: "Laugh at man with group",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.2,
            employeeWellbeing: -0.2,
            safety: -1,
          }),
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
      "Revenue is down. Reducing the workforce will save money on daily expenses, but service quality and morale will plummet. What should we do?",
    choices: [
      {
        id: "layoff",
        label: "Mass Layoffs",
        onSelect: (state) => {
          // Randomize laying off employees from 40% to 60%
          const layoffPercent = (Math.floor(Math.random() * 21) + 40) / 100;

          // Check how many employees are being laid off
          const employeesToRemove = -Math.floor(state.stats.employees * layoffPercent);

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
        onSelect: (state) =>
          updateStats(state, {
            money: 2000,
            employees: -1,
            employeeWellbeing: 0.1,
          }),
      },
      {
        id: "firenone",
        label: "Keep Everyone",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: 0.1,
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
    title: "Duncan, the Donut Loving Cop",
    primaryCharacter: "duncan",
    charImage: "public/characters/duncan.png",
    description: "A police officer wants to buy a donut, but is short on funds. What will you do?",
    choices: [
      {
        id: "YesDonut",
        label: "Pay for donut",
        onSelect: (state) =>
          updateStats(state, {
            money: -500,
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
    criteria: (state) => state.day % 2 !== 0,
  },
  {
    id: "Duncan_2a",
    title: "The Return of Duncan, the Donut Loving Cop",
    primaryCharacter: "duncan",
    charImage: "public/characters/duncan.png",
    description:
      "Duncan is happy you got him his donut, and sees someone suspicious get on a subway. Even though his shift just ended, he is determined to pay you back, so he follows him and stops a robbery.",
    choices: [
      {
        id: "RobberStopped",
        label: "Continue",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.3,
            employeeWellbeing: 0.2,
          }),
      },
    ],
    locations: ["Leo's Landing"],
    repeatable: false,
    weight: 1000,
    criteria: (s) =>
      s.eventOccurences.some(
        (occurence) => occurence.id === "Duncan_1" && occurence.choice === "YesDonut",
      ),
  },
  {
    id: "Duncan_2b",
    title: "The Return of Duncan, the Donut Loving Cop",
    primaryCharacter: "duncan",
    charImage: "public/characters/duncan.png",
    description:
      "Duncan, sad about not eating a donut, got off early and left as soon as his shift ended, leading a robber to successfully mug someone.",
    choices: [
      {
        id: "StopRobberFail",
        label: "Continue",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.5,
            employeeWellbeing: -0.3,
          }),
      },
    ],
    locations: ["Leo's Landing"],
    repeatable: false,
    weight: 1000,
    criteria: (s) =>
      s.eventOccurences.some(
        (occurence) => occurence.id === "Duncan_1" && occurence.choice === "NoDonut",
      ),
  },
  {
    id: "Math_1",
    title: "The Arabic Mathematician",
    primaryCharacter: "sathvik",
    charImage: "public/characters/sathvik.png",
    description:
      "A man who self-identifies as Big J spots a strange man writing strange characters on a piece of paper, and believes it to be the work of a terrorist. What will you do?",
    choices: [
      {
        id: "Arrest",
        label: "Apprehend Suspect",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.1,
            employeeWellbeing: -0.05,
            customerSatisfaction: -0.15,
          }),
      },
      {
        id: "DontArrest",
        label: "Ignore",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.1,
            employeeWellbeing: 0.1,
            customerSatisfaction: 0.2,
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
    title: "The Return of the Arabic Mathematician",
    primaryCharacter: "sathvik",
    charImage: "public/characters/sathvik.png",
    description: "The mathematician wants to thank you for not being racist.",
    choices: [
      {
        id: "FreeMoney",
        label: "Continue",
        onSelect: (state) =>
          updateStats(state, {
            money: 15000,
          }),
      },
    ],
    locations: ["Eastside"],
    repeatable: false,
    weight: 1000,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) => occurence.id === "Math_1" && occurence.choice === "DontArrest",
      ),
  },
  {
    id: "Math_2b",
    title: "The Return of the Arabic Mathematician",
    primaryCharacter: "sathvik",
    charImage: "public/characters/sathvik.png",
    description: "The mathematician disregards you because you apprehended him.",
    choices: [
      {
        id: "NoFreeMoney",
        label: "Continue",
        onSelect: () => {},
      },
    ],
    locations: ["Eastside"],
    repeatable: false,
    weight: 1000,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) => occurence.id === "Math_1" && occurence.choice === "Arrest",
      ),
  },
  {
    id: "SwitchFuel",
    title: "New Fuel Opportunity",
    description:
      "Your company is presented with a new, eco-friendlier fuel that emits approximately 10% less CO2, but for $15,000.",
    choices: [
      {
        id: "NewFuel",
        label: "New Fuel",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            environment: 0.85,
          }),
      },
      {
        id: "OldFuel",
        label: "Old Fuel",
        onSelect: (state) =>
          updateStats(state, {
            money: -6000,
            environment: -0.45,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => (state.day - 1) % 13 === 0,
  },
  {
    id: "smoking",
    title: "Is Smoking Allowed?",
    description:
      "You currently have no rule on smoking, which negatively affects the environment by polluting the air and contributing to deforestation. What stance will you take?",
    choices: [
      {
        id: "SmokerN",
        label: "Stop the Smoking",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.1,
            environment: 0.05,
          }),
      },
      {
        id: "SmokerY",
        label: "Allow Smoking",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
            environment: -0.15,
            money: 10000,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.day % 7 === 0,
  },
  {
    id: "NoisePollution",
    title: "Noise Pollution",
    description:
      "Metro trains have been causing noise pollution, which can significantly hurt local wildlife and cause a complete shift in an ecosystem. It is possible to build new sound barriers, but they are costly.",
    choices: [
      {
        id: "PurchaseSoundBarriers",
        label: "Purchase Sound Barriers",
        onSelect: (state) =>
          updateStats(state, {
            money: -12500,
            environment: 0.35,
          }),
      },
      {
        id: "DoNothing",
        label: "Do Nothing",
        onSelect: (state) =>
          updateStats(state, {
            environment: -0.35,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "LawsuitNoise",
    title: "NOTICE! LAWSUIT",
    description:
      "Due to your knowledge of, and lack of action against noise pollution, the EPA has levied a $5,000 fine against you.",
    choices: [
      {
        id: "Continue",
        label: "Continue",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1000,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) => occurence.id === "NoisePollution" && occurence.choice === "DoNothing",
      ),
  },
  {
    id: "EnviromentalProtest",
    title: "Environmental Protest",
    description:
      "There is a group of protesters blocking the entrance to a subway, demanding you build sound barriers that you previously refused to. What do you do?",
    choices: [
      {
        id: "AllowP",
        label: "Allow Protests to Continue",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.3,
            security: -0.2,
          }),
      },
      {
        id: "CallPolice",
        label: "Call Police",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
            security: 0.1,
            customerSatisfaction: 0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 2,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) => occurence.id === "NoisePollution" && occurence.choice === "DoNothing",
      ),
  },
  {
    id: "NigerianPrince",
    title: "Nigerian Prince",
    description:
      "An email came into your inbox. You are the sole heir to a Nigerian prince's fortune, but need to pay $5,000 to receive it. What do you wish to do?",
    choices: [
      {
        id: "PayPrince",
        label: "Pay the Prince",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
            security: -0.2,
          }),
      },
      {
        id: "Ignore",
        label: "Ignore",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "WeddingRing1",
    title: "A Lost Ring",
    description:
      "A man lost his wedding ring riding your subway, and tells you to call 302-457-9891 if it is found.",
    choices: [
      {
        id: "Continue",
        label: "Continue",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "WeddingRing2",
    title: "A Found Ring",
    description: "A ring was found on the subway. Who should we call to return it to?",
    choices: [
      {
        id: "302-457-9891",
        label: "302-457-9891",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.43,
          }),
      },
      {
        id: "302-457-9091",
        label: "302-457-9091",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.34,
          }),
      },
      {
        id: "PawnRing",
        label: "Pawn off the ring",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.63,
            money: 2500,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: (state) => state.eventOccurences.some((occurence) => occurence.id === "WeddingRing1"),
  },
  {
    id: "AppHack",
    title: "Metro App Hack",
    description:
      "Our security has been breached on our Metro App, and sensitive data is vulnerable. What should we do?",
    choices: [
      {
        id: "Hire",
        label: "Hire a Cybersecurity Expert named Ayden",
        onSelect: (state) =>
          updateStats(state, {
            money: -6000,
            security: 0.4,
          }),
      },
      {
        id: "Do Nothing",
        label: "Do Nothing",
        onSelect: (state) =>
          updateStats(state, {
            security: -0.3,
          }),
      },
      {
        id: "RemoveApp",
        label: "Get Rid of the App",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.33,
            money: -500,
            employeeWellbeing: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.day % 9 === 2,
  },
  {
    id: "DataLeak",
    title: "Data Leak",
    description: "Your customers' data has been leaked, and you've been served a lawsuit.",
    choices: [
      {
        id: "PayLawsuit",
        label: "Pay the Lawsuit",
        onSelect: (state) =>
          updateStats(state, {
            money: -50000,
            customerSatisfaction: -0.55,
            security: -0.3,
            employeeWellbeing: -0.3,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) => occurence.id === "AppHack" && occurence.choice == "Do Nothing",
      ),
  },
  {
    id: "JesusScanner",
    title: "Broken Scanner",
    description: "Your metro card scanner has malfunctioned. What should we do?",
    choices: [
      {
        id: "Handyman",
        label: "Dispatch a handyman",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
            cleanliness: -0.1,
            employeeWellbeing: 0.1,
            money: -1220,
          }),
      },
      {
        id: "Employee",
        label: "Have an Employee scan cards",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "Nothing",
        label: "Do nothing, and lose profits",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.3,
            money: -15000,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },
  // {
  //   id: "Kat1",
  //   dialog: KatDrugsDialog,
  //   // title: "Kat, the Drug Sniffing Dog",
  //   // description:
  //   //   "Kat, the Drug Sniffing Dog, has started pulling towards a group of suspicious individuals. What should we do?",
  //   // choices: [
  //   //   {
  //   //     id: "Run",
  //   //     label: "Let the dog run ahead",
  //   //     onSelect: (state) => ({
  //   //       stats: {
  //   //         ...state.stats,
  //   //       },
  //   //     }),
  //   //   },
  //   //   {
  //   //     id: "Stop",
  //   //     label: "Stop the dog",
  //   //     onSelect: (state) => ({
  //   //       stats: {
  //   //         ...state.stats,
  //   //       },
  //   //     }),
  //   //   },
  //   // ],
  //   locations: allSubwayStations,
  //   repeatable: false,
  //   weight: 150,
  //   criteria: () => true,
  // },
  {
    id: "Schizo",
    title: "Harassment",
    description:
      "There is a mentally ill passenger who is harassing other passengers. What should we do?",
    choices: [
      {
        id: "Duncan",
        label: "Have Duncan the Donut Cop restrain him",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.1,
            customerSatisfaction: 0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.eventOccurences.some((occurence) => occurence.id === "Duncan_1"),
  },
  {
    id: "Schizo2",
    title: "Harassment",
    description:
      "There is a mentally ill passenger who is harassing other passengers. What should we do?",
    choices: [
      {
        id: "DoNothing",
        label: "I don't know any police...",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.2,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (s) => !s.eventOccurences.some((occurence) => occurence.id === "Duncan_1"),
  },
  {
    id: "CSGO",
    title: "Terrorist Attack",
    description: "A bomb has been planted in one of 3 subway lines. Which one is it?",
    choices: [
      {
        id: "Red",
        label: "Red Line",
        onSelect: (state) => {
          updateStats(state, {
            safety: -0.8,
            money: -10000,
            employeeWellbeing: -1.2,
            customerSatisfaction: -1.5,
          });

          return {
            lines: { ...state.lines, green: false },
          };
        },
      },
      {
        id: "Blue",
        label: "Blue Line",
        onSelect: (state) => {
          updateStats(state, {
            safety: -0.8,
            money: -10000,
            employeeWellbeing: -1.2,
            customerSatisfaction: -1.5,
          });

          return {
            lines: { ...state.lines, green: false },
          };
        },
      },
      {
        id: "Green",
        label: "Green Line",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.8,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: () => true,
  },
  {
    id: "CSGO_FIX",
    title: "Fix the Green Line?",
    description: "A bomb blew up the Green Line. Will you fix it?",
    choices: [
      {
        id: "yes",
        label: "We Desperately Need It",
        onSelect: (state) => ({
          lines: { ...state.lines, green: true },
          stats: {
            ...state.stats,
            safety: state.stats.safety - 0.8,
            money: state.stats.money - 50000,
            employeeWellbeing: state.stats.employeeWellbeing - 1.2,
            customerSatisfaction: state.stats.customerSatisfaction - 1.5,
          },
        }),
      },
      {
        id: "no",
        label: "Subway is Doing Just Fine Without It",
        onSelect: (state) =>
          updateStats(state, {
            safety: -1.8,
            employeeWellbeing: -2.0,
            customerSatisfaction: -1.5,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1000,
    criteria: (s) => !s.lines.green,
  },
  {
    id: "IBQ2",
    title: "Mysterious Video Game",
    description:
      "A mysterious man offers to sell you a video game that contains magical properties, for the low price of $1,000.",
    choices: [
      {
        id: "Buy",
        label: "Purchase the game",
        onSelect: (state) =>
          updateStats(state, {
            money: -1000,
            customerSatisfaction: 5,
            cleanliness: 5,
            security: 5,
            employeeWellbeing: 5,
          }),
      },
      {
        id: "NoDeal",
        label: "Walk away",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0,
    criteria: () => true,
  },
  {
    id: "MommyIssues",
    title: "Lost Kid",
    description: "A lost child asks you for help finding his mother. What can we do?",
    choices: [
      {
        id: "PaAnnouncement",
        label: "PA announcement",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.1,
            safety: 0.05,
          }),
      },
      {
        id: "AmberAlert",
        label: "Amber Alert",
        onSelect: (state) =>
          updateStats(state, {
            money: -1000,
            customerSatisfaction: 0.2,
            safety: 0.2,
          }),
      },
      {
        id: "NA",
        label: 'Tell the kid to "tough it out"',
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.2,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (s) =>
      // wait at least 7 days since last occurrence of MommyIssues
      s.eventOccurences
        .filter((event) => event.id === "MommyIssues")
        .every((event) => s.day - event.day > 7),
  },
  {
    id: "Detatch",
    title: "Car Detachment",
    description: "A car has detached from the train. We need to think fast.",
    choices: [
      {
        id: "Stop all trains",
        label: "Stop all trains",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.2,
            customerSatisfaction: -0.2,
          }),
      },
      {
        id: "Use the next train as a booster",
        label: "Use the next train as a booster",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.1,
            safety: -1.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "Strike",
    title: "Employee Strike",
    description: "Your employees are unionizing. We have to be smart about this.",
    choices: [
      {
        id: "Cave",
        label: "Cave",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            employeeWellbeing: 0.5,
            employeeWage: 50,
            customerSatisfaction: 0.15,
          }),
      },
      {
        id: "ForceWork",
        label: "Force Work",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.5,
            employeeWellbeing: -0.5,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "StrayDog",
    title: "A Stray Dog",
    description: "A stray dog wandered into one of our tunnels and is biting people.",
    choices: [
      {
        id: "AnimalControl",
        label: "Call Animal Control",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
            customerSatisfaction: 0.1,
            security: 0.1,
          }),
      },
      {
        id: "Be cheap and ignore it",
        label: "Be cheap and ignore it",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.25,
            security: -0.25,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "Elevator",
    title: "Elevator Breakdown",
    description: "An elevator is malfunctioning. What do you do?",
    choices: [
      {
        id: "Send",
        label: "Send an Elevator Technician",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            customerSatisfaction: 0.1,
            cleanliness: 0.1,
          }),
      },
      {
        id: "DoNothing",
        label: "Do Nothing",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.15,
            cleanliness: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "Handicap",
    title: "Handicap Access",
    description:
      "A lawsuit has appeared, as there is no access for wheelchair users due to a broken elevator.",
    choices: [
      {
        id: "Continue",
        label: "Continue",
        onSelect: (state) =>
          updateStats(state, {
            money: -25000,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1000,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) => occurence.id === "Elevator" && occurence.choice == "DoNothing",
      ),
  },
  {
    id: "BigJ1",
    title: "Meeting with Big J",
    primaryCharacter: "bigj",
    charImage: "public/characters/bigj.png",
    description: "Big J has a new idea for a metro station that exclusively uses cryptocurrency.",
    choices: [
      {
        id: "Crypto",
        label: "Transition your station to crypto only",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.4,
            security: 0.2,
          }),
      },
      {
        id: "CryptNo",
        label: "Deny this request",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },
  {
    id: "FareIncrease",
    title: "Fare Price Review",
    description:
      "Operational costs are rising. Should we raise ticket prices to cover expenses, at the risk of upsetting riders?",
    choices: [
      {
        id: "RaiseFare",
        label: "Raise Fares",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: 3000,
            customerSatisfaction: -0.25,
          }),
      },
      {
        id: "HoldFare",
        label: "Keep Fares the Same",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "LowerFare",
        label: "Lower Fares to Attract Riders",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -2000,
            customerSatisfaction: 0.35,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.day % 10 === 0,
  },

  {
    id: "OvertimeRequest",
    title: "Overtime Request",
    description:
      "A sudden staff shortage means trains will run late unless employees work overtime.",
    choices: [
      {
        id: "PayOvertime",
        label: "Approve Overtime Pay",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: 1200,
            employeeWellbeing: 0.2,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "DenyOvertime",
        label: "Deny Overtime",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: -0.3,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "CleaningCrew",
    title: "Cleaning Contract",
    description:
      "Our current cleaning contract is up for renewal. We can upgrade to a premium service, go budget, or handle it in-house.",
    choices: [
      {
        id: "PremiumClean",
        label: "Premium Cleaning Service",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: 800,
            cleanliness: 0.5,
            customerSatisfaction: 0.15,
          }),
      },
      {
        id: "BudgetClean",
        label: "Budget Cleaning Service",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: 200,
            cleanliness: -0.2,
          }),
      },
      {
        id: "InHouseClean",
        label: "Train Employees to Clean In-House",
        onSelect: (state) =>
          updateStats(state, {
            cleanliness: 0.1,
            employeeWellbeing: -0.15,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.day % 14 === 0,
  },

  {
    id: "NewHire",
    title: "Hiring Drive",
    description: "We have the opportunity to run a hiring campaign to build our workforce.",
    choices: [
      {
        id: "LargeHire",
        label: "Full Campaign",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            employees: 10,
            employeeWellbeing: 0.1,
          }),
      },
      {
        id: "SmallHire",
        label: "Small Posting",
        onSelect: (state) =>
          updateStats(state, {
            money: -4000,
            employees: 3,
          }),
      },
      {
        id: "NoHire",
        label: "We're Fine",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.employees < 40,
  },

  {
    id: "TrainDelay",
    title: "Train Delays",
    description:
      "A signal fault is causing widespread delays across the network. Passengers are furious.",
    choices: [
      {
        id: "EmergencyRepair",
        label: "Emergency Signal Repair",
        onSelect: (state) =>
          updateStats(state, {
            money: -12000,
            customerSatisfaction: 0.2,
            safety: 0.15,
          }),
      },
      {
        id: "ManualOverride",
        label: "Run on Manual Override",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
            safety: -0.3,
          }),
      },
      {
        id: "SuspendService",
        label: "Suspend Service Until Fixed",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -20000,
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "GraffitiWall",
    title: "Graffiti on Station Walls",
    description:
      "Someone has tagged several station walls with graffiti overnight. It is extensive.",
    choices: [
      {
        id: "RemoveGraffiti",
        label: "Professional Removal",
        onSelect: (state) =>
          updateStats(state, {
            money: -3500,
            cleanliness: 0.35,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "PaintOver",
        label: "Paint Over It Ourselves",
        onSelect: (state) =>
          updateStats(state, {
            cleanliness: 0.1,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "LeaveGraffiti",
        label: "Leave It — Call It Art",
        onSelect: (state) =>
          updateStats(state, {
            cleanliness: -0.3,
            customerSatisfaction: -0.15,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "RatInfestation",
    title: "Rat Infestation",
    description:
      "Passengers are reporting rats on the platforms. This is a health hazard and a PR nightmare.",
    choices: [
      {
        id: "Exterminator",
        label: "Hire an Exterminator",
        onSelect: (state) =>
          updateStats(state, {
            money: -6000,
            cleanliness: 0.4,
            customerSatisfaction: 0.2,
            environment: -0.1,
          }),
      },
      {
        id: "Traps",
        label: "Set Traps Ourselves",
        onSelect: (state) =>
          updateStats(state, {
            cleanliness: 0.1,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "IgnoreRats",
        label: "They're Harmless",
        onSelect: (state) =>
          updateStats(state, {
            cleanliness: -0.5,
            customerSatisfaction: -0.4,
            environment: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "FloodedTunnel",
    title: "Flooded Tunnel",
    description: "Heavy rain has flooded a tunnel section, halting trains on the affected segment.",
    choices: [
      {
        id: "PumpItOut",
        label: "Emergency Pumping Crew",
        onSelect: (state) =>
          updateStats(state, {
            money: -18000,
            safety: 0.2,
            customerSatisfaction: 0.15,
            environment: -0.1,
          }),
      },
      {
        id: "RerouteTrains",
        label: "Reroute Trains Around the Flood",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.2,
            employeeWellbeing: -0.1,
          }),
      },
    ],
    locations: ["Riverside Terminal", "Central Station", "Old Town Square"],
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "RaiseWages",
    title: "Wage Review",
    description:
      "It has been a while since wages were last reviewed. Employees are beginning to grumble about pay.",
    choices: [
      {
        id: "BigRaise",
        label: "Meaningful Raise",
        onSelect: (state) =>
          updateStats(state, {
            employeeWage: 50,
            employeeWellbeing: 0.4,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "SmallRaise",
        label: "Token Raise",
        onSelect: (state) =>
          updateStats(state, {
            employeeWage: 15,
            employeeWellbeing: 0.1,
          }),
      },
      {
        id: "NoRaise",
        label: "Budget Doesn't Allow It",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: -0.25,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.day % 15 === 0,
  },

  {
    id: "SeasonalDecor",
    title: "Holiday Decorations",
    description:
      "The holidays are approaching. Should we decorate the stations to get into the festive spirit?",
    choices: [
      {
        id: "FullDecor",
        label: "Full Holiday Decorations",
        onSelect: (state) =>
          updateStats(state, {
            money: -4000,
            customerSatisfaction: 0.25,
            cleanliness: -0.05,
            employeeWellbeing: 0.1,
          }),
      },
      {
        id: "MinimalDecor",
        label: "Just a Few Wreaths",
        onSelect: (state) =>
          updateStats(state, {
            money: -500,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "NoDecor",
        label: "We Are a Professional Transit Authority",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.day % 30 === 0,
  },

  // ── KAREN ARC ────────────────────────────────────────────────

  {
    id: "Karen_1",
    title: "A Complaint at the Desk",
    primaryCharacter: "karen",
    charImage: "public/characters/karen.png",
    description:
      "A woman at the service desk is demanding a full refund for her monthly pass, claiming the trains are 'always late' and 'smell weird.' She is very loud.",
    choices: [
      {
        id: "RefundKaren",
        label: "Issue the Refund",
        onSelect: (state) =>
          updateStats(state, {
            money: -200,
            customerSatisfaction: 0.1,
            employeeWellbeing: -0.05,
          }),
      },
      {
        id: "DenyKaren",
        label: "Politely Deny the Refund",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
            employeeWellbeing: -0.1,
          }),
      },
    ],
    locations: ["Central Station", "North Plaza"],
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "Karen_2",
    title: "Karen's Yelp Review",
    primaryCharacter: "karen",
    charImage: "public/characters/karen.png",
    description:
      "Karen left a scathing 1-star review online after her last visit. It is going viral. Other passengers are reading it.",
    choices: [
      {
        id: "PublicApology",
        label: "Issue a Public Apology",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.15,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "IgnoreReview",
        label: "Ignore It",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.2,
          }),
      },
      {
        id: "RespondFirmly",
        label: "Respond Professionally but Firmly",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.05,
            employeeWellbeing: 0.1,
          }),
      },
    ],
    locations: ["Central Station", "North Plaza"],
    repeatable: false,
    weight: 500,
    criteria: (state) => state.eventOccurences.some((o) => o.id === "Karen_1"),
  },

  {
    id: "Karen_3",
    title: "Karen Runs for City Council",
    primaryCharacter: "karen",
    charImage: "public/characters/karen.png",
    description:
      "Karen is running for city council on a platform of 'holding the transit authority accountable.' She is gaining traction.",
    choices: [
      {
        id: "IgnoreKarenPolitics",
        label: "She Won't Win",
        onSelect: (state) =>
          updateStats(state, {
            security: -0.2,
            customerSatisfaction: -0.15,
          }),
      },
      {
        id: "MeetWithKaren",
        label: "Invite Her for a Station Tour",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.2,
            employeeWellbeing: 0.1,
          }),
      },
    ],
    locations: ["Central Station", "North Plaza"],
    repeatable: false,
    weight: 500,
    criteria: (state) => state.eventOccurences.some((o) => o.id === "Karen_2"),
  },

  // ── KAT & LILA ARC ───────────────────────────────────────────

  {
    id: "Kat_1",
    title: "Kat the Dog",
    primaryCharacter: "kat",
    charImage: "public/characters/kat.png",
    description:
      "A woman named Lila has brought her dog, Kat, onto the subway. Kat seems agitated and is sniffing frantically around one passenger's bag. Do you investigate?",
    choices: [
      {
        id: "InvestigateKat",
        label: "Ask the passenger to open their bag",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.2,
            customerSatisfaction: -0.05,
          }),
      },
      {
        id: "IgnoreKat",
        label: "It is just a dog being a dog",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.15,
          }),
      },
    ],
    locations: ["Leo's Landing", "Eastside", "Wild Hen Stadium"],
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "Kat_2a",
    title: "Kat Was Right",
    primaryCharacter: "lila",
    charImage: "public/characters/lila.png",
    description:
      "The bag contained contraband. Lila and Kat are praised by other passengers, and Duncan files a commendation. Morale is up.",
    choices: [
      {
        id: "KatHeroine",
        label: "Continue",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.3,
            customerSatisfaction: 0.2,
            employeeWellbeing: 0.15,
          }),
      },
    ],
    locations: ["Leo's Landing", "Eastside", "Wild Hen Stadium"],
    repeatable: false,
    weight: 1000,
    criteria: (state) =>
      state.eventOccurences.some((o) => o.id === "Kat_1" && o.choice === "InvestigateKat"),
  },

  {
    id: "Kat_2b",
    title: "Kat Was Right and We Did Nothing",
    primaryCharacter: "lila",
    charImage: "public/characters/lila.png",
    description:
      "The passenger with the suspicious bag was later arrested at another station. Lila is furious you ignored her dog. The story hits local news.",
    choices: [
      {
        id: "KatIgnored",
        label: "Continue",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.4,
            customerSatisfaction: -0.3,
            security: -0.15,
          }),
      },
    ],
    locations: ["Leo's Landing", "Eastside", "Wild Hen Stadium"],
    repeatable: false,
    weight: 1000,
    criteria: (state) =>
      state.eventOccurences.some((o) => o.id === "Kat_1" && o.choice === "IgnoreKat"),
  },

  {
    id: "Kat_3",
    title: "Lila Offers Kat's Services",
    primaryCharacter: "lila",
    charImage: "public/characters/lila.png",
    description:
      "After the incident, Lila offers to bring Kat in regularly as an informal security presence. It would cost nothing but she would need platform access.",
    choices: [
      {
        id: "AcceptKat",
        label: "Welcome Kat Aboard",
        onSelect: (state) =>
          updateStats(state, {
            security: 0.3,
            safety: 0.1,
            customerSatisfaction: 0.15,
          }),
      },
      {
        id: "DeclineKat",
        label: "We Can't Have Dogs on the Platform",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.05,
          }),
      },
    ],
    locations: ["Leo's Landing", "Eastside", "Wild Hen Stadium"],
    repeatable: false,
    weight: 1000,
    criteria: (state) => state.eventOccurences.some((o) => o.id === "Kat_2a"),
  },

  // ── JESSICA / ZODIAC STORE ARC ───────────────────────────────

  {
    id: "Jessica_1",
    title: "Station Vendor Application",
    primaryCharacter: "zodiacStore",
    charImage: "public/characters/jessica.png",
    description:
      "Jessica wants to open a small zodiac and crystal shop inside the station. It would bring in rental income, but it might attract a niche crowd.",
    choices: [
      {
        id: "AllowJessica",
        label: "Approve the Vendor Stall",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: 300,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "DenyJessica",
        label: "Deny the Application",
        onSelect: () => {},
      },
    ],
    locations: ["Central Station", "West End Junction", "Old Town Square"],
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "Jessica_2",
    title: "Incense Complaint",
    primaryCharacter: "zodiacStore",
    charImage: "public/characters/jessica.png",
    description:
      "Jessica is burning incense in her stall again. Passengers are complaining about the smell. She insists it 'cleanses the energy of the station.'",
    choices: [
      {
        id: "BanIncense",
        label: "Ban the Incense",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.1,
            cleanliness: 0.1,
          }),
      },
      {
        id: "AllowIncense",
        label: "Let Her Be",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
            cleanliness: -0.1,
          }),
      },
    ],
    locations: ["Central Station", "West End Junction", "Old Town Square"],
    repeatable: false,
    weight: 500,
    criteria: (state) =>
      state.eventOccurences.some((o) => o.id === "Jessica_1" && o.choice === "AllowJessica"),
  },

  {
    id: "Jessica_3",
    title: "Jessica's Prediction",
    primaryCharacter: "zodiacStore",
    charImage: "public/characters/jessica.png",
    description:
      "Jessica pulls you aside and warns that her tarot cards predicted a 'great disruption' on the station this week. Do you take any precautions?",
    choices: [
      {
        id: "HeedJessica",
        label: "Run Extra Safety Checks",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.2,
            employeeWellbeing: -0.05,
          }),
      },
      {
        id: "IgnoreJessica",
        label: "It is Just Cards",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.15,
          }),
      },
    ],
    locations: ["Central Station", "West End Junction", "Old Town Square"],
    repeatable: true,
    weight: 500,
    criteria: (state) =>
      state.eventOccurences.some((o) => o.id === "Jessica_1" && o.choice === "AllowJessica"),
  },

  // ── BIG J ARC (continued) ────────────────────────────────────

  {
    id: "BigJ_2",
    title: "Big J's PA Sponsorship",
    primaryCharacter: "bigj",
    charImage: "public/characters/bigj.png",
    description:
      "Big J wants to sponsor the station's PA system. His ads would play between announcements in exchange for a monthly payment.",
    choices: [
      {
        id: "AcceptBigJPA",
        label: "Accept the Sponsorship",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: 800,
            customerSatisfaction: -0.2,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "DenyBigJPA",
        label: "Decline",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.eventOccurences.some((o) => o.id === "BigJ1"),
  },

  {
    id: "BigJ_3",
    title: "Big J's Food Stand",
    primaryCharacter: "bigj",
    charImage: "public/characters/bigj.png",
    description:
      "Big J wants to open a hot dog stand on the platform. He promises a revenue cut, but the smell and crowds could be an issue.",
    choices: [
      {
        id: "AllowStand",
        label: "Allow the Stand",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: 400,
            cleanliness: -0.2,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "DenyStand",
        label: "Not on Our Platform",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.eventOccurences.some((o) => o.id === "BigJ1"),
  },

  {
    id: "BigJ_4",
    title: "Big J Gets Arrested",
    primaryCharacter: "bigj",
    charImage: "public/characters/bigj.png",
    description:
      "Big J has been arrested on the platform for fare evasion — again. Duncan is involved. Do you press charges or let it slide?",
    choices: [
      {
        id: "PressChargesBigJ",
        label: "Press Charges",
        onSelect: (state) =>
          updateStats(state, {
            security: 0.15,
            customerSatisfaction: -0.05,
          }),
      },
      {
        id: "LetSlideBigJ",
        label: "Let Him Off with a Warning",
        onSelect: (state) =>
          updateStats(state, {
            security: -0.1,
            employeeWellbeing: 0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) =>
      state.eventOccurences.some((o) => o.id === "BigJ1") &&
      state.eventOccurences.some((o) => o.id === "Duncan_1"),
  },

  // ── SATHVIK ARC (continued) ──────────────────────────────────

  {
    id: "Sathvik_3",
    title: "Sathvik's Internship Application",
    primaryCharacter: "sathvik",
    charImage: "public/characters/sathvik.png",
    description:
      "Sathvik, the aspiring engineer, has applied for an unpaid internship with the transit authority's engineering department.",
    choices: [
      {
        id: "HireSathvik",
        label: "Accept the Intern",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: 0.1,
            safety: 0.15,
          }),
      },
      {
        id: "RejectSathvik",
        label: "We Don't Have the Capacity",
        onSelect: () => {},
      },
    ],
    locations: ["Eastside"],
    repeatable: false,
    weight: 1,
    criteria: (state) => state.eventOccurences.some((o) => o.id === "Math_2a"),
  },

  {
    id: "Sathvik_4",
    title: "Sathvik's Safety Report",
    primaryCharacter: "sathvik",
    charImage: "public/characters/sathvik.png",
    description:
      "Sathvik has completed his internship and filed a detailed safety report identifying two critical infrastructure vulnerabilities. Do you act on it?",
    choices: [
      {
        id: "ActOnReport",
        label: "Implement His Recommendations",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            safety: 0.45,
            employeeWellbeing: 0.2,
          }),
      },
      {
        id: "ShelfReport",
        label: "File It Away",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.25,
            employeeWellbeing: -0.1,
          }),
      },
    ],
    locations: ["Eastside"],
    repeatable: false,
    weight: 1000,
    criteria: (state) =>
      state.eventOccurences.some((o) => o.id === "Sathvik_3" && o.choice === "HireSathvik"),
  },

  // ── SAFETY & SECURITY ────────────────────────────────────────

  {
    id: "PlatformFight",
    title: "Platform Brawl",
    description:
      "Two passengers have gotten into a physical fight on the platform. Other riders are filming instead of helping.",
    choices: [
      {
        id: "CallCopsFight",
        label: "Call the Police",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.2,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "StaffIntervene",
        label: "Send a Staff Member to Intervene",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.1,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "WatchFight",
        label: "Observe from CCTV",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.3,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "SuspiciousPackage",
    title: "Suspicious Package",
    description:
      "An unattended bag has been sitting on a bench at the station for over two hours. Passengers are nervous.",
    choices: [
      {
        id: "EvacuateStation",
        label: "Evacuate the Station",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -10000,
            safety: 0.4,
            customerSatisfaction: -0.2,
          }),
      },
      {
        id: "InspectBag",
        label: "Have a Staff Member Check the Bag",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.1,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "AnnounceBag",
        label: "Make a PA Announcement",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.05,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "CCTVUpgrade",
    title: "CCTV Upgrade Offer",
    description:
      "A security firm is offering to upgrade our aging CCTV network. Better cameras would significantly improve station security.",
    choices: [
      {
        id: "FullUpgrade",
        label: "Full HD with Facial Recognition",
        onSelect: (state) =>
          updateStats(state, {
            money: -30000,
            security: 0.6,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "BasicUpgrade",
        label: "Basic HD Cameras Only",
        onSelect: (state) =>
          updateStats(state, {
            money: -12000,
            security: 0.3,
          }),
      },
      {
        id: "NoUpgrade",
        label: "Our Current Cameras Are Fine",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "DrunkPassenger",
    title: "Intoxicated Passenger",
    description:
      "A visibly intoxicated passenger is stumbling near the platform edge and is a danger to themselves and others.",
    choices: [
      {
        id: "EscortOut",
        label: "Escort Them Out of the Station",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.15,
            customerSatisfaction: 0.05,
            employeeWellbeing: -0.05,
          }),
      },
      {
        id: "CallAmbulanceDrunk",
        label: "Call an Ambulance",
        onSelect: (state) =>
          updateStats(state, {
            money: -1000,
            safety: 0.2,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "IgnoreDrunk",
        label: "Not Our Problem",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.4,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "PlatformGap",
    title: "Platform Gap Injury",
    description:
      "A passenger has twisted their ankle falling into the gap between the train and the platform. They are threatening to sue.",
    choices: [
      {
        id: "Settle",
        label: "Settle Out of Court",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            customerSatisfaction: 0.05,
          }),
      },
      {
        id: "FightLawsuit",
        label: "Contest in Court",
        onSelect: (state) =>
          updateStats(state, {
            money: -(Math.random() > 0.4 ? 25000 : 0),
            customerSatisfaction: -0.15,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "SettleAndFix",
        label: "Settle and Install Gap Warning Strips",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            safety: 0.25,
            customerSatisfaction: 0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "WhistleblowerReport",
    title: "Whistleblower Report",
    description:
      "An anonymous employee has filed a report alleging unsafe working conditions in the maintenance tunnels. The report has reached local media.",
    choices: [
      {
        id: "Investigate",
        label: "Launch an Internal Investigation",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
            safety: 0.25,
            employeeWellbeing: 0.2,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "DismissReport",
        label: "Deny the Allegations Publicly",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.25,
            employeeWellbeing: -0.3,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.safety < 2.5,
  },

  {
    id: "EmployeeTheft",
    title: "Employee Theft",
    description: "A staff member has been caught stealing from the ticket revenue.",
    choices: [
      {
        id: "FireThief",
        label: "Terminate and Press Charges",
        onSelect: (state) =>
          updateStats(state, {
            money: -3000,
            employees: -1,
            security: 0.15,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "WarnThief",
        label: "Final Warning and Docked Pay",
        onSelect: (state) =>
          updateStats(state, {
            money: -1500,
            security: -0.1,
          }),
      },
      {
        id: "IgnoreTheft",
        label: "Look the Other Way",
        onSelect: (state) =>
          updateStats(state, {
            money: -3000,
            security: -0.35,
            employeeWellbeing: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  // ── ENVIRONMENT ──────────────────────────────────────────────

  {
    id: "SolarPanelOffer",
    title: "Solar Panel Initiative",
    description:
      "A green energy company wants to install solar panels on station rooftops. Initial costs are high but it would reduce energy expenses long-term.",
    choices: [
      {
        id: "InstallSolar",
        label: "Full Installation",
        onSelect: (state) =>
          updateStats(state, {
            money: -25000,
            dailyExpenses: -500,
            environment: 0.6,
            customerSatisfaction: 0.15,
          }),
      },
      {
        id: "PartialSolar",
        label: "Pilot Program — One Station",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            environment: 0.2,
          }),
      },
      {
        id: "NoSolar",
        label: "Too Expensive Right Now",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "OilSpill",
    title: "Maintenance Oil Spill",
    description:
      "A routine maintenance job resulted in an oil spill in the maintenance area. It hasn't reached the public yet, but it needs to be contained.",
    choices: [
      {
        id: "ContainSpill",
        label: "Professional Environmental Cleanup",
        onSelect: (state) =>
          updateStats(state, {
            money: -14000,
            environment: 0.3,
            safety: 0.1,
          }),
      },
      {
        id: "QuickMop",
        label: "Mop It Up In-House",
        onSelect: (state) =>
          updateStats(state, {
            environment: -0.2,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "IgnoreSpill",
        label: "It Will Evaporate",
        onSelect: (state) =>
          updateStats(state, {
            environment: -0.6,
            safety: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "EPAInspection",
    title: "EPA Inspection",
    description:
      "The EPA has scheduled a surprise environmental inspection of your facilities. Your recent environmental record will determine the outcome.",
    choices: [
      {
        id: "CooperateEPA",
        label: "Fully Cooperate",
        onSelect: (state) =>
          updateStats(state, {
            environment: state.stats.environment >= 3 ? 0.2 : -0.3,
            money: state.stats.environment >= 3 ? 5000 : -15000,
            customerSatisfaction: state.stats.environment >= 3 ? 0.1 : -0.1,
          }),
      },
      {
        id: "LegalDelay",
        label: "Delay Through Legal Channels",
        onSelect: (state) =>
          updateStats(state, {
            money: -7000,
            customerSatisfaction: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.day % 17 === 0,
  },

  // ── COMMUNITY & PR ───────────────────────────────────────────

  {
    id: "SchoolTrip",
    title: "School Field Trip",
    description:
      "A local school wants to bring 60 students on a guided subway field trip. It would be a PR win but logistically demanding.",
    choices: [
      {
        id: "AcceptTrip",
        label: "Host the Field Trip",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
            customerSatisfaction: 0.35,
            employeeWellbeing: -0.15,
          }),
      },
      {
        id: "ChargeTrip",
        label: "Host but Charge a Small Fee",
        onSelect: (state) =>
          updateStats(state, {
            money: -2000,
            customerSatisfaction: 0.1,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "DenyTrip",
        label: "Decline",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
          }),
      },
    ],
    locations: ["Central Station", "North Plaza", "Riverside Terminal"],
    repeatable: true,
    weight: 1,
    criteria: (state) =>
      state.eventOccurences
        .filter((e) => e.id === "SchoolTrip")
        .every((e) => state.day - e.day > 15),
  },

  {
    id: "CommunityMural",
    title: "Community Mural Proposal",
    description:
      "A local artist collective wants to paint a community mural on one of the station walls. It would cost nothing and add character to the station.",
    choices: [
      {
        id: "ApproveMural",
        label: "Approve the Mural",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.2,
            cleanliness: 0.1,
            environment: 0.05,
          }),
      },
      {
        id: "DenyMural",
        label: "Keep the Walls Plain",
        onSelect: () => {},
      },
    ],
    locations: ["West End Junction", "Eastside", "North Plaza"],
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "NewspaperStory",
    title: "Reporter on the Platform",
    description:
      "A local newspaper reporter is writing a story about public transit. They want a quote from management.",
    choices: [
      {
        id: "PositiveSpin",
        label: "Highlight Our Improvements",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.2,
          }),
      },
      {
        id: "NoComment",
        label: "No Comment",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "TransparentComment",
        label: "Be Honest About Our Challenges",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.1,
            employeeWellbeing: 0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "CharityRide",
    title: "Charity Ride Day",
    description:
      "A local charity is asking us to offer free rides for one day to raise awareness for their cause.",
    choices: [
      {
        id: "DoCharity",
        label: "Host the Charity Ride Day",
        onSelect: (state) =>
          updateStats(state, {
            money: -30000,
            customerSatisfaction: 0.4,
            employeeWellbeing: 0.1,
            environment: 0.05,
          }),
      },
      {
        id: "PartialCharity",
        label: "Lowered Fares for the Day",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            customerSatisfaction: 0.2,
          }),
      },
      {
        id: "DenyCharity",
        label: "We Can't Afford It",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.05,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) =>
      state.eventOccurences
        .filter((e) => e.id === "CharityRide")
        .every((e) => state.day - e.day > 20),
  },

  {
    id: "StationRenovation",
    title: "Station Renovation Grant",
    description:
      "The city is offering a partial grant for station renovations. You'll still have to pay a good amount but the majority of it is covered.",
    choices: [
      {
        id: "TakeGrant",
        label: "Accept the Grant and Renovate",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            cleanliness: 0.35,
            customerSatisfaction: 0.25,
            environment: 0.1,
            safety: 0.1,
          }),
      },
      {
        id: "IgnoreGrant",
        label: "Pass on It This Cycle",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.money > 40000,
  },

  // ── INFRASTRUCTURE ───────────────────────────────────────────

  {
    id: "VendingMachines",
    title: "Vending Machine Partnership",
    description:
      "A beverage company wants to install vending machines at every station in exchange for a revenue share.",
    choices: [
      {
        id: "AcceptVending",
        label: "Accept the Partnership",
        onSelect: (state) =>
          updateStats(state, {
            money: 500,
            customerSatisfaction: 0.1,
            cleanliness: -0.1,
          }),
      },
      {
        id: "DenyVending",
        label: "Decline",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "WifiInstall",
    title: "Station Wi-Fi",
    description:
      "Passengers have been requesting Wi-Fi in stations. Installation would be a one-time cost with ongoing maintenance.",
    choices: [
      {
        id: "FreeWifi",
        label: "Install Free Station-Wide Wi-Fi",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            dailyExpenses: 200,
            customerSatisfaction: 0.35,
          }),
      },
      {
        id: "PaidWifi",
        label: "Install Paid Wi-Fi",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            dailyProfit: 150,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "NoWifi",
        label: "Use Your Data Plan",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "BenchReplacement",
    title: "Platform Bench Replacement",
    description:
      "The platform benches are worn and uncomfortable. Replacing them would improve the passenger experience.",
    choices: [
      {
        id: "ReplaceAll",
        label: "Replace All Benches",
        onSelect: (state) =>
          updateStats(state, {
            money: -7000,
            customerSatisfaction: 0.15,
            cleanliness: 0.1,
          }),
      },
      {
        id: "PatchBenches",
        label: "Patch the Worst Ones",
        onSelect: (state) =>
          updateStats(state, {
            money: -1500,
            customerSatisfaction: 0.05,
          }),
      },
      {
        id: "RemoveBenches",
        label: "Remove Them",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.2,
            security: 0.05,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "SafetyTraining",
    title: "Safety Training Program",
    description:
      "An accredited firm is offering a mandatory safety recertification course for all staff.",
    choices: [
      {
        id: "FullTraining",
        label: "Full Recertification",
        onSelect: (state) =>
          updateStats(state, {
            money: -9000,
            safety: 0.4,
            employeeWellbeing: 0.1,
          }),
      },
      {
        id: "OnlineTraining",
        label: "Online Course Only",
        onSelect: (state) =>
          updateStats(state, {
            money: -2000,
            safety: 0.1,
          }),
      },
      {
        id: "SkipTraining",
        label: "Skip It This Year",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.day % 20 === 0,
  },

  // ── EDGE CASES ───────────────────────────────────────────────

  {
    id: "SleepingPassenger",
    title: "Sleeping Passenger",
    description:
      "A passenger has been asleep on the train for six hours and has completed the full loop four times. They show no signs of waking up.",
    choices: [
      {
        id: "WakePassenger",
        label: "Gently Wake Them",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.05,
          }),
      },
      {
        id: "CallMedicSleep",
        label: "Call a Medic to Check on Them",
        onSelect: (state) =>
          updateStats(state, {
            money: -800,
            safety: 0.1,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "LeavePassenger",
        label: "Let Them Sleep — They Paid for a Ticket",
        onSelect: () => {},
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "BuskerPermit",
    title: "Busker on the Platform",
    description:
      "A musician has set up without a permit on the platform and is drawing a crowd. Passengers seem to love it, but it is technically unauthorized.",
    choices: [
      {
        id: "AllowBusker",
        label: "Allow It — The Energy is Great",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.2,
            cleanliness: -0.05,
          }),
      },
      {
        id: "ChargeBusker",
        label: "Offer a Paid Permit",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: 50,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "RemoveBusker",
        label: "Remove Them — No Permit, No Performance",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "ProposalOnTrain",
    title: "Marriage Proposal",
    description:
      "A man asks your staff to help him arrange a surprise proposal on a train, complete with flowers and a PA announcement.",
    choices: [
      {
        id: "HelpProposal",
        label: "Help Make It Happen",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.3,
            employeeWellbeing: 0.15,
          }),
      },
      {
        id: "DenyProposal",
        label: "This Is a Transit System, Not a Romance Novel",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.05,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "PowerOutage",
    title: "Station Power Outage",
    description:
      "A power outage has plunged an entire station into darkness. Emergency lighting is on but trains are stopped.",
    choices: [
      {
        id: "EmergencyPower",
        label: "Activate Backup Generator",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
            safety: -0.2,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "CallGrid",
        label: "Call the Power Company to Resolve the Issue",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            customerSatisfaction: 0.2,
            safety: 0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "MedicalEmergency",
    title: "Medical Emergency on Platform",
    description: "A passenger has collapsed on the platform. They are unresponsive.",
    choices: [
      {
        id: "CallAmbulanceMed",
        label: "Call an Ambulance Immediately",
        onSelect: (state) =>
          updateStats(state, {
            money: -1500,
            safety: 0.2,
            customerSatisfaction: 0.15,
          }),
      },
      {
        id: "StaffCPR",
        label: "Use Staff CPR Training",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.1,
            employeeWellbeing: -0.1,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "WaitAndSee",
        label: "Wait and See if They Wake Up",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.5,
            customerSatisfaction: -0.4,
            employeeWellbeing: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "LostChild2",
    title: "Child on the Wrong Train",
    description:
      "A young child boarded the wrong train and is now at the wrong station, crying and alone.",
    choices: [
      {
        id: "EscortChild",
        label: "Escort the Child to Their Destination",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.25,
            safety: 0.15,
            employeeWellbeing: 0.1,
          }),
      },
      {
        id: "CallParentsChild",
        label: "Contact Parents via PA System",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.1,
            safety: 0.1,
          }),
      },
      {
        id: "IgnoreChild",
        label: "They'll Figure It Out",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.3,
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.15,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) =>
      state.eventOccurences
        .filter((e) => e.id === "LostChild2")
        .every((e) => state.day - e.day > 10),
  },

  {
    id: "CityAudit",
    title: "City Budget Audit",
    description:
      "The city council has requested a full financial audit of our transit authority. How we respond will affect our relationship with the council.",
    choices: [
      {
        id: "FullTransparency",
        label: "Full Transparency",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.15,
            money: state.stats.money > 80000 ? 10000 : -5000,
            security: 0.1,
          }),
      },
      {
        id: "HireAccountant",
        label: "Hire an Accountant to Prep",
        onSelect: (state) =>
          updateStats(state, {
            money: -3000,
            customerSatisfaction: 0.05,
          }),
      },
      {
        id: "DelayAudit",
        label: "Request a Delay",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
            security: -0.15,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.day % 25 === 0,
  },

  {
    id: "BudgetCut",
    title: "City Budget Cuts",
    description:
      "The city has slashed transit subsidies. You must find savings immediately or run a deficit. There is no painless option.",
    choices: [
      {
        id: "CutCleaning",
        label: "Gut the Cleaning Budget",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: -3000,
            cleanliness: -0.6,
            customerSatisfaction: -0.3,
          }),
      },
      {
        id: "CutSecurity",
        label: "Reduce Security Staff",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: -3000,
            security: -0.5,
            safety: -0.3,
            employeeWellbeing: -0.2,
            employees: -3,
          }),
      },
      {
        id: "CutMaintenance",
        label: "Defer All Non-Critical Maintenance",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: -3000,
            safety: -0.5,
            environment: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.money < 20000,
  },

  {
    id: "InsurancePremium",
    title: "Insurance Premium Hike",
    description:
      "Our insurer has tripled our annual premium following a string of incidents. We can pay, switch to a worse provider, or go uninsured.",
    choices: [
      {
        id: "PayPremium",
        label: "Pay the New Premium",
        onSelect: (state) =>
          updateStats(state, {
            money: -40000,
          }),
      },
      {
        id: "CheapInsurer",
        label: "Switch to a Budget Insurer",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            safety: -0.3,
            security: -0.2,
          }),
      },
      {
        id: "GoUninsured",
        label: "Drop Insurance Entirely",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: -2000,
            safety: -0.6,
            security: -0.4,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.day > 20,
  },

  {
    id: "PensionLiability",
    title: "Pension Liability Crisis",
    description:
      "Actuaries have revealed a massive underfunded pension liability. The options all hurt.",
    choices: [
      {
        id: "FundPension",
        label: "Make a Lump-Sum Payment",
        onSelect: (state) =>
          updateStats(state, {
            money: -60000,
            employeeWellbeing: 0.2,
          }),
      },
      {
        id: "ReduceBenefits",
        label: "Reduce Future Pension Benefits",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: -0.6,
            employeeWage: -30,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "IgnorePension",
        label: "Kick the Can Down the Road",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: 500,
            security: -0.2,
            employeeWellbeing: -0.3,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.day > 30,
  },

  // ── STAFFING NIGHTMARES ───────────────────────────────────────

  {
    id: "MassResignation",
    title: "Mass Resignation",
    description:
      "Eight employees have quit simultaneously after a dispute over scheduling. Trains cannot run at full capacity without them.",
    choices: [
      {
        id: "OfferBonuses",
        label: "Offer Retention Bonuses to Win Them Back",
        onSelect: (state) =>
          updateStats(state, {
            money: -16000,
            employees: 5,
            employeeWellbeing: 0.1,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "HireReplacements",
        label: "Rush-Hire Untrained Replacements",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            employees: 8,
            safety: -0.4,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "RunShort",
        label: "Run Reduced Service with Remaining Staff",
        onSelect: (state) =>
          updateStats(state, {
            employees: -8,
            customerSatisfaction: -0.5,
            employeeWellbeing: -0.4,
            safety: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.employeeWellbeing < 2,
  },

  {
    id: "UnionHardball",
    title: "Union Goes to Binding Arbitration",
    description:
      "The union has escalated contract talks to binding arbitration. The arbitrator's ruling will cost you no matter what.",
    choices: [
      {
        id: "AcceptArbitration",
        label: "Accept the Arbitration Outcome",
        onSelect: (state) =>
          updateStats(state, {
            employeeWage: 40,
            dailyExpenses: 1500,
            employeeWellbeing: 0.2,
          }),
      },
      {
        id: "LegalChallenge",
        label: "Challenge the Ruling in Court",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            employeeWellbeing: -0.4,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.eventOccurences.some((o) => o.id === "Strike"),
  },

  {
    id: "SickoutProtest",
    title: "Coordinated Sickout",
    description:
      "Employees are staging a coordinated 'sick day' protest. A third of your workforce is absent with no notice.",
    choices: [
      {
        id: "NegotiateSickout",
        label: "Open Emergency Negotiations",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            employeeWage: 20,
            employeeWellbeing: 0.15,
            customerSatisfaction: -0.2,
          }),
      },
      {
        id: "DisciplineSickout",
        label: "Issue Disciplinary Letters",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: -0.5,
            security: -0.1,
            customerSatisfaction: -0.3,
          }),
      },
      {
        id: "ToughItOut",
        label: "Run Skeleton Crew and Say Nothing",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.4,
            customerSatisfaction: -0.4,
            employeeWellbeing: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.employeeWellbeing < 2.5,
  },

  // ── SAFETY CATASTROPHES ───────────────────────────────────────

  {
    id: "TrainCollision",
    title: "Train Collision",
    description:
      "Two trains have collided at low speed in a tunnel. There are injuries but no fatalities. The fallout will be enormous.",
    choices: [
      {
        id: "FullShutdown",
        label: "Shut Down All Lines for Emergency Inspection",
        onSelect: (state) =>
          updateStats(state, {
            money: -40000,
            safety: 0.3,
            customerSatisfaction: -0.6,
            employeeWellbeing: -0.3,
          }),
      },
      {
        id: "PartialShutdown",
        label: "Shut Down the Affected Line Only",
        onSelect: (state) =>
          updateStats(state, {
            money: -25000,
            safety: -0.2,
            customerSatisfaction: -0.4,
          }),
      },
      {
        id: "KeepRunning",
        label: "Keep All Lines Running and Manage PR",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            safety: -0.6,
            customerSatisfaction: -0.5,
            employeeWellbeing: -0.4,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.stats.safety < 2,
  },

  {
    id: "PlatformCollapse",
    title: "Partial Platform Collapse",
    description:
      "A section of platform at a major station has partially collapsed due to aging infrastructure. No one was hurt — this time.",
    choices: [
      {
        id: "EmergencyRebuild",
        label: "Emergency Full Rebuild",
        onSelect: (state) =>
          updateStats(state, {
            money: -50000,
            safety: 0.4,
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "TemporaryBarrier",
        label: "Rope It Off and Run Partial Service",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
            safety: -0.3,
            customerSatisfaction: -0.4,
          }),
      },
      {
        id: "IgnoreCollapse",
        label: "Leave It and Hope No One Notices",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.8,
            customerSatisfaction: -0.2,
            environment: -0.1,
          }),
      },
    ],
    locations: ["Central Station", "North Plaza", "Riverside Terminal", "Wild Hen Stadium"],
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.stats.safety < 2.5,
  },

  {
    id: "FireOnTrain",
    title: "Fire on a Train Car",
    description:
      "A small fire has broken out in a train car mid-route. Passengers are evacuating. Every second counts.",
    choices: [
      {
        id: "EmergencyStop",
        label: "Emergency Stop and Full Evacuation",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            safety: 0.2,
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "RunToNextStation",
        label: "Push Through to the Next Station",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.5,
            customerSatisfaction: -0.5,
            money: -10000,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.safety < 3,
  },

  {
    id: "AsbestosDiscovery",
    title: "Asbestos Found in Walls",
    description:
      "Contractors have found asbestos in the walls of an older station. Remediation is enormously expensive, but ignoring it is dangerous and potentially illegal.",
    choices: [
      {
        id: "FullRemediation",
        label: "Full Professional Remediation",
        onSelect: (state) =>
          updateStats(state, {
            money: -70000,
            safety: 0.5,
            environment: 0.3,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "SealAndMonitor",
        label: "Seal and Monitor — It Is Contained",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            safety: -0.3,
            environment: -0.2,
          }),
      },
      {
        id: "DontTell",
        label: "Say Nothing and Hope No One Tests",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.6,
            environment: -0.4,
            security: -0.2,
            employeeWellbeing: -0.3,
          }),
      },
    ],
    locations: ["West End Junction", "Old Town Square", "North Plaza"],
    repeatable: false,
    weight: 0.5,
    criteria: () => true,
  },

  // ── SECURITY NIGHTMARE ────────────────────────────────────────

  {
    id: "GangTerritoryDispute",
    title: "Gang Territory Dispute",
    description:
      "Two rival groups have been using a station as a meeting point. Incidents are escalating and staff are afraid to intervene.",
    choices: [
      {
        id: "HeavyPolicePresence",
        label: "Request Permanent Police Presence",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: 2000,
            security: 0.4,
            safety: 0.2,
            customerSatisfaction: -0.2,
            environment: -0.1,
          }),
      },
      {
        id: "CommunityOutreach",
        label: "Fund Community Outreach Programs",
        onSelect: (state) =>
          updateStats(state, {
            money: -12000,
            security: 0.1,
            customerSatisfaction: 0.1,
            employeeWellbeing: 0.1,
          }),
      },
      {
        id: "DoNothingGang",
        label: "Keep Your Head Down",
        onSelect: (state) =>
          updateStats(state, {
            security: -0.5,
            safety: -0.4,
            employeeWellbeing: -0.3,
            customerSatisfaction: -0.3,
          }),
      },
    ],
    locations: ["Eastside", "Three Stop", "West End Junction"],
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.security < 3,
  },

  {
    id: "HostageSituation",
    title: "Hostage Situation",
    description:
      "An armed individual has barricaded themselves with a passenger on a stopped train. Police are on the way but want your cooperation.",
    choices: [
      {
        id: "CooperatePolice",
        label: "Full Cooperation with Police",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            safety: 0.3,
            security: 0.2,
            customerSatisfaction: -0.4,
            employeeWellbeing: -0.3,
          }),
      },
      {
        id: "CutPower",
        label: "Cut Power to the Train Car",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            safety: -0.2,
            security: 0.1,
            customerSatisfaction: -0.3,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.3,
    criteria: (state) => state.stats.security < 2.5,
  },

  {
    id: "InsiderThreat",
    title: "Insider Threat",
    description:
      "Security has flagged one of your senior employees for leaking operational schedules to a third party. Firing them leaves a critical gap.",
    choices: [
      {
        id: "FireInsider",
        label: "Terminate Immediately",
        onSelect: (state) =>
          updateStats(state, {
            employees: -1,
            security: 0.2,
            employeeWellbeing: -0.3,
            safety: -0.1,
          }),
      },
      {
        id: "MonitorInsider",
        label: "Keep Them on and Monitor Quietly",
        onSelect: (state) =>
          updateStats(state, {
            security: -0.3,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "ReassignInsider",
        label: "Reassign Them to a Non-Sensitive Role",
        onSelect: (state) =>
          updateStats(state, {
            security: -0.1,
            employeeWellbeing: -0.2,
            customerSatisfaction: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.security < 3,
  },

  // ── ENVIRONMENTAL DISASTERS ───────────────────────────────────

  {
    id: "RawSewageBackup",
    title: "Raw Sewage Backup",
    description:
      "A sewage main has burst beneath a station. The smell is unbearable and the platform is unusable. Health inspectors are on the way.",
    choices: [
      {
        id: "CloseStation",
        label: "Close the Station for Full Remediation",
        onSelect: (state) =>
          updateStats(state, {
            money: -30000,
            cleanliness: 0.3,
            environment: 0.1,
            customerSatisfaction: -0.4,
          }),
      },
      {
        id: "QuickPatch",
        label: "Quick Patch and Stay Open",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            cleanliness: -0.5,
            environment: -0.4,
            customerSatisfaction: -0.5,
            safety: -0.2,
          }),
      },
    ],
    locations: ["Central Station", "Riverside Terminal", "Old Town Square"],
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "ToxicChemicalLeak",
    title: "Toxic Chemical Leak",
    description:
      "Maintenance has punctured an old pipe carrying a legacy chemical solvent. Fumes are spreading through the ventilation system.",
    choices: [
      {
        id: "EvacuateAll",
        label: "Evacuate All Stations on the Affected Line",
        onSelect: (state) =>
          updateStats(state, {
            money: -25000,
            safety: 0.3,
            environment: 0.2,
            customerSatisfaction: -0.5,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "VentilateAndContinue",
        label: "Open Ventilation and Continue Service",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.6,
            environment: -0.5,
            employeeWellbeing: -0.4,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.stats.environment < 2.5,
  },

  {
    id: "WaterMain",
    title: "Water Main Rupture",
    description:
      "A water main has burst above the tunnel. Flooding is moderate but worsening. Structural integrity is at risk.",
    choices: [
      {
        id: "SuspendLineWater",
        label: "Suspend the Line",
        onSelect: (state) =>
          updateStats(state, {
            money: -12000,
            safety: 0.2,
            customerSatisfaction: -0.35,
          }),
      },
      {
        id: "RunSlowly",
        label: "Run Trains at Reduced Speed",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.4,
            customerSatisfaction: -0.2,
            environment: -0.1,
          }),
      },
    ],
    locations: ["Riverside Terminal", "Central Station", "Leo's Landing"],
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  // ── PR CATASTROPHES ───────────────────────────────────────────

  {
    id: "ViralIncidentVideo",
    title: "Viral Video",
    description:
      "A video of a disturbing incident on one of our trains has gone viral overnight. Millions of views. City officials are calling for answers.",
    choices: [
      {
        id: "FullStatement",
        label: "Issue a Full Public Statement",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.2,
            employeeWellbeing: -0.2,
            security: -0.1,
          }),
      },
      {
        id: "MinimalStatement",
        label: "Minimal 'We Are Investigating' Statement",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.4,
            security: -0.2,
          }),
      },
      {
        id: "BlameEmployee",
        label: "Blame the Involved Employee Publicly",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.1,
            employeeWellbeing: -0.6,
            security: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "GovernmentThreatened",
    title: "Franchise Threatened",
    description:
      "The city has issued a formal notice that our operating franchise is under review due to sustained poor performance. We have 30 days to show improvement.",
    choices: [
      {
        id: "EmergencyPlan",
        label: "Submit an Emergency Improvement Plan",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            dailyExpenses: 1000,
            customerSatisfaction: 0.2,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "NegotiateCity",
        label: "Negotiate for a Lenient Review Period",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            customerSatisfaction: -0.1,
            security: -0.1,
          }),
      },
      {
        id: "IgnoreNotice",
        label: "Ignore the Notice",
        onSelect: (state) =>
          updateStats(state, {
            money: -50000,
            customerSatisfaction: -0.5,
            employeeWellbeing: -0.3,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.customerSatisfaction < 2 && state.stats.safety < 2,
  },

  {
    id: "ClassActionLawsuit",
    title: "Class Action Lawsuit",
    description:
      "A group of passengers has filed a class action lawsuit citing chronic delays, unsafe conditions, and discrimination in service quality. Legal fees alone will be devastating.",
    choices: [
      {
        id: "FightClassAction",
        label: "Fight It in Court",
        onSelect: (state) =>
          updateStats(state, {
            money: -(Math.random() > 0.35 ? 80000 : 30000),
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "SettleClassAction",
        label: "Settle Out of Court",
        onSelect: (state) =>
          updateStats(state, {
            money: -45000,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "MediateClassAction",
        label: "Enter Mediation",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            customerSatisfaction: 0.05,
            employeeWellbeing: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.customerSatisfaction < 1.5,
  },

  {
    id: "SecurityVsPrivacy",
    title: "Security Crackdown",
    description:
      "Following a series of incidents, the city is pushing for mandatory bag searches at all entries. Civil liberties groups are already protesting.",
    choices: [
      {
        id: "FullSearches",
        label: "Implement Mandatory Bag Searches",
        onSelect: (state) =>
          updateStats(state, {
            security: 0.5,
            safety: 0.2,
            customerSatisfaction: -0.4,
            dailyExpenses: 1500,
          }),
      },
      {
        id: "RandomSearches",
        label: "Random Spot Checks Only",
        onSelect: (state) =>
          updateStats(state, {
            security: 0.2,
            customerSatisfaction: -0.15,
            dailyExpenses: 500,
          }),
      },
      {
        id: "RefuseSearches",
        label: "Refuse — We Are Not a Police State",
        onSelect: (state) =>
          updateStats(state, {
            security: -0.3,
            safety: -0.2,
            customerSatisfaction: 0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.security < 2.5,
  },

  {
    id: "CleanlinessVsSafety",
    title: "Inspection Ultimatum",
    description:
      "A health inspector has flagged our stations as unacceptably dirty. Meeting their standard means pulling safety-critical maintenance staff to clean. You cannot do both.",
    choices: [
      {
        id: "PrioritizeCleanliness",
        label: "Redirect Staff to Cleaning",
        onSelect: (state) =>
          updateStats(state, {
            cleanliness: 0.5,
            safety: -0.4,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "PrioritizeSafety",
        label: "Maintain Safety Staff Assignments",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.1,
            cleanliness: -0.4,
            customerSatisfaction: -0.3,
            money: -8000,
          }),
      },
      {
        id: "HireTemp",
        label: "Hire Temporary Cleaners",
        onSelect: (state) =>
          updateStats(state, {
            money: -12000,
            cleanliness: 0.3,
            employeeWellbeing: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.cleanliness < 2 || state.stats.safety < 2,
  },

  {
    id: "EnvironmentVsProfit",
    title: "Green Mandate",
    description:
      "New city regulations require all transit operators to reduce emissions by 30% within two years. Compliance means retooling the entire fleet.",
    choices: [
      {
        id: "ComplyFully",
        label: "Full Fleet Retooling",
        onSelect: (state) =>
          updateStats(state, {
            money: -90000,
            environment: 0.8,
            dailyExpenses: -800,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "PartialComply",
        label: "Partial Compliance — Retool Half the Fleet",
        onSelect: (state) =>
          updateStats(state, {
            money: -45000,
            environment: 0.3,
            dailyExpenses: -300,
          }),
      },
      {
        id: "LobbyAgainst",
        label: "Lobby City Council to Extend the Deadline",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            environment: -0.2,
            customerSatisfaction: -0.15,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.day > 25,
  },

  {
    id: "WelfareVsWages",
    title: "Budget Reallocation",
    description:
      "The operating budget cannot cover both planned wellbeing initiatives and the wage increases promised in the last negotiation. Something has to give.",
    choices: [
      {
        id: "HonorWages",
        label: "Honor the Wage Increase, Cut Wellbeing Programs",
        onSelect: (state) =>
          updateStats(state, {
            employeeWage: 30,
            employeeWellbeing: -0.3,
            dailyExpenses: 1200,
          }),
      },
      {
        id: "HonorWellbeing",
        label: "Keep Wellbeing Programs, Delay the Wage Increase",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: 0.2,
            employeeWage: -20,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "CutBoth",
        label: "Cut Both to Stay Solvent",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: -0.4,
            employeeWage: -15,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.money < 40000 && state.stats.employeeWellbeing < 3,
  },

  {
    id: "SafetyVsService",
    title: "Fleet Recall",
    description:
      "The manufacturer has issued a safety advisory on a component in 40% of our fleet. Pulling those trains means drastically reduced service.",
    choices: [
      {
        id: "FullRecall",
        label: "Pull All Affected Trains Immediately",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            dailyProfit: -2500,
            safety: 0.5,
            customerSatisfaction: -0.35,
            employeeWellbeing: 0.2,
          }),
      },
      {
        id: "GradualRecall",
        label: "Gradual Rotation — Minimize Disruption",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            daliyProfit: -1000,
            safety: -0.5,
            customerSatisfaction: -0.25,
          }),
      },
      {
        id: "IgnoreRecall",
        label: "It Is Just a Precautionary Advisory",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.7,
            customerSatisfaction: 0.05,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "OvercrowdingCrisis",
    title: "Overcrowding Crisis",
    description:
      "Ridership has spiked beyond capacity. Platforms are dangerously crowded at peak hours. Every solution involves real costs or real risks.",
    choices: [
      {
        id: "LimitEntry",
        label: "Limit Platform Entry at Peak Hours",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -5000,
            safety: 0.3,
            customerSatisfaction: -0.35,
          }),
      },
      {
        id: "ExtraTrains",
        label: "Run Extra Train Cycles",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: 2000,
            safety: 0.2,
            customerSatisfaction: 0.1,
            environment: -0.15,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "DoNothingCrowd",
        label: "It Is a Sign of Success",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.5,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.customerSatisfaction > 3.5,
  },

  {
    id: "FederalAudit",
    title: "Federal Audit",
    description:
      "A federal agency has opened an audit into our use of public transit grants. Cooperating fully means exposing financial decisions that could result in clawbacks. Lawyers are expensive either way.",
    choices: [
      {
        id: "FullCooperate",
        label: "Cooperate Fully",
        onSelect: (state) =>
          updateStats(state, {
            money: -(Math.random() > 0.5 ? 55000 : 20000),
            customerSatisfaction: 0.1,
            security: -0.2,
          }),
      },
      {
        id: "LegalStonewall",
        label: "Fight It Through Legal Counsel",
        onSelect: (state) =>
          updateStats(state, {
            money: -25000,
            customerSatisfaction: -0.2,
            security: -0.1,
          }),
      },
      {
        id: "PartialDisclosure",
        label: "Disclose Selectively",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            security: -0.3,
            customerSatisfaction: -0.15,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.day > 35,
  },

  {
    id: "BondRepayment",
    title: "Infrastructure Bond Repayment",
    description:
      "A bond taken out years ago for infrastructure upgrades has come due. The full repayment will gut our reserves. Refinancing costs more over time.",
    choices: [
      {
        id: "PayInFull",
        label: "Pay In Full",
        onSelect: (state) =>
          updateStats(state, {
            money: -75000,
          }),
      },
      {
        id: "Refinance",
        label: "Refinance the Bond",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: 800,
            security: -0.1,
          }),
      },
      {
        id: "Default",
        label: "Default and Negotiate",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            dailyExpenses: 1200,
            customerSatisfaction: -0.3,
            security: -0.3,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.day > 50,
  },

  {
    id: "FraudulentContractor",
    title: "Contractor Fraud",
    description:
      "The contractor who completed our last major renovation has been charged with fraud. The work may be substandard. An independent inspection will confirm it — or open a can of worms.",
    choices: [
      {
        id: "InspectWork",
        label: "Commission an Independent Inspection",
        onSelect: (state) =>
          updateStats(state, {
            money: -(Math.random() > 0.4 ? 40000 : 5000),
            safety: Math.random() > 0.4 ? -0.4 : 0.1,
          }),
      },
      {
        id: "SueContractor",
        label: "Sue the Contractor Directly",
        onSelect: (state) =>
          updateStats(state, {
            money: -(Math.random() > 0.5 ? 0 : 30000),
            customerSatisfaction: -0.1,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "IgnoreFraud",
        label: "The Work Looks Fine to Us",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.5,
            environment: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "EmergencyLevyDenied",
    title: "Emergency Levy Denied",
    description:
      "We applied for an emergency city levy to cover a funding shortfall. It was denied. The shortfall is still there.",
    choices: [
      {
        id: "SlashOperations",
        label: "Slash Operating Hours",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -8000,
            customerSatisfaction: -0.5,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "SellAssets",
        label: "Sell Non-Essential Station Assets",
        onSelect: (state) =>
          updateStats(state, {
            money: 20000,
            cleanliness: -0.3,
            customerSatisfaction: -0.2,
          }),
      },
      {
        id: "TakeEmergencyLoan",
        label: "Take an Emergency High-Interest Loan",
        onSelect: (state) =>
          updateStats(state, {
            money: 30000,
            dailyExpenses: 1500,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.money < 15000,
  },

  {
    id: "TicketFraudRing",
    title: "Ticket Fraud Ring",
    description:
      "An organized ring has been exploiting a loophole in our ticketing system to ride for free. Closing the loophole requires costly system changes. Leaving it open bleeds revenue daily.",
    choices: [
      {
        id: "PatchSystem",
        label: "Patch the Ticketing System",
        onSelect: (state) =>
          updateStats(state, {
            money: -18000,
            security: 0.2,
            dailyProfit: 1500,
          }),
      },
      {
        id: "IncreasePaols",
        label: "Deploy Enforcement Officers",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: 1000,
            security: 0.3,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "IgnoreFraudRing",
        label: "The Amount Lost Is Negligible",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -2000,
            security: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  // ── STAFF SPIRAL ──────────────────────────────────────────────

  {
    id: "BurnoutCrisis",
    title: "Burnout Crisis",
    description:
      "A workplace health report has flagged severe burnout across all departments. Doing nothing accelerates resignations. Every fix costs either money or service quality.",
    choices: [
      {
        id: "ReduceHours",
        label: "Reduce Shift Lengths Across the Board",
        onSelect: (state) =>
          updateStats(state, {
            employeeWage: 20,
            employeeWellbeing: 0.3,
            customerSatisfaction: -0.2,
            safety: -0.1,
          }),
      },
      {
        id: "HireForBurnout",
        label: "Hire Additional Staff to Redistribute Load",
        onSelect: (state) =>
          updateStats(state, {
            money: -12000,
            employees: 5,
            employeeWellbeing: 0.2,
            dailyExpenses: 500,
          }),
      },
      {
        id: "WellnessProgramBurnout",
        label: "Mandatory Wellness Program",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            employeeWellbeing: 0.1,
            customerSatisfaction: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.employeeWellbeing < 2,
  },

  {
    id: "SupervisorMisconduct",
    title: "Supervisor Misconduct",
    description:
      "A senior supervisor has been credibly accused of harassment by three subordinates. They are also our most experienced operational manager — losing them creates real safety gaps.",
    choices: [
      {
        id: "FireSupervisor",
        label: "Terminate Immediately",
        onSelect: (state) =>
          updateStats(state, {
            employees: -1,
            employeeWellbeing: 0.3,
            safety: -0.3,
            customerSatisfaction: 0.1,
          }),
      },
      {
        id: "SuspendInvestigate",
        label: "Suspend Pending Investigation",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
            employeeWellbeing: -0.1,
            safety: -0.1,
          }),
      },
      {
        id: "ReassignSupervisor",
        label: "Quietly Reassign Them",
        onSelect: (state) =>
          updateStats(state, {
            employeeWellbeing: -0.4,
            security: -0.1,
            customerSatisfaction: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "RetirementWave",
    title: "Retirement Wave",
    description:
      "Seven experienced employees are retiring within the same month. Their institutional knowledge is irreplaceable in the short term. Replacements will take months to train.",
    choices: [
      {
        id: "RetentionBonus",
        label: "Offer Retention Bonuses to Delay Retirements",
        onSelect: (state) =>
          updateStats(state, {
            money: -21000,
            employees: 0,
            safety: 0.1,
            employeeWellbeing: 0.1,
          }),
      },
      {
        id: "RushTrain",
        label: "Rush-Train Replacements",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            employees: 7,
            safety: -0.4,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "AcceptGap",
        label: "Accept the Knowledge Gap",
        onSelect: (state) =>
          updateStats(state, {
            employees: -7,
            safety: -0.6,
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.employees > 30,
  },

  {
    id: "InjuredWorker",
    title: "On-the-Job Injury",
    description:
      "An employee was seriously injured during a maintenance task. Workers' compensation is mandatory. Their colleagues are demanding safer protocols, which would slow everything down.",
    choices: [
      {
        id: "PayAndReform",
        label: "Pay Compensation and Reform Protocols",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            dailyExpenses: 400,
            safety: 0.3,
            employeeWellbeing: 0.2,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "PayOnly",
        label: "Pay Compensation, Keep Current Protocols",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            safety: -0.2,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "DisputeClaim",
        label: "Dispute the Compensation Claim",
        onSelect: (state) =>
          updateStats(state, {
            money: -(Math.random() > 0.4 ? 25000 : 5000),
            employeeWellbeing: -0.5,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "StaffPoached",
    title: "Staff Poached by Competitor",
    description:
      "A private transit startup has poached six of our trained operators with a 40% salary offer. We cannot match it without restructuring wages for everyone.",
    choices: [
      {
        id: "MatchWages",
        label: "Match the Salary Across All Staff",
        onSelect: (state) =>
          updateStats(state, {
            employeeWage: 45,
            employeeWellbeing: 0.3,
            customerSatisfaction: 0.05,
          }),
      },
      {
        id: "LetThemLeave",
        label: "Let Them Go and Hire Cheaper Replacements",
        onSelect: (state) =>
          updateStats(state, {
            employees: -6,
            money: -8000,
            safety: -0.4,
            employeeWellbeing: -0.3,
          }),
      },
      {
        id: "CounterOffer",
        label: "Counter-Offer Only the Six Leaving",
        onSelect: (state) =>
          updateStats(state, {
            money: -18000,
            employeeWellbeing: -0.2,
            safety: 0.05,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.employeeWage < 250,
  },

  // ── INFRASTRUCTURE DECAY ──────────────────────────────────────

  {
    id: "BridgeInspectionFail",
    title: "Viaduct Inspection Failure",
    description:
      "An engineering inspection has flagged our river viaduct as structurally compromised. Running trains over it is a risk. Closing it kills a major route.",
    choices: [
      {
        id: "CloseViaduct",
        label: "Close the Viaduct Immediately",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            dailyProfit: -2000,
            safety: 0.4,
            customerSatisfaction: 0.3,
          }),
      },
      {
        id: "SlowSpeedViaduct",
        label: "Impose Severe Speed Restrictions",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            safety: -0.2,
            customerSatisfaction: -0.3,
          }),
      },
      {
        id: "IgnoreViaduct",
        label: "The Report Is Overly Cautious",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.8,
            customerSatisfaction: -0.5,
          }),
      },
    ],
    locations: ["Riverside Terminal", "Central Station"],
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.stats.safety < 3,
  },

  {
    id: "AgedElectricalGrid",
    title: "Aging Electrical Grid",
    description:
      "Our electrical infrastructure is 40 years old and failing piecemeal. A full overhaul would modernize everything at enormous cost. Patchwork repairs are getting more expensive and less effective each time.",
    choices: [
      {
        id: "FullGridOverhaul",
        label: "Full Electrical Overhaul",
        onSelect: (state) =>
          updateStats(state, {
            money: -85000,
            safety: 0.5,
            environment: 0.3,
            dailyExpenses: -600,
          }),
      },
      {
        id: "SectionBySection",
        label: "Replace Section by Section Over Time",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            dailyExpenses: 500,
            safety: 0.1,
          }),
      },
      {
        id: "KeepPatching",
        label: "Keep Patching as Things Break",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            safety: -0.3,
            environment: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: () => true,
  },

  {
    id: "ElevatorAllFail",
    title: "Simultaneous Elevator Failures",
    description:
      "All elevators across three stations have failed at the same time due to a shared software fault. Passengers with disabilities cannot access platforms. An ADA lawsuit is likely.",
    choices: [
      {
        id: "EmergencyElevatorFix",
        label: "Emergency Repair All Stations",
        onSelect: (state) =>
          updateStats(state, {
            money: -35000,
            customerSatisfaction: 0.1,
            cleanliness: -0.1,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "FixOnlyOne",
        label: "Fix One Station, Reroute Others",
        onSelect: (state) =>
          updateStats(state, {
            money: -12000,
            customerSatisfaction: -0.3,
            safety: -0.1,
          }),
      },
      {
        id: "WaitElevator",
        label: "Wait for the Manufacturer's Engineer",
        onSelect: (state) =>
          updateStats(state, {
            money: -25000,
            customerSatisfaction: -0.5,
            security: -0.2,
          }),
      },
    ],
    locations: ["Central Station", "North Plaza", "Wild Hen Stadium"],
    repeatable: false,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "TunnelCrack",
    title: "Tunnel Structural Crack",
    description:
      "Maintenance discovered a significant crack in a primary tunnel lining. Geologists cannot agree on how serious it is. Acting fast is expensive. Waiting could be catastrophic.",
    choices: [
      {
        id: "ImmediateReinforce",
        label: "Immediate Structural Reinforcement",
        onSelect: (state) =>
          updateStats(state, {
            money: -45000,
            safety: 0.4,
            customerSatisfaction: -0.2,
          }),
      },
      {
        id: "MonitorCrack",
        label: "Install Sensors and Monitor",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            safety: -0.2,
            environment: -0.1,
          }),
      },
      {
        id: "IgnoreCrack",
        label: "Cracks Are Normal in Old Infrastructure",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.7,
            environment: -0.2,
          }),
      },
    ],
    locations: ["West End Junction", "Three Stop", "Eastside"],
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.stats.safety < 3,
  },

  {
    id: "SignalSystemObsolete",
    title: "Signal System End-of-Life",
    description:
      "Our signal system has been declared end-of-life by the manufacturer. Spare parts no longer exist. Every breakdown from now on is permanent until replaced.",
    choices: [
      {
        id: "ReplaceSignals",
        label: "Full Signal System Replacement",
        onSelect: (state) =>
          updateStats(state, {
            money: -95000,
            safety: 0.6,
            customerSatisfaction: 0.2,
            dailyExpenses: -300,
          }),
      },
      {
        id: "ThirdPartySignals",
        label: "Source Third-Party Spare Parts",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            safety: -0.1,
            dailyExpenses: 400,
          }),
      },
      {
        id: "RunWithoutSignals",
        label: "Transition to Manual Operation",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.6,
            employeeWellbeing: -0.3,
            customerSatisfaction: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.day > 45,
  },

  // ── COMMUNITY CONFLICT ────────────────────────────────────────

  {
    id: "ProtestBlockade",
    title: "Protest Blockade",
    description:
      "A large protest has formed outside two stations, blocking passenger access. Police have asked for our position before acting. Every option has a cost.",
    choices: [
      {
        id: "CallPoliceBlockade",
        label: "Request Police Dispersal",
        onSelect: (state) =>
          updateStats(state, {
            money: -5000,
            security: 0.2,
            customerSatisfaction: -0.2,
            environment: -0.1,
          }),
      },
      {
        id: "NegotiateBlockade",
        label: "Negotiate Directly with Protest Leaders",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -8000,
            customerSatisfaction: 0.05,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "RerouteBlockade",
        label: "Reroute Service and Wait Them Out",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -12000,
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.environment < 2.5,
  },

  {
    id: "AntiGentrificationFury",
    title: "Anti-Gentrification Backlash",
    description:
      "Community groups are blaming the transit authority for displacing residents near new station developments. The accusations are partly true. PR damage is escalating.",
    choices: [
      {
        id: "AffordableCommitment",
        label: "Commit to Affordable Fare Zones Near Affected Areas",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -4000,
            customerSatisfaction: 0.15,
            environment: 0.1,
          }),
      },
      {
        id: "DenyInvolvement",
        label: "Deny Any Responsibility",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.35,
            security: -0.1,
          }),
      },
      {
        id: "CommunityFund",
        label: "Establish a Community Fund",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            customerSatisfaction: 0.2,
            environment: 0.05,
          }),
      },
    ],
    locations: ["Eastside", "Three Stop", "West End Junction"],
    repeatable: false,
    weight: 1,
    criteria: (state) => state.day > 20,
  },

  {
    id: "HomelessEnforcement",
    title: "Homeless Encampment",
    description:
      "A large encampment of unhoused individuals has formed inside two stations. Passengers are complaining. Advocacy groups are watching closely. There is no clean answer.",
    choices: [
      {
        id: "ForceRemoval",
        label: "Enforce No-Loitering and Clear the Stations",
        onSelect: (state) =>
          updateStats(state, {
            cleanliness: 0.3,
            security: 0.1,
            customerSatisfaction: 0.1,
            environment: -0.2,
            employeeWellbeing: -0.1,
          }),
      },
      {
        id: "OutreachTeam",
        label: "Fund a Social Outreach Team",
        onSelect: (state) =>
          updateStats(state, {
            money: -10000,
            dailyExpenses: 500,
            cleanliness: -0.1,
            customerSatisfaction: -0.1,
            environment: 0.1,
          }),
      },
      {
        id: "IgnoreEncampment",
        label: "It Is Not Our Jurisdiction",
        onSelect: (state) =>
          updateStats(state, {
            cleanliness: -0.4,
            customerSatisfaction: -0.3,
            security: -0.2,
          }),
      },
    ],
    locations: ["Three Stop", "West End Junction", "Eastside"],
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "ReligiousGroupConflict",
    title: "Competing Religious Groups",
    description:
      "Two religious groups have both applied to hold events in our station concourse on the same day, and both refuse to reschedule. Denying either will cause public backlash.",
    choices: [
      {
        id: "AllowBothReligious",
        label: "Allow Both Simultaneously",
        onSelect: (state) =>
          updateStats(state, {
            cleanliness: -0.2,
            security: -0.2,
            customerSatisfaction: -0.1,
            employeeWellbeing: -0.2,
          }),
      },
      {
        id: "AllowOneReligious",
        label: "Allow One, Deny the Other",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.3,
            security: -0.15,
          }),
      },
      {
        id: "DenyBothReligious",
        label: "Deny Both — Stations Are Not Event Venues",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.2,
            cleanliness: 0.05,
          }),
      },
    ],
    locations: ["Central Station", "Old Town Square"],
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  // ── EXTERNAL SHOCKS ───────────────────────────────────────────

  {
    id: "PandemicRestrictions",
    title: "Public Health Restrictions",
    description:
      "New public health guidelines require reduced train capacity and increased ventilation. Compliance tanks revenue. Ignoring the guidelines risks outbreak and shutdown.",
    choices: [
      {
        id: "FullComplyHealth",
        label: "Full Compliance",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -12000,
            environment: 0.2,
            customerSatisfaction: -0.2,
            safety: 0.2,
          }),
      },
      {
        id: "PartialComplyHealth",
        label: "Partial Compliance — Ventilation Only",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -4000,
            safety: -0.1,
            environment: 0.1,
          }),
      },
      {
        id: "IgnoreHealth",
        label: "Guidelines Are Non-Binding",
        onSelect: (state) =>
          updateStats(state, {
            safety: -0.5,
            customerSatisfaction: -0.3,
            employeeWellbeing: -0.3,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.day > 30,
  },

  {
    id: "PowerGridFailure",
    title: "City-Wide Power Grid Failure",
    description:
      "A city-wide power failure has knocked out the grid. Our backup generators cover life-safety systems only. We must choose what else to keep running.",
    choices: [
      {
        id: "KeepLighting",
        label: "Prioritize Station Lighting and Ventilation",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            safety: 0.1,
            customerSatisfaction: -0.2,
            cleanliness: -0.2,
          }),
      },
      {
        id: "KeepTrains",
        label: "Prioritize Running Trains",
        onSelect: (state) =>
          updateStats(state, {
            money: -12000,
            safety: -0.3,
            customerSatisfaction: 0.1,
            environment: -0.2,
          }),
      },
      {
        id: "ShutDownGrid",
        label: "Full Shutdown Until Grid Restores",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -30000,
            safety: 0.2,
            customerSatisfaction: -0.5,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.3,
    criteria: () => true,
  },

  {
    id: "EconomicRecession",
    title: "Economic Recession",
    description:
      "A broader economic recession has hit. Ridership is down 35%. The city has hinted at further subsidy cuts. There is no way to cut your way out of this entirely.",
    choices: [
      {
        id: "CutRoutes",
        label: "Cancel Low-Ridership Routes",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: -2500,
            customerSatisfaction: -0.5,
            employeeWellbeing: -0.3,
            employees: -5,
          }),
      },
      {
        id: "ReduceFrequency",
        label: "Reduce Train Frequency Across All Lines",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: -1500,
            customerSatisfaction: -0.3,
            safety: -0.1,
          }),
      },
      {
        id: "RideItOut",
        label: "Maintain Service and Absorb the Loss",
        onSelect: (state) =>
          updateStats(state, {
            dailyProfit: -10000,
            employeeWellbeing: 0.1,
            customerSatisfaction: 0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.day > 40,
  },

  {
    id: "CyberRansom",
    title: "Ransomware Attack",
    description:
      "Our ticketing and scheduling systems have been encrypted by ransomware. The attackers are demanding payment. Restoring from backup will take three days and still may not work.",
    choices: [
      {
        id: "PayRansom",
        label: "Pay the Ransom",
        onSelect: (state) =>
          updateStats(state, {
            money: -30000,
            security: -0.4,
            customerSatisfaction: -0.2,
          }),
      },
      {
        id: "RestoreBackup",
        label: "Restore from Backup",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            dailyProfit: -(3 * 30000),
            security: -0.2,
            customerSatisfaction: -0.4,
          }),
      },
      {
        id: "RunManualRansom",
        label: "Run Fully Manual Operations Indefinitely",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: 2000,
            security: -0.3,
            safety: -0.3,
            employeeWellbeing: -0.3,
            customerSatisfaction: -0.3,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.stats.security < 3,
  },

  // ── IMPOSSIBLE CALLS ──────────────────────────────────────────

  {
    id: "WhichStationClosesFirst",
    title: "You Must Close a Station",
    description:
      "Budget projections make it clear: one station must be permanently closed to stay solvent. Each option hurts a different group of riders.",
    choices: [
      {
        id: "CloseThreeStop",
        label: "Close Three Stop",
        onSelect: (state) => ({
          ...updateStats(state, {
            dailyExpenses: -2000,
            customerSatisfaction: -0.4,
            environment: 0.05,
          }),
          lines: { ...state.lines, green: false },
        }),
      },
      {
        id: "CloseNorthPlaza",
        label: "Close North Plaza",
        onSelect: (state) =>
          updateStats(state, {
            dailyExpenses: -2000,
            customerSatisfaction: -0.4,
            safety: -0.1,
          }),
      },
      {
        id: "CloseWestEnd",
        label: "Close West End Junction",
        onSelect: (state) => ({
          ...updateStats(state, {
            dailyExpenses: -2000,
            customerSatisfaction: -0.4,
            employeeWellbeing: -0.2,
          }),
          lines: { ...state.lines, green: false },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: (state) => state.stats.money < 10000 && state.day > 30,
  },

  {
    id: "SafetyVsEnvironment",
    title: "Tunnel Ventilation Dilemma",
    description:
      "To meet new air quality standards, we would need to significantly reduce train frequency, cutting emissions but making the system less safe during crowded off-schedule periods.",
    choices: [
      {
        id: "MeetAirQuality",
        label: "Reduce Frequency to Meet Standards",
        onSelect: (state) =>
          updateStats(state, {
            environment: 0.4,
            safety: -0.3,
            customerSatisfaction: -0.3,
            dailyProfit: -5000,
          }),
      },
      {
        id: "IgnoreAirQuality",
        label: "Maintain Frequency and Accept the Fine",
        onSelect: (state) =>
          updateStats(state, {
            money: -12000,
            environment: -0.3,
            safety: 0.1,
            customerSatisfaction: 0.05,
          }),
      },
      {
        id: "LobbyStandards",
        label: "Challenge the Standards in Court",
        onSelect: (state) =>
          updateStats(state, {
            money: -15000,
            environment: -0.1,
            customerSatisfaction: -0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 0.5,
    criteria: () => true,
  },

  {
    id: "WhoGetsTheLastTrain",
    title: "Final Train Dilemma",
    description:
      "A last-minute service disruption means only one final train can run tonight. It can either serve the hospital district route or the residential district. Both groups are stranded.",
    choices: [
      {
        id: "HospitalRoute",
        label: "Run the Hospital District Route",
        onSelect: (state) =>
          updateStats(state, {
            safety: 0.2,
            customerSatisfaction: -0.15,
            employeeWellbeing: 0.1,
          }),
      },
      {
        id: "ResidentialRoute",
        label: "Run the Residential District Route",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: 0.1,
            safety: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: () => true,
  },

  {
    id: "WageVsCleanliness",
    title: "Where Does the Last Dollar Go",
    description:
      "There is only enough in the discretionary budget for one thing. Staff have been agitating for a raise. The cleaning team says the stations are critically understaffed.",
    choices: [
      {
        id: "RaisePay",
        label: "Give the Raise",
        onSelect: (state) =>
          updateStats(state, {
            employeeWage: 25,
            employeeWellbeing: 0.3,
            cleanliness: -0.3,
            customerSatisfaction: -0.1,
          }),
      },
      {
        id: "HireCleaners",
        label: "Expand the Cleaning Team",
        onSelect: (state) =>
          updateStats(state, {
            money: -8000,
            employees: 3,
            cleanliness: 0.3,
            employeeWellbeing: -0.2,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 1,
    criteria: (state) => state.stats.cleanliness < 2.5 && state.stats.employeeWellbeing < 2.5,
  },

  {
    id: "PublicShaming",
    title: "Name and Shame Campaign",
    description:
      "A public watchdog group is running a 'Name and Shame' campaign against the city's worst transit operators. We are ranked second. The ranking will be published next week.",
    choices: [
      {
        id: "EmergencyPRBlitz",
        label: "Emergency PR and Improvement Blitz",
        onSelect: (state) =>
          updateStats(state, {
            money: -20000,
            customerSatisfaction: 0.2,
            employeeWellbeing: -0.2,
            cleanliness: 0.2,
          }),
      },
      {
        id: "DoNothingShame",
        label: "Ride It Out — It Will Blow Over",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.4,
            security: -0.1,
          }),
      },
      {
        id: "AttackWatchdog",
        label: "Publicly Dispute the Methodology",
        onSelect: (state) =>
          updateStats(state, {
            customerSatisfaction: -0.25,
            employeeWellbeing: 0.1,
          }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 1,
    criteria: (state) => state.stats.customerSatisfaction < 2.5,
  },
];
