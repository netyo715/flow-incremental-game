import Decimal from "break_infinity.js";
import { GameData } from "../types/game";
import { Module, ModuleType } from "../types/factory";

export class Game {
  gameData: GameData;
  prevTime: number;
  tickCount: number = 0;
  constructor(gameData?: GameData) {
    this.prevTime = Date.now();
    this.gameData = gameData ? gameData : initialGameData();
  }

  tick() {
    this.tickCount++;
    if (this.tickCount % 10 === 0) {
      this.updateElapsedTime();
    }
  }

  updateElapsedTime() {
    const now = Date.now();
    this.gameData.elapsedTime += now - this.prevTime;
    this.prevTime = now;
  }
}

export const initialGameData = (): GameData => {
  return {
    resources: { Rock: new Decimal(0) },
    modules: new Map<string, Module>([
      [
        "0",
        {
          id: "0",
          moduleType: ModuleType.RockGenerator,
          input: [],
          output: [null],
          position: null,
        },
      ],
      [
        "1",
        {
          id: "1",
          moduleType: ModuleType.RockReceiver,
          input: [null],
          output: [],
          position: null,
        },
      ],
    ]),
    achievementsUnlocked: [],
    elapsedTime: 0,
  };
};
