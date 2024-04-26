import { Divider, HStack, VStack, Text, Button } from "@yamada-ui/react";
import { useState } from "react";
import { useGame } from "../../providers/GameProvider";
import { moduleInfo } from "../../scripts/parameters/modules";
import { GameData } from "../../types/game";

export const Factory: React.FC = () => {
  const { gameData } = useGame();
  const [selectedModuleId, setSelectedModuleId] = useState<string>();
  return (
    <HStack h="100%" gap="0">
      <ModuleList
        gameData={gameData}
        selectedModuleId={selectedModuleId}
        setSelectedModuleId={setSelectedModuleId}
      />
      <Divider orientation="vertical" />
      <VStack></VStack>
    </HStack>
  );
};

type ModuleListProp = {
  gameData: GameData;
  selectedModuleId?: string;
  setSelectedModuleId: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const ModuleList: React.FC<ModuleListProp> = ({
  gameData,
  selectedModuleId,
  setSelectedModuleId,
}) => {
  const { connectModule, disconnectModule } = useGame();
  const selectedModule = selectedModuleId
    ? gameData.modules.get(selectedModuleId)
    : undefined;
  return (
    <VStack h="100%" minW="200px" maxW="25%">
      {selectedModule === undefined ? (
        <>
          {Array.from(gameData.modules.entries()).map(([moduleId, module]) => {
            return (
              <VStack
                key={moduleId}
                onClick={() => setSelectedModuleId(moduleId)}
                cursor="pointer"
              >
                <Text>{module.name}</Text>
              </VStack>
            );
          })}
        </>
      ) : (
        <>
          <Button onClick={() => setSelectedModuleId(undefined)}>閉じる</Button>
          <Text>{moduleInfo[selectedModule.moduleType].name}</Text>
          <Text>入力</Text>
          {selectedModule.inputs.map((input) => {
            return input.connectedModuleIO ? (
              <Text>
                {gameData.modules.get(input.connectedModuleIO.moduleId)!.name}
              </Text>
            ) : (
              <Text>接続先なし</Text>
            );
          })}
          <Text>出力</Text>
          {selectedModule.outputs.map((output) => {
            return output.connectedModuleIO ? (
              <Text>
                {gameData.modules.get(output.connectedModuleIO.moduleId)!.name}
              </Text>
            ) : (
              <Text>接続先なし</Text>
            );
          })}
        </>
      )}
    </VStack>
  );
};
