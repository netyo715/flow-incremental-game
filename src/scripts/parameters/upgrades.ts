import Decimal from "break_infinity.js";
import { ResourceType } from "../../types/factory";
import { Upgrade } from "../../types/upgrades";

export const UPGRADES: Upgrade[] = [
  {
    name: "採石1",
    description: "生産器(石)の出力個数が2倍になる",
    costs: [{ resourceType: ResourceType.Rock, amount: new Decimal(100) }],
  },
];
