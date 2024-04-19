export const ResourceType = {
  // TODO
} as const;
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export const ModuleType = {
  // TODO
} as const;
export type ModuleType = (typeof ModuleType)[keyof typeof ModuleType];

type Module = {
  id: string;
  moduleType: ModuleType;
  input: { moduleId: string; index: number }[]; // indexじゃなくてidの方が良い？
  output: { moduleId: string; index: number }[];
};
