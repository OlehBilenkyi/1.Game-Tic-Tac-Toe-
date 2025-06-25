import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./GameBoard.css";

const GameBoard = ({
  boardSize,
  winLength,
  players,
  gameActive,
  updateScore,
  history,
  setHistory,
  currentMove,
  setCurrentMove,
  socket,
  roomId,
  isHost,
  isMultiplayer,
}) => {
  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null));
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const currentPlayer = currentMove % 2 === 0 ? "X" : "O";

  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setWinner(null);
    setWinningCells([]);
    setCurrentMove(0);
  }, [boardSize]);

  useEffect(() => {
    if (gameActive && !winner && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, gameActive, winner]);

  useEffect(() => {
    setTimeLeft(30);
  }, [currentMove]);

  const handleClick = (index) => {
    // Условие запрета хода в мультиплеере:
    if (
      board[index] ||
      winner ||
      !gameActive ||
      (isMultiplayer && ((currentPlayer === "X" && !isHost) || (currentPlayer === "O" && isHost)))
    ) {
      return;
    }

    if (isMultiplayer) {
      socket.emit("makeMove", {
        roomId,
        cellIndex: index,
        player: currentPlayer,
      });
    } else {
      // Локальная логика хода
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const newHistory = history.slice(0, currentMove);
      newHistory.push({
        board: [...newBoard],
        move: index,
        player: currentPlayer,
      });
      setHistory(newHistory);
      setCurrentMove(currentMove + 1);

      checkWinner(newBoard, currentPlayer);
    }
  };

  // Обработка ходов от других игроков в мультиплеере
  useEffect(() => {
    if (!socket || !isMultiplayer) return;

    const handleMoveMade = (gameState) => {
      setBoard(gameState.board);
      setCurrentMove((prev) => prev + 1);

      // Проверяем победителя для противоположного игрока,
      // так как ход уже сделан
      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      checkWinner(gameState.board, nextPlayer);
    };

    socket.on("moveMade", handleMoveMade);

    return () => {
      socket.off("moveMade", handleMoveMade);
    };
  }, [socket, isMultiplayer, currentPlayer]);

  const checkWinner = (board, player) => {
    const lines = getAllLines(boardSize, winLength);

    for (let line of lines) {
      if (line.every((cell) => board[cell] === player)) {
        setWinner(player);
        setWinningCells(line);
        updateScore(player);
        return;
      }
    }

    if (board.every((cell) => cell !== null)) {
      setWinner("draw");
    }
  };

  const handleTimeout = () => {
    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    setCurrentMove(currentMove + 1);
    setTimeLeft(30);

    if (players[nextPlayer].isAI) {
      makeAIMove();
    }
  };

  const makeAIMove = () => {
    const emptyCells = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((val) => val !== null);

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      setTimeout(() => handleClick(emptyCells[randomIndex]), 500);
    }
  };

  const renderCell = (index) => {
    const isWinning = winningCells.includes(index);
    return (
      <button
        className={`cell ${board[index] || ""} ${isWinning ? "winning" : ""}`}
        onClick={() => handleClick(index)}
        disabled={!!winner || !gameActive}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="game-board">
      <div className="game-info">
        <div className={`player-turn ${currentPlayer}`}>
          {winner
            ? winner === "draw"
              ? "Ничья!"
              : `Победитель: ${players[winner].name} (${winner})`
            : `Ходит: ${players[currentPlayer].name} (${currentPlayer})`}
        </div>
        <div className="timer">Осталось: {timeLeft} сек</div>
      </div>

      <div
        className="board-grid"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {board.map((_, index) => (
          <div key={index} className="cell-container">
            {renderCell(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

GameBoard.propTypes = {
  boardSize: PropTypes.number.isRequired,
  winLength: PropTypes.number.isRequired,
  players: PropTypes.object.isRequired,
  gameActive: PropTypes.bool.isRequired,
  updateScore: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  setHistory: PropTypes.func.isRequired,
  currentMove: PropTypes.number.isRequired,
  setCurrentMove: PropTypes.func.isRequired,

  socket: PropTypes.object,
  roomId: PropTypes.string,
  isHost: PropTypes.bool,
  isMultiplayer: PropTypes.bool,
};

const getAllLines = (size, length) => {
  const lines = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - length; col++) {
      const line = [];
      for (let i = 0; i < length; i++) {
        line.push(row * size + col + i);
      }
      lines.push(line);
    }
  }

  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - length; row++) {
      const line = [];
      for (let i = 0; i < length; i++) {
        line.push((row + i) * size + col);
      }
      lines.push(line);
    }
  }

  for (let row = 0; row <= size - length; row++) {
    for (let col = 0; col <= size - length; col++) {
      const line = [];
      for (let i = 0; i < length; i++) {
        line.push((row + i) * size + col + i);
      }
      lines.push(line);
    }
  }

  for (let row = 0; row <= size - length; row++) {
    for (let col = length - 1; col < size; col++) {
      const line = [];
      for (let i = 0; i < length; i++) {
        line.push((row + i) * size + col - i);
      }
      lines.push(line);
    }
  }

  return lines;
};

export default GameBoard;
