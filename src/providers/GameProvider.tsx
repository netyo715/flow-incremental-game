import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GAME_INTERVAL } from "../define";
import { Game } from "../scripts/game";
import { ResourceType } from "../types/factory";
import Decimal from "break_infinity.js";
import { GameData } from "../types/game";

type GameManager = Readonly<{
  resources: { [key in ResourceType]: Decimal };
  elapsedTime: number;
}>;

const gameContext = createContext<GameManager | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ゲームクラス管理
  const gameRef = useRef<Game>(new Game());
  const clearGameLoopRef = useRef<ReturnType<typeof setTimeout>>();
  
  // ループ管理
  const startTime = useRef<number>(0);
  const tickCount = useRef<number>(0);

  // ゲーム内情報
  const [resources, setResources] = useState<{
    [key in ResourceType]: Decimal;
  }>({}); // TODO 初期値
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    if (clearGameLoopRef.current === undefined) {
      startTime.current = Date.now();
      gameLoop();
    }
  }, []);

  const gameLoop = () => {
    const game = gameRef.current;
    game.tick();
    setGameData(game.gameData);

    // 次のtickをセットする
    tickCount.current++;
    clearGameLoopRef.current = setTimeout(
      gameLoop,
      startTime.current + GAME_INTERVAL * tickCount.current - Date.now()
    );
  };

  const setGameData = (gameData: GameData) => {
    setResources(gameData.resources);
    setElapsedTime(gameData.elapsedTime);
  };

  const value: GameManager = { resources: resources, elapsedTime: elapsedTime };

  return <gameContext.Provider value={value}>{children}</gameContext.Provider>;
};

export const useGame = (): GameManager => {
  const context = useContext(gameContext);
  if (context !== undefined) {
    return context;
  }
  throw Error;
};
