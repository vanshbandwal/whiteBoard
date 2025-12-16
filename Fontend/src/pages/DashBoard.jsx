import React, { useEffect, useRef, useState } from "react";
import { socket } from "../context/Socket";
import { useParams, useNavigate } from "react-router-dom";

export default function DashBoard() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);

  const history = useRef([]);
  const historyStep = useRef(-1);

  const [penColor, setPenColor] = useState("#ffffff");
  const [penSize, setPenSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (!ctxRef.current) return;

    ctxRef.current.strokeStyle = penColor;
    ctxRef.current.lineWidth = penSize;
  }, [penColor, penSize]);

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }
    console.log("Attempting to join room:", roomId);
    const onErrorRoom = (msg) => {
      alert(msg); navigate("/");
    }; const onUserJoined = ({ socketId }) => {
      console.log("New user joined this room:", socketId);
    };

    const drawTicTacToe = (ctx, canvas) => {
      const w = canvas.width;
      const h = canvas.height;

      const cellW = w / 3;
      const cellH = h / 3;

      ctx.beginPath();
      ctx.moveTo(cellW, 0);
      ctx.lineTo(cellW, h);

      ctx.moveTo(2 * cellW, 0);
      ctx.lineTo(2 * cellW, h);

      ctx.moveTo(0, cellH);
      ctx.lineTo(w, cellH);

      ctx.moveTo(0, 2 * cellH);
      ctx.lineTo(w, 2 * cellH);

      ctx.stroke();
    };

    const drawDotsGrid = (ctx, canvas) => {
      const cols = 10;
      const rows = 10;

      const gapX = canvas.width / (cols + 1);
      const gapY = canvas.height / (rows + 1);

      ctx.fillStyle = penColor;

      for (let i = 1; i <= cols; i++) {
        for (let j = 1; j <= rows; j++) {
          ctx.beginPath();
          ctx.arc(i * gapX, j * gapY, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawTemplate = (type) => {
      console.log("Receive type from drawTemplate", type)
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      ctx.strokeStyle = penColor;
      ctx.lineWidth = 2;

      switch (type) {
        case "tictactoe":
          drawTicTacToe(ctx, canvas);
          break;
        case "dots":
          drawDotsGrid(ctx, canvas);
          break;
      }
    };
    socket.emit("join-room", roomId);
    socket.on("draw-line", ({ x, y, color, size }) => {
      const ctx = ctxRef.current;
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineTo(x, y);
      ctx.stroke();
    });
    socket.on("begin-path", ({ x, y }) => {
      const ctx = ctxRef.current;
      ctx.beginPath();
      ctx.moveTo(x, y);
    });
    socket.on("clear-canvas", () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    })
    socket.on("undo", ({ image }) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      const img = new Image();
      img.src = image;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    });
    socket.on("error-room", onErrorRoom);
    socket.on("template", ({ type }) => {
      console.log("Recevied type from Socket", type)
      drawTemplate(type);
    });

    socket.on("user-joined", onUserJoined);
    return () => {
      socket.emit("leave-room", roomId);
      socket.off("undo")
      socket.off("template")
      socket.off("error-room", onErrorRoom);
      socket.off("user-joined", onUserJoined);
      socket.off("draw-line");
      socket.off("clear-canvas")
    };
  }, [roomId, navigate]);

  const handleUndo = () => {
    if (historyStep.current <= 0) return;

    historyStep.current--;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const img = new Image();
    img.src = history.current[historyStep.current];

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      socket.emit("undo", {
        roomId,
        image: history.current[historyStep.current],
      });
    };
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear-canvas", { roomId });

  }

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;

    history.current.push(canvas.toDataURL());
    historyStep.current++;

    isDrawing.current = true;

    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    socket.emit("begin-path", {
      roomId,
      x: offsetX,
      y: offsetY,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
    socket.emit("draw-line", {
      roomId,
      x: offsetX,
      y: offsetY,
      color: penColor,
      size: penSize,
    })
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    ctxRef.current.closePath();
  };
  const drawTicTacToe = (ctx, canvas) => {
    const w = canvas.width;
    const h = canvas.height;

    const cellW = w / 3;
    const cellH = h / 3;

    ctx.beginPath();
    ctx.moveTo(cellW, 0);
    ctx.lineTo(cellW, h);

    ctx.moveTo(2 * cellW, 0);
    ctx.lineTo(2 * cellW, h);

    ctx.moveTo(0, cellH);
    ctx.lineTo(w, cellH);

    ctx.moveTo(0, 2 * cellH);
    ctx.lineTo(w, 2 * cellH);

    ctx.stroke();
  };

  const drawDotsGrid = (ctx, canvas) => {
    const cols = 10;
    const rows = 10;

    const gapX = canvas.width / (cols + 1);
    const gapY = canvas.height / (rows + 1);

    ctx.fillStyle = "#ffffff";

    for (let i = 1; i <= cols; i++) {
      for (let j = 1; j <= rows; j++) {
        ctx.beginPath();
        ctx.arc(i * gapX, j * gapY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawTemplate = (type) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;

    switch (type) {
      case "tictactoe":
        drawTicTacToe(ctx, canvas);
        break;
      case "dots":
        drawDotsGrid(ctx, canvas);
        break;
    }
  };
  const saveHistory = () => {
    const canvas = canvasRef.current;
    history.current.push(canvas.toDataURL());
    historyStep.current++;
  };

  const handleSelectTemplate = (type) => {
    drawTemplate(type);
    saveHistory();
    socket.emit("template", { roomId, type });
  };


  return (
    <div className="flex w-full h-screen bg-[#0b0b0b] text-white overflow-hidden">

      <div className="w-[80%] h-full bg-[#111] flex flex-col items-center justify-start border-r border-[#222] relative">

        <div className="w-[95%] mt-4 mb-2 bg-[#1a1a1a] p-3 rounded-lg flex items-center gap-3 border border-[#333]">
          <button onClick={handleUndo} className="px-3 py-1 bg-[#2a2a2a] rounded-md hover:bg-[#333]">Undo</button>

          <button className="px-3 py-1 bg-red-600 rounded-md hover:bg-red-700" onClick={handleClear}>Clear</button>

          <div className="flex items-center gap-2 ml-4">
            <label className="text-sm text-gray-300">Color</label>
            <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)} className="w-8 h-8" />
          </div>

          <div className="flex items-center gap-2 ml-4">
            <label className="text-sm text-gray-300">Size</label>
            <input
              type="range"
              min="1"
              max="30"
              value={penSize}
              onChange={(e) => setPenSize(Number(e.target.value))}
              className="w-36"
            />
            <span>{penSize}</span>
          </div>
          <select
            className="bg-[#2a2a2a] p-2 rounded"
            onChange={(e) => handleSelectTemplate(e.target.value)}
          >
            <option value="">Templates</option>
            <option value="tictactoe">Tic Tac Toe</option>
            <option value="dots">Dots Grid</option>
          </select>

          <div className="ml-auto text-sm text-gray-300">
            Room: <span className="font-medium">{roomId}</span>
          </div>
        </div>

        <div className="w-[95%] h-[85%] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="bg-[#0d0d0d] w-full h-full rounded-xl border border-[#333]"
          />
        </div>
      </div>
    </div>
  );
}
