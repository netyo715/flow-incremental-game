import Decimal from "break_infinity.js";
import { Game } from "../scripts/game";

export const ResourceType = {
  Rock: "Rock",
};
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export const IOResourceType = {
  Any: "Any",
  Rock: "Rock",
};
export type IOResourceType =
  (typeof IOResourceType)[keyof typeof IOResourceType];

export const ModuleType = {
  RockGenerator: "RockGenerator",
  RockReceiver: "RockReceiver",
};
export type ModuleType = (typeof ModuleType)[keyof typeof ModuleType];

export interface Module {
  game: Game;
  id: string;
  name: string;
  moduleType: ModuleType;
  inputs: ModuleInput[];
  outputs: ModuleOutput[];
  action: () => void;
  position?: { x: number; y: number };
}

export type ModuleIO = {
  resourceType: ResourceType;
  maxAmount: Decimal;
  connectedModuleIO?: {
    moduleId: string;
    index: number;
  };
};

export type ModuleInput = ModuleIO & { nextAmount: Decimal; amount: Decimal };
export type ModuleOutput = ModuleIO;
