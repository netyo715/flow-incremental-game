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
  Card,
  Heading,
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
    <VStack h="100%" minW="200px" maxW="25%" gap="0" p="sm">
      <Heading fontSize="2xl">モジュール一覧</Heading>
      {Array.from(gameData.modules.entries()).map(([moduleId, module]) => {
        return (
          <VStack
            key={"M" + moduleId}
            onClick={() => setSelectedModuleId(moduleId)}
            cursor="pointer"
            p="sm"
            backgroundColor={selectedModuleId === moduleId ? "cyan.100" : ""}
          >
            <Text fontSize="xl">{module.name}</Text>
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
      <VStack h="100%" minW="200px" maxW="25%" p="sm">
        {module ? (
          <>
            <Heading fontSize="2xl">{module.name}</Heading>
            {module.position ? (
              <>
                <Button onClick={() => setPosition(moduleId!, undefined)}>
                  取り除く
                </Button>
                {module.inputs.length > 0 ? (
                  <>
                    <Heading fontSize="xl">入力</Heading>
                    {module.inputs.map((input, index) => {
                      return (
                        <Text
                          key={"I" + index}
                          onClick={() => {
                            setIsInput(true);
                            setIOIndex(index);
                            modalControl.onOpen();
                          }}
                          cursor="pointer"
                        >
                          {input
                            ? `${
                                gameData.modules.get(input.moduleId)!.name
                              } - ${input.index + 1}`
                            : "接続先なし"}
                        </Text>
                      );
                    })}
                  </>
                ) : (
                  ""
                )}
                {module.outputs.length > 0 ? (
                  <>
                    <Heading fontSize="xl">出力</Heading>
                    {module.outputs.map((output, index) => {
                      return (
                        <Text
                          key={"O" + index}
                          onClick={() => {
                            setIsInput(false);
                            setIOIndex(index);
                            modalControl.onOpen();
                          }}
                          cursor="pointer"
                        >
                          {output
                            ? `${
                                gameData.modules.get(output.moduleId)!.name
                              } - ${output.index + 1}`
                            : "接続先なし"}
                        </Text>
                      );
                    })}
                  </>
                ) : (
                  ""
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
          <Text
            cursor="pointer"
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
          </Text>
          {Array.from(gameData.modules.entries())
            .filter(([_, modalModule]) => {
              return modalModule.position !== undefined;
            })
            .map(([modalModuleId, modalModule]) => {
              const IOs = isInput ? modalModule.outputs : modalModule.inputs;
              return IOs.map((_, index) => {
                return (
                  <Text
                    cursor="pointer"
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
                    {modalModule.name} - {index + 1}
                  </Text>
                );
              });
            })}
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
