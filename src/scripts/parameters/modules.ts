import Decimal from "break_infinity.js";
import {
  Module,
  ModuleInput,
  ModuleOutput,
  ModuleType,
  ResourceType,
} from "../../types/factory";
import { Game } from "../game";

export class RockGenerator implements Module {
  id: string;
  name: string = moduleNames[ModuleType.RockGenerator];
  moduleType: ModuleType = ModuleType.RockGenerator;
  inputs: ModuleInput[] = [];
  outputs: ModuleOutput[] = [
    {
      resourceType: ResourceType.Rock,
      maxAmount: new Decimal(1),
    },
  ];
  game: Game;
  constructor(id: string, game: Game) {
    this.id = id;
    this.game = game;
  }
  action() {
    if (this.outputs[0].connectedModuleIO) {
      const outputModule = this.game.gameData.modules.get(
        this.outputs[0].connectedModuleIO.moduleId
      )!;
      outputModule.inputs[0].nextAmount =
        outputModule.inputs[0].nextAmount.add(1);
    }
  }
}

export class RockReceiver implements Module {
  id: string;
  name = moduleNames[ModuleType.RockReceiver];
  moduleType: ModuleType = ModuleType.RockReceiver;
  inputs: ModuleInput[] = [
    {
      resourceType: ResourceType.Rock,
      maxAmount: new Decimal(11),
      amount: new Decimal(0),
      nextAmount: new Decimal(0),
    },
  ];
  outputs: ModuleOutput[] = [];
  game: Game;
  constructor(id: string, game: Game) {
    this.id = id;
    this.game = game;
  }
  action() {
    if (this.inputs[0].connectedModuleIO) {
      this.game.gameData.resources.Rock = this.game.gameData.resources.Rock.add(
        this.inputs[0].amount
      );
    }
  }
}

export const moduleNames: Record<ModuleType, string> = {
  RockGenerator: "生産器(石)",
  RockReceiver: "回収器(石)",
};
