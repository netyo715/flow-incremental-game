import { Divider, HStack, VStack, Text, Button } from "@yamada-ui/react";
import { useEffect, useRef, useState } from "react";
import { useGame } from "../../providers/GameProvider";
import { drawModuleView } from "../../scripts/moduleView";

export const Factory: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>();
  return (
    <HStack h="100%" gap="0">
      <ModuleList
        selectedModuleId={selectedModuleId}
        setSelectedModuleId={setSelectedModuleId}
      />
      <Divider orientation="vertical" />
      <ModuleView
        selectedModuleId={selectedModuleId}
        setSelectedModuleId={setSelectedModuleId}
      />
    </HStack>
  );
};

type ModuleListProps = {
  selectedModuleId?: string;
  setSelectedModuleId: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const ModuleList: React.FC<ModuleListProps> = ({
  selectedModuleId,
  setSelectedModuleId,
}) => {
  const { gameData } = useGame();
  const { connectModule, disconnectModule } = useGame();
  const selectedModule =
    selectedModuleId === undefined
      ? selectedModuleId
      : gameData.modules.get(selectedModuleId);
  return (
    <VStack h="100%" minW="200px" maxW="25%">
      <Button
        onClick={() =>
          connectModule(
            { moduleId: "1", index: 0 },
            { moduleId: "0", index: 0 }
          )
        }
      >
        接続
      </Button>
      <Button
        onClick={() => {
          disconnectModule({ moduleId: "1", index: 0 });
        }}
      >
        切断
      </Button>
      {selectedModule === undefined ? (
        <>
          {Array.from(gameData.modules.entries()).map(([moduleId, module]) => {
            return (
              <VStack
                key={"M" + moduleId}
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
          <Text>{selectedModule.name}</Text>
          <Text>入力</Text>
          {selectedModule.inputs.map((input, index) => {
            return input.connectedModuleIO ? (
              <Text key={"I" + index}>
                {gameData.modules.get(input.connectedModuleIO.moduleId)!.name}
              </Text>
            ) : (
              <Text>接続先なし</Text>
            );
          })}
          <Text>出力</Text>
          {selectedModule.outputs.map((output, index) => {
            return output.connectedModuleIO ? (
              <Text key={"O" + index}>
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

type ModuleViewProps = {
  selectedModuleId?: string;
  setSelectedModuleId: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const ModuleView: React.FC<ModuleViewProps> = ({
  selectedModuleId,
  setSelectedModuleId,
}) => {
  const { gameData } = useGame();
  const canvasContextRef = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    if (!canvasContextRef.current) {
      const canvas = document.getElementById("moduleView") as HTMLCanvasElement;
      canvasContextRef.current = canvas.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
    }
    const context = canvasContextRef.current;
    drawModuleView(context, gameData.modules, selectedModuleId);
  });

  return (
    <VStack h="100%" w="512px" minW="512px">
      <canvas
        id="moduleView"
        width="512"
        height="512"
        style={{ background: "lightgray" }}
      ></canvas>
    </VStack>
  );
};
