import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/login",
        { email, password },
        { withCredentials: true } 
      );

      console.log("LOGIN:", res.data);
      alert("Login Successful");
      window.location.href = "/";


    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg border border-[#333]">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h1>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 bg-[#0f0f0f] text-white rounded-xl border border-[#333] focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-[#0f0f0f] text-white rounded-xl border border-[#333] focus:border-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 p-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span className="text-blue-400 cursor-pointer hover:underline">
           <a href="/signup">Sign Up</a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
