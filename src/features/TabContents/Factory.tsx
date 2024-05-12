import {
  Divider,
  HStack,
  VStack,
  Text,
  Button,
  Modal,
  ModalHeader,
  useDisclosure,
  ModalBody,
} from "@yamada-ui/react";
import { useEffect, useRef, useState } from "react";
import { useGame } from "../../providers/GameProvider";
import { FactoryViewManager } from "../../scripts/moduleView";
import { ModuleType } from "../../types/factory";

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
  const { gameData, connectModule, disconnectModule, setPosition } = useGame();
  const module = moduleId ? gameData.modules.get(moduleId) : undefined;

  const modalControl = useDisclosure();
  const [isInput, setIsInput] = useState<boolean>(true);
  const [IOIndex, setIOIndex] = useState<number>(0);

  return (
    <>
      <VStack h="100%" minW="200px" maxW="25%">
        {module ? (
          <>
            <Text>{module.name}</Text>
            {module.position ? (
              <>
                <Button onClick={() => setPosition(moduleId!, undefined)}>
                  取り除く
                </Button>
                {module.inputs.length === 0 ? (
                  <Text>入力なし</Text>
                ) : (
                  <>
                    <Text>入力</Text>
                    {module.inputs.map((input, index) => {
                      return (
                        <Text
                          key={"I" + index}
                          onClick={() => {
                            setIsInput(true);
                            setIOIndex(index);
                            modalControl.onOpen();
                          }}
                        >
                          {input
                            ? gameData.modules.get(input.moduleId)!.name
                            : "接続先なし"}
                        </Text>
                      );
                    })}
                  </>
                )}
                {module.outputs.length === 0 ? (
                  <Text>出力なし</Text>
                ) : (
                  <>
                    <Text>出力</Text>
                    {module.outputs.map((output, index) => {
                      return (
                        <Text
                          key={"O" + index}
                          onClick={() => {
                            setIsInput(false);
                            setIOIndex(index);
                            modalControl.onOpen();
                          }}
                        >
                          {output
                            ? gameData.modules.get(output.moduleId)!.name
                            : "接続先なし"}
                        </Text>
                      );
                    })}
                  </>
                )}
              </>
            ) : (
              <Button
                onClick={() => {
                  setPosition(moduleId!, { x: 256, y: 256 });
                }}
              >
                配置する
              </Button>
            )}
          </>
        ) : (
          <>モジュールを選択するとここに詳細が表示されます</>
        )}
      </VStack>
      <Modal isOpen={modalControl.isOpen} onClose={modalControl.onClose}>
        <ModalHeader>{isInput ? "入力" : "出力"}先を選択</ModalHeader>
        <ModalBody>
          {Array.from(gameData.modules.entries())
            .filter(([_, modalModule]) => {
              return modalModule.position !== undefined;
            })
            .map(([modalModuleId, modalModule]) => {
              const IOs = isInput ? modalModule.outputs : modalModule.inputs;
              return IOs.map((_, index) => {
                return (
                  <Text
                    onClick={() => {
                      if (isInput) {
                        connectModule(
                          { moduleId: module!.id, index: IOIndex },
                          { moduleId: modalModuleId, index: index }
                        );
                      } else {
                        connectModule(
                          { moduleId: modalModuleId, index: index },
                          { moduleId: module!.id, index: IOIndex }
                        );
                      }
                      modalControl.onClose();
                    }}
                  >
                    {modalModule.name}:{index + 1}
                  </Text>
                );
              });
            })}
          <Button
            onClick={() => {
              if (isInput) {
                disconnectModule({ moduleId: module!.id, index: IOIndex });
              } else {
                disconnectModule(undefined, {
                  moduleId: module!.id,
                  index: IOIndex,
                });
              }
              modalControl.onClose();
            }}
          >
            切断する
          </Button>
        </ModalBody>
      </Modal>
    </>
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
