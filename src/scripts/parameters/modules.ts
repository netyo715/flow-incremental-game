import Decimal from "break_infinity.js";
import {
  ModuleResourceType,
  ModuleType,
  ResourceType,
} from "../../types/factory";
import { Game } from "../game";

// TODO 詳細
export const moduleInfo: ModuleInfo = {
  RockGenerator: {
    name: "生産器(石)",
    input: [],
    output: [
      { resourceType: ModuleResourceType.Rock, amountLimit: new Decimal(1) },
    ],
    action: () => {
      return [
        { resourceType: ModuleResourceType.Rock, amount: new Decimal(1) },
      ];
    },
  },
  RockReceiver: {
    name: "回収器(石)",
    input: [
      { resourceType: ModuleResourceType.Rock, amountLimit: new Decimal(1) },
    ],
    output: [],
    action: (game, inputs) => {
      game.gameData.resources[ResourceType.Rock].add(inputs[0].amount);
      return [];
    },
  },
};
export type ModuleInfo = {
  [key in ModuleType]: {
    name: string;
    input: {
      resourceType: ModuleResourceType;
      amountLimit: Decimal;
    }[];
    output: {
      resourceType: ModuleResourceType;
      amountLimit: Decimal;
    }[];
    action: (
      game: Game,
      inputs: { resourceType: ModuleResourceType; amount: Decimal }[]
    ) => { resourceType: ModuleResourceType; amount: Decimal }[];
  };
};
