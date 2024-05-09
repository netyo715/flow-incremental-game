import Decimal, { DecimalSource } from "break_infinity.js";
import { Game } from "../scripts/game";

export const ResourceType = {
  Rock: "Rock",
} as const;
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export const resourceTypeNames: Record<ResourceType, string> = {
  Rock: "石",
};

export const IOResourceType = {
  Rock: "Rock",
} as const;
export type IOResourceType =
  (typeof IOResourceType)[keyof typeof IOResourceType];

export const ModuleType = {
  RockGenerator: "RockGenerator",
  RockReceiver: "RockReceiver",
  Splitter: "Splitter",
} as const;
export type ModuleType = (typeof ModuleType)[keyof typeof ModuleType];

export const moduleTypes = [
  ModuleType.RockGenerator,
  ModuleType.RockReceiver,
  ModuleType.Splitter,
];

export abstract class Module {
  game: Game;
  id: string;
  inputs: ModuleIO[];
  outputs: ModuleIO[];
  resources = new Map<IOResourceType, Decimal>();
  nextResources = new Map<IOResourceType, Decimal>();
  position?: { x: number; y: number };
  abstract name: string;
  abstract moduleType: ModuleType;
  abstract action(): void;

  constructor(game: Game, id: string, inputCount: number, outputCount: number) {
    this.game = game;
    this.id = id;
    this.inputs = [];
    this.outputs = [];
    for (let i = 0; i < inputCount; i++) {
      this.inputs.push(undefined);
    }
    for (let i = 0; i < outputCount; i++) {
      this.outputs.push(undefined);
    }
  }

  level(): number {
    return this.game.gameData.moduleLevels[this.moduleType];
  }

  outputResource(index: number, resourceType: IOResourceType, amount: Decimal) {
    const outputIO = this.outputs[index];
    if (!outputIO) {
      return;
    }
    const outputModule = this.game.gameData.modules.get(outputIO.moduleId);
    if (!outputModule) {
      return;
    }
    outputModule.nextResources.set(
      resourceType,
      amount.add(outputModule.nextResources.get(resourceType) || 0)
    );
  }

  saveResource(resourceType: ResourceType, amount: DecimalSource) {
    this.game.gameData.resources[resourceType] =
      this.game.gameData.resources[resourceType].add(amount);
  }

  moveResources() {
    this.resources = this.nextResources;
    this.nextResources = new Map<IOResourceType, Decimal>();
  }

  connectInput(index: number, output: { moduleId: string; index: number }) {
    if (output.moduleId === this.id) return;
    const outputModule = this.game.gameData.modules.get(output.moduleId);
    if (!outputModule) return;
    if (!this.position || !outputModule.position) return;
    this.disconnectInput(index);
    outputModule.disconnectOutput(output.index);
    this.inputs[index] = { ...output };
    outputModule.outputs[output.index] = { moduleId: this.id, index: index };
  }

  connectOutput(index: number, input: { moduleId: string; index: number }) {
    this.game.gameData.modules
      .get(input.moduleId)
      ?.connectInput(input.index, { moduleId: this.id, index: index });
  }

  disconnectInput(index: number) {
    const input = this.inputs[index];
    if (!input) return;
    this.inputs[index] = undefined;
    this.game.gameData.modules
      .get(input.moduleId)
      ?.disconnectOutput(input.index);
  }

  disconnectOutput(index: number) {
    const output = this.outputs[index];
    if (!output) return;
    this.outputs[index] = undefined;
    this.game.gameData.modules
      .get(output.moduleId)
      ?.disconnectInput(output.index);
  }
}

export type ModuleIO =
  | {
      moduleId: string;
      index: number;
    }
  | undefined;
