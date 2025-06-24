import React, { useState } from "react";
import GameBoard from "./components/GameBoard/GameBoard";
import PlayerInput from "./components/PlayerInput/PlayerInput";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import GameSettings from "./components/GameSettings/GameSettings";
import History from "./components/History/History";
import ThemeSelector from "./components/ThemeSelector/ThemeSelector";
import "./App.css";

function App() {
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

      {!gameActive ? (
        <div className="setup-screen">
          <PlayerInput onStart={startGame} />
          <GameSettings
            boardSize={boardSize}
            setBoardSize={setBoardSize}
            winLength={winLength}
            setWinLength={setWinLength}
          />
        </div>
      ) : (
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
