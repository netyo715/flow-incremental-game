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
  moduleType = ModuleType.RockGenerator;
  inputs: ModuleInput[] = [];
  outputs: ModuleOutput[] = [
    {
      resourceType: () => IOResourceType.Rock,
      connectableResourceType: () => IOResourceType.Rock,
      maxAmount: () => new Decimal(this.level() + 1),
    },
  ];
  action() {
    this.outputResource(0, new Decimal(this.level() + 1));
  }
}

export class RockReceiver extends Module {
  name = moduleNames[ModuleType.RockReceiver];
  moduleType = ModuleType.RockReceiver;
  inputs: ModuleInput[] = [
    {
      resourceType: () => IOResourceType.Rock,
      connectableResourceType: () => IOResourceType.Rock,
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

export class Splitter extends Module {
  name = moduleNames[ModuleType.Splitter];
  moduleType: ModuleType = ModuleType.Splitter;
  inputs: ModuleInput[] = [
    {
      resourceType: () => this.resourceType,
      connectableResourceType: () => this.connectableResourceType,
      maxAmount: () => new Decimal(this.level() + 1),
      amount: new Decimal(0),
      nextAmount: new Decimal(0),
    },
    {
      resourceType: () => this.resourceType,
      connectableResourceType: () => this.connectableResourceType,
      maxAmount: () => new Decimal(this.level() + 1),
      amount: new Decimal(0),
      nextAmount: new Decimal(0),
    },
  ];
  outputs: ModuleOutput[] = [
    {
      resourceType: () => this.resourceType,
      connectableResourceType: () => this.connectableResourceType,
      maxAmount: () => new Decimal(this.level() + 1),
    },
    {
      resourceType: () => this.resourceType,
      connectableResourceType: () => this.connectableResourceType,
      maxAmount: () => new Decimal(this.level() + 1),
    },
  ];
  action() {
    let amountSum = new Decimal(0);
    for (const input of this.inputs) {
      amountSum = amountSum.add(input.amount);
    }
    let connectCount = 0;
    for (const output of this.outputs) {
      if (output.connectedModuleIO) {
        connectCount++;
      }
    }
    const amountDiv = amountSum.div(connectCount);
    for (let index = 0; index < this.outputs.length; index++) {
      const outputIO = this.outputs[index].connectedModuleIO;
      if (!outputIO) continue;
      this.outputResource(index, amountDiv);
    }
  }
  private resourceType: IOResourceType = IOResourceType.Unsettled;
  private connectableResourceType: IOResourceType = IOResourceType.Any;
  updateState() {
    this.resourceType = IOResourceType.Unsettled;
    this.connectableResourceType = IOResourceType.Any;
    for (const input of this.inputs) {
      const inputIO = input.connectedModuleIO;
      if (!inputIO) continue;
      const resourceType = this.game.gameData.modules
        .get(inputIO.moduleId)!
        .outputs[inputIO.index].resourceType();
      if (resourceType !== IOResourceType.Unsettled) {
        this.resourceType = resourceType;
        this.connectableResourceType = resourceType;
        return;
      }
    }
    for (const output of this.outputs) {
      const outputIO = output.connectedModuleIO;
      if (!outputIO) continue;
      const resourceType = this.game.gameData.modules
        .get(outputIO.moduleId)!
        .inputs[outputIO.index].resourceType();
      if (resourceType !== IOResourceType.Unsettled) {
        this.resourceType = resourceType;
        this.connectableResourceType = resourceType;
        return;
      }
    }
  }
}

export const moduleNames: Record<ModuleType, string> = {
  RockGenerator: "生産器(石)",
  RockReceiver: "回収器(石)",
  Splitter: "分配器",
};

export type ModuleLevels = Record<ModuleType, number>;
