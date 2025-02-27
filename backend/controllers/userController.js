const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * @description Register a new user
 * @access      Public
 * @route       POST api/users
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // Check if user already exists
  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error("User already exists.");
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @description Login a user
 * @access      Public
 * @route       POST api/users/login
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Check if user and password match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid user credentials");
  }
});

/**
 * @description Get current user
 * @access      Private
 * @route       GET api/users/me
 */
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = req.user;
  res.status(200).json({ id: _id, name, email });
});

// Generate Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

module.exports = {
  registerUser,
  loginUser,
  getMe,
};