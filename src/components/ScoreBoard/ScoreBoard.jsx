import React from "react";
import "./ScoreBoard.css";

const ScoreBoard = ({ players, currentPlayer }) => {
  return (
    <div className="score-board">
      <div className={`score-player ${currentPlayer === "X" ? "active" : ""}`}>
        <span className="player-symbol">X</span>
        <span className="player-name">{players.X.name}</span>
        <span className="player-score">{players.X.score}</span>
      </div>

      <div className="vs-separator">VS</div>

      <div className={`score-player ${currentPlayer === "O" ? "active" : ""}`}>
        <span className="player-symbol">O</span>
        <span className="player-name">{players.O.name}</span>
        <span className="player-score">{players.O.score}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;
