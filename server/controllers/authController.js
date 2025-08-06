const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library"); // Import OAuth2Client

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Initialize Google OAuth client

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Handle duplicate key error (e.g., username or email already exists)
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "User with this email or username already exists." });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.googleAuth = async (req, res) => {
  const { idToken } = req.body; // Expecting the ID token from the frontend

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload; // Extract user info

    // Check if user already exists in your DB
    let user = await User.findOne({ email });

    if (user) {
      // User exists, log them in
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // User does not exist, register them
      // For Google sign-up, we don't have a password. You might want to generate one
      // or mark them as a Google-signed-up user. For simplicity, we'll create with a placeholder.
      const newUsername = name || email.split("@")[0]; // Use name or part of email as username
      user = await User.create({
        username: newUsername,
        email,
        password: googleId, // Using googleId as a placeholder password (NOT SECURE for production)
        // In production, you'd mark them as OAuth user or generate a strong random password.
      });
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Google authentication failed" });
  }
};
