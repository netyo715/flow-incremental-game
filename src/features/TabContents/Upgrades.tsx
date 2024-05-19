import { Button, VStack } from "@yamada-ui/react";
import { useGame } from "../../providers/GameProvider";
import { UPGRADES } from "../../scripts/parameters/upgrades";

export const Upgrades: React.FC = () => {
  const { gameData, unlockUpgrade } = useGame();
  return (
    <VStack>
      <Button onClick={() => unlockUpgrade(0)}>
        {UPGRADES[0].name}
        {gameData.upgradesUnlocked[0] ? "解除済み" : ""}
      </Button>
    </VStack>
  );
};
