import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post("http://localhost:3000/api/signup", form, {
        withCredentials: true,
      });

      setMsg("Signup successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/"; 
      }, 1200);
    } catch (err) {
      setMsg(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg border border-[#333]">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h1>

        {msg && (
          <p className="text-center text-sm mb-3 text-red-400">{msg}</p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-300 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-[#0f0f0f] text-white rounded-xl border border-[#333] focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-[#0f0f0f] text-white rounded-xl border border-[#333] focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-[#0f0f0f] text-white rounded-xl border border-[#333] focus:border-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 p-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white font-semibold"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 cursor-pointer hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
