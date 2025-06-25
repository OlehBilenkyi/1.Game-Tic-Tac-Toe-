import React, { useState } from "react";
import "./MultiplayerMenu.css";
import { io } from "socket.io-client";

const MultiplayerMenu = ({ onStart, onBack }) => {
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("Игрок");
  const [socket, setSocket] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const connectToServer = () => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    return newSocket;
  };

  const createGame = () => {
    const newSocket = connectToServer();
    const newRoomId = `room-${Math.random().toString(36).substr(2, 9)}`;

    newSocket.emit("createRoom", newRoomId);
    newSocket.on("roomCreated", (id) => {
      setRoomId(id);
      newSocket.on("gameStart", (gameState) => {
        setGameStarted(true);
        onStart({
          player1: playerName,
          player2: "Ожидание соперника...",
          isMultiplayer: true,
          socket: newSocket,
          roomId: id,
          isHost: true,
        });
      });
    });
  };

  const joinGame = () => {
    const newSocket = connectToServer();
    newSocket.emit("joinRoom", roomId);

    newSocket.on("roomJoined", (id) => {
      newSocket.on("gameStart", (gameState) => {
        setGameStarted(true);
        onStart({
          player1: "Хост",
          player2: playerName,
          isMultiplayer: true,
          socket: newSocket,
          roomId: id,
          isHost: false,
        });
      });
    });

    newSocket.on("roomFull", () => {
      alert("Комната заполнена!");
    });
  };

  return (
    <div className="multiplayer-menu">
      <h2>Сетевая игра</h2>

      {!gameStarted ? (
        <>
          <div className="input-group">
            <label>Ваше имя:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>

          <div className="buttons">
            <button onClick={createGame} className="create-btn">
              Создать игру
            </button>

            <div className="join-section">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="ID комнаты"
              />
              <button onClick={joinGame} className="join-btn">
                Присоединиться
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="room-info">
          <p>
            ID комнаты: <strong>{roomId}</strong>
          </p>
          <p>Ожидание соперника...</p>
        </div>
      )}

      <button onClick={onBack} className="back-btn">
        Назад
      </button>
    </div>
  );
};

export default MultiplayerMenu;
