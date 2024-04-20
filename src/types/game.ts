import Decimal from "break_infinity.js";
import { Module, ResourceType } from "./factory";

export type GameData = {
  resources: { [key in ResourceType]: Decimal };
  modules: Map<string, Module>;
  achievementsUnlocked: (0 | 1)[];
  elapsedTime: number;
};
