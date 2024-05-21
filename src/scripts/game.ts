import Decimal from "break_infinity.js";
import { GameData, GameOperation, StorageGameData } from "../types/game";
import { Module, ModuleType, ResourceType } from "../types/factory";
import {
  GAME_INTERVAL,
  SAVE_TICK_COUNT,
  STORAGE_KEY_GAME_DATA,
} from "../define";
import { RockGenerator, RockReceiver, Splitter } from "./parameters/modules";
import { UPGRADES } from "./parameters/upgrades";
import { ACHIEVEMENTS } from "./parameters/achievements";

export class Game {
  gameData: GameData;
  operationQueue: GameOperation[] = [];
  private tickCount = 0;

  constructor() {
    this.gameData = this.getGameDataFromStorage();
  }

  tick() {
    this.applyOperation();
    this.modulesAction();
    this.unlockAchievements();

    /* 固定FPSなのでかなり正確な計測ができるが、
    このクラスの中で固定FPSなのを保証していないのでなんとなく微妙だ */
    this.gameData.elapsedTime += GAME_INTERVAL;

    this.tickCount++;
    if (this.tickCount == SAVE_TICK_COUNT) {
      this.saveGameDataToStorage();
      this.tickCount = 0;
    }
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
    const module = this.getNewModuleFromType(moduleType);
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

  getNewModuleFromType = (moduleType: ModuleType, id?: string): Module => {
    const constId = id || this.generateId();
    switch (moduleType) {
      case ModuleType.RockGenerator:
        return new RockGenerator(this, constId);
      case ModuleType.RockReceiver:
        return new RockReceiver(this, constId);
      case ModuleType.Splitter:
        return new Splitter(this, constId);
    }
  };

  saveGameDataToStorage() {
    const resources = Object.fromEntries(
      Object.entries(this.gameData.resources).map(([key, value]) => [
        key,
        value.toString(),
      ])
    ) as StorageGameData["resources"];

    const modules = Object.fromEntries(
      Array.from(this.gameData.modules.entries()).map(([key, value]) => [
        key,
        {
          moduleType: value.moduleType,
          inputs: value.inputs,
          outputs: value.outputs,
          position: value.position,
        },
      ])
    ) as StorageGameData["modules"];

    const data: StorageGameData = {
      resources,
      modules,
      upgradesUnlocked: this.gameData.upgradesUnlocked,
      achievementsUnlocked: this.gameData.achievementsUnlocked,
      elapsedTime: this.gameData.elapsedTime,
    };
    localStorage.setItem(STORAGE_KEY_GAME_DATA, JSON.stringify(data));
  }

  getGameDataFromStorage(): GameData {
    const dataString = localStorage.getItem(STORAGE_KEY_GAME_DATA);
    if (!dataString) {
      return initialGameData(this);
    }
    const data: StorageGameData = JSON.parse(dataString);

    const resources = Object.fromEntries(
      Object.entries(data.resources).map(([key, value]) => [
        key,
        new Decimal(value),
      ])
    ) as GameData["resources"];

    const modules = new Map(
      Object.entries(data.modules).map(([key, value]) => {
        let module = this.getNewModuleFromType(value.moduleType, key);
        module.inputs = value.inputs;
        module.outputs = value.outputs;
        module.position = value.position;
        return [key, module];
      })
    ) as GameData["modules"];

    return {
      resources,
      modules,
      upgradesUnlocked: data.upgradesUnlocked,
      achievementsUnlocked: data.achievementsUnlocked,
      elapsedTime: data.elapsedTime,
    };
  }
}

export const initialGameData = (game: Game): GameData => {
  return {
    resources: { Rock: new Decimal(0) },
    modules: new Map<string, Module>([
      ["0", new RockGenerator(game, "0")],
      ["1", new RockReceiver(game, "1")],
    ]),
    upgradesUnlocked: new Array(UPGRADES.length).fill(false),
    achievementsUnlocked: new Array(ACHIEVEMENTS.length).fill(false),
    elapsedTime: 0,
  };
};
