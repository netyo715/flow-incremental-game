import { Text, VStack } from "@yamada-ui/react";
import { useGame } from "../../providers/GameProvider";
import { ACHIEVEMENTS } from "../../scripts/parameters/achievements";

export const Achievements: React.FC = () => {
  const { gameData } = useGame();
  return (
    <VStack>
      {ACHIEVEMENTS.map((achievement, index) => {
        return (
          <Text>
            {achievement.name} {achievement.description}{" "}
            {gameData.achievementsUnlocked[index] ? "達成" : "未達成"}
          </Text>
        );
      })}
    </VStack>
  );
};
