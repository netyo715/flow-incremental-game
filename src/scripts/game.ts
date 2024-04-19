import { GAME_FPS } from "../define";
import { GameData } from "../types/game";

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
    if (this.tickCount % GAME_FPS === 0) {
      this.updateElapsedTime();
    }
  }

  updateElapsedTime() {
    const now = Date.now();
    this.gameData.elapsedTime += now - this.prevTime;
    this.prevTime = now;
  }
}

const initialGameData = (): GameData => {
  return {
    resources: {},
    modules: [],
    achievementsUnlocked: [],
    elapsedTime: 0,
  };
};
