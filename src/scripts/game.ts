import Decimal from "break_infinity.js";
import { GameData, GameOperation } from "../types/game";
import {
  Module,
  ModuleResourceType,
  ModuleType,
  ResourceType,
} from "../types/factory";
import { GAME_INTERVAL } from "../define";

export class Game {
  gameData: GameData;
  operationQueue: GameOperation[] = [];

  constructor(gameData?: GameData) {
    this.gameData = gameData ? gameData : initialGameData();
  }

  tick() {
    this.applyOperation();
    // TODO 施設の処理
    // TODO 実績などの処理

    /* 固定FPSなのでかなり正確な計測ができるが、
    このクラスの中で固定FPSなのを保証していないのでなんとなく微妙だ */
    this.gameData.elapsedTime += GAME_INTERVAL;
  }

  applyOperation() {
    while (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift()!;
      switch (operation.type) {
        case "connectModule":
          this.connectModule(operation.input, operation.output);
          break;
        case "disconnectModule":
          this.disconnectModule(operation.input, operation.output);
          break;
      }
    }
  }

  connectModule(
    input: { moduleId: string; index: number },
    output: { moduleId: string; index: number }
  ) {
    if (input.moduleId === output.moduleId) {
      return;
    }
    const inputModule = this.gameData.modules.get(input.moduleId);
    const outputModule = this.gameData.modules.get(output.moduleId);
    // モジュール存在チェック
    if (!inputModule || !outputModule) {
      return;
    }
    const inputIO = inputModule.inputs[input.index];
    const outputIO = outputModule.outputs[output.index];
    // 接続可能かチェック
    isConnectable(inputIO.resourceType, outputIO.resourceType);
    // 接続済みモジュールを切断
    if (inputIO.connectedModuleIO) {
      this.disconnectModule(input);
    }
    if (outputIO.connectedModuleIO) {
      this.disconnectModule(undefined, output);
    }
    // 接続
    inputIO.connectedModuleIO = { ...output };
    outputIO.connectedModuleIO = { ...input };
  }

  disconnectModule(
    input?: { moduleId: string; index: number },
    output?: { moduleId: string; index: number }
  ) {
    if (input) {
      const inputModule = this.gameData.modules.get(input.moduleId);
      if (!inputModule) {
        return;
      }
      const inputIO = inputModule.inputs[input.index].connectedModuleIO;
      if (!inputIO) {
        return;
      }
      const outputModule = this.gameData.modules.get(inputIO.moduleId);
      inputModule.inputs[input.index].connectedModuleIO = undefined;
      outputModule!.outputs[inputIO.index].connectedModuleIO = undefined;
    } else if (output) {
      const outputModule = this.gameData.modules.get(output.moduleId);
      if (!outputModule) {
        return;
      }
      const outputIO = outputModule.outputs[output.index].connectedModuleIO;
      if (!outputIO) {
        return;
      }
      const inputModule = this.gameData.modules.get(outputIO.moduleId);
      outputModule.outputs[output.index].connectedModuleIO = undefined;
      inputModule!.inputs[outputIO.index].connectedModuleIO = undefined;
    } else {
      return;
    }
  }
}

export const isConnectable = (
  resourceTypeA: ResourceType,
  resourceTypeB: ResourceType
) => {
  if (
    resourceTypeA === ModuleResourceType.Any ||
    resourceTypeB === ModuleResourceType.Any
  ) {
    return true;
  }
  return resourceTypeA === resourceTypeB;
};

export const initialGameData = (): GameData => {
  return {
    resources: { Rock: new Decimal(0) },
    modules: new Map<string, Module>([
      [
        "0",
        {
          id: "0",
          name: "生産器(石)",
          moduleType: ModuleType.RockGenerator,
          inputs: [],
          outputs: [
            {
              resourceType: ResourceType.Rock,
              maxAmount: new Decimal(10),
            },
          ],
        },
      ],
      [
        "1",
        {
          id: "1",
          name: "回収器(石)",
          moduleType: ModuleType.RockReceiver,
          inputs: [
            {
              resourceType: ResourceType.Rock,
              maxAmount: new Decimal(10),
            },
          ],
          outputs: [],
        },
      ],
    ]),
    achievementsUnlocked: [],
    elapsedTime: 0,
  };
};
