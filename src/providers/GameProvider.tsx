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
import { GameData } from "../types/game";

type GameManager = {
  readonly gameData: GameData;
  connectModule: (
    input: {
      moduleId: string;
      index: number;
    },
    output: {
      moduleId: string;
      index: number;
    }
  ) => void;
  disconnectModule: (
    input?: {
      moduleId: string;
      index: number;
    },
    output?: {
      moduleId: string;
      index: number;
    }
  ) => void;
  setPosition: (
    moduleId: string,
    position:
      | {
          x: number;
          y: number;
        }
      | undefined
  ) => void;
};

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

  // 再レンダリング用
  const [_, setTrigger] = useState<boolean>(false);

  useEffect(() => {
    if (clearGameLoopRef.current === undefined) {
      document.onvisibilitychange = () => {
        // タブの表示切り替えがあるとfps固定用の値をリセット
        // これが無いとタブ非表示で放置したとき
        // ページ読み込みからの時間当たりtick量を守ろうとして超高速tickする
        startTime.current = Date.now();
        tickCount.current = 0;
      };
      startTime.current = Date.now();
      tickCount.current = 0;
      gameLoop();
    }
  }, []);

  const gameLoop = () => {
    const game = gameRef.current!;
    game.tick();
    reRender();

    // 次のtickをセットする
    // startTimeからの時間当たりtick量を守る
    tickCount.current++;
    clearGameLoopRef.current = setTimeout(
      gameLoop,
      startTime.current + GAME_INTERVAL * tickCount.current - Date.now()
    );
  };

  // 強制再レンダリング
  const reRender = () => {
    setTrigger((trigger) => !trigger);
  };

  const value: GameManager = {
    gameData: gameRef.current.gameData,
    connectModule: (input, output) => {
      gameRef.current.connectModule(input, output);
    },
    disconnectModule: (input?, output?) => {
      gameRef.current.disconnectModule(input, output);
    },
    setPosition: (moduleId, position) => {
      const module = gameRef.current.gameData.modules.get(moduleId);
      if (module) {
        module.position = position;
      }
    },
  };

  return <gameContext.Provider value={value}>{children}</gameContext.Provider>;
};

export const useGame = (): GameManager => {
  const context = useContext(gameContext);
  if (context !== undefined) {
    return context;
  }
  throw Error;
};
