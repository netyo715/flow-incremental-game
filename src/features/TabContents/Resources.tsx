import { Text, VStack } from "@yamada-ui/react";
import { useGame } from "../../providers/GameProvider";
import { formatTime } from "../../scripts/util";
import { ResourceType } from "../../types/factory";

export const Resources: React.FC = () => {
  const { gameData } = useGame();
  const elapsedDate = formatTime(gameData.elapsedTime);
  return (
    <VStack>
      <Text>石: {gameData.resources[ResourceType.Rock].toString()}</Text>
      <Text>
        経過時間: {elapsedDate.hours}時間 {elapsedDate.minutes}分{" "}
        {elapsedDate.seconds}秒
      </Text>
    </VStack>
  );
};
