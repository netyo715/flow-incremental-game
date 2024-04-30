import Decimal from "break_infinity.js";
import { Game } from "../scripts/game";

export const ResourceType = {
  Rock: "Rock",
};
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export const IOResourceType = {
  Any: "Any",
  Unsettled: "Unsettled",
  Disable: "Disable",
  Rock: "Rock",
};
export type IOResourceType =
  (typeof IOResourceType)[keyof typeof IOResourceType];

export const ModuleType = {
  RockGenerator: "RockGenerator",
  RockReceiver: "RockReceiver",
  Splitter: "Splitter",
};
export type ModuleType = (typeof ModuleType)[keyof typeof ModuleType];

export abstract class Module {
  game: Game;
  id: string;
  abstract name: string;
  abstract moduleType: ModuleType;
  abstract inputs: ModuleInput[];
  abstract outputs: ModuleOutput[];
  abstract action(): void;
  position?: { x: number; y: number };

  constructor(game: Game, id: string) {
    this.game = game;
    this.id = id;
  }

  level(): number {
    return this.game.gameData.moduleLevels[this.moduleType];
  }

  outputResource(index: number, amount: Decimal) {
    const outputIO = this.outputs[index].connectedModuleIO;
    if (!outputIO) {
      return;
    }
    const outputModule = this.game.gameData.modules.get(outputIO.moduleId);
    if (!outputModule) {
      return;
    }
    outputModule.inputs[outputIO.index].nextAmount = amount
      .min(this.outputs[index].maxAmount())
      .min(outputModule.inputs[outputIO.index].maxAmount());
  }

  updateState() {}
}

export type ModuleIO = {
  connectableResourceType: () => IOResourceType;
  resourceType: () => IOResourceType;
  maxAmount: () => Decimal;
  connectedModuleIO?: {
    moduleId: string;
    index: number;
  };
};

export type ModuleInput = ModuleIO & { nextAmount: Decimal; amount: Decimal };
export type ModuleOutput = ModuleIO;
