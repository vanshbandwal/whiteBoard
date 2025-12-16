import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      setCreating(true);
      const res = await axios.post("http://localhost:3000/api/create-room");
      const newRoom = res.data.roomId;

      setRoomId(newRoom);
      alert("Room created: " + newRoom);
    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async () => {
    if (!roomId.trim()) return alert("Enter Room ID");

    try {
      const res = await axios.get(
        `http://localhost:3000/api/check-room/${roomId}`
      );

      if (!res.data.exists) return alert("Room does not exist!");

      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to check room");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#141414] p-8 rounded-2xl shadow-xl border border-[#2a2a2a]">
        <button
          onClick={createRoom}
          className="w-full mb-6 p-3 bg-green-600 hover:bg-green-700 transition rounded-xl font-semibold"
        >
          {creating ? "Creating..." : "Create New Room"}
        </button>

        <div className="space-y-4">
          <label className="text-gray-300 text-sm">Enter Room Number</label>
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-3 bg-[#0f0f0f] border border-[#333] rounded-xl text-white focus:border-blue-500 outline-none"
          />
        </div>

        <button
          onClick={joinRoom}
          className="w-full mt-6 p-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl font-semibold"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
