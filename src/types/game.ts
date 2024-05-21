import Decimal from "break_infinity.js";
import { Module, ModuleIO, ModuleType, ResourceType } from "./factory";
import { ModuleLevels } from "../scripts/parameters/modules";

export type GameData = {
  resources: { [key in ResourceType]: Decimal };
  modules: Map<string, Module>;
  upgradesUnlocked: boolean[];
  achievementsUnlocked: boolean[];
  elapsedTime: number;
};

export type StorageGameData = {
  resources: { [key in ResourceType]: string };
  modules: {
    [key in string]: {
      moduleType: ModuleType;
      inputs: ModuleIO[];
      outputs: ModuleIO[];
      position?: { x: number; y: number };
    };
  };
  upgradesUnlocked: boolean[];
  achievementsUnlocked: boolean[];
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
    }
  | {
      type: "unlockUpgrade";
      upgradeIndex: number;
    };
