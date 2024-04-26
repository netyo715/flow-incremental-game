import Decimal from "break_infinity.js";
import { Module, ResourceType } from "./factory";

export type GameData = {
  resources: { [key in ResourceType]: Decimal };
  modules: Map<string, Module>;
  achievementsUnlocked: (0 | 1)[];
  elapsedTime: number;
};

export type GameOperation =
  | {
      type: "connectModule";
      input: {
        moduleId: string;
        index: number;
      };
      output: {
        moduleId: string;
        index: number;
      };
    }
  | {
      type: "disconnectModule";
      input?: {
        moduleId: string;
        index: number;
      };
      output?: {
        moduleId: string;
        index: number;
      };
    };
