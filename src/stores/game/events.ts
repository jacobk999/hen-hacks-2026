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

type BaseEvent = {
  id: string;
  locations: Location[];
  repeatable: boolean;
  weight: number;
  primaryCharacter?: string;
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

export type Current<T extends Event> = Omit<
  T,
  "locations" | "weight" | "criteria"
> & {
  location: Location;
};

export type CurrentEvent = Current<Event>;

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
    primaryCharacter: "duncan",
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
    id: "smoking",
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
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: () => true,
  },
  {
    id: "WeddingRing2",
    title: "A Found Ring",
    description:
      "A ring was found on the subway, who should we call to return it to?",
    choices: [
      {
        id: "302-457-9891",
        label: "302-457-9891",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction + 0.43,
          },
        }),
      },
      {
        id: "302-457-9091",
        label: "302-457-9091",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.34,
          },
        }),
      },
      {
        id: "PawnRing",
        label: "Pawn off the ring",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.63,
            money: state.stats.money + 2500,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: (state) =>
      state.eventOccurences.some(
        (occurence) => occurence.id === "WeddingRing1",
      ),
  },
  {
    id: "AppHack",
    title: "Metro App Hack",
    description:
      "Our security has been breached on our Metro App, and sensitive Data is vulnerable, what should we do?",
    choices: [
      {
        id: "Hire",
        label: "Hire A Cybersecurity Expert named Ayden C. Herold",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 6000,
            security: state.stats.security + 0.4,
          },
        }),
      },
      {
        id: "Do Nothing",
        label: "302-457-9091",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            security: state.stats.security - 0.3,
          },
        }),
      },
      {
        id: "RemoveApp",
        label: "Get Rid of the App",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.33,
            money: state.stats.money - 500,
            employeeWellbeing: state.stats.employeeWellbeing - 0.2,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: () => true,
  },
  {
    id: "DataLeak",
    title: "Data Leak",
    description:
      "Your customers data has been leaked, and you've been served a lawsuit",
    choices: [
      {
        id: "PayLawsuit",
        label: "Pay the Lawsuit",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 50000,
            customerSatisfaction: state.stats.customerSatisfaction - 0.55,
            security: state.stats.security - 0.3,
            employeeWellbeing: state.stats.employeeWellbeing - 0.3,
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
          occurence.id === "AppHack" && occurence.choice == "Do Nothing",
      ),
  },
  {
    id: "JesusScanner",
    title: "Broken Scanner",
    description:
      "Your metro card scanner has malfunctioned, what should we do?",
    choices: [
      {
        id: "Handyman",
        label: "Dispatch a handyman",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.1,
            cleanliness: state.stats.cleanliness - 0.1,
            employeeWellbeing: state.stats.employeeWellbeing + 0.1,
            money: state.stats.money - 1220,
          },
        }),
      },
      {
        id: "Employee",
        label: "Have an Employee Scan cards",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            employeeWellbeing: state.stats.employeeWellbeing - 0.2,
          },
        }),
      },
      {
        id: "Nothing",
        label: "Do nothing, and lose profits",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction + 0.3,
            money: state.stats.money - 15000,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 150,
    criteria: () => true,
  },
  // {
  //   id: "Kat1",
  //   dialog: KatDrugsDialog,
  //   // title: "Kat, the Drug Sniffing Dog",
  //   // description:
  //   //   "Kat, the Drug Sniffing Dog, has started pulling torwards a group of suspicous individuals, what should we do?",
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
    title: "Harrasment",
    description:
      "There is a mnetally ill passenger who is harrasing other passengers, what should we do?",
    choices: [
      {
        id: "Duncan",
        label: "Have Duncan the Donut Cop restrain him",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: state.stats.safety + 0.1,
            customerSatisfaction: state.stats.customerSatisfaction + 0.1,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 150,
    criteria: (state) =>
      state.eventOccurences.some((occurence) => occurence.id === "Duncan_1"),
  },
  {
    id: "Schizo2",
    title: "Harrasment",
    description:
      "There is a mentally ill passenger who is harrasing other passengers, what should we do?",
    choices: [
      {
        id: "DoNothing",
        label: "I don't know any police...",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: state.stats.safety - 0.2,
            customerSatisfaction: state.stats.customerSatisfaction - 0.2,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 150,
    criteria: (s) =>
      !s.eventOccurences.some((occurence) => occurence.id === "Duncan_1"),
  },
  {
    id: "CSGO",
    title: "Terrorist Attack",
    description:
      "A bomb has been planted in one of 3 subway lines, which one is it?",
    choices: [
      {
        id: "Red",
        label: "Red Line",
        onSelect: (state) => ({
          lines: { ...state.lines, green: false },
          stats: {
            ...state.stats,
            safety: state.stats.safety - 0.8,
            money: state.stats.money - 10000,
            employeeWellbeing: state.stats.employeeWellbeing - 1.2,
            customerSatisfaction: state.stats.customerSatisfaction - 1.5,
          },
        }),
      },
      {
        id: "Blue",
        label: "Blue Line",
        onSelect: (state) => ({
          lines: { ...state.lines, green: false },
          stats: {
            ...state.stats,
            safety: state.stats.safety - 0.8,
            money: state.stats.money - 10000,
            employeeWellbeing: state.stats.employeeWellbeing - 1.2,
            customerSatisfaction: state.stats.customerSatisfaction - 1.5,
          },
        }),
      },
      {
        id: "Green",
        label: "Green Line",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: state.stats.safety + 0.8,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
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
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: state.stats.safety - 1.8,
            employeeWellbeing: state.stats.employeeWellbeing - 2.0,
            customerSatisfaction: state.stats.customerSatisfaction - 1.5,
          },
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
      "A mysterious man offers to sell you a video game that contains magical properties, for the low price of $1,000",
    choices: [
      {
        id: "Buy",
        label: "Purchase the game",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 1000,
            customerSatisfaction: state.stats.customerSatisfaction + 5,
            cleanliness: state.stats.cleanliness + 5,
            security: state.stats.security + 5,
            employeeWellbeing: state.stats.employeeWellbeing + 5,
          },
        }),
      },
      {
        id: "NoDeal",
        label: "Walk away",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: false,
    weight: 150,
    criteria: () => true,
  },
  {
    id: "MommyIssues",
    title: "Lost Kid",
    description:
      "A lost child asks you for help finding his mother, what can we do?",
    choices: [
      {
        id: "PaAnnouncement",
        label: "Pa announcement",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction + 0.1,
            safety: state.stats.safety + 0.05,
          },
        }),
      },
      {
        id: "AmberAlert",
        label: "Amber Alert",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 1000,
            customerSatisfaction: state.stats.customerSatisfaction + 0.2,
            safety: state.stats.safety + 0.2,
          },
        }),
      },
      {
        id: "NA",
        label: 'Tell the kid to "tough it out"',
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: state.stats.safety - 0.2,
            customerSatisfaction: state.stats.customerSatisfaction - 0.2,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 150,
    criteria: (s) =>
      // wait at least 7 days since last occurence of MommyIssues
      s.eventOccurences
        .filter((event) => event.id === "MommyIssues")
        .every((event) => s.day - event.day > 7),
  },
  {
    id: "Detatch",
    title: "Car Detachment",
    description: "A car has detatched from the train, we need to think fast.",
    choices: [
      {
        id: "Stop all trains",
        label: "Stop all trains",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            safety: state.stats.safety + 0.2,
            customerSatisfaction: state.stats.customerSatisfaction - 0.2,
          },
        }),
      },
      {
        id: "Use the next train as a booster",
        label: "Use the next train as a booster",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction + 0.1,
            safety: state.stats.safety - 1.1,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 150,
    criteria: () => true,
  },
  {
    id: "Strike",
    title: "Employee Strike",
    description:
      "Your employees are unionizing, we have to be smart about this.",
    choices: [
      {
        id: "Cave",
        label: "Cave",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 10000,
            employeeWellbeing: state.stats.employeeWellbeing + 0.5,
            employeeWage: state.stats.employeeWage + 50,
            customerSatisfaction: state.stats.customerSatisfaction + 0.15,
          },
        }),
      },
      {
        id: "ForceWork",
        label: "Force Work",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.5,
            employeeWellbeing: state.stats.employeeWellbeing - 0.5,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 150,
    criteria: () => true,
  },
  /*updateStats(state, {
    money: -(Math.floor(Math.random() * 700) + 800),
    customerSatisfaction: 0.2,
    safety: 0.2,
    environment: 0.2,
  }), */
  {
    id: "StrayDog",
    title: "A Stray Dog",
    description:
      "A stray dog wondered into one of our tunnels is biting people",
    choices: [
      {
        id: "AnimalControl",
        label: "Call Animal Control",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 5000,
            customerSatisfaction: state.stats.customerSatisfaction + 0.1,
            security: state.stats.security + 0.1,
          },
        }),
      },
      {
        id: "Be cheap and ignore it",
        label: "Be cheap and ignore it",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.25,
            security: state.stats.security - 0.25,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 150,
    criteria: () => true,
  },
  {
    id: "Elevator",
    title: "ElevatorBreakdown",
    description: "An elevator is malfunctioning, what do you do?",
    choices: [
      {
        id: "Send",
        label: "Send an Elevator Technician",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 10000,
            customerSatisfaction: state.stats.customerSatisfaction + 0.1,
            cleanliness: state.stats.cleanliness + 0.1,
          },
        }),
      },
      {
        id: "DoNothing",
        label: "Do Nothing",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            customerSatisfaction: state.stats.customerSatisfaction - 0.15,
            cleanliness: state.stats.cleanliness - 0.1,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 150,
    criteria: () => true,
  },
  {
    id: "Handicap",
    title: "Handicap Access",
    description:
      "A lawsuit has appeared, as there is no access for wheelchair users due to a broken elevator",
    choices: [
      {
        id: "Continue",
        label: "Continue",
        onSelect: (state) => ({
          stats: {
            ...state.stats,
            money: state.stats.money - 25000,
          },
        }),
      },
    ],
    locations: allSubwayStations,
    repeatable: true,
    weight: 150,
    criteria: () => true,
  },
];
