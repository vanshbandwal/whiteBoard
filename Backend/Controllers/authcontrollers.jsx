// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/User.js");
const Room = require("../Model/Room.js");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    await user.save();

    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, "SECRET_KEY", {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,       
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password} = req.body;

    if (!email || !password ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, "SECRET_KEY", { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


function generateRoomId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/create-room", async (req, res) => {
  try {
    let id = generateRoomId();

    while (await Room.findOne({ roomId: id })) {
      id = generateRoomId();
    }

    await Room.create({ roomId: id });

    return res.json({ roomId: id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/check-room/:roomId", async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });

  if (!room) return res.json({ exists: false });

  return res.json({ exists: true });
});




module.exports = router;
