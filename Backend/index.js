const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const MongoDB =
  "mongodb+srv://vanshbandwal93_db_user:Hs3aGxxnBS9ZaEn8@cluster0.i599bzy.mongodb.net/?appName=Cluster0";

const app = express();
const server = http.createServer(app);
const authcontrollers = require("./Controllers/authcontrollers.jsx");
const authMiddleware = require("./Middleware/authMiddleware.js");
const cookieParser = require("cookie-parser");
const Room = require("./Model/Room.js");

const FRONTEND_URL = "http://localhost:5173";

app.use(cookieParser());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join-room", async (roomId) => {
    const roomExists = await Room.findOne({ roomId });

    if (!roomExists) {
      socket.emit("error-room", "Room does not exist");
      return;
    }

    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    socket.to(roomId).emit("user-joined", { socketId: socket.id });
  });
  socket.on("draw-line", (data) => {
    socket.to(data.roomId).emit("draw-line", data);
  });
  socket.on("begin-path",(data)=>{
    socket.to(data.roomId).emit("begin-path",data)
  })
  socket.on("clear-canvas",(data)=>{
    socket.to(data.roomId).emit("clear-canvas")
  })
  socket.on("undo",(data)=>{
    socket.to(data.roomId).emit("undo",data)
  })
  socket.on("template",(data)=>{
    console.log(data.roomId,data.type)
    socket.to(data.roomId).emit("template",data)
  })
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

app.use("/api", authcontrollers);

app.get("/api/check-auth", authMiddleware, (req, res) => {
  console.log("req.user");
  res.json({ authenticated: true, user: req.user });
});

app.get("/", (req, res) => res.send("Server is running"));

const PORT = 3000;

mongoose
  .connect(MongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = { io };
