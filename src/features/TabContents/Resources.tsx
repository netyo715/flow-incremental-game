import { Text, VStack } from "@yamada-ui/react";
import { useGame } from "../../providers/GameProvider";

export const Resources: React.FC = () => {
  const { elapsedTime } = useGame();
  return (
    <VStack>
      <Text>経過時間: {elapsedTime}</Text>
    </VStack>
  );
};
