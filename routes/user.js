const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AuthResponse } = require("../utils/responses");

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
  try {
    let user = new User(req.body);
    await user.save();
    res
      .status(201)
      .send(AuthResponse.success(null, "User registered successfully."));
  } catch (err) {
    res.status(400).send(AuthResponse.failed(err.message));
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res
      .status(400)
      .send(AuthResponse.unauthorized("Invalid username or password."));
  }

  const token = jwt.sign(
    { _id: user._id, username: user.username },
    jwtSecret,
    { expiresIn: "1h" }
  );
  res.send(AuthResponse.success(token, "Login successful."));
});

module.exports = router;
