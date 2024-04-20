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
  moduleType: ModuleType;
  input: ({ moduleId: string; index: number } | null)[];
  output: ({ moduleId: string; index: number } | null)[];
  position: { x: number; y: number } | null;
};
