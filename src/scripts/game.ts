import Decimal from "break_infinity.js";
import { GameData, GameOperation } from "../types/game";
import { Module, ModuleType, ResourceType } from "../types/factory";
import { GAME_INTERVAL } from "../define";
import { RockGenerator, RockReceiver, Splitter } from "./parameters/modules";
import { UPGRADES } from "./parameters/upgrades";
import { ACHIEVEMENTS } from "./parameters/achievements";

export class Game {
  gameData: GameData;
  operationQueue: GameOperation[] = [];

  constructor(gameData?: GameData) {
    this.gameData = gameData ? gameData : initialGameData(this);
  }

  tick() {
    this.applyOperation();
    this.modulesAction();
    this.unlockAchievements();

    /* 固定FPSなのでかなり正確な計測ができるが、
    このクラスの中で固定FPSなのを保証していないのでなんとなく微妙だ */
    this.gameData.elapsedTime += GAME_INTERVAL;
  }

  modulesAction() {
    Array.from(this.gameData.modules.entries()).forEach(([_, module]) => {
      module.action();
    });
    Array.from(this.gameData.modules.entries()).forEach(([_, module]) => {
      module.moveResources();
    });
  }

  applyOperation() {
    while (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift()!;
      switch (operation.type) {
        case "connectModule":
          this._connectModule(operation.input, operation.output);
          break;
        case "disconnectModule":
          this._disconnectModule(operation.input, operation.output);
          break;
        case "addModule":
          this._addModule(operation.moduleType);
          break;
        case "unlockUpgrade":
          this._unlockUpgrade(operation.upgradeIndex);
      }
    }
  }

  unlockAchievements() {
    if (this.gameData.resources[ResourceType.Rock].gte(10000)) {
      this.gameData.achievementsUnlocked[0] = true;
    }
  }

  connectModule(
    input: { moduleId: string; index: number },
    output: { moduleId: string; index: number }
  ) {
    this.operationQueue.push({
      type: "connectModule",
      input,
      output,
    });
  }
  _connectModule(
    input: { moduleId: string; index: number },
    output: { moduleId: string; index: number }
  ) {
    this.gameData.modules
      .get(input.moduleId)
      ?.connectInput(input.index, output);
  }

  disconnectModule(
    input?: { moduleId: string; index: number },
    output?: { moduleId: string; index: number }
  ) {
    this.operationQueue.push({
      type: "disconnectModule",
      input,
      output,
    });
  }
  _disconnectModule(
    input?: { moduleId: string; index: number },
    output?: { moduleId: string; index: number }
  ) {
    if (input) {
      this.gameData.modules.get(input.moduleId)?.disconnectInput(input.index);
    }
    if (output) {
      this.gameData.modules
        .get(output.moduleId)
        ?.disconnectOutput(output.index);
    }
  }

  addModule(moduleType: ModuleType) {
    this.operationQueue.push({ type: "addModule", moduleType: moduleType });
  }
  _addModule(moduleType: ModuleType) {
    const module = this.getModuleFromType(moduleType);
    this.gameData.modules.set(module.id, module);
  }

  unlockUpgrade(upgradeIndex: number) {
    this.operationQueue.push({ type: "unlockUpgrade", upgradeIndex });
  }
  _unlockUpgrade(upgradeIndex: number) {
    if (this.gameData.upgradesUnlocked[upgradeIndex]) return;
    for (const cost of UPGRADES[upgradeIndex].costs) {
      if (this.gameData.resources[cost.resourceType].lessThan(cost.amount)) {
        return;
      }
    }
    for (const cost of UPGRADES[upgradeIndex].costs) {
      this.gameData.resources[cost.resourceType] = this.gameData.resources[
        cost.resourceType
      ].sub(cost.amount);
    }
    this.gameData.upgradesUnlocked[upgradeIndex] = true;
  }

  generateId() {
    for (let i = 0; true; i++) {
      if (!this.gameData.modules.has(i.toString())) {
        return i.toString();
      }
    }
  }

  getModuleFromType = (moduleType: ModuleType): Module => {
    switch (moduleType) {
      case ModuleType.RockGenerator:
        return new RockGenerator(this, this.generateId());
      case ModuleType.RockReceiver:
        return new RockReceiver(this, this.generateId());
      case ModuleType.Splitter:
        return new Splitter(this, this.generateId());
    }
  };
}

export const initialGameData = (game: Game): GameData => {
  return {
    resources: { Rock: new Decimal(0) },
    modules: new Map<string, Module>([
      ["0", new RockGenerator(game, "0")],
      ["1", new RockReceiver(game, "1")],
    ]),
    moduleLevels: {
      RockGenerator: 0,
      RockReceiver: 0,
      Splitter: 0,
    },
    upgradesUnlocked: new Array(UPGRADES.length).fill(false),
    achievementsUnlocked: new Array(ACHIEVEMENTS.length).fill(false),
    elapsedTime: 0,
  };
};
