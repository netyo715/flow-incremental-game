import Decimal from "break_infinity.js";
import {
  IOResourceType,
  Module,
  ModuleInput,
  ModuleOutput,
  ModuleType,
  ResourceType,
} from "../../types/factory";

export class RockGenerator extends Module {
  name: string = moduleNames[ModuleType.RockGenerator];
  moduleType: ModuleType = ModuleType.RockGenerator;
  inputs: ModuleInput[] = [];
  outputs: ModuleOutput[] = [
    {
      resourceType: IOResourceType.Rock,
      maxAmount: () => new Decimal(this.level() + 1),
    },
  ];
  action() {
    this.outputResource(0, new Decimal(this.level() + 1));
  }
}

export class RockReceiver extends Module {
  name = moduleNames[ModuleType.RockReceiver];
  moduleType: ModuleType = ModuleType.RockReceiver;
  inputs: ModuleInput[] = [
    {
      resourceType: IOResourceType.Rock,
      maxAmount: () => new Decimal(this.level() + 1),
      amount: new Decimal(0),
      nextAmount: new Decimal(0),
    },
  ];
  outputs: ModuleOutput[] = [];
  action() {
    this.game.addResource(ResourceType.Rock, this.inputs[0].amount);
  }
}

export const moduleNames: Record<ModuleType, string> = {
  RockGenerator: "生産器(石)",
  RockReceiver: "回収器(石)",
};

export type ModuleLevels = Record<ModuleType, number>;
