import type { SubwayLine } from "./events";

export type Lines = Record<SubwayLine, boolean>;

export const lines: Lines = {
  red: true,
  green: true,
  blue: true,
};
