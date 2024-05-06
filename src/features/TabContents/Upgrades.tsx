import { Button, Heading, HStack, Text, VStack } from "@yamada-ui/react";
import { moduleTypes, resourceTypeNames } from "../../types/factory";
import {
  moduleLevelUpCosts,
  moduleNames,
} from "../../scripts/parameters/modules";
import { useGame } from "../../providers/GameProvider";

export const Upgrades: React.FC = () => {
  const { gameData, levelUp } = useGame();
  return (
    <VStack>
      <Heading>モジュール</Heading>
      {moduleTypes.map((moduleType) => {
        const levelUpCost = moduleLevelUpCosts(
          moduleType,
          gameData.moduleLevels[moduleType]
        );
        return (
          <HStack>
            <Text>
              {moduleNames[moduleType]}: Lv{gameData.moduleLevels[moduleType]}
            </Text>
            <Button onClick={() => levelUp(moduleType)}>
              LvUp ({resourceTypeNames[levelUpCost.resourceType]}{" "}
              {levelUpCost.level}個)
            </Button>
          </HStack>
        );
      })}
    </VStack>
  );
};
