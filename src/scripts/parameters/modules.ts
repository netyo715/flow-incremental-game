import Decimal from "break_infinity.js";
import {
  IOResourceType,
  Module,
  ModuleType,
  ResourceType,
} from "../../types/factory";
import { Game } from "../game";

export class RockGenerator extends Module {
  name: string = moduleNames[ModuleType.RockGenerator];
  moduleType = ModuleType.RockGenerator;
  constructor(game: Game, id: string) {
    super(game, id, 0, 1);
  }
  action() {
    this.outputResource(0, IOResourceType.Rock, new Decimal(1));
  }
}

export class RockReceiver extends Module {
  name = moduleNames[ModuleType.RockReceiver];
  moduleType = ModuleType.RockReceiver;
  constructor(game: Game, id: string) {
    super(game, id, 1, 0);
  }
  action() {
    this.saveResource(
      ResourceType.Rock,
      this.resources.get(IOResourceType.Rock) || 0
    );
  }
}

export class Splitter extends Module {
  name = moduleNames[ModuleType.Splitter];
  moduleType: ModuleType = ModuleType.Splitter;
  constructor(game: Game, id: string) {
    super(game, id, 2, 2);
  }
  action() {
    // 均等に分配
    let connectCount = 0;
    for (const output of this.outputs) {
      if (output) {
        connectCount++;
      }
    }
    Array.from(this.resources.entries()).forEach(([resourceType, amount]) => {
      for (let i = 0; i < this.outputs.length; i++) {
        if (!this.outputs[i]) continue;
        this.outputResource(i, resourceType, amount.div(connectCount));
      }
    });
  }
}

export const moduleNames: Record<ModuleType, string> = {
  RockGenerator: "生産器(石)",
  RockReceiver: "回収器(石)",
  Splitter: "分配器",
};

export type ModuleLevels = Record<ModuleType, number>;
