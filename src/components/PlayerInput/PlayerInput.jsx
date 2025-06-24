import React, { useState } from "react";
import "./PlayerInput.css";

const PlayerInput = ({ onStart }) => {
  const [player1, setPlayer1] = useState("Игрок 1");
  const [player2, setPlayer2] = useState("Игрок 2");
  const [vsAI, setVsAI] = useState(false);

  const handleStart = () => {
    onStart(player1, vsAI ? "Компьютер" : player2, vsAI);
  };

  return (
    <div className="player-input">
      <h2>Настройка игроков</h2>
      <div className="input-group">
        <label>Игрок 1 (X):</label>
        <input
          type="text"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          placeholder="Имя игрока 1"
        />
      </div>

      <div className="ai-toggle">
        <label>
          <input
            type="checkbox"
            checked={vsAI}
            onChange={() => setVsAI(!vsAI)}
          />
          Играть против компьютера
        </label>
      </div>

      {!vsAI && (
        <div className="input-group">
          <label>Игрок 2 (O):</label>
          <input
            type="text"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            placeholder="Имя игрока 2"
          />
        </div>
      )}

      <button className="start-btn" onClick={handleStart}>
        Начать игру
      </button>
    </div>
  );
};

export default PlayerInput;
