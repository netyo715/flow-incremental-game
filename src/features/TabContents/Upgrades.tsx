import { VStack } from "@yamada-ui/react";
import { useGame } from "../../providers/GameProvider";

export const Upgrades: React.FC = () => {
  const { gameData } = useGame();
  return <VStack></VStack>;
};
