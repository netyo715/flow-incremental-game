import Decimal from "break_infinity.js";
import { GameData, GameOperation } from "../types/game";
import { Module } from "../types/factory";
import { GAME_INTERVAL } from "../define";
import { RockGenerator, RockReceiver } from "./parameters/modules";

export class Game {
  gameData: GameData;
  operationQueue: GameOperation[] = [];

  constructor(gameData?: GameData) {
    this.gameData = gameData ? gameData : initialGameData(this);
  }

  tick() {
    this.applyOperation();
    this.modulesAction();
    // TODO 実績などの処理

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
    this.gameData.modules
      .get(input.moduleId)
      ?.connectInput(input.index, output);
  }

  disconnectModule(
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

  generateId() {
    for (let i = 0; true; i++) {
      if (!this.gameData.modules.has(i.toString())) {
        return i.toString();
      }
    }
  }
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
    },
    achievementsUnlocked: [],
    elapsedTime: 0,
  };
};
