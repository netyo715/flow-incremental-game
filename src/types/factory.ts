import Decimal from "break_infinity.js";

export const ResourceType = {
  Rock: "Rock",
} as const;
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export const ModuleResourceType = {
  Any: "Any",
  Rock: "Rock",
};
export type ModuleResourceType =
  (typeof ModuleResourceType)[keyof typeof ModuleResourceType];

export const ModuleType = {
  RockGenerator: "RockGenerator",
  RockReceiver: "RockReceiver",
} as const;
export type ModuleType = (typeof ModuleType)[keyof typeof ModuleType];

export type Module = {
  id: string;
  name: string;
  moduleType: ModuleType;
  inputs: ModuleIO[];
  outputs: ModuleIO[];
  position?: { x: number; y: number };
};

export type ModuleIO = {
  resourceType: ResourceType;
  maxAmount: Decimal;
  connectedModuleIO?: {
    moduleId: string;
    index: number;
  };
  nextAmount?: Decimal;
  amount?: Decimal;
};
