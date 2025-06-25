import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("createRoom", (roomId) => {
    rooms[roomId] = { players: [], board: null, currentPlayer: "X" };
    socket.join(roomId);
    socket.emit("roomCreated", roomId);
  });

  socket.on("joinRoom", (roomId) => {
    if (rooms[roomId] && rooms[roomId].players.length < 2) {
      socket.join(roomId);
      rooms[roomId].players.push(socket.id);
      socket.emit("roomJoined", roomId);

      if (rooms[roomId].players.length === 2) {
        io.to(roomId).emit("gameStart", rooms[roomId]);
      }
    } else {
      socket.emit("roomFull");
    }
  });

  socket.on("makeMove", ({ roomId, cellIndex, player }) => {
    if (rooms[roomId] && rooms[roomId].currentPlayer === player) {
      rooms[roomId].board[cellIndex] = player;
      rooms[roomId].currentPlayer = player === "X" ? "O" : "X";

      io.to(roomId).emit("moveMade", {
        board: rooms[roomId].board,
        currentPlayer: rooms[roomId].currentPlayer,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (const roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(
        (id) => id !== socket.id
      );
      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
