import Decimal from "break_infinity.js";
import { Module, ModuleType, ResourceType } from "./factory";
import { ModuleLevels } from "../scripts/parameters/modules";

export type GameData = {
  resources: { [key in ResourceType]: Decimal };
  modules: Map<string, Module>;
  moduleLevels: ModuleLevels;
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
    }
  | {
      type: "addModule";
      moduleType: ModuleType;
    }
  | {
      type: "levelUp";
      moduleType: ModuleType;
    };
