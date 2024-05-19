import Decimal from "break_infinity.js";
import { ResourceType } from "./factory";

export type Upgrade = {
  name: string;
  description: string;
  costs: { resourceType: ResourceType; amount: Decimal }[];
};
