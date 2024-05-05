import { Divider, HStack, VStack, Text, Button } from "@yamada-ui/react";
import { useEffect, useRef, useState } from "react";
import { useGame } from "../../providers/GameProvider";
import { FactoryViewManager } from "../../scripts/moduleView";

export const Factory: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>();
  return (
    <HStack h="100%" gap="0">
      <ModuleListView
        selectedModuleId={selectedModuleId}
        setSelectedModuleId={setSelectedModuleId}
      />
      <Divider orientation="vertical" />
      <ModuleInfoView moduleId={selectedModuleId} />
      <Divider orientation="vertical" />
      <FactoryView
        selectedModuleId={selectedModuleId}
        setSelectedModuleId={setSelectedModuleId}
      />
    </HStack>
  );
};

type ModuleListViewProps = {
  selectedModuleId?: string;
  setSelectedModuleId: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const ModuleListView: React.FC<ModuleListViewProps> = ({
  selectedModuleId,
  setSelectedModuleId,
}) => {
  const { gameData, connectModule, disconnectModule, setPosition } = useGame();
  return (
    <VStack h="100%" minW="200px" maxW="25%">
      <Button
        onClick={() => {
          connectModule(
            { moduleId: "1", index: 0 },
            { moduleId: "0", index: 0 }
          );
          setPosition("0", { x: 100, y: 100 });
          setPosition("1", { x: 200, y: 200 });
        }}
      >
        接続テスト
      </Button>
      <Button
        onClick={() => {
          disconnectModule({ moduleId: "1", index: 0 });
        }}
      >
        切断テスト
      </Button>
      {Array.from(gameData.modules.entries()).map(([moduleId, module]) => {
        return (
          <VStack
            key={"M" + moduleId}
            onClick={() => setSelectedModuleId(moduleId)}
            cursor="pointer"
            backgroundColor={selectedModuleId === moduleId ? "lightpink" : ""}
          >
            <Text>{module.name}</Text>
          </VStack>
        );
      })}
    </VStack>
  );
};

type ModuleInfoViewProps = {
  moduleId?: string;
};
const ModuleInfoView: React.FC<ModuleInfoViewProps> = ({ moduleId }) => {
  const { gameData } = useGame();
  const module = moduleId ? gameData.modules.get(moduleId) : undefined;

  return (
    <VStack h="100%" minW="200px" maxW="25%">
      {module ? (
        <>
          <Text>{module.name}</Text>
          <Text>入力</Text>
          {module.inputs.map((input, index) => {
            return input ? (
              <Text key={"I" + index}>
                {gameData.modules.get(input.moduleId)!.name}
              </Text>
            ) : (
              <Text>接続先なし</Text>
            );
          })}
          <Text>出力</Text>
          {module.outputs.map((output, index) => {
            return output ? (
              <Text key={"O" + index}>
                {gameData.modules.get(output.moduleId)!.name}
              </Text>
            ) : (
              <Text>接続先なし</Text>
            );
          })}
        </>
      ) : (
        <>モジュールを選択するとここに詳細が表示されます</>
      )}
    </VStack>
  );
};

type FactoryViewProps = {
  selectedModuleId?: string;
  setSelectedModuleId: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const FactoryView: React.FC<FactoryViewProps> = ({
  selectedModuleId,
  setSelectedModuleId,
}) => {
  const { gameData, setPosition } = useGame();
  const factoryViewManagerRef = useRef<FactoryViewManager>();

  useEffect(() => {
    if (!factoryViewManagerRef.current) {
      factoryViewManagerRef.current = new FactoryViewManager(
        document.getElementById("moduleView") as HTMLCanvasElement,
        setSelectedModuleId,
        setPosition
      );
    }
    factoryViewManagerRef.current.drawFactory(
      gameData.modules,
      selectedModuleId
    );
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
