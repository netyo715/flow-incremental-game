import Decimal from "break_infinity.js";
import { ResourceType } from "./factory";
import Module from "module";

export type GameData = {
  resources: { [key in ResourceType]: Decimal };
  modules: Module[];
  achievementsUnlocked: boolean[];
  elapsedTime: number;
};
