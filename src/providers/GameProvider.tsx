import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GAME_INTERVAL } from "../define";
import { Game, initialGameData } from "../scripts/game";
import { GameData } from "../types/game";

type GameManager = {
  readonly gameData: GameData;
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

  // ゲーム内情報
  const [gameData, setGameData] = useState<GameData>(initialGameData());

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
    const game = gameRef.current;
    game.tick();
    setGameData({ ...game.gameData });

    // 次のtickをセットする
    // startTimeからの時間当たりtick量を守る
    tickCount.current++;
    clearGameLoopRef.current = setTimeout(
      gameLoop,
      startTime.current + GAME_INTERVAL * tickCount.current - Date.now()
    );
  };

  const value: GameManager = { gameData: gameData! };

  return <gameContext.Provider value={value}>{children}</gameContext.Provider>;
};

export const useGame = (): GameManager => {
  const context = useContext(gameContext);
  if (context !== undefined) {
    return context;
  }
  throw Error;
};
