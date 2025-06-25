import React, { useState } from "react";
import GameBoard from "./components/GameBoard/GameBoard";
import PlayerInput from "./components/PlayerInput/PlayerInput";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import GameSettings from "./components/GameSettings/GameSettings";
import History from "./components/History/History";
import ThemeSelector from "./components/ThemeSelector/ThemeSelector";
import "./App.css";

/**
 * Заглушка компонента меню для сетевой игры
 * @param {{ onStart: (options: any) => void; onBack: () => void }} props
 */
function MultiplayerMenu({ onStart, onBack }) {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  // Можно добавить дополнительные настройки мультиплеера

  const handleStart = () => {
    if (player1.trim() && player2.trim()) {
      onStart({ player1: player1.trim(), player2: player2.trim() });
    } else {
      alert("Введите имена игроков");
    }
  };

  return (
    <div className="multiplayer-menu">
      <h2>Сетевая игра - настройка</h2>
      <input
        type="text"
        placeholder="Имя игрока X"
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
      />
      <input
        type="text"
        placeholder="Имя игрока O"
        value={player2}
        onChange={(e) => setPlayer2(e.target.value)}
      />
      <div className="multiplayer-buttons">
        <button onClick={handleStart}>Начать игру</button>
        <button onClick={onBack}>Назад</button>
      </div>
    </div>
  );
}

function App() {
  // Новый state для режима игры
  const [gameMode, setGameMode] = useState(null); // 'local', 'ai', 'multiplayer' | null

  const [players, setPlayers] = useState({
    X: { name: "Игрок 1", score: 0, isAI: false },
    O: { name: "Игрок 2", score: 0, isAI: false },
  });

  const [gameActive, setGameActive] = useState(false);
  const [theme, setTheme] = useState("default");
  const [boardSize, setBoardSize] = useState(3);
  const [winLength, setWinLength] = useState(3);
  const [history, setHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [multiplayerOptions, setMultiplayerOptions] = useState(null);

  /**
   * Запуск игры в локальном или AI режиме
   * @param {string} player1
   * @param {string} player2
   * @param {boolean} isAI
   */
  const startGame = (player1, player2, isAI = false) => {
    setPlayers({
      X: { name: player1, score: 0, isAI: false },
      O: { name: player2, score: 0, isAI },
    });
    setGameActive(true);
    setHistory([]);
    setCurrentMove(0);
  };

  const resetGame = () => {
    setGameActive(false);
    setGameMode(null); // при сбросе можно возвращаться к выбору режима
  };

  const updateScore = (winner) => {
    setPlayers((prev) => ({
      ...prev,
      [winner]: {
        ...prev[winner],
        score: prev[winner].score + 1,
      },
    }));
  };

  return (
    <div className={`app ${theme}`}>
      <h1>Крестики-Нолики PRO</h1>

      <ThemeSelector theme={theme} setTheme={setTheme} />

      {/* Выбор режима, если режим не выбран */}
      {!gameMode ? (
        <div className="mode-selector">
          <h2>Выберите режим игры</h2>
          <button onClick={() => setGameMode("local")}>Локальная игра</button>
          <button onClick={() => setGameMode("ai")}>Игра с ИИ</button>
          <button onClick={() => setGameMode("multiplayer")}>
            Сетевая игра
          </button>
        </div>
      ) : gameMode === "multiplayer" ? (
        // Меню сетевой игры
        <MultiplayerMenu
          onStart={(options) => {
            setPlayers({
              X: { name: options.player1, score: 0, isAI: false },
              O: { name: options.player2, score: 0, isAI: false },
            });
            setMultiplayerOptions(options);
            setGameActive(true);
          }}
          onBack={() => setGameMode(null)}
        />
      ) : !gameActive ? (
        // Локальный или AI режимы: ввод игроков + настройки
        <div className="setup-screen">
          <PlayerInput
            onStart={(p1, p2) => {
              const isAI = gameMode === "ai";
              startGame(p1, p2, isAI);
            }}
          />
          <GameSettings
            boardSize={boardSize}
            setBoardSize={setBoardSize}
            winLength={winLength}
            setWinLength={setWinLength}
          />
          <button onClick={() => setGameMode(null)} className="back-btn">
            Назад к выбору режима
          </button>
        </div>
      ) : (
        // Игра запущена (любые режимы)
        <div className="game-screen">
          <ScoreBoard
            players={players}
            currentPlayer={currentMove % 2 === 0 ? "X" : "O"}
          />

          <div className="game-container">
            <GameBoard
              boardSize={boardSize}
              winLength={winLength}
              players={players}
              gameActive={gameActive}
              updateScore={updateScore}
              history={history}
              setHistory={setHistory}
              currentMove={currentMove}
              setCurrentMove={setCurrentMove}
            />

            <History
              history={history}
              currentMove={currentMove}
              setCurrentMove={setCurrentMove}
              players={players}
            />
          </div>

          <button className="reset-btn" onClick={resetGame}>
            Новая игра
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
